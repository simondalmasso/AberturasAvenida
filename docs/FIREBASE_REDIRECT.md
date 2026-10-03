# Firebase redirect

Firebase Hosting no ejecuta backend para este proyecto.

- Site ID: `aberturas-avenida`
- URL: https://aberturas-avenida.web.app/
- Acción: redirect HTTP 302
- Destino: https://aberturasavenida.simondalmasso44.workers.dev
- Plan: Spark
- Backend: permanece en Cloudflare Worker

La barra del navegador cambia al dominio `workers.dev` porque esto es un redirect real, no un reverse proxy.
