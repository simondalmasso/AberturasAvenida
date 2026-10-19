import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const dataDir = path.resolve(process.env.DATA_DIR || "./data");
fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, "aberturas-avenida.sqlite"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.pragma("busy_timeout = 5000");

db.exec(`
CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY,
  applied_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_id TEXT REFERENCES customers(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT,
  status TEXT NOT NULL DEFAULT 'received'
    CHECK (status IN ('received','pending_confirmation','confirmed','preparing','dispatched','delivered','cancelled')),
  currency TEXT NOT NULL DEFAULT 'ARS',
  subtotal_cents INTEGER,
  notes TEXT,
  whatsapp_status TEXT NOT NULL DEFAULT 'not_opened'
    CHECK (whatsapp_status IN ('not_opened','link_created','customer_sent_unverified','confirmed_by_business')),
  idempotency_key TEXT UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_code TEXT,
  product_name TEXT NOT NULL,
  variant TEXT,
  width_mm INTEGER,
  height_mm INTEGER,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER,
  line_total_cents INTEGER
);
CREATE TABLE IF NOT EXISTS repairs (
  id TEXT PRIMARY KEY,
  repair_number TEXT NOT NULL UNIQUE,
  customer_id TEXT REFERENCES customers(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  address TEXT,
  description TEXT NOT NULL,
  measurements_notes TEXT,
  diagnosis TEXT,
  quote_cents INTEGER,
  currency TEXT NOT NULL DEFAULT 'ARS',
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new','inspection_scheduled','quoted','approved','in_progress','waiting_parts','completed','cancelled')),
  scheduled_at TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS ledger_entries (
  id TEXT PRIMARY KEY,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('deposit','payment','expense','adjustment')),
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  currency TEXT NOT NULL DEFAULT 'ARS',
  order_id TEXT REFERENCES orders(id),
  repair_id TEXT REFERENCES repairs(id),
  description TEXT NOT NULL,
  occurred_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS supplier_prices (
  id TEXT PRIMARY KEY,
  supplier_name TEXT NOT NULL,
  source_filename TEXT NOT NULL,
  source_date TEXT,
  product_code TEXT,
  product_name TEXT NOT NULL,
  variant TEXT,
  width_mm INTEGER,
  height_mm INTEGER,
  finish TEXT,
  price_cents INTEGER,
  currency TEXT NOT NULL DEFAULT 'ARS',
  vat_included INTEGER NOT NULL DEFAULT 0 CHECK (vat_included IN (0,1)),
  review_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (review_status IN ('pending','matched','approved','rejected')),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_repairs_status ON repairs(status);
CREATE INDEX IF NOT EXISTS idx_ledger_occurred_at ON ledger_entries(occurred_at DESC);
INSERT OR IGNORE INTO schema_migrations(version) VALUES (1);
`);

export function audit({ actor, action, entityType, entityId = null, metadata = {} }) {
  db.prepare(`
    INSERT INTO audit_log (id, actor, action, entity_type, entity_id, metadata_json)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(crypto.randomUUID(), actor, action, entityType, entityId, JSON.stringify(metadata));
}

export default db;
