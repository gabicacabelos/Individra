import { motion } from 'framer-motion'

interface MobileProcessAnimationProps {
    activeStep: number
    scrollProgress: number
    glowColor: string
    IconComponent: React.ComponentType<any>
    totalSteps: number
}

export function MobileProcessAnimation({ activeStep, scrollProgress, glowColor, IconComponent, totalSteps }: MobileProcessAnimationProps) {

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Base SVG Grid/Circles */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 -20 400 240" preserveAspectRatio="xMidYMid">
                {/* Central connecting lines that animate based on scroll */}
                <motion.path
                    d="M 50,100 Q 200,30 350,100"
                    fill="transparent"
                    stroke={`rgba(255, 255, 255, 0.1)`}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                />
                <motion.path
                    d="M 50,100 Q 200,170 350,100"
                    fill="transparent"
                    stroke={`rgba(255, 255, 255, 0.1)`}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                />

                {/* Animated progress lines */}
                <motion.path
                    d="M 50,100 Q 200,30 350,100"
                    fill="transparent"
                    stroke={glowColor}
                    strokeWidth="3"
                    style={{
                        pathLength: scrollProgress,
                        opacity: scrollProgress > 0 ? 1 : 0
                    }}
                />
                <motion.path
                    d="M 50,100 Q 200,170 350,100"
                    fill="transparent"
                    stroke={glowColor}
                    strokeWidth="3"
                    style={{
                        pathLength: scrollProgress,
                        opacity: scrollProgress > 0 ? 1 : 0
                    }}
                />

                {/* Nodes corresponding to steps */}
                {Array.from({ length: totalSteps }).map((_, step) => {
                    const cx = 50 + step * (300 / Math.max(1, totalSteps - 1));
                    const isActive = step === activeStep;
                    const isPast = step < activeStep;

                    return (
                        <g key={step}>
                            <motion.circle
                                cx={cx}
                                cy="100"
                                r={isActive ? 12 : 8}
                                fill={isActive ? glowColor : isPast ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'}
                                className="transition-all duration-300"
                            />
                            {/* Inner dot */}
                            <circle
                                cx={cx}
                                cy="100"
                                r="3"
                                fill={isActive ? '#fff' : isPast ? '#ccc' : '#666'}
                            />
                            {/* Pulsing effect for active */}
                            {isActive && (
                                <motion.circle
                                    cx={cx}
                                    cy="100"
                                    r={24}
                                    fill="transparent"
                                    stroke={glowColor}
                                    strokeWidth="2"
                                    animate={{
                                        scale: [1, 1.5],
                                        opacity: [0.8, 0],
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 1.5,
                                        ease: "easeOut"
                                    }}
                                />
                            )}
                        </g>
                    )
                })}
            </svg>

            {/* Central Icon Container floating */}
            <motion.div
                className="absolute z-10 p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10"
                style={{
                    boxShadow: `0 0 30px 0px ${glowColor}40`
                }}
                animate={{
                    y: [0, -10, 0],
                    borderColor: [
                        'rgba(255,255,255,0.1)',
                        glowColor,
                        'rgba(255,255,255,0.1)'
                    ]
                }}
                transition={{
                    y: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    },
                    borderColor: {
                        duration: 2,
                        repeat: Infinity,
                    }
                }}
            >
                <IconComponent className="w-10 h-10 text-white" />
            </motion.div>
        </div>
    )
}
