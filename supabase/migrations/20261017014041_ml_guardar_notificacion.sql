-- Guarda una notificación en un solo viaje a la base (ML exige responder en menos de 500 ms).
-- Devuelve false si la cuenta no está conectada.
create or replace function public.ml_guardar_notificacion(
  p_topic text, p_resource text, p_ml_user_id bigint, p_application_id bigint,
  p_attempts int, p_sent timestamptz, p_payload jsonb
) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from oauth_tokens where ml_user_id = p_ml_user_id) then
    return false;
  end if;
  insert into ml_notificaciones (topic, resource, ml_user_id, application_id, attempts, sent, payload)
  values (p_topic, p_resource, p_ml_user_id, p_application_id, p_attempts, p_sent, p_payload)
  on conflict (topic, resource, ml_user_id, sent) do nothing;
  return true;
end $$;
revoke all on function public.ml_guardar_notificacion(text, text, bigint, bigint, int, timestamptz, jsonb) from public, anon, authenticated;
grant execute on function public.ml_guardar_notificacion(text, text, bigint, bigint, int, timestamptz, jsonb) to service_role;
