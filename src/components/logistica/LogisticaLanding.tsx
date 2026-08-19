'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Quote } from 'lucide-react'
import {
    AmbientOrbs,
    RouteDivider,
    SelfSchedulingIcon,
    HomeAccessIcon,
    PositionAlertIcon,
    ExpirationClockIcon,
    ReputationShieldIcon,
    AnomalyLogIcon,
    DriverAdmissionIcon,
} from './LogisticaAnimations'
import { RouteRoadmap } from './RouteRoadmap'
import { PhoneChatHero } from './PhoneChatHero'
import { PainCarousel } from './PainCarousel'
import {
    PriorNoticeDemo,
    HomeAccessDemo,
    PositionAlertDemo,
    ExpirationClockDemo,
    ReputationShieldDemo,
    AnomalyLogDemo,
    DriverAdmissionDemo,
} from '@/components/ui/micro-demos'

const WHATSAPP_HREF =
    'https://wa.me/5491160152435?text=' +
    encodeURIComponent('Hola Individra, quiero coordinar el diagnostico gratuito de 30 minutos para logistica.')

const H1_TEXT = 'Tu administración se pasa el día contestando "¿dónde está mi pedido?".'

const pains = [
    'El teléfono y el WhatsApp de administración explotan con clientes preguntando por sus entregas. La misma pregunta, cien veces por día.',
    'Los remitos se cargan a mano, uno por uno, y siempre hay errores de tipeo.',
    'El seguimiento de entregas vive en planillas sueltas y en la cabeza de dos personas.',
    'Los avisos de "salió tu pedido" o "hay una demora" dependen de que alguien se acuerde de mandarlos.',
    'Fuera de horario, nadie contesta. La consulta espera al día siguiente o se va con otro.',
    'Las entregas fallan porque el chofer no sabe cómo acceder al domicilio. Nadie guarda esa información para la próxima vez.',
    'Los paquetes se devuelven al remitente sin que nadie avise a tiempo. El costo del viaje de ida ya se pagó y no se cobró.',
]

const PAIN_CLOSE =
    'Ninguna de estas tareas necesita criterio. Todas consumen horas de gente que debería estar resolviendo lo que sí importa.'

const modules = [
    {
        step: 1,
        context: 'Al coordinar la entrega',
        quote: 'Me imponen el día y nunca preguntan si voy a estar.',
        name: 'Coordinación previa',
        desc: 'La noche anterior, cada destinatario recibe un mensaje: ¿vas a estar mañana? El que no puede, se saca de la carga antes de cargar el camión. Sin cambiar cómo armás tu ruta. Si después querés ofrecer franjas horarias, se activa sin tocar nada.',
        Icon: SelfSchedulingIcon,
        descShort: 'La noche anterior, cada destinatario confirma si va a estar mañana. El que no puede, se saca de la carga antes de cargar el camión.',
        Demo: PriorNoticeDemo,
    },
    {
        step: 2,
        context: 'Antes de cargar el camión',
        quote: 'Es un barrio cerrado con guardia 24 horas y ponen que no había nadie.',
        name: 'Ficha del domicilio',
        desc: 'Después de la primera entrega a una dirección, el sistema guarda cómo se accede: portería, timbre, entre calles, si acepta dejar con vecino. La próxima vez, el dato viaja con la hoja de ruta sin que nadie lo busque.',
        Icon: HomeAccessIcon,
        descShort: 'Después de la primera entrega, el sistema guarda cómo se accede: portería, timbre, entre calles. La próxima vez, viaja con la hoja de ruta.',
        Demo: HomeAccessDemo,
    },
    {
        step: 3,
        context: 'Durante la entrega',
        quote: 'Estuve de 9 a 18 esperando y nunca vinieron. Perdí el día entero.',
        name: 'Aviso por posición',
        desc: 'A medida que el chofer avanza en su ruta, el destinatario recibe cuántas paradas faltan. Sin horarios inventados: si faltan 2 paradas, dice 2 paradas. Se activa por caso. No se cobra en las entregas donde no se usa.',
        Icon: PositionAlertIcon,
        descShort: 'El destinatario recibe cuántas paradas faltan, sin horarios inventados. Se activa por caso, no se cobra si no se usa.',
        Demo: PositionAlertDemo,
    },
    {
        step: 4,
        context: 'Si algo falla',
        quote: 'Hoy era el último día de plazo. Nadie me avisó y lo devolvieron al remitente.',
        name: 'Reloj de vencimiento',
        desc: 'Cuenta los días que un paquete lleva sin entregarse. Avisa al destinatario a los 5, 2 y 1 día antes de que se devuelva. Y le manda al dueño la lista de paquetes en riesgo cada mañana.',
        Icon: ExpirationClockIcon,
        descShort: 'Cuenta los días sin entrega y avisa al destinatario antes de la devolución. Al dueño le manda la lista de riesgo cada mañana.',
        Demo: ExpirationClockDemo,
    },
    {
        step: 5,
        context: 'Después de la entrega',
        quote: 'Una empresa espectacular pero nadie te pide que dejes reseña. Los únicos que escriben son los enojados.',
        name: 'Escudo de reputación',
        desc: 'Después de cada entrega exitosa, el destinatario recibe un mini-formulario de satisfacción. Si está contento, se le ofrece dejar una reseña en Google con un solo tap. Si tiene un reclamo, se captura de forma privada antes de que llegue a las redes. Cero fricción para el chofer: corre solo. ~USD 10/mes de WhatsApp.',
        Icon: ReputationShieldIcon,
        descShort: 'Si el destinatario está contento, un tap lo lleva a Google. Si tiene un reclamo, se captura privado. Cero fricción para el chofer.',
        Demo: ReputationShieldDemo,
    },
    {
        step: 6,
        context: 'Control de operación',
        quote: 'Dijeron que pasaron y que no había nadie. Es mentira, estuve en casa todo el día.',
        name: 'Registro de anomalías',
        desc: 'Cuando una visita se marca como fallida lejos del domicilio, el evento queda registrado con fecha, hora y ubicación, y se cruza con la confirmación del destinatario para que el reporte tenga evidencia de dos fuentes, no una sospecha. A fin de mes tenés un reporte de qué pasó de verdad en tu operación, sin acusar a nadie en el momento.',
        Icon: AnomalyLogIcon,
        descShort: 'Cuando una visita se marca como fallida lejos del domicilio, queda registrada y cruzada con la confirmación del destinatario. A fin de mes tenés el reporte.',
        Demo: AnomalyLogDemo,
    },
]

