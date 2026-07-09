'use client'

import { motion } from 'framer-motion'
import { Factory, ShieldCheck, Cpu } from 'lucide-react'

const differentiators = [
    {
        icon: Factory,
        accent: 'from-blue-500 to-cyan-500',
        accentRgb: '59, 130, 246',
        title: 'Venimos de adentro de la logística automotriz',
        description:
            'Prestación tercerizada dentro de la cadena de suministro de la industria automotriz (ecosistema Peugeot–Stellantis). Conocemos los tiempos, los procesos y las exigencias de calidad de la logística industrial por haberlos operado, no por leerlos en un manual.',
    },
    {
        icon: ShieldCheck,
        accent: 'from-emerald-500 to-teal-500',
        accentRgb: '16, 185, 129',
        title: 'Tus datos, en Alemania y bajo GDPR',
        description:
            'Alojamos todo en infraestructura propia en Alemania, bajo GDPR, el estándar de protección de datos más estricto del mundo. Aislamiento por cliente: tu información nunca se mezcla con la de otro ni se usa para entrenar modelos de terceros. Si algún día te vas, te la llevás.',
    },
    {
        icon: Cpu,
        accent: 'from-violet-500 to-purple-500',
        accentRgb: '139, 92, 246',
        title: 'No vendemos magia. Vendemos ingeniería.',
        description:
            'Somos arquitectos de software, no una plantilla con un chatbot pegado. Cada sistema se diseña, se documenta y se mantiene como infraestructura crítica de tu empresa, con acompañamiento técnico humano todos los meses.',
    },
]

export function DifferentiatorsSection() {
    return (
        <section id="diferenciadores" className="relative py-24 lg:py-32 bg-black overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    className="text-center mb-14 lg:mb-20"
                >
                    <span className="inline-block text-violet-400 text-sm font-semibold uppercase tracking-widest">
                        Por qué INDIVIDRA
                    </span>
                    <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                        Lo que{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400">
                            ningún competidor externo
                        </span>{' '}
                        puede igualar
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {differentiators.map((item, i) => {
                        const Icon = item.icon
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ delay: i * 0.12 }}
                                className="relative group p-6 lg:p-7 rounded-3xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm overflow-hidden hover:border-white/20 transition-colors"
                            >
                                <div
                                    className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"
                                    style={{ background: `rgb(${item.accentRgb})` }}
                                />
                                <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${item.accent} flex items-center justify-center mb-5 shadow-lg`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="relative text-lg lg:text-xl font-bold text-white mb-3 leading-snug">
                                    {item.title}
                                </h3>
                                <p className="relative text-neutral-400 text-sm leading-relaxed">
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
