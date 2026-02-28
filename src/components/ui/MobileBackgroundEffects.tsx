'use client'

// Ultra-optimized backgrounds for mobile - GPU accelerated, minimal repaints

// Services section background - Simplified for performance
export function MobileServicesBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none md:hidden" style={{ contain: 'strict' }}>
            {/* Gradient orbs - CSS only */}
            <div className="services-orb-1" />
            <div className="services-orb-2" />

            {/* SVG shapes with optimized SMIL */}
            <svg className="absolute inset-0 w-full h-full" style={{ transform: 'translateZ(0)' }}>
                <defs>
                    <linearGradient id="sGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(139,92,246,0.25)" />
                        <stop offset="100%" stopColor="rgba(59,130,246,0.1)" />
                    </linearGradient>
                </defs>

                {/* Círculos flotantes */}
                <circle cx="8%" cy="35%" r="6" fill="url(#sGrad1)">
                    <animate attributeName="cy" values="35%;30%;35%" dur="5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="92%" cy="55%" r="5" fill="url(#sGrad1)">
                    <animate attributeName="cy" values="55%;50%;55%" dur="6s" repeatCount="indefinite"/>
                </circle>

                {/* Líneas conectoras */}
                <line x1="10%" y1="25%" x2="35%" y2="45%" stroke="rgba(139,92,246,0.15)" strokeWidth="1" strokeDasharray="4 4">
                    <animate attributeName="stroke-dashoffset" values="0;16" dur="3s" repeatCount="indefinite"/>
                </line>
                <line x1="65%" y1="35%" x2="90%" y2="55%" stroke="rgba(59,130,246,0.15)" strokeWidth="1" strokeDasharray="4 4">
                    <animate attributeName="stroke-dashoffset" values="0;-16" dur="3s" repeatCount="indefinite"/>
                </line>
            </svg>

            {/* Partículas CSS */}
            <div className="services-particle" style={{ left: '20%', top: '25%', animationDelay: '0s' }} />
            <div className="services-particle" style={{ left: '80%', top: '40%', animationDelay: '1.5s' }} />
            <div className="services-particle" style={{ left: '50%', top: '70%', animationDelay: '3s' }} />

            <style jsx>{`
                .services-orb-1 {
                    position: absolute;
                    width: 200px;
                    height: 200px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%);
                    left: -50px;
                    top: 15%;
                    animation: orbMove1 10s ease-in-out infinite;
                    will-change: transform;
                    transform: translateZ(0);
                }
                .services-orb-2 {
                    position: absolute;
                    width: 160px;
                    height: 160px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%);
                    right: -40px;
                    bottom: 25%;
                    animation: orbMove2 12s ease-in-out infinite;
                    will-change: transform;
                    transform: translateZ(0);
                }
                .services-particle {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background: rgba(139,92,246,0.5);
                    animation: particlePulse 4s ease-in-out infinite;
                    will-change: transform, opacity;
                    transform: translateZ(0);
                }
                @keyframes orbMove1 {
                    0%, 100% { transform: translateZ(0) translate(0, 0); }
                    50% { transform: translateZ(0) translate(20px, -15px); }
                }
                @keyframes orbMove2 {
                    0%, 100% { transform: translateZ(0) translate(0, 0); }
                    50% { transform: translateZ(0) translate(-15px, 20px); }
                }
                @keyframes particlePulse {
                    0%, 100% { transform: translateZ(0) scale(0.8); opacity: 0.3; }
                    50% { transform: translateZ(0) scale(1.2); opacity: 0.7; }
                }
            `}</style>
        </div>
    )
}

