'use client'

import { useEffect, useState, type RefObject } from 'react'
import Image from 'next/image'
import { ShieldCheck } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { useConsent } from '@/providers/PostHogProvider'

/* Piezas comunes de las páginas mobile (home y /logistica). */

export function Eyebrow({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[11px] font-mono font-medium tracking-[0.16em] uppercase text-[#FFA380]">{children}</p>
    )
}

export function Titulo({ children }: { children: React.ReactNode }) {
    return <h2 className="mt-2 text-[1.65rem] font-heading font-extrabold text-white leading-[1.15] tracking-tight">{children}</h2>
}

/** Ícono 3D de la marca (public/3d) con la sombra naranja de siempre. */
export function Icono3D({
    src,
    w,
    h,
    className = 'h-14 w-auto',
}: {
    src: string
    w: number
    h: number
    className?: string
}) {
    return (
        <Image
            src={src}
            alt=""
            aria-hidden
            width={w}
            height={h}
            quality={90}
            sizes="160px"
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

/** Tarjeta de Gabriel: foto, frase y garantías. */
export function FounderCard({ frase, chips, whatsappHref }: { frase: string; chips: string[]; whatsappHref: string }) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-4">
                <Image
                    src="/gabriel-cacabelos.jpg"
                    alt="Gabriel Cacabelos, fundador de INDIVIDRA"
                    width={480}
                    height={480}
                    sizes="72px"
                    className="w-[72px] h-[72px] rounded-full object-cover border-2 border-[#FF5520]/50"
                />
                <div>
                    <p className="font-heading font-bold text-white">Gabriel Cacabelos</p>
                    <p className="text-sm text-neutral-400">Fundador de INDIVIDRA</p>
                </div>
            </div>
            <blockquote className="mt-5 text-base text-neutral-200 leading-relaxed">“{frase}”</blockquote>
            <ul className="mt-5 flex flex-wrap gap-2">
                {chips.map((c) => (
                    <li
                        key={c}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 text-xs text-neutral-300"
                    >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#FF5520]" />
                        {c}
                    </li>
                ))}
            </ul>
            <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full py-3.5 px-5 rounded-2xl border border-[#25D366]/40 bg-[#25D366]/10 text-white font-semibold flex items-center justify-center gap-2"
            >
                <WhatsappIcon className="w-5 h-5 text-[#25D366]" />
                Hablar con Gabriel
            </a>
        </div>
    )
}

/**
 * Barra fija abajo: aparece al pasar el hero y se oculta en el bloque de contacto.
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
        <div
            aria-hidden={!mostrar}
            className={`fixed inset-x-0 bottom-0 z-[150] px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-[#0B0D0E]/95 backdrop-blur-md border-t border-white/10 transition-transform duration-300 ${
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
    )
}

/**
 * Comportamiento común de una página mobile:
 * - links con #seccion apuntan a la versión de desktop (oculta): saltamos a #m-seccion
 * - mobile_bloque_visto: hasta qué bloque [data-bloque] llega cada visita
 * - devuelve si la barra fija tiene que verse (fuera del hero y del contacto)
 */
export function useMobilePage(rootRef: RefObject<HTMLElement | null>, pagina: string) {
    const [barraVisible, setBarraVisible] = useState(false)

    useEffect(() => {
        const root = rootRef.current
        // En desktop este bloque está oculto: no observamos nada
        if (!root || root.offsetParent === null) return

        function irAlHash() {
            const hash = window.location.hash.slice(1)
            if (hash && !hash.startsWith('m-')) {
                document.getElementById(`m-${hash}`)?.scrollIntoView()
            }
        }
        irAlHash()
        window.addEventListener('hashchange', irAlHash)

        const vistos = new Set<string>()
        const vista = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    const bloque = (e.target as HTMLElement).dataset.bloque!
                    if (e.isIntersecting && !vistos.has(bloque)) {
                        vistos.add(bloque)
                        trackEvent('mobile_bloque_visto', { bloque, pagina })
                    }
                }
            },
            { threshold: 0.4 }
        )
        root.querySelectorAll<HTMLElement>('[data-bloque]').forEach((b) => vista.observe(b))

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
            window.removeEventListener('hashchange', irAlHash)
            vista.disconnect()
            barra.disconnect()
        }
    }, [rootRef, pagina])

    return barraVisible
}
