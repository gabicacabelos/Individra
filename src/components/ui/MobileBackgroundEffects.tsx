'use client'

// Ultra-optimized backgrounds for mobile - GPU accelerated, minimal repaints

// FAQ section background - Minimal floating elements
export function MobileFAQBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none md:hidden" style={{ contain: 'strict' }}>
            {/* Orbs suaves */}
            <div className="faq-orb-1" />
            <div className="faq-orb-2" />

            {/* SVG con signos de interrogación */}
            <svg className="absolute inset-0 w-full h-full" style={{ transform: 'translateZ(0)' }}>
                <text x="15%" y="25%" fill="rgba(200,66,20,0.12)" fontSize="20" fontWeight="bold">
                    ?
                    <animate attributeName="y" values="25%;22%;25%" dur="6s" repeatCount="indefinite"/>
                </text>
                <text x="50%" y="50%" fill="rgba(183,179,176,0.12)" fontSize="20" fontWeight="bold">
                    ?
                    <animate attributeName="y" values="50%;47%;50%" dur="7s" repeatCount="indefinite"/>
                </text>
                <text x="85%" y="75%" fill="rgba(200,66,20,0.12)" fontSize="20" fontWeight="bold">
                    ?
                    <animate attributeName="y" values="75%;72%;75%" dur="5s" repeatCount="indefinite"/>
                </text>

                {/* Puntos flotantes */}
                <circle cx="25%" cy="60%" r="1.5" fill="rgba(200,66,20,0.3)">
                    <animate attributeName="cy" values="60%;57%;60%" dur="5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="75%" cy="35%" r="1.5" fill="rgba(183,179,176,0.3)">
                    <animate attributeName="cy" values="35%;32%;35%" dur="6s" repeatCount="indefinite"/>
                </circle>
            </svg>

            {/* Wave estática con gradiente */}
            <svg className="absolute bottom-0 left-0 w-full h-16" preserveAspectRatio="none" viewBox="0 0 400 60">
                <path
                    d="M0,30 Q100,10 200,30 T400,30 L400,60 L0,60 Z"
                    fill="rgba(200,66,20,0.04)"
                />
            </svg>

            <style jsx>{`
                .faq-orb-1 {
                    position: absolute;
                    width: 180px;
                    height: 180px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(200,66,20,0.1) 0%, transparent 70%);
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
                    background: radial-gradient(circle, rgba(183,179,176,0.08) 0%, transparent 70%);
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
