'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Bot, Zap, Code2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { MobileServicesBackground } from '@/components/ui/MobileBackgroundEffects'

const services = [
    {
        icon: Zap,
        title: 'Automatización Inteligente',
        description: 'Eliminamos tareas repetitivas de tu día a día. Desde responder consultas en WhatsApp hasta procesar documentos automáticamente.',
        gradient: 'from-yellow-500 to-orange-500',
        electricColor: '#eab308',
        electricColorRgb: '234, 179, 8',
    },
    {
        icon: Bot,
        title: 'Agentes y Asistentes IA',
        description: 'Creamos asistentes virtuales personalizados. Chatbots que entienden tu negocio, califican leads y agendan citas.',
        gradient: 'from-violet-500 to-purple-500',
        electricColor: '#8b5cf6',
        electricColorRgb: '139, 92, 246',
    },
    {
        icon: Code2,
        title: 'Desarrollo de Software',
        description: 'Diseñamos aplicaciones web y móviles desde cero. Plataformas, sistemas internos, e-commerce con tecnología moderna.',
        gradient: 'from-blue-500 to-cyan-500',
        electricColor: '#3b82f6',
        electricColorRgb: '59, 130, 246',
    },
]

// SVG Filter for electric effect - one per card color
function ElectricFilters() {
    return (
        <svg className="absolute w-0 h-0" aria-hidden="true">
            <defs>
                {services.map((_, index) => (
                    <filter
                        key={index}
                        id={`electric-filter-${index}`}
                        colorInterpolationFilters="sRGB"
                        x="-20%"
                        y="-20%"
                        width="140%"
                        height="140%"
                    >
                        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed={index + 1} />
                        <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
                            <animate attributeName="dy" values="500; 0" dur="5s" repeatCount="indefinite" calcMode="linear" />
                        </feOffset>

                        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed={index + 1} />
                        <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
                            <animate attributeName="dy" values="0; -500" dur="5s" repeatCount="indefinite" calcMode="linear" />
                        </feOffset>

                        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise3" seed={index + 2} />
                        <feOffset in="noise3" dx="0" dy="0" result="offsetNoise3">
                            <animate attributeName="dx" values="350; 0" dur="5s" repeatCount="indefinite" calcMode="linear" />
                        </feOffset>

                        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise4" seed={index + 2} />
                        <feOffset in="noise4" dx="0" dy="0" result="offsetNoise4">
                            <animate attributeName="dx" values="0; -350" dur="5s" repeatCount="indefinite" calcMode="linear" />
                        </feOffset>

                        <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
                        <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
                        <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />

                        <feDisplacementMap in="SourceGraphic" in2="combinedNoise" scale="25" xChannelSelector="R" yChannelSelector="B" />
                    </filter>
                ))}
            </defs>
        </svg>
    )
}

