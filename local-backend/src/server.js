import crypto from "node:crypto";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import { rateLimit } from "express-rate-limit";
import db, { audit } from "./db.js";

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 8788);
const SESSION_SECRET = process.env.SESSION_SECRET || "";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";
const COOKIE_NAME = "aa_session";
const SESSION_TTL_SECONDS = 8 * 60 * 60;

if (process.env.NODE_ENV === "production") {
  if (HOST !== "127.0.0.1" && HOST !== "::1") {
    throw new Error("Production default must bind to loopback until remote access is explicitly reviewed.");
  }
  if (SESSION_SECRET.length < 64) throw new Error("SESSION_SECRET must contain at least 64 characters.");
  if (!/^\$2[aby]\$/.test(ADMIN_PASSWORD_HASH)) throw new Error("ADMIN_PASSWORD_HASH must be a bcrypt hash.");
}

const app = express();
app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "64kb", strict: true }));
app.use(cookieParser());
app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: "draft-8", legacyHeaders: false }));

function sign(value) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("base64url");
}
function safeEqual(a, b) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}
function issueSession() {
  const payload = Buffer.from(JSON.stringify({ sub: "owner", exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS })).toString("base64url");
  return payload + "." + sign(payload);
}
function requireAuth(req, res, next) {
  try {
    const token = req.cookies[COOKIE_NAME] || "";
    const [payload, signature, extra] = token.split(".");
    if (!payload || !signature || extra || !safeEqual(signature, sign(payload))) return res.status(401).json({ error: "authentication_required" });
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (session.sub !== "owner" || !Number.isInteger(session.exp) || session.exp < Date.now() / 1000) return res.status(401).json({ error: "session_expired" });
    req.actor = session.sub;
    next();
  } catch {
    return res.status(401).json({ error: "authentication_required" });
  }
}
function checkSameOrigin(req, res, next) {
  const origin = req.get("origin");
  if (origin) {
    try {
      const parsed = new URL(origin);
      const allowed = new Set([ `http://127.0.0.1:${PORT}`, `http://localhost:${PORT}` ]);
      if (!allowed.has(parsed.origin)) return res.status(403).json({ error: "origin_not_allowed" });
    } catch {
      return res.status(403).json({ error: "origin_not_allowed" });
    }
  }
  next();
}
function validText(value, max = 500) {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= max;
}
function orderNumber() {
  const day = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `AA-${day}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

app.get("/healthz", (_req, res) => res.json({ ok: true, service: "aberturas-avenida-local", persistence: "sqlite", mode: "local-only" }));

app.post("/api/auth/login", rateLimit({ windowMs: 15 * 60_000, limit: 8, standardHeaders: "draft-8", legacyHeaders: false }), checkSameOrigin, async (req, res) => {
  const password = req.body?.password;
  if (typeof password !== "string" || !ADMIN_PASSWORD_HASH || !(await bcrypt.compare(password, ADMIN_PASSWORD_HASH))) {
    return res.status(401).json({ error: "invalid_credentials" });
  }
  res.cookie(COOKIE_NAME, issueSession(), {
    httpOnly: true,
    sameSite: "strict",
    secure: false, // Loopback-only HTTP for initial local setup; set true behind verified HTTPS.
    maxAge: SESSION_TTL_SECONDS * 1000,
    path: "/"
  });
  audit({ actor: "owner", action: "login", entityType: "session" });
  res.json({ ok: true, expiresInSeconds: SESSION_TTL_SECONDS });
});

app.post("/api/auth/logout", checkSameOrigin, (_req, res) => {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: "strict", secure: false, path: "/" });
  res.status(204).end();
});

app.get("/api/orders", requireAuth, (req, res) => {
  const status = typeof req.query.status === "string" ? req.query.status : null;
  const rows = status
    ? db.prepare("SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC LIMIT 200").all(status)
    : db.prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 200").all();
  res.json({ items: rows });
});

app.get("/api/orders/:id", requireAuth, (req, res) => {
  const order = db.prepare("SELECT * FROM orders WHERE id = ? OR order_number = ?").get(req.params.id, req.params.id);
  if (!order) return res.status(404).json({ error: "not_found" });
  order.items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(order.id);
  res.json(order);
});

app.patch("/api/orders/:id/status", requireAuth, checkSameOrigin, (req, res) => {
  const allowed = new Set(["received", "pending_confirmation", "confirmed", "preparing", "dispatched", "delivered", "cancelled"]);
  const status = req.body?.status;
  if (!allowed.has(status)) return res.status(400).json({ error: "invalid_status" });
  const order = db.prepare("SELECT id FROM orders WHERE id = ? OR order_number = ?").get(req.params.id, req.params.id);
  if (!order) return res.status(404).json({ error: "not_found" });
  db.prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status, order.id);
  audit({ actor: req.actor, action: "status_changed", entityType: "order", entityId: order.id, metadata: { status } });
  res.json({ ok: true, id: order.id, status });
});

app.get("/api/repairs", requireAuth, (req, res) => {
  const status = typeof req.query.status === "string" ? req.query.status : null;
  const rows = status
    ? db.prepare("SELECT * FROM repairs WHERE status = ? ORDER BY created_at DESC LIMIT 200").all(status)
    : db.prepare("SELECT * FROM repairs ORDER BY created_at DESC LIMIT 200").all();
  res.json({ items: rows });
});

app.post("/api/repairs", requireAuth, checkSameOrigin, (req, res) => {
  const b = req.body || {};
  if (!validText(b.customer_name, 160) || !validText(b.description, 2000)) return res.status(400).json({ error: "customer_name_and_description_required" });
  const id = crypto.randomUUID();
  const number = `REP-${new Date().toISOString().slice(0,10).replaceAll("-","")}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  db.prepare(`INSERT INTO repairs (id, repair_number, customer_name, customer_phone, address, description, measurements_notes, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
      id, number, b.customer_name.trim(),
      validText(b.customer_phone, 50) ? b.customer_phone.trim() : null,
      validText(b.address, 300) ? b.address.trim() : null,
      b.description.trim(),
      validText(b.measurements_notes, 1000) ? b.measurements_notes.trim() : null,
      validText(b.notes, 2000) ? b.notes.trim() : null
    );
  audit({ actor: req.actor, action: "created", entityType: "repair", entityId: id, metadata: { repair_number: number } });
  res.status(201).json({ id, repair_number: number, status: "new" });
});

app.get("/api/ledger", requireAuth, (_req, res) => {
  const items = db.prepare("SELECT * FROM ledger_entries ORDER BY occurred_at DESC LIMIT 500").all();
  res.json({ items });
});

app.get("/api/audit-log", requireAuth, (_req, res) => {
  const items = db.prepare("SELECT id, actor, action, entity_type, entity_id, metadata_json, created_at FROM audit_log ORDER BY created_at DESC LIMIT 500").all();
  res.json({ items });
});

app.use((err, _req, res, _next) => {
  console.error("request_error", { name: err?.name || "Error", message: "Request failed" });
  res.status(500).json({ error: "internal_error" });
});

app.listen(PORT, HOST, () => {
  console.log(`Aberturas Avenida local backend listening on http://${HOST}:${PORT}`);
});
