'use client'

// Tech Aura Animation - Optimized SVG for mobile with native animations
export function MobileHeroAnimation() {
    return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible">
            {/* Ambient glow background */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-[500px] max-h-[500px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, rgba(59, 130, 246, 0.05) 40%, rgba(0, 0, 0, 0) 70%)',
                    filter: 'blur(50px)',
                    animation: 'ambientPulse 6s infinite ease-in-out',
                }}
            />

            {/* Main SVG Tech Aura Animation */}
            <svg
                viewBox="0 0 400 400"
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto max-h-[380px]"
                style={{ filter: 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.2))' }}
            >
                <defs>
                    {/* Bloom Filter */}
                    <filter id="bloom" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    {/* Core Light Gradient */}
                    <radialGradient id="coreLight" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fff" />
                        <stop offset="40%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </radialGradient>

                    {/* Stream Gradient for connections */}
                    <linearGradient id="stream" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </defs>

                {/* Background: Sacred Geometry/Tech */}
                <g opacity="0.08" stroke="#3b82f6" fill="none" strokeWidth="0.5">
                    <circle cx="200" cy="200" r="160" />
                    <circle cx="200" cy="200" r="120" />
                    <path d="M200 40 L200 360 M40 200 L360 200" />
                    <rect x="100" y="100" width="200" height="200" transform="rotate(45 200 200)" />
                </g>

                {/* Complex Orbits (Atoms & Orbits) */}
                <g fill="none" strokeWidth="1.2">
                    {/* Dynamic Horizontal Orbit */}
                    <ellipse cx="200" cy="200" rx="170" ry="70" stroke="#8b5cf6" strokeOpacity="0.2" />
                    <g filter="url(#bloom)">
                        <circle r="4" fill="#8b5cf6">
                            <animateMotion
                                dur="4s"
                                repeatCount="indefinite"
                                path="M -170,0 a 170,70 0 1,0 340,0 a 170,70 0 1,0 -340,0"
                                transform="translate(200, 200)"
                            />
                        </circle>
                        <circle r="2" fill="#fff">
                            <animateMotion
                                dur="4s"
                                repeatCount="indefinite"
                                path="M -170,0 a 170,70 0 1,0 340,0 a 170,70 0 1,0 -340,0"
                                transform="translate(200, 200)"
                            />
                        </circle>
                    </g>

                    {/* Vertical Orbit (Atom) */}
                    <ellipse cx="200" cy="200" rx="60" ry="170" stroke="#3b82f6" strokeOpacity="0.2" />
                    <g filter="url(#bloom)">
                        <circle r="3.5" fill="#3b82f6">
                            <animateMotion
                                dur="6s"
                                repeatCount="indefinite"
                                path="M 0,-170 a 60,170 0 1,1 0,340 a 60,170 0 1,1 0,-340"
                                transform="translate(200, 200)"
                            />
                        </circle>
                    </g>

                    {/* Diagonal Orbit */}
                    <ellipse cx="200" cy="200" rx="140" ry="140" stroke="#fff" strokeOpacity="0.1" transform="rotate(45 200 200)" />
                    <circle r="2.5" fill="#fff" opacity="0.8" filter="url(#bloom)">
                        <animateMotion
                            dur="8s"
                            repeatCount="indefinite"
                            path="M -140,0 a 140,140 0 1,0 280,0 a 140,140 0 1,0 -280,0"
                            transform="translate(200, 200) rotate(45)"
                        />
                    </circle>
                </g>

                {/* Data Connections (Synapses) */}
                <g stroke="url(#stream)" strokeWidth="1.5">
                    <path d="M 50,200 C 100,100 300,300 350,200">
                        <animate attributeName="stroke-dasharray" values="0,800; 800,0; 0,800" dur="5s" repeatCount="indefinite" />
                    </path>
                    <path d="M 50,200 C 100,300 300,100 350,200">
                        <animate attributeName="stroke-dasharray" values="800,0; 0,800; 800,0" dur="7s" repeatCount="indefinite" />
                    </path>
                </g>

                {/* High Energy Central Core */}
                <g filter="url(#bloom)">
                    {/* Outer Halo */}
                    <circle cx="200" cy="200" r="25" fill="#8b5cf6" opacity="0.2">
                        <animate attributeName="r" values="25;35;25" dur="3s" repeatCount="indefinite" />
                    </circle>

                    {/* Core */}
                    <circle cx="200" cy="200" r="12" fill="url(#coreLight)">
                        <animate attributeName="r" values="12;15;12" dur="1.5s" repeatCount="indefinite" />
                    </circle>

                    {/* Core Electrons */}
                    <g>
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 200 200"
                            to="360 200 200"
                            dur="1s"
                            repeatCount="indefinite"
                        />
                        <circle cx="225" cy="200" r="1.5" fill="#fff" />
                        <circle cx="175" cy="200" r="1.5" fill="#fff" />
                    </g>
                </g>

                {/* Identity Hexagons (Individra) */}
                <g opacity="0.4" stroke="#3b82f6" fill="none" strokeWidth="1.5" filter="url(#bloom)">
                    <path d="M30 200 l7 -12 l14 0 l7 12 l-7 12 l-14 0 Z">
                        <animate attributeName="opacity" values="0.2;1;0.2" dur="3s" repeatCount="indefinite" />
                    </path>
                    <path d="M342 200 l7 -12 l14 0 l7 12 l-7 12 l-14 0 Z">
                        <animate attributeName="opacity" values="1;0.2;1" dur="4s" repeatCount="indefinite" />
                    </path>
                </g>
            </svg>

            <style jsx>{`
                @keyframes ambientPulse {
                    0%, 100% { 
                        opacity: 0.5; 
                        transform: translate(-50%, -50%) scale(1); 
                    }
                    50% { 
                        opacity: 0.8; 
                        transform: translate(-50%, -50%) scale(1.15); 
                    }
                }
            `}</style>
        </div>
    )
}
