'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import {
    FileDown,
    MapPinCheck,
    BellRing,
    LifeBuoy,
    FileCheck2,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    Terminal,
    CheckCircle2,
} from 'lucide-react'

const workflowSteps = [
    {
        id: '01',
        title: 'Ingesta de pedidos automática',
        subtitle: 'ERPs & Marketplaces',
        desc: 'Tus pedidos ingresan directamente desde Tango Gestión, Bejerman, Tiendanube, MercadoLibre o un Excel de despacho. Cero carga manual.',
        icon: FileDown,
        tag: 'Sin data entry',
        pipeline: 'Tango / ML / Sheets ➔ Webhooks ➔ Ingesta Central',
        telemetry: 'DATA ENTRY ELIMINADO · 0.0s LATENCIA',
    },
    {
        id: '02',
        title: 'Adiós a direcciones incorrectas',
        subtitle: 'Geolocalización & Validación',
        desc: 'El sistema valida y normaliza las direcciones con Google Maps antes de armar la ruta. Si la altura es dudosa, el bot le consulta al destinatario antes de que el camión salga.',
        icon: MapPinCheck,
        tag: 'Antes del despacho',
        pipeline: 'Dirección Cruda ➔ Maps API ➔ Geocerca Validada',
        telemetry: 'GEOCERCA 100% · CERO VIAJES EN VANO',
    },
    {
        id: '03',
        title: 'Aviso proactivo al destinatario',
        subtitle: 'WhatsApp Cloud API',
        desc: 'Avisos automáticos por WhatsApp con ventana horaria estimada: "Tu pedido llega entre las 14 y 16 hs". El cliente prepara la recepción o avisa si no va a estar.',
        icon: BellRing,
        tag: 'WhatsApp oficial',
        pipeline: 'Despacho Activo ➔ Mensaje Oficial WABA ➔ Confirmación',
        telemetry: '94% TASA DE APERTURA EN <5 MIN',
    },
    {
        id: '04',
        title: 'Agente de rescate en calle',
        subtitle: 'Resolución de Excepciones',
        desc: '¿El chofer llegó y no hay nadie? El agente contacta al cliente al instante por WhatsApp o llamada de voz para reprogramar o coordinar entrega con un vecino.',
        icon: LifeBuoy,
        tag: 'Recupera la entrega',
        pipeline: 'Parada en Destino ➔ Sin Timbre ➔ Protocolo Rescate',
        telemetry: '82% ENTREGAS SALVADAS EN EL ACTO',
    },
    {
        id: '05',
        title: 'Conciliación y cierre de remito',
        subtitle: 'OCR & Asiento Contable',
        desc: 'Foto del remito firmado procesada por OCR en 2.4 segundos. El asiento contable y la conformidad de entrega se actualizan en tu sistema en el acto.',
        icon: FileCheck2,
        tag: 'OCR · 2.4s',
        pipeline: 'Foto Celular ➔ OCR Neuronal ➔ Asiento en ERP',
        telemetry: 'REMISTO CERRADO EN 2.4s · CERO PAPELES',
    },
]

function DesktopStep({ step, index }: { step: (typeof workflowSteps)[number]; index: number }) {
    const Icon = step.icon
    return (
        <motion.li
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
            className="group relative flex gap-5 pb-10 last:pb-0"
        >
            {/* Nodo sobre el riel */}
            <div className="relative z-10 shrink-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#3E3D3A] bg-[#121316] text-[#8E8B88] transition-all duration-300 group-hover:border-[#C84214] group-hover:text-[#FFA380] group-hover:shadow-[0_0_20px_-4px_rgba(200,66,20,0.6)]">
                    <Icon className="h-[18px] w-[18px]" />
                </div>
            </div>

            <div className="min-w-0 pt-0.5">
                <div className="mb-1.5 flex items-center gap-2.5">
                    <span className="font-mono text-[11px] font-semibold tracking-[0.18em] text-[#C84214]">
                        {step.id}
                    </span>
                    <span className="h-px w-4 bg-[#3E3D3A]" />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                        {step.tag}
                    </span>
                </div>
                <h3 className="text-lg font-bold leading-snug text-white transition-colors duration-300 group-hover:text-[#FFA380] sm:text-xl">
                    {step.title}
                </h3>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-neutral-300">
                    {step.desc}
                </p>
                {/* Telemetría técnica industrial */}
                <div className="mt-2.5 inline-flex items-center gap-2 rounded border border-[#2E3035] bg-[#16181B] px-2.5 py-1 text-[11px] font-mono text-neutral-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C84214] animate-pulse" />
                    <span className="text-[#E8E5DE] font-medium">{step.pipeline}</span>
                </div>
            </div>
        </motion.li>
    )
}

