'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import {
    MessagesSquare,
    ArrowUpRight,
    Plus,
    Minus,
    Sparkles,
    Check,
} from 'lucide-react'
import { Footer } from '@/components/landing/Footer'

/* ============================================================
   Identidad Individra (compartida con el resto del sitio):
   fondo #0B0D0E · acento #C84214 · crema #E8E5DE
   grises #B7B3B0 / #3E3D3A / #1E1D1C · tipografía Geist
   Layout propio de /ecommerce: NO reutiliza componentes de
   logística (sin PhoneChatHero, PainCarousel ni micro-demos).
   ============================================================ */

const BRAND = '#C84214'

/* ---------- Íconos 3D ----------
   Los .webp viven en /public/3d/ecommerce. Se recortaron al bounding box
   real del alfa y se bajaron a 512px de lado mayor, así que el width/height
   de acá es la proporción exacta del archivo: pasarlos mal deforma el render.
   Solo se usa la familia "objeto" (cajas, carritos, teléfonos): los assets
   con personajes ilustrados rompen la estética oscura del resto del sitio. */

type Art = { src: string; w: number; h: number; alt: string }

const ART = {
    auriculares: {
        src: '/3d/ecommerce/auriculares.webp',
        w: 512,
        h: 367,
        alt: 'Auriculares de atención al cliente',
    },
    carritoLleno: {
        src: '/3d/ecommerce/carrito-lleno.webp',
        w: 448,
        h: 512,
        alt: 'Carrito de compras cargado de paquetes',
    },
    multicanal: {
        src: '/3d/ecommerce/multicanal.webp',
        w: 504,
        h: 512,
        alt: 'Teléfono con los íconos de los canales de venta y paquetes en tránsito',
    },
    cajaCronometro: {
        src: '/3d/ecommerce/caja-cronometro.webp',
        w: 512,
        h: 446,
        alt: 'Paquete junto a un cronómetro',
    },
    pagoCheck: {
        src: '/3d/ecommerce/pago-check.webp',
        w: 512,
        h: 501,
        alt: 'Mano con un teléfono y una operación aprobada',
    },
    cajaAbierta: {
        src: '/3d/ecommerce/caja-abierta.webp',
        w: 459,
        h: 512,
        alt: 'Caja abierta con productos saliendo',
    },
    tiendaPhone: {
        src: '/3d/ecommerce/tienda-phone.webp',
        w: 317,
        h: 512,
        alt: 'Teléfono con la vidriera de una tienda y una bolsa de compras',
    },
    ideaBurbuja: {
        src: '/3d/ecommerce/idea-burbuja.webp',
        w: 479,
        h: 512,
        alt: 'Globo de diálogo con una lamparita encendida',
    },
    power: {
        src: '/3d/ecommerce/power.webp',
        w: 504,
        h: 512,
        alt: 'Botón de encendido iluminado',
    },
    monitorOferta: {
        src: '/3d/ecommerce/monitor-oferta.webp',
        w: 460,
        h: 512,
        alt: 'Monitor con la ficha de un producto y una etiqueta de descuento',
    },
    /**
     * Render ancho con el 56% superior izquierdo completamente vacío
     * (medido sobre el canal alfa: 0% de píxeles con contenido ahí).
     * Ese hueco no es decorativo, es el lienzo donde va el copy del cierre.
     */
    slabCarrito: {
        src: '/3d/ecommerce/slab-carrito.webp',
        w: 1024,
        h: 715,
        alt: 'Teléfono apoyado con un carrito de compras recibiendo paquetes',
    },
} satisfies Record<string, Art>

/**
 * Flotación continua para los renders 3D.
 * Se desactiva si el sistema pide menos movimiento: una animación infinita
 * es exactamente lo que molesta a quien activó esa preferencia.
 */
function Float({
    children,
    delay = 0,
    distance = 6,
    duration = 4,
}: {
    children: React.ReactNode
    delay?: number
    distance?: number
    duration?: number
}) {
    const reduce = useReducedMotion()
    if (reduce) return <>{children}</>
    return (
        <motion.div
            animate={{ y: [-distance, distance] }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
            }}
        >
            {children}
        </motion.div>
    )
}

/**
 * Anillos que se expanden desde el centro, tipo ping de radar.
 * Se usa detrás del botón de encendido: comunica "esto está prendido y
 * escuchando" mejor que cualquier texto al lado.
 */
