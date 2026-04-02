'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function PromoVideoSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start']
    })

    // Parallax slightly moves the video background up as we scroll down
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
    
    return (
        <section ref={sectionRef} className="relative w-full h-[60vh] lg:h-[80vh] overflow-hidden bg-black flex items-center justify-center border-y border-white/5">
            {/* Parallax Video Container */}
            <motion.div 
                style={{ y }}
                className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none"
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-[1.10] object-center"
                >
                    <source src="/videoLoopPromo.mp4" type="video/mp4" />
                </video>
            </motion.div>

            {/* Glassmorphism gradient overlays to integrate it smoothly */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black pointer-events-none" />
            <div className="absolute inset-0 bg-violet-900/20 mix-blend-overlay pointer-events-none" />

            {/* Glowing inner shadow top and bottom to blend with other sections */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />

            {/* Content overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8"
                >
                    <div className="px-6 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-sm">
                        <span className="text-violet-300 text-sm font-semibold uppercase tracking-wider">
                            La nueva era de la automatización
                        </span>
                    </div>
                </motion.div>

                <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-tight"
                >
                    Visualiza el <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
                        futuro de tu empresa
                    </span>
                </motion.h2>
                
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="mt-8 text-lg sm:text-xl text-neutral-300 max-w-2xl font-light leading-relaxed mx-auto"
                >
                    Integración fluida, tecnología que inspira. Implementamos ecosistemas multi-agente para potenciar y transformar la forma en la que operás todos los días.
                </motion.p>
            </div>
        </section>
    )
}
