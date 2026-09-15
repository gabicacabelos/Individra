'use client'

interface MobileProcessAnimationProps {
    activeStep: number
    scrollProgress: number
    glowColor: string
    IconComponent: React.ComponentType<{ className?: string }>
    totalSteps: number
    /** Clase de gradiente Tailwind del paso, ej: 'from-[#C84214] to-[#B7B3B0]' */
    gradientClass?: string
}

/**
 * Foco visual del paso activo en mobile para "Nuestro Proceso".
 * Premium y sobrio: disco glossy con el ícono del paso, un halo suave y un
 * anillo fino estático. Sin formas morphing, partículas orbitando ni anillos
 * punteados girando (el look "IA slop" de la versión anterior). El cambio de
 * paso lo maneja el scroll del contenedor padre; acá solo animamos la entrada.
 */
export function MobileProcessAnimation({
    activeStep,
    glowColor,
    IconComponent,
    gradientClass = 'from-[#C84214] to-[#B7B3B0]',
}: MobileProcessAnimationProps) {
    return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden pointer-events-none">
            {/* Halo suave detrás del disco (cambia de color por paso) */}
            <div
                aria-hidden
                className="absolute h-40 w-40 rounded-full blur-[46px] transition-colors duration-700"
                style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }}
            />

            {/* Anillos finos concéntricos, estáticos: dan profundidad sin ruido */}
            <div aria-hidden className="absolute h-32 w-32 rounded-full border border-white/[0.07]" />
            <div aria-hidden className="absolute h-[104px] w-[104px] rounded-full border border-white/[0.04]" />

            {/* Disco glossy con el ícono del paso. key -> re-anima la entrada al cambiar de paso */}
            <div
                key={activeStep}
                className={`process-disc relative flex h-[76px] w-[76px] items-center justify-center rounded-[1.4rem] bg-gradient-to-br ${gradientClass} shadow-[0_18px_44px_-12px_rgba(0,0,0,0.75)]`}
            >
                {/* brillo especular sutil arriba */}
                <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[1.4rem] bg-gradient-to-br from-white/25 via-transparent to-transparent" />
                <IconComponent className="relative h-9 w-9 text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.45)]" />
            </div>

            <style jsx>{`
                @keyframes discIn {
                    0% { transform: scale(0.88); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .process-disc {
                    animation: discIn 0.42s cubic-bezier(0.22, 1, 0.36, 1);
                }
            `}</style>
        </div>
    )
}
