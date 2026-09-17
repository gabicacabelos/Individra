import type { Metadata } from 'next'
import { GuardiaFlexLanding } from '@/components/guardia-flex/GuardiaFlexLanding'

export const metadata: Metadata = {
    title: 'Guardia Flex · Test Lab (Gate 0) | INDIVIDRA',
    description:
        'Defendé tus reclamos de Mercado Libre con evidencia dura: foto del remito, geolocalización del móvil, timestamp y confirmación del destinatario. Estamos validando este frente con socios de diseño.',
    robots: {
        // Es una prueba de validación: no queremos que indexe todavía.
        index: false,
        follow: false,
    },
    alternates: {
        canonical: '/guardia-flex',
    },
}

export default function GuardiaFlexPage() {
    return <GuardiaFlexLanding />
}
