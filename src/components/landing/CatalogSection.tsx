'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { MobileCatalogBackground } from '@/components/ui/MobileBackgroundEffects'
import { LogisticsIllustration } from './illustrations'
import {
    MessageSquare,
    Calendar,
    FileText,
    Mail,
    BarChart3,
    Receipt,
    Bell,
    Send,
    Calculator,
    Truck,
    Home,
    ScanLine,
    AlertTriangle,
    Sparkles,
    ArrowRight,
    Lightbulb,
    ChevronDown,
    Zap
} from 'lucide-react'

const categories = [
    {
        id: 'logistica',
        label: 'Logística & Distribución',
        tier: 'principal' as const,
        icon: Truck,
        color: 'from-blue-500 to-cyan-600',
        items: [
            { icon: MessageSquare, title: 'Estado de Pedidos 24/7', desc: 'Responde por dónde va cada pedido o remito, por WhatsApp, web o voz, consultando tu sistema', benefit: '-80% consultas' },
            { icon: ScanLine, title: 'Carga de Remitos', desc: 'Extrae los datos de remitos y comprobantes desde una foto o PDF, listos para revisar', benefit: '-95% tipeo' },
            { icon: Bell, title: 'Avisos de Entrega', desc: 'Notifica salida, llegada o demora según tus reglas, sin depender de que alguien se acuerde', benefit: 'Cero olvidos' },
            { icon: AlertTriangle, title: 'Semáforo de Riesgo', desc: 'Marca pedidos demorados o sin confirmar según reglas de negocio simples', benefit: 'Prioridad clara' },
        ]
    },
    {
        id: 'contable',
        label: 'Estudios Contables',
        tier: 'secundario' as const,
        icon: Calculator,
        color: 'from-amber-500 to-orange-600',
        items: [
            { icon: Receipt, title: 'Procesador de Facturas', desc: 'Extracción de datos de PDFs directo al sistema, con validación humana', benefit: '-95% carga manual' },
            { icon: Bell, title: 'Alertas de Vencimientos', desc: 'Avisos automáticos a clientes sobre fechas límite', benefit: '100% a tiempo' },
            { icon: BarChart3, title: 'Reportes Periódicos', desc: 'Informes de gestión generados y enviados solos', benefit: 'Sin intervención' },
            { icon: Mail, title: 'Respuestas de Consultas', desc: 'Asistente que responde dudas frecuentes de clientes', benefit: '-80% emails' },
        ]
    },
    {
        id: 'inmobiliaria',
        label: 'Inmobiliarias',
        tier: 'secundario' as const,
        icon: Home,
        color: 'from-violet-500 to-purple-600',
        items: [
            { icon: MessageSquare, title: 'Consultas de Propiedades', desc: 'Responde disponibilidad, precio y requisitos desde tu base, 24/7', benefit: 'Atención inmediata' },
            { icon: Calendar, title: 'Coordinación de Visitas', desc: 'Agenda y recuerda visitas automáticamente', benefit: '-60% ausencias' },
            { icon: Send, title: 'Seguimiento de Interesados', desc: 'Secuencias de contacto para que ningún interesado se enfríe', benefit: '+ cierres' },
            { icon: FileText, title: 'Carga de Fichas', desc: 'Extrae datos de documentos y fichas sin tipear a mano', benefit: 'Sin carga manual' },
        ]
    },
]

