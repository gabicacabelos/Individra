'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion'
import { Factory, ShieldCheck, Cpu, MapPin, Lock, Wrench } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { AutomotiveIllustration } from './illustrations'

const differentiators = [
    {
        icon: Factory,
        accentRgb: '183, 179, 176',
        label: 'Dominio',
        title: 'Venimos de adentro de la logística automotriz',
        description:
            'Prestación tercerizada dentro de la cadena de suministro de la industria automotriz (ecosistema Peugeot–Stellantis). Conocemos los tiempos, los procesos y las exigencias de calidad de la logística industrial por haberlos operado, no por leerlos en un manual.',
        proof: [
            { icon: MapPin, text: 'Piso de planta, no teoría' },
            { icon: Wrench, text: 'Procesos que ya operamos' },
        ],
        featured: true,
    },
    {
        icon: ShieldCheck,
        accentRgb: '16, 185, 129',
        label: 'Soberanía de datos',
        title: 'Tus datos, en Alemania y bajo GDPR',
        description:
            'Infraestructura propia en Alemania, bajo el estándar de protección de datos más estricto del mundo. Cada cliente corre en su propia instancia: tu información no se mezcla con la de otro. No entrenamos modelos con tus datos, y los proveedores que usamos tampoco lo hacen por contrato. Si algún día te vas, te la llevás.',
        proof: [{ icon: Lock, text: 'Aislamiento por cliente' }],
    },
    {
        icon: Cpu,
        accentRgb: '200, 66, 20',
        label: 'Método',
        title: 'No vendemos magia. Vendemos ingeniería.',
        description:
            'Cada sistema se diseña, se documenta y se mantiene como infraestructura crítica de tu empresa, con acompañamiento técnico humano todos los meses.',
        proof: [{ icon: Wrench, text: 'Documentado y mantenido' }],
    },
]

/** Tarjeta con spotlight que sigue al cursor (patrón spotlight-card) + borde que reacciona. */
function SpotlightCard({
    item,
    index,
    isMobile,
}: {
    item: (typeof differentiators)[number]
    index: number
    isMobile: boolean
}) {
    const Icon = item.icon
    const ref = useRef<HTMLDivElement>(null)
    const mx = useMotionValue(-400)
    const my = useMotionValue(-400)

    const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(${item.accentRgb}, 0.14), transparent 62%)`
    const edge = useMotionTemplate`radial-gradient(320px circle at ${mx}px ${my}px, rgba(${item.accentRgb}, 0.5), transparent 60%)`

    const onMove = (e: React.MouseEvent) => {
        if (isMobile || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        mx.set(e.clientX - r.left)
        my.set(e.clientY - r.top)
    }
    const onLeave = () => {
        mx.set(-400)
        my.set(-400)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-70px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`group relative overflow-hidden rounded-3xl border border-[#3E3D3A] bg-[#16171A] ${
                item.featured ? 'p-7 lg:p-9' : 'p-6 lg:p-7'
            } ${item.featured ? 'lg:col-span-3 lg:row-span-2' : 'lg:col-span-2'}`}
        >
            {/* borde iluminado por el cursor */}
            {!isMobile && (
                <motion.div
                    aria-hidden
                    style={{ background: edge }}
                    className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    // el borde se ve solo en el perímetro
                    // (máscara: relleno recortado por el padding de 1px)
                />
            )}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-[1px] rounded-[23px] bg-[#16171A]"
            />
            {!isMobile && (
                <motion.div
                    aria-hidden
                    style={{ background: spotlight }}
                    className="pointer-events-none absolute inset-[1px] rounded-[23px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
            )}

            {/* glow ambiental */}
            <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-[0.14] blur-[60px] transition-opacity duration-500 group-hover:opacity-30"
                style={{ background: `rgb(${item.accentRgb})` }}
            />

            {item.featured && (
                <AutomotiveIllustration className="pointer-events-none absolute -bottom-4 right-2 w-52 opacity-[0.10] transition-opacity duration-500 group-hover:opacity-[0.18]" />
            )}

            {/* contenido */}
            <div className="relative">
                <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-11 w-11 items-center justify-center rounded-2xl border"
                            style={{
                                borderColor: `rgba(${item.accentRgb},0.35)`,
                                background: `rgba(${item.accentRgb},0.10)`,
                                color: `rgb(${item.accentRgb})`,
                            }}
                        >
                            <Icon className="h-5 w-5" />
                        </div>
                        <span
                            className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]"
                            style={{ color: `rgb(${item.accentRgb})` }}
                        >
                            {item.label}
                        </span>
                    </div>
                    <span className="select-none font-mono text-3xl font-black leading-none text-white/[0.06]">
                        0{index + 1}
                    </span>
                </div>

                <h3
                    className={`font-bold leading-snug text-white ${
                        item.featured ? 'text-2xl lg:text-[28px]' : 'text-lg lg:text-xl'
                    }`}
                >
                    {item.title}
                </h3>
                <p
                    className={`mt-3 leading-relaxed text-neutral-400 ${
                        item.featured ? 'max-w-xl text-[15px]' : 'text-sm'
                    }`}
                >
                    {item.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                    {item.proof.map((p) => {
                        const PIcon = p.icon
                        return (
                            <span
                                key={p.text}
                                className="inline-flex items-center gap-1.5 rounded-full border border-[#3E3D3A] bg-[#1C1D20] px-2.5 py-1 text-[11px] text-neutral-400"
                            >
                                <PIcon className="h-3 w-3" style={{ color: `rgb(${item.accentRgb})` }} />
                                {p.text}
                            </span>
                        )
                    })}
                </div>
            </div>
        </motion.div>
    )
}

export function DifferentiatorsSection() {
    const isMobile = useIsMobile()

    return (
        <section id="diferenciadores" className="relative overflow-hidden bg-[#0B0D0E] py-24 lg:py-32">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#363533]/20 via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

            <div className="relative z-10 mx-auto max-w-6xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    className="mb-12 max-w-3xl lg:mb-16"
                >
                    <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-[#B7B3B0] sm:text-sm">
                        Por qué INDIVIDRA
                    </span>
                    <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                        Lo que{' '}
                        <span className="bg-gradient-to-r from-[#C84214] to-[#B7B3B0] bg-clip-text text-transparent">
                            ningún competidor externo
                        </span>{' '}
                        puede igualar
                    </h2>
                </motion.div>

                {/* Bento asimétrico: el diferencial más fuerte ocupa el bloque grande */}
                <div className="grid gap-5 lg:grid-cols-5 lg:grid-rows-2">
                    {differentiators.map((item, i) => (
                        <SpotlightCard key={item.label} item={item} index={i} isMobile={isMobile} />
                    ))}
                </div>
            </div>
        </section>
    )
}
