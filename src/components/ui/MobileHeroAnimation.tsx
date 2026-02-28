'use client'

// Tech Aura Animation - Pure SVG with native animations for maximum fidelity
export function MobileHeroAnimation() {
    return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
            {/* Ambient glow background */}
            <div
                className="absolute w-[400px] h-[400px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(0, 0, 0, 0) 70%)',
                    filter: 'blur(40px)',
                    animation: 'ambientPulse 8s infinite ease-in-out',
                }}
            />

            {/* Main SVG Animation */}
            <svg
                viewBox="0 0 800 300"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto"
                style={{ maxHeight: '100%' }}
            >
                <defs>
                    {/* Glow filter */}
                    <filter id="mha-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    {/* Gradients */}
                    <radialGradient id="mha-coreGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fff" />
                        <stop offset="40%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </radialGradient>

                    <linearGradient id="mha-lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </defs>

                {/* Static Neural Background Lines */}
                <g opacity="0.15" stroke="#3b82f6" strokeWidth="0.5">
                    <line x1="400" y1="150" x2="250" y2="80" />
                    <line x1="400" y1="150" x2="550" y2="80" />
                    <line x1="400" y1="150" x2="250" y2="220" />
                    <line x1="400" y1="150" x2="550" y2="220" />
                    <line x1="250" y1="80" x2="550" y2="80" />
                </g>

                {/* Orbits */}
                <g fill="none" strokeWidth="1">
                    {/* Orbit 1 */}
                    <ellipse cx="400" cy="150" rx="180" ry="60" stroke="#8b5cf6" strokeOpacity="0.2" />
                    <circle r="3" fill="#8b5cf6" filter="url(#mha-glow)">
                        <animateMotion
                            dur="6s"
                            repeatCount="indefinite"
                            path="M 220,150 a 180,60 0 1,0 360,0 a 180,60 0 1,0 -360,0"
                        />
                    </circle>

                    {/* Orbit 2 - Inverse */}
                    <ellipse cx="400" cy="150" rx="120" ry="100" stroke="#3b82f6" strokeOpacity="0.2" transform="rotate(15, 400, 150)" />
                    <circle r="2" fill="#3b82f6" filter="url(#mha-glow)">
                        <animateMotion
                            dur="4s"
                            repeatCount="indefinite"
                            path="M 280,150 a 120,100 0 1,1 240,0 a 120,100 0 1,1 -240,0"
                        />
                    </circle>

                    {/* Orbit 3 - Vertical */}
                    <ellipse cx="400" cy="150" rx="50" ry="130" stroke="#fff" strokeOpacity="0.1" />
                    <circle r="2" fill="#fff" filter="url(#mha-glow)">
                        <animateMotion
                            dur="8s"
                            repeatCount="indefinite"
                            path="M 350,150 a 50,130 0 1,0 100,0 a 50,130 0 1,0 -100,0"
                        />
                    </circle>
                </g>

                {/* Peripheral Pulsing Nodes */}
                <g filter="url(#mha-glow)">
                    <circle cx="220" cy="150" r="4" fill="#8b5cf6">
                        <animate attributeName="opacity" values="0.2;1;0.2" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="580" cy="150" r="4" fill="#3b82f6">
                        <animate attributeName="opacity" values="1;0.2;1" dur="4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="400" cy="40" r="3" fill="#fff">
                        <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                </g>

                {/* Dynamic Connections (Synapses) */}
                <g stroke="url(#mha-lineGrad)" strokeWidth="1.5">
                    <line x1="300" y1="100" x2="500" y2="200">
                        <animate attributeName="stroke-dasharray" values="0,500; 500,0; 0,500" dur="5s" repeatCount="indefinite" />
                    </line>
                    <line x1="500" y1="100" x2="300" y2="200">
                        <animate attributeName="stroke-dasharray" values="500,0; 0,500; 500,0" dur="7s" repeatCount="indefinite" />
                    </line>
                </g>

                {/* Central Core */}
                <g filter="url(#mha-glow)">
                    {/* Outer Halo */}
                    <circle cx="400" cy="150" r="25" fill="#8b5cf6" opacity="0.3">
                        <animate attributeName="r" values="25;35;25" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
                    </circle>

                    {/* Solid Core */}
                    <circle cx="400" cy="150" r="12" fill="url(#mha-coreGrad)">
                        <animate attributeName="r" values="12;15;12" dur="1.5s" repeatCount="indefinite" />
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
                </g>

                {/* Decorative Hexagons */}
                <g opacity="0.4" stroke="#8b5cf6" fill="none" strokeWidth="1">
                    <path d="M120 150 l5 -8.6 l10 0 l5 8.6 l-5 8.6 l-10 0 Z" />
                    <path d="M680 150 l5 -8.6 l10 0 l5 8.6 l-5 8.6 l-10 0 Z" />
                </g>
            </svg>

            <style>{`
                @keyframes ambientPulse {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.05); }
                }
            `}</style>
        </div>
    )
}
