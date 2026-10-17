// Descuento de stock en Mercado Libre sin pisar ventas (Venta Blindada).
//
// Mercado Libre no tiene "restar n": solo deja fijar un número. Lo que se probó con usuarios de prueba
// (17/10/2026):
// - Una venta de Mercado Libre baja `available_quantity` de la publicación, pero no el stock de
//   /user-products ni su x-version.
// - `PUT /items` ya está aplicado en la publicación cuando responde; /user-products lo copia en < 0,4 s.
// - Lo escrito en /user-products tarda entre 1 y 4 s en verse en la publicación.
//
// Por eso: se calcula siempre desde la publicación, se escribe y después se verifica con
// (disponibles, vendidas). Si quedaron más disponibles que `objetivo − ventas nuevas`, la escritura pisó
// una venta y se vuelve a escribir. Comparar solo vendidas no alcanza: una venta posterior a la escritura
// ya se descontó bien y se restaría dos veces.
//
// Quien llama tiene que garantizar un descuento por vez para cada producto (bloqueo en index.ts).

export type Via = "items" | "user_products";

export interface Publicacion {
  disponible: number;
  vendidas: number;
  estado: string;
  userProductId: string | null;
}

export interface StockUP {
  tipos: string[];
  version: string;
}

export interface ClienteML {
  leerPublicacion(itemId: string): Promise<Publicacion>;
  escribirPublicacion(itemId: string, cantidad: number): Promise<void>;
  leerStockUP(userProductId: string): Promise<StockUP>;
  // false si la versión no coincide (409): alguien escribió en el medio
  escribirStockUP(userProductId: string, cantidad: number, version: string): Promise<boolean>;
  esperar(ms: number): Promise<void>;
}

export type Estado = "hecho" | "sin_stock" | "rechazado" | "revisar";

export interface Resultado {
  estado: Estado;
  motivo?: string;
  via?: Via;
  disponibleAntes?: number;
  vendidasAntes?: number;
  escrito?: number;
  disponibleFinal?: number;
  // ventas de Mercado Libre que entraron mientras se escribía y hubo que volver a restar
  ventasPisadas: number;
  pasos: string[];
}

export interface Opciones {
  // Cuentas donde se sabe que PUT /items no aplica: ir directo a /user-products
  via?: Via;
  // Lo medido fue hasta 3,8 s; se espera algo más antes de dar la escritura por no aplicada
  esperaPropagacionMs?: number;
  intervaloLecturaMs?: number;
  maxEscrituras?: number;
}

const ESTADOS_EDITABLES = new Set(["active", "paused"]);

