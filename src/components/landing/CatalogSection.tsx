'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { MobileCatalogBackground } from '@/components/ui/MobileBackgroundEffects'
import {
    MessageSquare,
    Bell,
    Truck,
    ScanLine,
    AlertTriangle,
    ClipboardList,
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
        color: 'from-[#C84214] to-[#A8340E]',
        items: [
            { icon: MessageSquare, title: 'Estado de Pedidos 24/7', desc: 'Responde por dónde va cada pedido o remito, por WhatsApp o web, consultando tu sistema', benefit: 'Menos consultas repetidas' },
            { icon: ScanLine, title: 'Carga de Remitos', desc: 'Extrae los datos de remitos y comprobantes desde una foto o PDF, listos para revisar', benefit: 'Sin carga manual' },
            { icon: Bell, title: 'Avisos de Entrega', desc: 'Notifica salida, llegada o demora según tus reglas, sin depender de que alguien se acuerde', benefit: 'Cero olvidos' },
            { icon: AlertTriangle, title: 'Registro de anomalías', desc: 'Cruza la ubicación que comparte el chofer con la respuesta del destinatario, para que el reporte tenga evidencia de dos fuentes', benefit: 'Evidencia real' },
            { icon: ClipboardList, title: 'Ficha del domicilio', desc: 'Guarda cómo se accede a cada domicilio y lo comparte con el chofer automáticamente', benefit: 'Memoria acumulativa' },
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
        <section ref={sectionRef} id="soluciones" className="relative pt-4 pb-24 md:py-32 bg-[#0B0D0E] overflow-hidden">
            {/* Mobile animated background */}
            <MobileCatalogBackground />

            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#C84214]/5 via-transparent to-transparent" />

            <div className="relative z-10 max-w-4xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 md:mb-16"
                >
                    {/* Icono 3D de marca — entra "volando" desde abajo al scrollear */}
                    <motion.div
                        className="mb-3 flex justify-center"
                        initial={{ opacity: 0, y: 80, rotate: -8, scale: 0.9 }}
                        whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ type: 'spring', stiffness: 90, damping: 12, mass: 0.8 }}
                    >
                        <Image
                            src="/3d/icono-cohete.png"
                            alt=""
                            aria-hidden
                            width={512}
                            height={447}
                            quality={95}
                            className="h-20 w-auto object-contain drop-shadow-[0_14px_30px_rgba(200,66,20,0.32)] sm:h-24"
                        />
                    </motion.div>
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 text-[#B7B3B0] text-xs sm:text-sm font-mono font-medium uppercase tracking-[0.2em]"
                    >
                        <Zap className="w-4 h-4 text-[#B7B3B0]" />
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
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C84214] to-[#B7B3B0]">
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

                            return (
                                <div key={category.id}>
                                    <motion.div
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: categoryIndex * 0.1 }}
                                        className={`rounded-2xl border backdrop-blur-sm overflow-hidden ${isPrincipal ? 'border-[#C84214]/50 bg-[#262523] shadow-lg shadow-[#C84214]/10' : 'border-[#3E3D3A] bg-[#222120]'}`}
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
                                                        <span className="px-2 py-0.5 rounded-full bg-[#C84214]/15 border border-[#C84214]/40 text-[#B7B3B0] text-[10px] font-bold uppercase tracking-wider">
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
                                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isExpanded ? 'bg-[#C84214]/20 text-[#C84214]' : 'bg-[#1E1D1C] text-neutral-400'
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
                                                                    backgroundColor: 'rgba(200, 66, 20, 0.08)',
                                                                }}
                                                                className="p-4 rounded-xl border border-[#3E3D3A] bg-[#1E1D1C] cursor-default transition-colors"
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${category.color} bg-opacity-20 flex items-center justify-center flex-shrink-0`}>
                                                                        <ItemIcon className="w-4 h-4 text-white" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="font-medium text-white text-sm">{item.title}</h4>
                                                                        <p className="text-neutral-400 text-xs mt-1 leading-relaxed">{item.desc}</p>
                                                                        <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2A2826] border border-[#3E3D3A]">
                                                                            <Sparkles className="w-3 h-3 text-[#C84214]" />
                                                                            <span className="text-xs text-neutral-300">{item.benefit}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )
                                                    })}
                                                </div>

                                                {/* Acceso directo a la landing dedicada de logística.
                                                    Clave en mobile: el menú hamburguesa oculta el link
                                                    "Logística" del navbar, así que este botón garantiza
                                                    la entrada a /logistica desde el contenido. */}
                                                {category.id === 'logistica' && (
                                                    <div className="px-5 pb-5">
                                                        <Link
                                                            href="/logistica"
                                                            className="group flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl bg-[#C84214] text-white text-sm sm:text-base font-semibold shadow-lg shadow-[#C84214]/20 hover:bg-[#B3390F] active:scale-[0.99] transition-all duration-200"
                                                        >
                                                            Ver la solución completa de logística
                                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                                                        </Link>
                                                    </div>
                                                )}
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
                        className="relative p-6 sm:p-8 rounded-2xl border border-[#3E3D3A] bg-gradient-to-br from-[#262523] via-[#1E1D1C] to-[#161514] overflow-hidden"
                    >
                        {/* Ambient background */}
                        <motion.div
                            animate={{
                                x: [0, 100, 0],
                                opacity: [0.06, 0.12, 0.06],
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute top-0 right-0 w-64 h-64 bg-[#C84214] rounded-full blur-[100px] opacity-10"
                        />

                        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C84214] to-[#A8340E] flex items-center justify-center">
                                    <Lightbulb className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">¿Tu caso es diferente?</h3>
                                    <p className="text-neutral-400 text-sm">Creamos soluciones a medida</p>
                                </div>
                            </div>

                            <a
                                href="#contacto"
                                className="group inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-[#C84214] text-white text-sm sm:text-base font-semibold rounded-full shadow-lg shadow-[#C84214]/20 hover:bg-[#B3390F] active:scale-[0.98] transition-all duration-200 ease-out whitespace-nowrap"
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
