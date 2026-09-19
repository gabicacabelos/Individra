import type { Metadata } from 'next'
import { EcommerceLanding } from '@/components/ecommerce/EcommerceLanding'

export const metadata: Metadata = {
    title: 'E-commerce | Individra — Inteligencia Operativa y Ventas Multicanal (Mercado Libre, WhatsApp, Tiendas)',
    description:
        'Unifica Mercado Libre, Tiendanube, Shopify, WhatsApp e Instagram en una sola bandeja con IA. Respuestas de pre-venta al instante, tracking logístico proactivo y protección de reputación.',
    alternates: {
        canonical: '/ecommerce',
    },
    openGraph: {
        title: 'E-commerce | Individra — Inteligencia Operativa y Ventas Multicanal',
        description:
            'Unifica Mercado Libre, Tiendanube, Shopify, WhatsApp e Instagram con IA: respuestas pre-venta, estado de pedidos proactivo y protección de reputación.',
        url: 'https://www.individratec.com/ecommerce',
        siteName: 'Individra',
        locale: 'es_AR',
        type: 'website',
    },
}

export default function EcommercePage() {
    return <EcommerceLanding />
}
