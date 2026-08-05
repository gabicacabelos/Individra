'use client'

import { useEffect, useRef, useState } from 'react'
import { SaturatedOpsScene } from './LogisticaAnimations'

type Props = {
    pains: string[]
}

/* =====================================================================
   Carrusel de dolores — solo mobile/tablet (< lg).
   Reemplaza el stack vertical de 7 tarjetas por un scroll-snap horizontal:
   swipe manual (sin autoplay, por accesibilidad y para evitar swipes
   accidentales), con la próxima tarjeta asomando en el borde como pista
   de que hay más, y una barra de progreso segmentada en vez de puntitos.
   La primera tarjeta reutiliza la ilustración SaturatedOpsScene (ya
   existente, hoy oculta en mobile) como apertura visual de la sección.
   ===================================================================== */
export function PainCarousel({ pains }: Props) {
    const containerRef = useRef<HTMLDivElement>(null)
    const slideRefs = useRef<(HTMLDivElement | null)[]>([])
    const [active, setActive] = useState(0)

    const total = pains.length + 1 // +1 por la tarjeta de ilustración

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
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-6 px-6 [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: 'none' }}
            >
                {/* Tarjeta de apertura: ilustración, reemplaza al SaturatedOpsScene que hoy solo se ve en desktop */}
                <div
                    ref={(el) => {
                        slideRefs.current[0] = el
                    }}
                    data-index={0}
                    className="snap-center shrink-0 w-[82%] sm:w-[60%] flex flex-col items-center justify-center text-center gap-3 p-6 rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-900/20 to-blue-900/10"
                >
                    <SaturatedOpsScene className="w-40 h-auto" />
                    <p className="text-neutral-300 text-sm leading-relaxed">
                        Así se ve tu operación un martes cualquiera.
                    </p>
                </div>

                {pains.map((pain, i) => (
                    <div
                        key={i}
                        ref={(el) => {
                            slideRefs.current[i + 1] = el
                        }}
                        data-index={i + 1}
                        className="snap-center shrink-0 w-[82%] sm:w-[60%] flex gap-4 p-5 rounded-xl border border-white/10 bg-white/[0.02]"
                    >
                        <span className="shrink-0 mt-1.5 w-2 h-2 rounded-full bg-violet-500" aria-hidden />
                        <p className="text-neutral-300 text-sm leading-relaxed">{pain}</p>
                    </div>
                ))}
            </div>

            {/* Indicador de progreso: barra segmentada + contador, en vez de puntitos */}
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
