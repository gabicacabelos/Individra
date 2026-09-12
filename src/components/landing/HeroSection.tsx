'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { SplineScene } from '@/components/ui/splite'
import { Spotlight } from '@/components/ui/spotlight'
import { MobileHeroAnimation } from '@/components/ui/MobileHeroAnimation'
import { MorphingText } from '@/components/ui/morphing-text'

// A nivel de módulo: identidad estable entre renders.
const RHYTHM_PHRASES = [
    'Menos carga manual.',
    'Menos teléfonos sonando.',
    'Menos depender de que alguien se acuerde.',
]
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
        <section ref={sectionRef} id="inicio" className="relative min-h-screen flex items-center overflow-hidden bg-[#0B0D0E]">
            {/* Background Effects - all pointer-events-none */}
            <motion.div
                style={{ opacity }}
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C84214]/10 via-[#0B0D0E] to-[#0B0D0E] pointer-events-none"
            />
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="rgba(200, 66, 20, 0.12)"
            />
            <Spotlight
                className="top-20 right-0 md:-right-20"
                fill="rgba(183, 179, 176, 0.08)"
            />

            {/* Grid Pattern with parallax */}
            <motion.div
                style={{ opacity }}
                className="absolute inset-0 bg-[linear-gradient(rgba(183,179,176,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(183,179,176,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                <div className="flex flex-col lg:flex-row items-center min-h-screen pt-32 pb-20 lg:pt-28 lg:pb-0 gap-8">
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
                            {/* Eyebrow — limpio, técnico y sin cartelito de IA slop */}
                            <motion.p
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xs sm:text-sm font-mono font-medium tracking-[0.2em] uppercase text-[#B7B3B0] mb-4"
                            >
                                Ingeniería de Software & IA B2B
                            </motion.p>

                            {/* Title */}
                            <h1 className="text-[1.7rem] sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight" style={{ wordBreak: 'keep-all', overflowWrap: 'normal' }}>
                                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-neutral-300">
                                    Tu operación
                                </span>
                                <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C84214] via-[#D44A17] to-[#B7B3B0]">
                                    no puede tomarse vacaciones.
                                </span>
                            </h1>

                            {/* Mobile Animation - Between title and subtitle */}
                            <div className="lg:hidden my-6">
                                <MobileHeroAnimation />
                            </div>

                            {/* Subtitle */}
                            <p className="mt-4 sm:mt-6 lg:mt-6 text-[#B7B3B0] text-base sm:text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                Si tu PyME se frena cuando la persona que sabe todo se toma una semana, tenés un
                                <span className="text-[#E8E5DE] font-semibold"> problema de ingeniería, no de personal.</span>{' '}
                                Construimos los sistemas que hoy viven en la cabeza de tu equipo.
                            </p>

                            {/* Rhythm line — transiciona entre las tres frases */}
                            <MorphingText
                                texts={RHYTHM_PHRASES}
                                srText={RHYTHM_PHRASES.join(' ')}
                                className="mt-4 h-12 sm:h-10 max-w-2xl mx-auto lg:mx-0"
                                textClassName="justify-center lg:justify-start text-base sm:text-lg lg:text-xl font-semibold text-[#C84214]"
                            />

                            {/* CTA Buttons */}
                            <div className="mt-8 sm:mt-10 pb-6 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
                                <a
                                    href="https://wa.me/5491160152435?text=%C2%A1Hola%20Individra!%20Me%20interesa%20agendar%20una%20auditor%C3%ADa%20gratuita."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative px-6 py-3 sm:px-7 sm:py-3.5 md:px-8 md:py-4 bg-[#C84214] text-white text-sm sm:text-base font-bold rounded-full overflow-hidden shadow-lg shadow-[#C84214]/25 hover:shadow-[#C84214]/40 hover:bg-[#B3390F] active:scale-[0.98] transition-all duration-300 ease-out whitespace-nowrap inline-flex items-center justify-center"
                                >
                                    <span className="relative z-10 transition-transform duration-300 group-hover:scale-[1.02] inline-block">Agendar Auditoría Gratuita</span>
                                </a>
                                <a
                                    href="#servicios"
                                    className="px-6 py-3 sm:px-7 sm:py-3.5 md:px-8 md:py-4 border border-[#B7B3B0]/40 text-[#E8E5DE] text-sm sm:text-base font-semibold rounded-full hover:bg-[#B7B3B0]/10 hover:border-[#E8E5DE] active:scale-[0.98] transition-all duration-200 ease-out whitespace-nowrap inline-flex items-center justify-center"
                                >
                                    Ver servicios
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Content - Free-floating 3D Scene in space (sin recuadro) */}
                    <motion.div
                        style={{ y: isMobile ? 0 : robotY }}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, delay: 0.2 }}
                        className="hidden lg:flex flex-1 justify-center items-center relative w-full h-[580px]"
                    >
                        {/* Atmospheric Smoke Gray Fog Behind 3D Scene */}
                        <div
                            aria-hidden
                            className="absolute -inset-10 bg-[radial-gradient(ellipse_at_center,_rgba(110,108,106,0.22)_0%,_rgba(62,61,58,0.12)_45%,_transparent_72%)] blur-3xl pointer-events-none"
                        />

                        {/* Looping ambient pulse glow in Burnt Orange and Smoke Gray */}
                        <motion.div
                            animate={{
                                scale: [1, 1.15, 1],
                                opacity: [0.15, 0.35, 0.15],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="absolute w-[440px] h-[440px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(200,66,20,0.18)_0%,_rgba(54,53,51,0.25)_45%,_transparent_70%)] blur-3xl pointer-events-none"
                        />

                        {/* Free-Floating 3D Emblem Container */}
                        <motion.div
                            animate={{
                                y: [0, -18, 0],
                                rotateZ: [0, 0.6, 0, -0.6, 0],
                            }}
                            transition={{
                                y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
                                rotateZ: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
                            }}
                            className="relative z-20 w-[440px] h-[440px] flex items-center justify-center pointer-events-none"
                        >
                            {/* Outer Orbital Telemetry Ring 1 - Clockwise */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
                                className="absolute w-[470px] h-[470px] rounded-full border border-dashed border-[#B7B3B0]/30"
                            />

                            {/* Inner Orbital Telemetry Ring 2 - Counter-Clockwise */}
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
                                className="absolute w-[400px] h-[400px] rounded-full border border-[#B7B3B0]/20"
                                style={{ strokeDasharray: '6 14' }}
                            />

                            {/* Tilted Elliptical Gyro Ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                                className="absolute w-[490px] h-[340px] rounded-[100%] border border-[#3E3D3A]/40 transform -rotate-12"
                            />

                            {/* The 3D Titanium Core - Free floating with seamless radial blending */}
                            <div className="relative w-[380px] h-[380px] [mask-image:radial-gradient(circle_at_50%_50%,black_48%,rgba(0,0,0,0.85)_62%,transparent_78%)] [-webkit-mask-image:radial-gradient(circle_at_50%_50%,black_48%,rgba(0,0,0,0.85)_62%,transparent_78%)]">
                                <Image
                                    src="/individra-3d-floating.png"
                                    alt="INDIVIDRA 3D Titanium Core"
                                    width={760}
                                    height={760}
                                    className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
                                    priority
                                />
                            </div>
                        </motion.div>
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
