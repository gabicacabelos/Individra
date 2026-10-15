'use client'

import { useEffect, useState, type RefObject } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { useConsent } from '@/providers/PostHogProvider'

/*
 * Piezas comunes del sitio (home y /logistica).
 * Una sola versión por página: compacta hasta 1023px (celular y tablet) y en
 * columnas desde 1024px (lg). Los textos se escriben una sola vez.
 */

/** Ancho y márgenes laterales de todas las secciones. */
export const CONTENEDOR = 'mx-auto w-full max-w-6xl px-5 sm:px-8'

export function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <p className={`text-[11px] lg:text-xs font-mono font-medium tracking-[0.16em] uppercase text-[#FFA380] ${className}`}>
            {children}
        </p>
    )
}

export function Titulo({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <h2
            className={`mt-2 text-[1.65rem] lg:text-[2.6rem] font-heading font-extrabold text-white leading-[1.15] lg:leading-[1.08] tracking-tight ${className}`}
        >
            {children}
        </h2>
    )
}

/** Entrada suave al aparecer en pantalla. Respeta "reducir movimiento" del sistema (MotionConfig en cada página). */
export function Reveal({
    children,
    className = '',
    delay = 0,
}: {
    children: React.ReactNode
    className?: string
    delay?: number
}) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
        >
            {children}
        </motion.div>
    )
}

/** Ícono 3D de la marca (public/3d) con la sombra naranja de siempre. */
export function Icono3D({
    src,
    w,
    h,
    className = 'h-14 w-auto',
    sizes = '160px',
}: {
    src: string
    w: number
    h: number
    className?: string
    sizes?: string
}) {
    return (
        <Image
            src={src}
            alt=""
            aria-hidden
            width={w}
            height={h}
            quality={90}
            sizes={sizes}
            className={`object-contain drop-shadow-[0_10px_24px_rgba(200,66,20,0.3)] ${className}`}
        />
    )
}

export function WhatsappIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
    )
}

/** Tarjeta de Gabriel: foto, frase y garantías. En desktop, en dos columnas. */
export function FounderCard({ frase, chips, whatsappHref }: { frase: string; chips: string[]; whatsappHref: string }) {
    return (
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-5 lg:p-10 lg:grid lg:grid-cols-[1.4fr_1fr] lg:gap-12 lg:items-center">
            <div>
                <div className="flex items-center gap-4">
                    <Image
                        src="/gabriel-cacabelos.jpg"
                        alt="Gabriel Cacabelos, fundador de INDIVIDRA"
                        width={480}
                        height={480}
                        sizes="(min-width: 1024px) 96px, 72px"
                        className="w-[72px] h-[72px] lg:w-24 lg:h-24 rounded-full object-cover border-2 border-[#FF5520]/50"
                    />
                    <div>
                        <p className="font-heading font-bold text-white lg:text-lg">Gabriel Cacabelos</p>
                        <p className="text-sm text-neutral-400">Fundador de INDIVIDRA</p>
                    </div>
                </div>
                <blockquote className="mt-5 lg:mt-7 text-base lg:text-xl text-neutral-200 leading-relaxed">“{frase}”</blockquote>
            </div>
            <div className="mt-5 lg:mt-0">
                <ul className="flex flex-wrap gap-2 lg:gap-2.5">
                    {chips.map((c) => (
                        <li
                            key={c}
                            className="flex items-center gap-1.5 px-3 py-1.5 lg:py-2 rounded-full border border-white/10 bg-black/20 text-xs lg:text-sm text-neutral-300"
                        >
                            <ShieldCheck className="w-3.5 h-3.5 text-[#FF5520]" aria-hidden />
                            {c}
                        </li>
                    ))}
                </ul>
                <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 lg:mt-6 w-full py-3.5 px-5 rounded-2xl border border-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                    <WhatsappIcon className="w-5 h-5 text-[#25D366]" />
                    Hablar con Gabriel
                </a>
            </div>
        </div>
    )
}

