# Aberturas Avenida

Aplicación web para preparar una visita de medición antes de coordinarla.

## Estado

- Cliente: flujo de 6 pasos con foto, medidas orientativas y datos de acceso.
- Reglas determinísticas: **LISTO**, **REVISIÓN TÉCNICA** y **SIN TURNO**.
- Horarios simulados según duración requerida.
- Vista Dueño con visitas preparadas.
- Ficha de Medición A4 imprimible.
- Deploy público en Cloudflare Workers.

## Web

https://aberturasavenida.simondalmasso44.workers.dev/

## Principio central

Los datos informados por el cliente son **orientativos**. La **medición final en obra** queda separada y se completa por el técnico.

## Estructura

- `src/worker.js`: aplicación y Worker de Cloudflare.
- `wrangler.jsonc`: configuración de deploy.
- `docs/`: decisiones de producto, reglas y fuentes de assets.
- `evidence/`: capturas de QA de la versión publicada.
- `archive/`: snapshots históricos útiles.

## Deploy

```bash
npx wrangler deploy
```

No se incluyen credenciales ni secretos en el repositorio.
