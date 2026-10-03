# Aberturas Avenida

Web pública de Aberturas Avenida, Santa Fe.

## Superficies

- **Inicio**: entrada visual mobile-first con dos recorridos.
- **Revisión**: flujo de 6 pasos para preparar una visita de medición.
- **Productos**: catálogo visual con carrito de consulta, sin pago online.
- **WhatsApp**: contacto persistente y envío del pedido al número comercial.
- **Gestión**: vista interna disponible con `?owner=1`, fuera de la navegación pública.

## Principios

- Cero claims de IA.
- Cero pasarela de pago.
- El carrito arma una consulta; el cierre ocurre por WhatsApp.
- Las medidas informadas por el cliente son orientativas.
- La medición final se completa en obra.

## Producción

- Principal: https://aberturasavenida.simondalmasso44.workers.dev/
- Redirect: https://aberturas-avenida.web.app/

El backend permanece en Cloudflare. Firebase Hosting sólo mantiene el redirect 302 documentado en `firebase.json`.

## QA

```powershell
./tests/ui-contract.ps1
./tests/http-smoke.ps1
```

## Deploy

```bash
npx --yes wrangler@4.145.0 deploy --dry-run
npx --yes wrangler@4.145.0 deploy
```
