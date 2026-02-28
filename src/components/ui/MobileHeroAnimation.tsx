'use client'

// Enhanced Tech Aura Animation - Premium futuristic design
export function MobileHeroAnimation() {
    return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible">
            {/* Multi-layer ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {/* Primary glow */}
                <div
                    className="absolute w-[400px] h-[400px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(99, 102, 241, 0.15) 40%, rgba(0, 0, 0, 0) 70%)',
                        filter: 'blur(60px)',
                        animation: 'primaryPulse 8s infinite ease-in-out',
                    }}
                />
                {/* Secondary glow */}
                <div
                    className="absolute w-[350px] h-[350px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 75%)',
                        filter: 'blur(40px)',
                        animation: 'secondaryPulse 6s infinite ease-in-out 1s',
                    }}
                />
            </div>

            {/* Main SVG Tech Aura */}
            <svg
                viewBox="0 0 400 400"
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto max-h-[420px]"
                style={{ filter: 'drop-shadow(0 0 25px rgba(139, 92, 246, 0.4))' }}
            >
                <defs>
                    {/* Enhanced Bloom Filter */}
                    <filter id="bloom" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="blur1" />
                        <feGaussianBlur stdDeviation="6" result="blur2" />
                        <feMerge>
                            <feMergeNode in="blur2" />
                            <feMergeNode in="blur1" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Intense Glow */}
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Core Gradient - More vibrant */}
                    <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="30%" stopColor="#e0e7ff" />
                        <stop offset="60%" stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#7c3aed" />
                    </radialGradient>

                    {/* Energy Stream Gradient */}
                    <linearGradient id="energyStream" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="30%" stopColor="#c084fc" stopOpacity="0.3" />
                        <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.9" />
                        <stop offset="70%" stopColor="#c084fc" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>

                    {/* Orbit Gradient */}
                    <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
                        <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.6" />
                    </linearGradient>
                </defs>

                {/* Background Tech Grid - Enhanced */}
                <g opacity="0.12" stroke="#a78bfa" fill="none" strokeWidth="0.8">
                    <circle cx="200" cy="200" r="180" strokeDasharray="4 4">
                        <animate attributeName="stroke-dashoffset" values="0;-8" dur="20s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="200" cy="200" r="140" strokeDasharray="3 3">
                        <animate attributeName="stroke-dashoffset" values="0;6" dur="15s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="200" cy="200" r="100" strokeDasharray="2 2">
                        <animate attributeName="stroke-dashoffset" values="0;-4" dur="10s" repeatCount="indefinite" />
                    </circle>
                    {/* Grid lines */}
                    <path d="M200 20 L200 380" strokeOpacity="0.5" />
                    <path d="M20 200 L380 200" strokeOpacity="0.5" />
                    <path d="M80 80 L320 320" strokeOpacity="0.3" />
                    <path d="M320 80 L80 320" strokeOpacity="0.3" />
                </g>

                {/* Sacred Geometry Base */}
                <g opacity="0.15" stroke="#c084fc" fill="none" strokeWidth="1">
                    <polygon points="200,80 280,140 280,260 200,320 120,260 120,140" strokeDasharray="5 5">
                        <animate attributeName="opacity" values="0.15;0.3;0.15" dur="5s" repeatCount="indefinite" />
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 200 200"
                            to="360 200 200"
                            dur="30s"
                            repeatCount="indefinite"
                        />
                    </polygon>
                </g>

                {/* Dynamic Orbit System */}
                <g fill="none">
                    {/* Orbit 1 - Main horizontal */}
                    <ellipse cx="200" cy="200" rx="185" ry="75" stroke="url(#orbitGrad)" strokeWidth="1.5" opacity="0.4" />
                    <g filter="url(#bloom)">
                        {/* Primary particle */}
                        <circle r="5" fill="#ddd6fe">
                            <animateMotion
                                dur="5s"
                                repeatCount="indefinite"
                                path="M 15,200 a 185,75 0 1,0 370,0 a 185,75 0 1,0 -370,0"
                            />
                        </circle>
                        {/* Secondary particle - opposite side */}
                        <circle r="3" fill="#a78bfa">
                            <animateMotion
                                dur="5s"
                                repeatCount="indefinite"
                                begin="2.5s"
                                path="M 15,200 a 185,75 0 1,0 370,0 a 185,75 0 1,0 -370,0"
                            />
                        </circle>
                    </g>

                    {/* Orbit 2 - Vertical */}
                    <ellipse cx="200" cy="200" rx="70" ry="185" stroke="#8b5cf6" strokeWidth="1.5" strokeOpacity="0.25" />
                    <g filter="url(#bloom)">
                        <circle r="4.5" fill="#a78bfa">
                            <animateMotion
                                dur="7s"
                                repeatCount="indefinite"
                                path="M 200,15 a 70,185 0 1,1 0,370 a 70,185 0 1,1 0,-370"
                            />
                        </circle>
                    </g>

                    {/* Orbit 3 - Diagonal tilted */}
                    <ellipse cx="200" cy="200" rx="150" ry="150" stroke="#6366f1" strokeWidth="1" strokeOpacity="0.2" transform="rotate(45 200 200)" />
                    <g filter="url(#bloom)">
                        <circle r="3.5" fill="#c4b5fd">
                            <animateMotion
                                dur="9s"
                                repeatCount="indefinite"
                                path="M 50,200 a 150,150 0 1,0 300,0 a 150,150 0 1,0 -300,0"
                                transform="rotate(45 200 200)"
                            />
                        </circle>
                    </g>

                    {/* Inner orbit - fast */}
                    <circle cx="200" cy="200" r="60" stroke="#a78bfa" strokeWidth="1" strokeOpacity="0.15" />
                    <g filter="url(#glow)">
                        <circle r="2.5" fill="#fff">
                            <animateMotion
                                dur="3s"
                                repeatCount="indefinite"
                                path="M 140,200 a 60,60 0 1,0 120,0 a 60,60 0 1,0 -120,0"
                            />
                        </circle>
                    </g>
                </g>

                {/* Neural Network Connections */}
                <g stroke="url(#energyStream)" strokeWidth="2" strokeLinecap="round">
                    {/* Flowing data stream 1 */}
                    <path d="M 40,200 Q 120,100 200,150 T 360,200" opacity="0.7">
                        <animate attributeName="stroke-dasharray" values="0,600; 600,0; 0,600" dur="6s" repeatCount="indefinite" />
                    </path>
                    {/* Flowing data stream 2 */}
                    <path d="M 40,200 Q 120,300 200,250 T 360,200" opacity="0.7">
                        <animate attributeName="stroke-dasharray" values="600,0; 0,600; 600,0" dur="8s" repeatCount="indefinite" />
                    </path>
                    {/* Diagonal connections */}
                    <path d="M 100,100 Q 150,150 200,200 Q 250,250 300,300" opacity="0.5">
                        <animate attributeName="stroke-dasharray" values="0,400; 400,0; 0,400" dur="7s" repeatCount="indefinite" />
                    </path>
                    <path d="M 300,100 Q 250,150 200,200 Q 150,250 100,300" opacity="0.5">
                        <animate attributeName="stroke-dasharray" values="400,0; 0,400; 400,0" dur="9s" repeatCount="indefinite" />
                    </path>
                </g>

                {/* Peripheral Energy Nodes */}
                <g filter="url(#glow)">
                    <circle cx="200" cy="30" r="4" fill="#e0e7ff">
                        <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="r" values="4;5.5;4" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="370" cy="200" r="4.5" fill="#a78bfa">
                        <animate attributeName="opacity" values="0.5;1;0.5" dur="4s" repeatCount="indefinite" />
                        <animate attributeName="r" values="4.5;6;4.5" dur="4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="30" cy="200" r="4" fill="#c084fc">
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="3.5s" repeatCount="indefinite" />
                        <animate attributeName="r" values="4;5.5;4" dur="3.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="200" cy="370" r="3.5" fill="#ddd6fe">
                        <animate attributeName="opacity" values="0.5;1;0.5" dur="4.5s" repeatCount="indefinite" />
                        <animate attributeName="r" values="3.5;5;3.5" dur="4.5s" repeatCount="indefinite" />
                    </circle>
                </g>

                {/* Central Power Core - Multi-layered */}
                <g filter="url(#bloom)">
                    {/* Outermost energy ring */}
                    <circle cx="200" cy="200" r="40" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.2">
                        <animate attributeName="r" values="40;50;40" dur="4s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.2;0.05;0.2" dur="4s" repeatCount="indefinite" />
                    </circle>

                    {/* Secondary pulse ring */}
                    <circle cx="200" cy="200" r="32" fill="#7c3aed" opacity="0.25">
                        <animate attributeName="r" values="32;42;32" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.25;0.08;0.25" dur="3s" repeatCount="indefinite" />
                    </circle>

                    {/* Inner glow halo */}
                    <circle cx="200" cy="200" r="24" fill="#a78bfa" opacity="0.35">
                        <animate attributeName="r" values="24;28;24" dur="2s" repeatCount="indefinite" />
                    </circle>

                    {/* Solid core sphere */}
                    <circle cx="200" cy="200" r="16" fill="url(#coreGrad)">
                        <animate attributeName="r" values="16;18;16" dur="1.8s" repeatCount="indefinite" />
                    </circle>

                    {/* Ultra-bright center */}
                    <circle cx="200" cy="200" r="6" fill="#ffffff" opacity="0.9">
                        <animate attributeName="opacity" values="0.9;1;0.9" dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="r" values="6;7;6" dur="1.5s" repeatCount="indefinite" />
                    </circle>

                    {/* Rotating energy particles around core */}
                    <g>
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 200 200"
                            to="360 200 200"
                            dur="2.5s"
                            repeatCount="indefinite"
                        />
                        <circle cx="235" cy="200" r="2.5" fill="#fff" opacity="0.9" />
                        <circle cx="165" cy="200" r="2.5" fill="#fff" opacity="0.9" />
                    </g>
                    <g>
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 200 200"
                            to="-360 200 200"
                            dur="3.5s"
                            repeatCount="indefinite"
                        />
                        <circle cx="200" cy="165" r="2" fill="#e0e7ff" opacity="0.8" />
                        <circle cx="200" cy="235" r="2" fill="#e0e7ff" opacity="0.8" />
                    </g>
                </g>

                {/* Holographic UI Elements */}
                <g opacity="0.5" stroke="#a78bfa" fill="none" strokeWidth="2" filter="url(#glow)">
                    {/* Corner brackets */}
                    <path d="M 30,160 L 30,200 L 70,200">
                        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
                    </path>
                    <path d="M 370,160 L 370,200 L 330,200">
                        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="4s" repeatCount="indefinite" />
                    </path>
                    <path d="M 30,240 L 30,200 L 70,200">
                        <animate attributeName="opacity" values="0.5;1;0.5" dur="5s" repeatCount="indefinite" />
                    </path>
                    <path d="M 370,240 L 370,200 L 330,200">
                        <animate attributeName="opacity" values="1;0.5;1" dur="5s" repeatCount="indefinite" />
                    </path>
                </g>

                {/* Floating Tech Hexagons */}
                <g opacity="0.6" stroke="#c084fc" fill="none" strokeWidth="2" filter="url(#glow)">
                    <g transform="translate(50, 180)">
                        <path d="M 0,-12 L 10,-6 L 10,6 L 0,12 L -10,6 L -10,-6 Z">
                            <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
                            <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0 0 0"
                                to="360 0 0"
                                dur="20s"
                                repeatCount="indefinite"
                            />
                        </path>
                    </g>
                    <g transform="translate(350, 220)">
                        <path d="M 0,-12 L 10,-6 L 10,6 L 0,12 L -10,6 L -10,-6 Z">
                            <animate attributeName="opacity" values="1;0.4;1" dur="4s" repeatCount="indefinite" />
                            <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0 0 0"
                                to="-360 0 0"
                                dur="25s"
                                repeatCount="indefinite"
                            />
                        </path>
                    </g>
                </g>
            </svg>

            <style jsx>{`
                @keyframes primaryPulse {
                    0%, 100% { 
                        opacity: 0.6; 
                        transform: translate(-50%, -50%) scale(1); 
                    }
                    50% { 
                        opacity: 0.9; 
                        transform: translate(-50%, -50%) scale(1.15); 
                    }
                }

                @keyframes secondaryPulse {
                    0%, 100% { 
                        opacity: 0.5; 
                        transform: translate(-50%, -50%) scale(0.95); 
                    }
                    50% { 
                        opacity: 0.8; 
                        transform: translate(-50%, -50%) scale(1.1); 
                    }
                }
            `}</style>
        </div>
    )
}
