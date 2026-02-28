'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'

// Floating geometric shapes for services section
export function MobileServicesBackground() {
    const shapes = useMemo(() => [
        // Floating triangles
        { type: 'triangle', x: 10, y: 15, size: 20, rotation: 45, delay: 0 },
        { type: 'triangle', x: 85, y: 25, size: 15, rotation: -30, delay: 1 },
        { type: 'triangle', x: 20, y: 70, size: 18, rotation: 60, delay: 2 },
        { type: 'triangle', x: 90, y: 80, size: 12, rotation: -45, delay: 0.5 },

        // Circles
        { type: 'circle', x: 5, y: 40, size: 8, delay: 0.3 },
        { type: 'circle', x: 95, y: 50, size: 6, delay: 1.5 },
        { type: 'circle', x: 15, y: 90, size: 10, delay: 2.5 },
        { type: 'circle', x: 80, y: 10, size: 5, delay: 0.8 },

        // Squares
        { type: 'square', x: 50, y: 5, size: 12, rotation: 45, delay: 1.2 },
        { type: 'square', x: 30, y: 85, size: 8, rotation: 30, delay: 0.7 },
        { type: 'square', x: 70, y: 60, size: 10, rotation: -20, delay: 1.8 },
    ], [])

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none md:hidden">
            {/* Animated gradient orbs */}
            <motion.div
                className="absolute w-64 h-64 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
                    left: '-10%',
                    top: '20%',
                }}
                animate={{
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute w-48 h-48 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
                    right: '-5%',
                    bottom: '30%',
                }}
                animate={{
                    x: [0, -20, 0],
                    y: [0, 30, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
            />

            {/* Floating shapes */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="servicesShapeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(139,92,246,0.3)" />
                        <stop offset="100%" stopColor="rgba(59,130,246,0.1)" />
                    </linearGradient>
                    <linearGradient id="servicesShapeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(59,130,246,0.3)" />
                        <stop offset="100%" stopColor="rgba(16,185,129,0.1)" />
                    </linearGradient>
                </defs>

                {shapes.map((shape, i) => {
                    if (shape.type === 'circle') {
                        return (
                            <motion.circle
                                key={`shape-${i}`}
                                cx={`${shape.x}%`}
                                cy={`${shape.y}%`}
                                r={shape.size}
                                fill={i % 2 === 0 ? "url(#servicesShapeGrad1)" : "url(#servicesShapeGrad2)"}
                                animate={{
                                    cy: [`${shape.y}%`, `${shape.y - 5}%`, `${shape.y}%`],
                                    opacity: [0.3, 0.6, 0.3],
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 4 + Math.random() * 2,
                                    delay: shape.delay,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        )
                    }
                    if (shape.type === 'triangle') {
                        const size = shape.size
                        return (
                            <motion.polygon
                                key={`shape-${i}`}
                                points={`0,${size} ${size/2},0 ${size},${size}`}
                                fill="none"
                                stroke={i % 2 === 0 ? "rgba(139,92,246,0.3)" : "rgba(59,130,246,0.3)"}
                                strokeWidth="1"
                                style={{
                                    transform: `translate(${shape.x}%, ${shape.y}%) rotate(${shape.rotation}deg)`,
                                    transformBox: 'fill-box',
                                    transformOrigin: 'center',
                                }}
                                animate={{
                                    rotate: [shape.rotation || 0, (shape.rotation || 0) + 180, (shape.rotation || 0) + 360],
                                    opacity: [0.2, 0.5, 0.2],
                                }}
                                transition={{
                                    rotate: { duration: 15 + Math.random() * 10, repeat: Infinity, ease: "linear" },
                                    opacity: { duration: 3, delay: shape.delay, repeat: Infinity, ease: "easeInOut" }
                                }}
                            />
                        )
                    }
                    if (shape.type === 'square') {
                        return (
                            <motion.rect
                                key={`shape-${i}`}
                                x={`${shape.x}%`}
                                y={`${shape.y}%`}
                                width={shape.size}
                                height={shape.size}
                                fill="none"
                                stroke={i % 2 === 0 ? "rgba(139,92,246,0.25)" : "rgba(16,185,129,0.25)"}
                                strokeWidth="1"
                                animate={{
                                    rotate: [shape.rotation || 0, (shape.rotation || 0) + 90],
                                    opacity: [0.2, 0.4, 0.2],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                    opacity: { duration: 4, delay: shape.delay, repeat: Infinity, ease: "easeInOut" },
                                    scale: { duration: 5, delay: shape.delay, repeat: Infinity, ease: "easeInOut" }
                                }}
                                style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                            />
                        )
                    }
                    return null
                })}

                {/* Connecting lines that pulse */}
                <motion.line
                    x1="10%" y1="20%"
                    x2="30%" y2="40%"
                    stroke="rgba(139,92,246,0.2)"
                    strokeWidth="1"
                    strokeDasharray="5 5"
                    animate={{
                        opacity: [0.1, 0.3, 0.1],
                        strokeDashoffset: [0, 20],
                    }}
                    transition={{
                        opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                        strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear" }
                    }}
                />
                <motion.line
                    x1="70%" y1="30%"
                    x2="90%" y2="60%"
                    stroke="rgba(59,130,246,0.2)"
                    strokeWidth="1"
                    strokeDasharray="5 5"
                    animate={{
                        opacity: [0.1, 0.3, 0.1],
                        strokeDashoffset: [0, -20],
                    }}
                    transition={{
                        opacity: { duration: 3, delay: 1, repeat: Infinity, ease: "easeInOut" },
                        strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear" }
                    }}
                />
            </svg>

            {/* Floating particles */}
            {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                    key={`particle-${i}`}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                        left: `${10 + Math.random() * 80}%`,
                        top: `${10 + Math.random() * 80}%`,
                        backgroundColor: i % 3 === 0
                            ? 'rgba(139,92,246,0.6)'
                            : i % 3 === 1
                                ? 'rgba(59,130,246,0.6)'
                                : 'rgba(16,185,129,0.6)',
                    }}
                    animate={{
                        y: [0, -30 - Math.random() * 20, 0],
                        x: [0, (Math.random() - 0.5) * 20, 0],
                        opacity: [0, 0.8, 0],
                        scale: [0.5, 1.5, 0.5],
                    }}
                    transition={{
                        duration: 4 + Math.random() * 3,
                        delay: Math.random() * 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    )
}

// Tech grid animation for catalog section
export function MobileCatalogBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none md:hidden">
            <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="catalogGridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(139,92,246,0.5)">
                            <animate attributeName="stop-color"
                                values="rgba(139,92,246,0.5);rgba(59,130,246,0.5);rgba(139,92,246,0.5)"
                                dur="5s" repeatCount="indefinite"/>
                        </stop>
                        <stop offset="100%" stopColor="rgba(59,130,246,0.3)">
                            <animate attributeName="stop-color"
                                values="rgba(59,130,246,0.3);rgba(16,185,129,0.3);rgba(59,130,246,0.3)"
                                dur="5s" repeatCount="indefinite"/>
                        </stop>
                    </linearGradient>

                    <pattern id="catalogGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="0.5"/>
                    </pattern>
                </defs>

                {/* Animated grid */}
                <rect width="100%" height="100%" fill="url(#catalogGrid)" />

                {/* Scanning line effect */}
                <motion.rect
                    x="0"
                    width="100%"
                    height="2"
                    fill="url(#catalogGridGrad)"
                    animate={{
                        y: ['-10%', '110%'],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />

                {/* Vertical scanning line */}
                <motion.rect
                    y="0"
                    width="2"
                    height="100%"
                    fill="url(#catalogGridGrad)"
                    animate={{
                        x: ['-10%', '110%'],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 2
                    }}
                />

                {/* Random highlight cells */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <motion.rect
                        key={`cell-${i}`}
                        x={`${Math.floor(Math.random() * 8) * 12.5}%`}
                        y={`${Math.floor(Math.random() * 8) * 12.5}%`}
                        width="50"
                        height="50"
                        fill={i % 2 === 0 ? "rgba(139,92,246,0.1)" : "rgba(59,130,246,0.1)"}
                        animate={{
                            opacity: [0, 0.5, 0],
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            delay: Math.random() * 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </svg>

            {/* Data flow particles */}
            {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                    key={`data-${i}`}
                    className="absolute w-1 h-4 rounded-full"
                    style={{
                        left: `${10 + (i * 8)}%`,
                        background: `linear-gradient(to bottom, transparent, ${
                            i % 2 === 0 ? 'rgba(139,92,246,0.8)' : 'rgba(59,130,246,0.8)'
                        }, transparent)`,
                    }}
                    animate={{
                        y: ['-20%', '120%'],
                        opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        delay: Math.random() * 5,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            ))}

            {/* Corner accents */}
            <motion.div
                className="absolute top-4 left-4 w-12 h-12"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-violet-500/60 to-transparent" />
                <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-violet-500/60 to-transparent" />
            </motion.div>
            <motion.div
                className="absolute top-4 right-4 w-12 h-12"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
                <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-blue-500/60 to-transparent" />
                <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-blue-500/60 to-transparent" />
            </motion.div>
            <motion.div
                className="absolute bottom-4 left-4 w-12 h-12"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-violet-500/60 to-transparent" />
                <div className="absolute bottom-0 left-0 w-[1px] h-full bg-gradient-to-t from-violet-500/60 to-transparent" />
            </motion.div>
            <motion.div
                className="absolute bottom-4 right-4 w-12 h-12"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            >
                <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-blue-500/60 to-transparent" />
                <div className="absolute bottom-0 right-0 w-[1px] h-full bg-gradient-to-t from-blue-500/60 to-transparent" />
            </motion.div>
        </div>
    )
}

// Floating orbs for FAQ section
export function MobileFAQBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none md:hidden">
            {/* Large blurred orbs */}
            <motion.div
                className="absolute w-72 h-72 rounded-full opacity-20"
                style={{
                    background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
                    left: '-20%',
                    top: '10%',
                    filter: 'blur(40px)',
                }}
                animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute w-64 h-64 rounded-full opacity-15"
                style={{
                    background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)',
                    right: '-15%',
                    bottom: '20%',
                    filter: 'blur(40px)',
                }}
                animate={{
                    x: [0, -40, 0],
                    y: [0, -20, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
            />

            {/* Question mark particles */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                {Array.from({ length: 6 }).map((_, i) => (
                    <motion.text
                        key={`q-${i}`}
                        x={`${15 + i * 15}%`}
                        y={`${20 + (i % 3) * 30}%`}
                        fill={i % 2 === 0 ? "rgba(139,92,246,0.15)" : "rgba(59,130,246,0.15)"}
                        fontSize="24"
                        fontWeight="bold"
                        animate={{
                            y: [`${20 + (i % 3) * 30}%`, `${15 + (i % 3) * 30}%`, `${20 + (i % 3) * 30}%`],
                            opacity: [0.1, 0.25, 0.1],
                            rotate: [-10, 10, -10],
                        }}
                        transition={{
                            duration: 5 + Math.random() * 3,
                            delay: i * 0.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                    >
                        ?
                    </motion.text>
                ))}

                {/* Floating dots */}
                {Array.from({ length: 15 }).map((_, i) => (
                    <motion.circle
                        key={`dot-${i}`}
                        cx={`${Math.random() * 100}%`}
                        cy={`${Math.random() * 100}%`}
                        r={1 + Math.random() * 2}
                        fill={i % 3 === 0 ? "rgba(139,92,246,0.4)" : i % 3 === 1 ? "rgba(59,130,246,0.4)" : "rgba(16,185,129,0.4)"}
                        animate={{
                            opacity: [0, 0.6, 0],
                            scale: [0.5, 1.5, 0.5],
                            cy: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 4,
                            delay: Math.random() * 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </svg>

            {/* Subtle wave effect at bottom */}
            <svg className="absolute bottom-0 left-0 w-full h-24" preserveAspectRatio="none" viewBox="0 0 400 100">
                <motion.path
                    d="M0,50 Q100,20 200,50 T400,50 L400,100 L0,100 Z"
                    fill="url(#faqWaveGrad)"
                    animate={{
                        d: [
                            "M0,50 Q100,20 200,50 T400,50 L400,100 L0,100 Z",
                            "M0,50 Q100,80 200,50 T400,50 L400,100 L0,100 Z",
                            "M0,50 Q100,20 200,50 T400,50 L400,100 L0,100 Z",
                        ],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <defs>
                    <linearGradient id="faqWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(139,92,246,0.05)" />
                        <stop offset="50%" stopColor="rgba(59,130,246,0.08)" />
                        <stop offset="100%" stopColor="rgba(139,92,246,0.05)" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    )
}
