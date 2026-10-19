# Aberturas Avenida — CRM prototype

## What this is
A standalone, dependency-free HTML prototype at `crm/index.html` for reviewing the intended internal CRM experience: summary, orders, customer list, repairs, cash register, supplier prices, and activity.

## Run locally
Open `crm/index.html` directly in a browser. No build, npm install, API call, third-party asset, Cloudflare resource, or network connection is required.

## Current behavior
- Search and filter sample orders.
- Add sample orders and contacts to the current page session.
- Navigate between dashboard sections.
- Responsive light UI and reduced-motion support.

## Explicit limitations
- All displayed records are fictitious.
- Changes live only in browser memory and disappear on reload.
- No authentication, authorization, server persistence, real customer/order data, WhatsApp sending, or accounting logic is connected.
- Cash, supplier price import, repair creation, and audit history are placeholders.
- Do not publish this prototype as an operational CRM or enter personal/commercial data.

## Next implementation steps
1. Review the UI and navigation.
2. Add automated HTML/JS and responsive smoke checks.
3. Integrate with the isolated local backend only after API, auth, CSRF, idempotency, and persistence tests pass.
4. Decide how the PC-based backend will be securely reachable before connecting any public customer intake.
5. Validate backup/restore and access controls before handling real records.

This branch does not change the Cloudflare Worker configuration and must not be deployed automatically.
