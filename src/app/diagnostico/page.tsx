import type { Metadata } from 'next'
import { DiagnosticoEnvios } from '@/components/diagnostico/DiagnosticoEnvios'

export const metadata: Metadata = {
    title: 'Autodiagnóstico Operativo y Calculadora de Entregas | INDIVIDRA',
    description:
        'Calculá en 2 minutos cuánto te cuestan las entregas fallidas (entregas/día × % fallos × ARS $9.980) y qué cuellos de botella podés eliminar en tu logística, distribuidora o e-commerce.',
    alternates: {
        canonical: '/diagnostico',
    },
    openGraph: {
        title: 'Autodiagnóstico Operativo y Calculadora de Entregas | INDIVIDRA',
        description:
            'Calculadora en vivo de costos por entregas fallidas y diagnóstico operativo para empresas de logística, distribuidoras mayoristas y e-commerce.',
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
