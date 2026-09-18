import type { Metadata } from 'next'
import { DiagnosticoEnvios } from '@/components/diagnostico/DiagnosticoEnvios'

export const metadata: Metadata = {
    title: 'Autodiagnóstico de atención y envíos | INDIVIDRA',
    description:
        'Pocas preguntas, 2 minutos. Descubrí qué tan cerca está tu operación de perder ventas por atención lenta o envíos que se caen, vendas en Mercado Libre o en tu propia tienda, y tres acciones concretas para bajar el riesgo.',
    alternates: {
        canonical: '/diagnostico',
    },
    openGraph: {
        title: 'Autodiagnóstico de atención y envíos | INDIVIDRA',
        description:
            '¿Cuánto se te está escapando por atención lenta o envíos que se caen? Diagnóstico gratuito para vendedores de Mercado Libre, Tiendanube, Shopify y multicanal.',
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
