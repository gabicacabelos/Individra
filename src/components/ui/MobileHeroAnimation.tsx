'use client'

// Living Core Animation - Minimal & Elegant
export function MobileHeroAnimation() {
    return (
        <div className="relative w-full h-[280px] sm:h-[320px] flex items-center justify-center">
            {/* Ambient Glow */}
            <div 
                className="absolute top-1/2 left-1/2 w-[300px] h-[300px]"
                style={{
                    transform: 'translate(-50%, -50%)',
                    background: 'radial-gradient(circle, rgba(167,139,250,0.35) 0%, rgba(139,92,246,0.15) 45%, transparent 75%)',
                    filter: 'blur(60px)',
                    animation: 'pulseGlow 4s ease-in-out infinite',
                }}
            />

            {/* Main SVG */}
            <svg 
                viewBox="0 0 400 400" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full max-w-[340px] max-h-[340px]"
            >
                <defs>
                    <filter id="bloom" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6" result="blur"/>
                        <feMerge>
                            <feMergeNode in="blur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    <radialGradient id="coreGradient">
                        <stop offset="0%" stopColor="#ffffff"/>
                        <stop offset="40%" stopColor="#ddd6fe"/>
                        <stop offset="100%" stopColor="#8b5cf6"/>
                    </radialGradient>
                </defs>

                {/* Halo dinámico */}
                <circle cx="200" cy="200" r="70" fill="#8b5cf6" opacity="0.25" filter="url(#bloom)">
                    <animate attributeName="r" values="70;95;70" dur="3s" repeatCount="indefinite"/>
                </circle>

                {/* Núcleo principal */}
                <circle cx="200" cy="200" r="30" fill="url(#coreGradient)" filter="url(#bloom)">
                    <animate attributeName="r" values="30;34;30" dur="1.6s" repeatCount="indefinite"/>
                </circle>

                {/* Partículas flotando libremente */}
                {/* Partícula 1 */}
                <circle r="2" fill="#ffffff" opacity="0.8">
                    <animateMotion 
                        dur="12s" 
                        repeatCount="indefinite"
                        path="M100,200 C150,100 250,100 300,200 C250,300 150,300 100,200 Z"
                    />
                </circle>

                {/* Partícula 2 */}
                <circle r="2.5" fill="#c084fc" opacity="0.7">
                    <animateMotion 
                        dur="15s" 
                        repeatCount="indefinite"
                        path="M200,80 C300,120 300,280 200,320 C100,280 100,120 200,80 Z"
                    />
                </circle>

                {/* Partícula 3 */}
                <circle r="1.8" fill="#a78bfa" opacity="0.9">
                    <animateMotion 
                        dur="10s" 
                        repeatCount="indefinite"
                        path="M120,150 C180,60 300,140 260,260 C180,340 80,260 120,150 Z"
                    />
                </circle>

                {/* Partícula 4 */}
                <circle r="2" fill="#ffffff" opacity="0.6">
                    <animateMotion 
                        dur="18s" 
                        repeatCount="indefinite"
                        path="M80,200 C140,50 320,80 340,220 C300,350 120,320 80,200 Z"
                    />
                </circle>
            </svg>

            <style jsx>{`
                @keyframes pulseGlow {
                    0%, 100% { 
                        transform: translate(-50%, -50%) scale(1); 
                        opacity: 0.7; 
                    }
                    50% { 
                        transform: translate(-50%, -50%) scale(1.15); 
                        opacity: 1; 
                    }
                }
            `}</style>
        </div>
    )
}
