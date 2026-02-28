'use client'

import { motion } from 'framer-motion'

// Tech Aura Animation - Elegant neural network visualization for mobile hero
export function MobileHeroAnimation() {
    return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Ambient Glow Background */}
            <motion.div
                className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(0, 0, 0, 0) 70%)',
                    filter: 'blur(40px)',
                }}
                animate={{
                    opacity: [0.4, 0.7, 0.4],
                    scale: [1, 1.05, 1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Main SVG Animation */}
            <svg
                viewBox="0 0 800 300"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto max-w-[500px] sm:max-w-[600px]"
            >
                <defs>
                    {/* Glow Filter */}
                    <filter id="heroGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    {/* Core Gradient */}
                    <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fff" />
                        <stop offset="40%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </radialGradient>

                    {/* Line Gradient */}
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>

                    {/* Orbit Gradient */}
                    <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                    </linearGradient>
                </defs>

                {/* Background Neural Lines - Static/Subtle */}
                <g opacity="0.15" stroke="#3b82f6" strokeWidth="0.5">
                    <line x1="400" y1="150" x2="250" y2="80" />
                    <line x1="400" y1="150" x2="550" y2="80" />
                    <line x1="400" y1="150" x2="250" y2="220" />
                    <line x1="400" y1="150" x2="550" y2="220" />
                    <line x1="250" y1="80" x2="550" y2="80" />
                    <line x1="250" y1="220" x2="550" y2="220" />
                    <line x1="250" y1="80" x2="250" y2="220" />
                    <line x1="550" y1="80" x2="550" y2="220" />
                </g>

                {/* Data Orbits */}
                <g fill="none" strokeWidth="1">
                    {/* Orbit 1 - Horizontal */}
                    <ellipse cx="400" cy="150" rx="180" ry="60" stroke="#8b5cf6" strokeOpacity="0.2" />
                    <circle r="3" fill="#8b5cf6" filter="url(#heroGlow)">
                        <animateMotion
                            dur="6s"
                            repeatCount="indefinite"
                            path="M 220,150 a 180,60 0 1,0 360,0 a 180,60 0 1,0 -360,0"
                        />
                    </circle>

                    {/* Orbit 2 - Tilted */}
                    <ellipse
                        cx="400"
                        cy="150"
                        rx="120"
                        ry="100"
                        stroke="#3b82f6"
                        strokeOpacity="0.2"
                        transform="rotate(15, 400, 150)"
                    />
                    <circle r="2" fill="#3b82f6" filter="url(#heroGlow)">
                        <animateMotion
                            dur="4s"
                            repeatCount="indefinite"
                            path="M 280,150 a 120,100 0 1,1 240,0 a 120,100 0 1,1 -240,0"
                        />
                    </circle>

                    {/* Orbit 3 - Vertical */}
                    <ellipse cx="400" cy="150" rx="50" ry="130" stroke="#fff" strokeOpacity="0.1" />
                    <circle r="2" fill="#fff" filter="url(#heroGlow)">
                        <animateMotion
                            dur="8s"
                            repeatCount="indefinite"
                            path="M 350,150 a 50,130 0 1,0 100,0 a 50,130 0 1,0 -100,0"
                        />
                    </circle>

                    {/* Orbit 4 - Small inner */}
                    <ellipse cx="400" cy="150" rx="80" ry="40" stroke="#8b5cf6" strokeOpacity="0.15" strokeDasharray="4 4" />
                    <circle r="1.5" fill="#10b981" filter="url(#heroGlow)">
                        <animateMotion
                            dur="3s"
                            repeatCount="indefinite"
                            path="M 320,150 a 80,40 0 1,0 160,0 a 80,40 0 1,0 -160,0"
                        />
                    </circle>
                </g>

                {/* Peripheral Blinking Nodes */}
                <g filter="url(#heroGlow)">
                    <circle cx="220" cy="150" r="4" fill="#8b5cf6">
                        <animate attributeName="opacity" values="0.2;1;0.2" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="580" cy="150" r="4" fill="#3b82f6">
                        <animate attributeName="opacity" values="1;0.2;1" dur="4s" repeatCount="indefinite" />
                        <animate attributeName="r" values="4;6;4" dur="4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="400" cy="40" r="3" fill="#fff">
                        <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="400" cy="260" r="3" fill="#10b981">
                        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="280" cy="80" r="2.5" fill="#8b5cf6">
                        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="520" cy="80" r="2.5" fill="#3b82f6">
                        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.8s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="280" cy="220" r="2" fill="#3b82f6">
                        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3.2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="520" cy="220" r="2" fill="#8b5cf6">
                        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2.4s" repeatCount="indefinite" />
                    </circle>
                </g>

                {/* Dynamic Synapse Connections */}
                <g stroke="url(#lineGrad)" strokeWidth="1.5">
                    <line x1="300" y1="100" x2="500" y2="200">
                        <animate
                            attributeName="stroke-dasharray"
                            values="0,500; 500,0; 0,500"
                            dur="5s"
                            repeatCount="indefinite"
                        />
                    </line>
                    <line x1="500" y1="100" x2="300" y2="200">
                        <animate
                            attributeName="stroke-dasharray"
                            values="500,0; 0,500; 500,0"
                            dur="7s"
                            repeatCount="indefinite"
                        />
                    </line>
                    <line x1="250" y1="150" x2="550" y2="150">
                        <animate
                            attributeName="stroke-dasharray"
                            values="0,400; 400,0; 0,400"
                            dur="6s"
                            repeatCount="indefinite"
                        />
                        <animate
                            attributeName="opacity"
                            values="0.3;0.8;0.3"
                            dur="6s"
                            repeatCount="indefinite"
                        />
                    </line>
                </g>

                {/* Central Core */}
                <g filter="url(#heroGlow)">
                    {/* Outer Halo */}
                    <circle cx="400" cy="150" r="25" fill="#8b5cf6" opacity="0.3">
                        <animate attributeName="r" values="25;35;25" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
                    </circle>

                    {/* Second Halo */}
                    <circle cx="400" cy="150" r="18" fill="#3b82f6" opacity="0.2">
                        <animate attributeName="r" values="18;25;18" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2s" repeatCount="indefinite" />
                    </circle>

                    {/* Solid Core */}
                    <circle cx="400" cy="150" r="12" fill="url(#coreGrad)">
                        <animate attributeName="r" values="12;15;12" dur="1.5s" repeatCount="indefinite" />
                    </circle>

                    {/* Core Inner Glow */}
                    <circle cx="400" cy="150" r="6" fill="#fff" opacity="0.8">
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="1s" repeatCount="indefinite" />
                    </circle>

                    {/* Rotating Energy Particles */}
                    <g>
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 400 150"
                            to="360 400 150"
                            dur="2s"
                            repeatCount="indefinite"
                        />
                        <circle cx="430" cy="150" r="1.5" fill="#fff" />
                        <circle cx="370" cy="150" r="1.5" fill="#fff" />
                    </g>

                    {/* Slower Rotating Particles */}
                    <g>
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 400 150"
                            to="-360 400 150"
                            dur="4s"
                            repeatCount="indefinite"
                        />
                        <circle cx="400" cy="130" r="1" fill="#8b5cf6" />
                        <circle cx="400" cy="170" r="1" fill="#3b82f6" />
                    </g>
                </g>

                {/* Decorative Hexagons */}
                <g opacity="0.4" stroke="#8b5cf6" fill="none" strokeWidth="1">
                    <path d="M120 150 l5 -8.6 l10 0 l5 8.6 l-5 8.6 l-10 0 Z">
                        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4s" repeatCount="indefinite" />
                    </path>
                    <path d="M680 150 l5 -8.6 l10 0 l5 8.6 l-5 8.6 l-10 0 Z">
                        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
                    </path>
                    <path d="M150 80 l4 -6.9 l8 0 l4 6.9 l-4 6.9 l-8 0 Z">
                        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="5s" repeatCount="indefinite" />
                    </path>
                    <path d="M650 220 l4 -6.9 l8 0 l4 6.9 l-4 6.9 l-8 0 Z">
                        <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3.5s" repeatCount="indefinite" />
                    </path>
                </g>

                {/* Floating Particles */}
                <g>
                    {[...Array(8)].map((_, i) => {
                        const cx = 150 + i * 70
                        const cy = 50 + (i % 3) * 100
                        const delay = i * 0.5
                        return (
                            <circle
                                key={i}
                                cx={cx}
                                cy={cy}
                                r="1"
                                fill={i % 2 === 0 ? "#8b5cf6" : "#3b82f6"}
                                opacity="0.5"
                            >
                                <animate
                                    attributeName="cy"
                                    values={`${cy};${cy - 20};${cy}`}
                                    dur={`${3 + i * 0.3}s`}
                                    begin={`${delay}s`}
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="opacity"
                                    values="0.2;0.8;0.2"
                                    dur={`${3 + i * 0.3}s`}
                                    begin={`${delay}s`}
                                    repeatCount="indefinite"
                                />
                            </circle>
                        )
                    })}
                </g>

                {/* Energy Arcs */}
                <g opacity="0.3" fill="none" strokeWidth="1">
                    <path d="M250 180 Q 400 100 550 180" stroke="url(#lineGrad)">
                        <animate
                            attributeName="d"
                            values="M250 180 Q 400 100 550 180; M250 180 Q 400 130 550 180; M250 180 Q 400 100 550 180"
                            dur="4s"
                            repeatCount="indefinite"
                        />
                    </path>
                    <path d="M250 120 Q 400 200 550 120" stroke="url(#lineGrad)">
                        <animate
                            attributeName="d"
                            values="M250 120 Q 400 200 550 120; M250 120 Q 400 170 550 120; M250 120 Q 400 200 550 120"
                            dur="5s"
                            repeatCount="indefinite"
                        />
                    </path>
                </g>
            </svg>
        </div>
    )
}
