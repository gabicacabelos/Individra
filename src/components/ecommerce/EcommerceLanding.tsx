'use client'

import { useState, useEffect, Fragment } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Quote } from 'lucide-react'
import { AmbientOrbs, RouteDivider } from '@/components/logistica/LogisticaAnimations'
import { PhoneChatHero } from '@/components/logistica/PhoneChatHero'
import { PainCarousel } from '@/components/logistica/PainCarousel'
import {
    PositionAlertDemo,
    ExpirationClockDemo,
    ReputationShieldDemo,
    MonthlyOperationsDemo,
} from '@/components/ui/micro-demos'

const WHATSAPP_HREF =
    'https://wa.me/5491160152435?text=' +
    encodeURIComponent('Hola Individra, quiero coordinar el diagnostico gratuito de 30 minutos para mi tienda online.')

const H1_TEXT = 'Perdés ventas contestando "¿tenés stock?" y "¿dónde está mi pedido?" a mano.'

const pains = [
    'Las preguntas de tus publicaciones se acumulan sin responder. Cada minuto que tardás, el comprador ya le compró a otro.',
    'Después de la venta, el WhatsApp explota con la misma pregunta: "¿cuándo llega?". Cien veces por día, la misma respuesta.',
    'Una entrega que salió mal se convierte en una reseña de 1 estrella. Y tu reputación en Mercado Libre define cuánto vendés.',
    'Los paquetes se devuelven sin que nadie avise a tiempo. Perdés el producto, el flete de ida y la venta.',
    'Fuera de horario nadie contesta. La consulta espera al día siguiente o se va con la competencia.',
    'El seguimiento de cambios, garantías y devoluciones vive en tu cabeza y en chats sueltos.',
    'Contestás talles, medidas y compatibilidad una y otra vez, cuando la respuesta siempre es la misma.',
]

const PAIN_CLOSE =
    'Ninguna de estas respuestas necesita criterio. Todas consumen horas que deberías estar usando para vender más.'

const modules = [
    {
        step: 1,
        context: 'Antes de la compra',
        quote: '¿Tenés en talle L? ¿Hacen envío a Córdoba? ¿Es original?',
        name: 'Respuesta instantánea de preguntas',
        desc: 'El asistente responde las preguntas de tus publicaciones y de tu WhatsApp al instante, 24/7, con stock, talles, medidas, compatibilidad y tiempos de envío reales. Responder rápido no solo cierra la venta: mejora tu posición en el ranking de Mercado Libre. Lo que no sabe contestar, te lo deriva.',
        descShort: 'Responde preguntas de tus publicaciones y WhatsApp al instante, 24/7: stock, talles, envíos. Responder rápido cierra la venta y te sube en el ranking de ML.',
        img: '/3d/icono-sobre.png', iw: 467, ih: 512,
        Demo: null,
    },
    {
        step: 2,
        context: 'Después de la compra',
        quote: 'Compré hace 3 días y no sé nada. ¿Me llega o no?',
        name: 'Estado del pedido automático',
        desc: 'Cada comprador recibe el estado real de su envío sin tener que preguntar, y cuando pregunta, el bot le responde al instante con el dato de seguimiento. Menos ansiedad, menos reclamos abiertos y menos mensajes que contestar a mano.',
        descShort: 'El comprador recibe el estado real de su envío sin preguntar. Y cuando pregunta, el bot responde al instante con el seguimiento. Menos reclamos abiertos.',
        img: '/3d/icono-pin-oro.png', iw: 425, ih: 512,
        Demo: PositionAlertDemo,
    },
    {
        step: 3,
        context: 'Si algo se demora',
        quote: 'Hoy era el último día y lo devolvieron. Perdí el producto y el flete.',
        name: 'Alerta de devolución',
        desc: 'Cuenta los días que un paquete lleva sin entregarse y avisa al comprador antes de que se devuelva al remitente. Cada devolución evitada es un producto que no vuelve a tu depósito y un flete de ida que no pagás dos veces.',
        descShort: 'Avisa al comprador antes de que el paquete se devuelva al remitente. Cada devolución evitada es un producto y un flete que no perdés.',
        img: '/3d/icono-reloj-vto.png', iw: 457, ih: 512,
        Demo: ExpirationClockDemo,
    },
    {
        step: 4,
        context: 'Después de la entrega',
        quote: 'Los únicos que dejan reseña son los que se quejan. Los contentos no escriben.',
        name: 'Escudo de reputación',
        desc: 'Después de cada venta exitosa, el comprador recibe un mini-formulario de satisfacción. Si está contento, se le ofrece dejar una reseña positiva con un tap. Si tiene un reclamo, se captura en privado antes de que termine en una calificación negativa pública que te baje la reputación.',
        descShort: 'Si el comprador está contento, un tap lo lleva a dejar reseña. Si tiene un reclamo, se captura en privado antes de que sea una calificación negativa pública.',
        img: '/3d/icono-escudo.png', iw: 439, ih: 512,
        Demo: ReputationShieldDemo,
    },
]

