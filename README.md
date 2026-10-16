# Aberturas Avenida

Web pública de Aberturas Avenida, Santa Fe.

## Superficies
- **Inicio:** entrada mobile-first con dos recorridos.
- **Revisión:** flujo de seis pasos para preparar una visita de medición.
- **Productos:** catálogo visual dividido en **Puertas** y **Ventanas**, con carrito de consulta y sin pago online.
- **WhatsApp:** contacto persistente y envío del pedido al número comercial.
- **Gestión:** vista interna disponible con ?owner=1, fuera de la navegación pública.

## Principios
- Sin claims de IA.
- Sin pasarela de pago.
- El carrito arma una consulta; el cierre ocurre por WhatsApp.
- Las medidas informadas por el cliente son orientativas.
- La medición final se completa en obra.
- Las imágenes del catálogo se sirven desde public/ como assets de Cloudflare.
- Procedencia y límites de las imágenes: docs/IMAGE_PROVENANCE.md.

## Producción
- Principal: https://aberturasavenida.simondalmasso44.workers.dev/
- Redirect: https://aberturas-avenida.web.app/

El backend permanece en Cloudflare. Firebase Hosting sólo mantiene el redirect 302 documentado en firebase.json.

## QA
Ejecutar tests/ui-contract.ps1, tests/images-contract.ps1 y tests/http-smoke.ps1.

## Deploy
Ejecutar Wrangler en modo dry-run, correr los tests y publicar con Wrangler.
