'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'

/**
 * Cierre de /logistica: la ruta se dibuja con el scroll y va encendiendo los
 * módulos, uno por hito. Cierra la narrativa que abre el hero (misma metáfora
 * de ruta) y no inventa copy: los hitos son los 4 módulos que ya están en la
 * página.
 *
 * Sobre el AnimatedRoadmap de referencia, acá se corrigen cuatro cosas:
 * - Sin `mapImageSrc`: la ruta es SVG propio, sin assets nuevos.
 * - Sin `hsl(var(--primary))`: en este proyecto ese token es gris casi negro y
 *   la ruta saldría invisible. Se usa el violeta/cyan de marca.
 * - Los hitos NO se posicionan a mano: son los waypoints por los que pasa el
 *   path, así que están sobre la ruta por construcción y no se despegan al
 *   cambiar el ancho.
 * - Sin `preserveAspectRatio="none"`, que deformaba el trazo.
 */

// Waypoints por los que pasa el path: los marcadores se anclan acá, y el path
// se construye con estos mismos puntos como extremos de cada segmento.
const VB = { w: 900, h: 380 }
const WAYPOINTS = [
    { x: 70, y: 300, name: 'Pre-confirmación de ruta' },
    { x: 320, y: 232, name: 'Agenda de autoservicio' },
    { x: 580, y: 174, name: 'Estado proactivo' },
    { x: 830, y: 78, name: 'Registro de anomalías de entrega' },
]

const PATH_D =
    `M${WAYPOINTS[0].x} ${WAYPOINTS[0].y} ` +
    `C 160 300, 220 246, ${WAYPOINTS[1].x} ${WAYPOINTS[1].y} ` +
    `S 480 190, ${WAYPOINTS[2].x} ${WAYPOINTS[2].y} ` +
    `S 760 120, ${WAYPOINTS[3].x} ${WAYPOINTS[3].y}`

const pct = (v: number, total: number) => `${(v / total) * 100}%`

export function RouteRoadmap() {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.55'] })

    const drawn = useTransform(scrollYProgress, [0.05, 0.75], [0, 1])
    const pathLength = drawn

    // `isolate` crea el contexto de apilamiento: sin él, el fondo con -z-10 se va
    // detrás del bg opaco del <main> y no se ve.
    return (
        <div ref={ref} className="relative w-full isolate">
            {/* Fondo: mapa con ruta. Decorativo, detrás de todo.
                Va con next/image (no background-image de CSS) porque el PNG fuente
                pesa 5.7 MB: así se sirve en WebP/AVIF al tamaño del viewport.
                Bordes difuminados con máscara para que se funda con el fondo. */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:radial-gradient(ellipse_68%_62%_at_50%_50%,black_20%,rgba(0,0,0,0.5)_55%,transparent_88%)] [-webkit-mask-image:radial-gradient(ellipse_68%_62%_at_50%_50%,black_20%,rgba(0,0,0,0.5)_55%,transparent_88%)]"
            >
                <Image
                    src="/logistica-mapa.png"
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 1100px"
                    className="object-cover opacity-[0.28]"
                />
            </div>

            {/* ===== Desktop: la ruta con los hitos encima ===== */}
            <div className="hidden lg:block relative w-full max-w-5xl mx-auto" style={{ aspectRatio: `${VB.w} / ${VB.h}` }}>
                <svg
                    aria-hidden
                    viewBox={`0 0 ${VB.w} ${VB.h}`}
                    className="absolute inset-0 w-full h-full"
                >
                    <defs>
                        <linearGradient id="rr-grad" x1="0" y1="1" x2="1" y2="0">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#22d3ee" />
                        </linearGradient>
                    </defs>

                    {/* Ruta tenue de fondo: se ve el recorrido completo desde el inicio */}
                    <path d={PATH_D} stroke="rgba(139,92,246,0.12)" strokeWidth="2.5" fill="none" strokeLinecap="round" />

                    {/* Ruta que se dibuja con el scroll */}
                    <motion.path
                        d={PATH_D}
                        stroke="url(#rr-grad)"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="3 7"
                        style={{ pathLength }}
                    />
                </svg>

                {/* Hitos: anclados a los waypoints del path */}
                {WAYPOINTS.map((w, i) => (
                    <Milestone
                        key={w.name}
                        name={w.name}
                        index={i}
                        total={WAYPOINTS.length}
                        scrollYProgress={scrollYProgress}
                        style={{ left: pct(w.x, VB.w), top: pct(w.y, VB.h) }}
                    />
                ))}
            </div>

            {/* ===== Mobile: columna única, misma secuencia =====
                Los nombres van en píldoras (mismo lenguaje que los hitos de
                desktop): sobre la imagen de fondo, el texto suelto se perdía. */}
            <div className="lg:hidden max-w-sm mx-auto px-2 py-4">
                {WAYPOINTS.map((w, i) => (
                    <div key={w.name} className="flex gap-3.5">
                        <div className="flex flex-col items-center">
                            <motion.span
                                initial={{ scale: 0, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ delay: i * 0.12, type: 'spring', stiffness: 240, damping: 15 }}
                                className="mt-2.5 shrink-0 w-3.5 h-3.5 rounded-full border-2 border-violet-400 bg-[#0f0f1a] shadow-[0_0_12px_rgba(139,92,246,0.7)]"
                            />
                            {i < WAYPOINTS.length - 1 && (
                                <motion.span
                                    aria-hidden
                                    initial={{ scaleY: 0 }}
                                    whileInView={{ scaleY: 1 }}
                                    viewport={{ once: true, margin: '-40px' }}
                                    transition={{ delay: i * 0.12 + 0.1, duration: 0.4 }}
                                    style={{ transformOrigin: 'top' }}
                                    className="flex-1 w-0.5 my-1.5 rounded-full bg-gradient-to-b from-violet-500/80 to-cyan-400/50"
                                />
                            )}
                        </div>
                        <motion.span
                            initial={{ opacity: 0, x: -8 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ delay: i * 0.12 + 0.05 }}
                            className="mb-6 inline-flex items-center rounded-full border border-violet-500/30 bg-[#16162a]/90 px-4 py-2 text-[13px] font-medium text-neutral-200 backdrop-blur-sm"
                        >
                            {w.name}
                        </motion.span>
                    </div>
                ))}
            </div>
        </div>
    )
}

function Milestone({
    name,
    index,
    total,
    scrollYProgress,
    style,
}: {
    name: string
    index: number
    total: number
    scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
    style: React.CSSProperties
}) {
    // El hito se enciende cuando la ruta dibujada lo alcanza.
    const at = 0.05 + (index / (total - 1)) * 0.7
    const lit = useTransform(scrollYProgress, [at - 0.06, at], [0, 1])
    const litScale = useTransform(lit, [0, 1], [0.6, 1])
    const opacity = lit
    const scale = litScale

    return (
        <div className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2" style={style}>
            <motion.span
                style={{ opacity, scale }}
                className="w-3.5 h-3.5 rounded-full border-2 border-violet-400 bg-[#0f0f1a] shadow-[0_0_12px_rgba(139,92,246,0.6)]"
            />
            <motion.span
                style={{ opacity }}
                className="whitespace-nowrap rounded-full border border-violet-500/25 bg-[#16162a]/90 px-3 py-1.5 text-xs font-medium text-neutral-200 backdrop-blur-sm"
            >
                {name}
            </motion.span>
        </div>
    )
}
