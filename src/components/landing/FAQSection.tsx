'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, HelpCircle } from 'lucide-react'
import { MobileFAQBackground } from '@/components/ui/MobileBackgroundEffects'

const faqs = [
    {
        id: 1,
        question: '¿Qué tipo de empresas pueden beneficiarse de la IA?',
        answer: 'Cualquier empresa que maneje procesos repetitivos, atención al cliente, gestión de datos o quiera escalar sus operaciones. Desde startups hasta grandes corporaciones, la IA se adapta a las necesidades específicas de cada negocio.',
    },
    {
        id: 2,
        question: '¿Cuánto tiempo toma implementar una solución de IA?',
        answer: 'Depende de la complejidad del proyecto. Un chatbot básico puede estar listo en 2-3 semanas, mientras que una solución de automatización completa puede tomar 1-3 meses. Siempre comenzamos con un MVP para validar resultados rápidamente.',
    },
    {
        id: 3,
        question: '¿Necesito conocimientos técnicos para usar las soluciones?',
        answer: 'No. Diseñamos interfaces intuitivas y proporcionamos capacitación completa. Nuestras soluciones están pensadas para que cualquier miembro de tu equipo pueda usarlas sin necesidad de conocimientos de programación.',
    },
    {
        id: 4,
        question: '¿Cómo se integra con mis sistemas actuales?',
        answer: 'Trabajamos con APIs y conectores para integrar nuestras soluciones con tu CRM, ERP, WhatsApp Business, email, bases de datos y cualquier otro sistema que utilices. La integración es transparente y sin interrupciones en tu operación.',
    },
    {
        id: 5,
        question: '¿Qué soporte ofrecen después de la implementación?',
        answer: 'Ofrecemos soporte continuo, monitoreo de rendimiento y actualizaciones periódicas. Nuestro equipo está disponible para resolver cualquier inconveniente y optimizar las soluciones según evolucionen tus necesidades.',
    },
]

export function FAQSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(0)

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index)
    }

    return (
        <section id="faq" className="relative py-32 bg-black overflow-hidden">
            {/* Mobile animated background */}
            <MobileFAQBackground />

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent" />

            {/* Animated line */}
            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"
            />

            <div className="relative z-10 max-w-4xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-center mb-16"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 text-violet-400 text-sm font-semibold uppercase tracking-widest"
                    >
                        <HelpCircle className="w-4 h-4" />
                        Preguntas Frecuentes
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 text-4xl sm:text-5xl font-bold text-white"
                    >
                        ¿Tenés{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400">
                            dudas?
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="mt-6 text-neutral-400 text-lg max-w-2xl mx-auto"
                    >
                        Respondemos las consultas más comunes sobre nuestros servicios de IA y desarrollo.
                    </motion.p>
                </motion.div>

                {/* FAQ Accordion */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="space-y-4"
                >
                    {faqs.map((faq, index) => {
                        const isActive = activeIndex === index

                        return (
                            <motion.div
                                key={faq.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                <div
                                    className={`relative rounded-2xl border backdrop-blur-sm transition-all duration-300 overflow-hidden ${
                                        isActive
                                            ? 'border-violet-500/30 bg-neutral-900/80'
                                            : 'border-white/10 bg-neutral-900/40 hover:border-white/20 hover:bg-neutral-900/60'
                                    }`}
                                >
                                    {/* Glow effect when active */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="faq-glow"
                                            className="absolute inset-0 bg-gradient-to-r from-violet-600/5 to-blue-600/5 rounded-2xl"
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}

                                    {/* Question */}
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="relative w-full p-6 flex items-center justify-between gap-4 text-left"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className={`text-sm font-mono transition-colors duration-300 ${
                                                isActive ? 'text-violet-400' : 'text-neutral-600'
                                            }`}>
                                                0{index + 1}
                                            </span>
                                            <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                                                isActive ? 'text-white' : 'text-neutral-300 group-hover:text-white'
                                            }`}>
                                                {faq.question}
                                            </h3>
                                        </div>
                                        <motion.div
                                            animate={{ rotate: isActive ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                                isActive
                                                    ? 'bg-gradient-to-r from-violet-600 to-blue-600'
                                                    : 'bg-neutral-800 group-hover:bg-neutral-700'
                                            }`}
                                        >
                                            {isActive ? (
                                                <Minus className="w-5 h-5 text-white" />
                                            ) : (
                                                <Plus className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                                            )}
                                        </motion.div>
                                    </button>

                                    {/* Answer */}
                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 pb-6 pl-16">
                                                    <motion.p
                                                        initial={{ y: -10, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        exit={{ y: -10, opacity: 0 }}
                                                        transition={{ delay: 0.1 }}
                                                        className="text-neutral-400 leading-relaxed"
                                                    >
                                                        {faq.answer}
                                                    </motion.p>
                                                    <motion.div
                                                        initial={{ scaleX: 0 }}
                                                        animate={{ scaleX: 1 }}
                                                        transition={{ delay: 0.2, duration: 0.4 }}
                                                        className="mt-4 h-px w-24 bg-gradient-to-r from-violet-500/50 to-transparent origin-left"
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )
                    })}
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <p className="text-neutral-500 mb-4">¿No encontrás tu respuesta?</p>
                    <a
                        href="#contacto"
                        className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200 ease-out"
                    >
                        Contactanos
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                    </a>
                </motion.div>
            </div>
        </section>
    )
}
