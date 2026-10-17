-- Tokens de Mercado Libre de la app Individra. Solo el servidor (service role) los lee/escribe.
create table public.oauth_tokens (
  account_label text primary key,
  ml_user_id bigint,
  access_token text not null,
  refresh_token text not null,
  scope text,
  expires_at timestamptz not null,
  refreshing_until timestamptz,
  last_refresh_error text,
  updated_at timestamptz not null default now()
);

-- "state" de un solo uso para el link de autorización (evita que se cuele otra cuenta)
create table public.oauth_states (
  state text primary key,
  account_label text not null,
  created_at timestamptz not null default now(),
  used_at timestamptz
);

alter table public.oauth_tokens enable row level security;
alter table public.oauth_states enable row level security;
-- Sin políticas: anon y authenticated no pueden leer nada. El service role las saltea.
revoke all on public.oauth_tokens from anon, authenticated;
revoke all on public.oauth_states from anon, authenticated;

-- Toma el "turno" de renovación: solo un proceso por vez (el refresh_token de ML es de un solo uso)
create or replace function public.ml_claim_refresh(p_label text, p_margin interval default interval '150 minutes')
returns table (refresh_token text)
language sql
security definer
set search_path = public
as $$
  update public.oauth_tokens t
     set refreshing_until = now() + interval '2 minutes'
   where t.account_label = p_label
     and t.expires_at < now() + p_margin
     and (t.refreshing_until is null or t.refreshing_until < now())
  returning t.refresh_token;
$$;
revoke all on function public.ml_claim_refresh(text, interval) from public, anon, authenticated;
