'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Congela las animaciones de las secciones que están fuera de pantalla.
 *
 * Las landings tienen muchos loops decorativos (micro-demos, partículas, SVG con
 * SMIL) que el navegador sigue calculando en cada frame aunque la sección no se
 * vea, y en celulares eso traba el scroll. Con un margen de 200px la sección se
 * reanuda antes de entrar en pantalla, así que visualmente no cambia nada.
 */
export function OffscreenAnimationPauser() {
    const pathname = usePathname()

    useEffect(() => {
        const sections = document.querySelectorAll<HTMLElement>('main section, footer')

        const observer = new IntersectionObserver(
            (entries) => {
                for (const { target, isIntersecting } of entries) {
                    target.toggleAttribute('data-offscreen', !isIntersecting)
                    // Las animaciones SMIL no respetan animation-play-state.
                    target.querySelectorAll('svg').forEach((svg) =>
                        isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations()
                    )
                }
            },
            { rootMargin: '200px 0px' }
        )

        sections.forEach((s) => observer.observe(s))
        return () => {
            observer.disconnect()
            sections.forEach((s) => s.removeAttribute('data-offscreen'))
        }
    }, [pathname])

    return null
}
