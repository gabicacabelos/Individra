-- Link de conexión de cada piloto: www.individratec.com/conectar/{codigo}. No vence mientras el
-- piloto esté activo; el state de Mercado Libre se genera recién cuando la persona toca el botón.
create table if not exists public.pilotos (
  codigo text primary key check (codigo ~ '^[A-Za-z0-9_-]{16,64}$'),
  account_label text not null unique,
  nombre text not null,
  activo boolean not null default true,
  vence_en timestamptz,
  creado timestamptz not null default now()
);
alter table public.pilotos enable row level security;

-- 'piloto': ml-callback redirige a la página del sitio en vez de responder en texto
alter table public.oauth_states add column if not exists origen text;
