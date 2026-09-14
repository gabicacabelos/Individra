'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export function MobileHeroAnimation() {
    return (
        <div className="relative w-full max-w-[280px] sm:max-w-[320px] mx-auto py-4 flex flex-col items-center justify-center">
            {/* Free-Floating 3D Core in space */}
            <motion.div
                animate={{
                    y: [0, -10, 0],
                }}
                transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="relative z-10 w-[240px] sm:w-[270px] h-[240px] sm:h-[270px] flex items-center justify-center pointer-events-none"
            >
                {/* Emblema 3D levitando, completo y sin emisiones de luz */}
                <div className="relative w-[220px] sm:w-[250px] h-[220px] sm:h-[250px]">
                    <Image
                        src="/individra-3d-floating.png"
                        alt="Emblema 3D de INDIVIDRA"
                        width={500}
                        height={500}
                        className="w-full h-full object-contain"
                        priority
                    />
                </div>
            </motion.div>
        </div>
    )
}
