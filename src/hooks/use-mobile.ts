import { useState, useEffect } from 'react'

export function useIsMobile(breakpoint = 1024) {
    // Inicializar en false evita montajes extraños en SSR,
    // pero idealmente deberíamos sincronizarlo con el ancho inicial.
    const [isMobile, setIsMobile] = useState(true) // Assumir true previene montajes pesados 3D iniciales antes de la hidratación.

    useEffect(() => {
        if (typeof window === 'undefined') return

        const checkMobile = () => {
            setIsMobile(window.innerWidth < breakpoint)
        }

        // Chequeo inicial
        checkMobile()

        // Listener para cambios de tamaño
        window.addEventListener('resize', checkMobile)

        return () => window.removeEventListener('resize', checkMobile)
    }, [breakpoint])

    return isMobile
}
