'use client'

import { motion } from 'framer-motion'

// Tech Aura Animation - Using only Framer Motion for maximum compatibility
export function MobileHeroAnimation() {
    return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
            {/* Large Ambient Glow Background */}
            <motion.div
                className="absolute w-[300px] h-[300px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, rgba(59, 130, 246, 0.15) 40%, transparent 70%)',
                    filter: 'blur(20px)',
                }}
                animate={{
                    opacity: [0.6, 1, 0.6],
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Secondary Glow */}
            <motion.div
                className="absolute w-[200px] h-[200px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 60%)',
                    filter: 'blur(15px)',
                }}
                animate={{
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1.1, 0.9, 1.1],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
            />

            {/* Rotating Orbit Ring 1 */}
            <motion.div
                className="absolute w-[280px] h-[280px] rounded-full border border-violet-500/30"
                style={{ borderStyle: 'dashed' }}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Rotating Orbit Ring 2 - Opposite */}
            <motion.div
                className="absolute w-[220px] h-[220px] rounded-full border border-blue-500/25"
                animate={{ rotate: -360 }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Rotating Orbit Ring 3 - Inner */}
            <motion.div
                className="absolute w-[160px] h-[160px] rounded-full border border-violet-400/20"
                style={{ borderStyle: 'dotted' }}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Orbiting Particles - Ring 1 */}
            <motion.div
                className="absolute w-[280px] h-[280px]"
                animate={{ rotate: 360 }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-violet-500 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.8)]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            </motion.div>

            {/* Orbiting Particles - Ring 2 */}
            <motion.div
                className="absolute w-[220px] h-[220px]"
                animate={{ rotate: -360 }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 bg-violet-400 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
            </motion.div>

            {/* Orbiting Particles - Ring 3 */}
            <motion.div
                className="absolute w-[160px] h-[160px]"
                animate={{ rotate: 360 }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            </motion.div>

            {/* Static Peripheral Nodes - Pulsing */}
            {/* Top */}
            <motion.div
                className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full"
                style={{ boxShadow: '0 0 15px rgba(255,255,255,0.8)' }}
                animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.3, 1],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Bottom */}
            <motion.div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-emerald-400 rounded-full"
                style={{ boxShadow: '0 0 15px rgba(16,185,129,0.8)' }}
                animate={{
                    opacity: [0.4, 0.9, 0.4],
                    scale: [1, 1.2, 1],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            {/* Left */}
            <motion.div
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-violet-500 rounded-full"
                style={{ boxShadow: '0 0 20px rgba(139,92,246,0.9)' }}
                animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.4, 1],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Right */}
            <motion.div
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full"
                style={{ boxShadow: '0 0 20px rgba(59,130,246,0.9)' }}
                animate={{
                    opacity: [1, 0.3, 1],
                    scale: [1.2, 1, 1.2],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Diagonal Nodes */}
            <motion.div
                className="absolute top-12 left-12 w-2.5 h-2.5 bg-violet-400 rounded-full"
                style={{ boxShadow: '0 0 12px rgba(139,92,246,0.7)' }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-12 right-12 w-2.5 h-2.5 bg-blue-400 rounded-full"
                style={{ boxShadow: '0 0 12px rgba(59,130,246,0.7)' }}
                animate={{ opacity: [0.6, 0.2, 0.6] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-12 left-12 w-2 h-2 bg-blue-400 rounded-full"
                style={{ boxShadow: '0 0 10px rgba(59,130,246,0.7)' }}
                animate={{ opacity: [0.3, 0.9, 0.3] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-12 right-12 w-2 h-2 bg-violet-400 rounded-full"
                style={{ boxShadow: '0 0 10px rgba(139,92,246,0.7)' }}
                animate={{ opacity: [0.7, 0.3, 0.7] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Connection Lines - Using CSS */}
            <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.4 }}>
                <defs>
                    <linearGradient id="lineGradH" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                    <linearGradient id="lineGradV" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                    <linearGradient id="lineGradD1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                    <linearGradient id="lineGradD2" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </defs>
                {/* Horizontal */}
                <motion.line
                    x1="10%" y1="50%" x2="90%" y2="50%"
                    stroke="url(#lineGradH)"
                    strokeWidth="1"
                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Vertical */}
                <motion.line
                    x1="50%" y1="10%" x2="50%" y2="90%"
                    stroke="url(#lineGradV)"
                    strokeWidth="1"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
                {/* Diagonal 1 */}
                <motion.line
                    x1="15%" y1="15%" x2="85%" y2="85%"
                    stroke="url(#lineGradD1)"
                    strokeWidth="0.5"
                    animate={{ opacity: [0.15, 0.4, 0.15] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Diagonal 2 */}
                <motion.line
                    x1="85%" y1="15%" x2="15%" y2="85%"
                    stroke="url(#lineGradD2)"
                    strokeWidth="0.5"
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
            </svg>

            {/* Central Core */}
            <div className="absolute flex items-center justify-center">
                {/* Outer Pulse */}
                <motion.div
                    className="absolute w-24 h-24 rounded-full bg-violet-500/20"
                    animate={{
                        scale: [1, 1.8, 1],
                        opacity: [0.3, 0, 0.3],
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeOut"
                    }}
                />

                {/* Second Pulse */}
                <motion.div
                    className="absolute w-20 h-20 rounded-full bg-blue-500/25"
                    animate={{
                        scale: [1, 1.6, 1],
                        opacity: [0.4, 0, 0.4],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: 0.5
                    }}
                />

                {/* Outer Glow Ring */}
                <motion.div
                    className="absolute w-16 h-16 rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(59,130,246,0.2) 50%, transparent 70%)',
                    }}
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.6, 0.3, 0.6],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Core Circle */}
                <motion.div
                    className="absolute w-10 h-10 rounded-full"
                    style={{
                        background: 'radial-gradient(circle, #fff 0%, #3b82f6 40%, #8b5cf6 100%)',
                        boxShadow: '0 0 30px rgba(139,92,246,0.8), 0 0 60px rgba(59,130,246,0.5)',
                    }}
                    animate={{
                        scale: [1, 1.15, 1],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Inner Bright Core */}
                <motion.div
                    className="absolute w-4 h-4 rounded-full bg-white"
                    style={{
                        boxShadow: '0 0 20px rgba(255,255,255,0.9)',
                    }}
                    animate={{
                        opacity: [0.8, 1, 0.8],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Rotating particles around core */}
                <motion.div
                    className="absolute w-14 h-14"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]" />
                </motion.div>

                <motion.div
                    className="absolute w-12 h-12"
                    animate={{ rotate: -360 }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-1 bg-violet-300 rounded-full shadow-[0_0_6px_#8b5cf6]" />
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-1 bg-blue-300 rounded-full shadow-[0_0_6px_#3b82f6]" />
                </motion.div>
            </div>

            {/* Floating Hexagon Accents */}
            <motion.div
                className="absolute top-8 left-8 w-4 h-4 border border-violet-500/50 rotate-45"
                animate={{
                    opacity: [0.3, 0.7, 0.3],
                    rotate: [45, 225, 405],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-8 right-8 w-3 h-3 border border-blue-500/50 rotate-45"
                animate={{
                    opacity: [0.4, 0.8, 0.4],
                    rotate: [45, -135, -315],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-8 left-8 w-3 h-3 border border-blue-500/40 rotate-45"
                animate={{
                    opacity: [0.2, 0.6, 0.2],
                    scale: [1, 1.3, 1],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-8 right-8 w-4 h-4 border border-violet-500/40 rotate-45"
                animate={{
                    opacity: [0.5, 0.9, 0.5],
                    scale: [1.2, 1, 1.2],
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    )
}
