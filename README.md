# Aberturas Avenida

Web pública de Aberturas Avenida, Santa Fe.

## Superficies

- **Inicio**: entrada visual con dos recorridos.
- **Revisión**: flujo de 6 pasos para preparar una visita de medición.
- **Productos**: catálogo visual con pedido sin pago online.
- **WhatsApp**: contacto persistente y envío del carrito al número confirmado por el usuario.
- **Gestión**: vista interna disponible con `?owner=1`, fuera de la navegación pública.

## Principios

- Cero claims de IA.
- Cero pasarela de pago.
- El carrito arma una consulta; el cierre ocurre por WhatsApp.
- Los datos de medición del cliente son orientativos.
- La medición final se completa en obra.

## Web

https://aberturasavenida.simondalmasso44.workers.dev/

## Deploy

```bash
npx --yes wrangler@4.145.0 deploy --dry-run
npx --yes wrangler@4.145.0 deploy
```
