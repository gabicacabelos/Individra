'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'

type Enlace = {
    href: string
    label: string
    /** Texto en el menú desplegable (celular y tablet), si cambia. */
    labelMenu?: string
    ruta?: boolean
    destacado?: boolean
    /** Solo desde 1280px: a 1024px no entran todos en una línea. */
    soloXl?: boolean
}

const ENLACES: Enlace[] = [
    { href: '#consola-operativa', label: 'Cómo funciona', labelMenu: 'Cómo te llega el aviso' },
    { href: '#calculadora', label: 'Calculadora', soloXl: true },
    { href: '#piloto', label: 'Precios', labelMenu: 'Piloto y precios' },
    { href: '/logistica', label: 'Para logísticas', ruta: true },
    { href: '#faq', label: 'FAQ', labelMenu: 'Preguntas frecuentes', soloXl: true },
    { href: '/diagnostico', label: 'Autodiagnóstico', ruta: true, destacado: true },
]

const SECCIONES = ENLACES.filter((e) => !e.ruta).map((e) => e.href.slice(1))

export function Navbar() {
    const [conFondo, setConFondo] = useState(false)
    const [menuAbierto, setMenuAbierto] = useState(false)
    const [activa, setActiva] = useState<string | null>(null)

    useEffect(() => {
        const alScrollear = () => setConFondo(window.scrollY > 40)
        alScrollear()
        window.addEventListener('scroll', alScrollear, { passive: true })
        return () => window.removeEventListener('scroll', alScrollear)
    }, [])

    // Marca en el menú la sección que se está leyendo
    useEffect(() => {
        const observador = new IntersectionObserver(
            (entradas) => {
                for (const e of entradas) {
                    if (e.isIntersecting) setActiva(e.target.id)
                    else setActiva((actual) => (actual === e.target.id ? null : actual))
                }
            },
            { rootMargin: '-45% 0px -50% 0px' }
        )
        SECCIONES.forEach((id) => {
            const el = document.getElementById(id)
            if (el) observador.observe(el)
        })
        return () => observador.disconnect()
    }, [])

    useEffect(() => {
        if (!menuAbierto) return
        const alTeclear = (e: KeyboardEvent) => e.key === 'Escape' && setMenuAbierto(false)
        window.addEventListener('keydown', alTeclear)
        return () => window.removeEventListener('keydown', alTeclear)
    }, [menuAbierto])

    const irA = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        const el = document.getElementById(href.slice(1))
        if (!el) return
        e.preventDefault()
        setMenuAbierto(false)
        const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        // scroll-mt-24 de cada sección deja el título libre debajo del menú
        el.scrollIntoView({ behavior: suave ? 'smooth' : 'auto', block: 'start' })
        window.history.pushState(null, '', href)
    }

    const enlace = (e: Enlace, enMenu: boolean) => {
        const activo = !e.ruta && activa === e.href.slice(1)
        const clase = enMenu
            ? `flex items-center gap-2 py-3 px-4 rounded-xl text-base font-medium transition-colors hover:bg-white/10 hover:text-white ${
                  e.destacado ? 'text-white font-semibold' : 'text-neutral-300'
              }`
            : `${e.soloXl ? 'hidden xl:flex' : 'flex'} items-center gap-1.5 h-10 whitespace-nowrap text-sm font-medium transition-colors relative after:absolute after:bottom-1.5 after:left-0 after:h-0.5 after:bg-[#FF5520] after:transition-all after:duration-300 hover:after:w-full ${
                  activo ? 'text-white after:w-full' : 'after:w-0'
              } ${e.destacado ? 'text-white font-semibold' : activo ? '' : 'text-neutral-400 hover:text-white'}`
        const contenido = (
            <>
                {e.destacado && <span className={`${enMenu ? 'h-2 w-2' : 'h-1.5 w-1.5'} rounded-full bg-[#FF5520]`} aria-hidden />}
                {enMenu ? (e.labelMenu ?? e.label) : e.label}
            </>
        )
        return e.ruta ? (
            <Link
                key={e.href}
                href={e.href}
                onClick={() => {
                    setMenuAbierto(false)
                    trackEvent('nav_route_clicked', { href: e.href, source: enMenu ? 'navbar_mobile' : 'navbar_desktop' })
                }}
                className={clase}
            >
                {contenido}
            </Link>
        ) : (
            <a key={e.href} href={e.href} onClick={(ev) => irA(ev, e.href)} aria-current={activo ? 'true' : undefined} className={clase}>
                {contenido}
            </a>
        )
    }

    return (
        <motion.nav
            aria-label="Principal"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed top-4 inset-x-4 z-[100] rounded-2xl transition-[background-color,border-color,box-shadow] duration-500 ${
                conFondo || menuAbierto
                    ? 'bg-[#0B0D0E]/85 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/30'
                    : 'bg-black/20 backdrop-blur-sm border border-white/5'
            }`}
        >
            <div className="max-w-6xl mx-auto px-4 xl:px-8 py-2 lg:py-2.5">
                <div className="flex items-center justify-between gap-6">
                    <a href="#inicio" onClick={(e) => irA(e, '#inicio')} className="flex items-center py-1 shrink-0">
                        <Image
                            src="/logo-individra-rebrand.png"
                            alt="INDIVIDRA, inicio"
                            width={640}
                            height={125}
                            quality={95}
                            sizes="(min-width: 1024px) 220px, 190px"
                            className="h-9 sm:h-10 xl:h-11 w-auto object-contain"
                            priority
                        />
                    </a>

                    <div className="hidden lg:flex items-center gap-5 xl:gap-7">
                        {ENLACES.map((e) => enlace(e, false))}
                        <a
                            href="#contacto"
                            onClick={(e) => irA(e, '#contacto')}
                            className="ml-1 px-5 h-10 bg-[#FF5520] hover:brightness-110 text-white text-sm font-heading font-bold rounded-full shadow-[0_4px_20px_rgba(255,85,32,0.3)] active:scale-95 transition whitespace-nowrap flex items-center"
                        >
                            Agendar diagnóstico<span className="hidden xl:inline">&nbsp;(30 min)</span>
                        </a>
                    </div>

                    <button
                        type="button"
                        onClick={() => setMenuAbierto((v) => !v)}
                        className="lg:hidden text-white p-2.5 -mr-1 hover:bg-white/10 rounded-lg transition-colors"
                        aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
                        aria-expanded={menuAbierto}
                        aria-controls="menu-movil"
                    >
                        {menuAbierto ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <AnimatePresence initial={false}>
                    {menuAbierto && (
                        <motion.div
                            id="menu-movil"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="lg:hidden overflow-hidden"
                        >
                            <div className="mt-2 pt-3 pb-3 border-t border-white/10 flex flex-col gap-0.5 sm:grid sm:grid-cols-2 sm:gap-1">
                                {ENLACES.map((e) => enlace(e, true))}
                                <a
                                    href="#contacto"
                                    onClick={(e) => irA(e, '#contacto')}
                                    className="mt-3 sm:col-span-2 py-3.5 px-5 bg-[#FF5520] text-white text-base font-heading font-bold rounded-xl text-center active:scale-[0.98] transition"
                                >
                                    Hablar con Gabriel
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    )
}
