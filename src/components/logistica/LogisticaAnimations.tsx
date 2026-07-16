'use client'

/**
 * Animaciones SVG on-brand para la landing de Logística.
 * Estilo de la casa: line-art / blueprint, trazos finos, nodos, conectores
 * punteados y glows de acento. Paleta violeta/azul/cyan sobre fondo oscuro.
 *
 * Todo es decorativo (aria-hidden). Se respeta prefers-reduced-motion:
 * los loops infinitos se apagan y las escenas quedan en su estado final.
 */

import { motion, useReducedMotion, type Transition } from 'framer-motion'
import { useIsMobile } from '@/hooks/use-mobile'

type Props = { className?: string }

const stroke = {
    fill: 'none',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
}

/* =====================================================================
   1) HERO — Escena de tracking en vivo
   Camión sobre ruta punteada que fluye, pin de destino con pings,
   burbujas de WhatsApp que ciclan, paquetes y nodos de señal.
   ===================================================================== */
export function HeroLogisticsScene({ className }: Props) {
    // Sin gating por reduced-motion: loops decorativos suaves, a pedido del dueño.
    const loop = (t: Transition): Transition => t

    return (
        <svg
            viewBox="0 0 480 360"
            className={className}
            role="img"
            aria-hidden
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="hero-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="55%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
                <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(139,92,246,0.28)" />
                    <stop offset="100%" stopColor="rgba(139,92,246,0)" />
                </radialGradient>
                <radialGradient id="hero-glow-cyan" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(34,211,238,0.22)" />
                    <stop offset="100%" stopColor="rgba(34,211,238,0)" />
                </radialGradient>
            </defs>

            {/* Ambient glows */}
            <ellipse cx="240" cy="210" rx="220" ry="140" fill="url(#hero-glow)" />
            <ellipse cx="400" cy="120" rx="110" ry="90" fill="url(#hero-glow-cyan)" />

            {/* ---- Tracking route (origen -> destino), flujo animado ---- */}
            <path
                d="M60 250 C 150 250, 170 150, 260 140 C 340 132, 360 110, 410 96"
                stroke="url(#hero-grad)"
                strokeWidth="2.5"
                strokeDasharray="1 11"
                opacity="0.85"
                {...stroke}
            >
                <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="-24"
                    dur="1.1s"
                    repeatCount="indefinite"
                />
            </path>

            {/* Origen: depósito / warehouse */}
            <g>
                <path d="M40 250 v-34 l24 -16 l24 16 v34" stroke="url(#hero-grad)" strokeWidth="2.5" {...stroke} />
                <rect x="52" y="228" width="24" height="22" rx="2" stroke="#93c5fd" strokeWidth="2" {...stroke} />
                <line x1="52" y1="238" x2="76" y2="238" stroke="#93c5fd" strokeWidth="2" {...stroke} />
            </g>

            {/* Nodos de señal pulsando a lo largo de la ruta */}
            {[
                { cx: 168, cy: 205, d: 0 },
                { cx: 262, cy: 140, d: 0.6 },
                { cx: 348, cy: 122, d: 1.2 },
            ].map((n, i) => (
                <g key={i}>
                    <motion.circle
                        cx={n.cx}
                        cy={n.cy}
                        r="4"
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth="1.5"
                        initial={{ scale: 0.6, opacity: 0.7 }}
                        animate={{ scale: [0.6, 2.2], opacity: [0.7, 0] }}
                        transition={loop({ duration: 2, repeat: Infinity, ease: 'easeOut', delay: n.d })}
                        style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
                    />
                    <circle cx={n.cx} cy={n.cy} r="2.5" fill="#22d3ee" />
                </g>
            ))}

            {/* Destino: pin con pings */}
            <g>
                <motion.circle
                    cx="410" cy="92" r="10"
                    fill="none" stroke="#a78bfa" strokeWidth="2"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: [1, 2.6], opacity: [0.8, 0] }}
                    transition={loop({ duration: 2.4, repeat: Infinity, ease: 'easeOut' })}
                    style={{ transformOrigin: '410px 92px' }}
                />
                <path
                    d="M410 70 c 12 0 21 9 21 21 c 0 14 -21 33 -21 33 c 0 0 -21 -19 -21 -33 c 0 -12 9 -21 21 -21 z"
                    stroke="url(#hero-grad)" strokeWidth="2.5" {...stroke} fill="rgba(139,92,246,0.10)"
                />
                <circle cx="410" cy="91" r="6.5" fill="none" stroke="#22d3ee" strokeWidth="2" />
            </g>

            {/* ---- Camión (bob sutil + ruedas girando) ---- */}
            <motion.g
                animate={{ y: [0, -3, 0] }}
                transition={loop({ duration: 2.6, repeat: Infinity, ease: 'easeInOut' })}
            >
                {/* Trailer */}
                <rect x="150" y="238" width="120" height="60" rx="7" stroke="url(#hero-grad)" strokeWidth="2.5" {...stroke} fill="rgba(96,165,250,0.05)" />
                <line x1="168" y1="238" x2="168" y2="298" stroke="url(#hero-grad)" strokeWidth="1.5" opacity="0.5" {...stroke} />
                <line x1="150" y1="262" x2="270" y2="262" stroke="url(#hero-grad)" strokeWidth="1.5" opacity="0.35" {...stroke} />
                {/* Cab */}
                <path d="M270 252 h28 l20 22 v24 h-48 z" stroke="url(#hero-grad)" strokeWidth="2.5" {...stroke} fill="rgba(167,139,250,0.06)" />
                <rect x="278" y="258" width="22" height="16" rx="2" stroke="#22d3ee" strokeWidth="2" {...stroke} />
                {/* Faro */}
                <circle cx="316" cy="290" r="2.5" fill="#22d3ee" />
                {/* Ruedas */}
                {[196, 300].map((cx) => (
                    <g key={cx}>
                        <circle cx={cx} cy="300" r="13" stroke="url(#hero-grad)" strokeWidth="2.5" {...stroke} />
                        <motion.g
                            animate={{ rotate: 360 }}
                            transition={loop({ duration: 1.4, repeat: Infinity, ease: 'linear' })}
                            style={{ transformOrigin: `${cx}px 300px` }}
                        >
                            <line x1={cx} y1="290" x2={cx} y2="310" stroke="#60a5fa" strokeWidth="1.5" {...stroke} />
                            <line x1={cx - 10} y1="300" x2={cx + 10} y2="300" stroke="#60a5fa" strokeWidth="1.5" {...stroke} />
                        </motion.g>
                        <circle cx={cx} cy="300" r="3" fill="#a78bfa" />
                    </g>
                ))}
            </motion.g>

            {/* Paquetes cerca del depósito */}
            <g opacity="0.9">
                <rect x="96" y="266" width="30" height="30" rx="3" stroke="#93c5fd" strokeWidth="2" {...stroke} />
                <line x1="96" y1="281" x2="126" y2="281" stroke="#93c5fd" strokeWidth="2" {...stroke} />
                <line x1="111" y1="266" x2="111" y2="281" stroke="#93c5fd" strokeWidth="2" {...stroke} />
                <rect x="104" y="244" width="22" height="22" rx="3" stroke="#93c5fd" strokeWidth="2" opacity="0.7" {...stroke} />
            </g>

            {/* ---- Burbujas de WhatsApp que ciclan ---- */}
            {/* Entrante (pregunta) */}
            <motion.g
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, -6] }}
                transition={loop({ duration: 5, repeat: Infinity, times: [0, 0.12, 0.5, 0.62], ease: 'easeOut' })}
            >
                <path d="M60 44 h150 a12 12 0 0 1 12 12 v24 a12 12 0 0 1 -12 12 h-128 l-16 14 v-14 a12 12 0 0 1 -6 -12 v-24 a12 12 0 0 1 12 -12 z"
                    stroke="#64748b" strokeWidth="2" {...stroke} fill="rgba(148,163,184,0.08)" />
                <line x1="76" y1="62" x2="200" y2="62" stroke="#94a3b8" strokeWidth="2.5" opacity="0.6" {...stroke} />
                <line x1="76" y1="76" x2="168" y2="76" stroke="#94a3b8" strokeWidth="2.5" opacity="0.35" {...stroke} />
            </motion.g>

            {/* Saliente (respuesta con check) */}
            <motion.g
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: [0, 0, 1, 1, 0], y: [8, 8, 0, 0, -6] }}
                transition={loop({ duration: 5, repeat: Infinity, times: [0, 0.5, 0.6, 0.9, 1], ease: 'easeOut' })}
            >
                <path d="M250 96 h150 a12 12 0 0 1 12 12 v24 a12 12 0 0 1 -12 12 h-16 l-16 14 v-14 h-102 a12 12 0 0 1 -12 -12 v-24 a12 12 0 0 1 12 -12 z"
                    stroke="url(#hero-grad)" strokeWidth="2" {...stroke} fill="rgba(139,92,246,0.12)" />
                <line x1="266" y1="114" x2="384" y2="114" stroke="#c4b5fd" strokeWidth="2.5" opacity="0.7" {...stroke} />
                {/* doble check */}
                <path d="M366 130 l5 5 9 -11" stroke="#22d3ee" strokeWidth="2.2" {...stroke} />
                <path d="M374 130 l5 5 9 -11" stroke="#22d3ee" strokeWidth="2.2" {...stroke} />
            </motion.g>
        </svg>
    )
}

