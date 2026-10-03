# Deploy

## Producción principal

Cloudflare Worker: `aberturasavenida`

URL:
https://aberturasavenida.simondalmasso44.workers.dev/

## Verificar

```bash
npx --yes wrangler@4.145.0 deploy --dry-run
```

```powershell
./tests/ui-contract.ps1
./tests/http-smoke.ps1
```

## Publicar

```bash
npx --yes wrangler@4.145.0 deploy
```

Después del deploy se vuelve a ejecutar el smoke test y QA visual en 320/390/1440.

## Firebase

`https://aberturas-avenida.web.app/` se usa únicamente como redirect 302 hacia el Worker. No aloja backend ni proxy. La configuración reproducible está en `firebase.json`.

## Última versión verificada

- Fecha: 2026-10-02
- Cloudflare Version ID: `1caee183-4bf5-418d-a08a-f9147e47eb7a`
- Smoke HTTP: PASS
- Lighthouse mobile: Accessibility 100 / Best Practices 96 / SEO 100 / Agentic Browsing 100
- Lighthouse desktop: Accessibility 100 / Best Practices 96 / SEO 100 / Agentic Browsing 100
