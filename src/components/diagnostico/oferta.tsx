'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import {
    COLOR_META,
    METRICAS,
    calcularMargen,
    porcentaje,
    type ConteosReputacion,
} from '@/lib/reputacionML'

/**
 * Cierre comercial del autodiagnóstico: convierte las respuestas en
 * "lo que te pasa → cómo lo resolvemos → cuánto cuesta vs. cuánto te cuesta hoy → cómo arrancás".
 * Precios iguales a los publicados en PropuestaComercialSection y /logistica.
 */

export type DatosReputacion = {
    ventas: number
    conteos: ConteosReputacion
    esLider: boolean
}

type Plan = { nombre: string; precio: number; desde?: boolean; detalle: string }

const PILOTO = { precio: 95000, sena: 50000 }
const PLAN_1: Plan = { nombre: 'Plan 1 · Reputación ML + Venta Blindada', precio: 115000, detalle: 'hasta 600 pedidos/mes' }
const PLAN_2: Plan = { nombre: 'Plan 2 · Operación Total', precio: 220000, detalle: 'hasta 1.200 pedidos/mes' }
const PLAN_LOGISTICA: Plan = {
    nombre: 'Plan para logísticas',
    precio: 160000,
    desde: true,
    detalle: 'según volumen de guías',
}
/** Referencia de costo hora operativo, la misma que usaba la calculadora del home. */
const COSTO_HORA_ARS = 6250

function ars(valor: number): string {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(
        Math.round(valor)
    )
}

type Hallazgo = { problema?: string; solucion: string }

type Oferta = {
    plan: Plan
    hallazgos: Hallazgo[]
    roi?: string
    pasos: { titulo: string; detalle: string }[]
    cupo?: string
}

type Contexto = {
    plataforma: 'logistica' | 'meli' | 'otros'
    respuestas: Record<string, string>
    puntos: Record<string, number>
    reputacion: DatosReputacion | null
    perdidaLogisticaMensual: number
}

const PASOS_TIENDA = (plan: Plan) => [
    { titulo: 'Diagnóstico gratis de 30 minutos', detalle: 'Revisamos tu reputación y tus números con vos, por videollamada.' },
    {
        titulo: `Piloto de 30 días · ${ars(PILOTO.precio)} + IVA`,
        detalle: `Reservás con una seña de ${ars(PILOTO.sena)}, reembolsable si en el diagnóstico vemos que no aplica. La semana 2 corre en modo solo lectura: no tocamos tu cuenta.`,
    },
    {
        titulo: `${plan.nombre} · ${ars(plan.precio)}/mes + IVA`,
        detalle: 'Solo si al día 30 los números te cierran. Mes a mes, sin permanencia, y tu base es tuya.',
    },
]

const RANGO_COSTO_MELI: Record<string, { texto: string; base: number | null }> = {
    'Menos de $800.000 ARS': { texto: 'menos de $800.000', base: null },
    'Entre $800.000 y $3.000.000 ARS entre pérdida de exposición y reclamos': {
        texto: 'entre $800.000 y $3.000.000',
        base: 800000,
    },
    'Más de $3.000.000 ARS (la caída de ventas en los listados es inmediata y brutal)': {
        texto: 'más de $3.000.000',
        base: 3000000,
    },
}

const HORAS_ADMIN: Record<string, number> = {
    'Menos de 45 minutos por día': 0.75,
    'Entre 1 y 2 horas por día repartidas entre el dueño y depósito': 1.5,
    'Más de 2 horas y media por día (equivale a casi medio sueldo administrativo al mes)': 2.5,
}