export function CatalogSection() {
    const [expandedId, setExpandedId] = useState<string | null>('logistica')
    const sectionRef = useRef<HTMLElement>(null)

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start']
    })

    const parallaxY = useTransform(scrollYProgress, [0, 1], [100, -100])

    const toggleCategory = (id: string) => {
        setExpandedId(expandedId === id ? null : id)
    }

    return (
        <section ref={sectionRef} id="soluciones" className="relative pt-4 pb-24 md:py-32 bg-black overflow-hidden">
            {/* Mobile animated background */}
            <MobileCatalogBackground />

            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent" />

            <div className="relative z-10 max-w-4xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 md:mb-16"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 text-violet-400 text-sm font-semibold uppercase tracking-widest"
                    >
                        <Zap className="w-4 h-4" />
                        Automatizaciones por Rubro
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 text-4xl sm:text-5xl font-bold text-white"
                    >
                        Encontrá tu{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400">
                            solución
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="mt-6 text-neutral-400 text-lg max-w-2xl mx-auto"
                    >
                        Nuestro foco es la logística y la distribución. Abrí el rubro y descubrí qué podemos automatizar.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 flex justify-center"
                    >
                        <LogisticsIllustration className="w-full max-w-md h-auto" />
                    </motion.div>
                </motion.div >

                {/* Accordion */}
                < motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                >
                    {
                        categories.map((category, categoryIndex) => {
                            const CategoryIcon = category.icon
                            const isExpanded = expandedId === category.id
                            const isPrincipal = category.tier === 'principal'
                            const showSecondaryDivider = category.tier === 'secundario' && categories[categoryIndex - 1]?.tier === 'principal'

                            return (
                                <div key={category.id}>
                                    {showSecondaryDivider && (
                                        <div className="flex items-center gap-3 pt-6 pb-2">
                                            <div className="h-px flex-1 bg-white/10" />
                                            <span className="text-neutral-500 text-xs uppercase tracking-widest whitespace-nowrap">
                                                También trabajamos en
                                            </span>
                                            <div className="h-px flex-1 bg-white/10" />
                                        </div>
                                    )}
                                    <motion.div
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: categoryIndex * 0.1 }}
                                        className={`rounded-2xl border bg-neutral-900/50 backdrop-blur-sm overflow-hidden ${isPrincipal ? 'border-blue-500/40 shadow-lg shadow-blue-900/20' : 'border-white/10'}`}
                                    >
                                    {/* Header */}
                                    <motion.button
                                        onClick={() => toggleCategory(category.id)}
                                        className="w-full p-5 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <motion.div
                                                animate={{
                                                    scale: isExpanded ? 1.1 : 1,
                                                    rotate: isExpanded ? 5 : 0,
                                                }}
                                                transition={{ type: 'spring', stiffness: 300 }}
                                                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}
                                            >
                                                <CategoryIcon className="w-6 h-6 text-white" />
                                            </motion.div>
                                            <div className="text-left">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="text-lg font-semibold text-white">{category.label}</h3>
                                                    {isPrincipal && (
                                                        <span className="px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                                                            Especialidad
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-neutral-500 text-sm">{category.items.length} automatizaciones</p>
                                            </div>
                                        </div>
                                        <motion.div
                                            animate={{ rotate: isExpanded ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isExpanded ? 'bg-violet-500/20 text-violet-400' : 'bg-neutral-800 text-neutral-400'
                                                }`}
                                        >
                                            <ChevronDown className="w-5 h-5" />
                                        </motion.div>
                                    </motion.button>

                                    {/* Content */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 pb-5 pt-2 grid sm:grid-cols-2 gap-3">
                                                    {category.items.map((item, itemIndex) => {
                                                        const ItemIcon = item.icon

                                                        return (
                                                            <motion.div
                                                                key={itemIndex}
                                                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                transition={{
                                                                    delay: itemIndex * 0.08,
                                                                    duration: 0.4,
                                                                    ease: [0.23, 1, 0.32, 1]
                                                                }}
                                                                whileHover={{
                                                                    scale: 1.02,
                                                                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                                                }}
                                                                className="p-4 rounded-xl border border-white/5 bg-neutral-900/50 cursor-default transition-colors"
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${category.color} bg-opacity-20 flex items-center justify-center flex-shrink-0`}>
                                                                        <ItemIcon className="w-4 h-4 text-white" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="font-medium text-white text-sm">{item.title}</h4>
                                                                        <p className="text-neutral-500 text-xs mt-1 leading-relaxed">{item.desc}</p>
                                                                        <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                                                                            <Sparkles className="w-3 h-3 text-violet-400" />
                                                                            <span className="text-xs text-violet-300">{item.benefit}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )
                                                    })}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    </motion.div>
                                </div>
                            )
                        })
                    }
                </motion.div >

                {/* Custom Solution CTA */}
                < motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-12"
                >
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="relative p-6 sm:p-8 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-900/20 via-neutral-900/50 to-blue-900/20 overflow-hidden"
                    >
                        {/* Animated background */}
                        <motion.div
                            animate={{
                                x: [0, 100, 0],
                                opacity: [0.1, 0.2, 0.1],
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute top-0 right-0 w-64 h-64 bg-violet-500 rounded-full blur-[100px]"
                        />

                        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                                    <Lightbulb className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">¿Tu caso es diferente?</h3>
                                    <p className="text-neutral-400 text-sm">Creamos soluciones a medida</p>
                                </div>
                            </div>

                            <a
                                href="#contacto"
                                className="group inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm sm:text-base font-medium rounded-full shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200 ease-out whitespace-nowrap"
                            >
                                Contanos
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                            </a>
                        </div>
                    </motion.div>
                </motion.div >
            </div >
        </section >
    )
}
