'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type Props = {
    pains: string[]
}

/* Bandeja de administración inundada: la MISMA pregunta, de distintos
   clientes, apilándose. Es el dolor #1 hecho imagen. Estética WhatsApp
   pero en la paleta violeta/cyan de la landing. */
const inboxRows = [
    { initials: 'DS', name: 'Distribuidora Sur', msg: '¿Dónde está mi pedido?', time: '9:02', unread: 3 },
    { initials: 'LN', name: 'Logística Norte', msg: '¿Ya salió el envío de hoy?', time: '9:01', unread: 5 },
    { initials: 'MO', name: 'Mayorista Oeste', msg: 'Hace 2 días que lo espero…', time: '9:00', unread: 2 },
    { initials: 'PY', name: 'Pedidos Ya', msg: '¿Dónde está mi pedido??', time: '8:58', unread: 8 },
]

function FloodedInbox() {
    const reduce = useReducedMotion()
    return (
        <div aria-hidden className="relative w-full max-w-[280px] rounded-[26px] bg-gradient-to-b from-white/20 via-white/[0.05] to-white/10 p-[1.5px] shadow-[0_24px_70px_-24px_rgba(139,92,246,0.55)]">
            <div className="rounded-[25px] bg-[#0b0b16] overflow-hidden">
                {/* Header de la bandeja con contador de no leídos */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#16162a] border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5z" />
                        </svg>
                        <span className="text-[12px] font-semibold text-white">Administración</span>
                    </div>
                    <motion.span
                        className="flex items-center gap-1 rounded-full bg-violet-500/20 border border-violet-400/30 px-2 py-0.5 text-[10px] font-bold text-violet-200"
                        animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                        18 sin leer
                    </motion.span>
                </div>

                {/* Filas de chat apilándose */}
                <div className="divide-y divide-white/[0.05]">
                    {inboxRows.map((row, i) => (
                        <motion.div
                            key={i}
                            className="flex items-center gap-3 px-3 py-2.5"
                            initial={reduce ? false : { opacity: 0, x: -12 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.15 + i * 0.12, duration: 0.4, ease: 'easeOut' }}
                        >
                            <span className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/80 to-blue-500/80 text-[11px] font-bold text-white">
                                {row.initials}
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="truncate text-[12px] font-semibold text-white leading-tight">{row.name}</p>
                                    <span className="shrink-0 text-[9px] text-violet-300/70">{row.time}</span>
                                </div>
                                <div className="mt-0.5 flex items-center justify-between gap-2">
                                    <p className="truncate text-[11px] text-neutral-400 leading-tight">{row.msg}</p>
                                    <span className="shrink-0 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-violet-500 text-[10px] font-bold text-white">
                                        {row.unread}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

/* =====================================================================
   Carrusel de dolores — solo mobile/tablet (< lg).
   Reemplaza el stack vertical de 7 tarjetas por un scroll-snap horizontal:
   swipe manual (sin autoplay, por accesibilidad y para evitar swipes
   accidentales), con la próxima tarjeta asomando en el borde como pista
   de que hay más, y una barra de progreso segmentada en vez de puntitos.
   La primera tarjeta es una bandeja de WhatsApp inundada: el dolor #1
   ("el teléfono explota con clientes preguntando por sus entregas")
   hecho imagen.
   ===================================================================== */
export function PainCarousel({ pains }: Props) {
    const containerRef = useRef<HTMLDivElement>(null)
    const slideRefs = useRef<(HTMLDivElement | null)[]>([])
    const [active, setActive] = useState(0)

    const total = pains.length + 1 // +1 por la tarjeta de portada

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const observer = new IntersectionObserver(
            (entries) => {
                let best: { index: number; ratio: number } | null = null
                for (const entry of entries) {
                    const index = Number((entry.target as HTMLElement).dataset.index)
                    if (entry.isIntersecting && (!best || entry.intersectionRatio > best.ratio)) {
                        best = { index, ratio: entry.intersectionRatio }
                    }
                }
                if (best) setActive(best.index)
            },
            { root: container, threshold: [0.5, 0.75, 1] }
        )

        slideRefs.current.forEach((el) => el && observer.observe(el))
        return () => observer.disconnect()
    }, [])

    return (
        <div className="lg:hidden">
            <div
                ref={containerRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-6 px-6 items-stretch [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: 'none' }}
            >
                {/* Portada: bandeja inundada */}
                <div
                    ref={(el) => {
                        slideRefs.current[0] = el
                    }}
                    data-index={0}
                    className="relative snap-center shrink-0 w-[86%] sm:w-[62%] overflow-hidden flex flex-col items-center justify-center gap-4 px-5 py-6 rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-950/50 via-[#15152a] to-blue-950/30"
                >
                    <div aria-hidden className="absolute w-56 h-56 -top-10 rounded-full bg-violet-500/20 blur-[70px]" />
                    <FloodedInbox />
                    <p className="relative text-center text-neutral-300 text-sm leading-relaxed">
                        La misma pregunta, <span className="text-white font-medium">cien veces por día</span>.
                    </p>
                </div>

                {/* Tarjetas de dolor */}
                {pains.map((pain, i) => (
                    <div
                        key={i}
                        ref={(el) => {
                            slideRefs.current[i + 1] = el
                        }}
                        data-index={i + 1}
                        className="relative snap-center shrink-0 w-[86%] sm:w-[62%] overflow-hidden flex flex-col justify-center px-6 py-8 rounded-2xl border border-white/10 bg-white/[0.02]"
                    >
                        {/* Número índice grande de fondo: llena el espacio como diseño */}
                        <span
                            aria-hidden
                            className="pointer-events-none absolute -top-4 -right-1 text-[7rem] font-black leading-none text-violet-500/[0.07] select-none"
                        >
                            {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="relative mb-4 inline-flex w-9 h-9 items-center justify-center rounded-lg border border-violet-500/30 bg-violet-500/10">
                            <span className="w-2 h-2 rounded-full bg-violet-400" />
                        </span>
                        <p className="relative text-neutral-200 text-base leading-relaxed">{pain}</p>
                    </div>
                ))}
            </div>

            {/* Indicador de progreso: barra segmentada + contador */}
            <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 flex gap-1.5" role="presentation">
                    {Array.from({ length: total }).map((_, i) => (
                        <span
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                                i === active ? 'bg-gradient-to-r from-violet-500 to-blue-500' : 'bg-white/10'
                            }`}
                        />
                    ))}
                </div>
                <span className="shrink-0 text-xs text-neutral-500 tabular-nums">
                    {active + 1}/{total}
                </span>
            </div>
        </div>
    )
}
