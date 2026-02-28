'use client'

import { useMemo } from 'react'

// Optimized floating geometric shapes for services section - Pure CSS animations
export function MobileServicesBackground() {
    // Pre-computed stable positions for particles
    const particles = useMemo(() => [
        { left: 15, top: 20, color: 0, delay: 0 },
        { left: 85, top: 35, color: 1, delay: 0.5 },
        { left: 25, top: 60, color: 2, delay: 1 },
        { left: 75, top: 75, color: 0, delay: 1.5 },
        { left: 45, top: 15, color: 1, delay: 2 },
        { left: 55, top: 85, color: 2, delay: 2.5 },
    ], [])

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none md:hidden">
            {/* Gradient orbs - CSS animation only, no blur */}
            <div
                className="absolute w-64 h-64 rounded-full orb-float-1"
                style={{
                    background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(139,92,246,0.04) 50%, transparent 70%)',
                    left: '-10%',
                    top: '20%',
                    willChange: 'transform',
                }}
            />
            <div
                className="absolute w-48 h-48 rounded-full orb-float-2"
                style={{
                    background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0.03) 50%, transparent 70%)',
                    right: '-5%',
                    bottom: '30%',
                    willChange: 'transform',
                }}
            />

            {/* SVG shapes with native SMIL animations */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="servicesShapeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(139,92,246,0.3)" />
                        <stop offset="100%" stopColor="rgba(59,130,246,0.1)" />
                    </linearGradient>
                    <linearGradient id="servicesShapeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(59,130,246,0.3)" />
                        <stop offset="100%" stopColor="rgba(16,185,129,0.1)" />
                    </linearGradient>
                </defs>

                {/* Circles with SMIL */}
                <circle cx="5%" cy="40%" r="8" fill="url(#servicesShapeGrad1)">
                    <animate attributeName="cy" values="40%;35%;40%" dur="4s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.3;0.6;0.3" dur="4s" repeatCount="indefinite"/>
                </circle>
                <circle cx="95%" cy="50%" r="6" fill="url(#servicesShapeGrad2)">
                    <animate attributeName="cy" values="50%;45%;50%" dur="5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.3;0.5;0.3" dur="5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="80%" cy="10%" r="5" fill="url(#servicesShapeGrad1)">
                    <animate attributeName="cy" values="10%;5%;10%" dur="4.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.2;0.5;0.2" dur="4.5s" repeatCount="indefinite"/>
                </circle>

                {/* Triangles with SMIL rotation */}
                <polygon points="0,20 10,0 20,20" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="1"
                    style={{ transformOrigin: '10% 15%' }}>
                    <animateTransform attributeName="transform" type="rotate" from="0 40 60" to="360 40 60" dur="20s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite"/>
                </polygon>
                <polygon points="0,15 7.5,0 15,15" fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="1"
                    style={{ transformOrigin: '85% 25%' }}>
                    <animateTransform attributeName="transform" type="rotate" from="0 340 100" to="-360 340 100" dur="18s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.2;0.4;0.2" dur="4s" repeatCount="indefinite"/>
                </polygon>

                {/* Squares with SMIL */}
                <rect x="50%" y="5%" width="12" height="12" fill="none" stroke="rgba(139,92,246,0.25)" strokeWidth="1">
                    <animateTransform attributeName="transform" type="rotate" from="45 206 26" to="135 206 26" dur="15s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.2;0.4;0.2" dur="4s" repeatCount="indefinite"/>
                </rect>
                <rect x="70%" y="60%" width="10" height="10" fill="none" stroke="rgba(16,185,129,0.25)" strokeWidth="1">
                    <animateTransform attributeName="transform" type="rotate" from="-20 284 244" to="70 284 244" dur="18s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.2;0.35;0.2" dur="5s" repeatCount="indefinite"/>
                </rect>

                {/* Connecting lines with SMIL */}
                <line x1="10%" y1="20%" x2="30%" y2="40%" stroke="rgba(139,92,246,0.2)" strokeWidth="1" strokeDasharray="5 5">
                    <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="stroke-dashoffset" values="0;20" dur="2s" repeatCount="indefinite"/>
                </line>
                <line x1="70%" y1="30%" x2="90%" y2="60%" stroke="rgba(59,130,246,0.2)" strokeWidth="1" strokeDasharray="5 5">
                    <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" begin="1s"/>
                    <animate attributeName="stroke-dashoffset" values="0;-20" dur="2s" repeatCount="indefinite"/>
                </line>
            </svg>

            {/* Particles with CSS animations */}
            {particles.map((p, i) => (
                <div
                    key={`particle-${i}`}
                    className="absolute w-1 h-1 rounded-full particle-float"
                    style={{
                        left: `${p.left}%`,
                        top: `${p.top}%`,
                        backgroundColor: p.color === 0 ? 'rgba(139,92,246,0.6)' : p.color === 1 ? 'rgba(59,130,246,0.6)' : 'rgba(16,185,129,0.6)',
                        animationDelay: `${p.delay}s`,
                        willChange: 'transform, opacity',
                    }}
                />
            ))}

            <style jsx>{`
                @keyframes orbFloat1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(30px, -20px) scale(1.15); }
                }
                @keyframes orbFloat2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-20px, 30px) scale(1.2); }
                }
                @keyframes particleFloat {
                    0%, 100% { transform: translateY(0) scale(0.5); opacity: 0; }
                    50% { transform: translateY(-25px) scale(1.2); opacity: 0.7; }
                }
                .orb-float-1 { animation: orbFloat1 8s ease-in-out infinite; }
                .orb-float-2 { animation: orbFloat2 10s ease-in-out infinite 1s; }
                .particle-float { animation: particleFloat 5s ease-in-out infinite; }
            `}</style>
        </div>
    )
}

