# Deploy

## Producción

Worker de Cloudflare: aberturasavenida

URL principal:
https://aberturasavenida.simondalmasso44.workers.dev/

El backend permanece en Cloudflare. Firebase Hosting sólo mantiene el redirect 302 de https://aberturas-avenida.web.app/; no se modifica como parte de este deploy.

## Preflight

Desde la raíz del repositorio, ejecutar:

- ./tests/ui-contract.ps1
- ./tests/images-contract.ps1
- ./tests/http-smoke.ps1
- npx --yes wrangler@4.145.0 deploy --dry-run

## Publicar

Ejecutar:

- npx --yes wrangler@4.145.0 deploy
- ./tests/http-smoke.ps1

Comprobar también que las imágenes principales respondan 200 con image/webp:

- /categories/puerta.webp
- /categories/ventana.webp
- /categories/porton.webp
- /products/puerta-placa.webp
- /products/ventana-corrediza-entera.webp

## QA visual

Validar en 320 px, 390 px y 1440 px. En móvil deben verse los dos recorridos de Inicio, el catálogo debe dividirse en Puertas y Ventanas, no debe existir overflow horizontal y el carrito debe abrir el mensaje de pedido en WhatsApp. No hay pasarela de pago.
