'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { InlineWidget } from 'react-calendly'

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

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

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

            <div className="relative z-10 max-w-4xl mx-auto px-1 sm:px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-center mb-12 sm:mb-16"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="inline-block text-violet-400 text-sm font-semibold uppercase tracking-widest"
                    >
                        Agenda tu sesión
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 text-4xl sm:text-5xl font-bold text-white"
                    >
                        Asesoramiento{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400">
                            Estratégico Gratuito
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="mt-6 text-neutral-400 text-lg max-w-xl mx-auto"
                    >
                        Elegí un horario en nuestro calendario. En 30 minutos analizaremos tus cuellos de botella y te propondremos un sistema para escalar sin fricción.
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
                            className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-blue-600/20 rounded-2xl sm:rounded-3xl blur-xl"
                        />
                        <div className="relative p-0 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10 bg-neutral-900/80 backdrop-blur-xl overflow-hidden min-h-[700px] sm:min-h-[600px] flex flex-col items-center justify-center calendly-container">
                            {isMounted ? (
                                <InlineWidget
                                    url="https://calendly.com/individratec/30min?hide_gdpr_banner=1&locale=es-ES"
                                    styles={{ height: '700px', width: '100%', overflow: 'hidden' }}
                                    prefill={{
                                        customAnswers: undefined
                                    }}
                                    pageSettings={{
                                        backgroundColor: '171717',
                                        hideEventTypeDetails: false,
                                        hideLandingPageDetails: false,
                                        primaryColor: '7c3aed',
                                        textColor: 'ffffff'
                                    }}
                                    utm={{}}
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
                            )}

                            {/* Fallback visible si el calendario no carga */}
                            <p className="mt-4 text-sm text-neutral-500 text-center px-6">
                                ¿El calendario no carga?{' '}
                                <a
                                    href="https://wa.me/5491160152435"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors"
                                >
                                    Escribinos por WhatsApp
                                </a>
                                {' '}o a{' '}
                                <a
                                    href="mailto:individratec@gmail.com"
                                    className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors"
                                >
                                    individratec@gmail.com
                                </a>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
