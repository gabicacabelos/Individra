'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Factory, ShieldCheck, Cpu } from 'lucide-react'

const differentiators = [
    {
        icon: Factory,
        accentRgb: '183, 179, 176',
        label: 'Dominio',
        title: 'Venimos de adentro de la logística automotriz',
        description:
            'Operamos logística industrial real dentro del ecosistema Peugeot–Stellantis. Conocemos los tiempos y las exigencias por haberlos vivido, no por leerlos en un manual.',
    },
    {
        icon: ShieldCheck,
        accentRgb: '16, 185, 129',
        label: 'Soberanía de datos',
        title: 'Tus datos, en Alemania y bajo GDPR',
        description:
            'Infraestructura propia y aislada por cliente. No entrenamos modelos con tus datos, y los proveedores que usamos tampoco por contrato. Si te vas, te los llevás.',
    },
    {
        icon: Cpu,
        accentRgb: '200, 66, 20',
        label: 'Método',
        title: 'No vendemos magia. Vendemos ingeniería.',
        description:
            'Cada sistema se diseña, se documenta y se mantiene como infraestructura crítica de tu empresa, con acompañamiento técnico humano todos los meses.',
    },
]

export function DifferentiatorsSection() {
    return (
        <section id="diferenciadores" className="relative overflow-hidden bg-[#0B0D0E] py-16 lg:py-24">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#363533]/15 via-transparent to-transparent" />

            <div className="relative z-10 mx-auto max-w-6xl px-6">
                {/* Header compacto y centrado, con ícono clay de marca */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    className="mb-10 flex flex-col items-center text-center lg:mb-14"
                >
                    <Image
                        src="/3d/icono-trofeo.png"
                        alt=""
                        aria-hidden
                        width={509}
                        height={512}
                        quality={95}
                        className="mb-3 h-14 w-auto object-contain drop-shadow-[0_12px_26px_rgba(200,66,20,0.3)] sm:h-16"
                    />
                    <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-[#B7B3B0] sm:text-sm">
                        Por qué INDIVIDRA
                    </span>
                    <h2 className="mt-3 max-w-2xl text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                        Lo que{' '}
                        <span className="bg-gradient-to-r from-[#C84214] to-[#B7B3B0] bg-clip-text text-transparent">
                            ningún competidor externo
                        </span>{' '}
                        puede igualar
                    </h2>
                </motion.div>

                {/* Tres columnas parejas, sin adornos: la sustancia en poco espacio */}
                <div className="grid gap-4 md:grid-cols-3">
                    {differentiators.map((item, i) => {
                        const Icon = item.icon
                        return (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                                className="rounded-2xl border border-[#3E3D3A] bg-[#16171A] p-6 transition-colors duration-300 hover:border-[#B7B3B0]/30"
                            >
                                <div className="mb-4 flex items-center gap-3">
                                    <div
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                                        style={{
                                            borderColor: `rgba(${item.accentRgb},0.35)`,
                                            background: `rgba(${item.accentRgb},0.10)`,
                                            color: `rgb(${item.accentRgb})`,
                                        }}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span
                                        className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]"
                                        style={{ color: `rgb(${item.accentRgb})` }}
                                    >
                                        {item.label}
                                    </span>
                                </div>
                                <h3 className="text-base font-bold leading-snug text-white lg:text-lg">
                                    {item.title}
                                </h3>
                                <p className="mt-2.5 text-sm leading-relaxed text-neutral-400">
                                    {item.description}
                                </p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
