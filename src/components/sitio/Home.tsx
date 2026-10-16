'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { MotionConfig, motion, useInView } from 'framer-motion'
import { ArrowRight, BellRing, CalendarDays, Check, ChevronDown, Clock, Gauge, Mail } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { CalculadoraMargen } from './CalculadoraMargen'
import { CALENDLY_URL, DIAGNOSTICO_HREF, EMAIL, whatsappHref } from './contacto'
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
} from './shared'

/*
 * Home: una sola versión para todos los tamaños.
 * - Hasta 1023px (celular y tablet): una columna, como la versión mobile aprobada.
 * - Desde 1024px (lg): columnas, Calendly embebido y QR de WhatsApp.
 */

// Calendly solo se descarga en desktop y cuando el bloque de contacto está cerca
const CalendlyEmbed = dynamic(() => import('./CalendlyEmbed').then((m) => m.CalendlyEmbed), { ssr: false })

const WA_PILOTO = whatsappHref('Hola Gabriel, vendo por Mercado Libre y quiero consultar por el Piloto de 30 días.')

const SECCION = 'scroll-mt-24 relative bg-[#0B0D0E] border-t border-white/5 overflow-hidden'
const PADDING = 'py-14 lg:py-28'

/** Resplandor de fondo, solo en desktop (decorativo). */
function Glow({ className }: { className: string }) {
    return <div aria-hidden className={`hidden lg:block pointer-events-none absolute rounded-full blur-[120px] ${className}`} />
}

