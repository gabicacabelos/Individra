'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { MessagesSquare, Sparkles, Check } from 'lucide-react'
import { ART } from '../constants/assets'
import { CHANNELS, type Channel } from '../constants/channels'
import { Float } from '../motion'

/* ---------- Deep-dive del módulo estrella ---------- */

export function StarSpotlight() {
    const reduce = useReducedMotion()
    const points = [
        'Una sola bandeja para Mercado Libre, Tiendanube, Shopify, WhatsApp e Instagram.',
        'Una conversación por cliente: la IA reconoce el mismo comprador aunque escriba por dos canales.',
        'Responde, deriva a una persona o escala solo cuando hace falta.',
        'Tu equipo deja de saltar entre pestañas y pierde de vista cero mensajes.',
    ]
    return (
        <section id="centro" className="relative py-24 border-t border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C84214]/8 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C84214] text-white text-xs font-bold mb-6">
                        <Sparkles className="w-3.5 h-3.5" />
                        Módulo estrella
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#E8E5DE] leading-tight text-balance">
                        El Centro multicanal: donde tu operación deja de estar dispersa
                    </h2>
                    <p className="mt-4 text-[#B7B3B0] leading-relaxed text-pretty">
                        Vender en cinco lugares no debería significar revisar cinco bandejas. Individra las junta en una
                        y suma IA encima para que la mayoría de los mensajes se resuelvan solos.
                    </p>
                    <ul className="mt-8 space-y-3">
                        {points.map((p) => (
                            <li key={p} className="flex items-start gap-3">
                                <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-[#C84214]/15 border border-[#C84214]/30 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-[#C84214]" />
                                </span>
                                <span className="text-sm text-[#E8E5DE] leading-relaxed">{p}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Visual: la tienda como un solo lugar + los canales convergiendo.
                    Cada render aparece una sola vez en toda la página; el de la
                    tarjeta de "Centro multicanal" no se repite acá. */}
                <div className="relative rounded-2xl border border-[#3E3D3A] bg-[#121312]/80 p-8">
                    <div className="relative flex justify-center pb-8">
                        {/* Halo que respira: refuerza que el núcleo está activo */}
                        <motion.div
                            aria-hidden
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-[#C84214]/25 blur-3xl"
                            animate={
                                reduce
                                    ? undefined
                                    : { opacity: [0.55, 1, 0.55], scale: [0.92, 1.06, 0.92] }
                            }
                            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <Float distance={10} duration={6}>
                            <Image
                                src={ART.tiendaPhone.src}
                                alt={ART.tiendaPhone.alt}
                                width={ART.tiendaPhone.w}
                                height={ART.tiendaPhone.h}
                                quality={85}
                                sizes="512px"
                                className="relative h-44 sm:h-56 w-auto object-contain drop-shadow-[0_28px_55px_rgba(200,66,20,0.35)]"
                            />
                        </Float>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center">
                        {CHANNELS.slice(0, 3).map((c) => (
                            <ConvergeBadge key={c.name} channel={c} />
                        ))}
                        <div className="col-span-3 flex justify-center py-2">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-14 h-14 rounded-2xl bg-[#C84214] flex items-center justify-center shadow-lg shadow-[#C84214]/30">
                                    <MessagesSquare className="w-7 h-7 text-white" />
                                </div>
                                <span className="text-xs font-semibold text-[#E8E5DE]">Individra</span>
                            </div>
                        </div>
                        {CHANNELS.slice(3, 6).map((c) => (
                            <ConvergeBadge key={c.name} channel={c} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

function ConvergeBadge({ channel }: { channel: Channel }) {
    return (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-[#1E1D1C] py-3">
            <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-black"
                style={{ background: channel.tint }}
            >
                {channel.initial}
            </span>
            <span className="text-[10px] text-[#B7B3B0] text-center leading-tight px-1">{channel.name}</span>
        </div>
    )
}
