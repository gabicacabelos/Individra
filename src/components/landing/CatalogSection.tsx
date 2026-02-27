'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
    MessageSquare,
    Calendar,
    FileText,
    Users,
    Mail,
    Phone,
    ClipboardCheck,
    BarChart3,
    Receipt,
    Bell,
    Database,
    Send,
    Building2,
    ShoppingCart,
    Stethoscope,
    Calculator,
    HardHat,
    Sparkles,
    ArrowRight,
    Lightbulb,
    ChevronDown,
    Zap
} from 'lucide-react'

const categories = [
    {
        id: 'servicios',
        label: 'Empresas de Servicios',
        icon: Building2,
        color: 'from-violet-500 to-purple-600',
        items: [
            { icon: MessageSquare, title: 'WhatsApp 24/7', desc: 'Respuestas instantáneas que califican y agendan', benefit: '500+ consultas/día' },
            { icon: Calendar, title: 'Agenda Inteligente', desc: 'Reservas online con recordatorios automáticos', benefit: '-70% ausencias' },
            { icon: FileText, title: 'Cotizador Express', desc: 'Presupuestos personalizados en segundos', benefit: 'Disponible 24/7' },
            { icon: Send, title: 'Nurturing de Leads', desc: 'Secuencias que convierten prospectos en clientes', benefit: '+25% cierre' },
        ]
    },
    {
        id: 'ecommerce',
        label: 'E-commerce & Retail',
        icon: ShoppingCart,
        color: 'from-emerald-500 to-teal-600',
        items: [
            { icon: ShoppingCart, title: 'Recuperación de Carritos', desc: 'WhatsApp con oferta al que abandonó la compra', benefit: '+15% ventas' },
            { icon: MessageSquare, title: 'Asistente de Compras', desc: 'Recomendaciones y stock en tiempo real', benefit: '+30% ticket' },
            { icon: Users, title: 'Clasificador de Leads', desc: 'Prioriza prospectos según intención de compra', benefit: '+40% conversión' },
            { icon: Bell, title: 'Alertas de Stock', desc: 'Notificaciones cuando hay reposición o promociones', benefit: 'Más recompra' },
        ]
    },
    {
        id: 'salud',
        label: 'Salud & Clínicas',
        icon: Stethoscope,
        color: 'from-blue-500 to-cyan-600',
        items: [
            { icon: Phone, title: 'Recepción Virtual', desc: 'Agente de voz que atiende y agenda turnos', benefit: 'Atención 24/7' },
            { icon: Calendar, title: 'Gestión de Turnos', desc: 'Confirmación y recordatorios por WhatsApp', benefit: '-60% ausencias' },
            { icon: MessageSquare, title: 'Triage Inicial', desc: 'Preguntas previas para optimizar la consulta', benefit: 'Más eficiencia' },
            { icon: ClipboardCheck, title: 'Seguimiento Post-Consulta', desc: 'Control automático de evolución del paciente', benefit: 'Mejor atención' },
        ]
    },
    {
        id: 'contable',
        label: 'Estudios Contables',
        icon: Calculator,
        color: 'from-amber-500 to-orange-600',
        items: [
            { icon: Receipt, title: 'Procesador de Facturas', desc: 'Extracción de datos de PDFs directo al sistema', benefit: '-95% carga manual' },
            { icon: Bell, title: 'Alertas de Vencimientos', desc: 'Avisos automáticos a clientes sobre fechas límite', benefit: '100% a tiempo' },
            { icon: BarChart3, title: 'Reportes Periódicos', desc: 'Informes de gestión generados y enviados solos', benefit: 'Sin intervención' },
            { icon: Mail, title: 'Respuestas de Consultas', desc: 'IA que responde dudas frecuentes de clientes', benefit: '-80% emails' },
        ]
    },
    {
        id: 'construccion',
        label: 'Construcción & Obras',
        icon: HardHat,
        color: 'from-rose-500 to-pink-600',
        items: [
            { icon: FileText, title: 'Presupuestador de Obras', desc: 'Cotizaciones detalladas desde formulario web', benefit: 'Respuesta inmediata' },
            { icon: ClipboardCheck, title: 'Updates de Avance', desc: 'Informes automáticos al cliente sobre la obra', benefit: 'Clientes informados' },
            { icon: Database, title: 'Conexión de Sistemas', desc: 'Sincronización entre planillas, CRM y gestión', benefit: 'Datos unificados' },
            { icon: Bell, title: 'Control de Materiales', desc: 'Alertas de stock bajo y pedidos pendientes', benefit: 'Sin faltantes' },
        ]
    },
]

export function CatalogSection() {
    const [expandedId, setExpandedId] = useState<string | null>('servicios')
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
        <section ref={sectionRef} id="soluciones" className="relative py-32 bg-black overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent" />

            <div className="relative z-10 max-w-4xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
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
                        Seleccioná tu industria y descubrí qué podemos automatizar.
                    </motion.p>
                </motion.div>

                {/* Accordion */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                >
                    {categories.map((category, categoryIndex) => {
                        const CategoryIcon = category.icon
                        const isExpanded = expandedId === category.id

                        return (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: categoryIndex * 0.1 }}
                                className="rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm overflow-hidden"
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
                                            <h3 className="text-lg font-semibold text-white">{category.label}</h3>
                                            <p className="text-neutral-500 text-sm">{category.items.length} automatizaciones</p>
                                        </div>
                                    </div>
                                    <motion.div
                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                            isExpanded ? 'bg-violet-500/20 text-violet-400' : 'bg-neutral-800 text-neutral-400'
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
                        )
                    })}
                </motion.div>

                {/* Custom Solution CTA */}
                <motion.div
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
                                className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium rounded-full shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200 ease-out"
                            >
                                Contanos
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                            </a>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