const reveal = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
}

export function LogisticaLanding() {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <main className="min-h-screen bg-[#0f0f1a] text-white antialiased">
            {/* ===== Top bar: mismo estilo flotante que el Navbar del home ===== */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed top-4 left-4 right-4 z-[100] transition-all duration-500 rounded-2xl ${
                    isScrolled
                        ? 'bg-black/80 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20'
                        : 'bg-black/20 backdrop-blur-sm border border-white/5'
                }`}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link href="/" className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors" aria-label="Volver al inicio">
                            <ArrowRight className="w-4 h-4 text-neutral-300 rotate-180" />
                        </Link>
                        <Link href="/" className="flex items-center" aria-label="Volver al inicio">
                            <Image src="/logo-individra.png" alt="INDIVIDRA" width={280} height={100} className="h-12 sm:h-16 lg:h-20 w-auto" priority />
                        </Link>
                    </div>
                    <a
                        href={WHATSAPP_HREF}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 lg:px-5 lg:py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs sm:text-sm font-medium rounded-full hover:shadow-lg hover:shadow-violet-500/25 hover:scale-105 active:scale-95 transition-all duration-200 whitespace-nowrap"
                    >
                        Diagnóstico gratuito
                    </a>
                </div>
            </motion.header>

            {/* ===== 1) HERO ===== */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/25 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.04)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />

                <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-24 sm:pt-36 sm:pb-32">
                    <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-8 items-center">
                        <div>
                            <motion.p {...reveal} className="text-violet-400 text-sm font-medium uppercase tracking-widest">
                                Logística y distribución
                            </motion.p>

                            <motion.h1
                                {...reveal}
                                transition={{ delay: 0.05 }}
                                className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white"
                            >
                                {H1_TEXT}
                            </motion.h1>

                            <motion.p
                                {...reveal}
                                transition={{ delay: 0.1 }}
                                className="mt-6 text-neutral-400 text-lg leading-relaxed max-w-2xl"
                            >
                                Montamos un asistente por WhatsApp, web y teléfono que responde el estado de cada entrega con datos
                                reales, coordina las visitas antes de que salga el camión y avisa solo cuando algo se demora.{' '}
                                <span className="text-neutral-200">Sin cambiar tu sistema actual.</span>
                            </motion.p>

                            <motion.div {...reveal} transition={{ delay: 0.15 }} className="mt-9">
                                <a
                                    href={WHATSAPP_HREF}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 text-white font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                                >
                                    Pedí un diagnóstico gratuito de 30 minutos
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                                </a>
                                <p className="mt-3 text-neutral-500 text-sm">
                                    Sin permanencia. Mes a mes. Infraestructura propia y aislada (GDPR).
                                </p>
                            </motion.div>
                        </div>

                        {/* El producto es la conversacion: telefono con el chat en loop */}
                        <motion.div
                            initial={{ opacity: 0, y: 24, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                            className="relative py-4"
                        >
                            <PhoneChatHero />
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* ===== 2) DOLOR =====
                Desktop: bento grid con visual interno por card + fondo compartido
                abstracto (glows/líneas) que atraviesa el conjunto.
                Mobile: cards planas apiladas (versión anterior que funcionaba). */}
            <section className="relative border-y border-white/5 overflow-hidden">
                <AmbientOrbs className="absolute inset-0 pointer-events-none opacity-60" />
                <div className="relative max-w-6xl mx-auto px-6 py-20 sm:py-24">
                    <motion.h2 {...reveal} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center max-w-3xl mx-auto">
                        Si esto pasa en tu operación, se puede automatizar.
                    </motion.h2>

                    {/* Mobile/tablet (< lg): carrusel horizontal con swipe, sin autoplay.
                        Componente aprobado por el usuario (PainCarousel.tsx). */}
                    <div className="lg:hidden mt-10">
                        <PainCarousel pains={pains} />
                    </div>

                    {/* ========== DESKTOP (lg+): carousel de papeles saliendo de la persona ==========
                        Ilustración a la izquierda + slide destacado a la derecha con
                        el problema actual. Autoplay cada 6s (se pausa al hover),
                        navegación manual con flechas y dots. */}
                    <div className="hidden lg:block mt-14">
                        <DesktopPainCarousel pains={pains} />
                    </div>

                    <motion.p
                        {...reveal}
                        className="mt-8 lg:mt-12 border-l-2 border-violet-500 pl-5 text-lg sm:text-xl text-white font-medium leading-relaxed max-w-3xl mx-auto"
                    >
                        {PAIN_CLOSE}
                    </motion.p>
                </div>
            </section>

            {/* ===== 3) QUEJAS -> MÓDULOS ===== */}
            <section className="relative">
                <RouteDivider className="absolute top-0 left-0 w-full h-8" />
                <div className="max-w-6xl mx-auto px-6 py-20 sm:py-28">
                    <motion.h2 {...reveal} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white max-w-3xl">
                        Esto dicen los clientes de las logísticas en Google. Todos los días.
                    </motion.h2>
                    <motion.p {...reveal} transition={{ delay: 0.05 }} className="mt-5 text-neutral-400 text-base sm:text-lg max-w-3xl leading-relaxed">
                        Son reseñas reales, públicas, de empresas del rubro. Cada una es una tarea que hoy depende de que una
                        persona se acuerde, llame o tipee. Cada una se automatiza.
                    </motion.p>

                    <div className="mt-12 grid md:grid-cols-2 gap-5 lg:gap-6">
                        {modules.map((m, i) => {
                            const Icon = m.Icon
                            const Demo = m.Demo
                            return (
                            <motion.div
                                key={i}
                                {...reveal}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -4 }}
                                className="group relative flex flex-col p-6 lg:p-7 rounded-2xl border border-white/10 bg-[#1a1a2e]/60 overflow-hidden transition-colors duration-300 hover:border-violet-500/40"
                            >
                                {/* hover glow — solo desktop: en mobile no hay hover y el blur
                                    igual crea una capa de composición por card. */}
                                <div aria-hidden className="hidden lg:block pointer-events-none absolute -right-8 -top-8 w-40 h-40 rounded-full blur-[60px] bg-violet-500/0 group-hover:bg-violet-500/15 transition-colors duration-500" />

                                {/* Quote */}
                                <div className="relative border-l-2 border-violet-500 pl-4">
                                    <Quote className="absolute -left-1 -top-1 w-5 h-5 text-violet-500/40" aria-hidden />
                                    <p className="pl-4 text-neutral-400 italic leading-relaxed">{m.quote}</p>
                                </div>

                                {/* Module */}
                                <div className="mt-6">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-violet-500/40 bg-violet-500/15 text-[11px] font-bold text-violet-300">{m.step}</span>
                                        <span className="text-[11px] uppercase tracking-widest text-violet-400/70 font-medium">{m.context}</span>
                                        <span className="h-px flex-1 bg-white/10" />
                                    </div>
                                    <div className="mt-2 flex items-center gap-3">
                                        <div className="shrink-0 w-12 h-12 rounded-xl border border-violet-500/25 bg-violet-500/[0.07] p-1.5 group-hover:border-violet-500/50 group-hover:scale-105 transition-all duration-300">
                                            <Icon />
                                        </div>
                                        <h3 className="text-lg font-bold text-violet-400">{m.name}</h3>
                                    </div>
                                    <p className="mt-3 text-neutral-300 text-sm leading-relaxed lg:hidden">{m.descShort}</p>
                                    <p className="mt-3 text-neutral-300 text-sm leading-relaxed hidden lg:block">{m.desc}</p>

                                    {/* Micro-demo del módulo */}
                                    {Demo && (
                                        <div className="mt-4">
                                            <Demo />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                            )
                        })}
                    </div>

                    {/* Módulo Especial: Admisión y Onboarding de Choferes / Flota */}
                    <motion.div
                        {...reveal}
                        className="mt-8 rounded-2xl border border-violet-500/30 bg-gradient-to-br from-[#121124] via-[#0d0d1a] to-[#0a0a14] p-6 sm:p-8 relative overflow-hidden shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-7 space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-400/30 bg-violet-500/10 text-xs font-semibold text-violet-300 uppercase tracking-wider">
                                    Módulo de Flota & Operación Interna
                                </div>
                                
                                <div className="flex items-center gap-3.5">
                                    <div className="shrink-0 w-12 h-12 rounded-xl border border-violet-500/30 bg-violet-500/10 p-1.5 flex items-center justify-center">
                                        <DriverAdmissionIcon />
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                                        Admisión Inteligente de Choferes
                                    </h3>
                                </div>

                                <div className="border-l-2 border-violet-500/50 pl-4 py-1 text-sm text-neutral-400 italic">
                                    &ldquo;Perdemos días pidiendo fotos de cédulas, seguros y VTVs por WhatsApp mientras los camiones quedan parados o salen con papeles vencidos.&rdquo;
                                </div>

                                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                                    Screening documental en <strong>2 capas</strong> para incorporar transportistas calificados en minutos, sin carga administrativa ni riesgos legales:
                                </p>

                                <div className="grid sm:grid-cols-2 gap-3 pt-1">
                                    <div className="p-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                                        <div className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                            Capa 1: Validación Inmediata
                                        </div>
                                        <p className="text-xs text-neutral-400 leading-relaxed">
                                            El chofer carga 4 documentos (Licencia, Cédula, VTV, Seguro) vía web. El OCR extrae vencimientos en segundos y valida al instante.
                                        </p>
                                    </div>
                                    <div className="p-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                                        <div className="text-xs font-bold text-violet-400 mb-1 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                            Capa 2: Digest para Tráfico
                                        </div>
                                        <p className="text-xs text-neutral-400 leading-relaxed">
                                            Tráfico/RRHH recibe un resumen agrupado por zona y tipo de vehículo, listo para contactar y coordinar turnos sin leer papeles a mano.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-5 flex flex-col justify-center">
                                <DriverAdmissionDemo />
                            </div>
                        </div>
                    </motion.div>

                    {/* Cierre de conversión */}
                    {/* Remate: la ruta se dibuja con el scroll y enciende los módulos.
                        Cierra la metáfora que abre el hero. */}
                    <div className="mt-16">
                        <RouteRoadmap />
                    </div>

                    <motion.div
                        {...reveal}
                        className="mt-10 flex flex-col items-start gap-3 p-6 sm:p-8 rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-900/20 to-blue-900/10"
                    >
                        <a
                            href={WHATSAPP_HREF}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 text-white font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                        >
                            Pedí un diagnóstico gratuito de 30 minutos
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                        </a>
                        <p className="text-neutral-500 text-sm">
                            Sin permanencia. Mes a mes. Infraestructura propia y aislada (GDPR).
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ===== Footer mínimo ===== */}
            <footer className="border-t border-white/10 bg-[#0f0f1a]">
                <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Link href="/" className="text-neutral-400 hover:text-white text-sm transition-colors">
                        Volver al inicio
                    </Link>
                    <div className="flex items-center gap-5 text-sm text-neutral-500">
                        <Link href="/legal#privacidad" className="hover:text-white transition-colors">
                            Privacidad
                        </Link>
                        <Link href="/legal#terminos" className="hover:text-white transition-colors">
                            Términos
                        </Link>
                    </div>
                    <p className="text-neutral-600 text-sm">© {new Date().getFullYear()} Individra</p>
                </div>
            </footer>
        </main>
    )
}

/**
 * Carousel de dolor (desktop). Distinto del `PainCarousel` de mobile
 * (componente separado, PainCarousel.tsx, con swipe y sin autoplay).
 * Ilustración a la izquierda + slide destacado a la derecha mostrando
 * el pain actual. Autoplay cada 6s (se pausa al hover o al interactuar),
 * navegación manual con flechas y dots.
 */
const AUTOPLAY_MS = 6000

function DesktopPainCarousel({ pains }: { pains: string[] }) {
    const [current, setCurrent] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [progress, setProgress] = useState(0) // 0..1, alimenta la barra

    // Un solo reloj gobierna la barra Y el avance, así nunca se desincronizan.
    // Depende de `current`, con lo que cualquier navegación manual reinicia el
    // conteo desde cero. Al pausar se limpia el intervalo y la barra queda
    // congelada donde estaba.
    useEffect(() => {
        if (isPaused) return
        setProgress(0)
        const startedAt = Date.now()
        const id = setInterval(() => {
            const pct = Math.min((Date.now() - startedAt) / AUTOPLAY_MS, 1)
            setProgress(pct)
            if (pct >= 1) setCurrent((prev) => (prev + 1) % pains.length)
        }, 40)
        return () => clearInterval(id)
    }, [current, isPaused, pains.length])

    const goPrev = () => setCurrent((prev) => (prev - 1 + pains.length) % pains.length)
    const goNext = () => setCurrent((prev) => (prev + 1) % pains.length)

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="grid grid-cols-[auto_1fr] gap-8 xl:gap-14 items-center">
                {/* Ilustración estática a la izquierda.
                    Asset de unDraw (licencia abierta, uso comercial sin atribución),
                    recoloreado al violeta de marca. Va con <img> y no next/image
                    porque es un SVG: optimizarlo no aporta y evita tener que
                    habilitar dangerouslyAllowSVG en la config. */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className="relative shrink-0"
                >
                    {/* Glow detrás para asentar la ilustración sobre el fondo oscuro */}
                    <div aria-hidden className="absolute inset-0 -m-10 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.18),transparent_70%)] blur-2xl" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/dolor-operacion.svg"
                        alt=""
                        aria-hidden
                        className="relative w-[440px] xl:w-[500px] h-auto"
                    />
                </motion.div>

                {/* Slide destacado a la derecha — cambia con AnimatePresence */}
                <div className="relative min-h-[280px] flex items-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, x: -40, rotate: -4 }}
                            animate={{ opacity: 1, x: 0, rotate: 0 }}
                            exit={{ opacity: 0, x: 40, rotate: 4 }}
                            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-full max-w-lg p-8 rounded-2xl border border-violet-500/25 bg-gradient-to-br from-[#16162a] to-[#0a0a14] shadow-[0_20px_60px_-15px_rgba(139,92,246,0.35)]"
                        >
                            {/* Esquina doblada como si fuera un papel real */}
                            <div aria-hidden className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-br from-violet-500/20 to-transparent [clip-path:polygon(100%_0,0_0,100%_100%)] rounded-tr-2xl" />

                            <div className="flex items-center gap-3 mb-5">
                                <span className="flex items-center justify-center w-9 h-9 rounded-full border border-violet-500/40 bg-violet-500/15 text-violet-300 font-bold text-sm font-mono">
                                    {String(current + 1).padStart(2, '0')}
                                </span>
                                <span className="text-[11px] uppercase tracking-widest text-violet-400/70 font-medium">
                                    Problema {current + 1} de {pains.length}
                                </span>
                            </div>

                            <p className="text-neutral-100 text-base xl:text-lg leading-relaxed">
                                {pains[current]}
                            </p>

                            {/* Barra de progreso: div plano manejado por el mismo
                                reloj que avanza el slide, no una animación aparte. */}
                            <div className="mt-6 h-1 rounded-full bg-white/[0.05] overflow-hidden">
                                <div
                                    style={{ transform: `scaleX(${progress})`, transformOrigin: 'left' }}
                                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                                />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Controles: flechas + dots debajo, centrados */}
            <div className="mt-8 flex items-center justify-center gap-6">
                <button
                    onClick={goPrev}
                    aria-label="Problema anterior"
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] text-neutral-300 hover:bg-violet-500/15 hover:border-violet-500/40 hover:text-white transition-all active:scale-95"
                >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                </button>

                <div className="flex items-center gap-2">
                    {pains.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            aria-label={`Ir al problema ${i + 1}`}
                            className={`transition-all rounded-full ${
                                i === current
                                    ? 'w-8 h-2 bg-gradient-to-r from-violet-500 to-blue-500'
                                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                            }`}
                        />
                    ))}
                </div>

                <button
                    onClick={goNext}
                    aria-label="Problema siguiente"
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] text-neutral-300 hover:bg-violet-500/15 hover:border-violet-500/40 hover:text-white transition-all active:scale-95"
                >
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
