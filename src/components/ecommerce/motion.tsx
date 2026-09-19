'use client'

import { motion, useReducedMotion } from 'framer-motion'

/**
 * Flotación continua para los renders 3D.
 * Se desactiva si el sistema pide menos movimiento: una animación infinita
 * es exactamente lo que molesta a quien activó esa preferencia.
 */
export function Float({
    children,
    delay = 0,
    distance = 6,
    duration = 4,
}: {
    children: React.ReactNode
    delay?: number
    distance?: number
    duration?: number
}) {
    const reduce = useReducedMotion()
    if (reduce) return <>{children}</>
    return (
        <motion.div
            animate={{ y: [-distance, distance] }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
            }}
        >
            {children}
        </motion.div>
    )
}

/**
 * Anillos que se expanden desde el centro, tipo ping de radar.
 * Se usa detrás del botón de encendido: comunica "esto está prendido y
 * escuchando" mejor que cualquier texto al lado.
 */
export function Ripple({ count = 2 }: { count?: number }) {
    const reduce = useReducedMotion()
    if (reduce) return null
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <motion.span
                    key={i}
                    aria-hidden
                    className="absolute inset-0 rounded-full border border-[#C84214]"
                    initial={{ scale: 0.9, opacity: 0.55 }}
                    animate={{ scale: 2.1, opacity: 0 }}
                    transition={{
                        duration: 2.8,
                        delay: i * 1.4,
                        repeat: Infinity,
                        ease: 'easeOut',
                    }}
                />
            ))}
        </>
    )
}