/**
 * Acceso fijo a la acción principal: aparece al pasar el hero y se oculta en el
 * bloque de contacto. Celular y tablet: barra abajo. Desktop: botón redondo de
 * WhatsApp abajo a la derecha (el CTA principal ya está en el menú).
 * Mientras el banner de cookies está abierto no se muestra, para no taparlo.
 */
export function StickyBar({
    visible,
    href,
    label,
    whatsappHref,
}: {
    visible: boolean
    href: string
    label: string
    whatsappHref: string
}) {
    const { consent } = useConsent()
    const mostrar = visible && consent !== null
    return (
        <>
            <div
                aria-hidden={!mostrar}
                className={`lg:hidden fixed inset-x-0 bottom-0 z-[150] px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-[#0B0D0E]/95 backdrop-blur-md border-t border-white/10 transition-transform duration-300 ${
                    mostrar ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
                <div className="flex gap-3">
                    <a
                        href={href}
                        tabIndex={mostrar ? 0 : -1}
                        data-track="sticky_cta_clicked"
                        className="flex-1 py-3.5 px-4 bg-[#FF5520] text-white font-heading font-bold text-[15px] rounded-xl flex items-center justify-center gap-2"
                    >
                        {label}
                    </a>
                    <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={mostrar ? 0 : -1}
                        aria-label="Escribir por WhatsApp"
                        className="w-[52px] shrink-0 rounded-xl bg-[#25D366] flex items-center justify-center"
                    >
                        <WhatsappIcon className="w-6 h-6 text-white" />
                    </a>
                </div>
            </div>
            <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={mostrar ? 0 : -1}
                aria-hidden={!mostrar}
                aria-label="Escribir por WhatsApp"
                className={`hidden lg:flex fixed bottom-6 right-6 z-[150] w-14 h-14 rounded-full bg-[#25D366] items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.35)] hover:scale-105 transition-all duration-300 ${
                    mostrar ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
            >
                <WhatsappIcon className="w-7 h-7 text-white" />
            </a>
        </>
    )
}

/**
 * Comportamiento común de cada página:
 * - bloque_visto: hasta qué bloque [data-bloque] llega cada visita (un evento por bloque)
 * - devuelve si el acceso fijo tiene que verse (fuera del hero y del contacto)
 */
export function usePagina(rootRef: RefObject<HTMLElement | null>, pagina: string) {
    const [barraVisible, setBarraVisible] = useState(false)

    useEffect(() => {
        const root = rootRef.current
        if (!root) return
        const vista = window.matchMedia('(min-width: 1024px)').matches ? 'desktop' : 'mobile'

        // Cuenta el bloque cuando cruza la franja central de la pantalla: funciona
        // igual con bloques más altos que la pantalla.
        const vistos = new Set<string>()
        const observador = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    const bloque = (e.target as HTMLElement).dataset.bloque!
                    if (e.isIntersecting && !vistos.has(bloque)) {
                        vistos.add(bloque)
                        trackEvent('bloque_visto', { bloque, pagina, vista })
                    }
                }
            },
            { rootMargin: '-40% 0px -40% 0px' }
        )
        root.querySelectorAll<HTMLElement>('[data-bloque]').forEach((b) => observador.observe(b))

        const hero = root.querySelector('[data-hero]')
        const contacto = root.querySelector('[data-contacto]')
        const estado = { heroVisible: true, contactoVisible: false }
        const barra = new IntersectionObserver((entries) => {
            for (const e of entries) {
                if (e.target === hero) estado.heroVisible = e.isIntersecting
                if (e.target === contacto) estado.contactoVisible = e.isIntersecting
            }
            setBarraVisible(!estado.heroVisible && !estado.contactoVisible)
        })
        if (hero) barra.observe(hero)
        if (contacto) barra.observe(contacto)

        return () => {
            observador.disconnect()
            barra.disconnect()
        }
    }, [rootRef, pagina])

    return barraVisible
}
