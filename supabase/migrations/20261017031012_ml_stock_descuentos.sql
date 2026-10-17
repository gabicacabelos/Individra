-- Venta Blindada: cada descuento de stock en Mercado Libre, una sola vez por referencia
-- (por ejemplo, el id del comprobante confirmado), con lo que se leyó y escribió.
create table if not exists public.ml_stock_descuentos (
  id bigint generated always as identity primary key,
  referencia text not null unique,
  account_label text not null,
  item_id text not null,
  cantidad int not null check (cantidad > 0),
  estado text not null default 'en_curso',
  motivo text,
  via text,
  disponible_antes int,
  vendidas_antes int,
  escrito int,
  disponible_final int,
  ventas_pisadas int not null default 0,
  pasos jsonb,
  creado timestamptz not null default now(),
  terminado timestamptz
);
alter table public.ml_stock_descuentos enable row level security;

-- Un descuento por vez para cada producto. El bloqueo vence solo por si la función se corta.
create table if not exists public.ml_stock_bloqueos (
  clave text primary key,
  dueno text not null,
  hasta timestamptz not null
);
alter table public.ml_stock_bloqueos enable row level security;

create or replace function public.ml_tomar_bloqueo(p_clave text, p_dueno text, p_segundos int)
returns boolean
language plpgsql security definer set search_path = public as $$
begin
  insert into ml_stock_bloqueos (clave, dueno, hasta)
  values (p_clave, p_dueno, now() + make_interval(secs => p_segundos))
  on conflict (clave) do update set dueno = excluded.dueno, hasta = excluded.hasta
  where ml_stock_bloqueos.hasta < now();
  return found;
end $$;

create or replace function public.ml_soltar_bloqueo(p_clave text, p_dueno text)
returns void
language sql security definer set search_path = public as $$
  delete from ml_stock_bloqueos where clave = p_clave and dueno = p_dueno;
$$;

revoke all on function public.ml_tomar_bloqueo(text, text, int) from public, anon, authenticated;
revoke all on function public.ml_soltar_bloqueo(text, text) from public, anon, authenticated;
grant execute on function public.ml_tomar_bloqueo(text, text, int) to service_role;
grant execute on function public.ml_soltar_bloqueo(text, text) to service_role;
