-- Notificaciones que manda Mercado Libre (reclamos, preguntas, ventas, mensajes...).
-- Solo se guardan: el contenido real se vuelve a pedir a la API con el token del vendedor.
create table if not exists public.ml_notificaciones (
  id bigint generated always as identity primary key,
  recibida_en timestamptz not null default now(),
  topic text not null,
  resource text not null,
  ml_user_id bigint not null,
  application_id bigint,
  attempts int,
  sent timestamptz,
  payload jsonb not null,
  procesada_en timestamptz,
  error_proceso text
);
-- ML reintenta la misma notificación: una sola fila por envío original
create unique index if not exists ml_notificaciones_unica
  on public.ml_notificaciones (topic, resource, ml_user_id, sent);
create index if not exists ml_notificaciones_pendientes
  on public.ml_notificaciones (recibida_en) where procesada_en is null;
alter table public.ml_notificaciones enable row level security;
