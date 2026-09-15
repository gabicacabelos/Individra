'use client'

import Image from 'next/image'

interface MobileProcessAnimationProps {
    activeStep: number
    scrollProgress: number
    glowColor: string
    /** Ícono 3D del paso (PNG con transparencia en /public/3d) */
    img: string
    iw: number
    ih: number
    totalSteps: number
}

/**
 * Foco visual del paso activo en mobile para "Nuestro Proceso".
 * Muestra el ícono 3D premium del paso, flotando sobre un halo suave y unos
 * anillos finos estáticos. El cambio de paso lo maneja el scroll del contenedor
 * padre; acá solo animamos la entrada del ícono (key -> re-anima).
 */
export function MobileProcessAnimation({
    activeStep,
    glowColor,
    img,
    iw,
    ih,
}: MobileProcessAnimationProps) {
    return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden pointer-events-none">
            {/* Halo suave detrás del ícono (cambia de color por paso) */}
            <div
                aria-hidden
                className="absolute h-44 w-44 rounded-full blur-[46px] transition-colors duration-700"
                style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }}
            />

            {/* Anillos finos concéntricos, estáticos: dan profundidad sin ruido */}
            <div aria-hidden className="absolute h-40 w-40 rounded-full border border-white/[0.06]" />
            <div aria-hidden className="absolute h-[128px] w-[128px] rounded-full border border-white/[0.04]" />

            {/* Ícono 3D del paso. key -> re-anima la entrada al cambiar de paso */}
            <div key={activeStep} className="process-3d relative flex items-center justify-center">
                <Image
                    src={img}
                    alt=""
                    aria-hidden
                    width={iw}
                    height={ih}
                    quality={95}
                    priority
                    className="h-28 w-auto object-contain drop-shadow-[0_18px_40px_rgba(200,66,20,0.32)] sm:h-36"
                />
            </div>

            <style jsx>{`
                @keyframes proc3dIn {
                    0% { transform: scale(0.86) translateY(8px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                .process-3d {
                    animation: proc3dIn 0.42s cubic-bezier(0.22, 1, 0.36, 1);
                }
            `}</style>
        </div>
    )
}
