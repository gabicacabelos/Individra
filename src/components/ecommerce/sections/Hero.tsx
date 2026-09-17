'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Sparkles, Radar } from 'lucide-react'
import { UnifiedInbox } from './UnifiedInbox'

/* ---------- Hero: bandeja unificada (el módulo estrella) ---------- */

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
            {/* Fondo: glow terracota + grilla sutil (identidad del sitio) */}
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
                        Para vendedores online
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.05 }}
                        className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.05] tracking-tight text-[#E8E5DE] text-balance"
                    >
                        Todas tus ventas online,{' '}
                        <span className="text-[#C84214]">en una sola conversación</span>.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.12 }}
                        className="mt-6 text-lg text-[#B7B3B0] leading-relaxed text-pretty max-w-xl"
                    >
                        Mercado Libre, Tiendanube, Shopify, WhatsApp e Instagram llegan a un mismo lugar.
                        Individra unifica los mensajes y responde con IA: preguntas, estado del pedido,
                        reclamos y recompra, sin que saltes entre diez pestañas.
                    </motion.p>

                    {/* El diferencial real: no es un bot que repite un guion, sino uno
                        que lee el estado real de la logística antes de responder. */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.16 }}
                        className="mt-5 flex items-start gap-2.5 max-w-xl"
                    >
                        <Radar className="w-4 h-4 shrink-0 mt-0.5 text-[#C84214]" />
                        <p className="text-sm text-[#B7B3B0] leading-relaxed text-pretty">
                            No es un chatbot que repite un guion: se conecta con el estado real del
                            envío para avisar antes de que el cliente tenga que preguntar.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.19 }}
                        className="mt-8 flex flex-wrap gap-3"
                    >
                        <Link
                            href="/diagnostico?origen=ecommerce"
                            className="group inline-flex items-center gap-2 px-6 py-3.5 bg-[#C84214] text-white font-bold rounded-xl shadow-lg shadow-[#C84214]/25 hover:bg-[#B3390F] active:scale-[0.98] transition-all duration-200"
                        >
                            Hacer el diagnóstico gratis
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                        <a
                            href="#capacidades"
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[#3E3D3A] text-[#E8E5DE] font-semibold hover:border-[#C84214]/50 hover:bg-white/5 transition-all duration-200"
                        >
                            Ver qué automatiza
                        </a>
                    </motion.div>
                </div>

                {/* Bandeja unificada (mock) */}
                <UnifiedInbox />
            </div>
        </section>
    )
}
