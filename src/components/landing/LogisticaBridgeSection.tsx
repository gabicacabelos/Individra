'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Truck, ShieldCheck, MapPin } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

const reveal = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
}

export function LogisticaBridgeSection() {
    return (
        <section className="relative py-16 sm:py-20 bg-[#0B0D0E] border-t border-[#3E3D3A]/40 overflow-hidden">
            {/* Subtle glow background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C84214]/5 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
                <motion.div
                    {...reveal}
                    className="rounded-3xl border border-[#3E3D3A] bg-gradient-to-br from-[#18191C] via-[#141517] to-[#0E1012] p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-2xl"
                >
                    {/* Decorative ambient badge */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#C84214]/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-8 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C84214]/30 bg-[#C84214]/10 text-xs font-mono font-semibold uppercase tracking-wider text-[#FFA380]">
                                <Truck className="w-3.5 h-3.5 text-[#C84214]" />
                                Frente 2 · Logística de Última Milla & Flex
                            </div>

                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                                ¿También operás reparto propio o coordinás con logísticas Flex?
                            </h3>

                            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
                                El control no termina cuando empaquetás la caja. Conectamos la orden con nuestra solución de entrega: coordinación nocturna de visitas por WhatsApp{' '}
                                <strong className="text-white">
                                    en pedidos de canal propio (Tiendanube, WhatsApp, venta directa)
                                </strong>
                                , bot de choferes en Telegram sin instalar apps pesadas, y el{' '}
                                <strong className="text-white">Parte del Dador</strong> para respaldar la trazabilidad real de cada entrega{' '}
                                <span className="text-[#FFA380]">
                                    ante controversias con tu logística
                                </span>
                                .
                            </p>

                            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-neutral-400">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/5">
                                    <MapPin className="w-3.5 h-3.5 text-[#C84214]" />
                                    Normalización Maps
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                    Radar de Dadores (Alertas Flex)
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/5">
                                    <Truck className="w-3.5 h-3.5 text-[#FFA380]" />
                                    Protocolo Incidente (Normativa 6/Oct)
                                </span>
                            </div>
                        </div>

                        <div className="lg:col-span-4 flex flex-col items-center justify-center gap-4 text-center lg:text-right">
                            <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
                                <Image
                                    src="/logistics_hub_3d.png"
                                    alt="Hub logístico 3D de última milla"
                                    width={440}
                                    height={440}
                                    quality={95}
                                    sizes="256px"
                                    className="object-contain drop-shadow-[0_16px_35px_rgba(200,66,20,0.35)]"
                                />
                            </div>

                            <Link
                                href="/logistica"
                                onClick={() =>
                                    trackEvent('logistica_bridge_clicked', { source: 'home_bridge_plan2' })
                                }
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#C84214] hover:bg-[#B3390F] text-white text-sm font-bold shadow-lg shadow-[#C84214]/25 hover:shadow-[#C84214]/40 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                            >
                                <span>Conocer la solución para Logística</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
