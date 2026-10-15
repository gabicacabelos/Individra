'use client'

import { useId } from 'react'

/*
 * Costo de las entregas fallidas. La usan /logistica (desktop) y el
 * autodiagnóstico de logística, con la misma cuenta.
 */

/**
 * Costo directo auditado por cada entrega fallida en AMBA / Argentina:
 * - Gasoil desvío promedio 8 km (12 L/100km × ARS $2.198/L): ARS $2.110
 * - Tiempo chofer perdido 20 min (CCT 40/89 costo empresa ARS $8.730/h): ARS $2.880
 * - Re-ruteo, manipulación en depósito y segundo viaje al día siguiente: ARS $4.990
 * Total por entrega fallida: ARS $9.980
 */
export const COSTO_FALLO_UNITARIO_ARS = 9980
export const DIAS_HABILES_MES = 22

export function formatearArs(valor: number): string {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0,
    }).format(Math.round(valor))
}

export function calcularEconomiaLogistica(entregasDia: number, porcentajeFallos: number) {
    const fallosDia = entregasDia * (porcentajeFallos / 100)
    const fallosMes = Math.round(fallosDia * DIAS_HABILES_MES)
    const perdidaDiariaArs = Math.round(fallosDia * COSTO_FALLO_UNITARIO_ARS)
    const perdidaMensualArs = Math.round(fallosDia * DIAS_HABILES_MES * COSTO_FALLO_UNITARIO_ARS)
    const ahorroMensualMinArs = Math.round(perdidaMensualArs * 0.5)
    const ahorroMensualMaxArs = Math.round(perdidaMensualArs * 0.6)

    return {
        entregasDia,
        porcentajeFallos,
        costoUnitarioArs: COSTO_FALLO_UNITARIO_ARS,
        diasHabilesMes: DIAS_HABILES_MES,
        fallosDia: Number(fallosDia.toFixed(1)),
        fallosMes,
        perdidaDiariaArs,
        perdidaMensualArs,
        ahorroMensualMinArs,
        ahorroMensualMaxArs,
    }
}

interface CalculadoraVivaProps {
    entregasDia: number
    setEntregasDia: (v: number) => void
    porcentajeFallos: number
    setPorcentajeFallos: (v: number) => void
    compacta?: boolean
}

export function CalculadoraFinancieraViva({
    entregasDia,
    setEntregasDia,
    porcentajeFallos,
    setPorcentajeFallos,
    compacta = false,
}: CalculadoraVivaProps) {
    const econ = calcularEconomiaLogistica(entregasDia, porcentajeFallos)
    const id = useId()

    return (
        <div className="rounded-2xl border border-[#FF5520]/35 bg-[#151719] p-5 sm:p-6 shadow-xl shadow-black/30">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3.5">
                <div>
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#FFA380]">
                        Calculadora en vivo
                    </span>
                    <h3 className="mt-0.5 text-base sm:text-lg font-bold text-[#E8E5DE]">
                        Costo real de entregas fallidas en tu operación
                    </h3>
                </div>
                <span className="rounded-full border border-[#3E3D3A] bg-[#0B0D0E] px-3 py-1 font-mono text-xs text-[#B7B3B0]">
                    {entregasDia}/día × {porcentajeFallos}% × {formatearArs(COSTO_FALLO_UNITARIO_ARS)}
                </span>
            </div>

            {/* Sliders interactivos */}
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="rounded-xl border border-[#3E3D3A] bg-[#0B0D0E] p-4">
                    <div className="flex items-baseline justify-between">
                        <label htmlFor={`${id}-entregas`} className="text-xs font-medium uppercase tracking-wider text-[#B7B3B0]">
                            Entregas / paradas por día
                        </label>
                        <span className="font-mono text-xl font-bold text-white">{entregasDia}</span>
                    </div>
                    <input
                        id={`${id}-entregas`}
                        type="range"
                        min={15}
                        max={500}
                        step={5}
                        value={entregasDia}
                        onChange={(e) => setEntregasDia(Number(e.target.value))}
                        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#262523] accent-[#FF5520]"
                    />
                    <div className="mt-1.5 flex justify-between font-mono text-[11px] text-[#8E8B88]">
                        <span>15/día</span>
                        <span>100/día</span>
                        <span>300/día</span>
                        <span>500/día</span>
                    </div>
                </div>

                <div className="rounded-xl border border-[#3E3D3A] bg-[#0B0D0E] p-4">
                    <div className="flex items-baseline justify-between">
                        <label htmlFor={`${id}-fallos`} className="text-xs font-medium uppercase tracking-wider text-[#B7B3B0]">
                            % Fallos al 1° intento
                        </label>
                        <span className="font-mono text-xl font-bold text-[#FF6E40]">{porcentajeFallos}%</span>
                    </div>
                    <input
                        id={`${id}-fallos`}
                        type="range"
                        min={1}
                        max={25}
                        step={1}
                        value={porcentajeFallos}
                        onChange={(e) => setPorcentajeFallos(Number(e.target.value))}
                        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#262523] accent-[#FF5520]"
                    />
                    <div className="mt-1.5 flex justify-between font-mono text-[11px] text-[#8E8B88]">
                        <span>1%</span>
                        <span>8% (prom.)</span>
                        <span>15%</span>
                        <span>25%</span>
                    </div>
                </div>
            </div>

            {/* Resultados en vivo: la fuga mensual manda, el resto la acompaña */}
            <div className="mt-4 rounded-xl border border-[#FF5520]/50 bg-[#FF5520]/10 p-4 sm:p-5 sm:flex sm:items-end sm:justify-between sm:gap-4">
                <div>
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-[#E8E5DE]">Fuga mensual</span>
                    <span className="mt-1 block font-mono text-3xl sm:text-4xl font-bold text-[#FF6E40] tabular-nums whitespace-nowrap">
                        {formatearArs(econ.perdidaMensualArs)}
                    </span>
                </div>
                <span className="mt-1 sm:mt-0 block text-xs text-[#B7B3B0] sm:text-right">
                    {econ.fallosMes} viajes en falso por mes
                    <br className="hidden sm:block" /> ({DIAS_HABILES_MES} días hábiles × {formatearArs(COSTO_FALLO_UNITARIO_ARS)})
                </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#3E3D3A] bg-[#0B0D0E]/90 p-3.5">
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-[#8E8B88]">Por día</span>
                    <span className="mt-1 block font-mono text-base sm:text-xl font-bold text-[#E8E5DE] tabular-nums whitespace-nowrap">
                        {formatearArs(econ.perdidaDiariaArs)}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-[#8E8B88]">{econ.fallosDia} entregas fallidas por día</span>
                </div>
                <div className="rounded-xl border border-[#3E3D3A] bg-[#0B0D0E]/90 p-3.5">
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-[#FFA380]">En 12 meses</span>
                    <span className="mt-1 block font-mono text-base sm:text-xl font-bold text-white tabular-nums whitespace-nowrap">
                        {formatearArs(econ.perdidaMensualArs * 12)}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-[#8E8B88]">Medimos cuánto recuperás en un piloto de 30 días</span>
                </div>
            </div>

            {!compacta && (
                <p className="mt-3.5 pt-2 text-[11px] text-[#8E8B88]">
                    * Costo unitario auditado ({formatearArs(COSTO_FALLO_UNITARIO_ARS)}/fallo): Gasoil desvío 8 km ($2.110) + 20 min
                    chofer CCT 40/89 ($2.880) + Re-ruteo y 2° viaje ($4.990).
                </p>
            )}
        </div>
    )
}
