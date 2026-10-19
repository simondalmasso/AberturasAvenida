import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

test("SQLite schema initializes and audit rows persist", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "aa-local-backend-"));
  process.env.DATA_DIR = dir;
  const { default: db, audit } = await import("../src/db.js?test=" + crypto.randomUUID());
  assert.equal(db.prepare("SELECT count(*) AS n FROM schema_migrations").get().n, 1);
  audit({ actor: "test", action: "created", entityType: "test", entityId: "id-1" });
  assert.equal(db.prepare("SELECT count(*) AS n FROM audit_log WHERE entity_id = ?").get("id-1").n, 1);
  db.close();
  fs.rmSync(dir, { recursive: true, force: true });
});
