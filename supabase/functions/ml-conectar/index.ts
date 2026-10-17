// Link de conexión de un piloto: la página www.individratec.com/conectar/{codigo} manda acá con ?p={codigo}.
// Recién en este momento se genera el state de un solo uso y el PKCE, y se redirige a Mercado Libre.
// Así el link que recibe el cliente no vence: lo que vence es cada intento.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const CLIENT_ID = Deno.env.get("ML_CLIENT_ID") ?? "3327930655744100";
const REDIRECT_URI = "https://jdjkyuftiaebxjvapiiv.supabase.co/functions/v1/ml-callback";
const SITIO = "https://www.individratec.com";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false },
});

// Sin caché: cada clic tiene que generar un state nuevo
const redirigir = (destino: string) =>
  new Response(null, { status: 302, headers: { Location: destino, "Cache-Control": "no-store" } });
const resultado = (estado: string) => redirigir(`${SITIO}/conectar/resultado?estado=${estado}`);

function base64url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

Deno.serve(async (req) => {
  if (req.method !== "GET") return new Response(null, { status: 405 });
  const codigo = new URL(req.url).searchParams.get("p") ?? "";
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(codigo)) return resultado("invalido");

  const { data: piloto, error } = await db
    .from("pilotos")
    .select("account_label, activo, vence_en")
    .eq("codigo", codigo)
    .maybeSingle();
  if (error) {
    console.error("ml-conectar: no se pudo leer el piloto", error.message);
    return resultado("error");
  }
  if (!piloto?.activo || (piloto.vence_en && Date.parse(piloto.vence_en) < Date.now())) return resultado("invalido");

  const state = base64url(crypto.getRandomValues(new Uint8Array(32)));
  const verificador = base64url(crypto.getRandomValues(new Uint8Array(48)));
  const desafio = base64url(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verificador))));

  const { error: errState } = await db.from("oauth_states").insert({
    state,
    account_label: piloto.account_label,
    code_verifier: verificador,
    origen: "piloto",
  });
  if (errState) {
    console.error("ml-conectar: no se pudo guardar el state", errState.message);
    return resultado("error");
  }

  const q = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    state,
    code_challenge: desafio,
    code_challenge_method: "S256",
  });
  return redirigir(`https://auth.mercadolibre.com.ar/authorization?${q}`);
});
