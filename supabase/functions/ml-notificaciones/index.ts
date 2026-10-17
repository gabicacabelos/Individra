// Recibe las notificaciones de Mercado Libre (URL de notificaciones de la app Individra) y las guarda.
// ML espera un 200 en menos de 500 ms y la base está en São Paulo: se valida el formato, se responde
// enseguida y se guarda en segundo plano. Si guardar falla queda en el log; el barrido periódico de
// reclamos y ventas cubre lo que se pierda. ML no firma las notificaciones: el contenido nunca se usa
// tal cual; se vuelve a pedir a la API con el token del vendedor (resource) al procesarla.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

// Lo provee el runtime de Supabase: termina la tarea después de responder
declare const EdgeRuntime: { waitUntil(promesa: Promise<unknown>): void };

const CLIENT_ID = Number(Deno.env.get("ML_CLIENT_ID") ?? "3327930655744100");

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false },
});

const responder = (status: number, motivo?: string) =>
  new Response(motivo ? JSON.stringify({ motivo }) : null, { status, headers: { "Content-Type": "application/json" } });

type Notificacion = {
  resource?: unknown;
  user_id?: unknown;
  topic?: unknown;
  application_id?: unknown;
  attempts?: unknown;
  sent?: unknown;
};

async function guardar(n: Notificacion & { topic: string; resource: string }, userId: number) {
  // La función descarta las cuentas que no están conectadas y los reintentos repetidos
  const { error } = await db.rpc("ml_guardar_notificacion", {
    p_topic: n.topic.slice(0, 100),
    p_resource: n.resource.slice(0, 300),
    p_ml_user_id: userId,
    p_application_id: CLIENT_ID,
    p_attempts: Number.isSafeInteger(Number(n.attempts)) ? Number(n.attempts) : null,
    p_sent: typeof n.sent === "string" && !Number.isNaN(Date.parse(n.sent)) ? n.sent : null,
    p_payload: n,
  });
  if (error) console.error("ml-notificaciones: no se pudo guardar", n.topic, n.resource, error.message);
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return responder(405);

  const n = (await req.json().catch(() => null)) as Notificacion | null;
  const userId = Number(n?.user_id);
  if (!n || typeof n.topic !== "string" || typeof n.resource !== "string" || !Number.isSafeInteger(userId)) {
    return responder(400, "formato inválido");
  }
  // Otra app: no es para nosotros
  if (Number(n.application_id) !== CLIENT_ID) return responder(400, "application_id ajeno");

  EdgeRuntime.waitUntil(guardar(n as Notificacion & { topic: string; resource: string }, userId));
  return responder(200);
});
