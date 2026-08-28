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
import { Calendar, Database, Sparkles } from 'lucide-react'

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
        accent: 'from-violet-500 to-blue-500',
        border: 'border-violet-500/25',
        glow: 'bg-violet-500/10',
    },
    {
        Icon: Database,
        eyebrow: 'Portabilidad total',
        title: 'Tu base es tuya, siempre',
        body: 'Cada cliente corre en su propia instancia aislada, con su base de datos separada. Si te vas, te llevás todo — historial de conversaciones, contactos, configuraciones y reportes. Sin costo de exportación, sin quedarte encerrado en un formato propietario.',
        accent: 'from-blue-500 to-cyan-500',
        border: 'border-blue-500/25',
        glow: 'bg-blue-500/10',
    },
    {
        Icon: Sparkles,
        eyebrow: 'Clientes fundadores',
        title: 'Precio especial para los primeros 5 clientes',
        body: 'INDIVIDRA recién arranca. Los primeros 5 clientes acceden a un setup reducido a cambio de compartir su caso como referencia. Un intercambio honesto: vos accedés a un precio que no vas a encontrar más adelante, yo construyo evidencia real con tu operación.',
        accent: 'from-cyan-500 to-emerald-500',
        border: 'border-cyan-500/25',
        glow: 'bg-cyan-500/10',
    },
]

export function PropuestaComercialSection() {
    return (
        <section id="propuesta" className="relative py-24 lg:py-32 bg-black overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                {/* Header */}
                <motion.div {...reveal} className="text-center mb-14 lg:mb-16">
                    <span className="inline-flex items-center gap-2 text-violet-400 text-sm font-semibold uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                        Cómo trabajamos
                    </span>
                    <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl mx-auto">
                        Tres reglas que le pongo a{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400">
                            mi propio negocio
                        </span>
                    </h2>
                    <p className="mt-6 text-neutral-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                        Sin permanencia, con tus datos siempre en tus manos, y un precio especial para los primeros 5 clientes que confíen cuando todavía no puedo mostrar cientos de casos.
                    </p>
                </motion.div>

                {/* Pilares */}
                <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
                    {pilares.map((p, i) => {
                        const Icon = p.Icon
                        return (
                            <motion.div
                                key={p.eyebrow}
                                {...reveal}
                                transition={{ delay: i * 0.08 }}
                                className={`group relative flex flex-col p-6 lg:p-7 rounded-2xl border ${p.border} bg-[#0a0a14] overflow-hidden transition-transform duration-300 hover:-translate-y-1`}
                            >
                                {/* Glow interno */}
                                <div aria-hidden className={`pointer-events-none absolute -right-8 -top-8 w-40 h-40 rounded-full blur-3xl ${p.glow}`} />

                                <div className="relative">
                                    <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${p.accent} shadow-lg`}>
                                        <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                                    </div>

                                    <div className="mt-5 text-[11px] uppercase tracking-widest font-semibold text-violet-300/80">
                                        {p.eyebrow}
                                    </div>
                                    <h3 className="mt-2 text-xl font-bold text-white leading-tight">
                                        {p.title}
                                    </h3>
                                    <p className="mt-3 text-neutral-400 text-sm leading-relaxed">
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
                    className="mt-12 mx-auto max-w-3xl p-6 sm:p-7 rounded-2xl border border-white/10 bg-white/[0.02] text-center"
                >
                    <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                        <strong className="text-white">No prometo un número de mejora ni un ahorro específico.</strong>{' '}
                        Recién arranco, no tengo mediciones propias todavía. Lo que sí prometo:
                        honestidad de etapa, transparencia total, y que si algo no funciona,
                        te vas sin fricción y con tus datos en la mano.
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
