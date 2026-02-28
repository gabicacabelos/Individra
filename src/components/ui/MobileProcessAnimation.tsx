import { motion, useAnimationFrame } from 'framer-motion'
import { useState, useMemo, useRef } from 'react'

interface MobileProcessAnimationProps {
    activeStep: number
    scrollProgress: number
    glowColor: string
    IconComponent: React.ComponentType<any>
    totalSteps: number
}

// Particle system for floating elements
const Particle = ({ delay, duration, startX, startY, endX, endY, size, color }: {
    delay: number
    duration: number
    startX: number
    startY: number
    endX: number
    endY: number
    size: number
    color: string
}) => (
    <motion.circle
        cx={startX}
        cy={startY}
        r={size}
        fill={color}
        initial={{ opacity: 0 }}
        animate={{
            cx: [startX, endX, startX],
            cy: [startY, endY, startY],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1, 0.5],
        }}
        transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "easeInOut"
        }}
    />
)

// Orbiting dot
const OrbitingDot = ({ radius, duration, color, size, startAngle }: {
    radius: number
    duration: number
    color: string
    size: number
    startAngle: number
}) => (
    <motion.circle
        r={size}
        fill={color}
        initial={{ opacity: 0.3 }}
        animate={{
            opacity: [0.3, 1, 0.3],
        }}
        transition={{
            duration: duration / 2,
            repeat: Infinity,
            ease: "easeInOut"
        }}
    >
        <animateMotion
            dur={`${duration}s`}
            repeatCount="indefinite"
            path={`M ${radius} 0 A ${radius} ${radius} 0 1 1 ${-radius} 0 A ${radius} ${radius} 0 1 1 ${radius} 0`}
            begin={`${startAngle * duration / 360}s`}
        />
    </motion.circle>
)

// Energy wave effect
const EnergyWave = ({ progress, color }: { progress: number; color: string }) => (
    <motion.ellipse
        cx="200"
        cy="100"
        rx={40 + progress * 80}
        ry={20 + progress * 40}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        initial={{ opacity: 0 }}
        animate={{
            opacity: [0.6, 0, 0.6],
            scale: [0.8, 1.3, 0.8],
        }}
        transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }}
    />
)

// Morphing central shape
const MorphingShape = ({ activeStep, glowColor }: { activeStep: number; glowColor: string }) => {
    // Different SVG paths for each step (all roughly same size, centered)
    const shapes = [
        "M200,60 L230,85 L230,115 L200,140 L170,115 L170,85 Z", // Hexagon
        "M200,55 L215,90 L250,100 L220,120 L230,155 L200,135 L170,155 L180,120 L150,100 L185,90 Z", // Star
        "M200,50 Q250,75 250,100 Q250,125 200,150 Q150,125 150,100 Q150,75 200,50", // Organic blob
        "M160,70 L240,70 L260,100 L240,130 L160,130 L140,100 Z", // Stretched hex
        "M200,50 L235,75 L250,115 L225,145 L175,145 L150,115 L165,75 Z", // Heptagon-ish
    ]

    return (
        <motion.g>
            {/* Outer glow */}
            <motion.path
                d={shapes[activeStep]}
                fill="none"
                stroke={glowColor}
                strokeWidth="20"
                filter="url(#glow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                key={`glow-${activeStep}`}
            />
            {/* Main shape with morphing */}
            <motion.path
                d={shapes[activeStep]}
                fill="url(#shapeGradient)"
                stroke={glowColor}
                strokeWidth="2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                    scale: [1, 1.05, 1],
                    opacity: 1,
                    rotate: [0, 5, 0, -5, 0]
                }}
                transition={{
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 0.5 }
                }}
                style={{ transformOrigin: "200px 100px" }}
                key={`shape-${activeStep}`}
            />
        </motion.g>
    )
}

