'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import {
    FileDown,
    MapPinCheck,
    BellRing,
    LifeBuoy,
    FileCheck2,
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
        telemetry: 'SIN CARGA MANUAL · SIN ERRORES DE TIPEO',
    },
    {
        id: '02',
        title: 'Adiós a direcciones incorrectas',
        subtitle: 'Geolocalización & Validación',
        desc: 'El sistema valida y normaliza las direcciones con Google Maps antes de armar la ruta. Si la altura es dudosa, el bot le consulta al destinatario antes de que el camión salga.',
        icon: MapPinCheck,
        tag: 'Antes del despacho',
        pipeline: 'Dirección Cruda ➔ Maps API ➔ Geocerca Validada',
        telemetry: 'DIRECCIÓN VALIDADA ANTES DE CARGAR EL CAMIÓN',
    },
    {
        id: '03',
        title: 'Aviso proactivo al destinatario',
        subtitle: 'WhatsApp Cloud API',
        desc: 'Avisos automáticos por WhatsApp con la posición real de la ruta: "Tu pedido está a 2 paradas". Sin horarios inventados que después no se cumplen. El destinatario prepara la recepción o avisa si no va a estar.',
        icon: BellRing,
        tag: 'WhatsApp oficial',
        pipeline: 'Avance de Ruta ➔ Mensaje Oficial WABA ➔ Confirmación',
        telemetry: 'PARADAS REALES · NUNCA UNA FRANJA INVENTADA',
    },
    {
        id: '04',
        title: 'Agente de rescate en calle',
        subtitle: 'Resolución de Excepciones',
        desc: '¿El chofer llegó y no hay nadie? El agente contacta al destinatario al instante por WhatsApp para reprogramar o coordinar la entrega con un vecino, mientras el camión todavía está en la puerta.',
        icon: LifeBuoy,
        tag: 'Recupera la entrega',
        pipeline: 'Parada en Destino ➔ Sin Timbre ➔ Protocolo Rescate',
        telemetry: 'SE RESUELVE EN LA PUERTA · NO AL DÍA SIGUIENTE',
    },
    {
        id: '05',
        title: 'Conciliación y cierre de remito',
        subtitle: 'OCR & Asiento Contable',
        desc: 'El chofer saca una foto del remito firmado y el OCR extrae los datos. El asiento contable y la conformidad de entrega quedan listos para revisar en tu sistema, sin tipear nada a mano.',
        icon: FileCheck2,
        tag: 'OCR del remito',
        pipeline: 'Foto Celular ➔ OCR ➔ Asiento en ERP',
        telemetry: 'DEL PAPEL AL ERP SIN TIPEAR',
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

    const { scrollYProgress } = useScroll({
        target: railRef,
        offset: ['start 80%', 'end 60%'],
    })
    const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 })
    const fillHeight = useTransform(fill, (v) => `${v * 100}%`)

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
                    <Image
                        src="/3d/icono-mapa.png"
                        alt=""
                        aria-hidden
                        width={512}
                        height={478}
                        quality={95}
                        className="mb-3 h-14 w-auto object-contain drop-shadow-[0_14px_30px_rgba(200,66,20,0.28)] sm:h-16"
                    />
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
                    MOBILE VIEW: misma narrativa que desktop — línea de tiempo
                    vertical con los 5 pasos y el hub 3D al final.
                   ======================================================= */}
                <div className="lg:hidden">
                    {/* Riel con la línea de tiempo (mismos nodos que desktop) */}
                    <div className="relative">
                        <div
                            aria-hidden
                            className="absolute left-[22px] top-4 bottom-10 w-px bg-gradient-to-b from-[#C84214] via-[#E85D04]/50 to-[#3E3D3A]/40 shadow-[0_0_12px_rgba(200,66,20,0.4)]"
                        />
                        <ol className="relative">
                            {workflowSteps.map((step, i) => (
                                <DesktopStep key={step.id} step={step} index={i} />
                            ))}
                        </ol>
                    </div>

                    {/* Hub 3D al final, con el mismo pie que en desktop */}
                    <div className="mt-8 flex flex-col items-center text-center">
                        <Image
                            src="/logistics_hub_3d.png"
                            alt="Hub de distribución inteligente de INDIVIDRA"
                            width={560}
                            height={543}
                            className="w-full max-w-[280px] object-contain drop-shadow-[0_20px_44px_rgba(200,66,20,0.28)]"
                        />
                        <div className="mt-4 max-w-[340px] border-l-2 border-[#C84214]/60 pl-4 text-left">
                            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#C84214]">
                                Arquitectura Hub &amp; Spoke
                            </span>
                            <p className="mt-1.5 text-sm leading-relaxed text-neutral-300">
                                Un nodo orquesta en tiempo real tus depósitos, la flota en calle,
                                el ERP de administración y cada cliente final sin llamadas ni carga manual.
                            </p>
                        </div>
                    </div>
                </div>

                {/* =======================================================
                    DESKTOP VIEW: STICKY NARRATIVE + CONNECTED RAIL
                   ======================================================= */}
                <div className="hidden lg:grid lg:grid-cols-[0.82fr_1fr] lg:gap-20">
                    {/* Columna izquierda: hub 3D (sticky en desktop) */}
                    <div className="lg:sticky lg:top-28 lg:self-start">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="relative"
                        >
                            <Image
                                src="/logistics_hub_3d.png"
                                alt="Hub de distribución inteligente de INDIVIDRA"
                                width={560}
                                height={543}
                                className="w-full max-w-[420px] object-contain drop-shadow-[0_24px_50px_rgba(200,66,20,0.28)]"
                            />
                            <div className="mt-4 max-w-[380px] border-l-2 border-[#C84214]/60 pl-4">
                                <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#C84214]">
                                    Arquitectura Hub &amp; Spoke
                                </span>
                                <p className="mt-1.5 text-sm leading-relaxed text-neutral-300">
                                    Un nodo orquesta en tiempo real tus depósitos, la flota en calle,
                                    el ERP de administración y cada cliente final sin llamadas ni carga manual.
                                </p>
                            </div>
                        </motion.div>
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
