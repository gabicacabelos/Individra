create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Cada hora, en el minuto 7: pide renovar el token de Mercado Libre (la función decide si hace falta)
select cron.schedule(
  'ml-refresh-cada-hora',
  '7 * * * *',
  $$
  select net.http_post(
    url := 'https://jdjkyuftiaebxjvapiiv.supabase.co/functions/v1/ml-refresh',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb,
    timeout_milliseconds := 20000
  );
  $$
);