/* ---------- 1. Hero ---------- */
function Hero() {
    return (
        <section
            id="inicio"
            data-bloque="hero"
            data-hero
            className="scroll-mt-24 relative bg-[#0B0D0E] overflow-hidden"
        >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C84214]/15 via-transparent to-transparent pointer-events-none" />
            <div
                aria-hidden
                className="hidden lg:block absolute inset-0 bg-[linear-gradient(rgba(183,179,176,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(183,179,176,0.035)_1px,transparent_1px)] bg-[size:88px_88px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] pointer-events-none"
            />
            <div
                className={`${CONTENEDOR} relative pt-24 pb-10 lg:pt-28 lg:pb-16 lg:min-h-[min(100svh,840px)] lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:gap-10 lg:items-center`}
            >
                {/* Emblema 3D: chico arriba en el celular, protagonista a la derecha en desktop */}
                <div className="relative flex justify-center lg:order-last lg:justify-end">
                    <Image
                        src="/individra-3d-floating.png"
                        alt="Emblema 3D de INDIVIDRA"
                        width={1024}
                        height={1024}
                        priority
                        sizes="(min-width: 1280px) 450px, (min-width: 1024px) 380px, 96px"
                        className="anim-float-y [--float-y:-6px] lg:[--float-y:-14px] [--float-dur:4.5s] h-24 w-24 lg:h-[380px] lg:w-[380px] xl:h-[450px] xl:w-[450px] object-contain drop-shadow-[0_30px_60px_rgba(255,85,32,0.18)]"
                    />
                    {/* Aviso flotante: lo que el producto hace, sobre el emblema (desktop) */}
                    <motion.div
                        initial={{ opacity: 0, x: -24, y: 12 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className="hidden lg:block absolute -left-6 xl:-left-10 bottom-4 w-[300px] rounded-2xl border border-white/10 bg-[#11161A]/90 backdrop-blur-xl p-4 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)]"
                    >
                        <div className="flex items-center gap-2.5">
                            <span className="w-8 h-8 rounded-lg bg-[#25D366] flex items-center justify-center">
                                <WhatsappIcon className="w-4.5 h-4.5 text-white" />
                            </span>
                            <span className="text-xs text-neutral-400">
                                <span className="font-semibold text-white">INDIVIDRA · Alertas</span> · ahora
                            </span>
                        </div>
                        <p className="mt-2.5 text-sm font-semibold text-white">Nuevo reclamo · Venta #2000008491</p>
                        <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[#FFA380]">
                            <Clock className="w-3.5 h-3.5" aria-hidden /> Respondé antes de mañana 14:30
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-[#FBBF24]">
                            <Gauge className="w-3.5 h-3.5" aria-hidden /> Te queda 1 reclamo antes de salir de verde
                        </p>
                    </motion.div>
                </div>

                <div className="hero-intro lg:max-w-[640px]">
                    <Eyebrow className="mt-2 lg:mt-0">Para vendedores de Mercado Libre</Eyebrow>
                    <h1 className="mt-3 lg:mt-5 text-[1.85rem] lg:text-[2.6rem] xl:text-[3rem] font-heading font-extrabold leading-[1.1] lg:leading-[1.06] tracking-tight text-white">
                        Un reclamo que se te pasa te baja de color.{' '}
                        <span className="text-[#FF6E40]">Con INDIVIDRA no se te pasa ninguno.</span>
                    </h1>
                    <p className="mt-4 lg:mt-6 text-base lg:text-xl text-neutral-300 leading-relaxed">
                        Te avisamos por WhatsApp apenas entra un reclamo, con el plazo exacto para responder y cuántos te
                        quedan antes de perder el verde.
                    </p>
                    <div className="mt-7 lg:mt-9 lg:flex lg:items-center lg:gap-6">
                        <a
                            href={DIAGNOSTICO_HREF}
                            className="group w-full lg:w-auto lg:whitespace-nowrap py-4 px-5 lg:px-7 bg-[#D4430E] hover:bg-[#BF3A0B] text-white font-heading font-bold text-base rounded-2xl shadow-[0_4px_30px_rgba(255,85,32,0.35)] flex items-center justify-center gap-2 active:scale-[0.99] transition"
                        >
                            Ver cuántos reclamos me quedan
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden />
                        </a>
                        <a
                            href="#consola-operativa"
                            data-track="home_hero_secundario_clicked"
                            className="hidden xl:flex items-center gap-1.5 whitespace-nowrap text-neutral-300 hover:text-white transition-colors"
                        >
                            Ver cómo te llega el aviso
                            <ChevronDown className="w-4 h-4 text-[#FF5520]" aria-hidden />
                        </a>
                    </div>
                    <p className="mt-3 lg:mt-4 text-center lg:text-left text-xs lg:text-sm text-neutral-400 font-mono">
                        Gratis · 2 min · Piloto de 30 días sin permanencia
                    </p>
                    <a
                        href="#consola-operativa"
                        data-track="home_hero_secundario_clicked"
                        className="xl:hidden mt-6 lg:mt-5 flex items-center justify-center lg:justify-start gap-1.5 text-sm text-neutral-300 hover:text-white transition-colors"
                    >
                        Ver cómo te llega el aviso
                        <ChevronDown className="w-4 h-4 text-[#FF5520]" aria-hidden />
                    </a>
                    <div className="hidden lg:flex flex-wrap items-center gap-x-6 gap-y-3 mt-10 pt-6 border-t border-white/[0.07] [&>span]:whitespace-nowrap">
                        <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">Se conecta con</span>
                        <span className="flex items-center gap-2 text-sm text-neutral-300">
                            <Image src="/logos/mercadolibre-isotipo.svg" alt="" width={22} height={22} className="h-5 w-auto" />
                            Mercado Libre
                        </span>
                        <span className="flex items-center gap-2 text-sm text-neutral-300">
                            <Image src="/logos/tiendanube.svg" alt="Tiendanube" width={22} height={22} className="h-5 w-auto" />
                        </span>
                        <span className="flex items-center gap-2 text-sm text-neutral-300">
                            <Image src="/logos/whatsapp.svg" alt="" width={22} height={22} className="h-5 w-auto" />
                            WhatsApp
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}

/* ---------- Maqueta del WhatsApp de alerta (datos ficticios) ---------- */
function AlertaWhatsApp() {
    const ref = useRef<HTMLDivElement>(null)
    const enPantalla = useInView(ref, { once: true, amount: 0.5 })
    return (
        <div
            ref={ref}
            className="rounded-3xl border border-white/10 bg-[#0E1613] p-4 lg:p-6 lg:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
        >
            <div className="flex items-center gap-2.5 pb-3 lg:pb-4 border-b border-white/5">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#FF5520] flex items-center justify-center">
                    <BellRing className="w-4 h-4 lg:w-5 lg:h-5 text-white" aria-hidden />
                </div>
                <div>
                    <div className="text-sm lg:text-base font-semibold text-white">INDIVIDRA · Alertas</div>
                    <div className="text-[11px] lg:text-xs text-[#25D366]">en línea</div>
                </div>
            </div>
            <div className="mt-3 lg:mt-5 min-h-[150px] lg:min-h-[176px]">
                {/* Primero "escribiendo…", después el mensaje */}
                <motion.div
                    initial={false}
                    animate={enPantalla ? { opacity: 0, height: 0 } : { opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.2 }}
                    className="inline-flex gap-1 rounded-2xl rounded-tl-sm bg-[#1F2C26] px-4 py-3 overflow-hidden"
                    aria-hidden
                >
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                        />
                    ))}
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={enPantalla ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                    transition={{ delay: 1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-[92%] rounded-2xl rounded-tl-sm bg-[#1F2C26] p-3.5 lg:p-5 text-[13px] lg:text-[15px] leading-relaxed text-neutral-100"
                >
                    <p className="font-semibold text-white">Nuevo reclamo · Venta #2000008491</p>
                    <p className="text-neutral-300">Motivo: el producto no es lo que pidió</p>
                    <p className="mt-2 flex items-center gap-1.5 text-[#FFA380] font-semibold">
                        <Clock className="w-3.5 h-3.5 lg:w-4 lg:h-4" aria-hidden /> Respondé antes de mañana 14:30
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-[#FBBF24] font-semibold">
                        <Gauge className="w-3.5 h-3.5 lg:w-4 lg:h-4" aria-hidden /> Te queda 1 reclamo antes de salir de verde
                    </p>
                    <p className="mt-2 text-right text-[10px] lg:text-xs text-neutral-400">09:12</p>
                </motion.div>
            </div>
            <p className="mt-3 text-[10px] lg:text-xs text-[#8C8C8C] text-center">Ejemplo con datos ficticios</p>
        </div>
    )
}

/* ---------- 2. Así te llega + 3. Beneficios ---------- */
const BENEFICIOS = [
    {
        img: { src: '/3d/icono-campana.png', w: 473, h: 512 },
        titulo: 'No se te pasa ningún reclamo',
        texto: 'Te llega por WhatsApp a vos o a quien responda, no entre decenas de notificaciones.',
    },
    {
        img: { src: '/3d/icono-comparativa.png', w: 224, h: 224 },
        titulo: 'Sabés cuánto margen te queda',
        texto: 'Reclamos, cancelaciones y demoras, contra los límites de ML Argentina.',
    },
    {
        img: { src: '/3d/icono-pulgar.png', w: 429, h: 512 },
        titulo: 'Nada se manda sin tu OK',
        texto: 'Te dejamos la respuesta lista. Vos la revisás y decidís.',
    },
]

function AsiTeLlega() {
    return (
        <section id="consola-operativa" data-bloque="asi_te_llega" className={SECCION}>
            <Glow className="w-[520px] h-[520px] -right-40 top-10 bg-[#FF5520]/[0.07]" />
            <div className={`${CONTENEDOR} ${PADDING} relative lg:grid lg:grid-cols-2 lg:gap-x-20 lg:items-center`}>
                <Reveal>
                    <Icono3D src="/3d/icono-notif.png" w={512} h={376} className="h-12 lg:h-16 w-auto mb-3 lg:mb-5" />
                    <Eyebrow>Así te llega</Eyebrow>
                    <Titulo>Un WhatsApp, apenas entra el reclamo.</Titulo>
                </Reveal>

                <Reveal className="mt-6 lg:mt-0 lg:col-start-2 lg:row-start-1 lg:row-span-2" delay={0.1}>
                    <AlertaWhatsApp />
                </Reveal>

                <ul className="mt-8 lg:mt-10 space-y-5 lg:space-y-7">
                    {BENEFICIOS.map(({ img, titulo, texto }, i) => (
                        <motion.li
                            key={titulo}
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.6 }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="flex gap-4 lg:gap-5"
                        >
                            <div className="shrink-0 w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-white/[0.04] border border-white/10 p-1.5 flex items-center justify-center">
                                <Icono3D src={img.src} w={img.w} h={img.h} className="h-full w-auto" />
                            </div>
                            <div>
                                <h3 className="font-heading font-bold text-white lg:text-lg">{titulo}</h3>
                                <p className="mt-0.5 text-sm lg:text-base text-neutral-400 leading-relaxed">{texto}</p>
                            </div>
                        </motion.li>
                    ))}
                </ul>
            </div>
        </section>
    )
}

/* ---------- 4. Calculadora ---------- */
function Calculadora() {
    return (
        <section id="calculadora" data-bloque="calculadora" className={SECCION}>
            <Glow className="w-[600px] h-[400px] left-1/2 -translate-x-1/2 -top-32 bg-[#FF5520]/[0.06]" />
            <div className={`${CONTENEDOR} ${PADDING} relative`}>
                <Reveal className="lg:text-center lg:max-w-2xl lg:mx-auto lg:mb-12">
                    <Icono3D
                        src="/3d/icono-velocimetro.png"
                        w={560}
                        h={382}
                        className="h-16 lg:h-20 w-auto mb-3 lg:mb-5 lg:mx-auto"
                    />
                    <Eyebrow>Calculadora de margen</Eyebrow>
                    <Titulo>¿Cuántos reclamos te quedan?</Titulo>
                    <p className="mt-2 lg:mt-4 mb-6 lg:mb-0 text-sm lg:text-lg text-neutral-400">
                        Cargá los números de tu Reputación en ML.
                    </p>
                </Reveal>
                <Reveal delay={0.1}>
                    <CalculadoraMargen />
                </Reveal>
            </div>
        </section>
    )
}

/* ---------- 5. Piloto + 6. Precio ---------- */
const PASOS_PILOTO = [
    { cuando: 'Semana 1', titulo: 'Medimos', texto: 'Vemos tu termómetro hoy y cómo te enterás de cada reclamo.' },
    { cuando: 'Semana 2', titulo: 'Modo espejo', texto: 'Recibís las alertas en solo lectura. No tocamos tu cuenta.' },
    { cuando: 'Semanas 3 y 4', titulo: 'En vivo', texto: 'Activamos todo y al día 30 comparamos contra la semana 1.' },
]

const PLANES = [
    {
        plan: 'Plan 1 · Reputación ML + Venta Blindada',
        precio: '$115.000',
        detalle: 'Hasta 600 pedidos por mes. Alertas, termómetro, Venta Blindada y conciliación de liquidaciones.',
        incluye: [
            'Hasta 600 pedidos por mes',
            'Alertas de reclamos por WhatsApp, sin cargo de mensajes',
            'Termómetro de reputación',
            'Venta Blindada',
            'Conciliación de liquidaciones',
        ],
    },
    {
        plan: 'Plan 2 · Operación Total',
        precio: '$220.000',
        detalle: 'Hasta 1.200 pedidos por mes. Todo el Plan 1 más la logística de entrega en canal propio.',
        incluye: ['Hasta 1.200 pedidos por mes', 'Todo lo del Plan 1', 'Logística de entrega en canal propio'],
        enlace: { href: '/logistica', texto: 'Ver la solución de logística' },
    },
]

const INCLUYE_PILOTO = [
    'Seña de $50.000, reembolsable si no aplica a tu negocio',
    'Conexión de Mercado Libre, Tiendanube y WhatsApp incluida',
    'Informe de resultados al día 30',
]

const NOTA_PRECIOS =
    'Precios en pesos, se actualizan cada 3 meses por IPC. Pedido adicional: $180. Las alertas por WhatsApp que te mandamos a vos están incluidas. En el Plan 2, los avisos de entrega a tus clientes salen de tu propio número y Meta los cobra aparte, según tu uso.'

function Piloto() {
    return (
        <section id="piloto" data-bloque="piloto" className={SECCION}>
            <div className={`${CONTENEDOR} ${PADDING} relative`}>
                <Reveal className="lg:text-center lg:max-w-2xl lg:mx-auto">
                    <Icono3D src="/3d/icono-calendario.png" w={295} h={310} className="h-14 lg:h-16 w-auto mb-3 lg:mb-5 lg:mx-auto" />
                    <Eyebrow>Piloto de 30 días</Eyebrow>
                    <Titulo>Lo probás en tu cuenta antes de decidir.</Titulo>
                </Reveal>

                <ol className="mt-7 relative border-l border-[#FF5520]/30 ml-2 space-y-6 lg:mt-16 lg:ml-0 lg:border-l-0 lg:border-t lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-10">
                    {PASOS_PILOTO.map((p, i) => (
                        <motion.li
                            key={p.cuando}
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.6 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="pl-6 relative lg:pl-0 lg:pt-8"
                        >
                            <span className="absolute -left-[7px] top-1 lg:left-0 lg:-top-[7px] w-3.5 h-3.5 rounded-full bg-[#FF5520] ring-4 ring-[#0B0D0E]" />
                            <p className="text-[11px] lg:text-xs font-mono uppercase tracking-widest text-[#FFA380]">{p.cuando}</p>
                            <h3 className="font-heading font-bold text-white lg:text-xl lg:mt-1">{p.titulo}</h3>
                            <p className="text-sm lg:text-base text-neutral-400 lg:mt-1">{p.texto}</p>
                        </motion.li>
                    ))}
                </ol>

                <div className="mt-12 lg:mt-20 lg:grid lg:grid-cols-3 lg:gap-5 lg:items-stretch">
                    <Reveal className="h-full">
                        <div
                            id="precio"
                            data-bloque="precio"
                            className="scroll-mt-24 relative h-full rounded-3xl border border-[#FF5520]/40 bg-gradient-to-b from-[#1C100C] to-[#0E0F11] p-5 lg:p-7 lg:flex lg:flex-col lg:shadow-[0_20px_60px_-20px_rgba(255,85,32,0.35)]"
                        >
                            <Icono3D src="/3d/icono-escudo-lock.png" w={433} h={512} className="absolute -top-7 right-4 h-16 w-auto" />
                            <p className="hidden lg:block text-[11px] font-mono uppercase tracking-widest text-[#FFA380]">Para empezar</p>
                            <h3 className="font-heading font-bold text-white text-lg lg:text-xl lg:mt-1">Piloto de 30 días</h3>
                            <p className="mt-3 font-mono text-4xl font-extrabold text-white">$95.000</p>
                            <p className="mt-1 text-sm text-neutral-400">
                                + IVA · pago único · <span className="text-[#FFA380]">máximo 3 tiendas nuevas por mes</span>
                            </p>
                            <ul className="mt-4 lg:mt-5 space-y-2 lg:space-y-2.5 text-sm text-neutral-300 lg:flex-1">
                                {INCLUYE_PILOTO.map((item) => (
                                    <li key={item} className="flex items-start gap-2.5">
                                        <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#FF5520]" aria-hidden />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <a
                                href={WA_PILOTO}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-5 w-full py-3.5 px-5 bg-[#D4430E] hover:bg-[#BF3A0B] text-white font-heading font-bold rounded-2xl flex items-center justify-center gap-2 transition"
                            >
                                Consultar disponibilidad
                                <ArrowRight className="w-4 h-4" aria-hidden />
                            </a>

                            {/* Celular y tablet: los planes plegados dentro de la tarjeta */}
                            <details className="lg:hidden group mt-5 border-t border-white/10 pt-4">
                                <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-semibold text-white">
                                    Después del piloto: planes mensuales
                                    <ChevronDown className="w-4 h-4 text-[#FF5520] transition-transform group-open:rotate-180" aria-hidden />
                                </summary>
                                <div className="mt-4 space-y-3">
                                    {PLANES.map((p) => (
                                        <div key={p.plan} className="rounded-2xl bg-black/40 border border-white/5 p-4">
                                            <p className="text-xs font-semibold text-neutral-300">{p.plan}</p>
                                            <p className="mt-1 font-mono text-2xl font-bold text-white">
                                                {p.precio} <span className="text-xs font-normal text-neutral-400">+ IVA / mes</span>
                                            </p>
                                            <p className="mt-1 text-xs text-neutral-400 leading-relaxed">{p.detalle}</p>
                                        </div>
                                    ))}
                                    <p className="text-[11px] text-[#8C8C8C] leading-relaxed">{NOTA_PRECIOS}</p>
                                </div>
                            </details>
                        </div>
                    </Reveal>

                    {/* Desktop: los planes como tarjetas al lado del piloto */}
                    {PLANES.map((p, i) => (
                        <Reveal key={p.plan} className="hidden lg:block h-full" delay={0.08 * (i + 1)}>
                            <div className="h-full rounded-3xl border border-white/10 bg-white/[0.03] p-7 flex flex-col hover:border-white/20 transition-colors">
                                <p className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">Después del piloto</p>
                                <h3 className="mt-1 font-heading font-bold text-white text-lg leading-snug">{p.plan}</h3>
                                <p className="mt-3 font-mono text-4xl font-extrabold text-white">{p.precio}</p>
                                <p className="mt-1 text-sm text-neutral-400">+ IVA / mes · sin permanencia</p>
                                <ul className="mt-5 space-y-2.5 text-sm text-neutral-300">
                                    {p.incluye.map((item) => (
                                        <li key={item} className="flex items-start gap-2.5">
                                            <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#FF5520]" aria-hidden />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-auto pt-6">
                                    <p className="pt-5 border-t border-white/10 text-xs text-neutral-400 leading-relaxed">
                                        Lo elegís al terminar el piloto, con tus números a la vista.
                                    </p>
                                    {p.enlace && (
                                        <Link
                                            href={p.enlace.href}
                                            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#FFA380] hover:text-white transition-colors"
                                        >
                                            {p.enlace.texto}
                                            <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
                <p className="hidden lg:block mt-6 text-center text-xs text-[#8C8C8C]">{NOTA_PRECIOS}</p>
            </div>
        </section>
    )
}

/* ---------- 7. Confianza ---------- */
function Confianza() {
    return (
        <section id="confianza" data-bloque="confianza" className={SECCION}>
            <div className={`${CONTENEDOR} py-14 lg:py-20`}>
                <Reveal>
                    <FounderCard
                        frase="No prometemos porcentajes mágicos antes de ver tus números. Medimos tu caso en la semana 1 y, si al día 30 no te cierra, te vas con tu base en la mano."
                        chips={['Sin permanencia', 'Tu base es tuya', 'API oficial de Mercado Libre', 'Ley 25.326']}
                        whatsappHref={WA_PILOTO}
                    />
                </Reveal>
            </div>
        </section>
    )
}

/* ---------- 8. Módulos ---------- */
const MODULOS = [
    {
        nombre: 'Venta Blindada',
        img: { src: '/3d/ecommerce/pago-check.webp', w: 512, h: 501 },
        gancho: '¿Cobrás por transferencia en WhatsApp?',
        resumen: 'Validás el comprobante y bajás el stock en Mercado Libre y Tiendanube con 1 clic.',
        detalle:
            'Leemos el comprobante y chequeamos que no esté repetido. El stock se descuenta en Mercado Libre y Tiendanube recién cuando confirmás que la plata entró. Aplica a publicaciones con stock propio: en Full el stock lo maneja Mercado Libre.',
    },
    {
        nombre: 'Conciliación de liquidaciones',
        img: { src: '/3d/icono-remito.png', w: 512, h: 494 },
        gancho: '¿Sabés cuánto te queda limpio por venta?',
        resumen: 'Cruzamos cada venta con lo que te acreditó Mercado Pago y armamos un CSV para tu contador.',
        detalle:
            'Descontamos comisiones, envíos y retenciones para mostrarte el margen real por producto. No calculamos impuestos ni tocamos ARCA.',
    },
]

function Modulos() {
    return (
        <section id="modulos" data-bloque="modulos" className={SECCION}>
            <div className={`${CONTENEDOR} ${PADDING}`}>
                <Reveal>
                    <Eyebrow>Módulos que podés sumar</Eyebrow>
                    <Titulo className="hidden lg:block">Si además cobrás por WhatsApp o querés tu margen real.</Titulo>
                </Reveal>
                <div className="mt-4 lg:mt-10 space-y-3 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-5 lg:items-start">
                    {MODULOS.map((m, i) => (
                        <Reveal key={m.nombre} delay={i * 0.08}>
                            <details className="group rounded-2xl lg:rounded-3xl border border-white/10 bg-white/[0.03] hover:border-white/20 transition-colors p-4 lg:p-7">
                                <summary className="cursor-pointer list-none flex gap-3.5 lg:gap-5">
                                    <Icono3D src={m.img.src} w={m.img.w} h={m.img.h} className="h-14 w-14 lg:h-20 lg:w-20 shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-xs lg:text-sm text-[#FFA380]">{m.gancho}</p>
                                        <div className="mt-1 flex items-center justify-between gap-3">
                                            <h3 className="font-heading font-bold text-white lg:text-xl">{m.nombre}</h3>
                                            <ChevronDown
                                                className="w-4 h-4 shrink-0 text-[#FF5520] transition-transform group-open:rotate-180"
                                                aria-hidden
                                            />
                                        </div>
                                        <p className="mt-1 text-sm lg:text-base text-neutral-400 leading-relaxed">{m.resumen}</p>
                                    </div>
                                </summary>
                                <p className="mt-3 lg:mt-5 text-sm lg:text-base text-neutral-300 leading-relaxed border-t border-white/5 pt-3 lg:pt-5">
                                    {m.detalle}
                                </p>
                            </details>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    )
}

/* ---------- 9. FAQ ---------- */
const PREGUNTAS = [
    {
        q: 'Mercado Libre ya me avisa. ¿Para qué necesito esto?',
        a: 'El aviso de ML llega mezclado con decenas de notificaciones y no te dice cuánto margen te queda. Nosotros te escribimos por WhatsApp apenas se abre el reclamo, con el plazo y tu margen de color.',
    },
    {
        q: '¿Tengo que cambiar cómo trabajo?',
        a: 'No. Seguís usando Mercado Libre, Tiendanube y WhatsApp como siempre. Arrancamos en modo solo lectura. Si usás Producteca o Multivende, seguimos leyendo tus ventas y reclamos; antes de activar Venta Blindada definimos con vos quién descuenta el stock, para no pisarnos.',
    },
    {
        q: '¿Le hablan al comprador o le piden que no reclame?',
        a: 'No. Mercado Libre sanciona eso. Las respuestas que preparamos son neutrales, van por los canales oficiales de ML y siempre las aprueba una persona.',
    },
    {
        q: '¿Cuánto cuesta y hay permanencia?',
        a: 'El piloto de 30 días cuesta $95.000 + IVA, con una seña de $50.000 reembolsable si no aplica a tu negocio. Después, los planes arrancan en $115.000 + IVA por mes. No hay permanencia: cortás cuando quieras.',
    },
    {
        q: '¿Qué pasa con mis datos?',
        a: 'Tu operación corre en una instancia aislada, bajo la Ley 25.326. Podés exportar todo cuando quieras y no hay permanencia.',
    },
    {
        q: '¿Qué es el diagnóstico gratuito?',
        a: 'Una videollamada de 30 minutos. Sin pedirte contraseñas, miramos juntos tu reputación y cuánto margen te queda, y definimos la línea base del piloto.',
    },
]

// Datos estructurados para que Google pueda mostrar las preguntas en los resultados
const FAQ_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: PREGUNTAS.map((p) => ({
        '@type': 'Question',
        name: p.q,
        acceptedAnswer: { '@type': 'Answer', text: p.a },
    })),
}

function Faq() {
    return (
        <section id="faq" data-bloque="faq" className={SECCION}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
            <div className={`${CONTENEDOR} ${PADDING} lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:gap-16`}>
                <Reveal className="lg:sticky lg:top-28 lg:self-start">
                    <Icono3D src="/3d/icono-chat.png" w={308} h={291} className="h-12 lg:h-16 w-auto mb-3 lg:mb-5" />
                    <Eyebrow>Preguntas frecuentes</Eyebrow>
                    <Titulo className="hidden lg:block lg:text-[2.25rem]!">Lo que nos preguntan antes de arrancar.</Titulo>
                    <a
                        href={WA_PILOTO}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden lg:inline-flex mt-6 items-center gap-2 text-[#FFA380] hover:text-white transition-colors"
                    >
                        ¿Otra duda? Escribile a Gabriel
                        <ArrowRight className="w-4 h-4" aria-hidden />
                    </a>
                </Reveal>
                <div className="mt-4 lg:mt-0 divide-y divide-white/10 border-y border-white/10">
                    {PREGUNTAS.map((p) => (
                        <details key={p.q} className="group py-4 lg:py-6">
                            <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                                <h3 className="font-heading font-semibold text-white text-[15px] lg:text-lg leading-snug group-hover:text-[#FFA380] transition-colors">
                                    {p.q}
                                </h3>
                                <ChevronDown
                                    className="mt-0.5 lg:mt-1 w-4 h-4 lg:w-5 lg:h-5 shrink-0 text-[#FF5520] transition-transform group-open:rotate-180"
                                    aria-hidden
                                />
                            </summary>
                            <p className="mt-2 lg:mt-3 text-sm lg:text-base text-neutral-400 leading-relaxed lg:max-w-[60ch]">{p.a}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    )
}

/* ---------- 10. Contacto ---------- */
function Contacto() {
    return (
        <section id="contacto" data-bloque="contacto" data-contacto className={SECCION}>
            <Glow className="w-[600px] h-[600px] -left-48 bottom-0 bg-[#FF5520]/[0.06]" />
            <div className={`${CONTENEDOR} ${PADDING} relative lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:items-start`}>
                <Reveal>
                    <Icono3D src="/3d/vendedor-laptop.png" w={640} h={587} className="h-32 lg:h-40 w-auto mb-4 lg:mb-6" />
                    <Titulo>¿Lo vemos en tu cuenta?</Titulo>
                    <p className="mt-2 lg:mt-4 text-sm lg:text-lg text-neutral-400">
                        Hablás directo con Gabriel, sin vendedores de por medio.
                    </p>
                    <div className="mt-6 lg:mt-8 space-y-3">
                        <a
                            href={WA_PILOTO}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-4 px-5 bg-[#25D366] hover:brightness-110 text-[#0B0D0E] font-heading font-bold rounded-2xl flex items-center justify-center gap-2 transition"
                        >
                            <WhatsappIcon className="w-5 h-5" />
                            Escribir por WhatsApp
                        </a>
                        <a
                            href={CALENDLY_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="lg:hidden w-full py-3.5 px-5 rounded-2xl border border-white/15 text-white font-semibold flex items-center justify-center gap-2"
                        >
                            <CalendarDays className="w-4 h-4 text-[#FF5520]" aria-hidden />
                            Elegir horario (30 min)
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
                        <a
                            href={DIAGNOSTICO_HREF}
                            className="w-full py-3 px-5 lg:px-0 text-sm text-neutral-300 hover:text-white flex items-center justify-center lg:justify-start gap-1.5 transition-colors"
                        >
                            O hacé el autodiagnóstico (2 min)
                            <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                        </a>
                    </div>
                </Reveal>
                <div className="hidden lg:block">
                    <CalendlyEmbed />
                </div>
            </div>
        </section>
    )
}

/* ---------- Footer ---------- */
function Footer() {
    return (
        <footer className="bg-[#0B0D0E] border-t border-white/10">
            <div className={`${CONTENEDOR} pt-10 pb-28 lg:pt-16 lg:pb-12`}>
                <div className="lg:grid lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-12">
                    <div className="hidden lg:block">
                        <Image
                            src="/logo-individra-rebrand.png"
                            alt="INDIVIDRA"
                            width={1092}
                            height={213}
                            sizes="200px"
                            className="h-10 w-auto"
                        />
                        <p className="mt-4 text-sm text-neutral-400 leading-relaxed max-w-xs">
                            Alertas de reclamos con plazo exacto y control de color para vendedores de Mercado Libre.
                        </p>
                    </div>
                    <Link
                        href="/logistica"
                        onClick={() => trackEvent('logistica_footer_clicked', { link: '/logistica' })}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-white/20 transition-colors p-4 lg:self-start"
                    >
                        <Icono3D src="/3d/celular-cajas.png" w={547} h={640} className="h-12 w-auto shrink-0" />
                        <span className="text-sm text-neutral-200">
                            ¿Tenés logística o reparto propio? <span className="text-[#FFA380] font-semibold">Ver solución</span>
                        </span>
                    </Link>
                    <div className="mt-8 lg:mt-0">
                        <nav aria-label="Enlaces del pie" className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-neutral-400">
                            <Link href="/diagnostico" className="hover:text-white transition-colors">Autodiagnóstico</Link>
                            <Link href="/legal#privacidad" className="hover:text-white transition-colors">Privacidad</Link>
                            <Link href="/legal#terminos" className="hover:text-white transition-colors">Términos</Link>
                            <a href="https://www.linkedin.com/company/individra" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                LinkedIn
                            </a>
                            <a href="https://www.instagram.com/gabrielcacabelos/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                Instagram
                            </a>
                        </nav>
                        <a href={`mailto:${EMAIL}`} className="mt-5 flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
                            <Mail className="w-4 h-4" aria-hidden />
                            {EMAIL}
                        </a>
                    </div>
                </div>
                <p className="mt-6 lg:mt-12 lg:pt-6 lg:border-t lg:border-white/5 text-xs text-[#8C8C8C]">
                    © {new Date().getFullYear()} INDIVIDRA · Buenos Aires
                </p>
            </div>
        </footer>
    )
}

export function Home() {
    const rootRef = useRef<HTMLDivElement>(null)
    const barraVisible = usePagina(rootRef, 'home')

    return (
        <MotionConfig reducedMotion="user">
            <div ref={rootRef}>
                <Hero />
                <AsiTeLlega />
                <Calculadora />
                <Piloto />
                <Confianza />
                <Modulos />
                <Faq />
                <Contacto />
                <Footer />
                <StickyBar
                    visible={barraVisible}
                    href={DIAGNOSTICO_HREF}
                    label="Ver mis reclamos (2 min)"
                    whatsappHref={WA_PILOTO}
                />
            </div>
        </MotionConfig>
    )
}
