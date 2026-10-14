'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Sparkles, ShieldCheck, Clock } from 'lucide-react'
import { UnifiedInbox } from './UnifiedInbox'

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
            {/* Fondo: glow terracota + grilla sutil */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C84214]/12 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(183,179,176,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(183,179,176,0.03)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />

            <div className="relative z-10 max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
                {/* Copy */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C84214]/30 bg-[#C84214]/10 text-[#E8A07E] text-xs font-semibold mb-6"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Mercado Libre + Tiendanube + WhatsApp
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.05 }}
                        className="text-4xl sm:text-5xl lg:text-[3.2rem] font-bold leading-[1.08] tracking-tight text-[#E8E5DE] text-balance"
                    >
                        Cobro verificado en WhatsApp y{' '}
                        <span className="text-[#C84214]">stock blindado en 1 clic</span>.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.12 }}
                        className="mt-6 text-lg text-[#B7B3B0] leading-relaxed text-pretty max-w-xl"
                    >
                        Filtramos las preguntas repetitivas por detrás y en tu consola solo aparecen, ordenadas por urgencia e impacto en plata, las situaciones donde tocar un botón valida el comprobante de transferencia y descuenta el stock en Mercado Libre y Tiendanube a la vez.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.16 }}
                        className="mt-5 flex items-start gap-2.5 max-w-xl"
                    >
                        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#C84214]" />
                        <p className="text-sm text-[#B7B3B0] leading-relaxed text-pretty">
                            No es otro CRM de chat más: es un motor de ejecución entre canales que evita sobreventas cruzadas y comprobantes repetidos.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.19 }}
                        className="mt-8 flex flex-col items-start gap-2"
                    >
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/#calculadora"
                                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-[#C84214] text-white font-bold rounded-xl shadow-lg shadow-[#C84214]/25 hover:bg-[#B3390F] active:scale-[0.98] transition-all duration-200"
                            >
                                Calcular mi pérdida hoy
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                            <Link
                                href="/#consola-operativa"
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[#3E3D3A] text-[#E8E5DE] font-semibold hover:border-[#C84214]/50 hover:bg-white/5 transition-all duration-200"
                            >
                                Probar botones de 1 clic
                            </Link>
                        </div>
                        <p className="text-xs text-[#8E8B88] mt-1 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#C84214]" />
                            <span>Validado en tu operación con un Piloto Medido de 30 días</span>
                        </p>
                    </motion.div>
                </div>

                {/* Bandeja / Consola */}
                <UnifiedInbox />
            </div>
        </section>
    )
}
