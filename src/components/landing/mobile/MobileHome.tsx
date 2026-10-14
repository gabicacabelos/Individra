'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BellRing, CalendarDays, ChevronDown, Clock, Gauge, Mail } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { MobileCalculator } from './MobileCalculator'
import { CALENDLY_URL, DIAGNOSTICO_HREF, EMAIL, whatsappHref } from './contacto'
import { Eyebrow, FounderCard, Icono3D, StickyBar, Titulo, WhatsappIcon, useMobilePage } from './shared'

/*
 * Home para celulares (< 768px). Se renderiza con md:hidden y la home de
 * desktop queda intacta con hidden md:block (ver src/app/page.tsx).
 * Los ids llevan el prefijo m- para no chocar con los de desktop; el Navbar
 * resuelve #faq → #m-faq cuando la sección de desktop está oculta.
 */

const WA_PILOTO = whatsappHref('Hola Gabriel, vendo por Mercado Libre y quiero consultar por el Piloto de 30 días.')

/* ---------- 1. Hero ---------- */
function Hero() {
    return (
        <section id="m-inicio" data-bloque="hero" data-hero className="scroll-mt-20 relative px-5 pt-24 pb-10 bg-[#0B0D0E] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C84214]/15 via-transparent to-transparent pointer-events-none" />
            <div className="relative">
                <div className="flex justify-center">
                    <Image
                        src="/individra-3d-floating.png"
                        alt="Emblema 3D de INDIVIDRA"
                        width={1024}
                        height={1024}
                        sizes="112px"
                        className="anim-float-y [--float-y:-6px] [--float-dur:4.5s] h-24 w-24 object-contain"
                    />
                </div>
                <Eyebrow>Para vendedores de Mercado Libre</Eyebrow>
                <h1 className="mt-3 text-[1.85rem] font-heading font-extrabold leading-[1.1] tracking-tight text-white">
                    Un reclamo que se te pasa te baja de color.{' '}
                    <span className="text-[#FF6E40]">Con INDIVIDRA no se te pasa ninguno.</span>
                </h1>
                <p className="mt-4 text-base text-neutral-300 leading-relaxed">
                    Te avisamos por WhatsApp apenas entra un reclamo, con el plazo exacto para responder y cuántos te quedan
                    antes de perder el verde.
                </p>
                <a
                    href={DIAGNOSTICO_HREF}
                    className="mt-7 w-full py-4 px-5 bg-[#FF5520] text-white font-heading font-bold text-base rounded-2xl shadow-[0_4px_30px_rgba(255,85,32,0.35)] flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
                >
                    Ver cuántos reclamos me quedan
                    <ArrowRight className="w-4 h-4" />
                </a>
                <p className="mt-3 text-center text-xs text-neutral-400 font-mono">
                    Gratis · 2 min · Piloto de 30 días sin permanencia
                </p>
                <a
                    href="#m-consola-operativa"
                    data-track="home_hero_secundario_clicked"
                    className="mt-6 flex items-center justify-center gap-1.5 text-sm text-neutral-300"
                >
                    Ver cómo te llega el aviso
                    <ChevronDown className="w-4 h-4 text-[#FF5520]" />
                </a>
            </div>
        </section>
    )
}

