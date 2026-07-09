'use client'

/**
 * Ilustraciones line-art / blueprint on-brand (sin fotos, sin fetch externo).
 * Estilo: trazos finos, nodos, conectores punteados y glows de acento.
 * Todas son decorativas (aria-hidden) y escalables vía className.
 */

type IlloProps = { className?: string }

const strokeProps = {
    fill: 'none',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
}

/* ---------- Logística: camión + paquetes + tracking ---------- */
export function LogisticsIllustration({ className }: IlloProps) {
    return (
        <svg viewBox="0 0 420 260" className={className} aria-hidden role="img" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="logi-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
                <radialGradient id="logi-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(59,130,246,0.35)" />
                    <stop offset="100%" stopColor="rgba(59,130,246,0)" />
                </radialGradient>
            </defs>

            <ellipse cx="230" cy="150" rx="150" ry="90" fill="url(#logi-glow)" />

            {/* Tracking route */}
            <path d="M50 66 C 140 30, 250 40, 356 58" stroke="url(#logi-grad)" strokeWidth="2" strokeDasharray="2 8" {...strokeProps} opacity="0.7" />
            <circle cx="50" cy="66" r="4" fill="#60a5fa" />
            <circle cx="196" cy="40" r="4" fill="#22d3ee" />
            {/* Location pin */}
            <path d="M356 34 c 12 0 20 9 20 20 c 0 14 -20 30 -20 30 c 0 0 -20 -16 -20 -30 c 0 -11 8 -20 20 -20 z" stroke="url(#logi-grad)" strokeWidth="2" {...strokeProps} />
            <circle cx="356" cy="54" r="6" fill="none" stroke="#22d3ee" strokeWidth="2" />

            {/* Ground */}
            <line x1="24" y1="212" x2="396" y2="212" stroke="url(#logi-grad)" strokeWidth="2" strokeDasharray="1 10" {...strokeProps} opacity="0.5" />

            {/* Packages */}
            <rect x="44" y="150" width="52" height="46" rx="5" stroke="#93c5fd" strokeWidth="2" {...strokeProps} />
            <line x1="44" y1="168" x2="96" y2="168" stroke="#93c5fd" strokeWidth="2" {...strokeProps} />
            <line x1="70" y1="150" x2="70" y2="168" stroke="#93c5fd" strokeWidth="2" {...strokeProps} />
            <rect x="58" y="118" width="34" height="32" rx="4" stroke="#93c5fd" strokeWidth="2" {...strokeProps} opacity="0.8" />

            {/* Truck trailer */}
            <rect x="130" y="120" width="150" height="76" rx="8" stroke="url(#logi-grad)" strokeWidth="2.5" {...strokeProps} />
            <line x1="150" y1="120" x2="150" y2="196" stroke="url(#logi-grad)" strokeWidth="2" {...strokeProps} opacity="0.5" />
            {/* Cab */}
            <path d="M280 138 h34 l22 26 v32 h-56 z" stroke="url(#logi-grad)" strokeWidth="2.5" {...strokeProps} />
            <rect x="290" y="146" width="26" height="20" rx="3" stroke="#22d3ee" strokeWidth="2" {...strokeProps} />
            {/* Wheels */}
            <circle cx="176" cy="200" r="16" stroke="url(#logi-grad)" strokeWidth="2.5" {...strokeProps} />
            <circle cx="176" cy="200" r="5" fill="#60a5fa" />
            <circle cx="308" cy="200" r="16" stroke="url(#logi-grad)" strokeWidth="2.5" {...strokeProps} />
            <circle cx="308" cy="200" r="5" fill="#60a5fa" />

            {/* accents */}
            <circle cx="120" cy="60" r="3" fill="#22d3ee" opacity="0.8" />
            <circle cx="300" cy="90" r="2.5" fill="#60a5fa" opacity="0.7" />
        </svg>
    )
}

