'use client'

import { motion } from 'framer-motion'

// Tech Aura Animation - Elegant neural network visualization for mobile hero
export function MobileHeroAnimation() {
    return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Ambient Glow Background */}
            <motion.div
                className="absolute w-[250px] h-[250px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(0, 0, 0, 0) 70%)',
                    filter: 'blur(30px)',
                }}
                animate={{
                    opacity: [0.5, 0.8, 0.5],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Main SVG Animation - Square viewBox for better mobile display */}
            <svg
                viewBox="0 0 400 400"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full max-w-[350px] max-h-[350px]"
            >
                <defs>
                    {/* Glow Filter */}
                    <filter id="heroGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    {/* Stronger Glow */}
                    <filter id="heroGlowStrong" x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
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
                        <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </defs>

                {/* Background Neural Lines */}
                <g opacity="0.2" stroke="#3b82f6" strokeWidth="0.5">
                    <line x1="200" y1="200" x2="100" y2="100" />
                    <line x1="200" y1="200" x2="300" y2="100" />
                    <line x1="200" y1="200" x2="100" y2="300" />
                    <line x1="200" y1="200" x2="300" y2="300" />
                    <line x1="200" y1="200" x2="200" y2="80" />
                    <line x1="200" y1="200" x2="200" y2="320" />
                    <line x1="200" y1="200" x2="80" y2="200" />
                    <line x1="200" y1="200" x2="320" y2="200" />
                </g>

                {/* Data Orbits */}
                <g fill="none" strokeWidth="1">
                    {/* Orbit 1 - Large horizontal */}
                    <ellipse cx="200" cy="200" rx="140" ry="70" stroke="#8b5cf6" strokeOpacity="0.25" />
                    <circle r="4" fill="#8b5cf6" filter="url(#heroGlow)">
                        <animateMotion
                            dur="5s"
                            repeatCount="indefinite"
                            path="M 60,200 a 140,70 0 1,0 280,0 a 140,70 0 1,0 -280,0"
                        />
                    </circle>

                    {/* Orbit 2 - Tilted */}
                    <ellipse
                        cx="200"
                        cy="200"
                        rx="100"
                        ry="100"
                        stroke="#3b82f6"
                        strokeOpacity="0.2"
                        transform="rotate(45, 200, 200)"
                    />
                    <circle r="3" fill="#3b82f6" filter="url(#heroGlow)">
                        <animateMotion
                            dur="4s"
                            repeatCount="indefinite"
                            path="M 100,200 a 100,100 0 1,1 200,0 a 100,100 0 1,1 -200,0"
                        />
                    </circle>

                    {/* Orbit 3 - Vertical */}
                    <ellipse cx="200" cy="200" rx="50" ry="120" stroke="#fff" strokeOpacity="0.15" />
                    <circle r="2.5" fill="#10b981" filter="url(#heroGlow)">
                        <animateMotion
                            dur="6s"
                            repeatCount="indefinite"
                            path="M 150,200 a 50,120 0 1,0 100,0 a 50,120 0 1,0 -100,0"
                        />
                    </circle>

                    {/* Orbit 4 - Small inner */}
                    <ellipse cx="200" cy="200" rx="60" ry="35" stroke="#8b5cf6" strokeOpacity="0.2" strokeDasharray="4 4" />
                    <circle r="2" fill="#fff" filter="url(#heroGlow)">
                        <animateMotion
                            dur="2.5s"
                            repeatCount="indefinite"
                            path="M 140,200 a 60,35 0 1,0 120,0 a 60,35 0 1,0 -120,0"
                        />
                    </circle>
                </g>

                {/* Peripheral Blinking Nodes */}
                <g filter="url(#heroGlow)">
                    {/* Cardinal points */}
                    <circle cx="60" cy="200" r="5" fill="#8b5cf6">
                        <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="r" values="4;6;4" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="340" cy="200" r="5" fill="#3b82f6">
                        <animate attributeName="opacity" values="1;0.3;1" dur="4s" repeatCount="indefinite" />
                        <animate attributeName="r" values="5;7;5" dur="4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="200" cy="60" r="4" fill="#fff">
                        <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="200" cy="340" r="4" fill="#10b981">
                        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3.5s" repeatCount="indefinite" />
                    </circle>

                    {/* Diagonal points */}
                    <circle cx="100" cy="100" r="3" fill="#8b5cf6">
                        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="300" cy="100" r="3" fill="#3b82f6">
                        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.8s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="100" cy="300" r="3" fill="#3b82f6">
                        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3.2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="300" cy="300" r="3" fill="#8b5cf6">
                        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2.4s" repeatCount="indefinite" />
                    </circle>
                </g>

                {/* Dynamic Synapse Connections */}
                <g stroke="url(#lineGrad)" strokeWidth="1.5">
                    <line x1="120" y1="120" x2="280" y2="280">
                        <animate
                            attributeName="stroke-dasharray"
                            values="0,300; 300,0; 0,300"
                            dur="4s"
                            repeatCount="indefinite"
                        />
                    </line>
                    <line x1="280" y1="120" x2="120" y2="280">
                        <animate
                            attributeName="stroke-dasharray"
                            values="300,0; 0,300; 300,0"
                            dur="5s"
                            repeatCount="indefinite"
                        />
                    </line>
                </g>

                {/* Central Core */}
                <g filter="url(#heroGlowStrong)">
                    {/* Outer Halo */}
                    <circle cx="200" cy="200" r="35" fill="#8b5cf6" opacity="0.2">
                        <animate attributeName="r" values="35;50;35" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.2;0.08;0.2" dur="3s" repeatCount="indefinite" />
                    </circle>

                    {/* Second Halo */}
                    <circle cx="200" cy="200" r="25" fill="#3b82f6" opacity="0.25">
                        <animate attributeName="r" values="25;35;25" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.25;0.1;0.25" dur="2s" repeatCount="indefinite" />
                    </circle>

                    {/* Solid Core */}
                    <circle cx="200" cy="200" r="18" fill="url(#coreGrad)">
                        <animate attributeName="r" values="18;22;18" dur="1.5s" repeatCount="indefinite" />
                    </circle>

                    {/* Core Inner Glow */}
                    <circle cx="200" cy="200" r="8" fill="#fff" opacity="0.9">
                        <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite" />
                    </circle>

                    {/* Rotating Energy Particles */}
                    <g>
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 200 200"
                            to="360 200 200"
                            dur="2s"
                            repeatCount="indefinite"
                        />
                        <circle cx="235" cy="200" r="2" fill="#fff" />
                        <circle cx="165" cy="200" r="2" fill="#fff" />
                    </g>

                    {/* Slower Rotating Particles */}
                    <g>
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 200 200"
                            to="-360 200 200"
                            dur="3s"
                            repeatCount="indefinite"
                        />
                        <circle cx="200" cy="170" r="1.5" fill="#8b5cf6" />
                        <circle cx="200" cy="230" r="1.5" fill="#3b82f6" />
                    </g>
                </g>

                {/* Decorative Hexagons */}
                <g opacity="0.5" stroke="#8b5cf6" fill="none" strokeWidth="1">
                    <path d="M50 200 l6 -10 l12 0 l6 10 l-6 10 l-12 0 Z">
                        <animate attributeName="opacity" values="0.2;0.7;0.2" dur="4s" repeatCount="indefinite" />
                    </path>
                    <path d="M350 200 l6 -10 l12 0 l6 10 l-6 10 l-12 0 Z">
                        <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3s" repeatCount="indefinite" />
                    </path>
                    <path d="M200 50 l5 -8 l10 0 l5 8 l-5 8 l-10 0 Z">
                        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3.5s" repeatCount="indefinite" />
                    </path>
                    <path d="M200 350 l5 -8 l10 0 l5 8 l-5 8 l-10 0 Z">
                        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="4.5s" repeatCount="indefinite" />
                    </path>
                </g>

                {/* Floating Small Particles */}
                {[
                    { cx: 80, cy: 150, delay: 0 },
                    { cx: 320, cy: 250, delay: 0.5 },
                    { cx: 150, cy: 80, delay: 1 },
                    { cx: 250, cy: 320, delay: 1.5 },
                    { cx: 130, cy: 270, delay: 2 },
                    { cx: 270, cy: 130, delay: 2.5 },
                ].map((p, i) => (
                    <circle
                        key={i}
                        cx={p.cx}
                        cy={p.cy}
                        r="1.5"
                        fill={i % 2 === 0 ? "#8b5cf6" : "#3b82f6"}
                        opacity="0.6"
                    >
                        <animate
                            attributeName="cy"
                            values={`${p.cy};${p.cy - 15};${p.cy}`}
                            dur={`${3 + i * 0.4}s`}
                            begin={`${p.delay}s`}
                            repeatCount="indefinite"
                        />
                        <animate
                            attributeName="opacity"
                            values="0.3;0.9;0.3"
                            dur={`${3 + i * 0.4}s`}
                            begin={`${p.delay}s`}
                            repeatCount="indefinite"
                        />
                    </circle>
                ))}

                {/* Energy Arcs */}
                <g opacity="0.35" fill="none" strokeWidth="1.5">
                    <path d="M100 250 Q 200 120 300 250" stroke="url(#lineGrad)">
                        <animate
                            attributeName="d"
                            values="M100 250 Q 200 120 300 250; M100 250 Q 200 160 300 250; M100 250 Q 200 120 300 250"
                            dur="4s"
                            repeatCount="indefinite"
                        />
                    </path>
                    <path d="M100 150 Q 200 280 300 150" stroke="url(#lineGrad)">
                        <animate
                            attributeName="d"
                            values="M100 150 Q 200 280 300 150; M100 150 Q 200 240 300 150; M100 150 Q 200 280 300 150"
                            dur="5s"
                            repeatCount="indefinite"
                        />
                    </path>
                </g>
            </svg>
        </div>
    )
}
