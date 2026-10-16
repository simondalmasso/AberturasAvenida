# QA

Cobertura requerida para release:

- Home visual en 320 px, 390 px y 1440 px.
- En 390 px, Revisión y Productos aparecen en el primer viewport.
- Dos recorridos principales: Revisión / Productos.
- Catálogo con filtros Todos / Puertas / Ventanas y encabezados explícitos por grupo.
- Todos los productos tienen exactamente uno de los grupos Puertas o Ventanas.
- Sin acceso público a Gestión.
- Botón de WhatsApp persistente.
- Catálogo con 10 productos reales/de referencia y carrito local con suma/resta de cantidades.
- Checkout abre WhatsApp al +54 9 3425 23-6559.
- Ningún pago se procesa en la web.
- Revisión conserva seis categorías, medidas por unidad y tres estados.
- Ficha A4 separa datos orientativos de medición final.
- Sin claims de IA.
- Sin overflow horizontal.
- Todos los assets de productos y categorías se sirven localmente desde Cloudflare Worker Assets.
- tests/images-contract.ps1 confirma que no haya referencias externas en catálogo/categorías y que todos los archivos referenciados existan.
- /robots.txt, /sitemap.xml, /llms.txt y /health responden con tipos correctos.
- Rutas inexistentes responden 404 y no una home 200.
- Meta description, canonical, Open Graph y JSON-LD presentes.

## Evidencia de validación local — 2026-10-16

- Node syntax check: PASS.
- tests/ui-contract.ps1: PASS.
- tests/images-contract.ps1: PASS; 14 imágenes locales referenciadas.
- Wrangler deploy --dry-run: PASS; 18 assets leídos.
- Playwright en 320 px y 390 px: 10 productos, 6 Puertas y 4 Ventanas; todas las imágenes cargan; sin overflow horizontal.
- Playwright en 1440 px: catálogo renderizado sin overflow.
- Revisión: las seis imágenes de categorías cargan; el botón persistente de WhatsApp está visible en Inicio, Revisión y Productos.
- Carrito: agregar producto abre el pedido; checkout dirige a WhatsApp al número comercial 5493425236559 e incluye una aclaración explícita de que no hubo pago web.
- Errores de consola y excepciones de página en las pruebas Playwright: 0.
- Smoke HTTP previo al release sobre producción: /, /health, /robots.txt, /sitemap.xml y /llms.txt responden 200 con tipos esperados; ruta inexistente responde 404. Repetir este smoke después del despliegue.