/* ---------- Automotriz: chasis + cadena de suministro ---------- */
export function AutomotiveIllustration({ className }: IlloProps) {
    return (
        <svg viewBox="0 0 320 240" className={className} aria-hidden role="img" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="auto-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
            </defs>

            {/* Car side profile */}
            <path d="M40 150 q 6 -34 42 -38 q 22 -24 58 -24 q 34 0 52 26 l 40 6 q 26 4 30 30 l 0 4"
                stroke="url(#auto-grad)" strokeWidth="2.5" {...strokeProps} />
            <line x1="40" y1="150" x2="264" y2="150" stroke="url(#auto-grad)" strokeWidth="2.5" {...strokeProps} />
            <path d="M96 88 q 18 -18 44 -18 q 26 0 40 20" stroke="#22d3ee" strokeWidth="2" {...strokeProps} opacity="0.8" />
            <line x1="140" y1="72" x2="140" y2="112" stroke="#60a5fa" strokeWidth="2" {...strokeProps} opacity="0.6" />
            {/* Wheels */}
            <circle cx="92" cy="150" r="20" stroke="url(#auto-grad)" strokeWidth="2.5" {...strokeProps} />
            <circle cx="92" cy="150" r="7" fill="#60a5fa" />
            <circle cx="208" cy="150" r="20" stroke="url(#auto-grad)" strokeWidth="2.5" {...strokeProps} />
            <circle cx="208" cy="150" r="7" fill="#60a5fa" />

            {/* Supply-chain nodes below (dashed connectors) */}
            <line x1="60" y1="205" x2="150" y2="205" stroke="#3b82f6" strokeWidth="2" strokeDasharray="2 7" {...strokeProps} opacity="0.7" />
            <line x1="180" y1="205" x2="270" y2="205" stroke="#3b82f6" strokeWidth="2" strokeDasharray="2 7" {...strokeProps} opacity="0.7" />
            <rect x="44" y="192" width="26" height="26" rx="4" stroke="url(#auto-grad)" strokeWidth="2" {...strokeProps} />
            <circle cx="165" cy="205" r="14" stroke="url(#auto-grad)" strokeWidth="2" {...strokeProps} />
            <circle cx="165" cy="205" r="4" fill="#22d3ee" />
            <rect x="272" y="192" width="26" height="26" rx="4" stroke="url(#auto-grad)" strokeWidth="2" {...strokeProps} />
        </svg>
    )
}

/* ---------- Dolor: operación saturada ---------- */
export function PainIllustration({ className }: IlloProps) {
    return (
        <svg viewBox="0 0 320 240" className={className} aria-hidden role="img" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="pain-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fb7185" />
                    <stop offset="100%" stopColor="#fb923c" />
                </linearGradient>
                <radialGradient id="pain-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(244,63,94,0.30)" />
                    <stop offset="100%" stopColor="rgba(244,63,94,0)" />
                </radialGradient>
            </defs>

            <ellipse cx="160" cy="130" rx="130" ry="90" fill="url(#pain-glow)" />

            {/* Phone */}
            <rect x="118" y="70" width="84" height="150" rx="14" stroke="url(#pain-grad)" strokeWidth="2.5" {...strokeProps} />
            <line x1="150" y1="84" x2="170" y2="84" stroke="url(#pain-grad)" strokeWidth="2.5" {...strokeProps} />
            {/* Overflowing chat bubbles */}
            <path d="M132 120 h40 a6 6 0 0 1 6 6 v14 a6 6 0 0 1 -6 6 h-24 l-10 10 v-10 a6 6 0 0 1 -6 -6 v-14 a6 6 0 0 1 6 -6 z" stroke="#fda4af" strokeWidth="2" {...strokeProps} />
            <path d="M140 160 h36 a6 6 0 0 1 6 6 v12 a6 6 0 0 1 -6 6 h-36 a6 6 0 0 1 -6 -6 v-12 a6 6 0 0 1 6 -6 z" stroke="#fda4af" strokeWidth="2" {...strokeProps} opacity="0.7" />

            {/* Notification waves */}
            <path d="M212 96 q 16 12 0 40" stroke="url(#pain-grad)" strokeWidth="2" {...strokeProps} opacity="0.8" />
            <path d="M226 84 q 26 22 0 64" stroke="url(#pain-grad)" strokeWidth="2" {...strokeProps} opacity="0.55" />
            <path d="M108 96 q -16 12 0 40" stroke="url(#pain-grad)" strokeWidth="2" {...strokeProps} opacity="0.8" />

            {/* Notification badges */}
            <circle cx="200" cy="70" r="13" stroke="url(#pain-grad)" strokeWidth="2" {...strokeProps} fill="rgba(244,63,94,0.12)" />
            <text x="200" y="75" textAnchor="middle" fontSize="13" fill="#fb7185" fontFamily="monospace" fontWeight="bold">9</text>

            {/* Clock */}
            <circle cx="74" cy="76" r="20" stroke="url(#pain-grad)" strokeWidth="2" {...strokeProps} />
            <path d="M74 64 v12 l8 6" stroke="#fb7185" strokeWidth="2" {...strokeProps} />

            {/* scattered papers/dots */}
            <rect x="238" y="150" width="34" height="24" rx="3" stroke="#fda4af" strokeWidth="2" {...strokeProps} opacity="0.7" transform="rotate(12 255 162)" />
            <circle cx="70" cy="150" r="3" fill="#fb923c" opacity="0.8" />
            <circle cx="250" cy="120" r="2.5" fill="#fb7185" opacity="0.7" />
        </svg>
    )
}

