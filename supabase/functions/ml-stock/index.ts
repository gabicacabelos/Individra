// Descuenta stock de una publicación de Mercado Libre (Venta Blindada): POST con
// { cuenta, item_id, cantidad, referencia, via? }. Lo llama el backend de INDIVIDRA con la clave secreta
// del proyecto en el header `apikey`; esa misma clave se usa para leer el token y registrar el descuento,
// así que sin ella no se puede hacer nada. La misma `referencia` nunca descuenta dos veces.
import { type ClienteML, descontar, type Via } from "./logica.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ML = "https://api.mercadolibre.com";
const BLOQUEO_SEGUNDOS = 90;
const ESPERA_BLOQUEO_MS = 20000;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

class ErrorHttp extends Error {
  constructor(readonly status: number, mensaje: string) {
    super(mensaje);
  }
}

// PostgREST con la clave de quien llama
function base(clave: string) {
  return async (metodo: string, ruta: string, cuerpo?: unknown, prefer?: string) => {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${ruta}`, {
      method: metodo,
      headers: {
        apikey: clave,
        "Content-Type": "application/json",
        ...(prefer ? { Prefer: prefer } : {}),
      },
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    });
    const texto = await r.text();
    if (!r.ok) throw new ErrorHttp(r.status === 401 || r.status === 403 ? 401 : 500, `base ${r.status}: ${texto.slice(0, 200)}`);
    return texto ? JSON.parse(texto) : null;
  };
}

function clienteML(token: string): ClienteML {
  const pedir = async (metodo: string, ruta: string, cuerpo?: unknown, extra?: Record<string, string>) => {
    const r = await fetch(`${ML}${ruta}`, {
      method: metodo,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...extra },
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    });
    const texto = await r.text();
    return { status: r.status, datos: texto ? JSON.parse(texto) : null, headers: r.headers };
  };
  const exigir = (status: number, que: string, datos: unknown) => {
    if (status >= 300) throw new ErrorHttp(502, `Mercado Libre ${que}: ${status} ${JSON.stringify(datos).slice(0, 200)}`);
  };
  return {
    async leerPublicacion(itemId) {
      const { status, datos } = await pedir(
        "GET",
        `/items/${itemId}?attributes=available_quantity,sold_quantity,status,user_product_id`,
      );
      exigir(status, "leer publicación", datos);
      return {
        disponible: datos.available_quantity,
        vendidas: datos.sold_quantity,
        estado: datos.status,
        userProductId: datos.user_product_id ?? null,
      };
    },
    async escribirPublicacion(itemId, cantidad) {
      const { status, datos } = await pedir("PUT", `/items/${itemId}`, { available_quantity: cantidad });
      exigir(status, "escribir publicación", datos);
    },
    async leerStockUP(userProductId) {
      const { status, datos, headers } = await pedir("GET", `/user-products/${userProductId}/stock`);
      exigir(status, "leer stock", datos);
      return {
        tipos: (datos.locations ?? []).map((l: { type: string }) => l.type),
        version: headers.get("x-version") ?? "",
      };
    },
    async escribirStockUP(userProductId, cantidad, version) {
      const { status, datos } = await pedir(
        "PUT",
        `/user-products/${userProductId}/stock/type/selling_address`,
        { quantity: cantidad },
        { "x-version": version },
      );
      if (status === 409) return false;
      exigir(status, "escribir stock", datos);
      return true;
    },
    esperar: (ms) => new Promise((r) => setTimeout(r, ms)),
  };
}

type Pedido = { cuenta?: unknown; item_id?: unknown; cantidad?: unknown; referencia?: unknown; via?: unknown };

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ motivo: "usar POST" }, 405);
  const clave = req.headers.get("apikey");
  if (!clave) return json({ motivo: "falta la clave" }, 401);

  const p = (await req.json().catch(() => null)) as Pedido | null;
  const cuenta = typeof p?.cuenta === "string" ? p.cuenta : "";
  const itemId = typeof p?.item_id === "string" ? p.item_id : "";
  const referencia = typeof p?.referencia === "string" ? p.referencia.trim() : "";
  const cantidad = Number(p?.cantidad);
  const via = p?.via === "user_products" || p?.via === "items" ? (p.via as Via) : undefined;
  if (!cuenta || !/^ML[A-Z]\d+$/.test(itemId) || !referencia || referencia.length > 200 || !Number.isInteger(cantidad) || cantidad < 1) {
    return json({ motivo: "faltan datos o son inválidos: cuenta, item_id, cantidad (entero ≥ 1), referencia" }, 400);
  }

  const db = base(clave);
  try {
    const filas = await db("GET", `oauth_tokens?select=access_token&account_label=eq.${encodeURIComponent(cuenta)}`);
    if (!filas?.length) return json({ motivo: "cuenta no conectada" }, 404);
    const ml = clienteML(filas[0].access_token);

    // El stock es del producto: dos publicaciones del mismo producto comparten el bloqueo
    const { userProductId } = await ml.leerPublicacion(itemId);
    const claveBloqueo = userProductId ?? itemId;
    const dueno = crypto.randomUUID();
    const tomar = () =>
      db("POST", "rpc/ml_tomar_bloqueo", { p_clave: claveBloqueo, p_dueno: dueno, p_segundos: BLOQUEO_SEGUNDOS });
    const inicio = Date.now();
    while (!(await tomar())) {
      if (Date.now() - inicio > ESPERA_BLOQUEO_MS) {
        return json({ motivo: "hay otro descuento en curso para este producto: reintentar con la misma referencia" }, 409);
      }
      await ml.esperar(300);
    }

    try {
      // La referencia se registra con el bloqueo tomado: si ya existe, no se descuenta de nuevo
      const nueva = await db(
        "POST",
        "ml_stock_descuentos?on_conflict=referencia",
        { referencia, account_label: cuenta, item_id: itemId, cantidad },
        "resolution=ignore-duplicates,return=representation",
      );
      if (!nueva?.length) {
        const [previa] = await db("GET", `ml_stock_descuentos?referencia=eq.${encodeURIComponent(referencia)}&select=*`);
        return json({ repetido: true, ...previa }, previa?.estado === "en_curso" ? 409 : 200);
      }
      const id = nueva[0].id;

      let r;
      try {
        r = await descontar(ml, itemId, cantidad, { via });
      } catch (e) {
        await db("PATCH", `ml_stock_descuentos?id=eq.${id}`, {
          estado: "revisar",
          motivo: e instanceof Error ? e.message.slice(0, 300) : "error",
          terminado: new Date().toISOString(),
        });
        throw e;
      }
      await db("PATCH", `ml_stock_descuentos?id=eq.${id}`, {
        estado: r.estado,
        motivo: r.motivo ?? null,
        via: r.via ?? null,
        disponible_antes: r.disponibleAntes ?? null,
        vendidas_antes: r.vendidasAntes ?? null,
        escrito: r.escrito ?? null,
        disponible_final: r.disponibleFinal ?? null,
        ventas_pisadas: r.ventasPisadas,
        pasos: r.pasos,
        terminado: new Date().toISOString(),
      });
      return json({ id, referencia, ...r });
    } finally {
      await db("POST", "rpc/ml_soltar_bloqueo", { p_clave: claveBloqueo, p_dueno: dueno }).catch(() => {});
    }
  } catch (e) {
    const status = e instanceof ErrorHttp ? e.status : 500;
    console.error("ml-stock:", e instanceof Error ? e.message : e);
    return json({ motivo: status === 401 ? "clave inválida" : e instanceof Error ? e.message : "error" }, status);
  }
});