export function construirOferta(ctx: Contexto): Oferta {
    const { plataforma, respuestas: r, puntos: p } = ctx

    if (plataforma === 'logistica') {
        const hallazgos: Hallazgo[] = []
        if ((p.coordinacion ?? 0) >= 2)
            hallazgos.push({
                problema: 'Los vehículos salen sin confirmar quién va a estar.',
                solucion: 'La noche anterior cada destinatario confirma por WhatsApp; el que no puede, se reprograma antes de cargar.',
            })
        if ((p.evidencia_conflicto ?? 0) >= 2)
            hallazgos.push({
                problema: 'Ante un "estuve todo el día" no tenés cómo probar la visita.',
                solucion: 'Cada visita queda registrada con ubicación y hora, cruzada con la confirmación del destinatario.',
            })
        if ((p.remitos_rendicion ?? 0) >= 3)
            hallazgos.push({
                problema: 'Los remitos llegan en papel o se pierden en grupos de WhatsApp.',
                solucion: 'El chofer rinde el remito firmado en 1 toque por Telegram, sin instalar apps pesadas.',
            })
        hallazgos.push({
            solucion: 'Tus clientes consultan el estado de cada entrega por WhatsApp y reciben el aviso antes de preguntar.',
        })

        const perdida = ctx.perdidaLogisticaMensual
        const roi =
            `Tus viajes en falso te cuestan ~${ars(perdida)} por mes. Los planes para logísticas arrancan en ${ars(PLAN_LOGISTICA.precio)}/mes + IVA.` +
            (perdida / 3 >= PLAN_LOGISTICA.precio
                ? ' Si recuperás aunque sea un tercio de esos rebotes, el plan se paga solo.'
                : '')

        return {
            plan: PLAN_LOGISTICA,
            hallazgos,
            roi,
            pasos: [
                { titulo: 'Diagnóstico gratis de 30 minutos', detalle: 'Revisamos tu operación, tu planilla o ERP y tus números de rebote.' },
                { titulo: 'Ruta piloto medida', detalle: 'Lo probamos en una ruta y comparamos contra tu línea base.' },
                {
                    titulo: `${PLAN_LOGISTICA.nombre} · desde ${ars(PLAN_LOGISTICA.precio)}/mes + IVA`,
                    detalle: 'Según tu volumen de guías. Mes a mes, sin permanencia.',
                },
            ],
        }
    }

    if (plataforma === 'otros') {
        const hallazgos: Hallazgo[] = [
            {
                problema: (p.sobreventa_stock ?? 0) >= 2 ? 'Bajás el stock a mano y quedás expuesto a sobreventas.' : undefined,
                solucion: 'Con 1 clic validás la transferencia y el stock se descuenta en Mercado Libre y Tiendanube a la vez.',
            },
        ]
        if ((p.validacion_comprobantes ?? 0) >= 2)
            hallazgos.push({
                problema: 'Validar comprobantes te lleva tiempo, o confiás en la captura.',
                solucion: 'Leemos el comprobante, detectamos duplicados y la venta se confirma recién cuando ves la plata en tu cuenta.',
            })
        hallazgos.push({
            problema:
                (p.reputacion_cancelaciones ?? 0) >= 2 ? 'Las cancelaciones por falta de stock te comen margen de reputación.' : undefined,
            solucion: 'Además, te avisamos cada reclamo de Mercado Libre con su plazo y cuánto margen te queda antes de bajar de color.',
        })

        const horas = HORAS_ADMIN[r.horas_administracion]
        const roi = horas
            ? `Hoy tu equipo le dedica ~${horas.toLocaleString('es-AR')} hs por día a esto: unos ${ars(horas * 24 * COSTO_HORA_ARS)} por mes (a ${ars(COSTO_HORA_ARS)} la hora). El ${PLAN_1.nombre} cuesta ${ars(PLAN_1.precio)}/mes + IVA.`
            : undefined

        return {
            plan: PLAN_1,
            hallazgos,
            roi,
            pasos: PASOS_TIENDA(PLAN_1),
            cupo: 'Tomamos un máximo de 3 tiendas por mes para hacer el setup 1 a 1.',
        }
    }

    // Mercado Libre
    const volumenAlto = r.volumen === 'Entre 30 y 70 paquetes por día' || r.volumen === 'Más de 70 paquetes por día'
    const fleteConProblemas = (p.control_fleteros ?? 0) >= 3
    const plan = volumenAlto || fleteConProblemas ? PLAN_2 : PLAN_1

    const margen = ctx.reputacion
        ? calcularMargen(ctx.reputacion.ventas, ctx.reputacion.conteos, ctx.reputacion.esLider)
        : null

    const hallazgos: Hallazgo[] = [
        {
            problema: (p.reclamos_plazo ?? 0) >= 2 ? 'Te enterás de los reclamos tarde, o revisando el panel a mano.' : undefined,
            solucion: 'Te llega un WhatsApp apenas entra cada reclamo, con el plazo exacto que fija Mercado Libre y la cuenta regresiva.',
        },
        {
            problema: margen
                ? `Hoy: ${margen.titular.toLowerCase()}${margen.masAjustada.margen > 0 ? ' antes de bajar de color' : ''}.`
                : 'No sabés cuántos reclamos te quedan antes de bajar de color.',
            solucion: 'Te calculamos todos los días cuántos reclamos, cancelaciones y demoras te quedan antes de perder el verde.',
        },
    ]
    if ((p.evidencia_controversias ?? 0) >= 2)
        hallazgos.push({
            problema: 'Cuando hay una controversia, juntar pruebas te lleva horas o no las tenés.',
            solucion: 'Armamos un expediente por venta con la foto del empaque y el remito, listo para responder la mediación a tiempo.',
        })
    if ((p.control_fleteros ?? 0) >= 2)
        hallazgos.push({
            problema: 'No auditás paquete por paquete lo que te factura el fletero.',
            solucion: `Cruzamos la liquidación del fletero contra las entregas reales de Mercado Libre${plan === PLAN_2 ? '' : ' (en el Plan 2)'}.`,
        })

    const rango = RANGO_COSTO_MELI[r.costo_reputacion]
    let roi: string | undefined
    if (rango) {
        roi = `Según tu estimación, un mes fuera de verde te cuesta ${rango.texto}. El ${plan.nombre} cuesta ${ars(plan.precio)}/mes + IVA`
        roi += rango.base
            ? `: evitar una sola caída de color paga ${Math.floor(rango.base / plan.precio)} meses de servicio.`
            : '.'
    }

    return {
        plan,
        hallazgos,
        roi,
        pasos: PASOS_TIENDA(plan),
        cupo: 'Tomamos un máximo de 3 tiendas por mes para hacer el setup 1 a 1.',
    }
}