const reveal = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
}

// Flujo de una venta en 3 pasos (íconos clay: sobre → caja → pulgar).
const flowSteps = [
    {
        n: '01',
        src: '/3d/icono-sobre.png',
        w: 467,
        h: 512,
        title: 'Pregunta el comprador',
        desc: 'El asistente responde stock, talles y envíos al instante, en tu publicación y en WhatsApp. Antes de que se vaya con otro.',
    },
    {
        n: '02',
        src: '/3d/icono-caja.png',
        w: 512,
        h: 457,
        title: 'Compra y sigue informado',
        desc: 'Avisos automáticos del estado real del envío. El comprador deja de preguntar "¿cuándo llega?".',
    },
    {
        n: '03',
        src: '/3d/icono-pulgar.png',
        w: 429,
        h: 512,
        title: 'Reseña y recompra',
        desc: 'Pedimos la reseña al cliente contento e interceptamos el reclamo del enojado antes de que sea público.',
    },
]

const integrations = ['Mercado Libre', 'Tiendanube', 'Shopify', 'WooCommerce', 'WhatsApp', 'Instagram']

const faqs = [
    {
        q: '¿Tengo que cambiar mi tienda o mi forma de vender?',
        a: 'No. El asistente se conecta encima de lo que ya usás —Mercado Libre, Tiendanube, Shopify, tu WhatsApp— sin migrar nada. Vos seguís vendiendo igual; nosotros automatizamos las respuestas y los avisos.',
    },
    {
        q: '¿Responde con datos reales o inventa?',
        a: 'Responde con el stock, los precios y el seguimiento reales de tu operación. Lo que no tiene con certeza, no lo inventa: te lo deriva para que lo contestes vos.',
    },
    {
        q: '¿Sirve si vendo solo por Mercado Libre?',
        a: 'Sí. Contesta las preguntas de tus publicaciones al instante (lo que te sube en el ranking), responde el "¿dónde está mi pedido?" post-venta y trabaja tu reputación pidiendo reseñas a los compradores conformes.',
    },
    {
        q: '¿Cómo empezamos?',
        a: 'Con un diagnóstico gratuito de 30 minutos. Miramos tu operación, identificamos qué se puede automatizar primero y te mostramos el asistente funcionando con tus propios casos. Sin permanencia, mes a mes.',
    },
]

