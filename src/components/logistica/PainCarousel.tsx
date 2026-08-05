'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type Props = {
    pains: string[]
}

/* Portada: la operación saturada como un montón de alertas cayendo a la vez,
   de todos los canales (llamada, planilla, WhatsApp). Deliberadamente
   caótico y multi-canal para diferenciarse del teléfono prolijo del hero. */
function ChannelIcon({ kind, className }: { kind: 'call' | 'doc' | 'chat'; className?: string }) {
    const common = { className, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
    if (kind === 'call')
        return (
            <svg viewBox="0 0 24 24" {...common}>
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
            </svg>
        )
    if (kind === 'doc')
        return (
            <svg viewBox="0 0 24 24" {...common}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6M8 13h8M8 17h5" />
            </svg>
        )
    return (
        <svg viewBox="0 0 24 24" {...common}>
            <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5z" />
        </svg>
    )
}

const alertCards = [
    { kind: 'call' as const, tag: 'Llamada perdida', text: '"¿Dónde está mi envío?"', accent: 'violet', rot: -9, x: -36, y: -30, delay: 0 },
    { kind: 'doc' as const, tag: 'Remito', text: 'Error de carga manual', accent: 'blue', rot: 7, x: 34, y: 24, delay: 0.4 },
    { kind: 'chat' as const, tag: 'WhatsApp · 12', text: 'Mensajes sin responder', accent: 'cyan', rot: -2, x: 0, y: 0, delay: 0.8 },
]

const accentMap: Record<string, string> = {
    violet: 'border-violet-400/30 text-violet-300',
    blue: 'border-blue-400/30 text-blue-300',
    cyan: 'border-cyan-400/30 text-cyan-300',
}

function OverwhelmStack() {
    const reduce = useReducedMotion()
    return (
        <div aria-hidden className="relative h-[210px] w-full">
            {/* Contador de alertas, flotando arriba */}
            <motion.div
                className="absolute left-1/2 -top-1 z-40 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-violet-400/40 bg-[#16162a] px-3 py-1 shadow-[0_8px_30px_rgba(139,92,246,0.35)]"
                animate={reduce ? undefined : { scale: [1, 1.06, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
                </span>
                <span className="text-[11px] font-bold text-white">Todo, a la vez</span>
            </motion.div>

            {/* Pila de tarjetas de alerta, cada una de un canal distinto */}
            {alertCards.map((c, i) => (
                <div
                    key={i}
                    className="absolute left-1/2 top-1/2"
                    style={{ transform: `translate(-50%,-50%) translate(${c.x}px, ${c.y}px) rotate(${c.rot}deg)`, zIndex: 10 + i * 10 }}
                >
                    <motion.div
                        className="w-[210px] rounded-2xl border border-white/10 bg-[#14142a] p-3 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.7)]"
                        animate={reduce ? undefined : { y: [0, -5, 0] }}
                        transition={{ duration: 3 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: c.delay }}
                    >
                        <div className="flex items-center gap-2.5">
                            <span className={`shrink-0 flex h-9 w-9 items-center justify-center rounded-xl border bg-white/[0.03] ${accentMap[c.accent]}`}>
                                <ChannelIcon kind={c.kind} className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                                <p className={`text-[10px] font-semibold uppercase tracking-wider ${accentMap[c.accent].split(' ')[1]}`}>{c.tag}</p>
                                <p className="truncate text-[12px] text-neutral-200">{c.text}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            ))}
        </div>
    )
}

/* =====================================================================
   Carrusel de dolores — solo mobile/tablet (< lg).
   Scroll-snap horizontal: swipe manual (sin autoplay), con la próxima
   tarjeta asomando en el borde y una barra de progreso segmentada.
   Todas las tarjetas comparten la MISMA altura (items-stretch) para que se
   vean parejas; el texto va centrado vertical (justify-center) para que el
   texto corto no quede pegado arriba con un hueco abajo.
   ===================================================================== */
export function PainCarousel({ pains }: Props) {
    const containerRef = useRef<HTMLDivElement>(null)
    const slideRefs = useRef<(HTMLDivElement | null)[]>([])
    const [active, setActive] = useState(0)

    const total = pains.length + 1 // +1 por la portada

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
                {/* Portada: pila de alertas multi-canal */}
                <div
                    ref={(el) => {
                        slideRefs.current[0] = el
                    }}
                    data-index={0}
                    className="relative snap-center shrink-0 w-[86%] sm:w-[62%] overflow-hidden flex flex-col items-center justify-center gap-3 px-5 py-6 rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-950/50 via-[#15152a] to-blue-950/30"
                >
                    <div aria-hidden className="absolute w-56 h-56 -top-10 rounded-full bg-violet-500/20 blur-[70px]" />
                    <OverwhelmStack />
                    <p className="relative text-center text-neutral-300 text-sm leading-relaxed">
                        Cae por <span className="text-white font-medium">todos lados</span>, al mismo tiempo.
                    </p>
                </div>

                {/* Tarjetas de dolor — mismo alto que la portada, texto centrado */}
                {pains.map((pain, i) => (
                    <div
                        key={i}
                        ref={(el) => {
                            slideRefs.current[i + 1] = el
                        }}
                        data-index={i + 1}
                        className="relative snap-center shrink-0 w-[86%] sm:w-[62%] overflow-hidden flex flex-col justify-center px-5 py-6 rounded-2xl border border-white/10 bg-white/[0.02]"
                    >
                        {/* Número índice como marca de agua a la derecha */}
                        <span
                            aria-hidden
                            className="pointer-events-none absolute top-1/2 -right-2 -translate-y-1/2 text-[6rem] font-black leading-none text-violet-500/[0.07] select-none"
                        >
                            {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="relative mb-3 inline-flex w-9 h-9 items-center justify-center rounded-lg border border-violet-500/30 bg-violet-500/10">
                            <span className="w-2 h-2 rounded-full bg-violet-400" />
                        </span>
                        <p className="relative pr-10 text-neutral-200 text-[15px] leading-relaxed">{pain}</p>
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