function Ripple({ count = 2 }: { count?: number }) {
    const reduce = useReducedMotion()
    if (reduce) return null
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <motion.span
                    key={i}
                    aria-hidden
                    className="absolute inset-0 rounded-full border border-[#C84214]"
                    initial={{ scale: 0.9, opacity: 0.55 }}
                    animate={{ scale: 2.1, opacity: 0 }}
                    transition={{
                        duration: 2.8,
                        delay: i * 1.4,
                        repeat: Infinity,
                        ease: 'easeOut',
                    }}
                />
            ))}
        </>
    )
}

type Channel = {
    name: string
    tint: string
    initial: string
}

const CHANNELS: Channel[] = [
    { name: 'Mercado Libre', tint: '#FFE600', initial: 'ML' },
    { name: 'Tiendanube', tint: '#2D6DF6', initial: 'TN' },
    { name: 'Shopify', tint: '#95BF47', initial: 'SH' },
    { name: 'WhatsApp', tint: '#25D366', initial: 'WA' },
    { name: 'Instagram', tint: '#E1306C', initial: 'IG' },
    { name: 'WooCommerce', tint: '#7F54B3', initial: 'WC' },
]

/* ---------- Nav propio (identidad, anclas de esta página) ---------- */

function EcommerceNav() {
    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-4 left-4 right-4 z-[100] rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10"
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
                <Link href="/" className="flex items-center py-1">
                    <Image
                        src="/logo-individra-rebrand.png"
                        alt="INDIVIDRA - Inteligencia Operativa"
                        width={640}
                        height={125}
                        quality={95}
                        sizes="(max-width: 640px) 190px, 240px"
                        className="h-8 sm:h-10 w-auto object-contain"
                        priority
                    />
                </Link>

                <div className="hidden md:flex items-center gap-7">
                    <a href="#capacidades" className="text-neutral-400 hover:text-[#E8E5DE] transition-colors text-sm font-medium">
                        Capacidades
                    </a>
                    <a href="#centro" className="text-neutral-400 hover:text-[#E8E5DE] transition-colors text-sm font-medium">
                        Centro multicanal
                    </a>
                    <a href="#faq" className="text-neutral-400 hover:text-[#E8E5DE] transition-colors text-sm font-medium">
                        Preguntas
                    </a>
                    <Link href="/logistica" className="text-neutral-400 hover:text-[#E8E5DE] transition-colors text-sm font-medium">
                        Logística
                    </Link>
                </div>

                <Link
                    href="/diagnostico?origen=ecommerce"
                    className="px-4 py-2 bg-[#C84214] text-white text-xs sm:text-sm font-bold rounded-full hover:bg-[#B3390F] hover:scale-105 active:scale-95 transition-all duration-200 whitespace-nowrap"
                >
                    Diagnóstico gratuito
                </Link>
            </div>
        </motion.nav>
    )
}

/* ---------- Hero: bandeja unificada (el módulo estrella) ---------- */

function Hero() {
    return (
        <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
            {/* Fondo: glow terracota + grilla sutil (identidad del sitio) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C84214]/12 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(183,179,176,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(183,179,176,0.03)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />

            <div className="relative z-10 max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
                {/* Copy */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C84214]/30 bg-[#C84214]/10 text-[#E8A07E] text-xs font-semibold mb-6"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Para vendedores online
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.05 }}
                        className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.05] tracking-tight text-[#E8E5DE] text-balance"
                    >
                        Todas tus ventas online,{' '}
                        <span className="text-[#C84214]">en una sola conversación</span>.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.12 }}
                        className="mt-6 text-lg text-[#B7B3B0] leading-relaxed text-pretty max-w-xl"
                    >
                        Mercado Libre, Tiendanube, Shopify, WhatsApp e Instagram llegan a un mismo lugar.
                        Individra unifica los mensajes y responde con IA: preguntas, estado del pedido,
                        reclamos y recompra, sin que saltes entre diez pestañas.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.19 }}
                        className="mt-8 flex flex-wrap gap-3"
                    >
                        <Link
                            href="/diagnostico?origen=ecommerce"
                            className="group inline-flex items-center gap-2 px-6 py-3.5 bg-[#C84214] text-white font-bold rounded-xl shadow-lg shadow-[#C84214]/25 hover:bg-[#B3390F] active:scale-[0.98] transition-all duration-200"
                        >
                            Hacer el diagnóstico gratis
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                        <a
                            href="#capacidades"
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[#3E3D3A] text-[#E8E5DE] font-semibold hover:border-[#C84214]/50 hover:bg-white/5 transition-all duration-200"
                        >
                            Ver qué automatiza
                        </a>
                    </motion.div>
                </div>

                {/* Bandeja unificada (mock) */}
                <UnifiedInbox />
            </div>
        </section>
    )
}

