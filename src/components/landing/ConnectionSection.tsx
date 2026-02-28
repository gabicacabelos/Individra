'use client'

import { useRef, useState, useMemo } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { ScrollModel3D } from '@/components/ui/ScrollModel3D'
import { MobileProcessAnimation } from '@/components/ui/MobileProcessAnimation'
import { Search, Lightbulb, Cpu, Rocket, BarChart, ArrowRight } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'

const steps = [
    {
        id: 1,
        icon: Search,
        number: '01',
        label: 'Descubrimiento',
        title: 'Entendemos tu negocio',
        description: 'Auditoría de procesos e identificación de oportunidades.',
        color: 'from-blue-500 to-cyan-500',
        glowColor: 'rgba(59,130,246,0.3)',
    },
    {
        id: 2,
        icon: Lightbulb,
        number: '02',
        label: 'Estrategia',
        title: 'Diseñamos la solución',
        description: 'Arquitectura personalizada y selección de herramientas IA.',
        color: 'from-indigo-500 to-violet-500',
        glowColor: 'rgba(139,92,246,0.3)',
    },
    {
        id: 3,
        icon: Cpu,
        number: '03',
        label: 'Desarrollo',
        title: 'Construimos tu sistema',
        description: 'Desarrollo, entrenamiento de modelos y prompts a medida.',
        color: 'from-violet-500 to-purple-500',
        glowColor: 'rgba(168,85,247,0.3)',
    },
    {
        id: 4,
        icon: Rocket,
        number: '04',
        label: 'Implementación',
        title: 'Lanzamos y conectamos',
        description: 'Despliegue, integración y capacitación de tu equipo.',
        color: 'from-pink-500 to-rose-500',
        glowColor: 'rgba(236,72,153,0.3)',
    },
    {
        id: 5,
        icon: BarChart,
        number: '05',
        label: 'Optimización',
        title: 'Mejoramos continuamente',
        description: 'Monitoreo, análisis y optimización constante.',
        color: 'from-emerald-500 to-teal-500',
        glowColor: 'rgba(16,185,129,0.3)',
    },
]

