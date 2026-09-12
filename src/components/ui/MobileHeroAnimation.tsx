'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export function MobileHeroAnimation() {
    return (
        <div className="relative w-full max-w-[280px] sm:max-w-[320px] mx-auto py-4 flex flex-col items-center justify-center">
            {/* Ambient Breathing Glow */}
            <motion.div
                animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(200,66,20,0.18)_0%,_rgba(54,53,51,0.25)_40%,_transparent_70%)] blur-2xl pointer-events-none"
            />

            {/* Free-Floating 3D Core in space (Sin recuadro) */}
            <motion.div
                animate={{
                    y: [0, -10, 0],
                    rotateZ: [0, 0.5, 0, -0.5, 0],
                }}
                transition={{
                    y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
                    rotateZ: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="relative z-10 w-[240px] sm:w-[270px] h-[240px] sm:h-[270px] flex items-center justify-center pointer-events-none"
            >
                {/* Looping Orbital Ring 1 */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border border-dashed border-[#B7B3B0]/30"
                />

                {/* Looping Orbital Ring 2 */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-3 rounded-full border border-[#B7B3B0]/20"
                    style={{ strokeDasharray: '4 10' }}
                />

                {/* 3D Core with radial blend */}
                <div className="relative w-[190px] sm:w-[220px] h-[190px] sm:h-[220px] [mask-image:radial-gradient(circle_at_50%_50%,black_48%,rgba(0,0,0,0.85)_62%,transparent_78%)] [-webkit-mask-image:radial-gradient(circle_at_50%_50%,black_48%,rgba(0,0,0,0.85)_62%,transparent_78%)]">
                    <Image
                        src="/individra-3d-floating.png"
                        alt="INDIVIDRA 3D Core"
                        width={440}
                        height={440}
                        className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
                        priority
                    />
                </div>
            </motion.div>
        </div>
    )
}
