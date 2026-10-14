'use client'

import { useState, useEffect, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Quote } from 'lucide-react'
import {
    AmbientOrbs,
    RouteDivider,
} from './LogisticaAnimations'
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
    MonthlyOperationsDemo,
} from '@/components/ui/micro-demos'

const WHATSAPP_HREF =
    'https://wa.me/5491160152435?text=' +
    encodeURIComponent('Hola Gabriel, quiero coordinar el diagnóstico gratuito de 30 minutos para logística.')

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
        desc: 'La noche anterior, cada destinatario de canal propio (con opt-in previo) recibe un mensaje: ¿vas a estar mañana? El que no puede, se saca de la carga antes de cargar el camión. Es el primer filtro del circuito: casi todas las entregas fallidas se evitan antes de que el camión salga. (En envíos Flex de ML opera bajo protocolos autorizados de la plataforma).',
        img: '/3d/icono-campana.png', iw: 473, ih: 512, anim: 'ring' as const,
        descShort: 'La noche anterior, cada destinatario confirma si va a estar (canal propio con opt-in). El que no puede, se saca antes de salir.',
        Demo: PriorNoticeDemo,
    },
    {
        step: 2,
        context: 'Antes de cargar el camión',
        quote: 'Es un barrio cerrado con guardia 24 horas y ponen que no había nadie.',
        name: 'Ficha del domicilio',
        desc: 'Después de la primera entrega a una dirección, el sistema guarda cómo se accede: portería, timbre, entre calles, si acepta dejar con vecino. La próxima vez, el dato viaja con la hoja de ruta sin que nadie lo busque.',
        img: '/3d/icono-casa.png', iw: 512, ih: 363,
        descShort: 'Después de la primera entrega, el sistema guarda cómo se accede: portería, timbre, entre calles. La próxima vez, viaja con la hoja de ruta.',
        Demo: HomeAccessDemo,
    },
    {
        step: 3,
        context: 'Durante la entrega',
        quote: 'Estuve de 9 a 18 esperando y nunca vinieron. Perdí el día entero.',
        name: 'Aviso por posición',
        desc: 'El chofer comparte su ubicación en vivo desde el bot de Telegram: sin app propia que instalar, sin hardware que comprar. En entregas de canal propio con opt-in, el destinatario recibe cuántas paradas faltan: la última chance de que reaccione antes del timbre. Sin horarios inventados.',
        img: '/3d/icono-pin-oro.png', iw: 425, ih: 512,
        descShort: 'El chofer comparte ubicación por Telegram y el destinatario recibe cuántas paradas faltan (canal propio con opt-in). Sin horarios inventados.',
        Demo: PositionAlertDemo,
    },
    {
        step: 4,
        context: 'Si algo falla',
        quote: 'Hoy era el último día de plazo. Nadie me avisó y lo devolvieron al remitente.',
        name: 'Reloj de vencimiento',
        desc: 'Cuenta los días que un paquete lleva sin entregarse. Avisa al destinatario a los 5, 2 y 1 día antes de que se devuelva (en pedidos de canal propio). Y le envía al dueño la lista de paquetes en riesgo cada mañana.',
        img: '/3d/icono-reloj-vto.png', iw: 457, ih: 512,
        descShort: 'Cuenta los días sin entrega y avisa al destinatario antes de la devolución. Al dueño le manda la lista de riesgo cada mañana.',
        Demo: ExpirationClockDemo,
    },
    {
        step: 5,
        context: 'Después de la entrega',
        quote: 'Una empresa espectacular pero nadie te pide que dejes reseña. Los únicos que escriben son los enojados.',
        name: 'Escudo de reputación',
        desc: 'Después de cada entrega exitosa, el destinatario recibe una invitación transparente para calificar en Google. En paralelo, se ofrece un canal directo y prioritario por WhatsApp para resolver cualquier reclamo en el acto. Cumple 100% con las políticas de Google (sin filtrado desleal) y da solución inmediata.',
        img: '/3d/icono-escudo.png', iw: 439, ih: 512,
        descShort: 'Invita a calificar en Google y ofrece en paralelo un canal directo por WhatsApp para resolver reclamos en el acto.',
        Demo: ReputationShieldDemo,
    },
    {
        step: 6,
        context: 'Control de operación',
        quote: 'Dijeron que pasaron y que no había nadie. Es mentira, estuve en casa todo el día.',
        name: 'Registro de anomalías',
        desc: 'Acá cierra el circuito. Si el destinatario había confirmado en Coordinación previa y aun así no estaba, eso es una anomalía, no la norma: el evento se guarda con fecha, hora y ubicación, y se cruza con esa confirmación para que el reporte tenga evidencia de dos fuentes, no una sospecha. A fin de mes tenés qué pasó de verdad en tu operación —sin acusar a nadie en el momento— y la prueba lista para el Parte del dador y el Escudo de reputación.',
        img: '/3d/icono-lupa.png', iw: 512, ih: 498,
        descShort: 'Si confirmó que iba a estar y aun así no estaba, es una anomalía: queda registrada con hora y ubicación, cruzada con su confirmación de Coordinación previa. La prueba de qué pasó de verdad.',
        Demo: AnomalyLogDemo,
    },
    {
        step: 7,
        context: 'Retención de dadores clave',
        quote: 'Un vendedor grande nos bajó los paquetes a cero de un día para el otro porque ML le pasó publicaciones a Full y ni nos enteramos.',
        name: 'Radar de Dadores (Alertas Flex)',
        desc: 'Monitorea el volumen diario de paquetes entregados por cada tienda o dador. Si una cuenta cae más del 50% de volumen respecto de su promedio habitual, el sistema dispara una alerta proactiva por Telegram a la dirección para comunicarse con el cliente antes de perder la cuenta definitivamente.',
        img: '/3d/icono-comparativa.png', iw: 512, ih: 512,
        descShort: 'Monitorea el volumen diario por vendedor. Alerta si un dador cae >50% para retenerlo antes de que se pase a Full.',
    },
    {
        step: 8,
        context: 'Cumplimiento normativo y métricas ML',
        quote: 'Se me pinchó una goma a las 18:00, le pedí al comprador pasar mañana y Mercado Libre nos penalizó a todos por reprogramar.',
        name: 'Protocolo de Incidente en Ruta (Política de Envíos Flex de Mercado Libre)',
        desc: 'Ante las políticas de Envíos Flex de Mercado Libre (Octubre), reprogramar entregas impacta las métricas del vendedor y la logística. Cuando un chofer sufre una avería, choque o siniestro imprevisto, el bot de Telegram captura fotos y GPS en tiempo real para armar el respaldo probatorio necesario para solicitar la exención ante ML, sin comprometer al comprador.',
        img: '/3d/icono-escudo-lock.png', iw: 433, ih: 512,
        descShort: 'Ante averías mecánicas o siniestros, documenta fotos y GPS por Telegram para respaldar la solicitud de exención de métricas en ML.',
    },
]

