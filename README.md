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
| `/` | Home: alertas de reclamos, calculadora de margen de color, piloto y precios, FAQ y contacto (Calendly embebido en desktop) |
| `/diagnostico` | Autodiagnóstico por plataforma (Mercado Libre, cobro por WhatsApp, logística); envía el lead a `/api/diagnostico`. Es `noindex`: se entra desde la home y /logistica |
| `/logistica` | Landing para logística y distribuidoras, con calculadora de entregas fallidas en desktop |
| `/legal` | Términos y privacidad |
| `/conectar/[piloto]` | Link para que un cliente del piloto conecte su cuenta de Mercado Libre. No vence: el intento de autorización se genera al tocar el botón. Es `noindex` |
| `/conectar/resultado` | Cómo terminó la conexión (`?estado=listo`, `otra_cuenta`, `cancelado`, `vencido`, `invalido` o `error`) |

`/ecommerce` redirige a la home (`next.config.ts`).

El sitemap se genera en `src/app/sitemap.ts` y lista solo páginas indexables. Si agregás una página pública, sumala ahí.

### Una sola versión por página

Cada página se escribe una vez y se adapta: hasta 1023px (celular y tablet) es una columna compacta; desde 1024px (`lg:`) pasa a columnas. No hay DOM duplicado mobile/desktop: si cambiás un texto, cambia en todos los tamaños.

## Estructura

```
src/
├── app/                 # Rutas, layout, sitemap y API
├── components/
│   ├── sitio/           # Home, navbar, calculadora de margen, Calendly y piezas compartidas (shared.tsx)
│   ├── diagnostico/     # Flujo de /diagnostico y armado de la oferta
│   ├── logistica/       # Landing de /logistica y calculadora de entregas fallidas
│   └── ui/              # Animaciones y piezas visuales compartidas
├── lib/                 # analytics, cálculo de reputación ML, utilidades
└── providers/           # PostHog + consentimiento de cookies
```

## Documentación de producto

- `docs/validacion/matriz-promesas.md`: cada promesa de la web, con la API que la sostiene, la evidencia y lo que falta probar. Actualizala cuando cambie un texto de la web o se valide algo.
- `docs/whatsapp/plantillas.md`: plantillas de WhatsApp para aprobar en Meta, con sus reglas y costos.

## Backend (Supabase)

`supabase/` tiene el código de lo que corre en el proyecto de Supabase `individra-ml-tokens`: las migraciones de la base y las funciones (Deno). No se publica con Vercel: cada función se sube aparte y lo que está en el repo tiene que ser igual a lo publicado.

| Función | Qué hace |
| --- | --- |
| `ml-conectar` | Arranca la conexión de un piloto: genera el state y el PKCE y manda a Mercado Libre |
| `ml-callback` | Recibe la autorización de Mercado Libre y guarda los tokens. No reemplaza una cuenta conectada por otra distinta |
| `ml-refresh` | Renueva los tokens de todas las cuentas (pg_cron, cada hora) |
| `ml-notificaciones` | Recibe las notificaciones de Mercado Libre y las guarda |
| `ml-stock` | Descuenta stock sin pisar ventas de Mercado Libre (Venta Blindada) |

Para dar de alta un piloto se agrega una fila en `pilotos` con un código aleatorio de 22 caracteres (por ejemplo, `secrets.token_urlsafe(16)` en Python) y su `account_label`; el link es `https://www.individratec.com/conectar/{codigo}`.

```bash
deno test --config supabase/functions/deno.json supabase/functions
deno lint --config supabase/functions/deno.json supabase/functions
```

## Analítica (PostHog)

PostHog se descarga e inicializa solo si el visitante acepta cookies (`src/providers/PostHogProvider.tsx`); sin consentimiento, `trackEvent` (`src/lib/analytics.ts`) no manda nada.

`src/components/ConversionTracker.tsx` mide solo, en todo el sitio, los clics a:

| Evento | Cuándo |
| --- | --- |
| `whatsapp_clicked` | Cualquier link a `wa.me` |
| `email_clicked` | Cualquier link `mailto:` |
| `calendly_link_clicked` | Links directos a Calendly |
| `diagnostico_cta_clicked` | Cualquier link a `/diagnostico` |

Cada evento lleva `seccion` (el `id` de la sección donde está el link), `pagina`, `destino` y `texto` del botón. Para medir otro elemento, agregale `data-track="nombre_del_evento"`.

Además:

- `bloque_visto`: hasta qué bloque (`data-bloque`) llega cada visita, con `bloque`, `pagina` y `vista` (`mobile` o `desktop`).
- `sticky_cta_clicked`: clic en la barra fija de abajo (celular y tablet).
- `home_calculadora_usada` y `home_calculadora_cta_clicked`: uso de la calculadora de margen y clic en su CTA, con el color, el margen calculado y `vista`.
- `logistica_calculadora_usada`: primer uso de la calculadora de entregas fallidas en /logistica (desktop).
- `calendly_horario_elegido` y `calendly_reunion_agendada`: avance dentro del calendario embebido; `seccion` dice dónde (`contacto`, `logistica_contacto`, `diagnostico_listo`).
- `diagnostico_*`: cada paso del autodiagnóstico, hasta `diagnostico_contacto` cuando deja sus datos.
