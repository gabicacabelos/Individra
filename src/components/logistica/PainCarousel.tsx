'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type Props = {
    pains: string[]
}

/* Portada: metáfora del cuello de botella. Muchas tareas entrando de arriba
   (consultas, remitos, avisos) que se atascan en un embudo angosto operado a
   mano por "2 personas", y apenas un hilo sale por abajo. Diagramática y
   abstracta a propósito: nada que ver con un chat/teléfono. */
function Bottleneck() {
    const reduce = useReducedMotion()

    // Tareas que caen desde arriba hacia el embudo
    const fallers = [
        { x: 40, delay: 0, dur: 2.6, color: '#a78bfa' },
        { x: 96, delay: 0.9, dur: 2.9, color: '#60a5fa' },
        { x: 150, delay: 1.7, dur: 2.4, color: '#22d3ee' },
        { x: 196, delay: 0.4, dur: 3.1, color: '#a78bfa' },
    ]

    return (
        <svg viewBox="0 0 240 210" className="w-full max-w-[250px]" role="img" aria-hidden xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="bn-wall" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
                <linearGradient id="bn-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(139,92,246,0.14)" />
                    <stop offset="100%" stopColor="rgba(34,211,238,0.04)" />
                </linearGradient>
            </defs>

            {/* Cuerpo del embudo (relleno) */}
            <path d="M22 40 L104 126 L104 158 L136 158 L136 126 L218 40 Z" fill="url(#bn-fill)" />
            {/* Paredes del embudo */}
            <path d="M22 40 L104 126 L104 160" fill="none" stroke="url(#bn-wall)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M218 40 L136 126 L136 160" fill="none" stroke="url(#bn-wall)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Tareas cayendo hacia el embudo (loop) */}
            {fallers.map((f, i) => (
                <motion.rect
                    key={i}
                    x={f.x - 8}
                    width="16"
                    height="16"
                    rx="4"
                    fill="rgba(255,255,255,0.02)"
                    stroke={f.color}
                    strokeWidth="1.6"
                    initial={{ y: 4, opacity: 0 }}
                    animate={reduce ? { y: 70, opacity: 0.7 } : { y: [4, 96], opacity: [0, 1, 1, 0] }}
                    transition={reduce ? { duration: 0 } : { duration: f.dur, delay: f.delay, repeat: Infinity, ease: 'easeIn', times: [0, 0.15, 0.8, 1] }}
                />
            ))}

            {/* Atasco: tareas amontonadas justo arriba del cuello */}
            {[
                { x: 104, y: 100, r: -8 },
                { x: 122, y: 106, r: 6 },
                { x: 113, y: 114, r: -3 },
            ].map((t, i) => (
                <rect key={i} x={t.x - 8} y={t.y - 8} width="16" height="16" rx="4" fill="rgba(139,92,246,0.1)" stroke="#c4b5fd" strokeWidth="1.6" transform={`rotate(${t.r} ${t.x} ${t.y})`} />
            ))}

            {/* Etiqueta del cuello: hecho a mano por 2 personas */}
            <g>
                <rect x="86" y="150" width="68" height="22" rx="11" fill="#16162a" stroke="url(#bn-wall)" strokeWidth="1.5" />
                <circle cx="100" cy="161" r="3.2" fill="none" stroke="#a78bfa" strokeWidth="1.6" />
                <path d="M95 168 a5 5 0 0 1 10 0" fill="none" stroke="#a78bfa" strokeWidth="1.6" />
                <text x="118" y="165" textAnchor="middle" fontSize="10" fontWeight="700" fill="#e9d5ff" fontFamily="ui-sans-serif, system-ui">2 personas</text>
            </g>

            {/* El hilo que sí sale: una sola tarea, lento y espaciado */}
            <motion.rect
                x="112"
                width="16"
                height="16"
                rx="4"
                fill="rgba(34,211,238,0.08)"
                stroke="#22d3ee"
                strokeWidth="1.6"
                initial={{ y: 176, opacity: 0 }}
                animate={reduce ? { y: 190, opacity: 0.6 } : { y: [176, 200], opacity: [0, 0.9, 0] }}
                transition={reduce ? { duration: 0 } : { duration: 3.4, repeat: Infinity, ease: 'linear', repeatDelay: 1.2 }}
            />
        </svg>
    )
}

/* =====================================================================
   Carrusel de dolores — solo mobile/tablet (< lg).
   Scroll-snap horizontal: swipe manual (sin autoplay), con la próxima
   tarjeta asomando en el borde y una barra de progreso segmentada.
   Las tarjetas toman su altura natural (items-start): no se estiran a la
   altura de la portada, así el texto no queda con aire muerto arriba/abajo.
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
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-6 px-6 items-start [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: 'none' }}
            >
                {/* Portada: cuello de botella */}
                <div
                    ref={(el) => {
                        slideRefs.current[0] = el
                    }}
                    data-index={0}
                    className="relative snap-center shrink-0 w-[86%] sm:w-[62%] overflow-hidden flex flex-col items-center gap-3 px-5 pt-7 pb-6 rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-950/50 via-[#15152a] to-blue-950/30"
                >
                    <div aria-hidden className="absolute w-56 h-56 -top-12 rounded-full bg-violet-500/20 blur-[70px]" />
                    <span className="relative text-[11px] uppercase tracking-widest text-violet-400/80 font-medium">Todo pasa por acá</span>
                    <Bottleneck />
                    <p className="relative text-center text-neutral-300 text-sm leading-relaxed">
                        Un solo <span className="text-white font-medium">cuello de botella</span> para toda la operación.
                    </p>
                </div>

                {/* Tarjetas de dolor — altura natural, sin aire muerto */}
                {pains.map((pain, i) => (
                    <div
                        key={i}
                        ref={(el) => {
                            slideRefs.current[i + 1] = el
                        }}
                        data-index={i + 1}
                        className="relative snap-center shrink-0 w-[86%] sm:w-[62%] overflow-hidden flex flex-col px-5 py-6 rounded-2xl border border-white/10 bg-white/[0.02]"
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
