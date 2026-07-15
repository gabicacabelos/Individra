'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface MorphingTextProps {
    texts: string[]
    /** Segundos que cada frase permanece nítida y legible. */
    holdTime?: number
    /** Segundos que dura la transición entre frases. */
    morphTime?: number
    /** Blur máximo (px) en el punto medio de la transición. */
    maxBlur?: number
    /** Desplazamiento vertical (px) durante la transición. */
    drift?: number
    className?: string
    textClassName?: string
    /** Texto accesible/indexable. Por defecto se unen todas las frases. */
    srText?: string
}

/**
 * Sine, no cubic: cubic es demasiado pronunciada en el medio y apaga ambas
 * frases a la vez (se midió un parpadeo en blanco de 0.65s sobre 0.9s).
 */
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2

/** Mapea t (0..1) al subrango [from, to], recortado a 0..1. */
const subRange = (t: number, from: number, to: number) =>
    Math.min(1, Math.max(0, (t - from) / (to - from)))

/**
 * Texto que transiciona entre frases con un crossfade de blur + drift.
 *
 * Sobre el efecto "gooey" original: usaba un feColorMatrix threshold que recorta
 * el alfa de golpe. A tamaño display se ve bien, pero en una línea de 16-20px
 * ensucia los bordes y se come los trazos finos. Acá se usa un crossfade limpio.
 *
 * Detalles de implementación:
 * - Un único requestAnimationFrame, cancelado en el cleanup.
 * - Deps estables: se compara el contenido de `texts`, no su identidad.
 * - Las frases entrante y saliente se solapan apenas, para que no haya
 *   doble texto fantasma (la causa del aspecto "sucio").
 * - Respeta prefers-reduced-motion: texto estático, sin rAF ni filtros.
 * - El texto inicial va en el markup: rAF no corre en pestañas ocultas, así que
 *   sin esto la línea quedaría en blanco hasta el primer frame.
 */
export function MorphingText({
    texts,
    holdTime = 2.4,
    morphTime = 0.9,
    maxBlur = 6,
    drift = 6,
    className,
    textClassName,
    srText,
}: MorphingTextProps) {
    const outRef = React.useRef<HTMLSpanElement>(null)
    const inRef = React.useRef<HTMLSpanElement>(null)

    const textsKey = texts.join('|')
    const textsRef = React.useRef(texts)
    textsRef.current = texts

    const [reduce, setReduce] = React.useState(false)
    React.useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
        const update = () => setReduce(mq.matches)
        update()
        mq.addEventListener('change', update)
        return () => mq.removeEventListener('change', update)
    }, [])

    React.useEffect(() => {
        if (reduce) return

        const list = textsRef.current
        const elOut = outRef.current
        const elIn = inRef.current
        if (!elOut || !elIn || list.length < 2) return

        let rafId = 0
        let index = 0
        let phaseStart = performance.now()
        let morphing = false

        const paint = (el: HTMLSpanElement, opacity: number, blur: number, y: number) => {
            el.style.opacity = String(opacity)
            el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : ''
            el.style.transform = y === 0 ? '' : `translateY(${y.toFixed(2)}px)`
        }

        const settle = () => {
            elOut.textContent = list[index]
            paint(elOut, 1, 0, 0)
            elIn.textContent = list[(index + 1) % list.length]
            paint(elIn, 0, maxBlur, drift)
        }

        settle()

        const animate = (now: number) => {
            rafId = requestAnimationFrame(animate)
            const elapsed = (now - phaseStart) / 1000

            if (!morphing) {
                if (elapsed >= holdTime) {
                    morphing = true
                    phaseStart = now
                }
                return
            }

            const t = Math.min(1, elapsed / morphTime)

            // Solape amplio: en el cruce ambas quedan tenues y muy borrosas, que se
            // lee como una disolución suave. Un solape angosto deja un hueco en blanco.
            const tOut = easeInOutSine(subRange(t, 0, 0.65))
            const tIn = easeInOutSine(subRange(t, 0.35, 1))

            paint(elOut, 1 - tOut, maxBlur * tOut, -drift * tOut)
            paint(elIn, tIn, maxBlur * (1 - tIn), drift * (1 - tIn))

            if (t >= 1) {
                index = (index + 1) % list.length
                morphing = false
                phaseStart = now
                settle()
            }
        }

        rafId = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(rafId)
    }, [textsKey, holdTime, morphTime, maxBlur, drift, reduce])

    const srCopy = <span className="sr-only">{srText ?? texts.join(' ')}</span>
    const spanBase = 'absolute inset-0 flex items-center select-none will-change-[opacity,filter,transform]'

    if (reduce) {
        return (
            <div className={cn('relative', className)}>
                {srCopy}
                <span aria-hidden className={cn('absolute inset-0 flex items-center select-none', textClassName)}>
                    {texts[0]}
                </span>
            </div>
        )
    }

    return (
        <div className={cn('relative', className)}>
            {srCopy}
            <div aria-hidden className="relative w-full h-full">
                <span ref={outRef} className={cn(spanBase, textClassName)}>
                    {texts[0]}
                </span>
                <span ref={inRef} className={cn(spanBase, 'opacity-0', textClassName)}>
                    {texts[1 % texts.length]}
                </span>
            </div>
        </div>
    )
}