// Desktop Card with dramatic electric border
function DesktopCard({ service, index }: { service: typeof services[0], index: number }) {
    const [isHovered, setIsHovered] = useState(false)
    const [showShine, setShowShine] = useState(false)
    const Icon = service.icon

    useEffect(() => {
        const interval = setInterval(() => {
            setShowShine(true)
            setTimeout(() => setShowShine(false), 800)
        }, 4000 + index * 500)
        return () => clearInterval(interval)
    }, [index])

    return (
        <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: index * 0.2, ease: 'easeOut' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative cursor-pointer group"
            style={{
                '--electric-color': service.electricColor,
                '--electric-rgb': service.electricColorRgb,
            } as React.CSSProperties}
        >
            {/* Card Container with electric effect */}
            <div
                className="electric-card-container"
                style={{
                    padding: '2px',
                    borderRadius: '24px',
                    position: 'relative',
                    background: `linear-gradient(-30deg, rgba(${service.electricColorRgb}, 0.3), transparent, rgba(${service.electricColorRgb}, 0.3)), linear-gradient(to bottom, rgb(23, 23, 23), rgb(23, 23, 23))`,
                }}
            >
                {/* Inner container with borders */}
                <div className="relative">
                    {/* Outer border */}
                    <div
                        style={{
                            border: `2px solid rgba(${service.electricColorRgb}, 0.5)`,
                            borderRadius: '24px',
                            paddingRight: '4px',
                            paddingBottom: '4px',
                        }}
                    >
                        {/* Main electric border - the one with filter */}
                        <div
                            className="electric-main-border"
                            style={{
                                width: '100%',
                                height: '340px',
                                borderRadius: '24px',
                                border: `2px solid ${service.electricColor}`,
                                marginTop: '-4px',
                                marginLeft: '-4px',
                                filter: `url(#electric-filter-${index})`,
                            }}
                        />
                    </div>

                    {/* Glow layer 1 */}
                    <div
                        style={{
                            border: `2px solid rgba(${service.electricColorRgb}, 0.6)`,
                            borderRadius: '24px',
                            position: 'absolute',
                            inset: 0,
                            filter: 'blur(1px)',
                            pointerEvents: 'none',
                        }}
                    />

                    {/* Glow layer 2 */}
                    <div
                        style={{
                            border: `2px solid ${service.electricColor}`,
                            borderRadius: '24px',
                            position: 'absolute',
                            inset: 0,
                            filter: 'blur(4px)',
                            pointerEvents: 'none',
                        }}
                    />
                </div>



                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col">
                    {/* Shine effect */}
                    <div
                        className={`absolute inset-0 pointer-events-none overflow-hidden rounded-3xl transition-opacity duration-300 ${showShine ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                            style={{ animation: showShine ? 'shinePass 0.8s ease-out' : 'none' }}
                        />
                    </div>

                    <motion.div
                        animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? 5 : 0 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 shadow-lg`}
                    >
                        <Icon className="w-7 h-7 text-white" />
                    </motion.div>

                    <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>

                    <p className={`leading-relaxed transition-colors duration-300 ${isHovered ? 'text-neutral-300' : 'text-neutral-400'}`}>
                        {service.description}
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes shinePass {
                    from { transform: translateX(-100%) skewX(-12deg); }
                    to { transform: translateX(200%) skewX(-12deg); }
                }
            `}</style>
        </motion.div>
    )
}

// Mobile 3D Carousel
function MobileCarousel() {
    const [activeIndex, setActiveIndex] = useState(1)

    const goToPrev = () => setActiveIndex((prev) => (prev === 0 ? services.length - 1 : prev - 1))
    const goToNext = () => setActiveIndex((prev) => (prev === services.length - 1 ? 0 : prev + 1))

    const getCardStyle = (index: number) => {
        const diff = index - activeIndex
        const normalizedDiff = ((diff + services.length + 1) % services.length) - 1

        if (normalizedDiff === 0) {
            return { transform: 'translateX(0) scale(1) translateZ(0)', zIndex: 30, opacity: 1 }
        } else if (normalizedDiff === -1 || (activeIndex === 0 && index === services.length - 1)) {
            return { transform: 'translateX(-60%) scale(0.8) translateZ(-100px)', zIndex: 10, opacity: 0.5 }
        } else if (normalizedDiff === 1 || (activeIndex === services.length - 1 && index === 0)) {
            return { transform: 'translateX(60%) scale(0.8) translateZ(-100px)', zIndex: 10, opacity: 0.5 }
        }
        return { transform: 'translateX(0) scale(0.5)', zIndex: 0, opacity: 0 }
    }

    return (
        <div className="relative px-4">
            <div className="relative h-[380px] flex items-center justify-center" style={{ perspective: '1000px' }}>
                {services.map((service, index) => {
                    const style = getCardStyle(index)
                    const isActive = index === activeIndex

                    return (
                        <div
                            key={index}
                            className="absolute w-[280px] transition-all duration-500 ease-out cursor-pointer"
                            style={{ ...style, transformStyle: 'preserve-3d' }}
                            onClick={() => setActiveIndex(index)}
                        >
                            <MobileCard service={service} index={index} isActive={isActive} />
                        </div>
                    )
                })}
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-6 mt-4">
                <button
                    onClick={goToPrev}
                    className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white active:scale-95 transition-transform"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex gap-2">
                    {services.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-6 bg-violet-500' : 'w-2 bg-white/30'}`}
                        />
                    ))}
                </div>

                <button
                    onClick={goToNext}
                    className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white active:scale-95 transition-transform"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    )
}

