'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'

/**
 * Cierre de /logistica: la ruta se dibuja con el scroll y va encendiendo los
 * módulos, uno por hito. Cierra la narrativa que abre el hero (misma metáfora
 * de ruta) y no inventa copy: los hitos son los 5 módulos que ya están en la
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
    { x: 70, y: 300, step: 1, name: 'Coordinación previa' },
    { x: 260, y: 246, step: 2, name: 'Ficha del domicilio' },
    { x: 450, y: 195, step: 3, name: 'Aviso por posición' },
    { x: 640, y: 140, step: 4, name: 'Reloj de vencimiento' },
    { x: 830, y: 78, step: 5, name: 'Registro de anomalías de entrega' },
]

// Curva suave por todos los waypoints: el primer tramo fija los controles a
// mano (como antes), los siguientes usan "S" que refleja el control previo,
// así el trazo queda continuo sin volver a calcular cada segmento a mano.
function buildPathD(points: typeof WAYPOINTS): string {
    const [p0, p1, ...rest] = points
    const c1x = p0.x + (p1.x - p0.x) * 0.4
    const c2x = p0.x + (p1.x - p0.x) * 0.75
    let d = `M${p0.x} ${p0.y} C ${c1x} ${p0.y}, ${c2x} ${p1.y}, ${p1.x} ${p1.y}`
    let prev = p1
    for (const cur of rest) {
        const cx = prev.x + (cur.x - prev.x) * 0.6
        d += ` S ${cx} ${cur.y}, ${cur.x} ${cur.y}`
        prev = cur
    }
    return d
}

const PATH_D = buildPathD(WAYPOINTS)

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
                className="hidden lg:block pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:radial-gradient(ellipse_62%_58%_at_50%_50%,black_10%,rgba(0,0,0,0.45)_42%,transparent_74%)] [-webkit-mask-image:radial-gradient(ellipse_62%_58%_at_50%_50%,black_10%,rgba(0,0,0,0.45)_42%,transparent_74%)]"
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
                        step={w.step}
                        index={i}
                        total={WAYPOINTS.length}
                        scrollYProgress={scrollYProgress}
                        style={{ left: pct(w.x, VB.w), top: pct(w.y, VB.h) }}
                    />
                ))}
            </div>

            {/* ===== Mobile: la imagen como figura simple =====
                Sin mask-image, sin backdrop-blur, sin z negativo: esa
                combinacion sobre la imagen corrompia el paint en Android
                (smearing al scrollear). Las pildoras de hitos se quitan
                a pedido: parecian botones. */}
            <div aria-hidden className="lg:hidden mx-auto max-w-sm px-2">
                <div className="relative overflow-hidden rounded-2xl">
                    <Image
                        src="/logistica-mapa.png"
                        alt=""
                        width={2564}
                        height={1632}
                        sizes="100vw"
                        className="w-full h-auto opacity-85"
                    />
                    {/* Difuminado por overlays (sin mask-image: corrompia el paint
                        en Android). Arriba/abajo + ambos costados. */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-transparent to-[#0f0f1a]/70" />
                    <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0f0f1a] to-transparent" />
                    <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0f0f1a] to-transparent" />
                </div>
            </div>

        </div>
    )
}

function Milestone({
    name,
    step,
    index,
    total,
    scrollYProgress,
    style,
}: {
    name: string
    step: number
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
                className="whitespace-nowrap rounded-full border border-violet-500/25 bg-[#16162a]/90 px-3 py-1.5 text-xs font-medium text-neutral-200 backdrop-blur-sm flex items-center gap-1.5"
            >
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-violet-500/25 text-[10px] font-bold text-violet-300">{step}</span>
                {name}
            </motion.span>
        </div>
    )
}
