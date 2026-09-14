'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'
import { Rocket, XCircle, CheckCircle2 } from 'lucide-react'

const features = [
    {
        name: 'El Cerebro (Bot)',
        saas: 'Plantilla básica con respuestas pre-armadas.',
        individra: 'Entrenado específicamente con tu catálogo, reglas de negocio y tono de voz.',
    },
    {
        name: 'Integraciones',
        saas: 'Cerradas. No se conectan con tu sistema actual.',
        individra: 'Conectamos WhatsApp con tu ERP, base de datos SQL, Excel o CRMs existentes.',
    },
    {
        name: 'Dueño de los Datos',
        saas: 'Ellos. Tus datos viven en su nube, mezclados con los de todos, y pueden entrenar sus modelos.',
        individra: 'Vos. Corre en infraestructura propia y aislada en Alemania (GDPR): tus datos no se mezclan con los de nadie. No entrenamos modelos con tus datos, y los proveedores que usamos tampoco lo hacen por contrato. Portabilidad garantizada: si te vas, te los llevás.',
    },
    {
        name: 'Lógica de Negocio',
        saas: 'Se confunden, alucinan y no siguen procesos estrictos.',
        individra: 'Diseñamos "Caminos de hierro". El bot no avanza si el cliente no cumple los requisitos.',
    },
    {
        name: 'Acompañamiento',
        saas: 'Tickets de soporte genéricos.',
        individra: 'Acompañamiento técnico humano constante y soporte proactivo mensual.',
    },
]

export function ComparativeSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start']
    })

    const y = useTransform(scrollYProgress, [0, 1], [50, -50])
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

    return (
        <section ref={sectionRef} className="relative py-24 lg:py-32 bg-[#0B0D0E] overflow-hidden" id="comparativa">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C84214]/5 via-[#0B0D0E] to-[#0B0D0E] pointer-events-none" />

            <motion.div
                style={{ y, opacity }}
                className="relative z-10 max-w-7xl mx-auto px-6"
            >
                <div className="text-center mb-16 lg:mb-24">
                    {/* Icono 3D de marca, sin fondo */}
                    <motion.div
                        initial={{ opacity: 0, y: 14, scale: 0.9 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-4 flex justify-center"
                    >
                        <Image
                            src="/3d/icono-comparativa.png"
                            alt=""
                            aria-hidden
                            width={224}
                            height={224}
                            className="h-16 w-auto object-contain drop-shadow-[0_12px_26px_rgba(200,66,20,0.3)] sm:h-[72px]"
                        />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#E8E5DE]"
                    >
                        Por qué las empresas serias eligen <br className="hidden sm:block" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C84214] to-[#B7B3B0]">Arquitectura a Medida</span>
                    </motion.h2>
                </div>

                <div className="pb-8">
                    <div className="w-full bg-[#222120]/90 backdrop-blur-sm border border-[#3E3D3A] rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
                        {/* Headers Group */}
                        <div className="flex flex-col md:grid md:grid-cols-12 bg-[#1E1D1C] border-b border-[#3E3D3A]">
                            {/* Empty space for trait name on desktop, hidden on mobile for headers */}
                            <div className="hidden md:flex md:col-span-3 lg:col-span-4 p-4 lg:p-6 items-center">
                                <span className="text-lg font-semibold text-[#B7B3B0]">Característica</span>
                            </div>

                            <div className="flex md:contents border-b md:border-b-0 border-[#3E3D3A]">
                                <div className="flex-1 md:col-span-4 p-4 lg:p-6 md:border-l border-[#3E3D3A] flex flex-col items-center justify-center text-center bg-red-950/10">
                                    <XCircle className="w-6 h-6 lg:w-8 lg:h-8 text-neutral-500 mb-2" />
                                    <span className="text-sm lg:text-lg font-medium text-neutral-400">SaaS Genéricos</span>
                                </div>
                                <div className="flex-1 md:col-span-5 lg:col-span-4 p-4 lg:p-6 border-l border-[#3E3D3A] flex flex-col items-center justify-center text-center bg-[#C84214]/10 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-[#C84214]" />
                                    <Rocket className="w-6 h-6 lg:w-8 lg:h-8 text-[#C84214] mb-2" />
                                    <span className="text-sm lg:text-lg font-bold text-[#E8E5DE] tracking-wide">INDIVIDRA</span>
                                </div>
                            </div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-[#3E3D3A]">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex flex-col md:grid md:grid-cols-12 hover:bg-white/[0.02] transition-colors"
                                >
                                    <div className="md:col-span-3 lg:col-span-4 p-4 lg:p-6 flex items-center justify-center md:justify-start bg-neutral-900/50 md:bg-transparent">
                                        <span className="text-sm lg:text-base font-semibold text-neutral-200 text-center md:text-left">{feature.name}</span>
                                    </div>
                                    <div className="flex md:contents">
                                        <div className="flex-1 md:col-span-4 p-4 lg:p-6 md:border-l border-[#3E3D3A] flex items-center bg-red-950/5">
                                            <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed text-center w-full md:text-left">{feature.saas}</p>
                                        </div>
                                        <div className="flex-1 md:col-span-5 lg:col-span-4 p-4 lg:p-6 border-l border-[#3E3D3A] flex flex-col md:flex-row items-center bg-[#C84214]/5 relative">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mb-2 md:mb-0 md:mr-3 md:absolute md:top-6 md:left-6 opacity-60" />
                                            <p className="text-[#E8E5DE] text-xs sm:text-sm md:pl-8 leading-relaxed font-medium text-center md:text-left">{feature.individra}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
