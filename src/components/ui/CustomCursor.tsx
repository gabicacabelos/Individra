'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [isClicking, setIsClicking] = useState(false)
    const [isTouchDevice, setIsTouchDevice] = useState(true)

    const rawX = useMotionValue(-100)
    const rawY = useMotionValue(-100)

    // Interpolación suave y elástica para el cursor
    const springConfig = { damping: 28, stiffness: 450, mass: 0.5 }
    const cursorX = useSpring(rawX, springConfig)
    const cursorY = useSpring(rawY, springConfig)

    useEffect(() => {
        // Verificar si es un dispositivo táctil
        if (typeof window === 'undefined') return
        const touch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window
        setIsTouchDevice(touch)
        if (touch) return

        // Ocultar cursor nativo en desktop
        document.documentElement.classList.add('custom-cursor-enabled')

        const handleMouseMove = (e: MouseEvent) => {
            rawX.set(e.clientX)
            rawY.set(e.clientY)
            if (!isVisible) setIsVisible(true)

            // Detectar si está sobre un elemento interactivo
            const target = e.target as HTMLElement | null
            if (target) {
                const clickable = target.closest('a, button, [role="button"], input, select, textarea, .cursor-pointer')
                setIsHovered(!!clickable)
            }
        }

        const handleMouseDown = () => setIsClicking(true)
        const handleMouseUp = () => setIsClicking(false)

        const handleMouseLeave = () => setIsVisible(false)
        const handleMouseEnter = () => setIsVisible(true)

        window.addEventListener('mousemove', handleMouseMove, { passive: true })
        window.addEventListener('mousedown', handleMouseDown)
        window.addEventListener('mouseup', handleMouseUp)
        document.addEventListener('mouseleave', handleMouseLeave)
        document.addEventListener('mouseenter', handleMouseEnter)

        return () => {
            document.documentElement.classList.remove('custom-cursor-enabled')
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mouseup', handleMouseUp)
            document.removeEventListener('mouseleave', handleMouseLeave)
            document.removeEventListener('mouseenter', handleMouseEnter)
        }
    }, [isVisible, rawX, rawY])

    if (isTouchDevice || !isVisible) return null

    return (
        <motion.div
            aria-hidden="true"
            className="fixed top-0 left-0 pointer-events-none z-[999999]"
            style={{
                x: cursorX,
                y: cursorY,
            }}
        >
            {/* Contenedor del Cursor 3D */}
            <motion.div
                animate={{
                    scale: isClicking ? 0.85 : isHovered ? 1.25 : 1,
                    rotate: isHovered ? -12 : -5,
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 350 }}
                className="relative -top-1 -left-1 drop-shadow-[0_4px_12px_rgba(200,66,20,0.55)]"
            >
                {/* SVG de Flecha 3D estilizada en Naranja Quemado (#C84214) */}
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="overflow-visible"
                >
                    <defs>
                        {/* Gradiente principal naranja */}
                        <linearGradient id="cursor-orange-body" x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#FF6A38" />
                            <stop offset="35%" stopColor="#C84214" />
                            <stop offset="100%" stopColor="#8A2505" />
                        </linearGradient>

                        {/* Bisel superior 3D metálico */}
                        <linearGradient id="cursor-bevel-light" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                            <stop offset="50%" stopColor="#FF936B" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#C84214" stopOpacity="0.1" />
                        </linearGradient>

                        {/* Sombra de volumen 3D */}
                        <filter id="cursor-depth-shadow" x="-20%" y="-20%" width="150%" height="150%">
                            <feDropShadow dx="1.5" dy="2.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.75" />
                        </filter>
                    </defs>

                    {/* Base de sombra de profundidad 3D (extrusión) */}
                    <path
                        d="M3 2L13 26L17.5 16.5L27 12L3 2Z"
                        fill="#541602"
                        transform="translate(1.5, 2)"
                        opacity="0.9"
                    />

                    {/* Cuerpo principal de la flecha con bisel facetado */}
                    <path
                        d="M3 2L13 26L17.5 16.5L27 12L3 2Z"
                        fill="url(#cursor-orange-body)"
                        stroke="#FFA380"
                        strokeWidth="1"
                        strokeLinejoin="round"
                    />

                    {/* Cara reflectiva izquierda (luz cenital 3D) */}
                    <path
                        d="M3 2L13 26L17.5 16.5L3 2Z"
                        fill="url(#cursor-bevel-light)"
                        opacity="0.55"
                    />

                    {/* Brillo en la punta activa */}
                    <circle cx="3.5" cy="2.5" r="1.5" fill="#FFF" />
                </svg>

                {/* Aura de pulso sutil cuando está en hover interactivo */}
                {isHovered && (
                    <motion.span
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1.6, opacity: [0.6, 0] }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'easeOut' }}
                        className="absolute top-0 left-0 w-6 h-6 rounded-full bg-[#C84214]/40 -z-10 blur-xs"
                    />
                )}
            </motion.div>
        </motion.div>
    )
}
