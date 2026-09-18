import type { Metadata } from 'next'
import { EcommerceLanding } from '@/components/ecommerce/EcommerceLanding'

export const metadata: Metadata = {
    title: 'E-commerce | Individra — Inteligencia Operativa y Ventas Multicanal (Mercado Libre, WhatsApp, Tiendas)',
    description:
        'Un Centro multicanal que responde las preguntas de compra al instante, avisa el estado de cada pedido y cuida tu reputación en Mercado Libre, Tiendanube, Shopify, WhatsApp e Instagram. Sin cambiar tu tienda actual.',
    alternates: {
        canonical: '/ecommerce',
    },
    openGraph: {
        title: 'E-commerce | Individra — Inteligencia Operativa y Ventas Multicanal',
        description:
            'Automatización de ventas y post-venta multicanal: Mercado Libre, Tiendanube, Shopify, WhatsApp e Instagram en una sola bandeja, con IA que responde y estado de pedidos, devoluciones y reputación.',
        url: 'https://www.individratec.com/ecommerce',
        siteName: 'Individra',
        locale: 'es_AR',
        type: 'website',
    },
}

export default function EcommercePage() {
    return <EcommerceLanding />
}
