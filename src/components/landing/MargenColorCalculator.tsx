'use client'

import { useState, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { Gauge, ArrowRight, Info, CheckCircle2 } from 'lucide-react'
import {
    COLOR_META,
    METRICAS,
    calcularMargen,
    porcentaje,
    type ConteosReputacion,
} from '@/lib/reputacionML'
import { trackEvent } from '@/lib/analytics'

function aEntero(valor: string): number {
    return Math.max(0, Math.floor(Number(valor) || 0))
}

export function MargenColorCalculator() {
    const [ventas, setVentas] = useState<number>(400)
    const [conteos, setConteos] = useState<ConteosReputacion>({
        reclamos: 4,
        cancelaciones: 2,
        demoras: 20,
    })
    const [esLider, setEsLider] = useState(false)

    // Un evento por visita: alcanza para saber cuánta gente toca la calculadora
    const usada = useRef(false)
    function marcarUso(campo: string) {
        if (usada.current) return
        usada.current = true
        trackEvent('home_calculadora_usada', { campo })
    }

    const resultado = useMemo(() => calcularMargen(ventas, conteos, esLider), [ventas, conteos, esLider])

    const { filas, colorActual, masAjustada, ventasPorReclamoExtra, titular } = resultado
    const objetivo = esLider ? 'el límite de MercadoLíder' : 'salir de verde'

    const whatsappMessage = useMemo(() => {
        const text =
            `Hola Gabriel, calculé mi margen de color en la web de INDIVIDRA:\n` +
            `• Ventas en el período: ${ventas}\n` +
            filas.map((f) => `• ${f.label}: ${f.cantidad} (${porcentaje(f.tasa)})`).join('\n') +
            `\n• Resultado: ${titular}\n\n` +
            `Quiero recibir las alertas de reclamos con plazo en el piloto de 30 días.`
        return `https://wa.me/5491160152435?text=${encodeURIComponent(text)}`
    }, [ventas, filas, titular])

    return (
        <section
            id="calculadora"
            className="relative py-24 sm:py-32 bg-[#0B0D0E] border-t border-[#3E3D3A]/50 overflow-hidden"
        >
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5520]/10 border border-[#FF5520]/30 text-[#FFA380] text-xs font-mono uppercase tracking-[0.18em]">
                        <Gauge className="w-3.5 h-3.5 text-[#FF5520]" />
                        Calculadora de margen de color
                    </span>
                    <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
                        ¿Cuántos reclamos te faltan{' '}
                        <span className="bg-gradient-to-r from-[#FF5520] via-[#FFA380] to-white bg-clip-text text-transparent">
                            para bajar de color?
                        </span>
                    </h2>
                    <p className="mt-4 text-neutral-300 text-base sm:text-lg leading-relaxed">
                        Cargá los números que ves en la sección <strong className="text-white">Reputación</strong> de tu cuenta de Mercado Libre. Te mostramos cuánto margen te queda en cada métrica, con los límites oficiales para Argentina.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Inputs */}
                    <div className="lg:col-span-6 card-obsidian sheen-top rounded-3xl border border-white/[0.12] bg-gradient-to-br from-[#121418] via-[#0F1115] to-[#0A0C0E] p-6 sm:p-8 space-y-6 shadow-xl">
                        <div>
                            <label htmlFor="calc-ventas" className="text-sm sm:text-base font-semibold text-white font-heading">
                                Ventas en el período que evalúa ML
                            </label>
                            <p className="text-xs text-neutral-400 mt-1 mb-3">
                                Si tuviste 101 ventas o más en los últimos 60 días, cargá esos 60 días. Si tuviste menos, ML mira tus últimos 365 días.
                            </p>
                            <input
                                id="calc-ventas"
                                type="number"
                                inputMode="numeric"
                                min={0}
                                value={ventas}
                                onChange={(e) => {
                                    marcarUso('ventas')
                                    setVentas(aEntero(e.target.value))
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 font-mono text-lg font-bold text-[#FFA380] focus:outline-none focus:border-[#FF5520]/60"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 border-t border-white/[0.08]">
                            {METRICAS.map((m) => (
                                <div key={m.id}>
                                    <label htmlFor={`calc-${m.id}`} className="text-sm font-semibold text-white font-heading">
                                        {m.label}
                                    </label>
                                    <p className="text-[11px] text-neutral-400 mt-1 mb-2 sm:min-h-[44px]">{m.ayuda}</p>
                                    <input
                                        id={`calc-${m.id}`}
                                        type="number"
                                        inputMode="numeric"
                                        min={0}
                                        value={conteos[m.id]}
                                        onChange={(e) => {
                                            marcarUso(m.id)
                                            setConteos((prev) => ({ ...prev, [m.id]: aEntero(e.target.value) }))
                                        }}
                                        className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 font-mono text-base font-bold text-[#FFA380] focus:outline-none focus:border-[#FF5520]/60"
                                    />
                                </div>
                            ))}
                        </div>

                        <label className="flex items-center gap-3 pt-5 border-t border-white/[0.08] cursor-pointer">
                            <input
                                type="checkbox"
                                checked={esLider}
                                onChange={(e) => {
                                    marcarUso('es_lider')
                                    setEsLider(e.target.checked)
                                }}
                                className="w-4 h-4 accent-[#FF5520] cursor-pointer"
                            />
                            <span className="text-sm text-neutral-200">
                                Soy MercadoLíder (los límites para mantener la medalla son más bajos)
                            </span>
                        </label>
                    </div>

                    {/* Resultado */}
                    <div className="lg:col-span-6 card-obsidian sheen-top rounded-3xl border border-[#FF5520]/40 bg-gradient-to-b from-[#1C100C] via-[#141014] to-[#0A0D10] p-6 sm:p-8 shadow-[0_20px_60px_-10px_rgba(255,85,32,0.2)] relative overflow-hidden">
                        <div className="relative z-10 flex items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                            <span className="text-[11px] font-mono uppercase tracking-widest text-[#FFA380] font-bold">
                                Tu termómetro hoy
                            </span>
                            <span
                                className="px-3 py-1 rounded-full font-mono text-xs font-bold border"
                                style={{
                                    color: COLOR_META[colorActual].hex,
                                    borderColor: `${COLOR_META[colorActual].hex}66`,
                                    backgroundColor: `${COLOR_META[colorActual].hex}1A`,
                                }}
                            >
                                {COLOR_META[colorActual].label}
                            </span>
                        </div>

                        <div className="relative z-10 mt-6">
                            <div className="text-3xl sm:text-4xl font-black text-white font-heading tracking-tight leading-tight">
                                {titular}
                            </div>
                            <p className="mt-2 text-sm text-neutral-300">
                                {ventas === 0
                                    ? 'Con tus ventas del período calculamos cuánto margen te queda.'
                                    : masAjustada.margen > 0
                                    ? `antes de ${objetivo}. Es tu métrica más ajustada.`
                                    : masAjustada.margen === 0
                                      ? `Estás justo en el límite de ${esLider ? 'MercadoLíder' : 'verde'}.`
                                      : esLider && colorActual === 'verde'
                                        ? 'Seguís en verde, pero fuera del límite para mantener MercadoLíder.'
                                        : 'Es la métrica que hoy te saca de verde.'}
                            </p>
                        </div>

                        <div className="relative z-10 mt-6 space-y-3">
                            {filas.map((f) => {
                                const relleno = f.limite > 0 ? Math.min(100, (f.tasa / f.limite) * 100) : 0
                                return (
                                    <div key={f.id} className="p-4 rounded-2xl bg-black/50 border border-white/[0.08]">
                                        <div className="flex items-baseline justify-between gap-3">
                                            <span className="text-sm font-semibold text-neutral-200 font-heading capitalize">
                                                {f.plural}
                                            </span>
                                            <span className="font-mono text-xs text-neutral-400">
                                                {porcentaje(f.tasa)} de {porcentaje(f.limite)}
                                            </span>
                                        </div>
                                        <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                            <div
                                                className="h-full rounded-full"
                                                style={{ width: `${relleno}%`, backgroundColor: COLOR_META[f.color].hex }}
                                            />
                                        </div>
                                        <p className="mt-2 text-xs font-mono text-neutral-400">
                                            {f.margen >= 0
                                                ? `Margen: ${f.margen} de ${f.permitidos} permitidos`
                                                : `Pasado por ${-f.margen} (límite: ${f.permitidos})`}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>

                        {ventas > 0 && (
                            <p className="relative z-10 mt-4 text-xs text-neutral-300 leading-relaxed">
                                Cada ~{ventasPorReclamoExtra} ventas sin reclamo te suman 1 reclamo de margen.
                            </p>
                        )}

                        <div className="relative z-10 mt-5 p-3 rounded-xl bg-black/40 border border-white/5 flex items-start gap-2.5">
                            <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                                Límites publicados por Mercado Libre para Argentina. Es una foto de hoy: la ventana es móvil, así que cuando salen ventas viejas el margen cambia. En el <strong>Piloto de 30 días</strong> lo recalculamos todos los días con los datos de tu cuenta y te avisamos cada reclamo con su plazo.
                            </p>
                        </div>

                        <div className="relative z-10 mt-6 space-y-3">
                            <a
                                href={whatsappMessage}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() =>
                                    trackEvent('home_calculadora_cta_clicked', {
                                        color: colorActual,
                                        margen: masAjustada.margen,
                                        metrica_ajustada: masAjustada.id,
                                        ventas,
                                        es_lider: esLider,
                                        usada: usada.current,
                                    })
                                }
                                className="w-full py-4 px-6 bg-gradient-to-r from-[#FF5520] via-[#FF6E40] to-[#FF5520] hover:brightness-110 text-white font-heading font-bold text-sm sm:text-base rounded-2xl shadow-[0_4px_30px_rgba(255,85,32,0.4)] flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer active:scale-[0.99]"
                            >
                                Quiero las alertas con plazo en mi cuenta
                                <ArrowRight className="w-4 h-4" />
                            </a>
                            <a
                                href="#contacto"
                                className="w-full py-3 px-4 bg-white/[0.03] hover:bg-white/[0.08] text-neutral-300 hover:text-white font-mono text-xs sm:text-sm rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5520]" />
                                O elegí un horario en el calendario (30 min)
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
