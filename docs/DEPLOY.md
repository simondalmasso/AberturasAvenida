# Deploy

## Requisitos

- Node.js
- cuenta Cloudflare autorizada para Workers

## Verificar bundle

npx --yes wrangler@4.145.0 deploy --dry-run

## Publicar

npx --yes wrangler@4.145.0 deploy

Worker: aberturasavenida

URL pública:
https://aberturasavenida.simondalmasso44.workers.dev/

## Última versión verificada

Version ID desplegado el 2 de octubre de 2026:
c9220ff2-9e1d-4d70-92e2-4a953e67b45a

## Smoke checks

- HTTP 200.
- 6 categorías con imagen cargada.
- CTA Continuar deshabilitado sin selección.
- LISTO muestra horarios compatibles.
- REVISIÓN TÉCNICA no muestra horarios.
- SIN TURNO no muestra horarios y aclara que no es revisión técnica.
- Vista Dueño abre Ficha de Medición.
- Sin overflow horizontal a 320 px y 390 px.
