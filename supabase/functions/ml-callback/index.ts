// Recibe la autorizacion de Mercado Libre (redirect de la app Individra),
// canjea el code por tokens y los guarda en oauth_tokens. Nunca muestra tokens.
// Soporta PKCE: si el state guardo un code_verifier, se manda en el canje.
// Responde en texto simple: Supabase no deja mostrar paginas HTML desde su dominio.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const CLIENT_ID = Deno.env.get("ML_CLIENT_ID") ?? "3327930655744100";
const REDIRECT_URI = "https://jdjkyuftiaebxjvapiiv.supabase.co/functions/v1/ml-callback";

// Texto en ASCII (sin tildes) para que se lea bien aunque el navegador adivine mal la codificacion
function texto(mensaje: string, status = 200) {
  return new Response(mensaje + "\n", {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) {
    return texto("FALTA INFORMACION\nAbri de nuevo el link de autorizacion que te paso Claude.", 400);
  }

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });

  // 1) El state tiene que existir, no estar usado y tener menos de 48 horas (todavia no se consume)
  const desde = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  const { data: valido } = await db
    .from("oauth_states")
    .select("state")
    .eq("state", state)
    .is("used_at", null)
    .gte("created_at", desde)
    .maybeSingle();
  if (!valido) {
    return texto("LINK VENCIDO\nEste link ya se uso o vencio. Pedile a Claude uno nuevo.", 400);
  }

  // 2) La Secret Key tiene que estar cargada. Si falta, el link NO se gasta: sirve de nuevo cuando la cargues.
  const secret = Deno.env.get("ML_CLIENT_SECRET")?.trim();
  if (!secret) {
    // Solo nombres (nunca valores) de variables parecidas, para detectar un error de tipeo
    const parecidas = Object.keys(Deno.env.toObject())
      .filter((k) => /ML|MERCADO|CLIENT|SECRET/i.test(k) && !k.startsWith("SUPABASE_"))
      .sort();
    return texto(
      "FALTA LA SECRET KEY\n" +
        "La funcion no encuentra la variable ML_CLIENT_SECRET.\n" +
        "Variables parecidas que si ve: " + (parecidas.length ? parecidas.join(", ") : "ninguna") + "\n" +
        "Revisa en Edge Functions > Secrets del proyecto individra-ml-tokens que el nombre sea exactamente ML_CLIENT_SECRET y que hayas guardado.\n" +
        "Este link no se gasto: cuando la cargues, volve a abrirlo.",
      500,
    );
  }

  // 3) Ahora si: se consume el state (un solo uso) y se canjea el code
  const { data: fila } = await db
    .from("oauth_states")
    .update({ used_at: new Date().toISOString() })
    .eq("state", state)
    .is("used_at", null)
    .select("account_label, code_verifier")
    .maybeSingle();
  if (!fila) {
    return texto("LINK VENCIDO\nEste link ya se uso o vencio. Pedile a Claude uno nuevo.", 400);
  }

  const params: Record<string, string> = {
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    client_secret: secret,
    code,
    redirect_uri: REDIRECT_URI,
  };
  if (fila.code_verifier) params.code_verifier = fila.code_verifier;

  const r = await fetch("https://api.mercadolibre.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams(params),
  });
  const data = await r.json().catch(() => ({} as Record<string, unknown>));
  if (!r.ok || !data.access_token || !data.refresh_token) {
    // No se muestra ni se registra el cuerpo: podria traer datos sensibles
    const sinRefresh = r.ok && data.access_token && !data.refresh_token;
    const motivo = typeof data.error === "string" ? data.error : `HTTP ${r.status}`;
    console.error("ml-callback: canje fallido", sinRefresh ? "sin refresh_token" : motivo);
    return texto(
      "NO SE PUDO CONECTAR\n" +
        (sinRefresh
          ? "Mercado Libre no dio acceso permanente. Tilda el flujo Refresh Token en la app Individra."
          : `Mercado Libre rechazo la autorizacion (${motivo}). Revisa la Redirect URI, los flujos y la Secret Key de la app.`) +
        "\nEste link ya se gasto: pedile a Claude uno nuevo.",
      502,
    );
  }

  const { error } = await db.from("oauth_tokens").upsert({
    account_label: fila.account_label,
    ml_user_id: (data.user_id as number | undefined) ?? null,
    access_token: data.access_token as string,
    refresh_token: data.refresh_token as string,
    scope: (data.scope as string | undefined) ?? null,
    expires_at: new Date(Date.now() + (Number(data.expires_in) || 21600) * 1000).toISOString(),
    refreshing_until: null,
    last_refresh_error: null,
    updated_at: new Date().toISOString(),
  });
  if (error) {
    console.error("ml-callback: no se pudo guardar", error.message);
    return texto("ERROR AL GUARDAR\nLa autorizacion funciono pero no se pudo guardar. Avisale a Claude.", 500);
  }
  return texto("LISTO: MERCADO LIBRE QUEDO CONECTADO\nYa podes cerrar esta pestana. Avisale a Claude.");
});
