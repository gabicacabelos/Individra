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
                        y: [-4, 4, -4],
                        rotate: [1.5, -2, 1.5],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 4,
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
                        className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 z-40 w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-neutral-900 text-white hover:bg-red-600 border sm:border-2 border-white flex items-center justify-center text-xs shadow-2xl transition-all hover:scale-110 active:scale-95"
                    >
                        <X className="w-3 h-3 sm:w-4 sm:h-4 stroke-[3]" />
                    </button>

                    {/* Enlace al clickear la estrella */}
                    <a
                        href={PROMO_WHATSAPP_HREF}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block focus:outline-none"
                    >
                        {/* Contenedor con efecto hover sutil (compacto en mobile, completo en desktop) */}
                        <div className="relative w-[170px] sm:w-[265px] h-[160px] sm:h-[255px] flex items-center justify-center drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)] group-hover:drop-shadow-[0_12px_24px_rgba(220,38,38,0.35)] group-hover:-translate-y-1 group-hover:scale-[1.04] transition-all duration-300 ease-out">
                            {/* SVG de la explosión con borde estrellado rojo ancho estilo flyer de oferta */}
                            <svg
                                viewBox="0 0 290 280"
                                className="absolute inset-0 w-full h-full"
                            >
                                <defs>
                                    <filter id="badge-shadow" x="-10%" y="-10%" width="120%" height="120%">
                                        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.4" />
                                    </filter>
                                </defs>

                                {/* Capa 1: Explosión Roja Exterior Grande (borde estrellado prominente) */}
                                <polygon
                                    points="145,2 176,34 216,12 226,52 268,44 256,88 288,106 268,146 290,178 258,202 268,240 226,236 212,268 176,248 145,272 118,248 82,268 68,236 26,240 36,202 4,178 26,146 6,106 40,88 28,44 70,52 80,12 120,34"
                                    fill="#dc2626"
                                    stroke="#7f1d1d"
                                    strokeWidth="4"
                                    strokeLinejoin="round"
                                    filter="url(#badge-shadow)"
                                />

                                {/* Capa 2: Explosión Amarilla Interior (escalada para dejar visible el borde estrellado rojo) */}
                                <polygon
                                    points="145,29 170,54 202,37 210,69 243,62 234,97 259,112 243,144 261,169 235,189 243,219 210,216 199,241 170,225 145,245 123,225 95,241 83,216 50,219 58,189 32,169 50,144 34,112 61,97 51,62 85,69 93,37 125,54"
                                    fill="#facc15"
                                    stroke="#b45309"
                                    strokeWidth="2.5"
                                    strokeLinejoin="round"
                                />
                            </svg>

                            {/* Contenido tipográfico de oferta */}
                            <div className="relative z-10 flex flex-col items-center justify-center text-center px-2 sm:px-4 pt-1 max-w-[125px] sm:max-w-[190px]">
                                {/* Cinta / Ribbon superior */}
                                <div className="bg-red-600 text-white font-black text-[7px] sm:text-[10px] tracking-wider uppercase px-1.5 sm:px-2 py-0.5 rounded-full border border-white shadow mb-0.5 flex items-center gap-0.5 sm:gap-1">
                                    <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-yellow-300 fill-yellow-300" />
                                    <span>¡OFERTA EXCLUSIVA!</span>
                                </div>

                                {/* Texto principal grande estilo cartel */}
                                <div className="font-black leading-none py-0.5">
                                    <span className="block text-[11px] sm:text-[16px] tracking-tight font-extrabold text-neutral-900 drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
                                        PRECIO
                                    </span>
                                    <span className="block text-[18px] sm:text-[28px] tracking-tighter text-red-600 font-black drop-shadow-[0_1.5px_0_rgba(255,255,255,1)]">
                                        ESPECIAL
                                    </span>
                                </div>

                                {/* Badge inferior: primeros 5 clientes */}
                                <div className="mt-0.5 bg-neutral-950 text-yellow-300 font-black text-[7.5px] sm:text-[10px] uppercase px-1.5 sm:px-2 py-0.5 rounded border border-yellow-400 shadow flex items-center gap-0.5 sm:gap-1">
                                    <span>🔥 Primeros 5 clientes</span>
                                </div>

                                {/* Botón / Link con hover interactivo */}
                                <div className="mt-1 sm:mt-1.5 bg-red-700 group-hover:bg-red-600 text-white font-bold text-[7.5px] sm:text-[10px] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow transition-all duration-200 flex items-center gap-1 group-hover:scale-105">
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

