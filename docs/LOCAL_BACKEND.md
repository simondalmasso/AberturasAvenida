# Local backend — architecture and rollout

Status: foundation in an isolated feature branch; not connected to production.

## Current production boundary

The public application continues to run on Cloudflare Workers. This local service is an independent Node.js + SQLite service intended for the shop PC. The first stage is loopback-only and must not be exposed to the Internet.

## Rollout stages

1. Review and test the isolated backend on a development machine.
2. At the shop, inspect Windows version, RAM, free disk, power/sleep behavior, account permissions, and backup destination.
3. Install Node.js LTS and configure a dedicated data directory outside the repository.
4. Set a strong session secret and bcrypt password hash in a local-only .env file.
5. Run health, authentication, persistence, restart, access-control, backup, and restore tests with fictitious data.
6. Choose availability design:
   - LAN-only CRM if local use is sufficient.
   - An authenticated outbound tunnel only if the PC will be kept online and the dependency on the tunnel provider is accepted.
   - A durable public ingress queue if the public website must accept orders while the shop PC is offline.
7. Connect the checkout only after idempotency, queue/retry behavior, privacy, and WhatsApp draft tests pass.
8. Promote to production only after explicit review and a rollback plan.

## Non-goals in this foundation

No public API, no tunnel, no router port forwarding, no payment processor, no automatic WhatsApp delivery, no supplier PDF importer, no production database, and no claim of production readiness.

## Required release gates

- Existing public UI/image/HTTP contract tests pass.
- Login and authorization tests pass.
- Orders survive process and Windows restarts.
- Duplicate requests are idempotent.
- SQLite backup can be restored to a clean location.
- No unauthorized endpoint exposes customer or ledger data.
- WhatsApp status is not represented as sent unless independently confirmed.
- Existing Cloudflare production remains unchanged and a rollback is documented.