export async function descontar(
  ml: ClienteML,
  itemId: string,
  cantidad: number,
  opciones: Opciones = {},
): Promise<Resultado> {
  const esperaPropagacionMs = opciones.esperaPropagacionMs ?? 6000;
  const intervaloMs = opciones.intervaloLecturaMs ?? 300;
  const maxEscrituras = opciones.maxEscrituras ?? 4;
  const pasos: string[] = [];
  const resultado = (r: Omit<Resultado, "pasos" | "ventasPisadas"> & { ventasPisadas?: number }): Resultado => ({
    ventasPisadas: 0,
    ...r,
    pasos,
  });

  if (!Number.isInteger(cantidad) || cantidad < 1) {
    return resultado({ estado: "rechazado", motivo: "cantidad inválida" });
  }

  const inicial = await ml.leerPublicacion(itemId);
  pasos.push(`leída: ${inicial.disponible} disponibles, ${inicial.vendidas} vendidas, ${inicial.estado}`);
  if (!ESTADOS_EDITABLES.has(inicial.estado)) {
    return resultado({ estado: "rechazado", motivo: `publicación ${inicial.estado}` });
  }

  if (inicial.userProductId) {
    const { tipos } = await ml.leerStockUP(inicial.userProductId);
    pasos.push(`ubicaciones: ${tipos.join(", ") || "ninguna"}`);
    // Varios depósitos: hay que elegir de cuál sale la venta, y eso no se decide solo
    if (tipos.includes("seller_warehouse")) {
      return resultado({ estado: "rechazado", motivo: "multiorigen: falta elegir el depósito" });
    }
    // En Full el stock lo maneja Mercado Libre
    if (tipos.includes("meli_facility")) {
      return resultado({ estado: "rechazado", motivo: "stock en Full" });
    }
  }

  if (cantidad > inicial.disponible) {
    return resultado({
      estado: "sin_stock",
      motivo: `pedido ${cantidad}, disponible ${inicial.disponible}`,
      disponibleAntes: inicial.disponible,
      vendidasAntes: inicial.vendidas,
    });
  }

  let via: Via = opciones.via ?? "items";
  if (via === "user_products" && !inicial.userProductId) {
    return resultado({ estado: "rechazado", motivo: "la publicación no tiene user_product_id" });
  }

  // Objetivo vigente y la cantidad de vendidas sobre la que se calculó
  let objetivo = inicial.disponible - cantidad;
  let base = inicial.vendidas;
  let ventasPisadas = 0;
  let escriturasPorItems = 0;

  for (let escritura = 1; escritura <= maxEscrituras; escritura++) {
    if (via === "items") {
      await ml.escribirPublicacion(itemId, objetivo);
      escriturasPorItems++;
      pasos.push(`escrito ${objetivo} por /items`);
    } else {
      const ok = await escribirUP(ml, inicial.userProductId!, objetivo, pasos);
      if (!ok) {
        return resultado({
          estado: "revisar",
          motivo: "/user-products respondió conflicto de versión 3 veces",
          via,
          disponibleAntes: inicial.disponible,
          vendidasAntes: inicial.vendidas,
          escrito: objetivo,
          ventasPisadas,
        });
      }
    }

    // /items se ve al instante; /user-products tarda unos segundos en llegar a la publicación
    const limite = via === "items" ? 0 : esperaPropagacionMs;
    let espera = 0;
    let actual = await ml.leerPublicacion(itemId);
    let esperado = objetivo - (actual.vendidas - base);
    while (actual.disponible > esperado && espera < limite) {
      await ml.esperar(intervaloMs);
      espera += intervaloMs;
      actual = await ml.leerPublicacion(itemId);
      esperado = objetivo - (actual.vendidas - base);
    }
    pasos.push(`verificado: ${actual.disponible} disponibles, ${actual.vendidas} vendidas, esperado ${esperado}`);

    if (actual.disponible <= esperado) {
      // Menos de lo esperado: otro canal bajó stock en el medio. Se deja como está (no sobrevende)
      if (actual.disponible < esperado) pasos.push("quedó por debajo de lo esperado: no se corrige hacia arriba");
      return resultado({
        estado: "hecho",
        via,
        disponibleAntes: inicial.disponible,
        vendidasAntes: inicial.vendidas,
        escrito: objetivo,
        disponibleFinal: actual.disponible,
        ventasPisadas,
      });
    }

    // Quedaron más de los que corresponde: la escritura pisó ventas o no se aplicó.
    // En los dos casos el número correcto es `esperado`.
    const pisadas = actual.vendidas - base;
    if (pisadas > 0 && actual.disponible === objetivo) ventasPisadas += pisadas;
    objetivo = esperado;
    base = actual.vendidas;
    if (objetivo < 0) {
      return resultado({
        estado: "revisar",
        motivo: "entraron más ventas que el stock que quedaba: posible sobreventa",
        via,
        disponibleAntes: inicial.disponible,
        vendidasAntes: inicial.vendidas,
        disponibleFinal: actual.disponible,
        ventasPisadas,
      });
    }
    // PUT /items respondió bien dos veces y la publicación no cambió: pasa a /user-products
    if (via === "items" && escriturasPorItems >= 2 && inicial.userProductId) {
      via = "user_products";
      pasos.push("PUT /items no se aplicó: se pasa a /user-products");
    }
  }

  const final = await ml.leerPublicacion(itemId);
  return resultado({
    estado: "revisar",
    motivo: `no se confirmó después de ${maxEscrituras} escrituras`,
    via,
    disponibleAntes: inicial.disponible,
    vendidasAntes: inicial.vendidas,
    escrito: objetivo,
    disponibleFinal: final.disponible,
    ventasPisadas,
  });
}

async function escribirUP(ml: ClienteML, userProductId: string, cantidad: number, pasos: string[]): Promise<boolean> {
  for (let intento = 1; intento <= 3; intento++) {
    const { version } = await ml.leerStockUP(userProductId);
    if (await ml.escribirStockUP(userProductId, cantidad, version)) {
      pasos.push(`escrito ${cantidad} por /user-products (versión ${version})`);
      return true;
    }
    pasos.push(`/user-products: conflicto de versión ${version}, se reintenta`);
    await ml.esperar(300);
  }
  return false;
}
