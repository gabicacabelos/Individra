'use client'

// Living Core Animation - Optimized for Mobile Performance
export function MobileHeroAnimation() {
    return (
        <div
            className="relative w-full h-[280px] sm:h-[320px] flex items-center justify-center"
            style={{ contain: 'layout style paint' }}
        >
            {/* Ambient Glow - Sin blur filter, gradiente suave */}
            <div
                className="absolute top-1/2 left-1/2 w-[280px] h-[280px] glow-pulse"
                style={{
                    transform: 'translate(-50%, -50%) translateZ(0)',
                    background: 'radial-gradient(circle, rgba(167,139,250,0.4) 0%, rgba(139,92,246,0.2) 30%, rgba(139,92,246,0.05) 60%, transparent 80%)',
                    willChange: 'transform, opacity',
                }}
            />

            {/* Main SVG - Sin filtros costosos */}
            <svg
                viewBox="0 0 400 400"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full max-w-[340px] max-h-[340px]"
                style={{ transform: 'translateZ(0)' }}
            >
                <defs>
                    <radialGradient id="coreGradient">
                        <stop offset="0%" stopColor="#ffffff"/>
                        <stop offset="40%" stopColor="#ddd6fe"/>
                        <stop offset="100%" stopColor="#8b5cf6"/>
                    </radialGradient>
                    <radialGradient id="haloGradient">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3"/>
                        <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.1"/>
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
                    </radialGradient>
                    <radialGradient id="coreGlow">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
                        <stop offset="50%" stopColor="#ddd6fe" stopOpacity="0.5"/>
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
                    </radialGradient>
                </defs>

                {/* Halo exterior suave */}
                <circle cx="200" cy="200" r="90" fill="url(#haloGradient)">
                    <animate attributeName="r" values="85;100;85" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite"/>
                </circle>

                {/* Glow del núcleo */}
                <circle cx="200" cy="200" r="50" fill="url(#coreGlow)">
                    <animate attributeName="r" values="45;55;45" dur="2s" repeatCount="indefinite"/>
                </circle>

                {/* Núcleo principal */}
                <circle cx="200" cy="200" r="28" fill="url(#coreGradient)">
                    <animate attributeName="r" values="28;32;28" dur="1.6s" repeatCount="indefinite"/>
                </circle>

                {/* Partículas flotando - optimizadas */}
                <circle r="2.5" fill="#ffffff" opacity="0.85">
                    <animateMotion dur="10s" repeatCount="indefinite" calcMode="linear"
                        path="M100,200 C150,100 250,100 300,200 C250,300 150,300 100,200 Z"/>
                </circle>

                <circle r="2" fill="#c084fc" opacity="0.75">
                    <animateMotion dur="12s" repeatCount="indefinite" calcMode="linear"
                        path="M200,90 C280,130 280,270 200,310 C120,270 120,130 200,90 Z"/>
                </circle>

                <circle r="2" fill="#a78bfa" opacity="0.8">
                    <animateMotion dur="8s" repeatCount="indefinite" calcMode="linear"
                        path="M130,160 C200,80 300,160 260,250 C200,320 100,250 130,160 Z"/>
                </circle>
            </svg>

            <style jsx>{`
                @keyframes pulseGlow {
                    0%, 100% { transform: translate(-50%, -50%) translateZ(0) scale(1); opacity: 0.7; }
                    50% { transform: translate(-50%, -50%) translateZ(0) scale(1.1); opacity: 0.9; }
                }
                .glow-pulse { animation: pulseGlow 4s ease-in-out infinite; }
            `}</style>
        </div>
    )
}