/* ---------- 2. Así te llega + 3. Beneficios ---------- */
function AsiTeLlega() {
    return (
        <section id="m-consola-operativa" data-bloque="asi_te_llega" className="scroll-mt-20 px-5 py-14 bg-[#0B0D0E] border-t border-white/5">
            <Icono3D src="/3d/icono-notif.png" w={512} h={376} className="h-12 w-auto mb-3" />
            <Eyebrow>Así te llega</Eyebrow>
            <Titulo>Un WhatsApp, apenas entra el reclamo.</Titulo>

            {/* Maqueta del mensaje: datos ficticios */}
            <div className="mt-6 rounded-3xl border border-white/10 bg-[#0E1613] p-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                    <div className="w-8 h-8 rounded-full bg-[#FF5520] flex items-center justify-center">
                        <BellRing className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-white">INDIVIDRA · Alertas</div>
                        <div className="text-[11px] text-[#25D366]">en línea</div>
                    </div>
                </div>
                <div className="mt-3 max-w-[92%] rounded-2xl rounded-tl-sm bg-[#1F2C26] p-3.5 text-[13px] leading-relaxed text-neutral-100">
                    <p className="font-semibold text-white">Nuevo reclamo · Venta #2000008491</p>
                    <p className="text-neutral-300">Motivo: el producto no es lo que pidió</p>
                    <p className="mt-2 flex items-center gap-1.5 text-[#FFA380] font-semibold">
                        <Clock className="w-3.5 h-3.5" /> Respondé antes de mañana 14:30
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-[#FBBF24] font-semibold">
                        <Gauge className="w-3.5 h-3.5" /> Te queda 1 reclamo antes de salir de verde
                    </p>
                    <p className="mt-2 text-right text-[10px] text-neutral-400">09:12</p>
                </div>
                <p className="mt-3 text-[10px] text-neutral-500 text-center">Ejemplo con datos ficticios</p>
            </div>

            <ul className="mt-8 space-y-5">
                {[
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
                ].map(({ img, titulo, texto }) => (
                    <li key={titulo} className="flex gap-4">
                        <div className="shrink-0 w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 p-1.5 flex items-center justify-center">
                            <Icono3D src={img.src} w={img.w} h={img.h} className="h-full w-auto" />
                        </div>
                        <div>
                            <h3 className="font-heading font-bold text-white">{titulo}</h3>
                            <p className="mt-0.5 text-sm text-neutral-400 leading-relaxed">{texto}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    )
}

/* ---------- 4. Calculadora ---------- */
function Calculadora() {
    return (
        <section id="m-calculadora" data-bloque="calculadora" className="scroll-mt-20 px-5 py-14 bg-[#0B0D0E] border-t border-white/5">
            <Icono3D src="/3d/icono-velocimetro.png" w={560} h={382} className="h-16 w-auto mb-3" />
            <Eyebrow>Calculadora de margen</Eyebrow>
            <Titulo>¿Cuántos reclamos te quedan?</Titulo>
            <p className="mt-2 mb-6 text-sm text-neutral-400">Cargá los números de tu Reputación en ML.</p>
            <MobileCalculator />
        </section>
    )
}

/* ---------- 5. Piloto + 6. Precio ---------- */
function Piloto() {
    const pasos = [
        { cuando: 'Semana 1', titulo: 'Medimos', texto: 'Vemos tu termómetro hoy y cómo te enterás de cada reclamo.' },
        { cuando: 'Semana 2', titulo: 'Modo espejo', texto: 'Recibís las alertas en solo lectura. No tocamos tu cuenta.' },
        { cuando: 'Semanas 3 y 4', titulo: 'En vivo', texto: 'Activamos todo y al día 30 comparamos contra la semana 1.' },
    ]
    return (
        <section id="m-piloto" data-bloque="piloto" className="scroll-mt-20 px-5 py-14 bg-[#0B0D0E] border-t border-white/5">
            <Icono3D src="/3d/icono-calendario.png" w={295} h={310} className="h-14 w-auto mb-3" />
            <Eyebrow>Piloto de 30 días</Eyebrow>
            <Titulo>Lo probás en tu cuenta antes de decidir.</Titulo>

            <ol className="mt-7 relative border-l border-[#FF5520]/30 ml-2 space-y-6">
                {pasos.map((p) => (
                    <li key={p.cuando} className="pl-6 relative">
                        <span className="absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-full bg-[#FF5520] ring-4 ring-[#0B0D0E]" />
                        <p className="text-[11px] font-mono uppercase tracking-widest text-[#FFA380]">{p.cuando}</p>
                        <h3 className="font-heading font-bold text-white">{p.titulo}</h3>
                        <p className="text-sm text-neutral-400">{p.texto}</p>
                    </li>
                ))}
            </ol>

            <div id="m-precio" data-bloque="precio" className="scroll-mt-20 relative mt-12 rounded-3xl border border-[#FF5520]/40 bg-gradient-to-b from-[#1C100C] to-[#0E0F11] p-5">
                <Icono3D src="/3d/icono-escudo-lock.png" w={433} h={512} className="absolute -top-7 right-4 h-16 w-auto" />
                <h3 className="font-heading font-bold text-white text-lg">Piloto de 30 días</h3>
                <p className="mt-3 font-mono text-4xl font-extrabold text-white">$95.000</p>
                <p className="mt-1 text-sm text-neutral-400">
                    + IVA · pago único · <span className="text-[#FFA380]">máximo 3 tiendas nuevas por mes</span>
                </p>
                <ul className="mt-4 space-y-2 text-sm text-neutral-300">
                    <li>· Seña de $50.000, reembolsable si no aplica a tu negocio</li>
                    <li>· Conexión de Mercado Libre, Tiendanube y WhatsApp incluida</li>
                    <li>· Informe de resultados al día 30</li>
                </ul>
                <a
                    href={WA_PILOTO}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 w-full py-3.5 px-5 bg-[#FF5520] text-white font-heading font-bold rounded-2xl flex items-center justify-center gap-2"
                >
                    Consultar disponibilidad
                    <ArrowRight className="w-4 h-4" />
                </a>

                <details className="group mt-5 border-t border-white/10 pt-4">
                    <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-semibold text-white">
                        Después del piloto: planes mensuales
                        <ChevronDown className="w-4 h-4 text-[#FF5520] transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="mt-4 space-y-3">
                        {[
                            {
                                plan: 'Plan 1 · Reputación ML + Venta Blindada',
                                precio: '$115.000',
                                detalle: 'Hasta 600 pedidos por mes. Alertas, termómetro, Venta Blindada y conciliación de liquidaciones.',
                            },
                            {
                                plan: 'Plan 2 · Operación Total',
                                precio: '$220.000',
                                detalle: 'Hasta 1.200 pedidos por mes. Todo el Plan 1 más la logística de entrega en canal propio.',
                            },
                        ].map((p) => (
                            <div key={p.plan} className="rounded-2xl bg-black/40 border border-white/5 p-4">
                                <p className="text-xs font-semibold text-neutral-300">{p.plan}</p>
                                <p className="mt-1 font-mono text-2xl font-bold text-white">
                                    {p.precio} <span className="text-xs font-normal text-neutral-400">+ IVA / mes</span>
                                </p>
                                <p className="mt-1 text-xs text-neutral-400 leading-relaxed">{p.detalle}</p>
                            </div>
                        ))}
                        <p className="text-[11px] text-neutral-500 leading-relaxed">
                            Precios en pesos, se actualizan cada 3 meses por IPC. Pedido adicional: $180. Los mensajes de
                            WhatsApp los cobra Meta aparte, según tu uso.
                        </p>
                    </div>
                </details>
            </div>
        </section>
    )
}

/* ---------- 7. Confianza ---------- */
function Confianza() {
    return (
        <section id="m-confianza" data-bloque="confianza" className="scroll-mt-20 px-5 py-14 bg-[#0B0D0E] border-t border-white/5">
            <FounderCard
                frase="No prometemos porcentajes mágicos antes de ver tus números. Medimos tu caso en la semana 1 y, si al día 30 no te cierra, te vas con tu base en la mano."
                chips={['Sin permanencia', 'Tu base es tuya', 'API oficial de Mercado Libre', 'Ley 25.326']}
                whatsappHref={WA_PILOTO}
            />
        </section>
    )
}

/* ---------- 8. Módulos ---------- */
function Modulos() {
    const modulos = [
        {
            nombre: 'Venta Blindada',
            img: { src: '/3d/ecommerce/pago-check.webp', w: 512, h: 501 },
            gancho: '¿Cobrás por transferencia en WhatsApp?',
            resumen: 'Validás el comprobante y bajás el stock en Mercado Libre y Tiendanube con 1 clic.',
            detalle:
                'Leemos el comprobante, chequeamos que no esté repetido y reservamos la unidad 15 minutos. El stock se descuenta recién cuando confirmás que la plata entró.',
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
    return (
        <section id="m-modulos" data-bloque="modulos" className="scroll-mt-20 px-5 py-14 bg-[#0B0D0E] border-t border-white/5">
            <Eyebrow>Módulos que podés sumar</Eyebrow>
            <div className="mt-4 space-y-3">
                {modulos.map((m) => (
                    <details key={m.nombre} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <summary className="cursor-pointer list-none flex gap-3.5">
                            <Icono3D src={m.img.src} w={m.img.w} h={m.img.h} className="h-14 w-14 shrink-0" />
                            <div className="flex-1">
                                <p className="text-xs text-[#FFA380]">{m.gancho}</p>
                                <div className="mt-1 flex items-center justify-between gap-3">
                                    <h3 className="font-heading font-bold text-white">{m.nombre}</h3>
                                    <ChevronDown className="w-4 h-4 shrink-0 text-[#FF5520] transition-transform group-open:rotate-180" />
                                </div>
                                <p className="mt-1 text-sm text-neutral-400">{m.resumen}</p>
                            </div>
                        </summary>
                        <p className="mt-3 text-sm text-neutral-300 leading-relaxed border-t border-white/5 pt-3">{m.detalle}</p>
                    </details>
                ))}
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
        a: 'No. Seguís usando Mercado Libre, Tiendanube y WhatsApp como siempre. Arrancamos en modo solo lectura. Si usás Producteca o Multivende, funcionamos junto con ellos.',
    },
    {
        q: '¿Le hablan al comprador o le piden que no reclame?',
        a: 'No. Mercado Libre sanciona eso. Las respuestas que preparamos son neutrales, van por los canales oficiales de ML y siempre las aprueba una persona.',
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

function Faq() {
    return (
        <section id="m-faq" data-bloque="faq" className="scroll-mt-20 px-5 py-14 bg-[#0B0D0E] border-t border-white/5">
            <Icono3D src="/3d/icono-chat.png" w={308} h={291} className="h-12 w-auto mb-3" />
            <Eyebrow>Preguntas frecuentes</Eyebrow>
            <div className="mt-4 divide-y divide-white/10 border-y border-white/10">
                {PREGUNTAS.map((p) => (
                    <details key={p.q} className="group py-4">
                        <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                            <h3 className="font-heading font-semibold text-white text-[15px] leading-snug">{p.q}</h3>
                            <ChevronDown className="mt-0.5 w-4 h-4 shrink-0 text-[#FF5520] transition-transform group-open:rotate-180" />
                        </summary>
                        <p className="mt-2 text-sm text-neutral-400 leading-relaxed">{p.a}</p>
                    </details>
                ))}
            </div>
        </section>
    )
}

/* ---------- 10. Contacto ---------- */
function Contacto() {
    return (
        <section id="m-contacto" data-bloque="contacto" data-contacto className="scroll-mt-20 px-5 py-14 bg-[#0B0D0E] border-t border-white/5">
            <Icono3D src="/3d/vendedor-laptop.png" w={640} h={587} className="h-32 w-auto mb-4" />
            <Titulo>¿Lo vemos en tu cuenta?</Titulo>
            <p className="mt-2 text-sm text-neutral-400">Hablás directo con Gabriel, sin vendedores de por medio.</p>
            <div className="mt-6 space-y-3">
                <a
                    href={WA_PILOTO}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-5 bg-[#25D366] text-[#0B0D0E] font-heading font-bold rounded-2xl flex items-center justify-center gap-2"
                >
                    <WhatsappIcon className="w-5 h-5" />
                    Escribir por WhatsApp
                </a>
                <a
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-5 rounded-2xl border border-white/15 text-white font-semibold flex items-center justify-center gap-2"
                >
                    <CalendarDays className="w-4 h-4 text-[#FF5520]" />
                    Elegir horario (30 min)
                </a>
                <a
                    href={DIAGNOSTICO_HREF}
                    className="w-full py-3 px-5 text-sm text-neutral-300 flex items-center justify-center gap-1.5"
                >
                    O hacé el autodiagnóstico (2 min)
                    <ArrowRight className="w-3.5 h-3.5" />
                </a>
            </div>
        </section>
    )
}

/* ---------- Footer compacto ---------- */
function MobileFooter() {
    return (
        <footer className="px-5 pt-10 pb-28 bg-[#0B0D0E] border-t border-white/10">
            <Link
                href="/logistica"
                onClick={() => trackEvent('logistica_footer_clicked', { link: '/logistica', version: 'mobile' })}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
                <Icono3D src="/3d/celular-cajas.png" w={547} h={640} className="h-12 w-auto shrink-0" />
                <span className="text-sm text-neutral-200">
                    ¿Tenés logística o reparto propio? <span className="text-[#FFA380] font-semibold">Ver solución</span>
                </span>
            </Link>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm text-neutral-400">
                <Link href="/diagnostico">Autodiagnóstico</Link>
                <Link href="/legal#privacidad">Privacidad</Link>
                <Link href="/legal#terminos">Términos</Link>
                <a href="https://www.linkedin.com/company/individra" target="_blank" rel="noopener noreferrer">
                    LinkedIn
                </a>
                <a href="https://www.instagram.com/gabrielcacabelos/" target="_blank" rel="noopener noreferrer">
                    Instagram
                </a>
            </div>
            <a href={`mailto:${EMAIL}`} className="mt-5 flex items-center gap-2 text-sm text-neutral-400">
                <Mail className="w-4 h-4" />
                {EMAIL}
            </a>
            <p className="mt-6 text-xs text-neutral-600">© {new Date().getFullYear()} INDIVIDRA · Buenos Aires</p>
        </footer>
    )
}

export function MobileHome() {
    const rootRef = useRef<HTMLDivElement>(null)
    const barraVisible = useMobilePage(rootRef, 'home')

    return (
        <div ref={rootRef} className="md:hidden">
            <Hero />
            <AsiTeLlega />
            <Calculadora />
            <Piloto />
            <Confianza />
            <Modulos />
            <Faq />
            <Contacto />
            <MobileFooter />
            <StickyBar
                visible={barraVisible}
                href={DIAGNOSTICO_HREF}
                label="Ver mis reclamos (2 min)"
                whatsappHref={WA_PILOTO}
            />
        </div>
    )
}
