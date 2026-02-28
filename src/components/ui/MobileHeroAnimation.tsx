'use client'

// Tech Aura Animation - Lightened version with higher contrast for dark backgrounds
export function MobileHeroAnimation() {
    return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible">
            {/* Ambient glow background - Lightened */}
            <div
                className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] h-[95vw] max-w-[500px] max-h-[500px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(167, 139, 250, 0.25) 0%, rgba(139, 92, 246, 0.12) 45%, rgba(0, 0, 0, 0) 75%)',
                    filter: 'blur(50px)',
                    animation: 'ambientPulse 6s infinite ease-in-out',
                }}
            />

            {/* Main SVG Tech Aura Animation - Positioned below buttons */}
            <svg
                viewBox="0 0 400 400"
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto max-h-[400px] mt-[-20px]"
                style={{ filter: 'drop-shadow(0 0 20px rgba(167, 139, 250, 0.3))' }}
            >
                <defs>
                    {/* Bloom Filter - Lightened */}
                    <filter id="bloom" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="3.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    {/* Core Light Gradient - Lighter colors */}
                    <radialGradient id="coreLight" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fff" />
                        <stop offset="40%" stopColor="#ddd6fe" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </radialGradient>

                    {/* Stream Gradient - Brighter for data flows */}
                    <linearGradient id="stream" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="#c084fc" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </defs>

                {/* Background: Sacred Geometry (More visible) */}
                <g opacity="0.18" stroke="#a78bfa" fill="none" strokeWidth="0.7">
                    <circle cx="200" cy="200" r="160" />
                    <circle cx="200" cy="200" r="120" />
                    <path d="M200 40 L200 360 M40 200 L360 200" />
                    <rect x="100" y="100" width="200" height="200" transform="rotate(45 200 200)" />
                </g>

                {/* Orbits and Atoms (Lighter colors) */}
                <g fill="none" strokeWidth="1.5">
                    {/* Horizontal Orbit */}
                    <ellipse cx="200" cy="200" rx="170" ry="70" stroke="#c084fc" strokeOpacity="0.3" />
                    <g filter="url(#bloom)">
                        <circle r="4.5" fill="#ddd6fe">
                            <animateMotion
                                dur="4s"
                                repeatCount="indefinite"
                                path="M -170,0 a 170,70 0 1,0 340,0 a 170,70 0 1,0 -340,0"
                                transform="translate(200, 200)"
                            />
                        </circle>
                    </g>

                    {/* Vertical Orbit */}
                    <ellipse cx="200" cy="200" rx="65" ry="175" stroke="#a78bfa" strokeOpacity="0.3" />
                    <g filter="url(#bloom)">
                        <circle r="4" fill="#a78bfa">
                            <animateMotion
                                dur="6s"
                                repeatCount="indefinite"
                                path="M 0,-175 a 65,175 0 1,1 0,350 a 65,175 0 1,1 0,-350"
                                transform="translate(200, 200)"
                            />
                        </circle>
                    </g>

                    {/* Diagonal Orbit */}
                    <ellipse cx="200" cy="200" rx="145" ry="145" stroke="#fff" strokeOpacity="0.15" transform="rotate(45 200 200)" />
                </g>

                {/* Data Connections (Brighter to eliminate dense black areas) */}
                <g stroke="url(#stream)" strokeWidth="2">
                    <path d="M 50,200 C 100,80 300,320 350,200">
                        <animate attributeName="stroke-dasharray" values="0,850; 850,0; 0,850" dur="5s" repeatCount="indefinite" />
                    </path>
                    <path d="M 50,200 C 100,320 300,80 350,200">
                        <animate attributeName="stroke-dasharray" values="850,0; 0,850; 850,0" dur="7s" repeatCount="indefinite" />
                    </path>
                </g>

                {/* Central Core (Light Violet / Electric Lavender) */}
                <g filter="url(#bloom)">
                    {/* Vibrant Outer Halo */}
                    <circle cx="200" cy="200" r="28" fill="#8b5cf6" opacity="0.35">
                        <animate attributeName="r" values="28;38;28" dur="3s" repeatCount="indefinite" />
                    </circle>

                    {/* Bright Core */}
                    <circle cx="200" cy="200" r="14" fill="url(#coreLight)">
                        <animate attributeName="r" values="14;17;14" dur="1.5s" repeatCount="indefinite" />
                    </circle>

                    {/* Electrons */}
                    <g>
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 200 200"
                            to="360 200 200"
                            dur="1.2s"
                            repeatCount="indefinite"
                        />
                        <circle cx="228" cy="200" r="2" fill="#fff" />
                        <circle cx="172" cy="200" r="2" fill="#fff" />
                    </g>
                </g>

                {/* Hexagons (More luminous) */}
                <g opacity="0.6" stroke="#c084fc" fill="none" strokeWidth="1.8" filter="url(#bloom)">
                    <path d="M25 200 l7 -12 l14 0 l7 12 l-7 12 l-14 0 Z">
                        <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
                    </path>
                    <path d="M347 200 l7 -12 l14 0 l7 12 l-7 12 l-14 0 Z">
                        <animate attributeName="opacity" values="1;0.4;1" dur="4s" repeatCount="indefinite" />
                    </path>
                </g>
            </svg>

            <style jsx>{`
                @keyframes ambientPulse {
                    0%, 100% { 
                        opacity: 0.6; 
                        transform: translate(-50%, -50%) scale(1); 
                    }
                    50% { 
                        opacity: 0.9; 
                        transform: translate(-50%, -50%) scale(1.1); 
                    }
                }
            `}</style>
        </div>
    )
}