function UnifiedInbox() {
    const messages = [
        { ch: CHANNELS[0], text: '¿Tenés stock del talle L?', tag: 'Pregunta' },
        { ch: CHANNELS[3], text: '¿Cuándo llega mi pedido #4821?', tag: 'Envío' },
        { ch: CHANNELS[4], text: 'Quiero cambiar el color', tag: 'Post-venta' },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl border border-[#3E3D3A] bg-[#121312]/90 backdrop-blur p-5 shadow-2xl shadow-black/40"
        >
            {/* Render 3D asomando por el costado derecho. Va a media altura, no
                arriba: los avatares de canales ocupan el ángulo superior derecho
                y la respuesta de la IA el inferior, así que la franja del medio
                es la única parte del flanco derecho que queda libre. */}
            {/* El voladizo es responsivo a propósito: por debajo de xl el panel
                llega casi al borde del viewport y la sección tiene overflow-hidden,
                así que un saliente grande se recortaría. */}
            <div className="hidden sm:block absolute top-[26%] -right-4 xl:-right-10 2xl:-right-20 z-20 pointer-events-none">
                <Float distance={8} duration={4.8} delay={0.3}>
                    {/* Levitación pura, sin halo ni sombra proyectada: el emblema 3D
                        del home principal sigue el mismo criterio. */}
                    <Image
                        src={ART.multicanal.src}
                        alt={ART.multicanal.alt}
                        width={ART.multicanal.w}
                        height={ART.multicanal.h}
                        quality={95}
                        sizes="384px"
                        className="relative h-32 sm:h-36 xl:h-44 w-auto object-contain"
                        priority
                    />
                </Float>
            </div>

            {/* header del panel */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#C84214]/15 border border-[#C84214]/30 flex items-center justify-center">
                        <MessagesSquare className="w-4 h-4 text-[#C84214]" />
                    </div>
                    <div>
                        <p className="text-[#E8E5DE] text-sm font-semibold leading-none">Bandeja unificada</p>
                        <p className="text-[#B7B3B0] text-xs mt-1">6 canales conectados</p>
                    </div>
                </div>
                <div className="flex -space-x-2">
                    {CHANNELS.slice(0, 5).map((c) => (
                        <span
                            key={c.name}
                            className="w-6 h-6 rounded-full border border-[#121312] flex items-center justify-center text-[9px] font-bold text-black"
                            style={{ background: c.tint }}
                            title={c.name}
                        >
                            {c.initial}
                        </span>
                    ))}
                </div>
            </div>

            {/* mensajes entrantes de distintos canales */}
            <div className="space-y-3 py-4">
                {messages.map((m, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + i * 0.15 }}
                        className="flex items-start gap-2.5"
                    >
                        <span
                            className="mt-0.5 w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[9px] font-bold text-black"
                            style={{ background: m.ch.tint }}
                        >
                            {m.ch.initial}
                        </span>
                        <div className="rounded-2xl rounded-tl-sm bg-[#1E1D1C] border border-white/5 px-3.5 py-2 max-w-[85%]">
                            <p className="text-[#E8E5DE] text-sm leading-snug">{m.text}</p>
                            <span className="text-[10px] text-[#B7B3B0]">{m.ch.name} · {m.tag}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* respuesta IA unificada */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="flex items-start gap-2.5 justify-end"
            >
                <div className="rounded-2xl rounded-tr-sm bg-[#C84214]/15 border border-[#C84214]/25 px-3.5 py-2 max-w-[88%]">
                    <div className="flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-3 h-3 text-[#C84214]" />
                        <span className="text-[10px] font-semibold text-[#E8A07E]">Individra respondió a los 3</span>
                    </div>
                    <p className="text-[#E8E5DE] text-sm leading-snug">
                        Stock disponible, pedido en camino y cambio gestionado. Todo desde el mismo panel.
                    </p>
                </div>
                <span className="mt-0.5 w-6 h-6 shrink-0 rounded-full bg-[#C84214] flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                </span>
            </motion.div>
        </motion.div>
    )
}

/* ---------- Franja de canales ---------- */

function ChannelStrip() {
    return (
        <section className="relative border-y border-white/5 bg-[#0B0D0E] py-8">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <span className="relative inline-flex w-9 h-9 shrink-0 items-center justify-center">
                        <Ripple />
                        <Image
                            src={ART.power.src}
                            alt={ART.power.alt}
                            width={ART.power.w}
                            height={ART.power.h}
                            quality={95}
                            sizes="96px"
                            className="relative w-9 h-9 object-contain drop-shadow-[0_0_14px_rgba(200,66,20,0.5)]"
                        />
                    </span>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#B7B3B0]">
                        Se conecta con donde ya vendés
                    </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                    {CHANNELS.map((c) => (
                        <div
                            key={c.name}
                            className="flex items-center gap-2.5 rounded-xl border border-[#3E3D3A] bg-[#121312] px-4 py-2.5"
                        >
                            <span
                                className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-black"
                                style={{ background: c.tint }}
                            >
                                {c.initial}
                            </span>
                            <span className="text-sm font-medium text-[#E8E5DE]">{c.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

/* ---------- Capacidades: riel de ciclo de venta (layout propio) ---------- */

type Capability = {
    art: Art
    title: string
    desc: string
    star?: boolean
}

type Phase = {
    label: string
    kicker: string
    items: Capability[]
}

const PHASES: Phase[] = [
    {
        label: 'Captar y convertir',
        kicker: 'Antes de la compra',
        items: [
            {
                art: ART.auriculares,
                title: 'Vendedor 24/7',
                desc: 'Contesta al instante preguntas de stock, talles, medidas, compatibilidad y envíos en publicaciones, web y WhatsApp. Aprende de tu catálogo y no deja una consulta sin respuesta.',
            },
            {
                art: ART.carritoLleno,
                title: 'Recuperador de carritos',
                desc: 'Retoma automáticamente al que preguntó y no compró o abandonó el carrito, con un seguimiento oportuno y no invasivo que vuelve a abrir la conversación.',
            },
        ],
    },
    {
        label: 'Operar sin fricción',
        kicker: 'Durante la venta',
        items: [
            {
                art: ART.monitorOferta,
                title: 'Centro multicanal',
                desc: 'El corazón de Individra para ecommerce: unifica Mercado Libre, Tiendanube, Shopify, WhatsApp e Instagram en una sola bandeja. Una conversación por cliente, sin saltar entre apps ni perder el hilo.',
                star: true,
            },
            {
                art: ART.cajaCronometro,
                title: 'Estado del pedido automático',
                desc: 'Avisa de forma proactiva dónde está cada envío y corta el "¿dónde está mi paquete?" antes de que el cliente lo pregunte. Apoyado en la fortaleza logística de Individra.',
            },
        ],
    },
    {
        label: 'Retener y proteger',
        kicker: 'Después de la compra',
        items: [
            {
                art: ART.pagoCheck,
                title: 'Escudo de reputación',
                desc: 'Detecta al cliente molesto apenas aparece la señal y lo deriva a una solución real antes de que el problema escale a reclamo. Menos reclamos abiertos es lo que cuida tu ranking en Mercado Libre.',
            },
            {
                art: ART.cajaAbierta,
                title: 'Post-venta y recompra',
                desc: 'Gestiona cambios, devoluciones y garantías, y dispara campañas de recompra segmentadas para que el cliente vuelva sin trabajo manual de tu equipo.',
            },
        ],
    },
]

function Capabilities() {
    return (
        <section id="capacidades" className="relative py-24">
            <div className="max-w-6xl mx-auto px-6">
                <div className="max-w-2xl mb-16">
                    <p className="text-[#C84214] text-sm font-semibold uppercase tracking-[0.15em] mb-3">
                        Qué automatiza Individra
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#E8E5DE] leading-tight text-balance">
                        Seis capacidades que cubren todo el ciclo de tu venta online
                    </h2>
                    <p className="mt-4 text-[#B7B3B0] leading-relaxed text-pretty">
                        Desde la primera pregunta hasta la recompra. Se activan de a una o todas juntas, según lo que tu operación necesite.
                    </p>
                </div>

                {/* Riel vertical de fases */}
                <div className="relative">
                    {/* línea del riel (desktop) */}
                    <div className="hidden md:block absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-[#C84214]/60 via-[#3E3D3A] to-transparent" />

                    <div className="space-y-16">
                        {PHASES.map((phase, pi) => (
                            <div key={phase.label} className="relative md:pl-12">
                                {/* nodo de fase */}
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="hidden md:flex absolute left-0 w-4 h-4 rounded-full bg-[#C84214] ring-4 ring-[#C84214]/15" />
                                    <span className="text-xs font-mono text-[#B7B3B0]">0{pi + 1}</span>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#E8E5DE] leading-none">{phase.label}</h3>
                                        <p className="text-xs text-[#B7B3B0] mt-1.5">{phase.kicker}</p>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {phase.items.map((cap, ci) => (
                                        <CapabilityCard
                                            key={cap.title}
                                            cap={cap}
                                            // Desfasamos la flotación para que las seis
                                            // tarjetas no suban y bajen en bloque.
                                            delay={(pi * 2 + ci) * 0.45}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

function CapabilityCard({ cap, delay = 0 }: { cap: Capability; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className={`group relative rounded-2xl border p-6 transition-all duration-300 ${
                cap.star
                    ? 'border-[#C84214]/40 bg-gradient-to-b from-[#C84214]/10 to-[#121312]'
                    : 'border-[#3E3D3A] bg-[#121312] hover:border-[#C84214]/40'
            }`}
        >
            {cap.star && (
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C84214] text-white text-[10px] font-bold uppercase tracking-wide">
                    <Sparkles className="w-2.5 h-2.5" />
                    Estrella
                </span>
            )}

            {/* Render 3D sobre un halo terracota: el halo reemplaza al recuadro
                de color del ícono plano, que contra un render con volumen
                quedaba como una estampilla pegada. */}
            <div className="relative mb-4 h-20 sm:h-24 flex items-end">
                <div
                    aria-hidden
                    className="absolute left-2 bottom-1 w-20 h-20 rounded-full bg-[#C84214]/20 blur-2xl group-hover:bg-[#C84214]/35 transition-colors duration-500"
                />
                <Float delay={delay} distance={5} duration={4.2}>
                    <Image
                        src={cap.art.src}
                        alt={cap.art.alt}
                        width={cap.art.w}
                        height={cap.art.h}
                        quality={95}
                        // Se muestra a ~96-134px, pero en pantallas 2x hace falta el
                        // doble de píxeles reales o el render sale blando. El archivo
                        // pesa 14-48KB, así que pedir el candidato grande no cuesta nada.
                        sizes="256px"
                        className="relative h-20 sm:h-24 w-auto object-contain drop-shadow-[0_14px_30px_rgba(200,66,20,0.28)] transition-transform duration-500 group-hover:scale-[1.08]"
                    />
                </Float>
            </div>

            <h4 className="text-lg font-bold text-[#E8E5DE] mb-2">{cap.title}</h4>
            <p className="text-sm text-[#B7B3B0] leading-relaxed text-pretty">{cap.desc}</p>
        </motion.div>
    )
}

/* ---------- Deep-dive del módulo estrella ---------- */

function StarSpotlight() {
    const reduce = useReducedMotion()
    const points = [
        'Una sola bandeja para Mercado Libre, Tiendanube, Shopify, WhatsApp e Instagram.',
        'Una conversación por cliente: la IA reconoce el mismo comprador aunque escriba por dos canales.',
        'Responde, deriva a una persona o escala solo cuando hace falta.',
        'Tu equipo deja de saltar entre pestañas y pierde de vista cero mensajes.',
    ]
    return (
        <section id="centro" className="relative py-24 border-t border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C84214]/8 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C84214] text-white text-xs font-bold mb-6">
                        <Sparkles className="w-3.5 h-3.5" />
                        Módulo estrella
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#E8E5DE] leading-tight text-balance">
                        El Centro multicanal: donde tu operación deja de estar dispersa
                    </h2>
                    <p className="mt-4 text-[#B7B3B0] leading-relaxed text-pretty">
                        Vender en cinco lugares no debería significar revisar cinco bandejas. Individra las junta en una
                        y suma IA encima para que la mayoría de los mensajes se resuelvan solos.
                    </p>
                    <ul className="mt-8 space-y-3">
                        {points.map((p) => (
                            <li key={p} className="flex items-start gap-3">
                                <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-[#C84214]/15 border border-[#C84214]/30 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-[#C84214]" />
                                </span>
                                <span className="text-sm text-[#E8E5DE] leading-relaxed">{p}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Visual: la tienda como un solo lugar + los canales convergiendo.
                    Cada render aparece una sola vez en toda la página; el de la
                    tarjeta de "Centro multicanal" no se repite acá. */}
                <div className="relative rounded-2xl border border-[#3E3D3A] bg-[#121312]/80 p-8">
                    <div className="relative flex justify-center pb-8">
                        {/* Halo que respira: refuerza que el núcleo está activo */}
                        <motion.div
                            aria-hidden
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-[#C84214]/25 blur-3xl"
                            animate={
                                reduce
                                    ? undefined
                                    : { opacity: [0.55, 1, 0.55], scale: [0.92, 1.06, 0.92] }
                            }
                            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <Float distance={10} duration={6}>
                            <Image
                                src={ART.tiendaPhone.src}
                                alt={ART.tiendaPhone.alt}
                                width={ART.tiendaPhone.w}
                                height={ART.tiendaPhone.h}
                                quality={95}
                                sizes="512px"
                                className="relative h-44 sm:h-56 w-auto object-contain drop-shadow-[0_28px_55px_rgba(200,66,20,0.35)]"
                            />
                        </Float>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center">
                        {CHANNELS.slice(0, 3).map((c) => (
                            <ConvergeBadge key={c.name} channel={c} />
                        ))}
                        <div className="col-span-3 flex justify-center py-2">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-14 h-14 rounded-2xl bg-[#C84214] flex items-center justify-center shadow-lg shadow-[#C84214]/30">
                                    <MessagesSquare className="w-7 h-7 text-white" />
                                </div>
                                <span className="text-xs font-semibold text-[#E8E5DE]">Individra</span>
                            </div>
                        </div>
                        {CHANNELS.slice(3, 6).map((c) => (
                            <ConvergeBadge key={c.name} channel={c} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

function ConvergeBadge({ channel }: { channel: Channel }) {
    return (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-[#1E1D1C] py-3">
            <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-black"
                style={{ background: channel.tint }}
            >
                {channel.initial}
            </span>
            <span className="text-[10px] text-[#B7B3B0] text-center leading-tight px-1">{channel.name}</span>
        </div>
    )
}

/* ---------- FAQ propia ---------- */

const FAQS = [
    {
        q: '¿Necesito cambiar de plataforma de ventas?',
        a: 'No. Individra se conecta a lo que ya usás (Mercado Libre, Tiendanube, Shopify, WhatsApp, Instagram, WooCommerce). Seguís vendiendo igual, solo que la atención se unifica y se automatiza.',
    },
    {
        q: '¿La IA responde sola o mi equipo mantiene el control?',
        a: 'Las dos cosas. La IA resuelve lo repetitivo y deriva a una persona cuando el caso lo amerita. Vos definís qué se responde solo y qué se escala.',
    },
    {
        q: '¿Puedo activar solo un módulo?',
        a: 'Sí. Podés empezar por el Centro multicanal o por el Vendedor 24/7 y sumar el resto cuando quieras. Se arma según tu operación.',
    },
    {
        q: '¿Cómo empiezo?',
        a: 'Con el diagnóstico gratuito: unas pocas preguntas sobre cómo vendés hoy y te devolvemos dónde estás perdiendo tiempo o ventas, y qué módulos te conviene activar primero.',
    },
]

function FAQ() {
    const [open, setOpen] = useState<number | null>(0)
    return (
        <section id="faq" className="relative py-24 border-t border-white/5">
            <div className="max-w-3xl mx-auto px-6">
                {/* La lamparita se enciende cuando hay una pregunta abierta:
                    el ícono responde a lo que hace la persona en vez de ser adorno. */}
                <div className="flex flex-col items-center mb-12">
                    <div className="relative mb-4">
                        <motion.div
                            aria-hidden
                            className="absolute inset-0 -m-1 rounded-full bg-[#C84214] blur-xl"
                            animate={{ opacity: open !== null ? 0.5 : 0.14 }}
                            transition={{ duration: 0.5 }}
                        />
                        <motion.div
                            animate={{ scale: open !== null ? 1.06 : 1, y: open !== null ? -3 : 0 }}
                            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                        >
                            <Image
                                src={ART.ideaBurbuja.src}
                                alt={ART.ideaBurbuja.alt}
                                width={ART.ideaBurbuja.w}
                                height={ART.ideaBurbuja.h}
                                quality={95}
                                sizes="192px"
                                className="relative h-16 sm:h-20 w-auto object-contain"
                            />
                        </motion.div>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#E8E5DE] text-center text-balance">
                        Preguntas frecuentes
                    </h2>
                </div>
                <div className="space-y-3">
                    {FAQS.map((f, i) => {
                        const isOpen = open === i
                        return (
                            <div
                                key={f.q}
                                className="rounded-xl border border-[#3E3D3A] bg-[#121312] overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpen(isOpen ? null : i)}
                                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                                    aria-expanded={isOpen}
                                >
                                    <span className="text-[#E8E5DE] font-semibold">{f.q}</span>
                                    <span className="shrink-0 text-[#C84214]">
                                        {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                    </span>
                                </button>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        transition={{ duration: 0.25 }}
                                        className="px-5 pb-5"
                                    >
                                        <p className="text-sm text-[#B7B3B0] leading-relaxed text-pretty">{f.a}</p>
                                    </motion.div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

/* ---------- CTA final ---------- */

function FinalCTA() {
    const reduce = useReducedMotion()
    return (
        <section className="relative py-24 border-t border-white/5 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C84214]/10 via-transparent to-transparent pointer-events-none" />

            {/* El copy y el render comparten un mismo contenedor de proporción fija.
                En desktop el texto se posiciona en porcentajes sobre el hueco vacío
                del render, así que acompaña la imagen a cualquier ancho. En mobile
                el mismo bloque vuelve al flujo normal, arriba de la imagen. */}
            <div className="relative z-10 max-w-5xl mx-auto px-6">
                <div className="relative">
                    <div className="md:absolute md:left-[3%] md:top-[7%] md:w-[52%] mb-10 md:mb-0">
                        <h2 className="text-3xl md:text-[1.75rem] lg:text-4xl font-bold text-[#E8E5DE] leading-tight text-balance">
                            Dejá de contestar lo mismo cien veces al día
                        </h2>
                        <p className="mt-3 lg:mt-4 text-sm lg:text-base text-[#B7B3B0] leading-relaxed text-pretty">
                            Empezá por el diagnóstico gratuito y descubrí qué parte de tu
                            atención puede funcionar sola.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href="/diagnostico?origen=ecommerce"
                                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-[#C84214] text-white font-bold rounded-xl shadow-lg shadow-[#C84214]/25 hover:bg-[#B3390F] active:scale-[0.98] transition-all duration-200"
                            >
                                Hacer el diagnóstico gratis
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                            <a
                                href="mailto:individratec@gmail.com"
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[#3E3D3A] text-[#E8E5DE] font-semibold hover:border-[#C84214]/50 hover:bg-white/5 transition-all duration-200"
                            >
                                Hablar con el equipo
                            </a>
                        </div>
                    </div>

                    {/* Resplandor bajo el carrito, del lado donde caen los paquetes */}
                    <motion.div
                        aria-hidden
                        className="absolute right-[12%] bottom-[6%] w-1/3 h-1/4 rounded-full bg-[#C84214]/30 blur-3xl pointer-events-none"
                        animate={reduce ? undefined : { opacity: [0.4, 0.85, 0.4] }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    {/* Entra con un rebote corto: los paquetes leen como que aterrizan */}
                    <motion.div
                        initial={reduce ? undefined : { opacity: 0, y: 44 }}
                        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ type: 'spring', stiffness: 90, damping: 13 }}
                    >
                        <Float distance={7} duration={5.5}>
                            <Image
                                src={ART.slabCarrito.src}
                                alt={ART.slabCarrito.alt}
                                width={ART.slabCarrito.w}
                                height={ART.slabCarrito.h}
                                quality={95}
                                sizes="(max-width: 768px) 100vw, 900px"
                                className="relative w-full h-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
                            />
                        </Float>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

/* ---------- Página ---------- */

export function EcommerceLanding() {
    return (
        <main id="main-content" className="min-h-screen bg-[#0B0D0E] text-[#E8E5DE] antialiased">
            <EcommerceNav />
            <Hero />
            <ChannelStrip />
            <Capabilities />
            <StarSpotlight />
            <FAQ />
            <FinalCTA />
            <Footer ctaHref="/diagnostico?origen=ecommerce" />
        </main>
    )
}