export function EcommerceLanding() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [openFaq, setOpenFaq] = useState<number | null>(0)

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <main className="min-h-screen bg-[#0B0D0E] text-white antialiased">
            {/* ===== Top bar ===== */}
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
                            <Image src="/logo-individra-rebrand.png" alt="INDIVIDRA - Inteligencia Operativa" width={640} height={125} quality={95} sizes="(max-width: 640px) 200px, 260px" className="h-9 sm:h-11 lg:h-12 w-auto object-contain" priority />
                        </Link>
                    </div>
                    <a
                        href={WHATSAPP_HREF}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 lg:px-5 lg:py-2.5 bg-[#C84214] text-white text-xs sm:text-sm font-bold rounded-full hover:bg-[#B3390F] hover:shadow-lg hover:shadow-[#C84214]/25 hover:scale-105 active:scale-95 transition-all duration-200 whitespace-nowrap"
                    >
                        Diagnóstico gratuito
                    </a>
                </div>
            </motion.header>

            {/* ===== 1) HERO ===== */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D0E] via-[#0B0D0E]/95 to-[#0B0D0E] pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C84214]/15 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(200,66,20,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(200,66,20,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />

                <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-24 sm:pt-36 sm:pb-32">
                    <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-8 items-center">
                        <div>
                            <motion.p {...reveal} className="text-[#C84214] text-sm font-medium uppercase tracking-widest">
                                Tiendas online y marketplaces
                            </motion.p>

                            <motion.h1
                                {...reveal}
                                transition={{ delay: 0.05 }}
                                className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white text-balance"
                            >
                                {H1_TEXT}
                            </motion.h1>

                            <motion.p
                                {...reveal}
                                transition={{ delay: 0.1 }}
                                className="mt-6 text-neutral-400 text-lg leading-relaxed max-w-2xl text-pretty"
                            >
                                Montamos un asistente por WhatsApp y en tus publicaciones que responde las preguntas de compra
                                al instante, avisa el estado de cada pedido y cuida tu reputación.{' '}
                                <span className="text-neutral-200">Sin cambiar Mercado Libre, Tiendanube ni tu forma de vender.</span>
                            </motion.p>

                            <motion.div {...reveal} transition={{ delay: 0.15 }} className="mt-9">
                                <a
                                    href={WHATSAPP_HREF}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C84214] text-white font-semibold shadow-lg shadow-[#C84214]/20 hover:bg-[#B3390F] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                                >
                                    Pedí un diagnóstico gratuito de 30 minutos
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                                </a>
                                <p className="mt-3 text-neutral-500 text-sm">
                                    Sin permanencia. Mes a mes. Infraestructura propia y aislada (GDPR).
                                </p>
                            </motion.div>
                        </div>

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

            {/* ===== 1.4) INTEGRACIONES ===== */}
            <section className="relative border-y border-white/5 bg-[#0B0D0E]">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <p className="text-center text-xs uppercase tracking-[0.2em] text-neutral-500 mb-5">
                        Se conecta con lo que ya usás
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                        {integrations.map((name) => (
                            <span key={name} className="text-neutral-400 text-sm sm:text-base font-medium">
                                {name}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== 1.5) FLUJO EN 3 PASOS ===== */}
            <section className="relative border-b border-white/5 bg-[#0B0D0E]">
                <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
                    <motion.div {...reveal} className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
                        <span className="text-[#C84214] text-xs sm:text-sm font-mono font-medium uppercase tracking-[0.2em]">
                            En la práctica
                        </span>
                        <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-balance">
                            De la pregunta a la recompra, en piloto automático
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

            {/* ===== 2) DOLOR ===== */}
            <section className="relative border-b border-white/5 overflow-hidden">
                <AmbientOrbs className="absolute inset-0 pointer-events-none opacity-60" />
                <div className="relative max-w-6xl mx-auto px-6 py-20 sm:py-24">
                    <motion.h2 {...reveal} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center max-w-3xl mx-auto text-balance">
                        Si esto pasa en tu tienda, se puede automatizar.
                    </motion.h2>

                    <div className="mt-10">
                        <PainCarousel pains={pains} />
                    </div>

                    <motion.p
                        {...reveal}
                        className="mt-8 lg:mt-12 border-l-2 border-[#C84214] pl-5 text-lg sm:text-xl text-white font-medium leading-relaxed max-w-3xl mx-auto text-pretty"
                    >
                        {PAIN_CLOSE}
                    </motion.p>
                </div>
            </section>

            {/* ===== 3) MÓDULOS ===== */}
            <section className="relative">
                <RouteDivider className="absolute top-0 left-0 w-full h-8" />
                <div className="max-w-6xl mx-auto px-6 py-20 sm:py-28">
                    <motion.div {...reveal} className="mb-4">
                        <Image
                            src="/3d/icono-notif.png"
                            alt=""
                            aria-hidden
                            width={512}
                            height={376}
                            quality={95}
                            className="h-14 w-auto object-contain drop-shadow-[0_12px_26px_rgba(200,66,20,0.3)] sm:h-16"
                        />
                    </motion.div>
                    <motion.h2 {...reveal} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white max-w-3xl text-balance">
                        Cada mensaje que hoy contestás a mano, resuelto solo.
                    </motion.h2>
                    <motion.p {...reveal} transition={{ delay: 0.05 }} className="mt-5 text-neutral-400 text-base sm:text-lg max-w-3xl leading-relaxed text-pretty">
                        Cada módulo se activa por separado. Empezás por el que más te duele hoy y sumás el resto cuando quieras.
                    </motion.p>

                    <div className="mt-12 grid md:grid-cols-2 gap-5 lg:gap-6">
                        {modules.map((m, i) => {
                            const Demo = m.Demo
                            return (
                                <motion.div
                                    key={i}
                                    {...reveal}
                                    transition={{ delay: i * 0.08 }}
                                    whileHover={{ y: -4 }}
                                    className="group relative flex flex-col p-6 lg:p-7 rounded-2xl border border-[#3E3D3A] bg-[#222120] overflow-hidden transition-colors duration-300 hover:border-[#C84214]/50"
                                >
                                    <div aria-hidden className="hidden lg:block pointer-events-none absolute -right-8 -top-8 w-40 h-40 rounded-full blur-[60px] bg-[#C84214]/0 group-hover:bg-[#C84214]/10 transition-colors duration-500" />

                                    <div className="relative border-l-2 border-[#C84214] pl-4">
                                        <Quote className="absolute -left-1 -top-1 w-5 h-5 text-[#C84214]/40" aria-hidden />
                                        <p className="pl-4 text-neutral-400 italic leading-relaxed">{m.quote}</p>
                                    </div>

                                    <div className="mt-6">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-[#C84214]/40 bg-[#C84214]/15 text-[11px] font-bold text-[#B7B3B0]">{m.step}</span>
                                            <span className="text-[11px] uppercase tracking-widest text-[#C84214] font-medium">{m.context}</span>
                                            <span className="h-px flex-1 bg-white/10" />
                                        </div>
                                        <div className="mt-2 flex items-center gap-3">
                                            <Image
                                                src={m.img}
                                                alt=""
                                                aria-hidden
                                                width={m.iw}
                                                height={m.ih}
                                                quality={95}
                                                className="h-12 w-auto shrink-0 object-contain drop-shadow-[0_10px_22px_rgba(200,66,20,0.3)] transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <h3 className="text-lg font-bold text-white">{m.name}</h3>
                                        </div>
                                        <p className="mt-3 text-neutral-300 text-sm leading-relaxed lg:hidden">{m.descShort}</p>
                                        <p className="mt-3 text-neutral-300 text-sm leading-relaxed hidden lg:block">{m.desc}</p>

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

                    {/* Panel de operación */}
                    <motion.div
                        {...reveal}
                        className="mt-6 rounded-2xl border border-[#3E3D3A] bg-gradient-to-br from-[#262523] via-[#1E1D1C] to-[#161514] p-6 sm:p-8 relative overflow-hidden shadow-2xl group"
                    >
                        <div className="absolute top-0 left-0 w-80 h-80 bg-[#C84214]/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C84214]/30 bg-[#C84214]/10 text-xs font-semibold text-[#B7B3B0] uppercase tracking-wider">
                                El panel donde vive todo lo que producen tus módulos
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
                                            className="h-12 w-auto shrink-0 object-contain drop-shadow-[0_10px_22px_rgba(200,66,20,0.3)] transition-transform duration-300 group-hover:scale-105 sm:h-14"
                                        />
                                        <h3 className="text-xl sm:text-2xl font-bold text-white">
                                            Todo tu post-venta en un solo lugar
                                        </h3>
                                    </div>

                                    <p className="text-sm sm:text-base text-neutral-300 leading-relaxed text-pretty">
                                        Cada módulo deja registro de lo que hizo: preguntas respondidas, ventas cerradas fuera de horario,
                                        devoluciones evitadas, reclamos interceptados, reseñas conseguidas. El panel junta todo y te deja
                                        preguntarle en lenguaje natural qué pasó en tu tienda. La IA marca los patrones; vos decidís.
                                    </p>
                                </div>

                                <div className="lg:col-span-5 flex flex-col justify-center gap-2">
                                    <MonthlyOperationsDemo />
                                    <p className="text-[10px] text-neutral-500 italic text-center">
                                        Datos ilustrativos, no de un cliente real.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== 4) FAQ ===== */}
            <section className="relative border-t border-white/5 bg-[#0B0D0E]">
                <div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
                    <motion.h2 {...reveal} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center text-balance">
                        Preguntas frecuentes
                    </motion.h2>

                    <div className="mt-10 space-y-3">
                        {faqs.map((f, i) => {
                            const open = openFaq === i
                            return (
                                <motion.div
                                    key={i}
                                    {...reveal}
                                    transition={{ delay: i * 0.05 }}
                                    className="rounded-2xl border border-[#3E3D3A] bg-[#161514] overflow-hidden"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaq(open ? null : i)}
                                        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                                        aria-expanded={open}
                                    >
                                        <span className="font-semibold text-white">{f.q}</span>
                                        <ArrowRight className={`w-4 h-4 shrink-0 text-[#C84214] transition-transform duration-300 ${open ? 'rotate-90' : ''}`} aria-hidden />
                                    </button>
                                    {open && (
                                        <div className="px-5 pb-5 -mt-1 text-neutral-400 text-sm leading-relaxed">
                                            {f.a}
                                        </div>
                                    )}
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ===== 5) CTA FINAL ===== */}
            <section className="relative border-t border-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#C84214]/15 via-transparent to-transparent pointer-events-none" />
                <div className="relative max-w-3xl mx-auto px-6 py-20 sm:py-28 text-center">
                    <motion.h2 {...reveal} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-balance">
                        Dejá de contestar lo mismo cien veces por día.
                    </motion.h2>
                    <motion.p {...reveal} transition={{ delay: 0.05 }} className="mt-5 text-neutral-400 text-base sm:text-lg leading-relaxed text-pretty">
                        En 30 minutos miramos tu operación y te mostramos el asistente funcionando con tus propios casos. Gratis, sin compromiso.
                    </motion.p>
                    <motion.div {...reveal} transition={{ delay: 0.1 }} className="mt-9">
                        <a
                            href={WHATSAPP_HREF}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-[#C84214] text-white font-semibold shadow-lg shadow-[#C84214]/20 hover:bg-[#B3390F] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                        >
                            Pedí tu diagnóstico gratuito
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="border-t border-white/5 bg-[#0B0D0E]">
                <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Image src="/logo-individra-rebrand.png" alt="INDIVIDRA" width={640} height={125} quality={95} sizes="200px" className="h-8 w-auto object-contain opacity-80" />
                    <p className="text-neutral-500 text-sm">© {new Date().getFullYear()} Individra — Inteligencia Operativa</p>
                    <Link href="/" className="text-neutral-400 hover:text-white text-sm transition-colors">
                        Volver al inicio
                    </Link>
                </div>
            </footer>
        </main>
    )
}