/* =====================================================================
   2) DOLOR — Operación saturada
   Teléfono con burbujas desbordando, badge de notificaciones pulsante,
   reloj con manecilla girando. Rojo/naranja (código de dolor de la casa).
   ===================================================================== */
export function SaturatedOpsScene({ className }: Props) {
    const reduce = useReducedMotion()
    const loop = (t: Transition): Transition => (reduce ? { duration: 0 } : t)

    return (
        <svg viewBox="0 0 320 240" className={className} role="img" aria-hidden xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="ops-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fb7185" />
                    <stop offset="100%" stopColor="#fb923c" />
                </linearGradient>
                <radialGradient id="ops-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(244,63,94,0.26)" />
                    <stop offset="100%" stopColor="rgba(244,63,94,0)" />
                </radialGradient>
            </defs>

            <ellipse cx="160" cy="128" rx="140" ry="94" fill="url(#ops-glow)" />

            {/* Teléfono */}
            <rect x="116" y="60" width="88" height="156" rx="14" stroke="url(#ops-grad)" strokeWidth="2.5" {...stroke} fill="rgba(251,113,133,0.04)" />
            <line x1="150" y1="74" x2="170" y2="74" stroke="url(#ops-grad)" strokeWidth="2.5" {...stroke} />

            {/* Burbujas desbordando: aparecen una tras otra (backlog) */}
            {[
                { y: 116, w: 46, o: 1, d: 0 },
                { y: 150, w: 40, o: 0.8, d: 0.5 },
                { y: 184, w: 44, o: 0.55, d: 1 },
            ].map((b, i) => (
                <motion.g
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={reduce ? { opacity: b.o } : { opacity: [0, b.o, b.o, 0], x: [-6, 0, 0, -6] }}
                    transition={loop({ duration: 3, repeat: Infinity, delay: b.d, times: [0, 0.15, 0.85, 1] })}
                >
                    <path
                        d={`M130 ${b.y} h${b.w} a6 6 0 0 1 6 6 v14 a6 6 0 0 1 -6 6 h-${b.w - 14} l-9 9 v-9 a6 6 0 0 1 -6 -6 v-14 a6 6 0 0 1 6 -6 z`}
                        stroke="#fda4af" strokeWidth="2" {...stroke} fill="rgba(251,113,133,0.06)"
                    />
                </motion.g>
            ))}

            {/* Ondas de notificación */}
            {[0, 1, 2].map((i) => (
                <motion.path
                    key={i}
                    d={`M210 ${96 + i * 6} q ${14 + i * 8} ${16 + i * 8} 0 ${44 + i * 12}`}
                    stroke="url(#ops-grad)" strokeWidth="2" opacity={0.7 - i * 0.18} {...stroke}
                    animate={reduce ? undefined : { opacity: [0.2, 0.7 - i * 0.18, 0.2] }}
                    transition={loop({ duration: 2, repeat: Infinity, delay: i * 0.25, ease: 'easeInOut' })}
                />
            ))}

            {/* Badge de notificaciones pulsante */}
            <motion.g
                animate={reduce ? undefined : { scale: [1, 1.12, 1] }}
                transition={loop({ duration: 1.6, repeat: Infinity, ease: 'easeInOut' })}
                style={{ transformOrigin: '200px 66px' }}
            >
                <circle cx="200" cy="66" r="14" stroke="url(#ops-grad)" strokeWidth="2" {...stroke} fill="rgba(244,63,94,0.16)" />
                <text x="200" y="71" textAnchor="middle" fontSize="13" fill="#fb7185" fontFamily="ui-monospace, monospace" fontWeight="bold">+9</text>
            </motion.g>

            {/* Reloj con manecilla girando (tiempo perdido) */}
            <g>
                <circle cx="74" cy="80" r="22" stroke="url(#ops-grad)" strokeWidth="2" {...stroke} />
                <line x1="74" y1="80" x2="74" y2="66" stroke="#fb7185" strokeWidth="2" {...stroke} />
                <motion.line
                    x1="74" y1="80" x2="74" y2="70"
                    stroke="#fb923c" strokeWidth="2.5" {...stroke}
                    animate={reduce ? undefined : { rotate: 360 }}
                    transition={loop({ duration: 4, repeat: Infinity, ease: 'linear' })}
                    style={{ transformOrigin: '74px 80px' }}
                />
                <circle cx="74" cy="80" r="2.5" fill="#fb923c" />
            </g>

            {/* Papeles sueltos */}
            <rect x="238" y="152" width="36" height="26" rx="3" stroke="#fda4af" strokeWidth="2" opacity="0.7" transform="rotate(12 256 165)" {...stroke} />
        </svg>
    )
}