export function ConnectionSection() {
    const containerRef = useRef<HTMLElement>(null)
    const [scrollProgress, setScrollProgress] = useState(0)
    const [activeStep, setActiveStep] = useState(0)
    const lastUpdateRef = useRef(0)
    const isMobile = useIsMobile()

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    })

    // Throttled scroll handler - only update state when step changes or significant progress
    useMotionValueEvent(scrollYProgress, 'change', (latest) => {
        const newStepIndex = Math.min(Math.floor(latest * steps.length), steps.length - 1)

        // Only update if step changed or progress changed by more than 2%
        if (newStepIndex !== activeStep || Math.abs(latest - lastUpdateRef.current) > 0.02) {
            lastUpdateRef.current = latest
            setScrollProgress(latest)
            setActiveStep(newStepIndex)
        }
    })

    // All transforms declared at component level (not inline)
    const modelOpacity = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [0, 1, 1, 0])
    const titleY = useTransform(scrollYProgress, [0, 0.1], [30, 0])
    const titleOpacity = useTransform(scrollYProgress, [0, 0.08], [0, 1])
    const ctaOpacity = useTransform(scrollYProgress, [0.8, 0.95], [0, 1])
    const ctaY = useTransform(scrollYProgress, [0.8, 0.95], [20, 0])
    const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
    const bgX1 = useTransform(scrollYProgress, [0, 1], [-100, 100])
    const bgX2 = useTransform(scrollYProgress, [0, 1], [100, -100])

    // Memoize the current step data
    const currentStep = useMemo(() => steps[activeStep], [activeStep])

    return (
        <section
            ref={containerRef}
            id="proceso"
            className="relative bg-black"
            style={{ height: isMobile ? '350vh' : '500vh' }}
        >
            {/* Sticky container */}
            <div className="sticky top-0 h-screen overflow-hidden">
                {/* Background effects - hidden on mobile for performance */}
                <div className="absolute inset-0 hidden md:block">
                    <motion.div
                        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[80px] will-change-transform"
                        style={{
                            background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
                            x: bgX1,
                        }}
                    />
                    <motion.div
                        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[60px] will-change-transform"
                        style={{
                            background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
                            x: bgX2,
                        }}
                    />
                </div>

                {/* Mobile background - simpler */}
                <div className="absolute inset-0 md:hidden bg-gradient-to-b from-violet-950/20 via-transparent to-blue-950/20" />

                {/* Grid pattern - smaller on mobile */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:40px_40px] md:bg-[size:80px_80px]" />

                {/* Content */}
                <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="h-full flex flex-col justify-center lg:flex-row lg:items-center gap-2 sm:gap-4 lg:gap-16 pt-4 sm:pt-10 lg:pt-20">

                        {/* Mobile: 3D Model at top */}
                        <motion.div
                            className="lg:hidden relative h-[140px] sm:h-[200px] flex-shrink-0 will-change-opacity"
                            style={{ opacity: modelOpacity }}
                        >
                            {/* Glow effect - simplified with CSS transition */}
                            <div
                                className="absolute inset-0 rounded-full blur-[40px] transition-all duration-700"
                                style={{
                                    background: `radial-gradient(circle, ${currentStep.glowColor} 0%, transparent 70%)`,
                                }}
                            />
                            {!isMobile ? (
                                <ScrollModel3D
                                    scrollProgress={scrollProgress}
                                    className="relative z-10"
                                />
                            ) : (
                                <MobileProcessAnimation
                                    activeStep={activeStep}
                                    scrollProgress={scrollProgress}
                                    glowColor={currentStep.glowColor}
                                    IconComponent={currentStep.icon}
                                    totalSteps={steps.length}
                                />
                            )}
                            {/* Step indicator on mobile */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2">
                                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400">
                                    {currentStep.number}
                                </span>
                                <span className="text-white/80 text-sm font-medium">{currentStep.label}</span>
                            </div>
                        </motion.div>

                        {/* Text content */}
                        <motion.div className="flex-none lg:flex-1 space-y-2 lg:space-y-6 pb-2 sm:pb-0">
                            {/* Section header */}
                            <motion.div style={{ y: titleY, opacity: titleOpacity }}>
                                <span className="text-violet-400 text-xs sm:text-sm font-semibold uppercase tracking-widest">
                                    Nuestro Proceso
                                </span>
                                <h2 className="mt-2 lg:mt-3 text-2xl sm:text-3xl lg:text-5xl font-bold text-white leading-tight">
                                    De la idea al{' '}
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400">
                                        resultado
                                    </span>
                                </h2>
                                <p className="mt-2 lg:mt-4 text-neutral-400 text-sm lg:text-lg hidden sm:block">
                                    Un proceso probado que garantiza implementaciones exitosas.
                                </p>
                            </motion.div>

                            {/* Timeline Steps */}
                            <div className="relative space-y-1 sm:space-y-2">
                                {/* Vertical progress line */}
                                <div className="absolute left-[18px] sm:left-[23px] top-3 bottom-3 w-[2px] bg-neutral-800">
                                    <motion.div
                                        className="w-full bg-gradient-to-b from-violet-500 via-blue-500 to-emerald-500"
                                        style={{
                                            height: `${((activeStep + 1) / steps.length) * 100}%`,
                                        }}
                                    />
                                </div>

                                {steps.map((step, index) => {
                                    const Icon = step.icon
                                    const isActive = index === activeStep
                                    const isPast = index < activeStep

                                    return (
                                        <div
                                            key={step.id}
                                            className={`relative flex items-start gap-3 sm:gap-4 py-1.5 px-2 sm:p-3 rounded-xl transition-all duration-300 ${
                                                isActive ? 'bg-white/5 opacity-100' : isPast ? 'opacity-60' : 'opacity-40'
                                            }`}
                                            style={{
                                                transform: isActive ? 'scale(1)' : 'scale(0.98)',
                                            }}
                                        >
                                            {/* Icon */}
                                            <div className="relative z-10 flex-shrink-0">
                                                <div
                                                    className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-500 ${isActive
                                                        ? `bg-gradient-to-br ${step.color} shadow-lg`
                                                        : isPast
                                                            ? 'bg-neutral-800'
                                                            : 'bg-neutral-900 border border-neutral-800'
                                                        }`}
                                                >
                                                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive || isPast ? 'text-white' : 'text-neutral-500'}`} />
                                                </div>
                                                {/* Pulse effect - desktop only */}
                                                {isActive && !isMobile && (
                                                    <motion.div
                                                        initial={{ scale: 1, opacity: 0.5 }}
                                                        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        className={`absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br ${step.color} -z-10`}
                                                    />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0 pt-0.5 sm:pt-1">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className={`text-[10px] sm:text-xs font-mono transition-colors duration-300 ${isActive ? 'text-violet-400' : 'text-neutral-600'}`}>
                                                        {step.number}
                                                    </span>
                                                    <span className={`text-[10px] sm:text-xs uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-white/80' : 'text-neutral-500'}`}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                                <h3 className={`text-sm sm:text-base font-semibold transition-colors duration-300 ${isActive ? 'text-white' : 'text-neutral-400'}`}>
                                                    {step.title}
                                                </h3>
                                                {isActive && (
                                                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed animate-fade-in">
                                                        {step.description}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Arrow for active - hidden on mobile */}
                                            {isActive && (
                                                <div className="flex-shrink-0 pt-1 sm:pt-2 hidden sm:block">
                                                    <ArrowRight className="w-4 h-4 text-violet-400" />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* CTA */}
                            <motion.div
                                style={{
                                    opacity: ctaOpacity,
                                    y: ctaY,
                                }}
                                className="pt-1 sm:pt-4"
                            >
                                <a
                                    href="#contacto"
                                    className="group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm sm:text-base font-semibold rounded-full hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300"
                                >
                                    Comenzar ahora
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </motion.div>
                        </motion.div>

                        {/* Desktop: 3D Model on right */}
                        <motion.div
                            className="hidden lg:block relative h-[550px] flex-1"
                            style={{ opacity: modelOpacity }}
                        >
                            {/* Glow effect behind model */}
                            <motion.div
                                className="absolute inset-0 rounded-full blur-[100px]"
                                animate={{
                                    background: `radial-gradient(circle, ${steps[activeStep].glowColor} 0%, transparent 70%)`,
                                }}
                                transition={{ duration: 0.8 }}
                            />

                            {/* Model */}
                            <ScrollModel3D
                                scrollProgress={scrollProgress}
                                className="relative z-10"
                            />

                            {/* Step number display */}
                            <motion.div
                                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center"
                                key={activeStep}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <span className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400">
                                    {steps[activeStep].number}
                                </span>
                                <p className="mt-1 text-white font-medium text-lg">{steps[activeStep].label}</p>
                            </motion.div>

                            {/* Floating indicators */}
                            <motion.div
                                className="absolute top-10 right-10 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm"
                                animate={{
                                    y: [0, -5, 0],
                                    opacity: [0.8, 1, 0.8],
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <span className="text-emerald-400 text-xs font-medium flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Activo
                                </span>
                            </motion.div>

                            {/* Orbiting rings */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                <motion.circle
                                    cx="50%"
                                    cy="45%"
                                    r="100"
                                    fill="none"
                                    stroke="url(#processGradient1)"
                                    strokeWidth="1"
                                    strokeDasharray="8 6"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                                    style={{ transformOrigin: 'center 45%' }}
                                />
                                <motion.circle
                                    cx="50%"
                                    cy="45%"
                                    r="140"
                                    fill="none"
                                    stroke="url(#processGradient2)"
                                    strokeWidth="1"
                                    strokeDasharray="12 8"
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
                                    style={{ transformOrigin: 'center 45%' }}
                                />
                                <defs>
                                    <linearGradient id="processGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="rgba(139,92,246,0.3)" />
                                        <stop offset="100%" stopColor="rgba(59,130,246,0.3)" />
                                    </linearGradient>
                                    <linearGradient id="processGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="rgba(59,130,246,0.2)" />
                                        <stop offset="100%" stopColor="rgba(16,185,129,0.2)" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </motion.div>
                    </div>
                </div>

                {/* Progress bar at bottom */}
                <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2">
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className={`h-1 rounded-full transition-all duration-500 ${index === activeStep
                                ? `w-6 sm:w-8 bg-gradient-to-r ${step.color}`
                                : index < activeStep
                                    ? 'w-3 sm:w-4 bg-neutral-600'
                                    : 'w-3 sm:w-4 bg-neutral-800'
                                }`}
                        />
                    ))}
                </div>

                {/* Scroll hint - hidden on mobile */}
                <motion.div
                    className="absolute bottom-6 right-6 hidden sm:block"
                    style={{
                        opacity: scrollHintOpacity,
                    }}
                >
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex flex-col items-center gap-1 text-neutral-600"
                    >
                        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
                        <div className="w-4 h-6 rounded-full border border-neutral-700 flex justify-center pt-1">
                            <motion.div
                                animate={{ y: [0, 6, 0], opacity: [1, 0, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-0.5 h-0.5 rounded-full bg-neutral-500"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
