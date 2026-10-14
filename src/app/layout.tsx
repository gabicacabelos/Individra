import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { PostHogProvider } from '@/providers/PostHogProvider'
import { CookieConsent } from '@/components/CookieConsent'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { OffscreenAnimationPauser } from '@/components/OffscreenAnimationPauser'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'INDIVIDRA | Alertas de Reclamos con Plazo Exacto y Control de Color en Mercado Libre',
    description:
        'Te aviso apenas entra un reclamo, con el plazo exacto, y te digo cuánto te falta para bajar de color en Mercado Libre. Incluye módulo secundario Venta Blindada (cobro por WhatsApp + stock sincronizado en 1 clic).',
    keywords: [
        'alertas reclamos mercado libre plazo exacto',
        'cuanto me falta para bajar de color mercado libre',
        'reputación mercado libre reclamos cancelaciones',
        'sincronizar stock mercado libre tiendanube whatsapp',
        'validar comprobantes transferencia whatsapp',
        'individra consola operativa',
    ],
    authors: [{ name: 'Individra' }],
    creator: 'Individra',
    publisher: 'Individra',
    metadataBase: new URL('https://www.individratec.com'),
    alternates: {
        canonical: '/',
    },
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
            { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
            { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
            { url: '/faviconIn.png', sizes: '512x512', type: 'image/png' },
        ],
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
        shortcut: '/favicon.ico',
    },
    openGraph: {
        title: 'Te aviso apenas entra un reclamo, con el plazo exacto, y te digo cuánto te falta para bajar de color | INDIVIDRA',
        description:
            'Protegé el color de tu termómetro en Mercado Libre con alertas inmediatas de reclamos, cuenta regresiva de vencimiento y cálculo en vivo de tu margen de reputación. Incluye módulo secundario Venta Blindada.',
        url: 'https://www.individratec.com',
        siteName: 'INDIVIDRA',
        locale: 'es_AR',
        type: 'website',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'INDIVIDRA - Control de Reclamos y Termómetro de Reputación en Mercado Libre',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'INDIVIDRA | Alertas de Reclamos y Termómetro de Color en Mercado Libre',
        description:
            'Te aviso apenas entra un reclamo, con el plazo exacto, y te digo cuánto te falta para bajar de color. Más módulo secundario Venta Blindada.',
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'INDIVIDRA',
    alternateName: 'Individra',
    slogan: 'Control de Reclamos y Termómetro de Reputación para E-Commerce',
    description:
        'Te avisa apenas entra un reclamo con el plazo exacto y te dice cuánto te falta para bajar de color en Mercado Libre. Incluye módulo secundario Venta Blindada para WhatsApp y Tiendanube.',
    url: 'https://www.individratec.com',
    logo: 'https://www.individratec.com/logo-individra-icon.png',
    email: 'individratec@gmail.com',
    address: {
        '@type': 'PostalAddress',
        addressLocality: 'Buenos Aires',
        addressCountry: 'AR',
    },
    sameAs: ['https://www.linkedin.com/company/individra'],
    serviceType: [
        'Alertas de Reclamos con Plazo Exacto y Control de Reputación en Mercado Libre',
        'Sincronización de Stock Mercado Libre Tiendanube WhatsApp',
        'Validación de Comprobantes de Transferencia por WhatsApp',
    ],
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="es" className="dark">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body
                suppressHydrationWarning
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
            >
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300] focus:px-4 focus:py-2 focus:bg-[#C84214] focus:text-white focus:rounded-lg focus:font-semibold focus:outline-none"
                >
                    Saltar al contenido principal
                </a>
                <PostHogProvider>
                    <CustomCursor />
                    {children}
                    <CookieConsent />
                    <OffscreenAnimationPauser />
                </PostHogProvider>
            </body>
        </html>
    )
}
