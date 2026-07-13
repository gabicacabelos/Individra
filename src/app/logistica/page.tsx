import type { Metadata } from 'next'
import { LogisticaLanding } from '@/components/logistica/LogisticaLanding'

export const metadata: Metadata = {
    title: 'Logística | Individra — Automatización de entregas por WhatsApp',
    description:
        'Un asistente por WhatsApp, web y teléfono que responde el estado de cada entrega, coordina las visitas antes de que salga el camión y avisa cuando algo se demora. Sin cambiar tu sistema actual.',
    alternates: {
        canonical: '/logistica',
    },
    openGraph: {
        title: 'Logística | Individra',
        description:
            'Automatización de entregas para logística y distribución: estado de pedidos, coordinación de visitas y avisos proactivos por WhatsApp.',
        url: 'https://www.individratec.com/logistica',
        siteName: 'Individra',
        locale: 'es_AR',
        type: 'website',
    },
}

export default function LogisticaPage() {
    return <LogisticaLanding />
}
