'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Sparkles } from 'lucide-react'

interface Interactive3DCardProps {
    src: string
    alt?: string
    className?: string
    label?: string
    title?: string
    description?: string
    href?: string
}

export function Interactive3DImage({
    src,
    alt = '',
    className = '',
    label = 'Próximamente',
    title = 'Experiencias Inmersivas',
    description = 'Llevamos tu marca al siguiente nivel',
    href = '#contacto'
}: Interactive3DCardProps) {
    const containerRef = useRef<HTMLAnchorElement>(null)

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const springConfig = { stiffness: 150, damping: 20 }
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig)
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig)

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const normalizedX = (e.clientX - rect.left - rect.width / 2) / rect.width
        const normalizedY = (e.clientY - rect.top - rect.height / 2) / rect.height
        mouseX.set(normalizedX)
        mouseY.set(normalizedY)
    }

    const handleMouseLeave = () => {
        mouseX.set(0)
        mouseY.set(0)
    }

    return (
        <motion.a
            href={href}
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`group relative block ${className}`}
            style={{ perspective: 1000 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            whileHover={{ scale: 1.02 }}
        >
            {/* Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-pink-500/20 via-violet-500/20 to-orange-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Card */}
            <motion.div
                className="relative p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 backdrop-blur-md overflow-hidden"
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            >
                {/* Label badge */}
                <div className="flex items-center gap-1.5 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-violet-400">
                        {label}
                    </span>
                </div>

                {/* Image */}
                <div className="relative mb-4" style={{ transform: 'translateZ(30px)' }}>
                    <img
                        src={src}
                        alt={alt}
                        className="w-full h-auto drop-shadow-lg"
                    />
                </div>

                {/* Content */}
                <div style={{ transform: 'translateZ(20px)' }}>
                    <h4 className="text-white font-semibold text-sm mb-1">{title}</h4>
                    <p className="text-neutral-400 text-xs leading-relaxed">{description}</p>
                </div>

                {/* Hover arrow indicator */}
                <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>

                {/* Shine effect */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 55%, transparent 60%)',
                        x: useTransform(mouseX, [-0.5, 0.5], [-150, 150]),
                    }}
                />
            </motion.div>
        </motion.a>
    )
}
