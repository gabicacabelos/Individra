import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'Individra | Agencia de IA & Desarrollo de Software',
    description:
        'Transformamos tu negocio con Inteligencia Artificial y tecnología a medida. Automatización inteligente, agentes IA y desarrollo fullstack.',
    keywords: [
        'inteligencia artificial',
        'desarrollo de software',
        'automatización',
        'chatbots',
        'agentes IA',
        'desarrollo web',
        'aplicaciones móviles',
    ],
    authors: [{ name: 'Individra' }],
    icons: {
        icon: '/faviconIn.png',
        apple: '/faviconIn.png',
    },
    openGraph: {
        title: 'Individra | Agencia de IA & Desarrollo de Software',
        description:
            'Transformamos tu negocio con Inteligencia Artificial y tecnología a medida.',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="es" className="dark">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
            >
                {children}
            </body>
        </html>
    )
}
