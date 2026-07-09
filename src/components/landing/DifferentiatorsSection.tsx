'use client'

import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'
import { Factory, ShieldCheck, Cpu } from 'lucide-react'
import { useRef } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

const differentiators = [
    {
        icon: Factory,
        accent: 'from-blue-500 to-cyan-500',
        accentRgb: '59, 130, 246',
        label: 'Dominio',
        title: 'Venimos de adentro de la logística automotriz',
        description:
            'Prestación tercerizada dentro de la cadena de suministro de la industria automotriz (ecosistema Peugeot–Stellantis). Conocemos los tiempos, los procesos y las exigencias de calidad de la logística industrial por haberlos operado, no por leerlos en un manual.',
    },
    {
        icon: ShieldCheck,
        accent: 'from-emerald-500 to-teal-500',
        accentRgb: '16, 185, 129',
        label: 'Soberanía de datos',
        title: 'Tus datos, en Alemania y bajo GDPR',
        description:
            'Alojamos todo en infraestructura propia en Alemania, bajo GDPR, el estándar de protección de datos más estricto del mundo. Aislamiento por cliente: tu información nunca se mezcla con la de otro ni se usa para entrenar modelos de terceros. Si algún día te vas, te la llevás.',
    },
    {
        icon: Cpu,
        accent: 'from-violet-500 to-purple-500',
        accentRgb: '139, 92, 246',
        label: 'Método',
        title: 'No vendemos magia. Vendemos ingeniería.',
        description:
            'Cada sistema se diseña, se documenta y se mantiene como infraestructura crítica de tu empresa, con acompañamiento técnico humano todos los meses.',
    },
]

function TiltCard({ item, index, isMobile }: { item: typeof differentiators[0]; index: number; isMobile: boolean }) {
    const Icon = item.icon
    const ref = useRef<HTMLDivElement>(null)

    // Normalized pointer position (0..1)
    const mx = useMotionValue(0.5)
    const my = useMotionValue(0.5)

    const rotateX = useSpring(useTransform(my, [0, 1], [9, -9]), { stiffness: 150, damping: 18 })
    const rotateY = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 150, damping: 18 })

    const spotX = useTransform(mx, (v) => `${v * 100}%`)
    const spotY = useTransform(my, (v) => `${v * 100}%`)
    const spotlight = useMotionTemplate`radial-gradient(320px circle at ${spotX} ${spotY}, rgba(${item.accentRgb}, 0.18), transparent 65%)`

    const handleMove = (e: React.MouseEvent) => {
        if (isMobile || !ref.current) return
        const rect = ref.current.getBoundingClientRect()
        mx.set((e.clientX - rect.left) / rect.width)
        my.set((e.clientY - rect.top) / rect.height)
    }
    const handleLeave = () => {
        mx.set(0.5)
        my.set(0.5)
    }

    const depth = (z: number) => (isMobile ? undefined : { transform: `translateZ(${z}px)` })

    return (
        <motion.div
            initial={{ opacity: 0, y: 40, rotateX: -12 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: index * 0.12, type: 'spring', stiffness: 110, damping: 18 }}
            style={{ perspective: 1100 }}
            className="h-full"
        >
            <motion.div
                ref={ref}
                onMouseMove={handleMove}
                onMouseLeave={handleLeave}
                style={{
                    rotateX: isMobile ? 0 : rotateX,
                    rotateY: isMobile ? 0 : rotateY,
                    transformStyle: 'preserve-3d',
                }}
                className="group relative h-full p-6 lg:p-7 rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-md overflow-hidden transition-colors duration-300 hover:border-white/25"
            >
                {/* Cursor spotlight (desktop) */}
                {!isMobile && (
                    <motion.div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{ background: spotlight }}
                    />
                )}

                {/* Ambient corner glow */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-16 -right-16 w-44 h-44 rounded-full blur-[60px] opacity-25 group-hover:opacity-50 transition-opacity duration-500"
                    style={{ background: `rgb(${item.accentRgb})` }}
                />

                {/* Top accent hairline */}
                <div
                    aria-hidden
                    className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent to-transparent`}
                    style={{ backgroundImage: `linear-gradient(90deg, transparent, rgba(${item.accentRgb},0.7), transparent)` }}
                />

                {/* Label + index */}
                <div className="relative flex items-center justify-between mb-5" style={depth(30)}>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: `rgb(${item.accentRgb})` }}>
                        {item.label}
                    </span>
                    <span className="text-4xl font-black leading-none text-white/5 select-none">0{index + 1}</span>
                </div>

                {/* Icon */}
                <motion.div
                    style={depth(50)}
                    animate={isMobile ? undefined : { y: [0, -6, 0] }}
                    transition={isMobile ? undefined : { duration: 4 + index, repeat: Infinity, ease: 'easeInOut' }}
                    className={`relative w-[52px] h-[52px] rounded-2xl bg-gradient-to-br ${item.accent} flex items-center justify-center mb-5 shadow-lg`}
                >
                    <span aria-hidden className="absolute inset-0 rounded-2xl blur-md opacity-50" style={{ background: `rgb(${item.accentRgb})` }} />
                    <Icon className="relative w-6 h-6 text-white" />
                </motion.div>

                <h3 className="relative text-lg lg:text-xl font-bold text-white mb-3 leading-snug" style={depth(35)}>
                    {item.title}
                </h3>
                <p className="relative text-neutral-400 text-sm leading-relaxed" style={depth(20)}>
                    {item.description}
                </p>
            </motion.div>
        </motion.div>
    )
}

export function DifferentiatorsSection() {
    const isMobile = useIsMobile()

    return (
        <section id="diferenciadores" className="relative py-24 lg:py-32 bg-black overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent pointer-events-none" />
            {!isMobile && (
                <>
                    <motion.div
                        aria-hidden
                        className="absolute top-10 -left-20 w-96 h-96 rounded-full blur-[110px] pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)' }}
                        animate={{ x: [0, 60, 0], y: [0, 30, 0] }}
                        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        aria-hidden
                        className="absolute bottom-0 -right-20 w-96 h-96 rounded-full blur-[110px] pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)' }}
                        animate={{ x: [0, -50, 0], y: [0, -20, 0] }}
                        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </>
            )}
            {/* Grid texture */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.025)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    className="text-center mb-14 lg:mb-20"
                >
                    <span className="inline-block text-violet-400 text-sm font-semibold uppercase tracking-widest">
                        Por qué INDIVIDRA
                    </span>
                    <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                        Lo que{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400">
                            ningún competidor externo
                        </span>{' '}
                        puede igualar
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {differentiators.map((item, i) => (
                        <TiltCard key={i} item={item} index={i} isMobile={isMobile} />
                    ))}
                </div>
            </div>
        </section>
    )
}
