'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { MotionConfig, motion } from 'framer-motion'
import { ArrowRight, ChevronDown, Quote } from 'lucide-react'
import { PhoneChatHero } from './PhoneChatHero'
import { PainCarousel } from './PainCarousel'
import { PainCarouselDesktop } from './PainCarouselDesktop'
import { CalculadoraFinancieraViva } from './CalculadoraFallas'
import { DriverAdmissionDemo, MonthlyOperationsDemo } from '@/components/ui/micro-demos'
import { WHATSAPP_HREF, H1_TEXT, pains, PAIN_CLOSE, modules, flowSteps } from './contenido'
import { EMAIL } from '@/components/sitio/contacto'
import { trackEvent } from '@/lib/analytics'
import {
    CONTENEDOR,
    Eyebrow,
    FounderCard,
    Icono3D,
    Reveal,
    StickyBar,
    Titulo,
    WhatsappIcon,
    usePagina,
} from '@/components/sitio/shared'

/*
 * /logistica: una sola versión para todos los tamaños.
 * - Hasta 1023px (celular y tablet): una columna, como la versión mobile aprobada.
 * - Desde 1024px (lg): columnas, calculadora en vivo y Calendly embebidos.
 */

const CalendlyEmbed = dynamic(() => import('@/components/sitio/CalendlyEmbed').then((m) => m.CalendlyEmbed), {
    ssr: false,
})

const DIAGNOSTICO_LOGISTICA = '/diagnostico?origen=logistica'
const SECCION = 'scroll-mt-24 relative bg-[#0B0D0E] border-t border-white/5 overflow-hidden'
const PADDING = 'py-14 lg:py-28'

// Los 8 módulos agrupados en 3 momentos de la entrega
const MOMENTOS = [
    { id: 'antes', label: 'Antes de salir', pasos: [1, 2] },
    { id: 'calle', label: 'En la calle', pasos: [3, 4, 8] },
    { id: 'despues', label: 'Después', pasos: [5, 6, 7] },
] as const

// Nombres más cortos (en desktop también: las tarjetas van de a tres)
const NOMBRE_CORTO: Record<number, string> = {
    7: 'Radar de dadores',
    8: 'Protocolo de incidente en ruta',
}

function irA(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    const el = document.getElementById(href.slice(1))
    if (!el) return
    e.preventDefault()
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: suave ? 'smooth' : 'auto', block: 'start' })
    window.history.pushState(null, '', href)
}

function useEsDesktop() {
    const [esDesktop, setEsDesktop] = useState(false)
    useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)')
        const actualizar = () => setEsDesktop(mq.matches)
        mq.addEventListener('change', actualizar)
        // Primera lectura en un callback, no en el cuerpo del efecto
        const id = requestAnimationFrame(actualizar)
        return () => {
            mq.removeEventListener('change', actualizar)
            cancelAnimationFrame(id)
        }
    }, [])
    return esDesktop
}

/** Glow de fondo, solo desktop. */
function Glow({ className }: { className: string }) {
    return <div aria-hidden className={`hidden lg:block pointer-events-none absolute rounded-full blur-[120px] ${className}`} />
}

/* ---------- Barra superior ---------- */
const ENLACES = [
    { href: '#como-funciona', label: 'Cómo funciona' },
    { href: '#modulos', label: 'Qué automatizamos' },
    { href: '#calculadora', label: 'Costo de fallas', soloXl: true },
]