// Data stream lines
const DataStream = ({ startX, startY, endX, endY, delay, color }: {
    startX: number
    startY: number
    endX: number
    endY: number
    delay: number
    color: string
}) => {
    const pathD = `M${startX},${startY} Q${(startX + endX) / 2 + 30},${(startY + endY) / 2 - 20} ${endX},${endY}`

    return (
        <g>
            {/* Trail */}
            <motion.path
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth="1"
                strokeOpacity="0.2"
            />
            {/* Animated particle along path */}
            <motion.circle r="3" fill={color}>
                <animateMotion
                    dur="2s"
                    repeatCount="indefinite"
                    begin={`${delay}s`}
                    path={pathD}
                />
                <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    dur="2s"
                    repeatCount="indefinite"
                    begin={`${delay}s`}
                />
            </motion.circle>
        </g>
    )
}

// Neural network nodes
const NeuralNode = ({ cx, cy, isActive, delay }: {
    cx: number
    cy: number
    isActive: boolean
    delay: number
}) => (
    <motion.g>
        <motion.circle
            cx={cx}
            cy={cy}
            r={isActive ? 6 : 4}
            fill={isActive ? "url(#nodeGradient)" : "rgba(255,255,255,0.2)"}
            animate={isActive ? {
                scale: [1, 1.3, 1],
                opacity: [0.8, 1, 0.8]
            } : {}}
            transition={{
                duration: 1.5,
                delay,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
        {isActive && (
            <motion.circle
                cx={cx}
                cy={cy}
                r={12}
                fill="none"
                stroke="rgba(139,92,246,0.5)"
                strokeWidth="1"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.5, 0, 0.5]
                }}
                transition={{
                    duration: 2,
                    delay,
                    repeat: Infinity,
                    ease: "easeOut"
                }}
            />
        )}
    </motion.g>
)

