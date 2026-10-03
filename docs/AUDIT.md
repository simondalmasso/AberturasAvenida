# Auditoría 2026-10-02

## Producción

URL auditada:
https://aberturasavenida.simondalmasso44.workers.dev/

Version ID:
`1caee183-4bf5-418d-a08a-f9147e47eb7a`

## Resultado funcional

PASS:

- Home mobile-first sin overflow en 320, 390 y escritorio.
- Revisión y Productos visibles como decisiones principales.
- WhatsApp persistente.
- Catálogo y carrito de consulta.
- Checkout abre WhatsApp al +54 9 3425 23-6559.
- Cero cobro online.
- Revisión con 6 categorías.
- Estados LISTO, REVISIÓN TÉCNICA y SIN TURNO.
- Ficha con múltiples unidades y separación orientativo / medición final.
- Gestión fuera de la navegación pública.
- Cero claims de IA.

## SEO / indexación

Corregido:

- meta description.
- canonical.
- Open Graph.
- JSON-LD de negocio.
- `robots.txt` válido.
- `sitemap.xml`.
- `llms.txt`.
- rutas inexistentes ahora responden 404 real en lugar de soft-404.

Lighthouse:

| Métrica | Mobile | Desktop |
| --- | ---: | ---: |
| Accessibility | 100 | 100 |
| Best Practices | 96 | 96 |
| SEO | 100 | 100 |
| Agentic Browsing | 100 | 100 |

El único fallo residual de Lighthouse es un issue de DevTools marcado como Content Security Policy sin URL asociada. No aparece acompañado por un error funcional de la aplicación.

## Repo

- `main` es la fuente canónica.
- La copia local de trabajo no es un checkout Git; se usa sólo como staging.
- El código de `src/worker.js` se mantiene sincronizado con producción.
- Se agregó `firebase.json` para documentar/reproducir el redirect de Firebase.
- Se agregó `tests/http-smoke.ps1`.

## Deuda técnica

Las fotografías de catálogo/home todavía dependen de fuentes externas. Hoy cargan y el home usa CORS anónimo para evitar cookies de terceros en las imágenes críticas, pero para una versión comercial definitiva conviene reemplazarlas por fotografías propias del local/productos y servirlas desde infraestructura controlada por el proyecto.
