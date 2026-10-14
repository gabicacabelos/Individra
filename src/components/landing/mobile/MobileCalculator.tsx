'use client'

import { useMemo, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import {
    COLOR_META,
    METRICAS,
    calcularMargen,
    porcentaje,
    type ConteosReputacion,
} from '@/lib/reputacionML'
import { trackEvent } from '@/lib/analytics'
import { WHATSAPP_NUMERO } from './contacto'

function aEntero(valor: string): number {
    return Math.max(0, Math.floor(Number(valor) || 0))
}

// Versión compacta de MargenColorCalculator: el resultado arriba y los campos abajo,
// para que en el celular se vea la respuesta sin tener que scrollear.
export function MobileCalculator() {
    const [ventas, setVentas] = useState(400)
    const [conteos, setConteos] = useState<ConteosReputacion>({ reclamos: 4, cancelaciones: 2, demoras: 20 })
    const [esLider, setEsLider] = useState(false)

    const { filas, colorActual, masAjustada, titular } = useMemo(
        () => calcularMargen(ventas, conteos, esLider),
        [ventas, conteos, esLider]
    )

    const usada = useRef(false)
    function marcarUso(campo: string) {
        if (usada.current) return
        usada.current = true
        trackEvent('home_calculadora_usada', { campo, version: 'mobile' })
    }

    const whatsappHref = useMemo(() => {
        const text =
            `Hola Gabriel, calculé mi margen de color en la web de INDIVIDRA:\n` +
            `• Ventas en el período: ${ventas}\n` +
            filas.map((f) => `• ${f.label}: ${f.cantidad} (${porcentaje(f.tasa)})`).join('\n') +
            `\n• Resultado: ${titular}\n\n` +
            `Quiero recibir las alertas de reclamos con plazo en el piloto de 30 días.`
        return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(text)}`
    }, [ventas, filas, titular])

    const color = COLOR_META[colorActual]

    return (
        <div className="space-y-4">
            {/* Resultado */}
            <div
                className="rounded-2xl border p-5"
                style={{ borderColor: `${color.hex}55`, backgroundColor: `${color.hex}0D` }}
                aria-live="polite"
            >
                <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">Tu termómetro</span>
                    <span
                        className="px-2.5 py-0.5 rounded-full font-mono text-xs font-bold border"
                        style={{ color: color.hex, borderColor: `${color.hex}66` }}
                    >
                        {color.label}
                    </span>
                </div>
                <p className="mt-3 text-2xl font-heading font-extrabold text-white leading-tight">{titular}</p>
                {ventas > 0 && masAjustada.margen > 0 && (
                    <p className="mt-1 text-sm text-neutral-300">
                        antes de {esLider ? 'perder MercadoLíder' : 'salir de verde'}.
                    </p>
                )}
                <p className="mt-4 text-[11px] font-mono uppercase tracking-widest text-neutral-500">Margen por métrica</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                    {filas.map((f) => (
                        <div key={f.id} className="rounded-xl bg-black/40 px-2.5 py-2">
                            <div className="text-[11px] text-neutral-400 capitalize">{f.plural}</div>
                            <div className="font-mono text-lg font-bold" style={{ color: COLOR_META[f.color].hex }}>
                                {f.margen >= 0 ? f.margen : `−${-f.margen}`}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Campos */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
                <label className="block">
                    <span className="text-sm font-semibold text-white">Ventas de los últimos 60 días</span>
                    <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        value={ventas}
                        onChange={(e) => {
                            marcarUso('ventas')
                            setVentas(aEntero(e.target.value))
                        }}
                        className="mt-2 w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 font-mono text-lg font-bold text-[#FFA380] focus:outline-none focus:border-[#FF5520]/60"
                    />
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {METRICAS.map((m) => (
                        <label key={m.id} className="block">
                            <span className="text-xs font-semibold text-white capitalize">{m.plural}</span>
                            <input
                                type="number"
                                inputMode="numeric"
                                min={0}
                                value={conteos[m.id]}
                                onChange={(e) => {
                                    marcarUso(m.id)
                                    setConteos((prev) => ({ ...prev, [m.id]: aEntero(e.target.value) }))
                                }}
                                className="mt-1.5 w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 font-mono text-base font-bold text-[#FFA380] focus:outline-none focus:border-[#FF5520]/60"
                            />
                        </label>
                    ))}
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={esLider}
                        onChange={(e) => {
                            marcarUso('es_lider')
                            setEsLider(e.target.checked)
                        }}
                        className="w-5 h-5 accent-[#FF5520]"
                    />
                    <span className="text-sm text-neutral-300">Soy MercadoLíder</span>
                </label>
                <details className="group text-xs text-neutral-400">
                    <summary className="cursor-pointer list-none text-[#FFA380] font-medium">
                        ¿De dónde saco estos números?
                    </summary>
                    <p className="mt-2 leading-relaxed">
                        Están en la sección Reputación de tu cuenta de Mercado Libre. Si tuviste menos de 50 ventas en 60 días, ML
                        mira los últimos 365 días. Usamos los límites publicados por ML para Argentina; en el piloto lo
                        recalculamos todos los días con tu cuenta real.
                    </p>
                </details>
            </div>

            <a
                href={whatsappHref}
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
                        version: 'mobile',
                    })
                }
                className="w-full py-4 px-5 bg-[#FF5520] text-white font-heading font-bold text-base rounded-2xl flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
            >
                Quiero esta alerta en mi cuenta
                <ArrowRight className="w-4 h-4" />
            </a>
        </div>
    )
}