// Catalog section background - Grid effect optimized
export function MobileCatalogBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none md:hidden" style={{ contain: 'strict' }}>
            <svg className="absolute inset-0 w-full h-full opacity-25" style={{ transform: 'translateZ(0)' }}>
                <defs>
                    <linearGradient id="cGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(139,92,246,0.4)"/>
                        <stop offset="100%" stopColor="rgba(59,130,246,0.2)"/>
                    </linearGradient>
                    <pattern id="cGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(139,92,246,0.08)" strokeWidth="0.5"/>
                    </pattern>
                </defs>

                <rect width="100%" height="100%" fill="url(#cGrid)" />

                {/* Línea de escaneo horizontal */}
                <rect x="0" width="100%" height="1" fill="url(#cGrad)">
                    <animate attributeName="y" values="0%;100%" dur="10s" repeatCount="indefinite"/>
                </rect>

                {/* Celdas que brillan */}
                <rect x="20%" y="30%" width="60" height="60" fill="rgba(139,92,246,0.08)">
                    <animate attributeName="opacity" values="0;0.4;0" dur="4s" repeatCount="indefinite"/>
                </rect>
                <rect x="60%" y="60%" width="60" height="60" fill="rgba(59,130,246,0.08)">
                    <animate attributeName="opacity" values="0;0.4;0" dur="4s" repeatCount="indefinite" begin="2s"/>
                </rect>
            </svg>

            {/* Corner accents estáticos con pulse suave */}
            <div className="catalog-corner top-3 left-3" />
            <div className="catalog-corner top-3 right-3" style={{ transform: 'scaleX(-1)' }} />
            <div className="catalog-corner bottom-3 left-3" style={{ transform: 'scaleY(-1)' }} />
            <div className="catalog-corner bottom-3 right-3" style={{ transform: 'scale(-1)' }} />

            <style jsx>{`
                .catalog-corner {
                    position: absolute;
                    width: 24px;
                    height: 24px;
                    border-left: 1px solid rgba(139,92,246,0.4);
                    border-top: 1px solid rgba(139,92,246,0.4);
                    animation: cornerFade 3s ease-in-out infinite;
                    will-change: opacity;
                }
                @keyframes cornerFade {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.7; }
                }
            `}</style>
        </div>
    )
}

// FAQ section background - Minimal floating elements
export function MobileFAQBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none md:hidden" style={{ contain: 'strict' }}>
            {/* Orbs suaves */}
            <div className="faq-orb-1" />
            <div className="faq-orb-2" />

            {/* SVG con signos de interrogación */}
            <svg className="absolute inset-0 w-full h-full" style={{ transform: 'translateZ(0)' }}>
                <text x="15%" y="25%" fill="rgba(139,92,246,0.12)" fontSize="20" fontWeight="bold">
                    ?
                    <animate attributeName="y" values="25%;22%;25%" dur="6s" repeatCount="indefinite"/>
                </text>
                <text x="50%" y="50%" fill="rgba(59,130,246,0.12)" fontSize="20" fontWeight="bold">
                    ?
                    <animate attributeName="y" values="50%;47%;50%" dur="7s" repeatCount="indefinite"/>
                </text>
                <text x="85%" y="75%" fill="rgba(139,92,246,0.12)" fontSize="20" fontWeight="bold">
                    ?
                    <animate attributeName="y" values="75%;72%;75%" dur="5s" repeatCount="indefinite"/>
                </text>

                {/* Puntos flotantes */}
                <circle cx="25%" cy="60%" r="1.5" fill="rgba(139,92,246,0.3)">
                    <animate attributeName="cy" values="60%;57%;60%" dur="5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="75%" cy="35%" r="1.5" fill="rgba(59,130,246,0.3)">
                    <animate attributeName="cy" values="35%;32%;35%" dur="6s" repeatCount="indefinite"/>
                </circle>
            </svg>

            {/* Wave estática con gradiente */}
            <svg className="absolute bottom-0 left-0 w-full h-16" preserveAspectRatio="none" viewBox="0 0 400 60">
                <path
                    d="M0,30 Q100,10 200,30 T400,30 L400,60 L0,60 Z"
                    fill="rgba(139,92,246,0.04)"
                />
            </svg>

            <style jsx>{`
                .faq-orb-1 {
                    position: absolute;
                    width: 180px;
                    height: 180px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%);
                    left: -60px;
                    top: 10%;
                    animation: faqFloat1 12s ease-in-out infinite;
                    will-change: transform;
                    transform: translateZ(0);
                }
                .faq-orb-2 {
                    position: absolute;
                    width: 150px;
                    height: 150px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%);
                    right: -50px;
                    bottom: 25%;
                    animation: faqFloat2 15s ease-in-out infinite;
                    will-change: transform;
                    transform: translateZ(0);
                }
                @keyframes faqFloat1 {
                    0%, 100% { transform: translateZ(0) translate(0, 0); }
                    50% { transform: translateZ(0) translate(30px, 20px); }
                }
                @keyframes faqFloat2 {
                    0%, 100% { transform: translateZ(0) translate(0, 0); }
                    50% { transform: translateZ(0) translate(-25px, -15px); }
                }
            `}</style>
        </div>
    )
}
