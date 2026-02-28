'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { SplineScene } from '@/components/ui/splite'
import { Spotlight } from '@/components/ui/spotlight'
import { MobileHeroAnimation } from '@/components/ui/MobileHeroAnimation'
import { ChevronDown } from 'lucide-react'
import { useRef } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

export function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const isMobile = useIsMobile()
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start']
    })

    // Parallax effects
    const textY = useTransform(scrollYProgress, [0, 1], [0, 150])
    const robotY = useTransform(scrollYProgress, [0, 1], [0, -100])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

    return (
        <section ref={sectionRef} id="inicio" className="relative min-h-screen flex items-center overflow-hidden bg-black">
            {/* Background Effects - all pointer-events-none */}
            <motion.div
                style={{ opacity }}
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-black to-black pointer-events-none"
            />
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="rgba(139, 92, 246, 0.3)"
            />
            <Spotlight
                className="top-20 right-0 md:-right-20"
                fill="rgba(59, 130, 246, 0.2)"
            />

            {/* Grid Pattern with parallax */}
            <motion.div
                style={{ opacity }}
                className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                <div className="flex flex-col lg:flex-row items-center min-h-screen pt-32 pb-20 lg:pt-28 lg:pb-0">
                    {/* Left Content with parallax */}
                    <motion.div
                        style={{ y: textY, scale }}
                        className="flex-1 text-center lg:text-left"
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        >
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 mb-6"
                            >
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-violet-300 text-sm font-medium">
                                    IA + Desarrollo de Software a medida
                                </span>
                            </motion.div>

                            {/* Title */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-neutral-400">
                                    Potenciamos tu negocio
                                </span>
                                <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-blue-400 to-violet-400">
                                    con Inteligencia Artificial
                                </span>
                            </h1>

                            {/* Mobile Animation - Between title and subtitle */}
                            <div className="lg:hidden my-8 sm:my-10">
                                <MobileHeroAnimation />
                            </div>

                            {/* Subtitle */}
                            <p className="mt-6 lg:mt-6 text-neutral-400 text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                Chatbots que venden. Automatizaciones que ahorran horas. Software que escala.
                                <span className="text-white font-medium"> Construimos la tecnología que tu negocio necesita para crecer.</span>
                            </p>

                            {/* CTA Buttons */}
                            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <a
                                    href="#contacto"
                                    className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold rounded-full overflow-hidden shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200 ease-out"
                                >
                                    <span className="relative z-10">Automatizar mi negocio</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                </a>
                                <a
                                    href="#servicios"
                                    className="px-8 py-4 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/30 active:scale-[0.98] transition-all duration-200 ease-out"
                                >
                                    Ver servicios
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Content - Desktop Only 3D Robot with parallax */}
                    <motion.div
                        style={{ y: isMobile ? 0 : robotY }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="hidden lg:block flex-1 relative h-[600px] w-full"
                    >
                        {/* Glow effect - pointer-events-none to not block robot interaction */}
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-blue-600/20 rounded-full blur-[100px] opacity-50 pointer-events-none" />

                        {/* Spline container - Desktop only */}
                        <div className="relative z-20 w-full h-full">
                            <SplineScene
                                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                                className="w-full h-full cursor-pointer"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                style={{ opacity }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex flex-col items-center gap-2 text-neutral-500"
                >
                    <span className="text-xs uppercase tracking-widest">Scroll</span>
                    <ChevronDown size={20} />
                </motion.div>
            </motion.div>
        </section>
    )
}