// Mobile Card with electric border
function MobileCard({ service, index, isActive }: { service: typeof services[0], index: number, isActive: boolean }) {
    const Icon = service.icon
    const [showShine, setShowShine] = useState(false)

    useEffect(() => {
        if (!isActive) return
        const interval = setInterval(() => {
            setShowShine(true)
            setTimeout(() => setShowShine(false), 600)
        }, 4000)
        return () => clearInterval(interval)
    }, [isActive])

    return (
        <div
            className="relative h-[320px]"
            style={{
                '--electric-color': service.electricColor,
                '--electric-rgb': service.electricColorRgb,
            } as React.CSSProperties}
        >
            {/* Electric border container */}
            <div
                style={{
                    padding: '2px',
                    borderRadius: '20px',
                    position: 'relative',
                    background: `linear-gradient(-30deg, rgba(${service.electricColorRgb}, 0.25), transparent, rgba(${service.electricColorRgb}, 0.25)), linear-gradient(to bottom, rgb(23, 23, 23), rgb(23, 23, 23))`,
                }}
            >
                <div className="relative">
                    {/* Outer border */}
                    <div
                        style={{
                            border: `1.5px solid rgba(${service.electricColorRgb}, 0.4)`,
                            borderRadius: '20px',
                            paddingRight: '3px',
                            paddingBottom: '3px',
                        }}
                    >
                        {/* Main electric border */}
                        <div
                            style={{
                                width: '100%',
                                height: '310px',
                                borderRadius: '20px',
                                border: `1.5px solid ${service.electricColor}`,
                                marginTop: '-3px',
                                marginLeft: '-3px',
                                filter: `url(#electric-filter-${index})`,
                            }}
                        />
                    </div>

                    {/* Glow layers */}
                    <div
                        style={{
                            border: `1.5px solid rgba(${service.electricColorRgb}, 0.5)`,
                            borderRadius: '20px',
                            position: 'absolute',
                            inset: 0,
                            filter: 'blur(1px)',
                            pointerEvents: 'none',
                        }}
                    />
                    <div
                        style={{
                            border: `1.5px solid ${service.electricColor}`,
                            borderRadius: '20px',
                            position: 'absolute',
                            inset: 0,
                            filter: 'blur(3px)',
                            pointerEvents: 'none',
                        }}
                    />
                </div>


                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col overflow-hidden rounded-[20px]">
                    {/* Shine */}
                    {showShine && (
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 pointer-events-none"
                            style={{ animation: 'mobileShine 0.6s ease-out' }}
                        />
                    )}

                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>

                    <p className="text-neutral-400 text-sm leading-relaxed">{service.description}</p>
                </div>
            </div>

            <style jsx>{`
                @keyframes mobileShine {
                    from { transform: translateX(-100%) skewX(-12deg); }
                    to { transform: translateX(200%) skewX(-12deg); }
                }
            `}</style>
        </div>
    )
}

export function ServicesSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start']
    })

    const backgroundY = useTransform(scrollYProgress, [0, 1], [100, -100])
    const lineWidth = useTransform(scrollYProgress, [0, 0.5], ['0%', '100%'])

    return (
        <section ref={sectionRef} id="servicios" className="relative py-24 lg:py-32 bg-black overflow-hidden">
            {/* SVG Filters for electric effect */}
            <ElectricFilters />

            {/* Mobile animated background */}
            <MobileServicesBackground />

            {/* Background Effects */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent"
            />

            {/* Animated line */}
            <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
                <motion.div
                    style={{ width: lineWidth }}
                    className="h-full bg-gradient-to-r from-transparent via-violet-500 to-transparent mx-auto"
                />
            </div>

            <div className="relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-center mb-16 px-6"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="inline-block text-violet-400 text-sm font-semibold uppercase tracking-widest"
                    >
                        Nuestros Servicios
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
                    >
                        Servicios que{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400">
                            impulsan tu negocio
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="mt-6 text-neutral-400 text-base lg:text-lg max-w-2xl mx-auto"
                    >
                        Combinamos inteligencia artificial con desarrollo de software para crear
                        soluciones personalizadas que transforman tu operación.
                    </motion.p>
                </motion.div>

                {/* Desktop Grid */}
                <div className="hidden lg:block max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <DesktopCard key={index} service={service} index={index} />
                        ))}
                    </div>
                </div>

                {/* Mobile Carousel */}
                <div className="lg:hidden">
                    <MobileCarousel />
                </div>
            </div>
        </section>
    )
}