// Tech grid animation for catalog section - Optimized with CSS/SMIL
export function MobileCatalogBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none md:hidden">
            <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="catalogGridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(139,92,246,0.5)">
                            <animate attributeName="stop-color"
                                values="rgba(139,92,246,0.5);rgba(59,130,246,0.5);rgba(139,92,246,0.5)"
                                dur="5s" repeatCount="indefinite"/>
                        </stop>
                        <stop offset="100%" stopColor="rgba(59,130,246,0.3)">
                            <animate attributeName="stop-color"
                                values="rgba(59,130,246,0.3);rgba(16,185,129,0.3);rgba(59,130,246,0.3)"
                                dur="5s" repeatCount="indefinite"/>
                        </stop>
                    </linearGradient>

                    <pattern id="catalogGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="0.5"/>
                    </pattern>
                </defs>

                {/* Animated grid */}
                <rect width="100%" height="100%" fill="url(#catalogGrid)" />

                {/* Scanning line effect - SMIL */}
                <rect x="0" width="100%" height="2" fill="url(#catalogGridGrad)">
                    <animate attributeName="y" values="-5%;110%" dur="8s" repeatCount="indefinite"/>
                </rect>

                {/* Vertical scanning line - SMIL */}
                <rect y="0" width="2" height="100%" fill="url(#catalogGridGrad)">
                    <animate attributeName="x" values="-5%;110%" dur="10s" repeatCount="indefinite" begin="2s"/>
                </rect>

                {/* Pre-defined highlight cells with SMIL */}
                <rect x="12.5%" y="25%" width="50" height="50" fill="rgba(139,92,246,0.1)">
                    <animate attributeName="opacity" values="0;0.5;0" dur="3s" repeatCount="indefinite"/>
                </rect>
                <rect x="50%" y="50%" width="50" height="50" fill="rgba(59,130,246,0.1)">
                    <animate attributeName="opacity" values="0;0.5;0" dur="3.5s" repeatCount="indefinite" begin="1s"/>
                </rect>
                <rect x="75%" y="12.5%" width="50" height="50" fill="rgba(139,92,246,0.1)">
                    <animate attributeName="opacity" values="0;0.5;0" dur="2.5s" repeatCount="indefinite" begin="2s"/>
                </rect>
                <rect x="25%" y="75%" width="50" height="50" fill="rgba(59,130,246,0.1)">
                    <animate attributeName="opacity" values="0;0.5;0" dur="4s" repeatCount="indefinite" begin="0.5s"/>
                </rect>
            </svg>

            {/* Data flow particles - CSS animations */}
            <div className="catalog-data-particle" style={{ left: '18%', animationDelay: '0s' }} />
            <div className="catalog-data-particle" style={{ left: '34%', animationDelay: '0.8s' }} />
            <div className="catalog-data-particle alt" style={{ left: '50%', animationDelay: '1.6s' }} />
            <div className="catalog-data-particle" style={{ left: '66%', animationDelay: '2.4s' }} />
            <div className="catalog-data-particle alt" style={{ left: '82%', animationDelay: '3.2s' }} />

            {/* Corner accents - CSS animations */}
            <div className="absolute top-4 left-4 w-12 h-12 corner-accent">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-violet-500/60 to-transparent" />
                <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-violet-500/60 to-transparent" />
            </div>
            <div className="absolute top-4 right-4 w-12 h-12 corner-accent" style={{ animationDelay: '1s' }}>
                <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-blue-500/60 to-transparent" />
                <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-blue-500/60 to-transparent" />
            </div>
            <div className="absolute bottom-4 left-4 w-12 h-12 corner-accent" style={{ animationDelay: '0.5s' }}>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-violet-500/60 to-transparent" />
                <div className="absolute bottom-0 left-0 w-[1px] h-full bg-gradient-to-t from-violet-500/60 to-transparent" />
            </div>
            <div className="absolute bottom-4 right-4 w-12 h-12 corner-accent" style={{ animationDelay: '1.5s' }}>
                <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-blue-500/60 to-transparent" />
                <div className="absolute bottom-0 right-0 w-[1px] h-full bg-gradient-to-t from-blue-500/60 to-transparent" />
            </div>

            <style jsx>{`
                @keyframes dataFlow {
                    0% { transform: translateY(-20%); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(100vh); opacity: 0; }
                }
                @keyframes cornerPulse {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                }
                .catalog-data-particle {
                    position: absolute;
                    width: 4px;
                    height: 16px;
                    border-radius: 2px;
                    background: linear-gradient(to bottom, transparent, rgba(139,92,246,0.8), transparent);
                    animation: dataFlow 4s linear infinite;
                    will-change: transform, opacity;
                }
                .catalog-data-particle.alt {
                    background: linear-gradient(to bottom, transparent, rgba(59,130,246,0.8), transparent);
                }
                .corner-accent {
                    animation: cornerPulse 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}

// Floating orbs for FAQ section - Optimized with CSS/SMIL (no blur filters)
export function MobileFAQBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none md:hidden">
            {/* Gradient orbs - CSS animation, no blur filter */}
            <div
                className="absolute w-72 h-72 rounded-full faq-orb-1"
                style={{
                    background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0.05) 40%, transparent 70%)',
                    left: '-20%',
                    top: '10%',
                    willChange: 'transform',
                }}
            />
            <div
                className="absolute w-64 h-64 rounded-full faq-orb-2"
                style={{
                    background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 40%, transparent 70%)',
                    right: '-15%',
                    bottom: '20%',
                    willChange: 'transform',
                }}
            />

            {/* Question mark particles - SMIL animations */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <text x="15%" y="20%" fill="rgba(139,92,246,0.15)" fontSize="24" fontWeight="bold">
                    ?
                    <animate attributeName="y" values="20%;15%;20%" dur="5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.1;0.25;0.1" dur="5s" repeatCount="indefinite"/>
                </text>
                <text x="30%" y="50%" fill="rgba(59,130,246,0.15)" fontSize="24" fontWeight="bold">
                    ?
                    <animate attributeName="y" values="50%;45%;50%" dur="6s" repeatCount="indefinite" begin="0.5s"/>
                    <animate attributeName="opacity" values="0.1;0.25;0.1" dur="6s" repeatCount="indefinite" begin="0.5s"/>
                </text>
                <text x="45%" y="80%" fill="rgba(139,92,246,0.15)" fontSize="24" fontWeight="bold">
                    ?
                    <animate attributeName="y" values="80%;75%;80%" dur="5.5s" repeatCount="indefinite" begin="1s"/>
                    <animate attributeName="opacity" values="0.1;0.25;0.1" dur="5.5s" repeatCount="indefinite" begin="1s"/>
                </text>
                <text x="60%" y="20%" fill="rgba(59,130,246,0.15)" fontSize="24" fontWeight="bold">
                    ?
                    <animate attributeName="y" values="20%;15%;20%" dur="6.5s" repeatCount="indefinite" begin="1.5s"/>
                    <animate attributeName="opacity" values="0.1;0.25;0.1" dur="6.5s" repeatCount="indefinite" begin="1.5s"/>
                </text>
                <text x="75%" y="50%" fill="rgba(139,92,246,0.15)" fontSize="24" fontWeight="bold">
                    ?
                    <animate attributeName="y" values="50%;45%;50%" dur="5s" repeatCount="indefinite" begin="2s"/>
                    <animate attributeName="opacity" values="0.1;0.25;0.1" dur="5s" repeatCount="indefinite" begin="2s"/>
                </text>
                <text x="90%" y="80%" fill="rgba(59,130,246,0.15)" fontSize="24" fontWeight="bold">
                    ?
                    <animate attributeName="y" values="80%;75%;80%" dur="5.5s" repeatCount="indefinite" begin="2.5s"/>
                    <animate attributeName="opacity" values="0.1;0.25;0.1" dur="5.5s" repeatCount="indefinite" begin="2.5s"/>
                </text>

                {/* Floating dots - SMIL */}
                <circle cx="10%" cy="30%" r="1.5" fill="rgba(139,92,246,0.4)">
                    <animate attributeName="opacity" values="0;0.6;0" dur="5s" repeatCount="indefinite"/>
                    <animate attributeName="cy" values="30%;25%;30%" dur="5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="25%" cy="70%" r="2" fill="rgba(59,130,246,0.4)">
                    <animate attributeName="opacity" values="0;0.6;0" dur="6s" repeatCount="indefinite" begin="1s"/>
                    <animate attributeName="cy" values="70%;65%;70%" dur="6s" repeatCount="indefinite" begin="1s"/>
                </circle>
                <circle cx="40%" cy="40%" r="1.5" fill="rgba(16,185,129,0.4)">
                    <animate attributeName="opacity" values="0;0.6;0" dur="5.5s" repeatCount="indefinite" begin="2s"/>
                    <animate attributeName="cy" values="40%;35%;40%" dur="5.5s" repeatCount="indefinite" begin="2s"/>
                </circle>
                <circle cx="55%" cy="60%" r="2" fill="rgba(139,92,246,0.4)">
                    <animate attributeName="opacity" values="0;0.6;0" dur="6s" repeatCount="indefinite" begin="0.5s"/>
                    <animate attributeName="cy" values="60%;55%;60%" dur="6s" repeatCount="indefinite" begin="0.5s"/>
                </circle>
                <circle cx="70%" cy="25%" r="1.5" fill="rgba(59,130,246,0.4)">
                    <animate attributeName="opacity" values="0;0.6;0" dur="5s" repeatCount="indefinite" begin="1.5s"/>
                    <animate attributeName="cy" values="25%;20%;25%" dur="5s" repeatCount="indefinite" begin="1.5s"/>
                </circle>
                <circle cx="85%" cy="55%" r="2" fill="rgba(16,185,129,0.4)">
                    <animate attributeName="opacity" values="0;0.6;0" dur="5.5s" repeatCount="indefinite" begin="2.5s"/>
                    <animate attributeName="cy" values="55%;50%;55%" dur="5.5s" repeatCount="indefinite" begin="2.5s"/>
                </circle>
            </svg>

            {/* Wave effect at bottom - SMIL path animation */}
            <svg className="absolute bottom-0 left-0 w-full h-24" preserveAspectRatio="none" viewBox="0 0 400 100">
                <defs>
                    <linearGradient id="faqWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(139,92,246,0.05)" />
                        <stop offset="50%" stopColor="rgba(59,130,246,0.08)" />
                        <stop offset="100%" stopColor="rgba(139,92,246,0.05)" />
                    </linearGradient>
                </defs>
                <path fill="url(#faqWaveGrad)">
                    <animate
                        attributeName="d"
                        values="M0,50 Q100,20 200,50 T400,50 L400,100 L0,100 Z;M0,50 Q100,80 200,50 T400,50 L400,100 L0,100 Z;M0,50 Q100,20 200,50 T400,50 L400,100 L0,100 Z"
                        dur="8s"
                        repeatCount="indefinite"
                    />
                </path>
            </svg>

            <style jsx>{`
                @keyframes faqOrbFloat1 {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
                    50% { transform: translate(50px, 30px) scale(1.15); opacity: 0.25; }
                }
                @keyframes faqOrbFloat2 {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
                    50% { transform: translate(-40px, -20px) scale(1.2); opacity: 0.2; }
                }
                .faq-orb-1 { animation: faqOrbFloat1 15s ease-in-out infinite; }
                .faq-orb-2 { animation: faqOrbFloat2 12s ease-in-out infinite 2s; }
            `}</style>
        </div>
    )
}
