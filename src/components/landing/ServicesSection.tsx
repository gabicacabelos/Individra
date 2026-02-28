'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Bot, Zap, Code2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { MobileServicesBackground } from '@/components/ui/MobileBackgroundEffects'

const services = [
    {
        icon: Zap,
        title: 'Automatización Inteligente',
        description: 'Eliminamos tareas repetitivas de tu día a día. Desde responder consultas en WhatsApp hasta procesar documentos automáticamente, implementamos sistemas que liberan tiempo para lo que realmente importa.',
        gradient: 'from-yellow-500 to-orange-500',
        glowColor: 'rgba(120, 90, 20, 0.15)',
        bgGradient: 'from-yellow-900/5 via-orange-900/3 to-transparent',
    },
    {
        icon: Bot,
        title: 'Agentes y Asistentes IA',
        description: 'Creamos asistentes virtuales personalizados para tu empresa. Chatbots que entienden tu negocio, califican leads, agendan citas y resuelven consultas sin intervención humana.',
        gradient: 'from-violet-500 to-purple-500',
        glowColor: 'rgba(80, 50, 120, 0.15)',
        bgGradient: 'from-violet-900/5 via-purple-900/3 to-transparent',
    },
    {
        icon: Code2,
        title: 'Desarrollo de Software',
        description: 'Diseñamos y construimos aplicaciones web y móviles desde cero. Plataformas, sistemas internos, e-commerce, portales de clientes. Desarrollo fullstack con tecnología moderna y escalable.',
        gradient: 'from-blue-500 to-cyan-500',
        glowColor: 'rgba(30, 60, 100, 0.15)',
        bgGradient: 'from-blue-900/5 via-cyan-900/3 to-transparent',
    },
]

interface Card3DProps {
    service: typeof services[0]
    index: number
}

function Card3D({ service, index }: Card3DProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [rotateX, setRotateX] = useState(0)
    const [rotateY, setRotateY] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return

        const rect = cardRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const mouseX = e.clientX - centerX
        const mouseY = e.clientY - centerY

        const rotateXValue = (mouseY / (rect.height / 2)) * -15
        const rotateYValue = (mouseX / (rect.width / 2)) * 15

        setRotateX(rotateXValue)
        setRotateY(rotateYValue)
    }

    const handleMouseEnter = () => {
        setIsHovered(true)
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        setRotateX(0)
        setRotateY(0)
    }

    const Icon = service.icon

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
                duration: 0.8,
                delay: index * 0.2,
                ease: 'easeOut'
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative cursor-pointer h-full"
            style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
            }}
        >
            {/* Card Container */}
            <motion.div
                animate={{
                    rotateX: rotateX,
                    rotateY: rotateY,
                    scale: isHovered ? 1.01 : 1,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                    mass: 0.5,
                }}
                style={{
                    transformStyle: 'preserve-3d',
                }}
                className="relative h-full"
            >
                {/* Glow effect - subtle */}
                <motion.div
                    animate={{
                        opacity: isHovered ? 0.6 : 0,
                        scale: isHovered ? 1.02 : 1,
                    }}
                    transition={{ duration: 0.4 }}
                    className="absolute -inset-1 rounded-3xl blur-xl -z-10"
                    style={{ backgroundColor: service.glowColor }}
                />

                {/* Main Card */}
                <div
                    className={`relative h-full min-h-[320px] p-8 rounded-3xl border backdrop-blur-sm overflow-hidden transition-all duration-500 ${
                        isHovered
                            ? 'border-white/20 bg-neutral-900/70'
                            : 'border-white/10 bg-neutral-900/50'
                    }`}
                    style={{
                        transformStyle: 'preserve-3d',
                    }}
                >
                    {/* Content with 3D depth */}
                    <div
                        className="relative z-10"
                        style={{
                            transform: isHovered ? 'translateZ(30px)' : 'translateZ(0)',
                            transition: 'transform 0.3s ease',
                        }}
                    >
                        {/* Icon */}
                        <motion.div
                            animate={{
                                scale: isHovered ? 1.05 : 1,
                                rotate: isHovered ? 3 : 0,
                            }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6`}
                            style={{
                                transform: isHovered ? 'translateZ(40px)' : 'translateZ(0)',
                            }}
                        >
                            <Icon className="w-7 h-7 text-white" />
                        </motion.div>

                        {/* Title */}
                        <h3
                            className="text-2xl font-bold text-white mb-4"
                            style={{
                                transform: isHovered ? 'translateZ(25px)' : 'translateZ(0)',
                                transition: 'transform 0.3s ease',
                            }}
                        >
                            {service.title}
                        </h3>

                        {/* Description */}
                        <p
                            className={`leading-relaxed transition-colors duration-300 ${
                                isHovered ? 'text-neutral-300' : 'text-neutral-400'
                            }`}
                            style={{
                                transform: isHovered ? 'translateZ(20px)' : 'translateZ(0)',
                                transition: 'transform 0.3s ease',
                            }}
                        >
                            {service.description}
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
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
        <section ref={sectionRef} id="servicios" className="relative py-32 bg-black overflow-hidden">
            {/* Mobile animated background */}
            <MobileServicesBackground />

            {/* Background Effects with parallax */}
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

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-center mb-20"
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
                        className="mt-4 text-4xl sm:text-5xl font-bold text-white"
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
                        className="mt-6 text-neutral-400 text-lg max-w-2xl mx-auto"
                    >
                        Combinamos inteligencia artificial con desarrollo de software para crear
                        soluciones personalizadas que transforman tu operación.
                    </motion.p>
                </motion.div>

                {/* Services Grid with 3D Cards */}
                <div className="grid md:grid-cols-3 gap-8 items-stretch">
                    {services.map((service, index) => (
                        <Card3D key={index} service={service} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}