/* =====================================================================
   3) ÍCONOS DE MÓDULO — line-art con draw-in al entrar en viewport
   ===================================================================== */

const drawIn = {
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, margin: '-40px' },
}

function IconWrap({ children, gradId }: { children: React.ReactNode; gradId: string }) {
    return (
        <svg viewBox="0 0 72 72" className="w-full h-full" role="img" aria-hidden xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
            </defs>
            {children}
        </svg>
    )
}

/* Pre-confirmación de ruta: pin de ruta + check confirmado */
export function RouteConfirmIcon() {
    const reduce = useReducedMotion()
    return (
        <IconWrap gradId="mod-route">
            <motion.path
                d="M12 50 C 26 50, 26 26, 40 26 C 50 26, 54 34, 60 34"
                stroke="url(#mod-route)" strokeWidth="2.5" strokeDasharray="2 6" {...stroke}
                {...drawIn} transition={{ duration: 1 }}
            />
            <circle cx="12" cy="50" r="3.5" fill="#a78bfa" />
            <motion.g
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 220, damping: 14 }}
                style={{ transformOrigin: '54px 24px' }}
            >
                <circle cx="54" cy="24" r="12" stroke="url(#mod-route)" strokeWidth="2.5" {...stroke} fill="rgba(34,211,238,0.10)" />
                <path d="M48 24 l4 4 8 -9" stroke="#22d3ee" strokeWidth="2.5" {...stroke} />
            </motion.g>
            {!reduce && (
                <motion.circle
                    cx="12" cy="50" r="3.5" fill="none" stroke="#a78bfa" strokeWidth="1.5"
                    animate={{ scale: [1, 2.4], opacity: [0.7, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                    style={{ transformOrigin: '12px 50px' }}
                />
            )}
        </IconWrap>
    )
}

/* Agenda de autoservicio: calendario con slot que se llena */
export function SelfSchedulingIcon() {
    return (
        <IconWrap gradId="mod-cal">
            <motion.rect
                x="14" y="18" width="44" height="40" rx="5"
                stroke="url(#mod-cal)" strokeWidth="2.5" {...stroke}
                {...drawIn} transition={{ duration: 0.9 }}
            />
            <line x1="14" y1="30" x2="58" y2="30" stroke="url(#mod-cal)" strokeWidth="2" {...stroke} />
            <line x1="24" y1="14" x2="24" y2="22" stroke="#a78bfa" strokeWidth="2.5" {...stroke} />
            <line x1="48" y1="14" x2="48" y2="22" stroke="#a78bfa" strokeWidth="2.5" {...stroke} />
            {/* slots */}
            {[
                [22, 38], [33, 38], [44, 38],
                [22, 48], [33, 48], [44, 48],
            ].map(([x, y], i) => (
                <rect key={i} x={x} y={y} width="6" height="6" rx="1.5" fill="#60a5fa" opacity="0.35" />
            ))}
            {/* slot elegido */}
            <motion.rect
                x="33" y="48" width="6" height="6" rx="1.5"
                fill="#22d3ee"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, type: 'spring', stiffness: 260, damping: 15 }}
                style={{ transformOrigin: '36px 51px' }}
            />
            <motion.circle
                cx="36" cy="51" r="9" fill="none" stroke="#22d3ee" strokeWidth="2"
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 13 }}
                style={{ transformOrigin: '36px 51px' }}
            />
        </IconWrap>
    )
}

