'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronDown, Quote } from 'lucide-react'
import { PhoneChatHero } from './PhoneChatHero'
import { PainCarousel } from './PainCarousel'
import { DriverAdmissionDemo, MonthlyOperationsDemo } from '@/components/ui/micro-demos'
import { WHATSAPP_HREF, H1_TEXT, pains, PAIN_CLOSE, modules, flowSteps } from './contenido'
import { Eyebrow, FounderCard, Icono3D, StickyBar, Titulo, WhatsappIcon, useMobilePage } from '@/components/landing/mobile/shared'

/*
 * /logistica para celulares (< 768px). Se renderiza con md:hidden; la versión
 * de desktop queda intacta con hidden md:block (ver LogisticaLanding).
 * Mismos textos que desktop (contenido.ts), en capas: lo principal a la vista
 * y el detalle de cada módulo al tocarlo.
 */

const DIAGNOSTICO_LOGISTICA = '/diagnostico?origen=logistica'

// Los 8 módulos agrupados en 3 momentos de la entrega
const MOMENTOS = [
    { id: 'antes', label: 'Antes de salir', pasos: [1, 2] },
    { id: 'calle', label: 'En la calle', pasos: [3, 4, 8] },
    { id: 'despues', label: 'Después', pasos: [5, 6, 7] },
] as const

// Nombres más cortos para la pantalla chica
const NOMBRE_CORTO: Record<number, string> = {
    7: 'Radar de dadores',
    8: 'Protocolo de incidente en ruta',
}