/* ---------- Solución: asistente conectado a canales ---------- */
export function SolutionIllustration({ className }: IlloProps) {
    return (
        <svg viewBox="0 0 320 240" className={className} aria-hidden role="img" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="sol-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
                <radialGradient id="sol-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(16,185,129,0.30)" />
                    <stop offset="100%" stopColor="rgba(16,185,129,0)" />
                </radialGradient>
            </defs>

            <ellipse cx="160" cy="120" rx="130" ry="86" fill="url(#sol-glow)" />

            {/* Connectors */}
            <path d="M160 96 V 58" stroke="#34d399" strokeWidth="2" strokeDasharray="2 7" {...strokeProps} opacity="0.7" />
            <path d="M132 132 C 90 140, 74 150, 60 168" stroke="#34d399" strokeWidth="2" strokeDasharray="2 7" {...strokeProps} opacity="0.7" />
            <path d="M188 132 C 230 140, 246 150, 260 168" stroke="#34d399" strokeWidth="2" strokeDasharray="2 7" {...strokeProps} opacity="0.7" />

            {/* Central hub / assistant */}
            <rect x="122" y="96" width="76" height="64" rx="16" stroke="url(#sol-grad)" strokeWidth="2.5" {...strokeProps} />
            <circle cx="144" cy="124" r="5" fill="#34d399" />
            <circle cx="176" cy="124" r="5" fill="#34d399" />
            <path d="M142 142 q 18 12 36 0" stroke="#34d399" strokeWidth="2" {...strokeProps} />
            {/* antenna + spark */}
            <line x1="160" y1="96" x2="160" y2="84" stroke="url(#sol-grad)" strokeWidth="2" {...strokeProps} />
            <circle cx="160" cy="80" r="4" fill="none" stroke="#60a5fa" strokeWidth="2" />

            {/* Channel: WhatsApp bubble (top) */}
            <path d="M144 26 h32 a10 10 0 0 1 10 10 v12 a10 10 0 0 1 -10 10 h-20 l-12 10 v-10 a10 10 0 0 1 -10 -10 v-12 a10 10 0 0 1 10 -10 z" stroke="url(#sol-grad)" strokeWidth="2" {...strokeProps} />

            {/* Channel: monitor (bottom-left) */}
            <rect x="34" y="168" width="52" height="36" rx="4" stroke="url(#sol-grad)" strokeWidth="2" {...strokeProps} />
            <line x1="60" y1="204" x2="60" y2="214" stroke="url(#sol-grad)" strokeWidth="2" {...strokeProps} />
            <line x1="48" y1="214" x2="72" y2="214" stroke="url(#sol-grad)" strokeWidth="2" {...strokeProps} />

            {/* Channel: phone (bottom-right) */}
            <path d="M244 170 c 4 12 12 20 24 24 l 8 -8 12 6 -2 14 c -30 2 -54 -22 -52 -52 l 14 -2 6 12 z" stroke="url(#sol-grad)" strokeWidth="2" {...strokeProps} />

            {/* Check badge */}
            <circle cx="210" cy="86" r="15" stroke="url(#sol-grad)" strokeWidth="2" {...strokeProps} fill="rgba(16,185,129,0.12)" />
            <path d="M203 86 l5 5 9 -10" stroke="#34d399" strokeWidth="2.5" {...strokeProps} />
        </svg>
    )
}
