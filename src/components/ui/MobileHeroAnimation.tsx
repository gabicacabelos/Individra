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
                className="relative z-10 w-[270px] sm:w-[310px] h-[270px] sm:h-[310px] flex items-center justify-center pointer-events-none"
            >
                {/* Emblema 3D levitando, completo y sin emisiones de luz */}
                <div className="relative w-[250px] sm:w-[290px] h-[250px] sm:h-[290px]">
                    <Image
                        src="/individra-3d-floating.png"
                        alt="Emblema 3D de INDIVIDRA"
                        width={900}
                        height={900}
                        sizes="(max-width: 640px) 250px, (max-width: 1024px) 290px, 510px"
                        className="w-full h-full object-contain"
                        loading="eager"
                    />
                </div>
            </motion.div>
        </div>
    )
}
