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
                {/* Emblema 3D levitando, completo y sin orbitales (igual que en desktop).
                    Sin mask-image: el PNG ya viene recortado al sujeto. */}
                <div className="relative w-[210px] sm:w-[240px] h-[210px] sm:h-[240px]">
                    <Image
                        src="/individra-3d-floating.png"
                        alt="Emblema 3D de INDIVIDRA"
                        width={440}
                        height={440}
                        className="w-full h-full object-contain drop-shadow-[0_18px_34px_rgba(200,66,20,0.26)]"
                        priority
                    />
                </div>
            </motion.div>
        </div>
    )
}
