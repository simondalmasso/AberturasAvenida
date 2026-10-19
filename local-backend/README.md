# Aberturas Avenida — backend local (foundation)

This is an isolated development foundation. It does not replace the Cloudflare Worker and is not yet connected to the public checkout.

## Safety boundary

- Binds to 127.0.0.1 by default.
- No router port forwarding and no public tunnel in this phase.
- Administrative endpoints require a signed session.
- The real .env and SQLite database are excluded from Git.
- Do not use real customer or accounting data until backup/restore and access-control tests are completed.
- The public website must not call this API directly from browsers over the Internet. Browser-held secrets are not secrets.
- WhatsApp delivery is not verified by this backend. A wa.me link only opens a draft for the customer to send.

## Requirements

- Windows 10/11, supported Node.js 22 LTS release, and npm.
- Verify memory and disk space on the shop PC before enabling continuous operation.

## Local setup (PowerShell)

1. Copy `.env.example` to `.env`.
2. Generate a random secret:
   `node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"`
3. Generate a bcrypt hash without putting the real password in shell history. In PowerShell, use a temporary environment variable for the password and remove it after hashing. Do not commit `.env`.
4. Set `SESSION_SECRET` and `ADMIN_PASSWORD_HASH` in `.env`.
5. Install dependencies with `npm ci` after `package-lock.json` has been generated and reviewed; for initial setup run `npm install` and commit the lockfile.
6. Run `npm run check`, then `npm test`, then `npm start`.
7. Verify `http://127.0.0.1:8788/healthz`.

The server refuses to start in production mode with missing/weak session configuration or a missing bcrypt hash. Do not expose it beyond loopback before the remote-access architecture is reviewed.

## Initial API surface

- `GET /healthz`: health only; no business data.
- `POST /api/auth/login`: session login.
- `POST /api/auth/logout`: clear session.
- `GET /api/orders`, `GET /api/orders/:id`: authenticated read.
- `PATCH /api/orders/:id/status`: authenticated order state transition.
- `GET /api/repairs`, `POST /api/repairs`: authenticated repair records.
- `GET /api/ledger`: authenticated ledger read.
- `GET /api/audit-log`: authenticated audit trail read.

Order creation from the public website, order-item insertion UI, supplier price import, payment write operations, attachment storage, CSRF token workflow, remote TLS cookie hardening, backup/restore automation, and full automated tests are not yet implemented. Treat this as a foundation, not production-ready CRM.

## Data

SQLite is stored at `DATA_DIR/aberturas-avenida.sqlite`, outside the source files. Keep database files on a local disk, not a network share. Backups must use SQLite's online backup mechanism or a consistent snapshot; do not copy only the main database file while WAL is active.

## Project integration

The public app remains in `src/worker.js` and `public/`. Changes here are intentionally isolated under `local-backend/`. Do not deploy this folder to Cloudflare and do not merge to `main` until tests, security review, backup/restore drills, and shop-PC validation pass.