export function MobileProcessAnimation({
    activeStep,
    scrollProgress,
    glowColor,
    IconComponent,
    totalSteps
}: MobileProcessAnimationProps) {
    // Generate particles based on step
    const particles = useMemo(() => {
        return Array.from({ length: 15 }, (_, i) => ({
            id: i,
            startX: 50 + Math.random() * 300,
            startY: 30 + Math.random() * 140,
            endX: 50 + Math.random() * 300,
            endY: 30 + Math.random() * 140,
            size: 1 + Math.random() * 2,
            delay: Math.random() * 3,
            duration: 3 + Math.random() * 3
        }))
    }, [])

    // Neural network connection points
    const neuralNodes = useMemo(() => [
        { cx: 80, cy: 50, activeAt: [0, 1, 2] },
        { cx: 120, cy: 30, activeAt: [0, 2] },
        { cx: 60, cy: 90, activeAt: [1, 3] },
        { cx: 320, cy: 50, activeAt: [2, 4] },
        { cx: 340, cy: 90, activeAt: [1, 3, 4] },
        { cx: 280, cy: 30, activeAt: [0, 4] },
        { cx: 100, cy: 150, activeAt: [2, 3] },
        { cx: 300, cy: 150, activeAt: [1, 4] },
        { cx: 200, cy: 170, activeAt: [0, 2, 4] },
    ], [])

    // Data stream paths
    const dataStreams = useMemo(() => [
        { startX: 50, startY: 100, endX: 150, endY: 100, delay: 0 },
        { startX: 250, startY: 100, endX: 350, endY: 100, delay: 0.5 },
        { startX: 200, startY: 30, endX: 200, endY: 70, delay: 1 },
        { startX: 200, startY: 130, endX: 200, endY: 170, delay: 1.5 },
    ], [])

    // Progress step nodes at bottom
    const stepNodes = useMemo(() =>
        Array.from({ length: totalSteps }).map((_, i) => ({
            cx: 80 + i * (240 / Math.max(1, totalSteps - 1)),
            cy: 190,
            index: i
        }))
    , [totalSteps])

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 400 200"
                preserveAspectRatio="xMidYMid"
            >
                <defs>
                    {/* Glow filter */}
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>

                    {/* Shape gradient */}
                    <linearGradient id="shapeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(139,92,246,0.3)" />
                        <stop offset="50%" stopColor="rgba(59,130,246,0.2)" />
                        <stop offset="100%" stopColor="rgba(16,185,129,0.3)" />
                    </linearGradient>

                    {/* Node gradient */}
                    <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                        <stop offset="100%" stopColor={glowColor} />
                    </radialGradient>

                    {/* Progress line gradient */}
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(139,92,246,0.8)" />
                        <stop offset="50%" stopColor="rgba(59,130,246,0.8)" />
                        <stop offset="100%" stopColor="rgba(16,185,129,0.8)" />
                    </linearGradient>

                    {/* Animated gradient for energy effect */}
                    <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={glowColor}>
                            <animate attributeName="stop-color"
                                values={`${glowColor};rgba(59,130,246,0.8);${glowColor}`}
                                dur="3s" repeatCount="indefinite"/>
                        </stop>
                        <stop offset="100%" stopColor="rgba(16,185,129,0.6)">
                            <animate attributeName="stop-color"
                                values="rgba(16,185,129,0.6);rgba(139,92,246,0.6);rgba(16,185,129,0.6)"
                                dur="3s" repeatCount="indefinite"/>
                        </stop>
                    </linearGradient>
                </defs>

                {/* Background grid - subtle tech feel */}
                <motion.g opacity={0.1}>
                    {Array.from({ length: 9 }).map((_, i) => (
                        <line
                            key={`v-${i}`}
                            x1={i * 50} y1="0"
                            x2={i * 50} y2="200"
                            stroke="rgba(139,92,246,0.5)"
                            strokeWidth="0.5"
                        />
                    ))}
                    {Array.from({ length: 5 }).map((_, i) => (
                        <line
                            key={`h-${i}`}
                            x1="0" y1={i * 50}
                            x2="400" y2={i * 50}
                            stroke="rgba(139,92,246,0.5)"
                            strokeWidth="0.5"
                        />
                    ))}
                </motion.g>

                {/* Floating particles */}
                {particles.map(p => (
                    <Particle
                        key={p.id}
                        startX={p.startX}
                        startY={p.startY}
                        endX={p.endX}
                        endY={p.endY}
                        size={p.size}
                        delay={p.delay}
                        duration={p.duration}
                        color={glowColor}
                    />
                ))}

                {/* Neural network connections */}
                <g opacity={0.3}>
                    {neuralNodes.map((node, i) =>
                        neuralNodes.slice(i + 1).map((target, j) => (
                            <motion.line
                                key={`conn-${i}-${j}`}
                                x1={node.cx}
                                y1={node.cy}
                                x2={target.cx}
                                y2={target.cy}
                                stroke="rgba(139,92,246,0.3)"
                                strokeWidth="0.5"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2, delay: i * 0.1 }}
                            />
                        ))
                    )}
                </g>

                {/* Neural nodes */}
                {neuralNodes.map((node, i) => (
                    <NeuralNode
                        key={`node-${i}`}
                        cx={node.cx}
                        cy={node.cy}
                        isActive={node.activeAt.includes(activeStep)}
                        delay={i * 0.2}
                    />
                ))}

                {/* Data streams */}
                {dataStreams.map((stream, i) => (
                    <DataStream
                        key={`stream-${i}`}
                        {...stream}
                        color={glowColor}
                    />
                ))}

                {/* Energy waves behind central shape */}
                <EnergyWave progress={scrollProgress} color={glowColor} />

                {/* Orbiting elements around center */}
                <g transform="translate(200, 100)">
                    <OrbitingDot radius={70} duration={8} color="rgba(139,92,246,0.7)" size={3} startAngle={0} />
                    <OrbitingDot radius={70} duration={8} color="rgba(59,130,246,0.7)" size={2} startAngle={120} />
                    <OrbitingDot radius={70} duration={8} color="rgba(16,185,129,0.7)" size={2.5} startAngle={240} />

                    <OrbitingDot radius={90} duration={12} color="rgba(139,92,246,0.5)" size={2} startAngle={60} />
                    <OrbitingDot radius={90} duration={12} color="rgba(59,130,246,0.5)" size={1.5} startAngle={180} />
                    <OrbitingDot radius={90} duration={12} color="rgba(236,72,153,0.5)" size={2} startAngle={300} />
                </g>

                {/* Outer rotating ring */}
                <motion.ellipse
                    cx="200"
                    cy="100"
                    rx="95"
                    ry="50"
                    fill="none"
                    stroke="url(#energyGradient)"
                    strokeWidth="1"
                    strokeDasharray="8 4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: "200px 100px" }}
                />

                {/* Inner rotating ring (opposite direction) */}
                <motion.ellipse
                    cx="200"
                    cy="100"
                    rx="65"
                    ry="35"
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="1.5"
                    strokeDasharray="4 8"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: "200px 100px" }}
                />

                {/* Central morphing shape */}
                <MorphingShape activeStep={activeStep} glowColor={glowColor} />

                {/* Progress indicator at bottom */}
                <g>
                    {/* Base line */}
                    <line
                        x1="80" y1="190"
                        x2="320" y2="190"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    {/* Progress line */}
                    <motion.line
                        x1="80"
                        y1="190"
                        x2={80 + ((activeStep + 1) / totalSteps) * 240}
                        y2="190"
                        stroke="url(#progressGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ x2: 80 }}
                        animate={{ x2: 80 + ((activeStep + 1) / totalSteps) * 240 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                    {/* Step dots */}
                    {stepNodes.map((node, i) => (
                        <motion.circle
                            key={`step-${i}`}
                            cx={node.cx}
                            cy={node.cy}
                            r={i === activeStep ? 6 : 4}
                            fill={i <= activeStep ? "url(#progressGradient)" : "rgba(255,255,255,0.2)"}
                            animate={i === activeStep ? {
                                scale: [1, 1.3, 1],
                            } : {}}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </g>

                {/* Spark effects on active step */}
                {Array.from({ length: 6 }).map((_, i) => (
                    <motion.circle
                        key={`spark-${i}`}
                        cx="200"
                        cy="100"
                        r="2"
                        fill={glowColor}
                        initial={{ opacity: 0 }}
                        animate={{
                            cx: [200, 200 + Math.cos(i * Math.PI / 3) * 60],
                            cy: [100, 100 + Math.sin(i * Math.PI / 3) * 60],
                            opacity: [0.8, 0],
                            scale: [1, 0.5],
                        }}
                        transition={{
                            duration: 1.5,
                            delay: i * 0.2,
                            repeat: Infinity,
                            ease: "easeOut"
                        }}
                    />
                ))}
            </svg>

            {/* Central Icon Container */}
            <motion.div
                className="absolute z-10 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20"
                style={{
                    boxShadow: `0 0 40px 5px ${glowColor}50, inset 0 0 20px ${glowColor}20`
                }}
                animate={{
                    y: [0, -8, 0],
                    scale: [1, 1.02, 1],
                    borderColor: [
                        'rgba(255,255,255,0.2)',
                        glowColor,
                        'rgba(255,255,255,0.2)'
                    ]
                }}
                transition={{
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    borderColor: { duration: 2, repeat: Infinity }
                }}
            >
                <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                    <IconComponent className="w-10 h-10 text-white" />
                </motion.div>
            </motion.div>

            {/* Pulse rings around icon */}
            <motion.div
                className="absolute w-20 h-20 rounded-full border border-white/20"
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0, 0.3],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                }}
            />
            <motion.div
                className="absolute w-20 h-20 rounded-full border border-white/10"
                animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.2, 0, 0.2],
                }}
                transition={{
                    duration: 2,
                    delay: 0.5,
                    repeat: Infinity,
                    ease: "easeOut"
                }}
            />
        </div>
    )
}
