'use client'

/**
 * Animaciones SVG on-brand para la landing de Logística.
 * Todo es decorativo (aria-hidden). Se respeta prefers-reduced-motion.
 */

import { motion, useReducedMotion } from 'framer-motion'
import { useIsMobile } from '@/hooks/use-mobile'

type Props = { className?: string }

const stroke = {
    fill: 'none',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
}

/* =====================================================================
   FONDO — Orbs blur ambientales + divisor de ruta animado
   ===================================================================== */
export function AmbientOrbs({ className }: Props) {
    const reduce = useReducedMotion()
    const isMobile = useIsMobile()
    // Dos blurs de 130px animados son de lo más caro que hay para la GPU mobile.
    if (reduce || isMobile) return null
    return (
        <div className={className} aria-hidden>
            <motion.div
                className="absolute top-10 -left-24 w-[28rem] h-[28rem] rounded-full blur-[130px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(200,66,20,0.14) 0%, transparent 70%)' }}
                animate={{ x: [0, 50, 0], y: [0, 40, 0] }}
                transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute bottom-10 -right-24 w-[28rem] h-[28rem] rounded-full blur-[130px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(62,61,58,0.30) 0%, transparent 70%)' }}
                animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
                transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
            />
        </div>
    )
}

/* Divisor: línea de ruta con paquete/vehículo que la recorre */
export function RouteDivider({ className }: Props) {
    const reduce = useReducedMotion()
    return (
        <svg viewBox="0 0 1200 40" className={className} preserveAspectRatio="none" role="img" aria-hidden xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="div-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(200,66,20,0)" />
                    <stop offset="50%" stopColor="rgba(200,66,20,0.6)" />
                    <stop offset="100%" stopColor="rgba(183,179,176,0)" />
                </linearGradient>
            </defs>
            <line x1="0" y1="20" x2="1200" y2="20" stroke="url(#div-grad)" strokeWidth="2" strokeDasharray="2 10" {...stroke}>
                {!reduce && <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1.2s" repeatCount="indefinite" />}
            </line>
            {!reduce && (
                <motion.circle
                    cy="20" r="4" fill="#C84214"
                    animate={{ cx: [-20, 1220] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                />
            )}
        </svg>
    )
}
