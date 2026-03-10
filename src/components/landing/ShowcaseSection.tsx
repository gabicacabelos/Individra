'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { Bot, Zap, Clock, MessageSquare, Calendar, Bell, CheckCircle, XCircle } from 'lucide-react'

interface CaseStudy {
    id: string
    industry: string
    title: string
    description: string
    videoSrc: string
    videoPoster?: string
    headerTitle: string
    headerSubtitle: string
    badge: string
    features: {
        icon: typeof Bot
        title: string
        description: string
    }[]
}

const caseStudies: CaseStudy[] = [
    {
        id: 'maquinaria-vial',
        industry: 'Maquinaria Vial',
        title: 'Bot de Ventas WhatsApp',
        description: 'Este bot atiende consultas sobre excavadoras, retroexcavadoras, compactadores y toda la línea de maquinaria pesada. Responde con precisión sobre especificaciones técnicas, disponibilidad y precios.',
        videoSrc: '/botDemoViales.mp4',
        videoPoster: '/botDemoViales-poster.jpg',
        headerTitle: 'Bot Venta de Maquinaria Vial',
        headerSubtitle: 'En línea',
        badge: 'Bot en producción',
        features: [
            {
                icon: Bot,
                title: 'Atención 24/7',
                description: 'Respuestas instantáneas sin importar el horario'
            },
            {
                icon: Zap,
                title: 'Respuestas precisas',
                description: 'Información exacta del catálogo en segundos'
            },
            {
                icon: Clock,
                title: 'Ahorro de tiempo',
                description: 'Tu equipo se enfoca en cerrar ventas'
            },
            {
                icon: MessageSquare,
                title: 'Conversaciones naturales',
                description: 'Interacción fluida como con un vendedor experto'
            }
        ]
    },
    {
        id: 'clinica-turnos',
        industry: 'Salud & Clínicas',
        title: 'Confirmador Inteligente de Turnos',
        description: 'Sistema automatizado que confirma turnos médicos vía WhatsApp. Se ejecuta diariamente, envía recordatorios con botones interactivos y actualiza Google Calendar automáticamente si el paciente cancela.',
        videoSrc: '/confirmadorTurnos.mp4',
        videoPoster: '/confirmadorTurnos-poster.jpg',
        headerTitle: 'Confirmador de Turnos',
        headerSubtitle: 'Automatización n8n',
        badge: 'Automatización activa',
        features: [
            {
                icon: Calendar,
                title: 'Integración Calendar',
                description: 'Sincronizado con Google Calendar'
            },
            {
                icon: Bell,
                title: 'Recordatorios automáticos',
                description: 'Envío diario a las 10:00 AM'
            },
            {
                icon: CheckCircle,
                title: 'Confirmación 1-click',
                description: 'Botones interactivos en WhatsApp'
            },
            {
                icon: XCircle,
                title: 'Gestión de cancelaciones',
                description: 'Actualiza agenda automáticamente'
            }
        ]
    }
]

export function ShowcaseSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const [activeCase, setActiveCase] = useState(0)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start']
    })

    const orbY = useTransform(scrollYProgress, [0, 1], [50, -50])
    const currentCase = caseStudies[activeCase]

    return (
        <section ref={sectionRef} id="casos" className="relative py-24 sm:py-32 bg-black overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent" />

            <motion.div
                style={{ y: orbY }}
                className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[150px]"
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12 sm:mb-16"
                >
                    <span className="inline-block text-violet-400 text-sm font-semibold uppercase tracking-widest mb-4">
                        Casos Reales
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Mirá nuestras soluciones{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400">
                            en acción
                        </span>
                    </h2>
                    <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                        Así es como nuestras automatizaciones transforman empresas reales
                    </p>
                </motion.div>

                {/* Case Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    {caseStudies.map((caseStudy, index) => (
                        <button
                            key={caseStudy.id}
                            onClick={() => setActiveCase(index)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                                activeCase === index
                                    ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/25'
                                    : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/10'
                            }`}
                        >
                            <span className="hidden sm:inline">{caseStudy.industry}:</span> {caseStudy.title}
                        </button>
                    ))}
                </motion.div>

                {/* Case Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentCase.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
                    >
                        {/* Video Container */}
                        <div className="relative">
                            {/* Glow effect */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/20 to-blue-600/20 rounded-3xl blur-2xl" />

                            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/50 backdrop-blur-sm">
                                {/* Video Header */}
                                <div className="flex items-center gap-3 px-4 py-3 bg-neutral-800/80 border-b border-white/5">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                                        {currentCase.id === 'clinica-turnos' ? (
                                            <Calendar className="w-5 h-5 text-white" />
                                        ) : (
                                            <Bot className="w-5 h-5 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-sm">{currentCase.headerTitle}</p>
                                        <p className="text-green-400 text-xs">{currentCase.headerSubtitle}</p>
                                    </div>
                                </div>

                                {/* Video */}
                                <video
                                    key={currentCase.videoSrc}
                                    className="w-full aspect-[9/16] sm:aspect-video object-cover"
                                    controls
                                    playsInline
                                    preload="metadata"
                                    poster={currentCase.videoPoster}
                                >
                                    <source src={currentCase.videoSrc} type="video/mp4" />
                                    Tu navegador no soporta videos HTML5.
                                </video>
                            </div>
                        </div>

                        {/* Info Content */}
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-violet-300 text-sm font-medium">{currentCase.badge}</span>
                            </div>

                            <div>
                                <p className="text-violet-400 text-sm font-medium mb-2">{currentCase.industry}</p>
                                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                                    {currentCase.title}
                                </h3>
                            </div>

                            <p className="text-neutral-300 text-lg leading-relaxed">
                                {currentCase.description}
                            </p>

                            {/* Features Grid */}
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                {currentCase.features.map((feature, index) => (
                                    <motion.div
                                        key={feature.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                                    >
                                        <div className="p-2 rounded-lg bg-violet-500/10">
                                            <feature.icon className="w-4 h-4 text-violet-400" />
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-medium">{feature.title}</p>
                                            <p className="text-neutral-500 text-xs mt-0.5">{feature.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* CTA */}
                            <motion.a
                                href="#contacto"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow"
                            >
                                Quiero esto para mi negocio
                            </motion.a>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Case Navigation Dots */}
                <div className="flex justify-center gap-2 mt-10">
                    {caseStudies.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveCase(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                activeCase === index
                                    ? 'w-8 bg-gradient-to-r from-violet-500 to-blue-500'
                                    : 'bg-white/20 hover:bg-white/40'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
