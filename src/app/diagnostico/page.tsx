import type { Metadata } from 'next'
import { DiagnosticoEnvios } from '@/components/diagnostico/DiagnosticoEnvios'

export const metadata: Metadata = {
    title: 'Autodiagnóstico de envíos | INDIVIDRA',
    description:
        '9 preguntas, 2 minutos. Descubrí qué tan cerca está tu operación de Mercado Libre de perder exposición por temas de envíos, y tres acciones concretas para bajar el riesgo.',
    alternates: {
        canonical: '/diagnostico',
    },
    openGraph: {
        title: 'Autodiagnóstico de envíos | INDIVIDRA',
        description:
            '¿Qué tan cerca estás de perder el verde? 9 preguntas para medir el riesgo de tu operación de envíos en Mercado Libre.',
        url: 'https://www.individratec.com/diagnostico',
        siteName: 'INDIVIDRA',
        locale: 'es_AR',
        type: 'website',
    },
    // Etapa de validación: no queremos que compita en SEO con las landings principales.
    robots: {
        index: false,
        follow: true,
    },
}

export default function DiagnosticoPage() {
    return <DiagnosticoEnvios />
}
