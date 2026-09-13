'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Layers } from 'lucide-react'

interface IntegrationItem {
    name: string
    description: string
    badge: string
    /** Logos oficiales sin fondo (public/logos) */
    logos: { src: string; alt: string }[]
    /** Alto del logo en px. 28 por defecto; 32 para wordmarks que necesitan más cuerpo. */
    logoHeight?: number
}

const integrations: IntegrationItem[] = [
    {
        name: 'WhatsApp Cloud API',
        description: 'Notificaciones oficiales con tilde verde y respuestas 24/7',
        badge: 'Canal Oficial',
        logos: [{ src: '/logos/whatsapp.svg', alt: 'WhatsApp' }],
    },
    {
        name: 'Tango Gestión',
        description: 'Sincronización bidireccional de remitos, hojas de ruta y stock',
        badge: 'ERP Local',
        logos: [{ src: '/logos/tango-gestion.png', alt: 'Tango Gestión' }],
        logoHeight: 32,
    },
    {
        name: 'Tiendanube',
        description: 'Despacho automático y tracking proactivo a compradores',
        badge: 'Plataforma Líder',
        logos: [{ src: '/logos/tiendanube.png', alt: 'Tiendanube' }],
    },
    {
        name: 'MercadoLibre',
        description: 'Lectura de órdenes Flex y mensajes post-venta en tiempo real',
        badge: 'Marketplace',
        logos: [{ src: '/logos/mercadolibre-isotipo.svg', alt: 'MercadoLibre' }],
    },
    {
        name: 'Sistemas Bejerman',
        description: 'Validación de facturación, remitos y estados contables',
        badge: 'ERP Industrial',
        logos: [{ src: '/logos/bejerman.png', alt: 'Sistemas Bejerman' }],
    },
    {
        name: 'WooCommerce',
        description: 'Integración vía webhooks directos y sincronización de envíos',
        badge: 'Open Source',
        logos: [{ src: '/logos/woocommerce-icon.svg', alt: 'WooCommerce' }],
        logoHeight: 32,
    },
    {
        name: 'Microsoft Excel / Sheets',
        description: 'Para flotas que gestionan despachos en planillas compartidas',
        badge: 'Cero Fricción',
        logos: [
            { src: '/logos/excel.svg', alt: 'Microsoft Excel' },
            { src: '/logos/googlesheets.svg', alt: 'Google Sheets' },
        ],
    },
    {
        name: 'Google Maps Platform',
        description: 'Validación de direcciones y cálculo de rutas antes del despacho',
        badge: 'Geolocalización',
        logos: [{ src: '/logos/googlemaps.svg', alt: 'Google Maps Platform' }],
    },
    {
        name: 'Telegram Bot API',
        description: 'Alertas en tiempo real a choferes y canal de soporte secundario',
        badge: 'Mensajería Rápida',
        logos: [{ src: '/logos/telegram.svg', alt: 'Telegram' }],
    },
]

function LogoRow({ item }: { item: IntegrationItem }) {
    const h = item.logoHeight ?? 28
    return (
        <div className="flex items-center gap-2" style={{ height: h }}>
            {item.logos.map((logo) => (
                <Image
                    key={logo.src}
                    src={logo.src}
                    alt={logo.alt}
                    width={h * 2}
                    height={h * 2}
                    unoptimized
                    style={{ height: h }}
                    className="w-auto max-w-[130px] object-contain"
                />
            ))}
        </div>
    )
}

function Card({ item, className = '' }: { item: IntegrationItem; className?: string }) {
    return (
        <div
            className={`group relative flex flex-col justify-between rounded-xl border border-[#3E3D3A]/70 bg-[#16171A] p-4 transition-colors duration-200 hover:border-[#C84214]/50 hover:bg-[#1E1F22] ${className}`}
        >
            <div className="mb-3 flex items-start justify-between gap-2">
                <LogoRow item={item} />
                <span className="shrink-0 rounded border border-[#3E3D3A] bg-[#222120] px-2 py-0.5 font-mono text-[10px] text-neutral-400">
                    {item.badge}
                </span>
            </div>
            <div>
                <div className="text-sm font-bold text-white transition-colors group-hover:text-[#FFA380]">
                    {item.name}
                </div>
                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-neutral-400">
                    {item.description}
                </p>
            </div>
        </div>
    )
}

