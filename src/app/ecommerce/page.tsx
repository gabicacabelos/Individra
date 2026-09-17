import type { Metadata } from 'next'
import { EcommerceLanding } from '@/components/ecommerce/EcommerceLanding'

export const metadata: Metadata = {
    title: 'E-commerce | Individra — Automatización de ventas y post-venta por WhatsApp',
    description:
        'Un asistente por WhatsApp y en tus publicaciones que responde las preguntas de compra al instante, avisa el estado de cada pedido y cuida tu reputación en Mercado Libre. Sin cambiar tu tienda actual.',
    alternates: {
        canonical: '/ecommerce',
    },
    openGraph: {
        title: 'E-commerce | Individra',
        description:
            'Automatización de ventas y post-venta para tiendas online y marketplaces: respuestas de compra, estado de pedidos, devoluciones y reputación por WhatsApp.',
        url: 'https://www.individratec.com/ecommerce',
        siteName: 'Individra',
        locale: 'es_AR',
        type: 'website',
    },
}

export default function EcommercePage() {
    return <EcommerceLanding />
}
