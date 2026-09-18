'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { MessagesSquare, Sparkles, Check, Zap } from 'lucide-react'
import { ART } from '../constants/assets'
import { CHANNELS } from '../constants/channels'
import { Float } from '../motion'

export function UnifiedInbox() {
    const messages = [
        { ch: CHANNELS[0], text: '¿Tenés stock del talle L?', tag: 'Pregunta' },
        { ch: CHANNELS[3], text: '¿Cuándo llega mi pedido #4821?', tag: 'Envío' },
        { ch: CHANNELS[4], text: 'Quiero cambiar el color', tag: 'Post-venta' },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl border border-[#3E3D3A] bg-[#121312]/90 backdrop-blur p-5 shadow-2xl shadow-black/40"
        >
            {/* Render 3D asomando por el costado derecho. Va a media altura, no
                arriba: los avatares de canales ocupan el ángulo superior derecho
                y la respuesta de la IA el inferior, así que la franja del medio
                es la única parte del flanco derecho que queda libre. */}
            {/* El voladizo es responsivo a propósito: por debajo de xl el panel
                llega casi al borde del viewport y la sección tiene overflow-hidden,
                así que un saliente grande se recortaría. */}
            <div className="hidden sm:block absolute top-[26%] -right-4 xl:-right-10 2xl:-right-20 z-20 pointer-events-none">
                <Float distance={8} duration={4.8} delay={0.3}>
                    {/* Levitación pura, sin halo ni sombra proyectada: el emblema 3D
                        del home principal sigue el mismo criterio. */}
                    <Image
                        src={ART.multicanal.src}
                        alt={ART.multicanal.alt}
                        width={ART.multicanal.w}
                        height={ART.multicanal.h}
                        quality={85}
                        sizes="384px"
                        className="relative h-32 sm:h-36 xl:h-44 w-auto object-contain"
                        priority
                    />
                </Float>
            </div>

            {/* header del panel */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#C84214]/15 border border-[#C84214]/30 flex items-center justify-center">
                        <MessagesSquare className="w-4 h-4 text-[#C84214]" />
                    </div>
                    <div>
                        <p className="text-[#E8E5DE] text-sm font-semibold leading-none">Bandeja unificada</p>
                        <p className="text-[#B7B3B0] text-xs mt-1">6 canales conectados</p>
                    </div>
                </div>
                <div className="flex -space-x-2">
                    {CHANNELS.slice(0, 5).map((c) => (
                        <span
                            key={c.name}
                            className="w-6 h-6 rounded-full border border-[#121312] flex items-center justify-center text-[9px] font-bold text-black"
                            style={{ background: c.tint }}
                            title={c.name}
                        >
                            {c.initial}
                        </span>
                    ))}
                </div>
            </div>

            {/* mensajes entrantes de distintos canales */}
            <div className="space-y-3 py-4">
                {messages.map((m, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + i * 0.15 }}
                        className="flex items-start gap-2.5"
                    >
                        <span
                            className="mt-0.5 w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[9px] font-bold text-black"
                            style={{ background: m.ch.tint }}
                        >
                            {m.ch.initial}
                        </span>
                        <div className="rounded-2xl rounded-tl-sm bg-[#1E1D1C] border border-white/5 px-3.5 py-2 max-w-[85%]">
                            <p className="text-[#E8E5DE] text-sm leading-snug">{m.text}</p>
                            <span className="text-[10px] text-[#B7B3B0]">{m.ch.name} · {m.tag}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* respuesta IA unificada */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="flex items-start gap-2.5 justify-end"
            >
                <div className="rounded-2xl rounded-tr-sm bg-[#C84214]/15 border border-[#C84214]/25 px-3.5 py-2 max-w-[88%]">
                    <div className="flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-3 h-3 text-[#C84214]" />
                        <span className="text-[10px] font-semibold text-[#E8A07E]">Individra resolvió los 3, sin salir del panel</span>
                    </div>
                    <p className="text-[#E8E5DE] text-sm leading-snug">
                        Talle L: queda 1 en stock. Pedido #4821: en camino, llega mañana. Cambio de color: iniciado.
                    </p>
                    {/* Sin esto, quien tiene 100+ SKUs desconfía: "¿de dónde saca que
                        queda 1?". La etiqueta deja claro que lee el catálogo real,
                        no que inventa disponibilidad. */}
                    <div className="mt-2 pt-2 border-t border-[#C84214]/20 flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-[#E8A07E]" />
                        <span className="text-[10px] text-[#E8A07E]">
                            Sincronizado en tiempo real con tu catálogo / ERP
                        </span>
                    </div>
                </div>
                <span className="mt-0.5 w-6 h-6 shrink-0 rounded-full bg-[#C84214] flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                </span>
            </motion.div>
        </motion.div>
    )
}
