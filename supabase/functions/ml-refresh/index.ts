// Renueva el access_token de cada cuenta de Mercado Libre antes de que venza (lo llama pg_cron cada hora).
// Es seguro llamarla de más: solo renueva si faltan menos de 2 h 30 min y nunca en paralelo,
// porque el refresh_token de ML es de un solo uso. No devuelve ni registra tokens.
import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2.45.4";

const CLIENT_ID = Deno.env.get("ML_CLIENT_ID") ?? "3327930655744100";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

type Resultado = { cuenta: string; renovado: boolean; motivo?: string };

async function renovar(db: SupabaseClient, secret: string, label: string): Promise<Resultado> {
  // Toma el turno solo si hace falta renovar y nadie más lo está haciendo
  const { data: turno, error: errTurno } = await db.rpc("ml_claim_refresh", { p_label: label });
  if (errTurno) return { cuenta: label, renovado: false, motivo: errTurno.message };
  const fila = Array.isArray(turno) ? turno[0] : turno;
  if (!fila?.refresh_token) return { cuenta: label, renovado: false };

  const r = await fetch("https://api.mercadolibre.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: CLIENT_ID,
      client_secret: secret,
      refresh_token: fila.refresh_token,
    }),
  });
  const data = await r.json().catch(() => ({} as Record<string, unknown>));

  if (!r.ok || !data.access_token) {
    const motivo = typeof data.error === "string" ? data.error : `HTTP ${r.status}`;
    // Libera el turno para reintentar en la próxima corrida y deja registro del motivo (sin tokens)
    await db
      .from("oauth_tokens")
      .update({ refreshing_until: null, last_refresh_error: `${new Date().toISOString()} ${motivo}` })
      .eq("account_label", label);
    console.error("ml-refresh: falló", label, motivo);
    return { cuenta: label, renovado: false, motivo };
  }

  const { error } = await db
    .from("oauth_tokens")
    .update({
      access_token: data.access_token as string,
      // ML rota el refresh_token en cada renovación: siempre guardar el nuevo
      refresh_token: (data.refresh_token as string | undefined) ?? fila.refresh_token,
      scope: (data.scope as string | undefined) ?? null,
      expires_at: new Date(Date.now() + (Number(data.expires_in) || 21600) * 1000).toISOString(),
      refreshing_until: null,
      last_refresh_error: null,
      updated_at: new Date().toISOString(),
    })
    .eq("account_label", label);
  if (error) {
    console.error("ml-refresh: no se pudo guardar", label, error.message);
    return { cuenta: label, renovado: false, motivo: "no se pudo guardar" };
  }
  return { cuenta: label, renovado: true };
}

Deno.serve(async () => {
  const secret = Deno.env.get("ML_CLIENT_SECRET");
  if (!secret) return json({ ok: false, motivo: "falta ML_CLIENT_SECRET" }, 500);

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });

  const { data: cuentas, error } = await db.from("oauth_tokens").select("account_label");
  if (error) return json({ ok: false, motivo: error.message }, 500);

  // Una cuenta por vez: si una falla, las demás se renuevan igual
  const resultados: Resultado[] = [];
  for (const { account_label } of cuentas ?? []) resultados.push(await renovar(db, secret, account_label));

  const ok = resultados.every((r) => !r.motivo);
  return json({ ok, resultados }, ok ? 200 : 502);
});
