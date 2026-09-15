'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { Bot, Zap, Network } from 'lucide-react'
import { useRef } from 'react'
import { MobileServicesBackground } from '@/components/ui/MobileBackgroundEffects'

/**
 * Servicios presentados como un canvas de nodos (lenguaje n8n): cada servicio es
 * un nodo de borde punteado con puertos, y las aristas los conectan con flujo
 * animado.
 *
 * Reemplaza el borde "eléctrico" anterior, que usaba 4 feTurbulence
 * (numOctaves=10) + feDisplacementMap por tarjeta: ruido Perlin calculado por
 * píxel y por frame, lo más caro de la página después del 3D — tanto que
 * necesitaba una versión mobile aparte para ser viable. Acá no hay filtros:
 * borde, punteado y transform/opacity.
 */

const services = [
    {
        icon: Zap,
        title: 'Automatización Inteligente',
        description: 'Eliminamos tareas repetitivas de tu día a día. Desde responder consultas en WhatsApp hasta procesar documentos automáticamente.',
    },
    {
        icon: Bot,
        title: 'Agentes y Asistentes IA',
        description: 'Creamos asistentes virtuales personalizados. Chatbots que entienden tu negocio, califican leads y agendan citas.',
    },
    {
        icon: Network,
        title: 'Orquestación de Agentes IA',
        description: 'Coordinamos múltiples sistemas de Inteligencia Artificial que colaboran entre sí para automatizar flujos de trabajo en toda tu empresa.',
    },
]

/* Puerto de conexión del nodo, como los de n8n */
function Port({ className }: { className?: string }) {
    return (
        <span
            aria-hidden
            className={`absolute z-10 w-2.5 h-2.5 rounded-full border border-[#C84214]/60 bg-[#222120] transition-colors duration-300 group-hover:bg-[#C84214]/80 ${className}`}
        />
    )
}

/* Arista entre nodos, con flujo animado */
function Edge({ vertical = false }: { vertical?: boolean }) {
    const reduce = useReducedMotion()
    return (
        <svg
            aria-hidden
            viewBox={vertical ? '0 0 24 48' : '0 0 48 24'}
            className={vertical ? 'w-6 h-12 shrink-0' : 'w-12 h-6 shrink-0'}
        >
            <path
                d={vertical ? 'M12 0 L12 48' : 'M0 12 L48 12'}
                stroke="rgba(200,66,20,0.45)"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="3 5"
                strokeLinecap="round"
            >
                {!reduce && (
                    <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1.4s" repeatCount="indefinite" />
                )}
            </path>
        </svg>
    )
}

function ServiceNode({ service, index }: { service: (typeof services)[number]; index: number }) {
    const Icon = service.icon
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
            className="group relative flex-1 min-w-0 rounded-xl border border-[#3E3D3A] bg-[#222120] p-6 lg:p-7 transition-colors duration-300 hover:border-[#C84214]/50 shadow-sm"
        >
            {/* Textura de canvas */}
            <div
                aria-hidden
                className="absolute inset-0 rounded-xl bg-[radial-gradient(rgba(183,179,176,0.05)_1px,transparent_1px)] bg-[size:14px_14px]"
            />
            {/* Glow contenido, solo al hover */}
            <div
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'radial-gradient(circle at 50% 0%, rgba(200,66,20,0.12), transparent 70%)' }}
            />

            {/* Puertos: entrada/salida a los lados en desktop, arriba/abajo en mobile */}
            <Port className="hidden lg:block -left-[5px] top-1/2 -translate-y-1/2" />
            <Port className="hidden lg:block -right-[5px] top-1/2 -translate-y-1/2" />
            <Port className="lg:hidden -top-[5px] left-1/2 -translate-x-1/2" />
            <Port className="lg:hidden -bottom-[5px] left-1/2 -translate-x-1/2" />

            <div className="relative">
                <div className="w-10 h-10 rounded-lg border border-[#C84214]/30 bg-[#C84214]/10 flex items-center justify-center transition-colors duration-300 group-hover:border-[#C84214]/60">
                    <Icon className="w-5 h-5 text-[#C84214]" />
                </div>
                <h3 className="mt-5 text-lg lg:text-xl font-bold text-[#E8E5DE]">{service.title}</h3>
                <p className="mt-2.5 text-[#B7B3B0] text-sm leading-relaxed">{service.description}</p>
            </div>
        </motion.div>
    )
}

export function ServicesSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    })

    const backgroundY = useTransform(scrollYProgress, [0, 1], [100, -100])
    const lineWidth = useTransform(scrollYProgress, [0, 0.5], ['0%', '100%'])

    return (
        <section ref={sectionRef} id="servicios" className="relative py-24 lg:py-32 bg-[#0B0D0E] overflow-hidden">
            {/* Mobile animated background */}
            <MobileServicesBackground />

            {/* Background Effects */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C84214]/5 via-transparent to-transparent"
            />

            {/* Animated line */}
            <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
                <motion.div
                    style={{ width: lineWidth }}
                    className="h-full bg-gradient-to-r from-transparent via-[#C84214] to-transparent mx-auto"
                />
            </div>

            <div className="relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12 lg:mb-16 px-6">
                    {/* Icono 3D de marca, sin fondo */}
                    <div className="mb-3 flex justify-center">
                        <Image
                            src="/3d/icono-cinta.png"
                            alt=""
                            aria-hidden
                            width={512}
                            height={498}
                            quality={95}
                            className="h-16 w-auto object-contain drop-shadow-[0_12px_26px_rgba(200,66,20,0.3)] sm:h-[72px]"
                        />
                    </div>
                    <span className="inline-block text-[#B7B3B0] text-sm font-semibold uppercase tracking-widest">
                        Nuestros Servicios
                    </span>
                    <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-[#E8E5DE]">
                        Servicios que{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C84214] via-[#D44A17] to-[#B7B3B0]">
                            impulsan tu negocio
                        </span>
                    </h2>
                    <p className="mt-6 text-[#B7B3B0] text-base lg:text-lg max-w-2xl mx-auto">
                        Diseñamos ecosistemas avanzados de Inteligencia Artificial y automatización
                        para crear soluciones personalizadas que escalan y transforman tu operación.
                    </p>
                </div>

                {/* Canvas de nodos */}
                <div className="max-w-7xl mx-auto px-6">
                    {/* Desktop: nodos en fila, conectados */}
                    <div className="hidden lg:flex items-stretch justify-center">
                        {services.map((service, index) => (
                            <div key={index} className="contents">
                                {index > 0 && (
                                    <div className="flex items-center shrink-0">
                                        <Edge />
                                    </div>
                                )}
                                <ServiceNode service={service} index={index} />
                            </div>
                        ))}
                    </div>

                    {/* Mobile: columna única, conectada en vertical */}
                    <div className="lg:hidden flex flex-col items-stretch max-w-md mx-auto">
                        {services.map((service, index) => (
                            <div key={index} className="contents">
                                {index > 0 && (
                                    <div className="flex justify-center shrink-0">
                                        <Edge vertical />
                                    </div>
                                )}
                                <ServiceNode service={service} index={index} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
