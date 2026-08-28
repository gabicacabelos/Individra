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
                        {/* Sombra mínima y limpia (sin glow invasivo) */}
                        <div className="relative w-[230px] sm:w-[260px] h-[220px] sm:h-[250px] flex items-center justify-center drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] group-hover:drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] transition-all">
                            {/* SVG de la explosión con doble capa (rojo exterior 4px más ancho + amarillo interior sólido) */}
                            <svg
                                viewBox="0 0 290 280"
                                className="absolute inset-0 w-full h-full"
                            >
                                <defs>
                                    <filter id="badge-shadow" x="-10%" y="-10%" width="120%" height="120%">
                                        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.4" />
                                    </filter>
                                </defs>

                                {/* Capa 1: Explosión Roja Exterior (+4px más ancha) */}
                                <polygon
                                    points="145,2 176,34 216,12 226,52 268,44 256,88 288,106 268,146 290,178 258,202 268,240 226,236 212,268 176,248 145,272 118,248 82,268 68,236 26,240 36,202 4,178 26,146 6,106 40,88 28,44 70,52 80,12 120,34"
                                    fill="#dc2626"
                                    stroke="#991b1b"
                                    strokeWidth="8"
                                    strokeLinejoin="round"
                                    filter="url(#badge-shadow)"
                                />

                                {/* Capa 2: Explosión Amarilla Interior */}
                                <polygon
                                    points="145,26 168,52 196,36 204,66 234,62 228,94 254,108 240,138 256,162 232,182 238,210 208,208 198,232 172,218 145,234 126,218 100,232 92,208 62,210 68,182 44,162 60,138 46,108 72,94 66,62 96,66 104,36 132,52"
                                    fill="#facc15"
                                    stroke="#b45309"
                                    strokeWidth="2.5"
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

