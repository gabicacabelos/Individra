'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'

const PROMO_WHATSAPP_HREF =
    'https://wa.me/5491160152435?text=' +
    encodeURIComponent('¡Hola Individra! Quiero acceder a la oferta de precio especial para los primeros 5 clientes.')

export function PromoOfferBadge() {
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: 15 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: -15 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.5 }}
                className="relative z-30 inline-block select-none"
            >
                {/* Floating motion loop */}
                <motion.div
                    animate={{
                        y: [-6, 6, -6],
                        rotate: [2, -3, 2],
                        scale: [1, 1.03, 1],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 3.8,
                        ease: 'easeInOut',
                    }}
                    className="relative group cursor-pointer"
                >
                    {/* Botón para cerrar */}
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setIsVisible(false)
                        }}
                        aria-label="Cerrar anuncio"
                        className="absolute -top-2 -right-2 z-40 w-7 h-7 rounded-full bg-neutral-900 text-white hover:bg-red-600 border-2 border-white flex items-center justify-center text-xs shadow-2xl transition-all hover:scale-110 active:scale-95"
                    >
                        <X className="w-4 h-4 stroke-[3]" />
                    </button>

                    {/* Enlace al clickear la estrella */}
                    <a
                        href={PROMO_WHATSAPP_HREF}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block focus:outline-none"
                    >
                        {/* Glow de fondo */}
                        <div className="absolute inset-0 bg-red-600/40 rounded-full blur-2xl group-hover:bg-amber-400/50 transition-colors" />

                        {/* Cartel Starburst / Explosión estilo flyer */}
                        <div className="relative w-[230px] sm:w-[260px] h-[220px] sm:h-[250px] flex items-center justify-center drop-shadow-[0_16px_28px_rgba(220,38,38,0.6)] group-hover:drop-shadow-[0_20px_36px_rgba(234,179,8,0.7)] transition-all">
                            {/* SVG de la explosión con doble capa (rojo exterior + amarillo interior sólido) */}
                            <svg
                                viewBox="0 0 280 270"
                                className="absolute inset-0 w-full h-full"
                            >
                                <defs>
                                    <filter id="badge-shadow" x="-10%" y="-10%" width="120%" height="120%">
                                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.5" />
                                    </filter>
                                </defs>

                                {/* Capa 1: Explosión Roja Exterior */}
                                <polygon
                                    points="140,6 168,36 204,18 214,54 252,48 244,88 276,104 258,140 278,170 248,192 258,228 218,226 206,254 172,238 144,258 120,238 88,254 76,226 36,228 46,192 16,170 36,140 18,104 50,88 42,48 80,54 90,18 126,36"
                                    fill="#dc2626"
                                    stroke="#7f1d1d"
                                    strokeWidth="4"
                                    strokeLinejoin="round"
                                    filter="url(#badge-shadow)"
                                />

                                {/* Capa 2: Explosión Amarilla Interior Sólida */}
                                <polygon
                                    points="140,20 164,46 194,30 202,60 234,56 228,88 256,102 240,132 258,156 232,176 240,206 206,204 196,230 168,216 144,234 124,216 96,230 88,204 54,206 62,176 36,156 54,132 38,102 66,88 60,56 92,60 100,30 130,46"
                                    fill="#facc15"
                                    stroke="#b45309"
                                    strokeWidth="3"
                                    strokeLinejoin="round"
                                />
                            </svg>

                            {/* Contenido tipográfico de oferta */}
                            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-1 max-w-[190px] sm:max-w-[210px]">
                                {/* Cinta / Ribbon superior */}
                                <div className="bg-red-600 text-white font-black text-[10px] sm:text-[11px] tracking-wider uppercase px-2.5 py-0.5 rounded-full border-2 border-white shadow-md mb-1 animate-pulse flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                                    <span>¡OFERTA EXCLUSIVA!</span>
                                </div>

                                {/* Texto principal grande estilo cartel */}
                                <div className="font-black leading-none py-1">
                                    <span className="block text-[15px] sm:text-[18px] tracking-tight font-extrabold text-neutral-900 drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
                                        PRECIO
                                    </span>
                                    <span className="block text-[26px] sm:text-[30px] tracking-tighter text-red-600 font-black drop-shadow-[0_2px_0_rgba(255,255,255,1)]">
                                        ESPECIAL
                                    </span>
                                </div>

                                {/* Badge inferior: primeros 5 clientes */}
                                <div className="mt-1 bg-neutral-950 text-yellow-300 font-black text-[10px] sm:text-[11px] uppercase px-2.5 py-1 rounded-md border border-yellow-400 shadow-md flex items-center gap-1">
                                    <span>🔥 Primeros 5 clientes</span>
                                </div>

                                {/* Botón / Link */}
                                <div className="mt-2 bg-red-700 hover:bg-red-800 text-white font-bold text-[9px] sm:text-[10px] px-3 py-1 rounded-full shadow transition-colors flex items-center gap-1">
                                    <span>¡Consultar cupo! →</span>
                                </div>
                            </div>
                        </div>
                    </a>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

