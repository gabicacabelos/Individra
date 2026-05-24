import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { PostHogProvider } from '@/providers/PostHogProvider'
import { CookieConsent } from '@/components/CookieConsent'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'Individra | Automatización con IA y Desarrollo de Software',
    description:
        'Soluciones de inteligencia artificial y automatización para empresas. Chatbots WhatsApp, agentes IA, desarrollo web y apps a medida. Buenos Aires, Argentina.',
    keywords: [
        'automatización con IA',
        'inteligencia artificial para empresas',
        'chatbot whatsapp',
        'desarrollo de software',
        'agentes IA',
        'automatización de procesos',
        'desarrollo web argentina',
        'n8n automatización',
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
            { url: '/faviconIn.png', type: 'image/png' },
        ],
        apple: '/faviconIn.png',
        shortcut: '/favicon.ico',
    },
    openGraph: {
        title: 'Individra | Automatización con IA y Desarrollo de Software',
        description:
            'Soluciones de inteligencia artificial y automatización para empresas. Chatbots, agentes IA y desarrollo a medida.',
        url: 'https://www.individratec.com',
        siteName: 'Individra',
        locale: 'es_AR',
        type: 'website',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Individra - Automatización con IA',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Individra | Automatización con IA',
        description: 'Soluciones de inteligencia artificial y automatización para empresas.',
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
    name: 'Individra',
    description: 'Soluciones de inteligencia artificial y automatización para empresas',
    url: 'https://www.individratec.com',
    logo: 'https://www.individratec.com/soloLogo.png',
    email: 'individratec@gmail.com',
    address: {
        '@type': 'PostalAddress',
        addressLocality: 'Buenos Aires',
        addressCountry: 'AR',
    },
    sameAs: [
        'https://www.linkedin.com/company/individra',
    ],
    serviceType: [
        'Automatización con IA',
        'Desarrollo de Software',
        'Chatbots WhatsApp',
        'Agentes de Inteligencia Artificial',
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
                    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300] focus:px-4 focus:py-2 focus:bg-violet-600 focus:text-white focus:rounded-lg focus:font-semibold focus:outline-none"
                >
                    Saltar al contenido principal
                </a>
                <PostHogProvider>
                    {children}
                    <CookieConsent />
                </PostHogProvider>
            </body>
        </html>
    )
}