export function ProcessWorkflowSection() {
    const railRef = useRef<HTMLDivElement>(null)
    const [mobileStepIndex, setMobileStepIndex] = useState(0)

    const { scrollYProgress } = useScroll({
        target: railRef,
        offset: ['start 80%', 'end 60%'],
    })
    const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 })
    const fillHeight = useTransform(fill, (v) => `${v * 100}%`)

    const activeStep = workflowSteps[mobileStepIndex]
    const ActiveIcon = activeStep.icon

    return (
        <section
            id="proceso-operativo"
            className="relative overflow-hidden border-t border-[#3E3D3A]/40 bg-[#0E1012] py-16 sm:py-24"
        >
            {/* Background subtle atmospheric gradient */}
            <div
                aria-hidden
                className="pointer-events-none absolute -right-40 top-24 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(200,66,20,0.08)_0%,transparent_70%)] blur-3xl"
            />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
                {/* Header de la sección */}
                <div className="mb-10 sm:mb-14">
                    <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-[#C84214] sm:text-sm">
                        El circuito operativo INDIVIDRA
                    </span>
                    <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-white max-w-2xl">
                        De la orden al remito cerrado{' '}
                        <span className="bg-gradient-to-r from-[#C84214] to-[#B7B3B0] bg-clip-text text-transparent">
                            en 5 pasos automatizados
                        </span>
                    </h2>
                    <p className="mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-[#B7B3B0]">
                        Así fluye la información en tu empresa sin que tu equipo tenga que pasar
                        el día haciendo tareas repetitivas o llamando a choferes.
                    </p>
                </div>

                {/* =======================================================
                    MOBILE VIEW: INTERACTIVE PIPELINE STEPPER (CERO FALLOS)
                   ======================================================= */}
                <div className="lg:hidden">
                    {/* Stepper Tabs - Desplazables horizontalmente */}
                    <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none -mx-4 px-4">
                        {workflowSteps.map((step, idx) => {
                            const isCurrent = idx === mobileStepIndex
                            return (
                                <button
                                    key={step.id}
                                    onClick={() => setMobileStepIndex(idx)}
                                    className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs transition-all duration-200 cursor-pointer ${
                                        isCurrent
                                            ? 'bg-[#C84214] text-white shadow-lg shadow-[#C84214]/25 font-bold'
                                            : 'bg-[#15171A] text-neutral-400 border border-[#2E3035] hover:border-[#3E3D3A] hover:text-white'
                                    }`}
                                >
                                    <span className={isCurrent ? 'text-white' : 'text-[#C84214]'}>
                                        {step.id}
                                    </span>
                                    <span>{step.tag}</span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Active Step Card */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStep.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.25 }}
                            className="rounded-2xl border border-[#2E3035] bg-[#14161A] p-5 shadow-xl relative overflow-hidden"
                        >
                            {/* Accent bar top */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C84214] via-[#D44A17] to-transparent" />

                            {/* Header del card */}
                            <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#26282C]">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#3E3D3A] bg-[#1B1D21] text-[#FFA380]">
                                        <ActiveIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-mono text-[11px] font-semibold tracking-wider text-[#C84214]">
                                            PASO {activeStep.id} DE 05
                                        </div>
                                        <div className="text-xs font-mono text-neutral-400">
                                            {activeStep.subtitle}
                                        </div>
                                    </div>
                                </div>
                                <span className="rounded border border-[#3E3D3A] bg-[#1E2024] px-2 py-0.5 font-mono text-[10px] text-neutral-300">
                                    {activeStep.tag}
                                </span>
                            </div>

                            {/* Título y Descripción */}
                            <div className="py-4">
                                <h3 className="text-lg font-bold text-white leading-snug">
                                    {activeStep.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                                    {activeStep.desc}
                                </p>
                            </div>

                            {/* Live Pipeline Telemetry Box */}
                            <div className="rounded-xl border border-[#2E3035] bg-[#0E1012] p-3 text-xs font-mono">
                                <div className="flex items-center gap-2 text-[#C84214] font-semibold text-[11px] mb-1">
                                    <Terminal className="h-3.5 w-3.5" />
                                    CIRCUITO AUTÓNOMO
                                </div>
                                <div className="text-neutral-300 text-[11px] leading-relaxed">
                                    {activeStep.pipeline}
                                </div>
                                <div className="mt-2 pt-2 border-t border-[#26282C] flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                                    <CheckCircle2 className="h-3 w-3" />
                                    <span>{activeStep.telemetry}</span>
                                </div>
                            </div>

                            {/* Controles Prev / Next */}
                            <div className="mt-5 flex items-center justify-between pt-2 border-t border-[#26282C]">
                                <button
                                    onClick={() => setMobileStepIndex(Math.max(0, mobileStepIndex - 1))}
                                    disabled={mobileStepIndex === 0}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2E3035] bg-[#1B1D21] text-xs font-mono text-neutral-300 disabled:opacity-30 cursor-pointer"
                                >
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                    Anterior
                                </button>
                                <div className="flex gap-1.5">
                                    {workflowSteps.map((_, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setMobileStepIndex(i)}
                                            className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                                                i === mobileStepIndex ? 'w-5 bg-[#C84214]' : 'w-1.5 bg-[#3E3D3A]'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={() => setMobileStepIndex(Math.min(workflowSteps.length - 1, mobileStepIndex + 1))}
                                    disabled={mobileStepIndex === workflowSteps.length - 1}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2E3035] bg-[#1B1D21] text-xs font-mono text-neutral-300 disabled:opacity-30 cursor-pointer"
                                >
                                    Siguiente
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* =======================================================
                    DESKTOP VIEW: STICKY NARRATIVE + CONNECTED RAIL
                   ======================================================= */}
                <div className="hidden lg:grid lg:grid-cols-[0.82fr_1fr] lg:gap-20">
                    {/* Columna izquierda: relato + hub 3D (sticky en desktop) */}
                    <div className="lg:sticky lg:top-28 lg:self-start">
                        <div className="rounded-2xl border border-[#2E3035] bg-[#14161A] p-6">
                            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#C84214]">
                                Arquitectura Hub &amp; Spoke
                            </span>
                            <h4 className="mt-2 text-lg font-bold text-white">
                                Sincronización en Tiempo Real
                            </h4>
                            <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                                Un único núcleo automatizado orquesta tus depósitos, la flota en calle, el ERP de administración y cada cliente final sin llamadas telefónicas ni carga manual.
                            </p>

                            <div className="mt-6 flex flex-col gap-2.5 font-mono text-xs text-neutral-400">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                    <span>Tango &amp; Bejerman ERP Sync: Activo</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                    <span>Google Maps Geocoding: Activo</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-[#C84214]" />
                                    <span>WhatsApp Cloud WABA: En Línea 24/7</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha: riel con progreso ligado al scroll */}
                    <div ref={railRef} className="relative">
                        {/* riel base */}
                        <div
                            aria-hidden
                            className="absolute bottom-11 left-[22px] top-4 w-px bg-[#3E3D3A]/70"
                        />
                        {/* progreso */}
                        <motion.div
                            aria-hidden
                            style={{ height: fillHeight }}
                            className="absolute left-[22px] top-4 w-px bg-gradient-to-b from-[#C84214] via-[#E85D04] to-[#C84214]/20 shadow-[0_0_12px_rgba(200,66,20,0.8)]"
                        />

                        <ol className="relative">
                            {workflowSteps.map((step, i) => (
                                <DesktopStep key={step.id} step={step} index={i} />
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </section>
    )
}
