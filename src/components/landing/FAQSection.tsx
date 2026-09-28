'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, HelpCircle } from 'lucide-react'
import { MobileFAQBackground } from '@/components/ui/MobileBackgroundEffects'

const faqs = [
    {
        id: 1,
        question: '¿Tengo que cambiar mi sistema actual o dejar de usar mis planillas de Excel?',
        answer: 'No. Nos montamos sobre lo que ya usás hoy: si armás el reparto en una planilla de Excel o Google Sheets, la leemos automáticamente cada día; si tenés un ERP o sistema de gestión propio, nos conectamos sin interrumpir la operatoria. Tu administración sigue cargando los datos donde siempre.',
    },
    {
        id: 2,
        question: '¿Los choferes o fleteros tienen que instalar alguna aplicación en el celular?',
        answer: 'No hay que instalar ninguna app ni comprar hardware. Sabemos que el fletero tercerizado rechaza cualquier aplicación que le consuma batería, datos o lo rastree todo el día. Todo corre por Telegram o mediante un link web diario que abre en el navegador con un toque, sin usuario ni contraseña.',
    },
    {
        id: 3,
        question: '¿Qué pasa cuando un destinatario hace un reclamo complejo o el bot no puede resolverlo?',
        answer: 'El sistema nunca encierra al cliente en un bucle. Si una persona escribe por tercera vez sobre el mismo envío, no se resuelve en tres intercambios o menciona palabras críticas (como extravío, robo o denuncia), el asistente se silencia en el acto y pasa la conversación a la bandeja de atención de tu equipo con el resumen de lo que marcó el chofer y lo que reclama el destinatario, para que un operador humano siga hablando desde el mismo WhatsApp.',
    },
    {
        id: 4,
        question: '¿Dónde se guardan los datos de mis clientes, mis rutas y mis precios?',
        answer: 'En un servidor dedicado y aislado exclusivamente para tu empresa en Hetzner (Alemania), bajo normativa europea GDPR y Ley 25.326 de Protección de Datos Personales. No mezclamos bases de datos entre clientes ni usamos tu información para entrenar modelos externos. Los datos son 100% tuyos y podés exportarlos cuando quieras.',
    },
    {
        id: 5,
        question: '¿Cuánto tarda en estar funcionando en la calle y hay contrato de permanencia?',
        answer: 'Entre 2 y 3 semanas desde el diagnóstico inicial. Antes de abrir el sistema a toda la flota, salimos en "Modo Espejo" sobre una sola ruta piloto: durante los primeros días aprobás cada aviso desde tu celular hasta comprobar que todo sale exacto. Trabajamos mes a mes, sin contratos de permanencia ni penalidades de salida.',
    },
]

export function FAQSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index)
    }

    return (
        <section id="faq" className="relative py-32 bg-[#0B0D0E] overflow-hidden">
            {/* Mobile animated background */}
            <MobileFAQBackground />

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C84214]/5 via-transparent to-transparent" />

            {/* Animated line */}
            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C84214]/40 to-transparent"
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
                    {/* Icono 3D on-brand, sin fondo: reemplaza al icono plano sobre el título */}
                    <motion.div
                        initial={{ opacity: 0, y: 14, scale: 0.9 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-3 flex justify-center"
                    >
                        <Image
                            src="/3d/icono-chat.png"
                            alt=""
                            aria-hidden
                            width={308}
                            height={291}
                            sizes="80px"
                            className="h-16 w-auto object-contain drop-shadow-[0_12px_26px_rgba(200,66,20,0.3)] sm:h-20"
                        />
                    </motion.div>
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 text-[#B7B3B0] text-xs sm:text-sm font-mono font-medium uppercase tracking-[0.2em]"
                    >
                        <HelpCircle className="w-4 h-4 text-[#B7B3B0]" />
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
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C84214] to-[#B7B3B0]">
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
                        Respuestas directas a las preguntas que siempre aparecen antes de conectar una operación real.
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
                                             ? 'border-[#C84214]/50 bg-[#262523] shadow-lg shadow-[#C84214]/10'
                                             : 'border-[#3E3D3A] bg-[#222120] hover:border-[#3E3D3A]/80 hover:bg-[#262523]'
                                     }`}
                                >
                                    {/* Glow effect when active */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="faq-glow"
                                            className="absolute inset-0 bg-gradient-to-r from-[#C84214]/10 to-transparent rounded-2xl"
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
                                                isActive ? 'text-[#C84214]' : 'text-neutral-600'
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
                                                    ? 'bg-[#C84214]'
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
                                                        className="mt-4 h-px w-24 bg-gradient-to-r from-[#C84214]/50 to-transparent origin-left"
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
                        className="group inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-[#C84214] text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg shadow-[#C84214]/20 hover:bg-[#B3390F] active:scale-[0.98] transition-all duration-200 ease-out whitespace-nowrap"
                    >
                        Contactanos
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                    </a>
                </motion.div>
            </div>
        </section>
    )
}
