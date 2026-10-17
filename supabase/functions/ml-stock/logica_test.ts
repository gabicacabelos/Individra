// Pruebas de la lógica contra un Mercado Libre simulado que se comporta como el real medido el 17/10/2026:
// una venta baja la publicación pero no /user-products; /user-products tarda en llegar a la publicación
// y al llegar fija el número (pisa las ventas del medio). Correr con: deno test supabase/functions/ml-stock
import { type ClienteML, descontar, type Opciones } from "./logica.ts";

type Momento = "antes_items" | "despues_items" | "antes_up" | "despues_up" | "lectura" | "tras_propagar";

class MLSimulado implements ClienteML {
  disponible: number;
  vendidas = 0;
  stockUP: number;
  version = 1;
  tipos = ["selling_address"];
  itemsIgnorado = false;
  retrasoUP = 2500;
  escrituras: string[] = [];
  private reloj = 0;
  private pendientes: { en: number; valor: number }[] = [];
  private ganchos = new Map<Momento, Array<() => void>>();
  private lecturas = 0;

  constructor(stock: number) {
    this.disponible = stock;
    this.stockUP = stock;
  }

  // Ejecuta `accion` la n-ésima vez que pasa por `momento`
  en(momento: Momento, accion: () => void, vez = 1) {
    const lista = this.ganchos.get(momento) ?? [];
    let cuenta = 0;
    lista.push(() => {
      if (++cuenta === vez) accion();
    });
    this.ganchos.set(momento, lista);
  }

  venta(n = 1) {
    this.disponible -= n;
    this.vendidas += n;
  }

  private disparar(momento: Momento) {
    for (const g of this.ganchos.get(momento) ?? []) g();
  }

  private propagar() {
    const listos = this.pendientes.filter((p) => p.en <= this.reloj);
    this.pendientes = this.pendientes.filter((p) => p.en > this.reloj);
    for (const p of listos) this.disponible = p.valor;
    if (listos.length) this.disparar("tras_propagar");
  }

  leerPublicacion() {
    this.lecturas++;
    this.disparar("lectura");
    this.propagar();
    return Promise.resolve({
      disponible: this.disponible,
      vendidas: this.vendidas,
      estado: "active",
      userProductId: "UP1",
    });
  }

  escribirPublicacion(_itemId: string, cantidad: number) {
    this.disparar("antes_items");
    this.escrituras.push(`items:${cantidad}`);
    if (!this.itemsIgnorado) {
      this.disponible = cantidad;
      this.stockUP = cantidad;
      this.version++;
    }
    this.disparar("despues_items");
    return Promise.resolve();
  }

  leerStockUP() {
    return Promise.resolve({ tipos: this.tipos, version: String(this.version) });
  }

  escribirStockUP(_up: string, cantidad: number, version: string) {
    this.disparar("antes_up");
    if (version !== String(this.version)) return Promise.resolve(false);
    this.escrituras.push(`up:${cantidad}`);
    this.stockUP = cantidad;
    this.version++;
    this.pendientes.push({ en: this.reloj + this.retrasoUP, valor: cantidad });
    this.disparar("despues_up");
    return Promise.resolve(true);
  }

  esperar(ms: number) {
    this.reloj += ms;
    return Promise.resolve();
  }
}

function igual<T>(real: T, esperado: T, que: string) {
  if (JSON.stringify(real) !== JSON.stringify(esperado)) {
    throw new Error(`${que}: esperaba ${JSON.stringify(esperado)}, fue ${JSON.stringify(real)}`);
  }
}

const rapido: Opciones = { intervaloLecturaMs: 100, esperaPropagacionMs: 6000 };

Deno.test("descuento simple por /items", async () => {
  const ml = new MLSimulado(10);
  const r = await descontar(ml, "MLA1", 1, rapido);
  igual(r.estado, "hecho", "estado");
  igual(r.via, "items", "vía");
  igual(ml.disponible, 9, "stock final");
  igual(ml.escrituras, ["items:9"], "escrituras");
});

Deno.test("venta de ML antes de leer: no se resta dos veces", async () => {
  const ml = new MLSimulado(10);
  ml.venta();
  const r = await descontar(ml, "MLA1", 1, rapido);
  igual(ml.disponible, 8, "stock final");
  igual(r.ventasPisadas, 0, "ventas pisadas");
  igual(ml.escrituras, ["items:8"], "escrituras");
});

