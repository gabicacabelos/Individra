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
        desc: 'Tus pedidos ingresan directamente desde Tango Gestión, Bejerman, Tiendanube, MercadoLibre o un Excel de despacho. Cero carga manual.',
        icon: FileDown,
        tag: 'Sin data entry',
    },
    {
        id: '02',
        title: 'Adiós a direcciones incorrectas',
        desc: 'El sistema valida y normaliza las direcciones con Google Maps antes de armar la ruta. Si la altura es dudosa, el bot le consulta al destinatario antes de que el camión salga.',
        icon: MapPinCheck,
        tag: 'Antes del despacho',
    },
    {
        id: '03',
        title: 'Aviso proactivo al destinatario',
        desc: 'Avisos automáticos por WhatsApp con ventana horaria estimada: "Tu pedido llega entre las 14 y 16 hs". El cliente prepara la recepción o avisa si no va a estar.',
        icon: BellRing,
        tag: 'WhatsApp oficial',
    },
    {
        id: '04',
        title: 'Agente de rescate en calle',
        desc: '¿El chofer llegó y no hay nadie? El agente contacta al cliente al instante por WhatsApp o llamada de voz para reprogramar o coordinar entrega con un vecino.',
        icon: LifeBuoy,
        tag: 'Recupera la entrega',
    },
    {
        id: '05',
        title: 'Conciliación y cierre de remito',
        desc: 'Foto del remito firmado procesada por OCR en 2.4 segundos. El asiento contable y la conformidad de entrega se actualizan en tu sistema en el acto.',
        icon: FileCheck2,
        tag: 'OCR · 2.4s',
    },
]

function Step({ step, index }: { step: (typeof workflowSteps)[number]; index: number }) {
    const Icon = step.icon
    return (
        <motion.li
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className="group relative flex gap-5 pb-11 last:pb-0"
        >
            {/* Nodo sobre el riel */}
            <div className="relative z-10 shrink-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#3E3D3A] bg-[#121316] text-[#8E8B88] transition-all duration-300 group-hover:border-[#C84214] group-hover:text-[#FFA380] group-hover:shadow-[0_0_22px_-4px_rgba(200,66,20,0.65)]">
                    <Icon className="h-[18px] w-[18px]" />
                </div>
            </div>

            <div className="min-w-0 pt-1">
                <div className="mb-1.5 flex items-center gap-2.5">
                    <span className="font-mono text-[11px] font-semibold tracking-[0.18em] text-[#C84214]">
                        {step.id}
                    </span>
                    <span className="h-px w-4 bg-[#3E3D3A]" />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                        {step.tag}
                    </span>
                </div>
                <h3 className="text-lg font-bold leading-snug text-white transition-colors duration-300 group-hover:text-[#FFA380] sm:text-xl">
                    {step.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-400">
                    {step.desc}
                </p>
            </div>
        </motion.li>
    )
}

export function ProcessWorkflowSection() {
    const railRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: railRef,
        offset: ['start 72%', 'end 62%'],
    })
    const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 })
    const fillHeight = useTransform(fill, (v) => `${v * 100}%`)

    return (
        <section
            id="proceso-operativo"
            className="relative overflow-hidden border-t border-[#3E3D3A]/40 bg-[#0E1012] py-24"
        >
            <div
                aria-hidden
                className="pointer-events-none absolute -right-40 top-24 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(200,66,20,0.10)_0%,transparent_70%)] blur-3xl"
            />

            <div className="relative z-10 mx-auto max-w-7xl px-6">
                <div className="grid gap-14 lg:grid-cols-[0.82fr_1fr] lg:gap-20">
                    {/* Columna izquierda: relato + hub 3D (sticky en desktop) */}
                    <div className="lg:sticky lg:top-28 lg:self-start">
                        <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-[#C84214] sm:text-sm">
                            El circuito operativo INDIVIDRA
                        </span>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            De la orden al remito cerrado{' '}
                            <span className="bg-gradient-to-r from-[#C84214] to-[#B7B3B0] bg-clip-text text-transparent">
                                en 5 pasos automatizados
                            </span>
                        </h2>
                        <p className="mt-4 max-w-md text-base leading-relaxed text-[#B7B3B0]">
                            Así fluye la información en tu empresa sin que tu equipo tenga que pasar
                            el día haciendo tareas repetitivas o llamando a choferes.
                        </p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.94 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="relative mt-10 hidden lg:block"
                        >
                            <Image
                                src="/logistics_hub_3d.png"
                                alt="Hub de distribución inteligente de INDIVIDRA"
                                width={560}
                                height={543}
                                className="w-full max-w-[380px] object-contain drop-shadow-[0_24px_50px_rgba(200,66,20,0.28)]"
                            />
                            <div className="mt-2 max-w-[380px] border-l-2 border-[#C84214]/60 pl-4">
                                <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#C84214]">
                                    Arquitectura Hub &amp; Spoke
                                </span>
                                <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">
                                    Un nodo orquesta en tiempo real tus depósitos, la flota en calle,
                                    el ERP de administración y cada cliente final.
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
                                <Step key={step.id} step={step} index={i} />
                            ))}
                        </ol>

                        {/* Imagen del hub en mobile, al cierre del circuito */}
                        <div className="mt-10 flex flex-col items-center lg:hidden">
                            <Image
                                src="/logistics_hub_3d.png"
                                alt="Hub de distribución inteligente de INDIVIDRA"
                                width={420}
                                height={407}
                                className="w-full max-w-[260px] object-contain drop-shadow-[0_20px_40px_rgba(200,66,20,0.28)]"
                            />
                            <span className="mt-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-[#C84214]">
                                Arquitectura Hub &amp; Spoke
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
