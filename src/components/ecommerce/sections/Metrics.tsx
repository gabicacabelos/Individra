'use client'

import { motion } from 'framer-motion'
import { Timer, Moon, TrendingDown } from 'lucide-react'

/* ---------- Cintillo de métricas ----------
   Valores estimativos y conservadores a partir de operaciones similares:
   no son un compromiso contractual, son el orden de magnitud esperable.
   Se muestran como "típico/estimado" a propósito, para no prometer un
   número puntual que no podemos sostener caso por caso. */

const STATS = [
    {
        icon: Timer,
        value: '< 60s',
        label: 'Tiempo promedio de primera respuesta',
    },
    {
        icon: Moon,
        value: '24/7',
        label: 'Cobertura activa, incluidas noches y fines de semana',
    },
    {
        icon: TrendingDown,
        value: '-30%',
        label: 'Reducción típica de reclamos escalados a mediación',
    },
]

export function Metrics() {
    return (
        <section className="relative border-t border-white/5 py-14">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid sm:grid-cols-3 gap-4">
                    {STATS.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="flex items-start gap-3.5 rounded-2xl border border-[#3E3D3A] bg-[#121312] px-5 py-4"
                        >
                            <div className="w-10 h-10 shrink-0 rounded-xl bg-[#C84214]/15 border border-[#C84214]/30 flex items-center justify-center">
                                <s.icon className="w-5 h-5 text-[#C84214]" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[#E8E5DE] leading-none">{s.value}</p>
                                <p className="mt-1.5 text-xs text-[#B7B3B0] leading-snug text-pretty">{s.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <p className="mt-4 text-center text-[11px] text-[#6B6865]">
                    Estimado a partir de operaciones similares con Individra.
                </p>
            </div>
        </section>
    )
}
