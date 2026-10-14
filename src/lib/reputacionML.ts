/**
 * Límites de reputación de Mercado Libre Argentina (MLA), tomados de
 * developers.mercadolibre.com.ar/es_ar/reputacion-de-vendedores.
 * Cada valor es la tasa máxima para quedarse en ese color.
 */
export const LIMITES_MLA = {
    reclamos: { lider: 0.01, verde: 0.015, amarillo: 0.03, naranja: 0.06 },
    cancelaciones: { lider: 0.005, verde: 0.01, amarillo: 0.025, naranja: 0.03 },
    demoras: { lider: 0.08, verde: 0.1, amarillo: 0.15, naranja: 0.22 },
} as const

export type Metrica = keyof typeof LIMITES_MLA
export type ColorTermometro = 'verde' | 'amarillo' | 'naranja' | 'rojo'
export type ConteosReputacion = Record<Metrica, number>

export const COLOR_META: Record<ColorTermometro, { label: string; hex: string }> = {
    verde: { label: 'Verde', hex: '#4ADE80' },
    amarillo: { label: 'Amarillo', hex: '#FBBF24' },
    naranja: { label: 'Naranja', hex: '#FB923C' },
    rojo: { label: 'Rojo', hex: '#EF4444' },
}
const ORDEN_COLOR: ColorTermometro[] = ['verde', 'amarillo', 'naranja', 'rojo']

export const METRICAS: { id: Metrica; label: string; singular: string; plural: string; ayuda: string }[] = [
    {
        id: 'reclamos',
        label: 'Ventas con reclamo',
        singular: 'reclamo',
        plural: 'reclamos',
        ayuda: 'Reclamos abiertos por compradores en el período.',
    },
    {
        id: 'cancelaciones',
        label: 'Ventas que cancelaste vos',
        singular: 'cancelación',
        plural: 'cancelaciones',
        ayuda: 'Cancelaciones hechas por vos, sin reclamo de por medio.',
    },
    {
        id: 'demoras',
        label: 'Despachos con demora',
        singular: 'demora',
        plural: 'demoras',
        ayuda: 'Paquetes que el correo colectó después del horario límite.',
    },
]

function colorPara(metrica: Metrica, tasa: number): ColorTermometro {
    const l = LIMITES_MLA[metrica]
    if (tasa <= l.verde) return 'verde'
    if (tasa <= l.amarillo) return 'amarillo'
    if (tasa <= l.naranja) return 'naranja'
    return 'rojo'
}

export function porcentaje(valor: number): string {
    return `${(valor * 100).toLocaleString('es-AR', { maximumFractionDigits: 2 })}%`
}

/** Margen por métrica, color actual y métrica más ajustada. */
export function calcularMargen(ventas: number, conteos: ConteosReputacion, esLider: boolean) {
    const filas = METRICAS.map((m) => {
        const cantidad = Math.min(conteos[m.id], ventas)
        const tasa = ventas > 0 ? cantidad / ventas : 0
        const limite = esLider ? LIMITES_MLA[m.id].lider : LIMITES_MLA[m.id].verde
        // Tasa ≤ límite: entran floor(límite × ventas) incidentes sin pasarse.
        const permitidos = Math.floor(limite * ventas + 1e-9)
        const margen = permitidos - cantidad
        return { ...m, cantidad, tasa, limite, permitidos, margen, color: colorPara(m.id, tasa) }
    })

    // El color del termómetro lo marca la métrica que peor está.
    const colorActual = filas.reduce<ColorTermometro>(
        (peor, f) => (ORDEN_COLOR.indexOf(f.color) > ORDEN_COLOR.indexOf(peor) ? f.color : peor),
        'verde'
    )
    const masAjustada = filas.reduce((min, f) => (f.margen < min.margen ? f : min), filas[0])
    const ventasPorReclamoExtra = Math.ceil(1 / filas[0].limite)

    const titular =
        ventas === 0
            ? 'Cargá tus ventas para calcular tu margen'
            : masAjustada.margen < 0
              ? `Ya te pasaste del límite en ${masAjustada.plural}`
              : masAjustada.margen === 0
                ? `Un ${masAjustada.singular} más y bajás de color`
                : masAjustada.margen === 1
                  ? `Te queda 1 ${masAjustada.singular}`
                  : `Te quedan ${masAjustada.margen} ${masAjustada.plural}`

    return { filas, colorActual, masAjustada, ventasPorReclamoExtra, titular }
}
