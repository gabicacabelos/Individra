'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const PROMO_WHATSAPP_HREF =
    'https://wa.me/5491160152435?text=' +
    encodeURIComponent('¡Hola Individra! Quiero acceder a la oferta de precio especial para los primeros 5 clientes.')

export function PromoOfferBadge() {
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 15 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.6 }}
                className="relative z-30 inline-block select-none"
            >
                {/* Floating motion loop */}
                <motion.div
                    animate={{
                        y: [-5, 6, -5],
                        rotate: [-3, 3, -3],
                        scale: [1, 1.03, 1],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 3.6,
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
                        className="absolute -top-1 -right-1 z-40 w-6 h-6 rounded-full bg-black/80 text-white hover:bg-red-600 border border-white/30 flex items-center justify-center text-xs shadow-lg transition-colors"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Enlace al clickear la estrella */}
                    <a
                        href={PROMO_WHATSAPP_HREF}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block focus:outline-none"
                    >
                        {/* Glow de fondo */}
                        <div className="absolute inset-0 bg-red-600/30 rounded-full blur-xl group-hover:bg-yellow-500/40 transition-colors" />

                        {/* Cartel Starburst / Explosión estilo flyer */}
                        <div className="relative w-[210px] sm:w-[240px] h-[180px] sm:h-[200px] flex items-center justify-center drop-shadow-[0_12px_24px_rgba(220,38,38,0.5)] group-hover:drop-shadow-[0_16px_32px_rgba(234,179,8,0.6)] transition-all">
                            {/* SVG de la explosión con doble capa (rojo exterior + amarillo interior) */}
                            <svg
                                viewBox="0 0 260 220"
                                className="absolute inset-0 w-full h-full filter drop-shadow-md"
                            >
                                <defs>
                                    <linearGradient id="starburst-red" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#dc2626" />
                                        <stop offset="50%" stopColor="#ef4444" />
                                        <stop offset="100%" stopColor="#b91c1c" />
                                    </linearGradient>
                                    <linearGradient id="starburst-yellow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#fef08a" />
                                        <stop offset="40%" stopColor="#facc15" />
                                        <stop offset="100%" stopColor="#eab308" />
                                    </linearGradient>
                                </defs>

                                {/* Capa 1: Explosión Roja Exterior con borde oscuro */}
                                <polygon
                                    points="130,4 158,32 190,14 198,48 234,42 228,78 258,92 242,124 260,150 232,170 242,202 206,200 196,224 164,210 138,226 116,210 86,224 76,200 40,202 50,170 22,150 40,124 24,92 54,78 48,42 84,48 92,14 124,32"
                                    fill="url(#starburst-red)"
                                    stroke="#7f1d1d"
                                    strokeWidth="3.5"
                                    strokeLinejoin="round"
                                />

                                {/* Capa 2: Explosión Amarilla Interior */}
                                <polygon
                                    points="130,16 154,40 180,26 186,54 216,50 212,80 238,92 224,118 240,140 216,156 224,184 194,182 186,204 160,192 138,206 120,192 94,204 86,182 56,184 64,156 40,140 56,118 42,92 68,80 64,50 94,54 100,26 126,40"
                                    fill="url(#starburst-yellow)"
                                    stroke="#b45309"
                                    strokeWidth="2"
                                    strokeLinejoin="round"
                                />
                            </svg>

                            {/* Contenido tipográfico de oferta */}
                            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-1">
                                {/* Cinta / Ribbon superior */}
                                <div className="bg-red-700 text-white font-black text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-yellow-200 shadow-sm mb-1 animate-pulse">
                                    ¡OFERTA LANZAMIENTO!
                                </div>

                                {/* Texto principal grande estilo cartel */}
                                <div className="font-black leading-none text-[#b91c1c] drop-shadow-[0_1.5px_1px_rgba(255,255,255,0.9)]">
                                    <span className="block text-[14px] sm:text-[16px] tracking-tight font-extrabold text-neutral-900">
                                        PRECIO
                                    </span>
                                    <span className="block text-[22px] sm:text-[26px] tracking-tighter text-red-600 font-black">
                                        ESPECIAL
                                    </span>
                                </div>

                                {/* Badge inferior: primeros 5 clientes */}
                                <div className="mt-1 bg-black text-yellow-300 font-black text-[9px] sm:text-[10px] uppercase px-2 py-0.5 rounded border border-yellow-400 shadow flex items-center gap-1">
                                    <span>🔥 Primeros 5 clientes</span>
                                </div>

                                <span className="text-[8px] text-neutral-800 font-bold mt-1 underline decoration-red-600">
                                    Consultar cupo →
                                </span>
                            </div>
                        </div>
                    </a>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
