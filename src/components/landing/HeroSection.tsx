'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { MobileHeroAnimation } from '@/components/ui/MobileHeroAnimation'
import { MorphingText } from '@/components/ui/morphing-text'
import { ChevronDown, ArrowRight, Layers } from 'lucide-react'
import { useRef } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

const RHYTHM_PHRASES = [
    'Te llega un WhatsApp apenas entra el reclamo, con el reloj corriendo.',
    'Sabés en todo momento cuántos reclamos te quedan antes de perder el verde.',
    '¿Cobrás por WhatsApp? Validás la transferencia y bajás el stock en todos tus canales con 1 clic.',
]

export function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const isMobile = useIsMobile()
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    })

    const textY = useTransform(scrollYProgress, [0, 1], [0, 150])
    const robotY = useTransform(scrollYProgress, [0, 1], [0, -100])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

    return (
        <section
            ref={sectionRef}
            id="inicio"
            className="relative min-h-screen flex items-center overflow-hidden bg-[#0B0D0E]"
        >
            {/* Background Effects */}
            <motion.div
                style={{ opacity }}
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C84214]/10 via-[#0B0D0E] to-[#0B0D0E] pointer-events-none"
            />

            {/* Grid Pattern */}
            <motion.div
                style={{ opacity }}
                className="absolute inset-0 bg-[linear-gradient(rgba(183,179,176,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(183,179,176,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                <div className="flex flex-col lg:flex-row items-center min-h-screen pt-32 pb-20 lg:pt-28 lg:pb-0 gap-8">
                    {/* Left Content */}
                    <motion.div
                        style={{ y: textY, scale }}
                        className="flex-1 text-center lg:text-left"
                    >
                        <div className="hero-intro">
                            {/* Specific ICP Eyebrow */}
                            <p className="hero-eyebrow text-xs sm:text-sm font-mono font-medium tracking-[0.16em] uppercase text-[#FFA380] mb-4">
                                Para vendedores de Mercado Libre · Reclamos y reputación
                            </p>

                            {/* Title */}
                            <h1
                                className="text-[1.75rem] sm:text-5xl lg:text-[3.25rem] xl:text-[3.65rem] font-heading font-extrabold leading-[1.12] tracking-tight"
                                style={{ wordBreak: 'keep-all', overflowWrap: 'normal' }}
                            >
                                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-neutral-200">
                                    Un reclamo que se te pasa te baja de color.
                                </span>
                                <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF5520] via-[#FF7A4D] to-[#FFA380]">
                                    Con INDIVIDRA no se te pasa ninguno.
                                </span>
                            </h1>

                            {/* Mobile Animation */}
                            <div className="lg:hidden my-6">
                                <MobileHeroAnimation />
                            </div>

                            {/* Subtitle */}
                            <p className="mt-4 sm:mt-6 lg:mt-6 text-neutral-300 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
                                Mercado Libre te avisa entre decenas de notificaciones. Nosotros te escribimos por WhatsApp apenas entra el reclamo, con{' '}
                                <span className="text-white font-semibold underline decoration-[#FF5520]/50 underline-offset-4">
                                    el plazo exacto para responder y cuántos reclamos te quedan antes de perder el verde
                                </span>
                                . Respondés a tiempo, cuidás tu exposición y seguís vendiendo. ¿Además cobrás por WhatsApp? Con <strong className="text-white">Venta Blindada</strong> validás la transferencia y bajás el stock en todos tus canales con 1 clic.
                            </p>

                            {/* Rhythm line */}
                            <MorphingText
                                texts={RHYTHM_PHRASES}
                                srText={RHYTHM_PHRASES.join(' ')}
                                className="mt-4 h-12 sm:h-10 max-w-2xl mx-auto lg:mx-0"
                                textClassName="justify-center lg:justify-start text-sm sm:text-base lg:text-lg font-mono font-bold text-[#FF5520]"
                            />

                            {/* CTA Buttons */}
                            <div className="mt-8 sm:mt-10 pb-6 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
                                <a
                                    href="/diagnostico?origen=home_meli"
                                    className="group relative px-7 py-4 bg-gradient-to-r from-[#FF5520] via-[#FF6E40] to-[#FF5520] hover:brightness-110 text-white text-base font-heading font-bold rounded-2xl overflow-hidden shadow-[0_4px_30px_rgba(255,85,32,0.4)] active:scale-[0.98] transition-all duration-300 ease-out whitespace-nowrap inline-flex items-center justify-center gap-2.5 cursor-pointer"
                                >
                                    <span>Ver cuántos reclamos me quedan (2 min)</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                                </a>
                                <a
                                    href="#consola-operativa"
                                    className="px-6 py-4 border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-neutral-200 hover:text-white text-base font-mono font-medium rounded-2xl active:scale-[0.98] transition-all duration-200 ease-out whitespace-nowrap inline-flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Layers className="w-4 h-4 text-[#FF5520]" />
                                    Ver cómo funciona
                                </a>
                            </div>
                            <p className="-mt-2 text-xs sm:text-sm text-neutral-400 font-mono">
                                Piloto de 30 días · Sin permanencia · Arrancamos en modo solo lectura
                            </p>
                        </div>
                    </motion.div>

                    {/* Right Content - Free-floating 3D Emblem in space */}
                    <motion.div
                        style={{ y: isMobile ? 0 : robotY }}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, delay: 0.2 }}
                        className="hidden lg:flex flex-1 justify-center items-center relative w-full h-[580px]"
                    >
                        <div className="anim-float-y [--float-y:-14px] [--float-dur:4.5s] relative z-20 w-[490px] h-[490px] xl:w-[540px] xl:h-[540px] flex items-center justify-center pointer-events-none">
                            <div className="relative w-[460px] h-[460px] xl:w-[510px] xl:h-[510px]">
                                <Image
                                    src="/individra-3d-floating.png"
                                    alt="Emblema 3D de INDIVIDRA"
                                    width={900}
                                    height={900}
                                    quality={95}
                                    sizes="(max-width: 640px) 384px, (max-width: 1024px) 512px, 900px"
                                    className="w-full h-full object-contain"
                                    priority
                                />
                            </div>
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
                <div className="anim-float-y [--float-y:10px] [--float-dur:2s] flex flex-col items-center gap-2 text-neutral-500">
                    <span className="text-xs uppercase tracking-widest">Scroll</span>
                    <ChevronDown size={20} />
                </div>
            </motion.div>
        </section>
    )
}