/* ---------- 1. Hero ---------- */
function Hero() {
    return (
        <section data-bloque="hero" data-hero className="relative px-5 pt-28 pb-6 bg-[#0B0D0E] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C84214]/15 via-transparent to-transparent pointer-events-none" />
            <div className="relative">
                <Eyebrow>Logística y distribución</Eyebrow>
                <h1 className="mt-3 text-[1.75rem] font-heading font-extrabold leading-[1.12] tracking-tight text-white">
                    {H1_TEXT}
                </h1>
                <p className="mt-4 text-base text-neutral-300 leading-relaxed">
                    Un asistente por WhatsApp responde el estado de cada entrega, coordina las visitas y avisa cuando algo
                    se demora. <span className="text-white">Sin cambiar tu sistema actual.</span>
                </p>
                <a
                    href={WHATSAPP_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-7 w-full py-4 px-5 bg-[#FF5520] text-white font-heading font-bold text-base rounded-2xl shadow-[0_4px_30px_rgba(255,85,32,0.35)] flex items-center justify-center gap-2"
                >
                    Pedí un diagnóstico gratuito
                    <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                    href={DIAGNOSTICO_LOGISTICA}
                    className="mt-3 w-full py-3.5 px-5 rounded-2xl border border-white/15 text-neutral-200 font-medium text-sm flex items-center justify-center"
                >
                    Calcular costo de entregas fallidas (2 min)
                </Link>
                <p className="mt-3 text-center text-xs text-neutral-400 font-mono">
                    Desde $160.000/mes + IVA · Sin permanencia
                </p>
            </div>
            <div className="relative mt-6">
                <PhoneChatHero />
            </div>
        </section>
    )
}

/* ---------- 2. La objeción principal + flujo en 3 pasos ---------- */
function ComoFunciona() {
    return (
        <section id="m-como-funciona" data-bloque="como_funciona" className="scroll-mt-20 px-5 py-14 bg-[#0B0D0E] border-t border-white/5">
            <div className="rounded-3xl border border-[#FF5520]/30 bg-gradient-to-b from-[#1C100C] to-[#0E0F11] p-5">
                <div className="flex items-center gap-2">
                    <Image src="/logos/telegram.svg" alt="Telegram" width={28} height={28} className="w-7 h-7" />
                    <Image src="/logos/whatsapp.svg" alt="WhatsApp" width={28} height={28} className="w-7 h-7" />
                </div>
                <h2 className="mt-3 font-heading font-bold text-white text-lg leading-snug">
                    Sin app propia ni hardware para tus choferes
                </h2>
                <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                    Comparten la ubicación desde un bot de Telegram, en el mismo celular. Tus clientes reciben los avisos por
                    WhatsApp.
                </p>
            </div>

            <div className="mt-12">
                <Eyebrow>En la práctica</Eyebrow>
                <Titulo>Así de simple se ve en tu operación</Titulo>
                <ol className="mt-6 space-y-3">
                    {flowSteps.map((s) => (
                        <li key={s.n} className="flex items-center gap-4 rounded-2xl border border-[#3E3D3A] bg-[#161514] p-4">
                            <Icono3D src={s.src} w={s.w} h={s.h} className="h-14 w-14 shrink-0" />
                            <div>
                                <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#C84214]">
                                    Paso {s.n}
                                </p>
                                <h3 className="font-heading font-bold text-white">{s.title}</h3>
                                <p className="text-sm text-neutral-400 leading-relaxed">{s.desc}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    )
}

/* ---------- 3. Dolor (carrusel aprobado) ---------- */
function Dolor() {
    return (
        <section data-bloque="dolor" className="px-5 py-14 bg-[#0B0D0E] border-t border-white/5">
            <div className="flex justify-center">
                <Icono3D src="/3d/operario-cajas.png" w={529} h={560} className="w-44 h-auto" />
            </div>
            <h2 className="mt-4 text-[1.5rem] font-heading font-extrabold text-white text-center leading-tight">
                Si esto pasa en tu operación, se puede automatizar.
            </h2>
            <div className="mt-8">
                <PainCarousel pains={pains} />
            </div>
            <p className="mt-8 border-l-2 border-[#C84214] pl-4 text-base text-white font-medium leading-relaxed">
                {PAIN_CLOSE}
            </p>
        </section>
    )
}

/* ---------- 4. Módulos por momento ---------- */
function Modulos() {
    const [momento, setMomento] = useState<(typeof MOMENTOS)[number]['id']>('antes')
    const activo = MOMENTOS.find((m) => m.id === momento)!
    const lista = activo.pasos.map((p) => modules.find((m) => m.step === p)!)

    return (
        <section id="m-modulos" data-bloque="modulos" className="scroll-mt-20 px-5 py-14 bg-[#0B0D0E] border-t border-white/5">
            <Icono3D src="/3d/icono-notif.png" w={512} h={376} className="h-12 w-auto mb-3" />
            <Eyebrow>Antes, durante y después de la entrega</Eyebrow>
            <Titulo>Qué automatizamos, momento a momento</Titulo>

            <div role="tablist" className="mt-6 grid grid-cols-3 gap-1.5 rounded-2xl bg-white/[0.04] p-1.5">
                {MOMENTOS.map((m) => (
                    <button
                        key={m.id}
                        role="tab"
                        aria-selected={m.id === momento}
                        onClick={() => setMomento(m.id)}
                        className={`py-2.5 rounded-xl text-[13px] font-semibold transition-colors ${
                            m.id === momento ? 'bg-[#FF5520] text-white' : 'text-neutral-400'
                        }`}
                    >
                        {m.label}
                    </button>
                ))}
            </div>

            <div role="tabpanel" className="mt-4 space-y-3">
                {lista.map((m, i) => {
                    const Demo = m.Demo
                    return (
                        <details
                            key={`${momento}-${m.step}`}
                            open={i === 0}
                            className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#14161A] to-[#0A0C0E] p-4"
                        >
                            <summary className="cursor-pointer list-none flex gap-3.5">
                                <div className="shrink-0 w-14 h-14 rounded-xl bg-white/[0.04] border border-white/10 p-1.5 flex items-center justify-center">
                                    <Icono3D src={m.img} w={m.iw} h={m.ih} className="h-full w-auto" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-heading font-bold text-white leading-snug">
                                            {NOMBRE_CORTO[m.step] ?? m.name}
                                        </h3>
                                        <ChevronDown className="mt-1 w-4 h-4 shrink-0 text-[#FF5520] transition-transform group-open:rotate-180" />
                                    </div>
                                    <p className="mt-1 text-sm text-neutral-400 leading-relaxed">{m.descShort}</p>
                                </div>
                            </summary>
                            <div className="mt-4 space-y-4">
                                <div className="border-l-2 border-[#FF5520] bg-black/50 p-3 rounded-xl">
                                    <p className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#FFA380]">
                                        <Quote className="w-3 h-3" aria-hidden />
                                        Lo que se escucha en el rubro
                                    </p>
                                    <p className="mt-1.5 text-sm italic text-neutral-200 leading-relaxed">{m.quote}</p>
                                </div>
                                {Demo && <Demo />}
                            </div>
                        </details>
                    )
                })}
            </div>
        </section>
    )
}

/* ---------- 5. Calculadora (vive en /diagnostico) ---------- */
function Calculadora() {
    return (
        <section data-bloque="calculadora" className="px-5 py-14 bg-[#0B0D0E] border-t border-white/5">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 overflow-hidden">
                <Image
                    src="/3d/ilustracion-reparto.png"
                    alt=""
                    aria-hidden
                    width={900}
                    height={522}
                    sizes="360px"
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
                    className="mt-5 w-full py-3.5 px-5 bg-[#FF5520] text-white font-heading font-bold rounded-2xl flex items-center justify-center gap-2"
                >
                    Calcular mi costo
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </section>
    )
}

/* ---------- 6. Más módulos ---------- */
function MasModulos() {
    const items = [
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
    return (
        <section id="m-dador" data-bloque="mas_modulos" className="scroll-mt-20 px-5 py-14 bg-[#0B0D0E] border-t border-white/5">
            <Eyebrow>También podés sumar</Eyebrow>
            <div className="mt-4 space-y-3">
                {items.map(({ id, img, etiqueta, nombre, resumen, detalle, Demo }) => (
                    <details key={id} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <summary className="cursor-pointer list-none flex gap-3.5">
                            <Icono3D src={img.src} w={img.w} h={img.h} className="h-14 w-14 shrink-0" />
                            <div className="flex-1">
                                <p className="text-[11px] font-mono uppercase tracking-wider text-[#FFA380]">{etiqueta}</p>
                                <div className="mt-0.5 flex items-center justify-between gap-2">
                                    <h3 className="font-heading font-bold text-white">{nombre}</h3>
                                    <ChevronDown className="w-4 h-4 shrink-0 text-[#FF5520] transition-transform group-open:rotate-180" />
                                </div>
                                <p className="mt-1 text-sm text-neutral-400 leading-relaxed">{resumen}</p>
                            </div>
                        </summary>
                        <div className="mt-4 space-y-4 border-t border-white/5 pt-4">
                            <p className="text-sm text-neutral-300 leading-relaxed">{detalle}</p>
                            {Demo && <Demo />}
                        </div>
                    </details>
                ))}
            </div>
        </section>
    )
}

/* ---------- 7. Confianza ---------- */
function Confianza() {
    return (
        <section data-bloque="confianza" className="px-5 py-14 bg-[#0B0D0E] border-t border-white/5">
            <FounderCard
                frase="Antes de proponerte nada, miramos juntos cuántas entregas te fallan hoy y por qué. Trabajamos mes a mes: si deja de servirte, cortás."
                chips={['Sin permanencia', 'Mes a mes', 'Infraestructura aislada', 'Ley 25.326']}
                whatsappHref={WHATSAPP_HREF}
            />
        </section>
    )
}

/* ---------- 8. Contacto ---------- */
function Contacto() {
    return (
        <section id="m-contacto" data-bloque="contacto" data-contacto className="scroll-mt-20 px-5 py-14 bg-[#0B0D0E] border-t border-white/5">
            <div className="flex flex-col items-center text-center">
                <Icono3D src="/3d/icono-caja-premio.png" w={512} h={479} className="h-24 w-auto" />
                <p className="mt-3 text-sm text-neutral-400">
                    Cada entrega, con estándar de calidad. Eso es lo que{' '}
                    <span className="text-neutral-200">defiende tu reputación</span>.
                </p>
            </div>
            <div className="mt-8">
                <Titulo>¿Lo vemos en tu operación?</Titulo>
                <p className="mt-2 text-sm text-neutral-400">Diagnóstico gratuito de 30 minutos, directo con Gabriel.</p>
            </div>
            <div className="mt-6 space-y-3">
                <a
                    href={WHATSAPP_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-5 bg-[#25D366] text-[#0B0D0E] font-heading font-bold rounded-2xl flex items-center justify-center gap-2"
                >
                    <WhatsappIcon className="w-5 h-5" />
                    Pedir diagnóstico gratuito
                </a>
                <Link
                    href={DIAGNOSTICO_LOGISTICA}
                    className="w-full py-3.5 px-5 rounded-2xl border border-white/15 text-white font-semibold text-sm flex items-center justify-center gap-2"
                >
                    Calcular costo de entregas fallidas (2 min)
                </Link>
            </div>
            <p className="mt-4 text-center text-xs text-neutral-500">
                Planes desde $160.000/mes + IVA según volumen de guías.
            </p>
        </section>
    )
}

function Footer() {
    return (
        <footer className="px-5 pt-8 pb-28 bg-[#0B0D0E] border-t border-white/10">
            <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-neutral-400">
                <Link href="/">Volver al inicio</Link>
                <Link href="/legal#privacidad">Privacidad</Link>
                <Link href="/legal#terminos">Términos</Link>
            </div>
            <p className="mt-6 text-xs text-neutral-600">© {new Date().getFullYear()} INDIVIDRA · Buenos Aires</p>
        </footer>
    )
}

export function LogisticaMobile() {
    const rootRef = useRef<HTMLDivElement>(null)
    const barraVisible = useMobilePage(rootRef, 'logistica')

    return (
        <div ref={rootRef} className="md:hidden">
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
    )
}
