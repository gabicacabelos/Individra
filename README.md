# INDIVIDRA — sitio web

Sitio de [individratec.com](https://www.individratec.com): alertas de reclamos con plazo exacto y control del termómetro de reputación para vendedores de Mercado Libre, más el módulo Venta Blindada y la vertical de logística.

Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + Framer Motion. Deploy automático en Vercel desde `main`.

## Desarrollo

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

## Páginas

| Ruta | Contenido |
| --- | --- |
| `/` | Home: alertas de reclamos, calculadora de margen de color, propuesta comercial, FAQ y agenda (Calendly) |
| `/diagnostico` | Autodiagnóstico por plataforma (Mercado Libre, tienda propia, logística); envía el lead a `/api/diagnostico` |
| `/logistica` | Landing para logística y distribuidoras |
| `/ecommerce` | Landing multicanal (Mercado Libre, Tiendanube, Shopify, WhatsApp) |
| `/legal` | Términos y privacidad |

El sitemap se genera en `src/app/sitemap.ts`. Si agregás una página pública, sumala ahí.

## Estructura

```
src/
├── app/                 # Rutas, layout, sitemap y API
├── components/
│   ├── landing/         # Secciones de la home
│   ├── diagnostico/     # Flujo de /diagnostico y armado de la oferta
│   ├── logistica/       # Landing de /logistica
│   ├── ecommerce/       # Landing de /ecommerce
│   └── ui/              # Animaciones y piezas visuales compartidas
├── lib/                 # analytics, cálculo de reputación ML, utilidades
└── providers/           # PostHog + consentimiento de cookies
```

## Analítica (PostHog)

PostHog se inicializa solo si el visitante acepta cookies (`src/providers/PostHogProvider.tsx`). Los eventos se mandan con `trackEvent` de `src/lib/analytics.ts`.

`src/components/ConversionTracker.tsx` mide solo, en todo el sitio, los clics a:

| Evento | Cuándo |
| --- | --- |
| `whatsapp_clicked` | Cualquier link a `wa.me` |
| `email_clicked` | Cualquier link `mailto:` |
| `calendly_link_clicked` | Links directos a Calendly |
| `diagnostico_cta_clicked` | Cualquier link a `/diagnostico` |

Cada evento lleva `seccion` (el `id` de la sección donde está el link), `pagina`, `destino` y `texto` del botón. Para medir otro elemento, agregale `data-track="nombre_del_evento"`.

Además:

- `home_calculadora_usada` y `home_calculadora_cta_clicked`: uso de la calculadora de margen y clic en su CTA, con el color y el margen calculados.
- `calendly_horario_elegido` y `calendly_reunion_agendada`: avance dentro del calendario embebido.
- `diagnostico_*`: cada paso del autodiagnóstico, hasta `diagnostico_contacto` cuando deja sus datos.