/* ============================================================
   Bloques visuales
   ============================================================ */

export function OfertaRecomendada({ oferta }: { oferta: Oferta }) {
    return (
        <div className="mt-10">
            <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-white tracking-tight">
                Lo que encontramos y cómo lo resolvemos
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
                {oferta.hallazgos.map((h, i) => (
                    <li key={i} className="rounded-xl border border-white/[0.08] bg-[#151719] p-4">
                        {h.problema && <p className="text-sm text-neutral-400 font-sans">{h.problema}</p>}
                        <p className="mt-1 flex items-start gap-2.5 text-[15px] leading-relaxed text-neutral-100 font-sans">
                            <CheckCircle2 className="w-4 h-4 text-[#FF5520] shrink-0 mt-1" />
                            <span>{h.solucion}</span>
                        </p>
                    </li>
                ))}
            </ul>

            <div className="mt-8 rounded-3xl border border-[#FF5520]/40 bg-gradient-to-b from-[#1C100C] via-[#141014] to-[#0A0D10] p-6 sm:p-8">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#FFA380] font-bold">
                    Recomendado para tu operación
                </span>
                <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
                    <h4 className="text-xl sm:text-2xl font-bold font-heading text-white">{oferta.plan.nombre}</h4>
                    <span className="font-mono text-lg font-bold text-white">
                        {oferta.plan.desde ? 'desde ' : ''}
                        {ars(oferta.plan.precio)}
                        <span className="text-sm text-neutral-400 font-normal">/mes + IVA</span>
                    </span>
                </div>
                <p className="mt-1 text-xs font-mono text-neutral-400">{oferta.plan.detalle}</p>

                {oferta.roi && (
                    <p className="mt-5 rounded-xl border border-[#FF5520]/30 bg-[#FF5520]/10 p-4 text-sm leading-relaxed text-neutral-100">
                        {oferta.roi}
                    </p>
                )}

                <ol className="mt-6 flex flex-col gap-4">
                    {oferta.pasos.map((paso, i) => (
                        <li key={paso.titulo} className="flex gap-3.5">
                            <span className="font-mono text-sm font-bold text-[#FFA380] bg-[#FF5520]/15 border border-[#FF5520]/30 w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                                {i + 1}
                            </span>
                            <div>
                                <p className="font-semibold text-white">{paso.titulo}</p>
                                <p className="mt-0.5 text-sm text-neutral-400 leading-relaxed">{paso.detalle}</p>
                            </div>
                        </li>
                    ))}
                </ol>

                {oferta.cupo && <p className="mt-6 text-xs font-mono text-[#FFA380]">{oferta.cupo}</p>}
            </div>
        </div>
    )
}

