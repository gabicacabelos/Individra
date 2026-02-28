'use client'

import { useMemo } from 'react'

interface MobileProcessAnimationProps {
    activeStep: number
    scrollProgress: number
    glowColor: string
    IconComponent: React.ComponentType<{ className?: string }>
    totalSteps: number
}

export function MobileProcessAnimation({
    activeStep,
    glowColor,
    IconComponent,
    totalSteps
}: MobileProcessAnimationProps) {
    // Pre-calculate step positions
    const stepPositions = useMemo(() =>
        Array.from({ length: totalSteps }).map((_, i) => ({
            cx: 80 + i * (240 / Math.max(1, totalSteps - 1)),
        }))
    , [totalSteps])

    // Different shapes for each step
    const shapes = [
        "M200,60 L230,85 L230,115 L200,140 L170,115 L170,85 Z",
        "M200,55 L215,90 L250,100 L220,120 L230,155 L200,135 L170,155 L180,120 L150,100 L185,90 Z",
        "M200,50 Q250,75 250,100 Q250,125 200,150 Q150,125 150,100 Q150,75 200,50",
        "M160,70 L240,70 L260,100 L240,130 L160,130 L140,100 Z",
        "M200,50 L235,75 L250,115 L225,145 L175,145 L150,115 L165,75 Z",
    ]

    return (
        <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            style={{ contain: 'layout style paint' }}
        >
            <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 400 200"
                preserveAspectRatio="xMidYMid"
                style={{ transform: 'translateZ(0)' }}
            >
                <defs>
                    {/* Shape gradient */}
                    <linearGradient id="shapeGradientMobile" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(139,92,246,0.4)" />
                        <stop offset="50%" stopColor="rgba(59,130,246,0.3)" />
                        <stop offset="100%" stopColor="rgba(16,185,129,0.4)" />
                    </linearGradient>

                    {/* Progress gradient */}
                    <linearGradient id="progressGradientMobile" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(139,92,246,0.8)" />
                        <stop offset="50%" stopColor="rgba(59,130,246,0.8)" />
                        <stop offset="100%" stopColor="rgba(16,185,129,0.8)" />
                    </linearGradient>

                    {/* Glow gradient */}
                    <radialGradient id="glowGradientMobile" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={glowColor} stopOpacity="0.6" />
                        <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* Simple glow effect - no blur filter */}
                <circle
                    cx="200"
                    cy="100"
                    r="70"
                    fill="url(#glowGradientMobile)"
                >
                    <animate
                        attributeName="r"
                        values="65;75;65"
                        dur="3s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="opacity"
                        values="0.5;0.8;0.5"
                        dur="3s"
                        repeatCount="indefinite"
                    />
                </circle>

                {/* Single rotating ring - using CSS animation via SMIL */}
                <ellipse
                    cx="200"
                    cy="100"
                    rx="85"
                    ry="45"
                    fill="none"
                    stroke={glowColor}
                    strokeWidth="1"
                    strokeDasharray="6 4"
                    strokeOpacity="0.4"
                >
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 200 100"
                        to="360 200 100"
                        dur="20s"
                        repeatCount="indefinite"
                    />
                </ellipse>

                {/* Central shape - simple path with CSS transition */}
                <path
                    d={shapes[activeStep]}
                    fill="url(#shapeGradientMobile)"
                    stroke={glowColor}
                    strokeWidth="1.5"
                    strokeOpacity="0.6"
                    style={{
                        transition: 'd 0.5s ease-out',
                        transformOrigin: '200px 100px'
                    }}
                >
                    <animate
                        attributeName="opacity"
                        values="0.8;1;0.8"
                        dur="2s"
                        repeatCount="indefinite"
                    />
                </path>

                {/* 3 orbiting particles - using SMIL */}
                <circle r="3" fill="rgba(139,92,246,0.8)">
                    <animateMotion
                        dur="8s"
                        repeatCount="indefinite"
                        path="M70,0 A70,70 0 1 1 -70,0 A70,70 0 1 1 70,0"
                    />
                    <set attributeName="transform" to="translate(200,100)" />
                </circle>
                <circle r="2.5" fill="rgba(59,130,246,0.7)">
                    <animateMotion
                        dur="8s"
                        repeatCount="indefinite"
                        begin="2.67s"
                        path="M70,0 A70,70 0 1 1 -70,0 A70,70 0 1 1 70,0"
                    />
                    <set attributeName="transform" to="translate(200,100)" />
                </circle>
                <circle r="2" fill="rgba(16,185,129,0.7)">
                    <animateMotion
                        dur="8s"
                        repeatCount="indefinite"
                        begin="5.33s"
                        path="M70,0 A70,70 0 1 1 -70,0 A70,70 0 1 1 70,0"
                    />
                    <set attributeName="transform" to="translate(200,100)" />
                </circle>

                {/* Progress indicator */}
                <g>
                    {/* Base line */}
                    <line
                        x1="80" y1="190"
                        x2="320" y2="190"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    {/* Progress line - CSS transition */}
                    <line
                        x1="80"
                        y1="190"
                        x2={80 + ((activeStep + 1) / totalSteps) * 240}
                        y2="190"
                        stroke="url(#progressGradientMobile)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        style={{ transition: 'x2 0.4s ease-out' }}
                    />
                    {/* Step dots - simple circles */}
                    {stepPositions.map((node, i) => (
                        <circle
                            key={`step-${i}`}
                            cx={node.cx}
                            cy={190}
                            r={i === activeStep ? 5 : 3}
                            fill={i <= activeStep ? "url(#progressGradientMobile)" : "rgba(255,255,255,0.2)"}
                            style={{ transition: 'r 0.3s ease-out, fill 0.3s ease-out' }}
                        />
                    ))}
                </g>
            </svg>

            {/* Central Icon - simple CSS transitions */}
            <div
                className="absolute z-10 p-3 rounded-xl bg-black/60 border border-white/20 icon-float"
                style={{
                    boxShadow: `0 0 30px 3px ${glowColor}40`,
                    transition: 'box-shadow 0.5s ease-out'
                }}
            >
                <IconComponent className="w-8 h-8 text-white" />
            </div>

            {/* Simple pulse ring - CSS only */}
            <div
                className="absolute w-16 h-16 rounded-full border border-white/20 pulse-ring"
            />

            <style jsx>{`
                @keyframes iconFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }
                @keyframes pulseRing {
                    0% { transform: scale(1); opacity: 0.3; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
                .icon-float {
                    animation: iconFloat 3s ease-in-out infinite;
                }
                .pulse-ring {
                    animation: pulseRing 2s ease-out infinite;
                }
            `}</style>
        </div>
    )
}
