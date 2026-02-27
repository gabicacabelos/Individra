'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useState, useRef } from 'react'
import { Send, Mail, MessageSquare, Building2, User, CheckCircle } from 'lucide-react'

export function ContactSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start']
    })

    // Parallax for floating orbs
    const orb1Y = useTransform(scrollYProgress, [0, 1], [100, -100])
    const orb2Y = useTransform(scrollYProgress, [0, 1], [-50, 150])
    const orb1X = useTransform(scrollYProgress, [0, 1], [0, 50])
    const orb2X = useTransform(scrollYProgress, [0, 1], [0, -50])

    const [formData, setFormData] = useState({
        nombre: '',
        empresa: '',
        email: '',
        mensaje: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al enviar el mensaje')
            }

            setIsSubmitted(true)
            setFormData({ nombre: '', empresa: '', email: '', mensaje: '' })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al enviar el mensaje')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const inputVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94] as const
            }
        })
    }

    return (
        <section ref={sectionRef} id="contacto" className="relative py-32 bg-black overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />

            {/* Animated line */}
            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"
            />

            {/* Floating Orbs with parallax */}
            <motion.div
                style={{ y: orb1Y, x: orb1X }}
                className="absolute top-20 left-10 w-72 h-72 bg-violet-600/20 rounded-full blur-[120px]"
            />
            <motion.div
                style={{ y: orb2Y, x: orb2X }}
                className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"
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
                        className="inline-block text-violet-400 text-sm font-semibold uppercase tracking-widest"
                    >
                        Contacto
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 text-4xl sm:text-5xl font-bold text-white"
                    >
                        Empecemos a{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400">
                            trabajar juntos
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="mt-6 text-neutral-400 text-lg max-w-xl mx-auto"
                    >
                        Contanos sobre tu proyecto y te ayudamos a encontrar la mejor solución
                        para automatizar y escalar tu negocio.
                    </motion.p>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, y: 60, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="relative">
                        {/* Animated glow */}
                        <motion.div
                            animate={{
                                opacity: [0.3, 0.6, 0.3],
                                scale: [1, 1.02, 1]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-blue-600/20 rounded-3xl blur-xl"
                        />
                        <form
                            onSubmit={handleSubmit}
                            className="relative p-8 sm:p-12 rounded-3xl border border-white/10 bg-neutral-900/80 backdrop-blur-xl"
                        >
                            <AnimatePresence mode="wait">
                                {isSubmitted ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                        exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                                        transition={{ duration: 0.4 }}
                                        className="text-center py-16 flex flex-col items-center justify-center min-h-[400px]"
                                    >
                                        <div className="relative mb-8">
                                            {/* Animated Rings */}
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 2, opacity: 0 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.2 }}
                                                className="absolute inset-0 rounded-full border border-violet-500/30"
                                            />
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 2.5, opacity: 0 }}
                                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
                                                className="absolute inset-0 rounded-full border border-blue-500/20"
                                            />

                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ type: 'spring', delay: 0.1, duration: 0.8, bounce: 0.4 }}
                                                className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-violet-600/20 to-blue-600/20 border border-violet-500/30 flex items-center justify-center relative z-10 backdrop-blur-md shadow-[0_0_40px_rgba(139,92,246,0.3)]"
                                            >
                                                <motion.div
                                                    initial={{ scale: 0, rotate: -45 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{ type: 'spring', delay: 0.4, duration: 0.6, bounce: 0.6 }}
                                                >
                                                    <CheckCircle className="w-10 h-10 text-violet-400" />
                                                </motion.div>
                                            </motion.div>
                                        </div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5, duration: 0.5 }}
                                            className="space-y-3"
                                        >
                                            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-white">
                                                ¡Mensaje enviado!
                                            </h3>
                                            <p className="text-neutral-400 text-lg max-w-sm mx-auto">
                                                Nos pondremos en contacto a la brevedad.
                                            </p>
                                        </motion.div>

                                        <motion.button
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.7, duration: 0.5 }}
                                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                                            whileTap={{ scale: 0.95 }}
                                            type="button"
                                            onClick={() => setIsSubmitted(false)}
                                            className="mt-10 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-medium transition-colors duration-300 flex items-center gap-2"
                                        >
                                            <Send className="w-4 h-4 text-violet-400" />
                                            Enviar otro mensaje
                                        </motion.button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="form"
                                        initial="hidden"
                                        whileInView="visible"
                                        exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                                        viewport={{ once: true }}
                                        className="grid sm:grid-cols-2 gap-6"
                                    >
                                        {/* Nombre */}
                                        <motion.div custom={0} variants={inputVariants} className="relative">
                                            <label className="block text-neutral-300 text-sm font-medium mb-2">
                                                Nombre
                                            </label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-violet-400 transition-colors" />
                                                <input
                                                    type="text"
                                                    name="nombre"
                                                    value={formData.nombre}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="Tu nombre"
                                                    className="w-full pl-12 pr-4 py-4 bg-black/50 border border-white/10 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
                                                />
                                            </div>
                                        </motion.div>

                                        {/* Empresa */}
                                        <motion.div custom={1} variants={inputVariants} className="relative">
                                            <label className="block text-neutral-300 text-sm font-medium mb-2">
                                                Empresa
                                            </label>
                                            <div className="relative group">
                                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-violet-400 transition-colors" />
                                                <input
                                                    type="text"
                                                    name="empresa"
                                                    value={formData.empresa}
                                                    onChange={handleChange}
                                                    placeholder="Tu empresa"
                                                    className="w-full pl-12 pr-4 py-4 bg-black/50 border border-white/10 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
                                                />
                                            </div>
                                        </motion.div>

                                        {/* Email */}
                                        <motion.div custom={2} variants={inputVariants} className="sm:col-span-2">
                                            <label className="block text-neutral-300 text-sm font-medium mb-2">
                                                Email
                                            </label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-violet-400 transition-colors" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="tu@email.com"
                                                    className="w-full pl-12 pr-4 py-4 bg-black/50 border border-white/10 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
                                                />
                                            </div>
                                        </motion.div>

                                        {/* Mensaje */}
                                        <motion.div custom={3} variants={inputVariants} className="sm:col-span-2">
                                            <label className="block text-neutral-300 text-sm font-medium mb-2">
                                                ¿Qué proceso te gustaría automatizar o desarrollar?
                                            </label>
                                            <div className="relative group">
                                                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-neutral-500 group-focus-within:text-violet-400 transition-colors" />
                                                <textarea
                                                    name="mensaje"
                                                    value={formData.mensaje}
                                                    onChange={handleChange}
                                                    required
                                                    rows={4}
                                                    placeholder="Contanos sobre tu proyecto..."
                                                    className="w-full pl-12 pr-4 py-4 bg-black/50 border border-white/10 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 resize-none"
                                                />
                                            </div>
                                        </motion.div>

                                        {/* Error Message */}
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="sm:col-span-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                                            >
                                                <p className="text-red-400 text-sm text-center">{error}</p>
                                            </motion.div>
                                        )}

                                        {/* Submit Button */}
                                        <motion.div custom={4} variants={inputVariants} className="sm:col-span-2">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full py-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:brightness-110 active:scale-[0.99] transition-all duration-200 ease-out disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:hover:shadow-violet-500/25 flex items-center justify-center gap-3"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                        />
                                                        Enviando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-5 h-5" />
                                                        Agendar consulta
                                                    </>
                                                )}
                                            </button>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