/* Estado proactivo: paquete avanzando por etapas del pipeline */
export function ProactiveStatusIcon() {
    const reduce = useReducedMotion()
    return (
        <IconWrap gradId="mod-pipe">
            <line x1="10" y1="40" x2="62" y2="40" stroke="url(#mod-pipe)" strokeWidth="2.5" strokeDasharray="2 5" {...stroke} />
            {[16, 36, 56].map((cx, i) => (
                <circle key={i} cx={cx} cy="40" r="4.5" fill="none" stroke="url(#mod-pipe)" strokeWidth="2" />
            ))}
            <circle cx="16" cy="40" r="2" fill="#a78bfa" />
            {/* paquete que viaja por las etapas */}
            <motion.g
                initial={{ x: 0 }}
                animate={reduce ? { x: 40 } : { x: [0, 20, 40, 40] }}
                transition={reduce ? { duration: 0 } : { duration: 3.4, repeat: Infinity, times: [0, 0.4, 0.8, 1], ease: 'easeInOut' }}
            >
                <rect x="9" y="20" width="16" height="15" rx="2.5" stroke="#22d3ee" strokeWidth="2.5" {...stroke} fill="rgba(34,211,238,0.12)" />
                <line x1="9" y1="27.5" x2="25" y2="27.5" stroke="#22d3ee" strokeWidth="1.8" {...stroke} />
                <line x1="17" y1="20" x2="17" y2="27.5" stroke="#22d3ee" strokeWidth="1.8" {...stroke} />
            </motion.g>
        </IconWrap>
    )
}