const reveal = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
}

// Flujo de un pedido en 3 pasos (íconos clay: caja → sobre → pulgar).
const flowSteps = [
    {
        n: '01',
        src: '/3d/icono-caja.png',
        w: 512,
        h: 457,
        title: 'Entra el pedido',
        desc: 'Ingresa desde tu ERP, Tiendanube o MercadoLibre. Sin carga manual ni tipeo.',
    },
    {
        n: '02',
        src: '/3d/icono-sobre.png',
        w: 467,
        h: 512,
        title: 'Avisás al cliente',
        desc: 'Aviso automático por WhatsApp con el estado real de la entrega, antes de que pregunte.',
    },
    {
        n: '03',
        src: '/3d/icono-pulgar.png',
        w: 429,
        h: 512,
        title: 'Entrega conforme',
        desc: 'Se cierra con evidencia del chofer y confirmación del destinatario. Prueba de que se hizo bien.',
    },
]

export function LogisticaLanding() {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <main className="min-h-screen bg-[#0B0D0E] text-white antialiased">
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
                        <Link href="/" className="flex items-center py-1" aria-label="Volver al inicio">
                            <Image src="/logo-individra-rebrand.png" alt="INDIVIDRA - Inteligencia Operativa" width={640} height={125} quality={95} sizes="(max-width: 640px) 256px, 384px" className="h-9 sm:h-11 lg:h-12 w-auto object-contain" priority />
                        </Link>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-5">
                        <Link
                            href="/diagnostico?origen=logistica"
                            className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#E8E5DE] hover:text-white transition-colors"
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-[#C84214]" />
                            Autodiagnóstico (2 min)
                        </Link>
                        <a
                            href={WHATSAPP_HREF}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 lg:px-5 lg:py-2.5 bg-[#C84214] text-white text-xs sm:text-sm font-bold rounded-full hover:bg-[#B3390F] hover:shadow-lg hover:shadow-[#C84214]/25 hover:scale-105 active:scale-95 transition-all duration-200 whitespace-nowrap"
                        >
                            Diagnóstico gratuito
                        </a>
                    </div>
                </div>
            </motion.header>

            {/* ===== 1) HERO SECTION ===== */}
            <section className="relative overflow-hidden">
                {/* Dark Vignette & Brand Gradients */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D0E] via-[#0B0D0E]/95 to-[#0B0D0E] pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C84214]/15 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(200,66,20,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(200,66,20,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />

                <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-24 sm:pt-36 sm:pb-32">
                    <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-8 items-center">
                        <div>
                            <motion.p {...reveal} className="text-[#C84214] text-sm font-medium uppercase tracking-widest">
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
                                Montamos un asistente por WhatsApp y web que responde el estado de cada entrega con datos
                                reales, coordina las visitas antes de que salga el camión y avisa solo cuando algo se demora.{' '}
                                <span className="text-neutral-200">Sin cambiar tu sistema actual.</span>
                            </motion.p>

                            <motion.div {...reveal} transition={{ delay: 0.15 }} className="mt-9">
                                <div className="flex flex-wrap items-center gap-3">
                                    <a
                                        href={WHATSAPP_HREF}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C84214] text-white font-semibold shadow-lg shadow-[#C84214]/20 hover:bg-[#B3390F] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                                    >
                                        Pedí un diagnóstico gratuito de 30 minutos
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                                    </a>
                                    <Link
                                        href="/diagnostico?origen=logistica"
                                        className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-[#3E3D3A] bg-[#151719] text-neutral-200 text-sm sm:text-base font-medium hover:border-[#C84214] hover:text-white transition-all duration-200"
                                    >
                                        Calcular costo de entregas fallidas (2 min)
                                    </Link>
                                </div>
                                <p className="mt-3 text-neutral-500 text-sm">
                                    Sin permanencia. Mes a mes. Infraestructura propia y aislada bajo Ley 25.326 de Protección de Datos Personales. Planes para logísticas desde $160.000/mes + IVA según volumen.
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

            {/* ===== 1.5) FLUJO EN 3 PASOS (caja → sobre → pulgar) ===== */}
            <section className="relative border-b border-white/5 bg-[#0B0D0E]">
                <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
                    <motion.div {...reveal} className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
                        <span className="text-[#C84214] text-xs sm:text-sm font-mono font-medium uppercase tracking-[0.2em]">
                            En la práctica
                        </span>
                        <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                            Así de simple se ve en tu operación
                        </h2>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row lg:items-stretch gap-3">
                        {flowSteps.map((s, i) => (
                            <Fragment key={s.n}>
                                <motion.div
                                    {...reveal}
                                    transition={{ delay: i * 0.08 }}
                                    className="flex-1 flex flex-col items-center text-center rounded-2xl border border-[#3E3D3A] bg-[#161514] px-6 py-8 transition-colors duration-300 hover:border-[#C84214]/40"
                                >
                                    <Image
                                        src={s.src}
                                        alt=""
                                        aria-hidden
                                        width={s.w}
                                        height={s.h}
                                        quality={95}
                                        sizes="256px"
                                        className="h-16 w-auto object-contain drop-shadow-[0_14px_30px_rgba(200,66,20,0.28)] sm:h-[72px]"
                                    />
                                    <span className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-widest text-[#C84214]">
                                        Paso {s.n}
                                    </span>
                                    <h3 className="mt-1.5 text-lg font-bold text-white">{s.title}</h3>
                                    <p className="mt-2 text-sm text-neutral-400 leading-relaxed">{s.desc}</p>
                                </motion.div>
                                {i < flowSteps.length - 1 && (
                                    <div className="flex items-center justify-center lg:px-1" aria-hidden>
                                        <ArrowRight className="h-5 w-5 shrink-0 rotate-90 text-[#C84214]/60 lg:rotate-0" />
                                    </div>
                                )}
                            </Fragment>
                        ))}
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
                    {/* Solo mobile: operario tapado de cajas (reemplaza al camión que estaba acá).
                        En desktop la ilustración de la van va al costado, en el carrusel. */}
                    <motion.div {...reveal} className="lg:hidden mb-6 flex justify-center">
                        <Image
                            src="/3d/operario-cajas.png"
                            alt=""
                            aria-hidden
                            width={529}
                            height={560}
                            quality={95}
                            sizes="384px"
                            className="w-48 sm:w-56 h-auto object-contain drop-shadow-[0_18px_40px_rgba(200,66,20,0.28)]"
                        />
                    </motion.div>
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
                        className="mt-8 lg:mt-12 border-l-2 border-[#C84214] pl-5 text-lg sm:text-xl text-white font-medium leading-relaxed max-w-3xl mx-auto"
                    >
                        {PAIN_CLOSE}
                    </motion.p>
                </div>
            </section>

            {/* ===== 3) QUEJAS -> MÓDULOS ===== */}
            <section className="relative">
                <RouteDivider className="absolute top-0 left-0 w-full h-8" />
                <div className="max-w-6xl mx-auto px-6 py-20 sm:py-28">
                    {/* Estrella 3D sin fondo: refuerza que son reseñas puntuadas de Google */}
                    <motion.div {...reveal} className="mb-4">
                        <Image
                            src="/3d/icono-notif.png"
                            alt=""
                            aria-hidden
                            width={512}
                            height={376}
                            quality={95}
                            sizes="256px"
                            className="h-14 w-auto object-contain drop-shadow-[0_12px_26px_rgba(200,66,20,0.3)] sm:h-16"
                        />
                    </motion.div>
                    <motion.h2 {...reveal} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white max-w-4xl tracking-tight">
                        Esto dicen clientes, choferes y dueños del rubro logístico.
                    </motion.h2>
                    <motion.p {...reveal} transition={{ delay: 0.05 }} className="mt-5 text-neutral-300 text-base sm:text-lg max-w-3xl leading-relaxed">
                        Son testimonios y situaciones reales de operaciones de distribución y paquetería. Cada una es una tarea que hoy depende de que una
                        persona se acuerde, llame o tipee. Cada una se automatiza.
                    </motion.p>

                    <div className="mt-12 grid md:grid-cols-2 gap-5 lg:gap-6">
                        {modules.map((m, i) => {
                            const Demo = m.Demo
                            const ring = (m as { anim?: string }).anim === 'ring'
                            return (
                            <motion.div
                                key={i}
                                {...reveal}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -4 }}
                                className="group relative flex flex-col p-6 lg:p-7 rounded-2xl border border-white/[0.10] card-obsidian sheen-top bg-gradient-to-br from-[#14161A] via-[#101215] to-[#0A0C0E] overflow-hidden transition-all duration-300 hover:border-[#FF5520]/60 hover:shadow-[0_12px_40px_-10px_rgba(255,85,32,0.25)]"
                            >
                                {/* hover glow — solo desktop */}
                                <div aria-hidden className="hidden lg:block pointer-events-none absolute -right-8 -top-8 w-44 h-44 rounded-full blur-[60px] bg-[#FF5520]/0 group-hover:bg-[#FF5520]/15 transition-colors duration-500" />

                                {/* Quote in authentic dispatch tag */}
                                <div className="relative border-l-2 border-[#FF5520] bg-black/60 border border-white/[0.08] backdrop-blur-md p-3.5 rounded-xl">
                                    <Quote className="w-4 h-4 text-[#FFA380] mb-1 opacity-80" aria-hidden />
                                    <p className="text-neutral-200 text-xs sm:text-sm italic leading-relaxed">{m.quote}</p>
                                </div>

                                {/* Module */}
                                <div className="mt-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md border border-[#FF5520]/40 bg-[#FF5520]/15 text-[11px] font-mono font-bold text-[#FFA380]">{m.step}</span>
                                            <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF5520] font-bold">{m.context}</span>
                                            <span className="h-px flex-1 bg-white/10" />
                                        </div>
                                        <div className="mt-3 flex items-center gap-3.5">
                                            {ring ? (
                                                <motion.div
                                                    className="shrink-0 w-14 h-14 rounded-xl bg-white/[0.04] border border-white/10 p-1.5 flex items-center justify-center shadow-inner"
                                                    style={{ transformOrigin: 'top center' }}
                                                    initial={{ rotate: 0 }}
                                                    whileInView={{ rotate: [0, -16, 13, -9, 6, -3, 0] }}
                                                    viewport={{ once: true, margin: '-60px' }}
                                                    transition={{ duration: 1.1, delay: 0.15, ease: 'easeInOut' }}
                                                >
                                                    <Image
                                                        src={m.img}
                                                        alt=""
                                                        aria-hidden
                                                        width={m.iw}
                                                        height={m.ih}
                                                        quality={95}
                                                        sizes="256px"
                                                        className="h-full w-auto object-contain drop-shadow-[0_8px_18px_rgba(255,85,32,0.3)] transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                </motion.div>
                                            ) : (
                                                <div className="shrink-0 w-14 h-14 rounded-xl bg-white/[0.04] border border-white/10 p-1.5 flex items-center justify-center shadow-inner">
                                                    <Image
                                                        src={m.img}
                                                        alt=""
                                                        aria-hidden
                                                        width={m.iw}
                                                        height={m.ih}
                                                        quality={95}
                                                        sizes="256px"
                                                        className="h-full w-auto object-contain drop-shadow-[0_8px_18px_rgba(255,85,32,0.3)] transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                </div>
                                            )}
                                            <h3 className="text-lg sm:text-xl font-bold font-heading text-white tracking-tight">{m.name}</h3>
                                        </div>
                                        <p className="mt-3 text-neutral-300 text-xs sm:text-sm leading-relaxed lg:hidden">{m.descShort}</p>
                                        <p className="mt-3 text-neutral-300 text-xs sm:text-sm leading-relaxed hidden lg:block">{m.desc}</p>
                                    </div>

                                    {/* Micro-demo del módulo */}
                                    {Demo && (
                                        <div className="mt-5 pt-4 border-t border-white/[0.08]">
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
                        className="mt-8 rounded-3xl border border-white/[0.12] card-obsidian sheen-top bg-gradient-to-br from-[#16181C] via-[#121417] to-[#0A0C0E] p-6 sm:p-8 relative overflow-hidden shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF5520]/15 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-7 space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF5520]/30 bg-[#FF5520]/10 text-xs font-mono font-bold text-[#FFA380] uppercase tracking-wider">
                                    Módulo de Flota & Operación Interna
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <Image
                                        src="/3d/icono-credencial.png"
                                        alt=""
                                        aria-hidden
                                        width={344}
                                        height={512}
                                        quality={95}
                                        sizes="256px"
                                        className="h-11 w-auto shrink-0 object-contain drop-shadow-[0_10px_22px_rgba(255,85,32,0.3)] sm:h-12"
                                    />
                                    <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
                                        Admisión Inteligente de Choferes
                                    </h3>
                                </div>

                                <div className="border-l-2 border-[#FF5520] bg-black/60 border border-white/[0.08] backdrop-blur-md p-3.5 rounded-xl text-xs sm:text-sm text-neutral-200 italic">
                                    &ldquo;Perdemos días pidiendo fotos de cédulas, seguros y VTVs por WhatsApp mientras los camiones quedan parados o salen con papeles vencidos.&rdquo;
                                </div>

                                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
                                    Screening documental en <strong>2 capas</strong>: la validación es instantánea, para que tráfico solo tenga que llamar a los que ya calificaron. Cada decisión queda con motivo documentado. Al que no califica se le avisa con el motivo específico y una vía para reclamar.
                                </p>

                                <div className="grid sm:grid-cols-2 gap-3 pt-1">
                                    <div className="p-4 rounded-2xl border border-white/[0.10] bg-black/50">
                                        <div className="text-xs font-bold font-mono text-emerald-400 mb-1 flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                            Capa 1: Validación Inmediata
                                        </div>
                                        <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                                            El chofer carga 4 documentos (Licencia, Cédula, VTV, Seguro) vía web. El OCR extrae vencimientos en segundos y valida al instante.
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-2xl border border-white/[0.10] bg-black/50">
                                        <div className="text-xs font-bold font-mono text-[#FFA380] mb-1 flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-[#FF5520]" />
                                            Capa 2: Digest para Tráfico
                                        </div>
                                        <p className="text-xs text-neutral-400 leading-relaxed font-sans">
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

                    {/* Módulo en construcción: Parte del dador (relación logística ↔ vendedor Flex) */}
                    <motion.div
                        {...reveal}
                        className="mt-6 rounded-3xl border border-white/[0.12] card-obsidian sheen-top bg-gradient-to-br from-[#16181C] via-[#121417] to-[#0A0C0E] p-6 sm:p-8 relative overflow-hidden shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-white/[0.08] to-transparent rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 grid lg:grid-cols-12 gap-6 items-start">
                            <div className="lg:col-span-8 space-y-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/[0.05] text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider">
                                        Módulo para logísticas de e-commerce
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Image
                                        src="/3d/icono-remito.png"
                                        alt=""
                                        aria-hidden
                                        width={512}
                                        height={494}
                                        quality={95}
                                        sizes="256px"
                                        className="h-11 w-auto shrink-0 object-contain drop-shadow-[0_10px_22px_rgba(255,255,255,0.2)] sm:h-12"
                                    />
                                    <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
                                        Parte del dador
                                    </h3>
                                </div>

                                <div className="border-l-2 border-[#FF5520] bg-black/60 border border-white/[0.08] backdrop-blur-md p-3.5 rounded-xl text-xs sm:text-sm text-neutral-200 italic">
                                    &ldquo;Uno vende bien, la logística entrega mal, y el cliente le pega mala reseña al vendedor. Perdés cuentas por lo que hizo o dejó de hacer otro.&rdquo;
                                </div>

                                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                                    Cuando repartís para vendedores de e-commerce o distribución directa, cada visita cuenta con doble evidencia: registro georreferenciado del chofer + confirmación del destinatario (con avisos proactivos por WhatsApp en pedidos de canal propio con opt-in). Al dador de carga le enviás un parte periódico transparente: un registro neutral que respalda tanto a la logística como al vendedor frente a reclamos o extravíos, brindando evidencia transparente para ambas partes.
                                </p>
                                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed pt-1">
                                    Distinto de <strong className="text-neutral-300">Escudo de reputación</strong>, que mide la satisfacción del destinatario final. Este es un registro neutral que respalda a ambas partes: a la logística y al vendedor que contrató el flete.
                                </p>
                            </div>

                            <div className="lg:col-span-4 flex items-center justify-center">
                                <div className="w-full max-w-xs p-5 rounded-xl border border-[#3E3D3A] bg-[#222120]">
                                    <div className="text-[10px] uppercase tracking-widest text-[#B7B3B0] font-semibold mb-3">Parte semanal — Vendedor Flex #274</div>
                                    <div className="space-y-2.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-neutral-400">Entregas confirmadas</span>
                                            <span className="text-emerald-400 font-mono font-semibold">142 / 148</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-neutral-400">Con evidencia doble</span>
                                            <span className="text-[#E8E5DE] font-mono font-semibold">140</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-neutral-400">Visitas fallidas justificadas</span>
                                            <span className="text-[#B7B3B0] font-mono font-semibold">4</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-neutral-400">Reclamos sin sustento</span>
                                            <span className="text-rose-300 font-mono font-semibold">2</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-white/[0.06] text-[10px] text-neutral-500 italic">
                                        Datos ilustrativos, no de un cliente real.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Panel de operación: es lo que empaqueta y hace visible todo lo que producen los módulos */}
                    <motion.div
                        {...reveal}
                        className="mt-6 rounded-2xl border border-[#3E3D3A] bg-gradient-to-br from-[#262523] via-[#1E1D1C] to-[#161514] p-6 sm:p-8 relative overflow-hidden shadow-2xl group"
                    >
                        <div className="absolute top-0 left-0 w-80 h-80 bg-[#C84214]/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 space-y-6">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C84214]/30 bg-[#C84214]/10 text-xs font-semibold text-[#B7B3B0] uppercase tracking-wider">
                                    El panel donde vive todo lo que producen tus módulos
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-12 gap-6 items-center">
                                <div className="lg:col-span-7 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src="/3d/icono-monitor.png"
                                            alt=""
                                            aria-hidden
                                            width={512}
                                            height={507}
                                            quality={95}
                                            sizes="256px"
                                            className="h-12 w-auto shrink-0 object-contain drop-shadow-[0_10px_22px_rgba(200,66,20,0.3)] transition-transform duration-300 group-hover:scale-105 sm:h-14"
                                        />
                                        <h3 className="text-xl sm:text-2xl font-bold text-white">
                                            Parte mensual de operación
                                        </h3>
                                    </div>

                                    <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                                        Cada módulo que activás deja registro de lo que hizo: reprogramaciones evitadas, paquetes salvados de la devolución, visitas con evidencia, reclamos interceptados. El panel junta todo eso en un solo lugar y te deja preguntarle en lenguaje natural qué pasó en tu operación. La IA marca los patrones que a simple vista se escapan; vos decidís.
                                    </p>
                                </div>

                                <div className="lg:col-span-5 flex flex-col justify-center gap-2">
                                    <MonthlyOperationsDemo />
                                    <p className="text-[10px] text-neutral-500 italic text-center">
                                        Datos ilustrativos, no de un cliente real.
                                    </p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-3 pt-2">
                                <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-[#B7B3B0]/40 hover:bg-[#B7B3B0]/[0.03] transition-all duration-300 hover:-translate-y-0.5 group/item">
                                    <div className="text-xs font-bold text-[#B7B3B0] mb-1.5 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#B7B3B0] group-hover/item:scale-125 transition-transform" />
                                        Visualizás
                                    </div>
                                    <p className="text-xs text-neutral-400 leading-relaxed">
                                        Reprogramaciones evitadas, paquetes salvados de devolución, visitas fallidas con evidencia, reseñas capturadas, reclamos interceptados. Todo agregado, no disperso en planillas.
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-[#C84214]/40 hover:bg-[#C84214]/[0.03] transition-all duration-300 hover:-translate-y-0.5 group/item">
                                    <div className="text-xs font-bold text-[#B7B3B0] mb-1.5 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#C84214] group-hover/item:scale-125 transition-transform" />
                                        Deducís patrones
                                    </div>
                                    <p className="text-xs text-neutral-400 leading-relaxed">
                                        Qué zonas concentran las fallas, qué franjas horarias generan más reclamos, qué destinatarios recurrentes siempre reprograman. La IA marca lo relevante, vos decidís.
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-emerald-400/40 hover:bg-emerald-500/[0.03] transition-all duration-300 hover:-translate-y-0.5 group/item">
                                    <div className="text-xs font-bold text-emerald-300 mb-1.5 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover/item:scale-125 transition-transform" />
                                        Proyectás
                                    </div>
                                    <p className="text-xs text-neutral-400 leading-relaxed">
                                        Alertas tempranas de tendencias — un pico de reclamos en una zona, un vencimiento en cascada, un cliente que empieza a irse. Actuás antes, no después de la pérdida.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Cierre de conversión */}
                    <motion.div
                        {...reveal}
                        className="mt-10 flex flex-col items-start gap-3 p-6 sm:p-8 rounded-2xl border border-[#3E3D3A] bg-gradient-to-br from-[#262523] via-[#1E1D1C] to-[#161514]"
                    >
                        <a
                            href={WHATSAPP_HREF}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C84214] text-white font-semibold shadow-lg shadow-[#C84214]/20 hover:bg-[#B3390F] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                        >
                            Pedí un diagnóstico gratuito de 30 minutos
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                        </a>
                        <p className="text-neutral-500 text-sm">
                            Sin permanencia. Mes a mes. Infraestructura propia y aislada bajo Ley 25.326 de Protección de Datos Personales. Planes para logísticas desde $160.000/mes + IVA según volumen de guías.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ===== Footer mínimo ===== */}
            <footer className="border-t border-white/10 bg-[#0B0D0E]">
                {/* Cierre visual: caja premiada — cada entrega, con estándar de calidad */}
                <motion.div {...reveal} className="max-w-6xl mx-auto px-6 pt-12 pb-2 flex flex-col items-center text-center">
                    <Image
                        src="/3d/icono-caja-premio.png"
                        alt=""
                        aria-hidden
                        width={512}
                        height={479}
                        quality={95}
                        unoptimized
                        className="h-24 w-auto object-contain sm:h-28"
                    />
                    <p className="mt-4 max-w-md text-sm sm:text-base text-neutral-400 leading-relaxed">
                        Cada entrega, con estándar de calidad. Eso es lo que
                        <span className="text-neutral-200"> defiende tu reputación</span>.
                    </p>
                </motion.div>
                <div className="max-w-6xl mx-auto px-6 pt-8 pb-8 border-t border-white/5 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
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
                {/* Ilustración de la operación de reparto (render 3D premium). */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className="relative shrink-0"
                >
                    {/* Glow detrás para asentar la ilustración sobre el fondo oscuro */}
                    <div aria-hidden className="absolute inset-0 -m-10 bg-[radial-gradient(circle_at_50%_50%,rgba(200,66,20,0.15),transparent_70%)] blur-2xl" />
                    <Image
                        src="/3d/ilustracion-reparto.png"
                        alt=""
                        aria-hidden
                        width={900}
                        height={522}
                        quality={95}
                        sizes="(max-width: 1280px) 640px, 900px"
                        className="relative w-[440px] xl:w-[500px] h-auto object-contain drop-shadow-[0_24px_50px_rgba(200,66,20,0.28)]"
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
                            className="relative w-full max-w-lg p-8 rounded-2xl border border-[#3E3D3A] bg-[#222120] shadow-xl"
                        >
                            {/* Esquina doblada como si fuera un papel real */}
                            <div aria-hidden className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-br from-[#C84214]/20 to-transparent [clip-path:polygon(100%_0,0_0,100%_100%)] rounded-tr-2xl" />

                            <div className="flex items-center gap-3 mb-5">
                                <span className="flex items-center justify-center w-9 h-9 rounded-full border border-[#C84214]/40 bg-[#C84214]/15 text-[#B7B3B0] font-bold text-sm font-mono">
                                    {String(current + 1).padStart(2, '0')}
                                </span>
                                <span className="text-[11px] uppercase tracking-widest text-[#C84214] font-medium">
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
                                    className="h-full rounded-full bg-gradient-to-r from-[#C84214] to-[#B7B3B0]"
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
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] text-neutral-300 hover:bg-[#C84214]/15 hover:border-[#C84214]/40 hover:text-white transition-all active:scale-95"
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
                                    ? 'w-8 h-2 bg-gradient-to-r from-[#C84214] to-[#B7B3B0]'
                                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                            }`}
                        />
                    ))}
                </div>

                <button
                    onClick={goNext}
                    aria-label="Problema siguiente"
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] text-neutral-300 hover:bg-[#C84214]/15 hover:border-[#C84214]/40 hover:text-white transition-all active:scale-95"
                >
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
