'use client'

import Image from 'next/image'
import { useState, useRef } from 'react'
import { Layers, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface IntegrationItem {
    id: string
    name: string
    category: 'all' | 'erp' | 'channel' | 'ecommerce' | 'maps'
    categoryLabel: string
    description: string
    badge: string
    connectionType: string
    /** Logos oficiales sin fondo (public/logos) */
    logos: { src: string; alt: string }[]
    logoHeight?: number
}

const CATEGORIES = [
    { id: 'all', label: 'Todas las integraciones' },
    { id: 'erp', label: 'ERPs & Planillas' },
    { id: 'ecommerce', label: 'E-Commerce' },
    { id: 'channel', label: 'Canales & Bots' },
    { id: 'maps', label: 'Geolocalización' },
] as const

const integrations: IntegrationItem[] = [
    {
        id: 'whatsapp',
        name: 'WhatsApp Cloud API',
        category: 'channel',
        categoryLabel: 'Canal Oficial',
        description: 'Notificaciones oficiales con tilde verde y respuestas 24/7 sin bloqueos de cuenta.',
        badge: 'Oficial Meta',
        connectionType: 'Webhooks & Cloud API',
        logos: [{ src: '/logos/whatsapp.svg', alt: 'WhatsApp' }],
    },
    {
        id: 'tango',
        name: 'Tango Gestión',
        category: 'erp',
        categoryLabel: 'ERP Local',
        description: 'Sincronización bidireccional de remitos, hojas de ruta y actualización de stock en tiempo real.',
        badge: 'ERP Industrial',
        connectionType: 'Conexión Directa / API',
        logos: [{ src: '/logos/tango-gestion.png', alt: 'Tango Gestión' }],
        logoHeight: 30,
    },
    {
        id: 'tiendanube',
        name: 'Tiendanube',
        category: 'ecommerce',
        categoryLabel: 'E-Commerce',
        description: 'Despacho automático de órdenes y tracking proactivo por WhatsApp directo a los compradores.',
        badge: 'Plataforma Líder',
        connectionType: 'App Partner API',
        logos: [{ src: '/logos/tiendanube.png', alt: 'Tiendanube' }],
    },
    {
        id: 'mercadolibre',
        name: 'MercadoLibre',
        category: 'ecommerce',
        categoryLabel: 'Marketplace',
        description: 'Lectura instantánea de órdenes Flex y mensajes post-venta en tiempo real sin demoras.',
        badge: 'Flex & Envíos',
        connectionType: 'OAuth 2.0 API',
        logos: [{ src: '/logos/mercadolibre-isotipo.svg', alt: 'MercadoLibre' }],
    },
    {
        id: 'bejerman',
        name: 'Sistemas Bejerman',
        category: 'erp',
        categoryLabel: 'ERP Industrial',
        description: 'Validación de facturación, remitos triplicados y asientos contables sin intervención humana.',
        badge: 'ERP Corporativo',
        connectionType: 'Integración Segura',
        logos: [{ src: '/logos/bejerman.png', alt: 'Sistemas Bejerman' }],
    },
    {
        id: 'woocommerce',
        name: 'WooCommerce',
        category: 'ecommerce',
        categoryLabel: 'E-Commerce',
        description: 'Integración vía webhooks nativos para sincronizar despachos y estados de pedidos.',
        badge: 'Open Source',
        connectionType: 'REST API & Webhooks',
        logos: [{ src: '/logos/woocommerce-icon.svg', alt: 'WooCommerce' }],
        logoHeight: 30,
    },
    {
        id: 'spreadsheets',
        name: 'Excel & Google Sheets',
        category: 'erp',
        categoryLabel: 'Planillas',
        description: 'Para flotas que gestionan despachos en planillas compartidas: lectura y escritura automática.',
        badge: 'Cero Fricción',
        connectionType: 'Cloud Sync 24/7',
        logos: [
            { src: '/logos/excel.svg', alt: 'Microsoft Excel' },
            { src: '/logos/googlesheets.svg', alt: 'Google Sheets' },
        ],
    },
    {
        id: 'maps',
        name: 'Google Maps Platform',
        category: 'maps',
        categoryLabel: 'Geolocalización',
        description: 'Validación de direcciones y cálculo de rutas antes del despacho para evitar viajes fallidos.',
        badge: 'Geocodificación',
        connectionType: 'Routes & Places API',
        logos: [{ src: '/logos/googlemaps.svg', alt: 'Google Maps Platform' }],
    },
    {
        id: 'telegram',
        name: 'Telegram Bot API',
        category: 'channel',
        categoryLabel: 'Mensajería Rápida',
        description: 'Alertas en tiempo real a choferes y canal secundario para supervisión de flota en calle.',
        badge: 'Alertas Fleet',
        connectionType: 'Bot API Instantánea',
        logos: [{ src: '/logos/telegram.svg', alt: 'Telegram' }],
    },
]

function LogoRow({ item }: { item: IntegrationItem }) {
    const h = item.logoHeight ?? 26
    return (
        <div className="flex items-center gap-2" style={{ minHeight: 32 }}>
            {item.logos.map((logo) => (
                <Image
                    key={logo.src}
                    src={logo.src}
                    alt={logo.alt}
                    width={h * 2}
                    height={h * 2}
                    unoptimized
                    style={{ height: h, width: 'auto' }}
                    className="max-h-[30px] max-w-[120px] object-contain"
                />
            ))}
        </div>
    )
}

function IntegrationCard({ item }: { item: IntegrationItem }) {
    return (
        <div className="group relative flex flex-col justify-between rounded-xl border border-[#2E3035] bg-[#131518] p-4 sm:p-5 transition-all duration-200 hover:border-[#C84214]/60 hover:bg-[#181A1E]">
            {/* Header: Logo + Badge */}
            <div>
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#26282C]">
                    <LogoRow item={item} />
                    <span className="shrink-0 rounded border border-[#3E3D3A] bg-[#1E2024] px-2 py-0.5 font-mono text-[10px] text-neutral-300 font-medium">
                        {item.badge}
                    </span>
                </div>

                {/* Content */}
                <div className="pt-3">
                    <h4 className="text-sm sm:text-base font-bold text-white transition-colors duration-200 group-hover:text-[#FFA380]">
                        {item.name}
                    </h4>
                    <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-neutral-300">
                        {item.description}
                    </p>
                </div>
            </div>

            {/* Footer / Telemetría de conexión */}
            <div className="mt-4 pt-2.5 flex items-center justify-between border-t border-[#26282C]/60 text-[11px] font-mono text-neutral-400">
                <span className="inline-flex items-center gap-1.5 text-neutral-400 group-hover:text-[#C84214] transition-colors">
                    <CheckCircle2 className="h-3 w-3 text-[#C84214]" />
                    {item.connectionType}
                </span>
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
                    {item.categoryLabel}
                </span>
            </div>
        </div>
    )
}

export function IntegrationsBar() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const mobileTrackRef = useRef<HTMLDivElement>(null)
    const [mobileIndex, setMobileIndex] = useState(0)

    const filtered = selectedCategory === 'all'
        ? integrations
        : integrations.filter((item) => item.category === selectedCategory)

    const handleScrollMobile = () => {
        const track = mobileTrackRef.current
        if (!track) return
        const cardWidth = track.firstElementChild?.clientWidth || 280
        const index = Math.round(track.scrollLeft / cardWidth)
        setMobileIndex(Math.min(filtered.length - 1, Math.max(0, index)))
    }

    const scrollToIndex = (idx: number) => {
        const track = mobileTrackRef.current
        if (!track) return
        const cards = track.children
        if (cards[idx]) {
            (cards[idx] as HTMLElement).scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            })
            setMobileIndex(idx)
        }
    }

    return (
        <section className="relative overflow-hidden border-y border-[#3E3D3A]/40 bg-[#0E1012] py-14 sm:py-18">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                {/* Header */}
                <div className="mb-8 sm:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-5">
                    <div>
                        <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-[#C84214]">
                            <Layers className="h-3.5 w-3.5" />
                            Ecosistema de Integraciones
                        </div>
                        <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl tracking-tight">
                            Funciona con el software que ya usás hoy
                        </h3>
                    </div>
                    <p className="max-w-md text-xs sm:text-sm text-neutral-400 leading-relaxed">
                        No venimos a reemplazar tus sistemas. INDIVIDRA se enchufa a tus bases de datos, ERPs y canales existentes sin frenar la operación diaria.
                    </p>
                </div>

                {/* Filtros por Categoría */}
                <div className="mb-6 sm:mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {CATEGORIES.map((cat) => {
                        const count = cat.id === 'all'
                            ? integrations.length
                            : integrations.filter((i) => i.category === cat.id).length
                        const isSelected = selectedCategory === cat.id
                        return (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setSelectedCategory(cat.id)
                                    setMobileIndex(0)
                                }}
                                className={`shrink-0 rounded-full px-3.5 py-1.5 font-mono text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                                    isSelected
                                        ? 'bg-[#C84214] text-white shadow-md shadow-[#C84214]/25'
                                        : 'bg-[#181A1D] text-neutral-400 border border-[#2E3035] hover:border-[#3E3D3A] hover:text-white'
                                }`}
                            >
                                <span>{cat.label}</span>
                                <span className={`text-[10px] rounded-full px-1.5 py-0.2 ${
                                    isSelected ? 'bg-black/30 text-white' : 'bg-[#222428] text-neutral-500'
                                }`}>
                                    {count}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* Mobile View: Clean horizontal snap deck without 3D rotation issues */}
                <div className="sm:hidden">
                    <div
                        ref={mobileTrackRef}
                        onScroll={handleScrollMobile}
                        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 pt-1 no-scrollbar -mx-4 px-4"
                    >
                        <AnimatePresence mode="popLayout">
                            {filtered.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-[84vw] max-w-[320px] shrink-0 snap-center"
                                >
                                    <IntegrationCard item={item} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Mobile Indicators & Controls */}
                    <div className="mt-3 flex items-center justify-between px-1">
                        <span className="font-mono text-xs text-neutral-500">
                            {mobileIndex + 1} de {filtered.length}
                        </span>
                        <div className="flex items-center gap-1.5">
                            {filtered.map((item, i) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToIndex(i)}
                                    aria-label={`Ir a ${item.name}`}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        i === mobileIndex ? 'w-5 bg-[#C84214]' : 'w-1.5 bg-[#3E3D3A]'
                                    }`}
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => scrollToIndex(Math.max(0, mobileIndex - 1))}
                                disabled={mobileIndex === 0}
                                aria-label="Anterior integración"
                                className="p-1 rounded-md border border-[#2E3035] bg-[#16181B] text-neutral-400 disabled:opacity-30"
                            >
                                <ChevronLeft className="h-3.5 w-3.5" />
                            </button>
                            <button
                                onClick={() => scrollToIndex(Math.min(filtered.length - 1, mobileIndex + 1))}
                                disabled={mobileIndex === filtered.length - 1}
                                aria-label="Siguiente integración"
                                className="p-1 rounded-md border border-[#2E3035] bg-[#16181B] text-neutral-400 disabled:opacity-30"
                            >
                                <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Desktop View: Clean Responsive Grid */}
                <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{ duration: 0.25 }}
                            >
                                <IntegrationCard item={item} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}
