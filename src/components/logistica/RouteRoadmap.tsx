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
                className="hidden lg:block pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:radial-gradient(ellipse_75%_70%_at_50%_50%,black_25%,rgba(0,0,0,0.6)_55%,transparent_85%)] [-webkit-mask-image:radial-gradient(ellipse_75%_70%_at_50%_50%,black_25%,rgba(0,0,0,0.6)_55%,transparent_85%)]"
            >
                <Image
                    src="/logistica-mapa-ai.jpg"
                    alt="Mapa de Telemetría INDIVIDRA"
                    fill
                    sizes="(max-width: 1024px) 100vw, 1200px"
                    className="object-cover opacity-[0.45] filter contrast-110"
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
                            <stop offset="0%" stopColor="#C84214" />
                            <stop offset="100%" stopColor="#B7B3B0" />
                        </linearGradient>
                    </defs>

                    {/* Ruta tenue de fondo: se ve el recorrido completo desde el inicio */}
                    <path d={PATH_D} stroke="rgba(200,66,20,0.15)" strokeWidth="2.5" fill="none" strokeLinecap="round" />

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

            {/* ===== Mobile: figura 3D de marca =====
                Antes habia un render de mapa con pin azul: fondo opaco, paleta
                celeste ajena a la marca y overlays de gradiente para disimular
                los bordes. Se reemplaza por el icono 3D clay naranja, que ya
                viene sin fondo y no necesita difuminado. */}
            <div aria-hidden className="lg:hidden flex justify-center px-2">
                <Image
                    src="/3d/icono-brujula.png"
                    alt=""
                    width={225}
                    height={225}
                    className="h-28 w-auto object-contain drop-shadow-[0_18px_36px_rgba(200,66,20,0.32)]"
                />
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
                className="w-3.5 h-3.5 rounded-full border-2 border-[#C84214] bg-[#0B0D0E] shadow-[0_0_12px_rgba(200,66,20,0.4)]"
            />
            <motion.span
                style={{ opacity }}
                className="whitespace-nowrap rounded-full border border-[#3E3D3A] bg-[#1E1D1C]/90 px-3 py-1.5 text-xs font-medium text-neutral-200 backdrop-blur-sm flex items-center gap-1.5"
            >
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#C84214]/20 text-[10px] font-bold text-[#C84214]">{step}</span>
                {name}
            </motion.span>
        </div>
    )
}
