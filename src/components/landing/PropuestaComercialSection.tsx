'use client'

/**
 * Propuesta comercial de INDIVIDRA — 3 pilares del modelo de negocio,
 * con tono de honestidad de etapa (recién arranca, no promete números
 * que no midió). NO incluye garantía de resultado ni porcentajes.
 *
 * Los 3 pilares:
 *   1. Sin permanencia — protagonista, no nota al pie
 *   2. Portabilidad total — instancia aislada, tu base es tuya
 *   3. Precio fundador — reducido para los primeros 5 clientes, sin número público
 *
 * Borrador inicial: revisar el copy antes de publicar.
 */

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Calendar, Database } from 'lucide-react'

const reveal = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
}

const pilares = [
    {
        Icon: Calendar,
        eyebrow: 'Sin permanencia',
        title: 'Mes a mes, sin ataduras',
        body: 'Ningún contrato de permanencia. Si el sistema deja de aportar valor, cortás cuando quieras. Sin costos de salida, sin cláusulas escondidas, sin llamados de retención.',
        accent: 'from-[#C84214] to-[#A8340E]',
        border: 'border-[#C84214]/30',
        glow: 'bg-[#C84214]/10',
        eyebrowColor: 'text-[#C84214]',
    },
    {
        Icon: Database,
        eyebrow: 'Portabilidad total',
        title: 'Tu base es tuya, siempre',
        body: 'Cada cliente corre en su propia instancia aislada, con su base de datos separada. Si te vas, te llevás todo — historial de conversaciones, contactos, configuraciones y reportes. Sin costo de exportación, sin quedarte encerrado en un formato propietario.',
        accent: 'from-[#B7B3B0] to-[#8E8B88]',
        border: 'border-[#B7B3B0]/30',
        glow: 'bg-[#B7B3B0]/10',
        eyebrowColor: 'text-[#B7B3B0]',
    },
]

export function PropuestaComercialSection() {
    return (
        <section id="propuesta" className="relative py-24 lg:py-32 bg-[#0B0D0E] overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#363533]/20 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                {/* Header */}
                <motion.div {...reveal} className="text-center mb-10 lg:mb-12">
                    <div className="mb-3 flex justify-center">
                        <Image
                            src="/3d/icono-brujula.png"
                            alt=""
                            aria-hidden
                            width={224}
                            height={224}
                            quality={95}
                            className="h-14 w-auto object-contain drop-shadow-[0_12px_26px_rgba(200,66,20,0.3)] sm:h-16"
                        />
                    </div>
                    <span className="text-[#B7B3B0] text-xs sm:text-sm font-mono font-medium uppercase tracking-[0.2em]">
                        Cómo trabajamos
                    </span>
                    <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl mx-auto">
                        Dos reglas que le pongo a{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C84214] to-[#B7B3B0]">
                            mi propio negocio
                        </span>
                    </h2>
                    <p className="mt-6 text-neutral-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                        Sin permanencia y con tus datos siempre en tus manos. La tecnología tiene que defenderse por el valor que te genera todos los días, no por un contrato que te obligue a quedarte.
                    </p>
                </motion.div>

                {/* Pilares */}
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {pilares.map((p, i) => {
                        const Icon = p.Icon
                        return (
                            <motion.div
                                key={p.eyebrow}
                                {...reveal}
                                transition={{ delay: i * 0.08 }}
                                className={`group relative flex flex-col p-6 lg:p-7 rounded-2xl border ${p.border} bg-[#222120] overflow-hidden transition-transform duration-300 hover:-translate-y-1`}
                            >
                                {/* Glow interno */}
                                <div aria-hidden className={`pointer-events-none absolute -right-8 -top-8 w-40 h-40 rounded-full blur-3xl ${p.glow}`} />

                                <div className="relative">
                                    <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${p.accent} shadow-lg`}>
                                        <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                                    </div>

                                    <div className={`mt-5 text-[11px] uppercase tracking-widest font-semibold ${p.eyebrowColor}`}>
                                        {p.eyebrow}
                                    </div>
                                    <h3 className="mt-2 text-xl font-bold text-white leading-tight">
                                        {p.title}
                                    </h3>
                                    <p className="mt-3 text-neutral-300 text-sm leading-relaxed">
                                        {p.body}
                                    </p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Honestidad de etapa: cierre transparente */}
                <motion.div
                    {...reveal}
                    transition={{ delay: 0.3 }}
                    className="mt-12 mx-auto max-w-3xl p-6 sm:p-7 rounded-2xl border border-[#3E3D3A] bg-[#1E1D1C] text-center"
                >
                    <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                        <strong className="text-white">No prometo la solución a todos tus problemas operativos.</strong>{' '}
                        Pero sí honestidad de etapa, transparencia total, y que si algo no funciona,
                        te vas sin fricción y con tus datos en la mano.
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