Deno.test("venta de ML entre la lectura y la escritura: se recupera", async () => {
  const ml = new MLSimulado(10);
  ml.en("antes_items", () => ml.venta());
  const r = await descontar(ml, "MLA1", 1, rapido);
  igual(r.estado, "hecho", "estado");
  igual(ml.disponible, 8, "stock final");
  igual(r.ventasPisadas, 1, "ventas pisadas");
  igual(ml.escrituras, ["items:9", "items:8"], "escrituras");
});

Deno.test("venta de ML justo después de la escritura: no se resta dos veces", async () => {
  const ml = new MLSimulado(10);
  ml.en("despues_items", () => ml.venta());
  const r = await descontar(ml, "MLA1", 1, rapido);
  igual(ml.disponible, 8, "stock final");
  igual(r.ventasPisadas, 0, "ventas pisadas");
  igual(ml.escrituras, ["items:9"], "escrituras");
});

Deno.test("PUT /items responde bien pero no cambia nada: pasa a /user-products y espera la propagación", async () => {
  const ml = new MLSimulado(10);
  ml.itemsIgnorado = true;
  ml.retrasoUP = 3800;
  const r = await descontar(ml, "MLA1", 2, rapido);
  igual(r.estado, "hecho", "estado");
  igual(r.via, "user_products", "vía");
  igual(ml.disponible, 8, "stock final");
  igual(ml.escrituras, ["items:8", "items:8", "up:8"], "escrituras");
});

Deno.test("venta durante la propagación de /user-products: la propagación la pisa y se recupera", async () => {
  const ml = new MLSimulado(10);
  ml.en("despues_up", () => ml.venta());
  const r = await descontar(ml, "MLA1", 1, { ...rapido, via: "user_products" });
  igual(r.estado, "hecho", "estado");
  igual(ml.disponible, 8, "stock final");
  igual(ml.escrituras, ["up:9", "up:8"], "escrituras");
});

Deno.test("venta justo después de que llega /user-products: no se resta dos veces", async () => {
  const ml = new MLSimulado(10);
  ml.en("tras_propagar", () => ml.venta());
  const r = await descontar(ml, "MLA1", 1, { ...rapido, via: "user_products" });
  igual(r.estado, "hecho", "estado");
  igual(ml.disponible, 8, "stock final");
  igual(ml.escrituras, ["up:9"], "escrituras");
});

Deno.test("PUT /items ignorado y una venta en el medio: termina en el número correcto", async () => {
  const ml = new MLSimulado(10);
  ml.itemsIgnorado = true;
  ml.en("antes_items", () => ml.venta());
  const r = await descontar(ml, "MLA1", 1, rapido);
  igual(r.estado, "hecho", "estado");
  igual(r.via, "user_products", "vía");
  igual(ml.disponible, 8, "stock final");
});

Deno.test("conflicto de versión en /user-products: relee y reintenta", async () => {
  const ml = new MLSimulado(10);
  ml.en("antes_up", () => ml.version++);
  const r = await descontar(ml, "MLA1", 1, { ...rapido, via: "user_products" });
  igual(r.estado, "hecho", "estado");
  igual(ml.disponible, 9, "stock final");
  igual(r.pasos.some((p) => p.includes("conflicto")), true, "registra el conflicto");
});

Deno.test("sin stock suficiente: no escribe", async () => {
  const ml = new MLSimulado(1);
  const r = await descontar(ml, "MLA1", 2, rapido);
  igual(r.estado, "sin_stock", "estado");
  igual(ml.escrituras, [], "escrituras");
});

Deno.test("multiorigen y Full: rechaza sin escribir", async () => {
  for (const tipos of [["seller_warehouse"], ["meli_facility"], ["selling_address", "meli_facility"]]) {
    const ml = new MLSimulado(10);
    ml.tipos = tipos;
    const r = await descontar(ml, "MLA1", 1, rapido);
    igual(r.estado, "rechazado", `estado con ${tipos}`);
    igual(ml.escrituras, [], `escrituras con ${tipos}`);
  }
});

Deno.test("entran más ventas que el stock que quedaba: pide revisar", async () => {
  const ml = new MLSimulado(2);
  ml.en("antes_items", () => ml.venta(2));
  const r = await descontar(ml, "MLA1", 1, rapido);
  igual(r.estado, "revisar", "estado");
});

Deno.test("cantidad inválida", async () => {
  const ml = new MLSimulado(10);
  for (const n of [0, -1, 1.5]) {
    const r = await descontar(ml, "MLA1", n, rapido);
    igual(r.estado, "rechazado", `cantidad ${n}`);
  }
  igual(ml.escrituras, [], "escrituras");
});