/** Coverflow 3D: las tarjetas rotan en Y y se hunden en Z según su distancia al centro. */
function CoverflowSlider() {
    const trackRef = useRef<HTMLDivElement>(null)
    const [active, setActive] = useState(0)

    useEffect(() => {
        const track = trackRef.current
        if (!track) return

        let raf = 0
        const paint = () => {
            const cards = Array.from(track.children) as HTMLElement[]
            const center = track.scrollLeft + track.clientWidth / 2
            let nearest = 0
            let nearestDist = Infinity

            for (let i = 0; i < cards.length; i++) {
                const card = cards[i]
                const cardCenter = card.offsetLeft + card.offsetWidth / 2
                // distancia al centro medida en "anchos de tarjeta"
                const d = (cardCenter - center) / card.offsetWidth
                const c = Math.max(-2, Math.min(2, d))
                const abs = Math.abs(c)

                card.style.transform =
                    `rotateY(${c * -24}deg) translateZ(${-abs * 80}px) scale(${1 - abs * 0.08})`
                card.style.opacity = String(Math.max(0.3, 1 - abs * 0.42))
                card.style.zIndex = String(50 - Math.round(abs * 10))

                if (abs < nearestDist) {
                    nearestDist = abs
                    nearest = i
                }
            }
            setActive(nearest)
        }

        const onScroll = () => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(paint)
        }

        paint()
        track.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll)
        return () => {
            cancelAnimationFrame(raf)
            track.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onScroll)
        }
    }, [])

    const goTo = (i: number) => {
        const track = trackRef.current
        if (!track) return
        const card = track.children[i] as HTMLElement | undefined
        if (!card) return
        track.scrollTo({
            left: card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2,
            behavior: 'smooth',
        })
    }

    return (
        <div className="sm:hidden">
            <div
                ref={trackRef}
                className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain px-[16%] py-6"
                style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
            >
                {integrations.map((item) => (
                    <div
                        key={item.name}
                        className="w-[68%] shrink-0 snap-center px-2 will-change-transform"
                        style={{ transformStyle: 'preserve-3d', transition: 'opacity .18s linear' }}
                    >
                        <Card item={item} className="h-[132px] shadow-xl shadow-black/50" />
                    </div>
                ))}
            </div>

            <div className="mt-1 flex items-center justify-center gap-1.5">
                {integrations.map((item, i) => (
                    <button
                        key={item.name}
                        onClick={() => goTo(i)}
                        aria-label={`Ir a ${item.name}`}
                        aria-current={i === active}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                            i === active ? 'w-5 bg-[#C84214]' : 'w-1.5 bg-[#3E3D3A]'
                        }`}
                    />
                ))}
            </div>
        </div>
    )
}

export function IntegrationsBar() {
    return (
        <section className="relative overflow-hidden border-y border-[#3E3D3A]/40 bg-[#0E1012] py-16">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-10 flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div>
                        <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-[#C84214]">
                            <Layers className="h-3.5 w-3.5" />
                            Ecosistema de Integraciones
                        </div>
                        <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                            Funciona con el software que ya usás hoy
                        </h3>
                    </div>
                    <p className="max-w-md text-xs text-neutral-400 sm:text-sm md:text-right">
                        No venimos a reemplazar tus sistemas. INDIVIDRA se enchufa a tus bases de datos, ERPs y canales existentes sin frenar la operación.
                    </p>
                </div>

                {/* Mobile: coverflow 3D · Desktop: grilla */}
                <CoverflowSlider />

                <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
                    {integrations.map((item) => (
                        <Card key={item.name} item={item} />
                    ))}
                </div>
            </div>
        </section>
    )
}