/* Registro de anomalías: mapa/pin con alerta y timestamp */
export function AnomalyLogIcon() {
    const reduce = useReducedMotion()
    return (
        <IconWrap gradId="mod-alert">
            <motion.path
                d="M30 14 c 10 0 18 8 18 18 c 0 12 -18 26 -18 26 c 0 0 -18 -14 -18 -26 c 0 -10 8 -18 18 -18 z"
                stroke="url(#mod-alert)" strokeWidth="2.5" {...stroke} fill="rgba(139,92,246,0.08)"
                {...drawIn} transition={{ duration: 1 }}
            />
            {/* signo de alerta */}
            <line x1="30" y1="26" x2="30" y2="36" stroke="#22d3ee" strokeWidth="2.5" {...stroke} />
            <circle cx="30" cy="42" r="1.6" fill="#22d3ee" />
            {/* badge de registro con parpadeo */}
            <motion.g
                animate={reduce ? undefined : { opacity: [0.4, 1, 0.4] }}
                transition={reduce ? undefined : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
                <circle cx="52" cy="50" r="11" stroke="url(#mod-alert)" strokeWidth="2.5" {...stroke} fill="rgba(34,211,238,0.10)" />
                <path d="M52 44 v6 l4 3" stroke="#22d3ee" strokeWidth="2.2" {...stroke} />
            </motion.g>
        </IconWrap>
    )
}

/* =====================================================================
   4) FONDO — Orbs blur ambientales + divisor de ruta animado
   ===================================================================== */
export function AmbientOrbs({ className }: Props) {
    const reduce = useReducedMotion()
    const isMobile = useIsMobile()
    // Dos blurs de 130px animados son de lo más caro que hay para la GPU mobile.
    if (reduce || isMobile) return null
    return (
        <div className={className} aria-hidden>
            <motion.div
                className="absolute top-10 -left-24 w-[28rem] h-[28rem] rounded-full blur-[130px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)' }}
                animate={{ x: [0, 50, 0], y: [0, 40, 0] }}
                transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute bottom-10 -right-24 w-[28rem] h-[28rem] rounded-full blur-[130px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)' }}
                animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
                transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
            />
        </div>
    )
}

/* Divisor: línea de ruta con paquete/vehículo que la recorre */
export function RouteDivider({ className }: Props) {
    const reduce = useReducedMotion()
    return (
        <svg viewBox="0 0 1200 40" className={className} preserveAspectRatio="none" role="img" aria-hidden xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="div-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(139,92,246,0)" />
                    <stop offset="50%" stopColor="rgba(96,165,250,0.6)" />
                    <stop offset="100%" stopColor="rgba(34,211,238,0)" />
                </linearGradient>
            </defs>
            <line x1="0" y1="20" x2="1200" y2="20" stroke="url(#div-grad)" strokeWidth="2" strokeDasharray="2 10" {...stroke}>
                {!reduce && <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1.2s" repeatCount="indefinite" />}
            </line>
            {!reduce && (
                <motion.circle
                    cy="20" r="4" fill="#22d3ee"
                    animate={{ cx: [-20, 1220] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                />
            )}
        </svg>
    )
}

/* =====================================================================
   5) CIERRE — Sello de entrega que se ensambla al llegar al final
   La ruta se dibuja, el pin aterriza y el check se sella. Se dispara una
   sola vez al entrar en viewport (whileInView), no en loop: es un remate,
   no un adorno permanente.
   ===================================================================== */
export function DeliveredSealScene({ className }: Props) {
    const reduce = useReducedMotion()

    // Con reduced motion se muestra el estado final, sin trazado ni rebote.
    const draw = reduce
        ? { initial: { pathLength: 1, opacity: 1 }, whileInView: { pathLength: 1, opacity: 1 } }
        : { initial: { pathLength: 0, opacity: 0 }, whileInView: { pathLength: 1, opacity: 1 } }

    const pop = reduce
        ? { initial: { scale: 1, opacity: 1 }, whileInView: { scale: 1, opacity: 1 } }
        : { initial: { scale: 0, opacity: 0 }, whileInView: { scale: 1, opacity: 1 } }

    return (
        <svg viewBox="0 0 240 120" className={className} role="img" aria-hidden xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="seal-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
            </defs>

            {/* Ruta que se dibuja de origen a destino */}
            <motion.path
                d="M18 92 C 60 92, 70 60, 104 56 C 132 52, 140 46, 168 42"
                stroke="url(#seal-grad)" strokeWidth="2.5" strokeDasharray="2 7" {...stroke}
                {...draw}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: reduce ? 0 : 1.1, ease: 'easeInOut' }}
            />
            <circle cx="18" cy="92" r="4" fill="#a78bfa" />

            {/* Pin de destino que aterriza */}
            <motion.g
                {...pop}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: reduce ? 0 : 0.9, type: 'spring', stiffness: 200, damping: 14 }}
                style={{ transformOrigin: '186px 40px' }}
            >
                <path
                    d="M186 22 c 10 0 17 7 17 17 c 0 11 -17 27 -17 27 c 0 0 -17 -16 -17 -27 c 0 -10 7 -17 17 -17 z"
                    stroke="url(#seal-grad)" strokeWidth="2.5" {...stroke} fill="rgba(139,92,246,0.12)"
                />
                <circle cx="186" cy="39" r="5.5" fill="none" stroke="#22d3ee" strokeWidth="2" />
            </motion.g>

            {/* Sello: check que remata la secuencia */}
            <motion.g
                {...pop}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: reduce ? 0 : 1.35, type: 'spring', stiffness: 240, damping: 13 }}
                style={{ transformOrigin: '120px 86px' }}
            >
                <circle cx="120" cy="86" r="20" stroke="#34d399" strokeWidth="2.5" {...stroke} fill="rgba(16,185,129,0.12)" />
                <path d="M111 86 l6 6 12 -13" stroke="#34d399" strokeWidth="3" {...stroke} />
            </motion.g>

            {/* Onda de confirmación, una sola vez */}
            {!reduce && (
                <motion.circle
                    cx="120" cy="86" r="20" fill="none" stroke="#34d399" strokeWidth="2"
                    initial={{ scale: 1, opacity: 0.7 }}
                    whileInView={{ scale: 2.2, opacity: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: 1.5, duration: 1.1, ease: 'easeOut' }}
                    style={{ transformOrigin: '120px 86px' }}
                />
            )}
        </svg>
    )
}
