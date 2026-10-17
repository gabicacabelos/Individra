-- Usuarios de prueba de Mercado Libre (ML no permite borrarlos ni recuperar la clave: se guarda acá al crearlos).
-- Sin políticas RLS: solo la clave de servicio puede leer o escribir.
create table if not exists public.ml_test_users (
  account_label text primary key,
  rol text not null check (rol in ('vendedor', 'comprador')),
  ml_user_id bigint not null,
  nickname text not null,
  password text not null,
  email text,
  site_id text not null default 'MLA',
  created_at timestamptz not null default now()
);
alter table public.ml_test_users enable row level security;
comment on table public.ml_test_users is 'Usuarios de prueba de ML. ML los borra tras 60 dias sin actividad.';