function Barra() {
    const [conFondo, setConFondo] = useState(false)

    useEffect(() => {
        const alScrollear = () => setConFondo(window.scrollY > 40)
        window.addEventListener('scroll', alScrollear, { passive: true })
        return () => window.removeEventListener('scroll', alScrollear)
    }, [])

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed top-4 inset-x-4 z-[100] rounded-2xl transition-[background-color,border-color,box-shadow] duration-500 ${
                conFondo
                    ? 'bg-[#0B0D0E]/85 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/30'
                    : 'bg-black/20 backdrop-blur-sm border border-white/5'
            }`}
        >
            <div className="max-w-6xl mx-auto px-4 xl:px-8 py-2 lg:py-2.5 flex items-center justify-between gap-3 lg:gap-6">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <Link
                        href="/"
                        className="flex shrink-0 items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                        aria-label="Volver al inicio"
                    >
                        <ArrowRight className="w-4 h-4 text-neutral-300 rotate-180" aria-hidden />
                    </Link>
                    <Link href="/" className="flex min-w-0 items-center py-1">
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
                    </Link>
                </div>
                <nav aria-label="Secciones" className="hidden lg:flex items-center gap-6 xl:gap-7">
                    {ENLACES.map((e) => (
                        <a
                            key={e.href}
                            href={e.href}
                            onClick={(ev) => irA(ev, e.href)}
                            className={`${e.soloXl ? 'hidden xl:flex' : 'flex'} items-center h-10 whitespace-nowrap text-sm font-medium text-neutral-400 hover:text-white transition-colors`}
                        >
                            {e.label}
                        </a>
                    ))}
                    <Link
                        href={DIAGNOSTICO_LOGISTICA}
                        className="flex items-center h-10 gap-1.5 whitespace-nowrap text-sm font-semibold text-white"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF5520]" aria-hidden />
                        Autodiagnóstico
                    </Link>
                </nav>
                <div className="flex shrink-0 items-center gap-3">
                    <Link
                        href={DIAGNOSTICO_LOGISTICA}
                        className="hidden sm:inline-flex lg:hidden items-center gap-1.5 text-sm font-semibold text-white"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF5520]" aria-hidden />
                        Autodiagnóstico (2 min)
                    </Link>
                    {/* Celular y tablet: directo a WhatsApp. Desktop: al bloque de contacto, con la agenda */}
                    <a
                        href={WHATSAPP_HREF}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="lg:hidden px-4 py-2 bg-[#D4430E] text-white text-xs sm:text-sm font-bold rounded-full whitespace-nowrap active:scale-95 transition"
                    >
                        Diagnóstico gratuito
                    </a>
                    <a
                        href="#contacto"
                        onClick={(e) => irA(e, '#contacto')}
                        className="hidden lg:flex items-center h-10 px-5 bg-[#D4430E] hover:bg-[#BF3A0B] text-white text-sm font-heading font-bold rounded-full whitespace-nowrap shadow-[0_4px_20px_rgba(255,85,32,0.3)] active:scale-95 transition"
                    >
                        Agendar diagnóstico<span className="hidden xl:inline">&nbsp;(30 min)</span>
                    </a>
                </div>
            </div>
        </motion.header>
    )
}

/* ---------- 1. Hero ---------- */
function Hero() {
    return (
        <section data-bloque="hero" data-hero className="relative bg-[#0B0D0E] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C84214]/15 via-transparent to-transparent pointer-events-none" />
            <div
                aria-hidden
                className="hidden lg:block absolute inset-0 bg-[linear-gradient(rgba(183,179,176,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(183,179,176,0.035)_1px,transparent_1px)] bg-[size:88px_88px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] pointer-events-none"
            />
            <div
                className={`${CONTENEDOR} relative pt-28 pb-6 lg:pt-32 lg:pb-20 lg:min-h-[min(100svh,860px)] lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:items-center`}
            >
                <div className="hero-intro">
                    <Eyebrow>Logística y distribución</Eyebrow>
                    <h1 className="mt-3 lg:mt-5 text-[1.75rem] lg:text-[2.6rem] xl:text-[3rem] font-heading font-extrabold leading-[1.12] lg:leading-[1.06] tracking-tight text-white">
                        {H1_TEXT}
                    </h1>
                    <p className="mt-4 lg:mt-6 text-base lg:text-xl text-neutral-300 leading-relaxed">
                        Un asistente por WhatsApp responde el estado de cada entrega, coordina las visitas y avisa cuando algo
                        se demora. <span className="text-white">Sin cambiar tu sistema actual.</span>
                    </p>
                    <div className="mt-7 lg:mt-9 space-y-3 lg:space-y-0 lg:flex lg:flex-wrap lg:items-center lg:gap-3 xl:gap-4">
                        <a
                            href={WHATSAPP_HREF}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="lg:hidden w-full py-4 px-5 bg-[#D4430E] text-white font-heading font-bold text-base rounded-2xl shadow-[0_4px_30px_rgba(255,85,32,0.35)] flex items-center justify-center gap-2"
                        >
                            Pedí un diagnóstico gratuito
                            <ArrowRight className="w-4 h-4" aria-hidden />
                        </a>
                        <a
                            href="#contacto"
                            onClick={(e) => irA(e, '#contacto')}
                            className="group hidden lg:flex items-center gap-2 whitespace-nowrap py-4 px-7 bg-[#D4430E] hover:bg-[#BF3A0B] text-white font-heading font-bold text-base rounded-2xl shadow-[0_4px_30px_rgba(255,85,32,0.35)] active:scale-[0.99] transition"
                        >
                            Pedí un diagnóstico gratuito
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden />
                        </a>
                        <Link
                            href={DIAGNOSTICO_LOGISTICA}
                            className="lg:hidden w-full py-3.5 px-5 rounded-2xl border border-white/15 text-neutral-200 font-medium text-sm flex items-center justify-center"
                        >
                            Calcular costo de entregas fallidas (2 min)
                        </Link>
                        <a
                            href="#calculadora"
                            onClick={(e) => irA(e, '#calculadora')}
                            className="hidden lg:flex items-center gap-1.5 whitespace-nowrap py-4 px-5 rounded-2xl border border-white/15 hover:border-white/30 text-neutral-200 hover:text-white font-medium transition-colors"
                        >
                            Calcular costo de entregas fallidas
                            <ChevronDown className="w-4 h-4 text-[#FF5520]" aria-hidden />
                        </a>
                    </div>
                    <p className="mt-3 lg:mt-4 text-center lg:text-left text-xs lg:text-sm text-neutral-400 font-mono">
                        Desde $160.000/mes + IVA · Sin permanencia
                    </p>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative mt-6 lg:mt-0"
                >
                    <PhoneChatHero />
                </motion.div>
            </div>
        </section>
    )
}

/* ---------- 2. La objeción principal + flujo en 3 pasos ---------- */
function ComoFunciona() {
    return (
        <section id="como-funciona" data-bloque="como_funciona" className={SECCION}>
            <div className={`${CONTENEDOR} ${PADDING}`}>
                <Reveal>
                    <div className="rounded-3xl border border-[#FF5520]/30 bg-gradient-to-b lg:bg-gradient-to-r from-[#1C100C] to-[#0E0F11] p-5 lg:p-10 lg:grid lg:grid-cols-[auto_1fr] lg:gap-12 lg:items-center">
                        <div className="flex justify-center">
                            <Icono3D
                                src="/3d/chofer-volante-celular.png"
                                w={640}
                                h={635}
                                sizes="(min-width: 1024px) 224px, 160px"
                                className="h-40 lg:h-56 w-auto"
                            />
                        </div>
                        <div>
                            <div className="mt-4 lg:mt-0 flex items-center gap-2">
                                <Image src="/logos/telegram.svg" alt="Telegram" width={24} height={24} className="w-6 h-6 lg:w-7 lg:h-7" />
                                <Image src="/logos/whatsapp.svg" alt="WhatsApp" width={24} height={24} className="w-6 h-6 lg:w-7 lg:h-7" />
                            </div>
                            <h2 className="mt-2 lg:mt-4 font-heading font-bold text-white text-lg lg:text-[1.75rem] leading-snug lg:leading-tight">
                                Sin app propia ni hardware para tus choferes
                            </h2>
                            <p className="mt-2 lg:mt-3 text-sm lg:text-lg text-neutral-300 leading-relaxed lg:max-w-2xl">
                                Comparten la ubicación desde un bot de Telegram, en el mismo celular. Tus clientes reciben los
                                avisos por WhatsApp.
                            </p>
                        </div>
                    </div>
                </Reveal>

                <div className="mt-12 lg:mt-24">
                    <Reveal className="lg:text-center lg:max-w-2xl lg:mx-auto">
                        <Icono3D src="/3d/icono-cinta-escaner.png" w={560} h={544} className="h-16 lg:h-20 w-auto mb-3 lg:mb-5 lg:mx-auto" />
                        <Eyebrow>En la práctica</Eyebrow>
                        <Titulo>Así de simple se ve en tu operación</Titulo>
                    </Reveal>
                    <ol className="mt-6 lg:mt-12 space-y-3 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-5">
                        {flowSteps.map((s, i) => (
                            <motion.li
                                key={s.n}
                                initial={{ opacity: 0, y: 14 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="relative flex items-center gap-4 rounded-2xl border border-[#3E3D3A] bg-[#161514] p-4 lg:flex-col lg:text-center lg:gap-0 lg:p-8 lg:hover:border-[#FF5520]/40 transition-colors"
                            >
                                <Icono3D src={s.src} w={s.w} h={s.h} className="h-14 w-14 lg:h-20 lg:w-20 shrink-0" />
                                <div>
                                    <p className="lg:mt-5 font-mono text-[11px] font-semibold uppercase tracking-widest text-[#FFA380]">
                                        Paso {s.n}
                                    </p>
                                    <h3 className="font-heading font-bold text-white lg:text-xl lg:mt-1.5">{s.title}</h3>
                                    <p className="text-sm lg:text-base text-neutral-400 leading-relaxed lg:mt-2">{s.desc}</p>
                                </div>
                                {i < flowSteps.length - 1 && (
                                    <ArrowRight
                                        className="hidden lg:block absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 text-[#FF5520]/70"
                                        aria-hidden
                                    />
                                )}
                            </motion.li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    )
}

/* ---------- 3. Dolor ---------- */
function Dolor() {
    return (
        <section data-bloque="dolor" className={SECCION}>
            <Glow className="w-[620px] h-[420px] left-1/2 -translate-x-1/2 top-20 bg-[#FF5520]/[0.05]" />
            <div className={`${CONTENEDOR} ${PADDING} relative`}>
                <div className="flex justify-center lg:hidden">
                    <Icono3D src="/3d/operario-cajas.png" w={529} h={560} className="w-44 h-auto" />
                </div>
                <h2 className="mt-4 lg:mt-0 text-[1.5rem] lg:text-[2.6rem] font-heading font-extrabold text-white text-center leading-tight lg:leading-[1.08] tracking-tight lg:max-w-3xl lg:mx-auto">
                    Si esto pasa en tu operación, se puede automatizar.
                </h2>
                <div className="mt-8 lg:hidden">
                    <PainCarousel pains={pains} />
                </div>
                <div className="hidden lg:block mt-14">
                    <PainCarouselDesktop pains={pains} />
                </div>
                <p className="mt-8 lg:mt-14 border-l-2 border-[#FF5520] pl-4 lg:pl-6 text-base lg:text-xl text-white font-medium leading-relaxed lg:max-w-3xl lg:mx-auto">
                    {PAIN_CLOSE}
                </p>
            </div>
        </section>
    )
}

/* ---------- 4. Módulos por momento ---------- */
function Modulos() {
    const [momento, setMomento] = useState<(typeof MOMENTOS)[number]['id']>('antes')
    const esDesktop = useEsDesktop()
    const indice = MOMENTOS.findIndex((m) => m.id === momento)
    const activo = MOMENTOS[indice]
    const siguiente = MOMENTOS[(indice + 1) % MOMENTOS.length]
    const lista = activo.pasos.map((p) => modules.find((m) => m.step === p)!)

    return (
        <section id="modulos" data-bloque="modulos" className={SECCION}>
            <div className={`${CONTENEDOR} ${PADDING}`}>
                <div className="lg:flex lg:items-end lg:justify-between lg:gap-12">
                    <Reveal>
                        <Icono3D src="/3d/icono-notif.png" w={512} h={376} className="h-12 lg:h-16 w-auto mb-3 lg:mb-5" />
                        <Eyebrow>Antes, durante y después de la entrega</Eyebrow>
                        <Titulo>Qué automatizamos, momento a momento</Titulo>
                    </Reveal>
                    <div
                        role="tablist"
                        aria-label="Momento de la entrega"
                        className="mt-6 lg:mt-0 grid grid-cols-3 gap-1.5 rounded-2xl bg-white/[0.04] border border-white/5 p-1.5 lg:min-w-[480px] lg:shrink-0"
                    >
                        {MOMENTOS.map((m, i) => (
                            <button
                                key={m.id}
                                type="button"
                                role="tab"
                                id={`tab-${m.id}`}
                                aria-selected={m.id === momento}
                                aria-controls="panel-modulos"
                                onClick={() => setMomento(m.id)}
                                className={`py-2.5 lg:py-3 rounded-xl text-[13px] lg:text-sm font-semibold transition-colors ${
                                    m.id === momento ? 'bg-[#D4430E] text-white' : 'text-neutral-400 hover:text-white'
                                }`}
                            >
                                <span className="hidden lg:inline font-mono text-xs mr-1.5" aria-hidden>0{i + 1}</span>
                                {m.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div
                    role="tabpanel"
                    id="panel-modulos"
                    aria-labelledby={`tab-${momento}`}
                    className={`mt-4 lg:mt-10 space-y-3 lg:space-y-0 lg:grid lg:gap-5 lg:items-start ${
                        lista.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
                    }`}
                >
                    {lista.map((m, i) => {
                        const Demo = m.Demo
                        return (
                            <motion.details
                                key={`${momento}-${m.step}`}
                                open={esDesktop || i === 0}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#14161A] to-[#0A0C0E] p-4 lg:p-6 lg:hover:border-[#FF5520]/40 transition-colors"
                            >
                                <summary
                                    onClick={(e) => esDesktop && e.preventDefault()}
                                    className="cursor-pointer lg:cursor-default list-none flex gap-3.5"
                                >
                                    <div className="shrink-0 w-14 h-14 rounded-xl bg-white/[0.04] border border-white/10 p-1.5 flex items-center justify-center">
                                        <Icono3D src={m.img} w={m.iw} h={m.ih} className="h-full w-auto" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="hidden lg:block text-[11px] font-mono uppercase tracking-widest text-[#FFA380]">{m.context}</p>
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-heading font-bold text-white leading-snug lg:text-lg lg:mt-0.5">
                                                {NOMBRE_CORTO[m.step] ?? m.name}
                                            </h3>
                                            <ChevronDown
                                                className="lg:hidden mt-1 w-4 h-4 shrink-0 text-[#FF5520] transition-transform group-open:rotate-180"
                                                aria-hidden
                                            />
                                        </div>
                                        <p className="mt-1 text-sm text-neutral-400 leading-relaxed lg:hidden">{m.descShort}</p>
                                    </div>
                                </summary>
                                <p className="hidden lg:block mt-4 text-sm text-neutral-300 leading-relaxed">{m.descShort}</p>
                                <div className="mt-4 lg:mt-5 space-y-4">
                                    <div className="border-l-2 border-[#FF5520] bg-black/50 p-3 rounded-xl">
                                        <p className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#FFA380]">
                                            <Quote className="w-3 h-3" aria-hidden />
                                            Lo que se escucha en el rubro
                                        </p>
                                        <p className="mt-1.5 text-sm italic text-neutral-200 leading-relaxed">{m.quote}</p>
                                    </div>
                                    {Demo && <Demo />}
                                </div>
                            </motion.details>
                        )
                    })}
                </div>

                <div className="mt-6 lg:mt-8 flex justify-end">
                    <button
                        type="button"
                        onClick={() => setMomento(siguiente.id)}
                        className="inline-flex items-center gap-1.5 py-2 text-sm font-medium text-[#FFA380] hover:text-white transition-colors"
                    >
                        {indice < MOMENTOS.length - 1 ? `Siguiente: ${siguiente.label}` : `Volver a: ${siguiente.label}`}
                        <ArrowRight className="w-4 h-4" aria-hidden />
                    </button>
                </div>
            </div>
        </section>
    )
}

/* ---------- 5. Calculadora: link en celular, en vivo en desktop ---------- */
function Calculadora() {
    const [entregasDia, setEntregasDia] = useState(120)
    const [porcentajeFallos, setPorcentajeFallos] = useState(8)
    const usada = useRef(false)
    const marcarUso = () => {
        if (usada.current) return
        usada.current = true
        trackEvent('logistica_calculadora_usada', { vista: 'desktop' })
    }

    return (
        <section id="calculadora" data-bloque="calculadora" className={SECCION}>
            <Glow className="w-[560px] h-[560px] -left-48 top-10 bg-[#FF5520]/[0.06]" />
            <div className={`${CONTENEDOR} ${PADDING} relative`}>
                {/* Celular y tablet: la calculadora vive en el autodiagnóstico */}
                <div className="lg:hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 overflow-hidden">
                    <Image
                        src="/3d/ilustracion-reparto.png"
                        alt=""
                        aria-hidden
                        width={900}
                        height={522}
                        sizes="(min-width: 640px) 600px, 360px"
                        className="w-full h-auto object-contain drop-shadow-[0_18px_40px_rgba(200,66,20,0.28)]"
                    />
                    <h2 className="mt-4 font-heading font-extrabold text-white text-xl leading-tight">
                        ¿Cuánto te cuestan las entregas fallidas?
                    </h2>
                    <p className="mt-2 text-sm text-neutral-400">
                        Cargá tus entregas por día y el porcentaje que falla. En 2 minutos ves la pérdida por mes.
                    </p>
                    <Link
                        href={DIAGNOSTICO_LOGISTICA}
                        className="mt-5 w-full py-3.5 px-5 bg-[#D4430E] text-white font-heading font-bold rounded-2xl flex items-center justify-center gap-2"
                    >
                        Calcular mi costo
                        <ArrowRight className="w-4 h-4" aria-hidden />
                    </Link>
                </div>

                {/* Desktop: la calculadora en vivo al lado */}
                <div className="hidden lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 lg:items-center">
                    <Reveal>
                        <Image
                            src="/3d/ilustracion-reparto.png"
                            alt=""
                            aria-hidden
                            width={900}
                            height={522}
                            sizes="440px"
                            className="w-full max-w-[440px] h-auto object-contain drop-shadow-[0_24px_50px_rgba(200,66,20,0.28)]"
                        />
                        <Eyebrow className="mt-6">Calculadora</Eyebrow>
                        <Titulo className="lg:text-[2.25rem]!">¿Cuánto te cuestan las entregas fallidas?</Titulo>
                        <p className="mt-4 text-lg text-neutral-400 leading-relaxed">
                            Mové los valores de tu operación y mirá cuánto se va por mes en viajes en falso.
                        </p>
                        <Link
                            href={DIAGNOSTICO_LOGISTICA}
                            className="mt-6 inline-flex items-center gap-1.5 font-medium text-[#FFA380] hover:text-white transition-colors"
                        >
                            Hacer el diagnóstico completo (2 min)
                            <ArrowRight className="w-4 h-4" aria-hidden />
                        </Link>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <CalculadoraFinancieraViva
                            entregasDia={entregasDia}
                            setEntregasDia={(v) => {
                                marcarUso()
                                setEntregasDia(v)
                            }}
                            porcentajeFallos={porcentajeFallos}
                            setPorcentajeFallos={(v) => {
                                marcarUso()
                                setPorcentajeFallos(v)
                            }}
                        />
                    </Reveal>
                </div>
            </div>
        </section>
    )
}

/* ---------- 6. Más módulos ---------- */
/** Ejemplo del parte semanal al dador (datos ilustrativos). */
function ParteDadorDemo() {
    const filas = [
        { label: 'Entregas confirmadas', valor: '142 / 148', color: 'text-emerald-400' },
        { label: 'Con evidencia doble', valor: '140', color: 'text-[#E8E5DE]' },
        { label: 'Visitas fallidas justificadas', valor: '4', color: 'text-[#B7B3B0]' },
        { label: 'Reclamos sin sustento', valor: '2', color: 'text-rose-300' },
    ]
    return (
        <div className="rounded-xl border border-[#3E3D3A] bg-[#1A1918] p-4">
            <p className="text-[10px] uppercase tracking-widest text-[#B7B3B0] font-semibold">Parte semanal · Vendedor Flex #274</p>
            <div className="mt-3 space-y-2">
                {filas.map((f) => (
                    <div key={f.label} className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-neutral-400">{f.label}</span>
                        <span className={`font-mono font-semibold ${f.color}`}>{f.valor}</span>
                    </div>
                ))}
            </div>
            <p className="mt-3 pt-2.5 border-t border-white/[0.06] text-[10px] text-[#8C8C8C]">Datos ilustrativos, no de un cliente real.</p>
        </div>
    )
}

const MAS_MODULOS = [
    {
        id: 'flota',
        img: { src: '/3d/icono-credencial.png', w: 344, h: 512 },
        etiqueta: 'Flota y operación interna',
        nombre: 'Admisión de choferes',
        resumen: 'El chofer carga licencia, cédula, VTV y seguro por web. Se validan los vencimientos al instante.',
        detalle:
            'Tráfico recibe un resumen por zona y tipo de vehículo, listo para coordinar turnos. Al que no califica se le avisa el motivo.',
        Demo: DriverAdmissionDemo,
    },
    {
        id: 'dador',
        img: { src: '/3d/icono-remito.png', w: 512, h: 494 },
        etiqueta: 'Para logísticas de e-commerce',
        nombre: 'Parte del dador',
        resumen: 'Cada visita queda con doble evidencia: registro del chofer y confirmación del destinatario.',
        detalle:
            'Al vendedor que te da la carga le mandás un parte periódico neutral, que respalda a las dos partes frente a reclamos o extravíos.',
        Demo: ParteDadorDemo,
    },
    {
        id: 'panel',
        img: { src: '/3d/icono-monitor.png', w: 512, h: 507 },
        etiqueta: 'El panel',
        nombre: 'Parte mensual de operación',
        resumen: 'Todo lo que hacen los módulos, junto: reprogramaciones evitadas, devoluciones salvadas, reclamos.',
        detalle:
            'Le preguntás en lenguaje natural qué pasó en tu operación. La IA marca los patrones por zona y horario; vos decidís.',
        Demo: MonthlyOperationsDemo,
    },
]

function MasModulos() {
    const esDesktop = useEsDesktop()
    return (
        <section id="mas-modulos" data-bloque="mas_modulos" className={SECCION}>
            <div className={`${CONTENEDOR} ${PADDING}`}>
                <Reveal>
                    <Eyebrow>También podés sumar</Eyebrow>
                    <Titulo className="hidden lg:block">Para tu flota, tus dadores y tu dirección.</Titulo>
                </Reveal>
                <div className="mt-4 lg:mt-10 space-y-3 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:items-start">
                    {MAS_MODULOS.map(({ id, img, etiqueta, nombre, resumen, detalle, Demo }, i) => (
                        <Reveal key={id} delay={0.06 * i}>
                            <details
                                open={esDesktop}
                                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 lg:p-6 hover:border-white/20 transition-colors"
                            >
                                <summary
                                    onClick={(e) => esDesktop && e.preventDefault()}
                                    className="cursor-pointer lg:cursor-default list-none flex gap-3.5 lg:flex-col lg:gap-4"
                                >
                                    <Icono3D src={img.src} w={img.w} h={img.h} className="h-14 w-14 lg:h-16 lg:w-16 shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-[11px] font-mono uppercase tracking-wider text-[#FFA380]">{etiqueta}</p>
                                        <div className="mt-0.5 flex items-center justify-between gap-2">
                                            <h3 className="font-heading font-bold text-white lg:text-lg">{nombre}</h3>
                                            <ChevronDown
                                                className="lg:hidden w-4 h-4 shrink-0 text-[#FF5520] transition-transform group-open:rotate-180"
                                                aria-hidden
                                            />
                                        </div>
                                        <p className="mt-1 lg:mt-2 text-sm text-neutral-400 leading-relaxed">{resumen}</p>
                                    </div>
                                </summary>
                                <div className="mt-4 space-y-4 border-t border-white/5 pt-4">
                                    <p className="text-sm text-neutral-300 leading-relaxed">{detalle}</p>
                                    {Demo && <Demo />}
                                </div>
                            </details>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    )
}

/* ---------- 7. Confianza ---------- */
function Confianza() {
    return (
        <section data-bloque="confianza" className={SECCION}>
            <div className={`${CONTENEDOR} py-14 lg:py-20`}>
                <Reveal>
                    <FounderCard
                        frase="Antes de proponerte nada, miramos juntos cuántas entregas te fallan hoy y por qué. Trabajamos mes a mes: si deja de servirte, cortás."
                        chips={['Sin permanencia', 'Mes a mes', 'Infraestructura aislada', 'Ley 25.326']}
                        whatsappHref={WHATSAPP_HREF}
                    />
                </Reveal>
            </div>
        </section>
    )
}

/* ---------- 8. Contacto ---------- */
function Contacto() {
    return (
        <section id="contacto" data-bloque="contacto" data-contacto className={SECCION}>
            <Glow className="w-[600px] h-[600px] -left-48 bottom-0 bg-[#FF5520]/[0.06]" />
            <div className={`${CONTENEDOR} ${PADDING} relative lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:items-start`}>
                <Reveal>
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                        <Icono3D src="/3d/icono-caja-premio.png" w={512} h={479} className="h-24 lg:h-28 w-auto" />
                        <p className="mt-3 text-sm lg:text-base text-neutral-400">
                            Cada entrega, con estándar de calidad. Eso es lo que{' '}
                            <span className="text-neutral-200">defiende tu reputación</span>.
                        </p>
                    </div>
                    <div className="mt-8">
                        <Titulo>¿Lo vemos en tu operación?</Titulo>
                        <p className="mt-2 lg:mt-4 text-sm lg:text-lg text-neutral-400">
                            Diagnóstico gratuito de 30 minutos, directo con Gabriel.
                        </p>
                    </div>
                    <div className="mt-6 lg:mt-8 space-y-3">
                        <a
                            href={WHATSAPP_HREF}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-4 px-5 bg-[#25D366] hover:brightness-110 text-[#0B0D0E] font-heading font-bold rounded-2xl flex items-center justify-center gap-2 transition"
                        >
                            <WhatsappIcon className="w-5 h-5" />
                            Pedir diagnóstico gratuito
                        </a>
                        <div className="hidden lg:flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                            <Image
                                src="/qr-whatsapp.svg"
                                alt="Código QR para escribirnos por WhatsApp"
                                width={96}
                                height={96}
                                className="w-24 h-24 rounded-xl bg-white p-1.5"
                            />
                            <p className="text-sm text-neutral-300 leading-relaxed">
                                ¿Estás en la compu?{' '}
                                <span className="text-white font-semibold">Escaneá el código con tu celular</span> y seguimos
                                la charla por WhatsApp.
                            </p>
                        </div>
                        <Link
                            href={DIAGNOSTICO_LOGISTICA}
                            className="w-full py-3.5 px-5 rounded-2xl border border-white/15 hover:border-white/30 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                            Calcular costo de entregas fallidas (2 min)
                        </Link>
                    </div>
                    <p className="mt-4 text-center lg:text-left text-xs text-[#8C8C8C]">
                        Planes desde $160.000/mes + IVA según volumen de guías. Los avisos a tus clientes salen de tu propio número de WhatsApp y Meta los cobra aparte, según tu uso.
                    </p>
                </Reveal>
                <div className="hidden lg:block">
                    <CalendlyEmbed seccion="logistica_contacto" />
                </div>
            </div>
        </section>
    )
}

function Footer() {
    return (
        <footer className="bg-[#0B0D0E] border-t border-white/10">
            <div className={`${CONTENEDOR} pt-8 pb-28 lg:pt-12 lg:pb-12 lg:flex lg:items-center lg:justify-between lg:gap-8`}>
                <nav aria-label="Enlaces del pie" className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-neutral-400">
                    <Link href="/" className="hover:text-white transition-colors">Volver al inicio</Link>
                    <Link href="/legal#privacidad" className="hover:text-white transition-colors">Privacidad</Link>
                    <Link href="/legal#terminos" className="hover:text-white transition-colors">Términos</Link>
                    <a href={`mailto:${EMAIL}`} className="hidden lg:inline hover:text-white transition-colors">{EMAIL}</a>
                </nav>
                <p className="mt-6 lg:mt-0 text-xs text-[#8C8C8C]">© {new Date().getFullYear()} INDIVIDRA · Buenos Aires</p>
            </div>
        </footer>
    )
}

export function LogisticaLanding() {
    const rootRef = useRef<HTMLDivElement>(null)
    const barraVisible = usePagina(rootRef, 'logistica')

    return (
        <main id="main-content" className="min-h-screen bg-[#0B0D0E] text-white antialiased">
            <MotionConfig reducedMotion="user">
                <Barra />
                <div ref={rootRef}>
                    <Hero />
                    <ComoFunciona />
                    <Dolor />
                    <Modulos />
                    <Calculadora />
                    <MasModulos />
                    <Confianza />
                    <Contacto />
                    <Footer />
                    <StickyBar
                        visible={barraVisible}
                        href={DIAGNOSTICO_LOGISTICA}
                        label="Calcular mi costo (2 min)"
                        whatsappHref={WHATSAPP_HREF}
                    />
                </div>
            </MotionConfig>
        </main>
    )
}
