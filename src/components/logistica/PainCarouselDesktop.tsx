'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

/**
 * Carrusel de dolores para desktop (≥1024px). En celular y tablet se usa
 * PainCarousel (swipe, sin autoplay). Avanza solo cada 6 s mientras está en
 * pantalla; se pausa con el mouse encima, con foco de teclado o con
 * "reducir movimiento" activado en el sistema.
 */
const AUTOPLAY_MS = 6000

export function PainCarouselDesktop({ pains }: { pains: string[] }) {
    const [actual, setActual] = useState(0)
    const [pausado, setPausado] = useState(false)
    const raiz = useRef<HTMLDivElement>(null)
    const barra = useRef<HTMLDivElement>(null)
    const transcurrido = useRef(0)
    const enPantalla = useInView(raiz, { amount: 0.4 })
    const reducir = useReducedMotion()
    const corre = enPantalla && !pausado && !reducir

    // Un solo reloj mueve la barra (directo en el DOM, sin re-render) y avanza el slide
    useEffect(() => {
        if (!corre) return
        const inicio = performance.now() - transcurrido.current
        let frame = requestAnimationFrame(function tick(ahora) {
            transcurrido.current = ahora - inicio
            const pct = Math.min(transcurrido.current / AUTOPLAY_MS, 1)
            if (barra.current) barra.current.style.transform = `scaleX(${pct})`
            if (pct >= 1) {
                transcurrido.current = 0
                setActual((a) => (a + 1) % pains.length)
            } else {
                frame = requestAnimationFrame(tick)
            }
        })
        return () => cancelAnimationFrame(frame)
    }, [corre, actual, pains.length])

    const ir = (i: number) => {
        transcurrido.current = 0
        setActual((i + pains.length) % pains.length)
    }

    return (
        <div
            ref={raiz}
            onMouseEnter={() => setPausado(true)}
            onMouseLeave={() => setPausado(false)}
            onFocus={() => setPausado(true)}
            onBlur={() => setPausado(false)}
        >
            <div className="grid grid-cols-[auto_1fr] gap-10 xl:gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className="relative shrink-0"
                >
                    <div aria-hidden className="absolute inset-0 -m-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,85,32,0.14),transparent_70%)] blur-2xl" />
                    <Image
                        src="/3d/operario-cajas.png"
                        alt=""
                        aria-hidden
                        width={529}
                        height={560}
                        quality={90}
                        sizes="340px"
                        className="relative w-[290px] xl:w-[340px] h-auto object-contain drop-shadow-[0_24px_50px_rgba(200,66,20,0.28)]"
                    />
                </motion.div>

                <div className="relative min-h-[300px] flex items-center" aria-live={corre ? 'off' : 'polite'}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={actual}
                            initial={{ opacity: 0, x: -40, rotate: -3 }}
                            animate={{ opacity: 1, x: 0, rotate: 0 }}
                            exit={{ opacity: 0, x: 40, rotate: 3 }}
                            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-full max-w-xl p-8 xl:p-10 rounded-3xl border border-white/10 bg-[#1A1918] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]"
                        >
                            {/* Esquina doblada, como un papel */}
                            <div aria-hidden className="absolute top-0 right-0 w-7 h-7 bg-gradient-to-br from-[#FF5520]/25 to-transparent [clip-path:polygon(100%_0,0_0,100%_100%)] rounded-tr-3xl" />
                            <div className="flex items-center gap-3 mb-5">
                                <span className="flex items-center justify-center w-9 h-9 rounded-full border border-[#FF5520]/40 bg-[#FF5520]/15 text-[#FFA380] font-bold text-sm font-mono">
                                    {String(actual + 1).padStart(2, '0')}
                                </span>
                                <span className="text-[11px] font-mono uppercase tracking-widest text-[#FFA380]">
                                    Problema {actual + 1} de {pains.length}
                                </span>
                            </div>
                            <p className="text-neutral-100 text-lg xl:text-xl leading-relaxed">{pains[actual]}</p>
                            <div className="mt-7 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                                <div
                                    ref={barra}
                                    style={{ transform: `scaleX(${reducir ? 1 : 0})`, transformOrigin: 'left' }}
                                    className="h-full rounded-full bg-gradient-to-r from-[#FF5520] to-[#FFA380]"
                                />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-5">
                <button
                    type="button"
                    onClick={() => ir(actual - 1)}
                    aria-label="Problema anterior"
                    className="flex items-center justify-center w-11 h-11 rounded-full border border-white/10 bg-white/[0.03] text-neutral-300 hover:bg-[#FF5520]/15 hover:border-[#FF5520]/40 hover:text-white transition-all active:scale-95"
                >
                    <ArrowRight className="w-4 h-4 rotate-180" aria-hidden />
                </button>
                <div className="flex items-center">
                    {pains.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => ir(i)}
                            aria-label={`Ir al problema ${i + 1}`}
                            aria-current={i === actual ? 'true' : undefined}
                            className="group flex items-center justify-center h-6 min-w-6 px-1"
                        >
                            <span
                                className={`block rounded-full transition-all ${
                                    i === actual ? 'w-8 h-2 bg-gradient-to-r from-[#FF5520] to-[#FFA380]' : 'w-2 h-2 bg-white/25 group-hover:bg-white/50'
                                }`}
                            />
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={() => ir(actual + 1)}
                    aria-label="Problema siguiente"
                    className="flex items-center justify-center w-11 h-11 rounded-full border border-white/10 bg-white/[0.03] text-neutral-300 hover:bg-[#FF5520]/15 hover:border-[#FF5520]/40 hover:text-white transition-all active:scale-95"
                >
                    <ArrowRight className="w-4 h-4" aria-hidden />
                </button>
            </div>
        </div>
    )
}
