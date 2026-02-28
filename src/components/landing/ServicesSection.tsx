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

// SVG Filter for electric effect - ONLY FOR DESKTOP
function ElectricFilters() {
    return (
        <svg className="absolute w-0 h-0 hidden lg:block" aria-hidden="true">
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

// Desktop Card with dramatic electric border (heavy effect - OK for desktop)
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
        >
            <div
                style={{
                    padding: '2px',
                    borderRadius: '24px',
                    position: 'relative',
                    background: `linear-gradient(-30deg, rgba(${service.electricColorRgb}, 0.3), transparent, rgba(${service.electricColorRgb}, 0.3)), linear-gradient(to bottom, rgb(23, 23, 23), rgb(23, 23, 23))`,
                }}
            >
                <div className="relative">
                    <div
                        style={{
                            border: `2px solid rgba(${service.electricColorRgb}, 0.5)`,
                            borderRadius: '24px',
                            paddingRight: '4px',
                            paddingBottom: '4px',
                        }}
                    >
                        <div
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

                <div className="absolute inset-0 p-8 flex flex-col">
                    <div className={`absolute inset-0 pointer-events-none overflow-hidden rounded-3xl transition-opacity duration-300 ${showShine ? 'opacity-100' : 'opacity-0'}`}>
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

// Mobile Carousel - Optimized for performance
function MobileCarousel() {
    const [activeIndex, setActiveIndex] = useState(1)

    const goToPrev = () => setActiveIndex((prev) => (prev === 0 ? services.length - 1 : prev - 1))
    const goToNext = () => setActiveIndex((prev) => (prev === services.length - 1 ? 0 : prev + 1))

    return (
        <div className="relative px-4" style={{ contain: 'layout style' }}>
            <div
                className="relative h-[360px] flex items-center justify-center"
                style={{ perspective: '800px' }}
            >
                {services.map((service, index) => {
                    const isActive = index === activeIndex
                    const isPrev = index === (activeIndex === 0 ? services.length - 1 : activeIndex - 1)
                    const isNext = index === (activeIndex === services.length - 1 ? 0 : activeIndex + 1)

                    let transform = 'translateX(0) scale(0.6)'
                    let zIndex = 0
                    let opacity = 0

                    if (isActive) {
                        transform = 'translateX(0) scale(1)'
                        zIndex = 30
                        opacity = 1
                    } else if (isPrev) {
                        transform = 'translateX(-55%) scale(0.75)'
                        zIndex = 10
                        opacity = 0.5
                    } else if (isNext) {
                        transform = 'translateX(55%) scale(0.75)'
                        zIndex = 10
                        opacity = 0.5
                    }

                    return (
                        <div
                            key={index}
                            className="absolute w-[270px]"
                            style={{
                                transform,
                                zIndex,
                                opacity,
                                transition: 'transform 0.4s ease-out, opacity 0.4s ease-out',
                                willChange: 'transform, opacity',
                            }}
                            onClick={() => setActiveIndex(index)}
                        >
                            <MobileCard service={service} isActive={isActive} />
                        </div>
                    )
                })}
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-6 mt-2">
                <button
                    onClick={goToPrev}
                    className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white active:scale-95"
                    style={{ transition: 'transform 0.15s' }}
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-2">
                    {services.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className="h-2 rounded-full"
                            style={{
                                width: index === activeIndex ? '24px' : '8px',
                                backgroundColor: index === activeIndex ? '#8b5cf6' : 'rgba(255,255,255,0.3)',
                                transition: 'width 0.3s, background-color 0.3s',
                            }}
                        />
                    ))}
                </div>

                <button
                    onClick={goToNext}
                    className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white active:scale-95"
                    style={{ transition: 'transform 0.15s' }}
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}

// Mobile Card - CSS electric border (NO SVG filter - much lighter)
function MobileCard({ service, isActive }: { service: typeof services[0], isActive: boolean }) {
    const Icon = service.icon

    return (
        <div
            className="relative h-[300px]"
            style={{ contain: 'layout style paint' }}
        >
            {/* CSS Electric Border - GPU accelerated */}
            <div
                className="absolute inset-0 rounded-[18px] overflow-hidden"
                style={{ padding: '2px' }}
            >
                <div
                    className="electric-border-mobile"
                    style={{
                        '--electric-color': service.electricColor,
                    } as React.CSSProperties}
                />
            </div>

            {/* Card background */}
            <div
                className="relative h-full rounded-[18px] bg-neutral-900/95 border border-white/5 overflow-hidden"
                style={{ margin: '2px' }}
            >
                {/* Content */}
                <div className="p-5 flex flex-col h-full">
                    <div
                        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4`}
                        style={{ boxShadow: `0 4px 20px rgba(${service.electricColorRgb}, 0.3)` }}
                    >
                        <Icon className="w-5 h-5 text-white" />
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">{service.description}</p>
                </div>

                {/* Subtle glow line at top */}
                <div
                    className="absolute top-0 left-4 right-4 h-px"
                    style={{
                        background: `linear-gradient(90deg, transparent, ${service.electricColor}, transparent)`,
                        opacity: isActive ? 0.6 : 0.3,
                        transition: 'opacity 0.3s',
                    }}
                />
            </div>

            <style jsx>{`
                .electric-border-mobile {
                    position: absolute;
                    inset: -50%;
                    background: conic-gradient(
                        from 0deg,
                        transparent 0deg,
                        var(--electric-color) 20deg,
                        transparent 60deg,
                        transparent 170deg,
                        var(--electric-color) 190deg,
                        transparent 230deg,
                        transparent 360deg
                    );
                    animation: electricSpinMobile 3s linear infinite;
                    will-change: transform;
                }
                @keyframes electricSpinMobile {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
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
            {/* SVG Filters - DESKTOP ONLY */}
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
                <div className="text-center mb-12 lg:mb-16 px-6">
                    <span className="inline-block text-violet-400 text-sm font-semibold uppercase tracking-widest">
                        Nuestros Servicios
                    </span>
                    <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                        Servicios que{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400">
                            impulsan tu negocio
                        </span>
                    </h2>
                    <p className="mt-6 text-neutral-400 text-base lg:text-lg max-w-2xl mx-auto">
                        Combinamos inteligencia artificial con desarrollo de software para crear
                        soluciones personalizadas que transforman tu operación.
                    </p>
                </div>

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