/** Bloque del resultado con el margen calculado a partir de los números cargados. */
export function MargenResultado({ datos }: { datos: DatosReputacion }) {
    const { filas, colorActual, titular } = calcularMargen(datos.ventas, datos.conteos, datos.esLider)
    return (
        <div className="mt-6 rounded-2xl border border-white/[0.1] bg-[#151719] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#FFA380] font-bold">
                    Tu margen real con los límites de ML Argentina
                </span>
                <span
                    className="px-3 py-0.5 rounded-full font-mono text-xs font-bold border"
                    style={{
                        color: COLOR_META[colorActual].hex,
                        borderColor: `${COLOR_META[colorActual].hex}66`,
                        backgroundColor: `${COLOR_META[colorActual].hex}1A`,
                    }}
                >
                    {COLOR_META[colorActual].label}
                </span>
            </div>
            <p className="mt-3 text-2xl sm:text-3xl font-black font-heading text-white">{titular}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {filas.map((f) => (
                    <div key={f.id} className="rounded-xl border border-white/[0.08] bg-black/40 p-3">
                        <p className="text-xs font-semibold capitalize text-neutral-200">{f.plural}</p>
                        <p className="mt-1 font-mono text-xs text-neutral-400">
                            {porcentaje(f.tasa)} de {porcentaje(f.limite)}
                        </p>
                        <p className="mt-1 font-mono text-xs" style={{ color: COLOR_META[f.color].hex }}>
                            {f.margen >= 0 ? `Margen: ${f.margen}` : `Pasado por ${-f.margen}`}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

function aEntero(valor: string): number {
    return Math.max(0, Math.floor(Number(valor) || 0))
}

/** Paso del cuestionario donde el vendedor carga sus números de reputación (opcional). */
export function PasoReputacion({
    onContinuar,
    onSaltear,
}: {
    onContinuar: (datos: DatosReputacion) => void
    onSaltear: () => void
}) {
    const [ventas, setVentas] = useState(0)
    const [conteos, setConteos] = useState<ConteosReputacion>({ reclamos: 0, cancelaciones: 0, demoras: 0 })
    const [esLider, setEsLider] = useState(false)
    const listo = ventas > 0
    const vista = listo ? calcularMargen(ventas, conteos, esLider) : null

    const campo =
        'w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 font-mono text-base font-bold text-[#FFA380] focus:outline-none focus:border-[#FF5520]/60'

    return (
        <div className="mt-6 flex flex-col gap-5">
            <div>
                <label htmlFor="rep-ventas" className="text-sm font-semibold text-white">
                    Ventas en el período que evalúa ML
                </label>
                <p className="mt-1 mb-2 text-xs text-neutral-400">
                    Últimos 60 días si tuviste 50 ventas o más; si no, últimos 365 días.
                </p>
                <input
                    id="rep-ventas"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={ventas || ''}
                    placeholder="Ej: 400"
                    onChange={(e) => setVentas(aEntero(e.target.value))}
                    className={campo}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {METRICAS.map((m) => (
                    <div key={m.id}>
                        <label htmlFor={`rep-${m.id}`} className="text-sm font-semibold text-white">
                            {m.label}
                        </label>
                        <input
                            id={`rep-${m.id}`}
                            type="number"
                            inputMode="numeric"
                            min={0}
                            value={conteos[m.id] || ''}
                            placeholder="0"
                            onChange={(e) => setConteos((prev) => ({ ...prev, [m.id]: aEntero(e.target.value) }))}
                            className={`mt-2 ${campo}`}
                        />
                    </div>
                ))}
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
                <input
                    type="checkbox"
                    checked={esLider}
                    onChange={(e) => setEsLider(e.target.checked)}
                    className="w-4 h-4 accent-[#FF5520] cursor-pointer"
                />
                <span className="text-sm text-neutral-200">Soy MercadoLíder</span>
            </label>

            {vista && (
                <p className="rounded-xl border border-[#FF5520]/30 bg-[#FF5520]/10 px-4 py-3 text-sm text-white">
                    {vista.titular}
                    {vista.masAjustada.margen > 0 ? ' antes de salir de verde.' : '.'}
                </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    type="button"
                    disabled={!listo}
                    onClick={() => onContinuar({ ventas, conteos, esLider })}
                    className="flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#FF5520] via-[#FF6E40] to-[#FF5520] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-white font-heading font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                    Calcular mi margen y seguir
                    <ArrowRight className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={onSaltear}
                    className="py-3.5 px-5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-neutral-300 hover:text-white text-sm cursor-pointer"
                >
                    No los tengo a mano, seguir
                </button>
            </div>
        </div>
    )
}
