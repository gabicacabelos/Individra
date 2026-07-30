/**
 * Micro-demos para las tarjetas: una mini-visualización del concepto que
 * describe cada tarjeta, en lugar de un ícono suelto.
 *
 * Reglas:
 * - Decorativas: van dentro de un contenedor aria-hidden. No aportan
 *   información que no esté en el texto de la tarjeta.
 * - Animación en CSS puro (keyframes en globals.css), solo transform/opacity.
 * - El estado base de cada elemento es el estado final, así que con
 *   prefers-reduced-motion la demo queda legible y quieta.
 * - Altura fija en el contenedor: reserva el espacio y evita layout shift.
 */

const STAGE = 'relative h-[104px] rounded-xl border border-white/[0.06] bg-[#0d0d1c] overflow-hidden'
const DOTS = 'absolute inset-0 bg-[radial-gradient(rgba(139,92,246,0.10)_1px,transparent_1px)] bg-[size:12px_12px]'

function Stage({ children }: { children: React.ReactNode }) {
    return (
        <div data-microdemo aria-hidden className={STAGE}>
            <div className={DOTS} />
            <div className="relative h-full">{children}</div>
        </div>
    )
}

/* ---- Asistente de estado: consulta y respuesta por WhatsApp ---- */
export function ChatStatusDemo() {
    return (
        <Stage>
            <div className="h-full flex flex-col justify-center gap-1.5 px-3">
                <div
                    className="md-anim self-start max-w-[78%] rounded-lg rounded-bl-sm bg-white/[0.07] border border-white/10 px-2.5 py-1.5"
                    style={{ animationName: 'md-rise' }}
                >
                    <p className="text-[10px] leading-snug text-neutral-300">¿Dónde está mi pedido?</p>
                </div>
                <div
                    className="md-anim self-end max-w-[85%] rounded-lg rounded-br-sm bg-violet-500/20 border border-violet-400/30 px-2.5 py-1.5"
                    style={{ animationName: 'md-rise', animationDelay: '1.1s' }}
                >
                    <p className="text-[10px] leading-snug text-violet-100">
                        Sale hoy en el reparto de zona norte, 9–12hs
                    </p>
                </div>
            </div>
        </Stage>
    )
}

/* ---- Carga de remitos: documento -> campos estructurados ---- */
export function OcrDemo() {
    return (
        <Stage>
            <div className="h-full flex items-center justify-center gap-3 px-3">
                {/* Documento */}
                <svg viewBox="0 0 34 42" className="md-anim w-8 h-10 shrink-0" style={{ animationName: 'md-float', animationDuration: '4s' }}>
                    <path
                        d="M3 3 h18 l10 10 v26 a2 2 0 0 1 -2 2 h-26 a2 2 0 0 1 -2 -2 v-34 a2 2 0 0 1 2 -2 z"
                        fill="rgba(96,165,250,0.08)" stroke="#60a5fa" strokeWidth="2" strokeLinejoin="round"
                    />
                    <path d="M21 3 v10 h10" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinejoin="round" />
                    <g stroke="#93c5fd" strokeWidth="1.6" strokeLinecap="round" opacity="0.7">
                        <line x1="9" y1="22" x2="25" y2="22" />
                        <line x1="9" y1="28" x2="25" y2="28" />
                        <line x1="9" y1="34" x2="19" y2="34" />
                    </g>
                </svg>

                {/* Flecha */}
                <svg viewBox="0 0 24 12" className="w-5 h-3 shrink-0" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="1" y1="6" x2="18" y2="6" strokeDasharray="2 3" />
                    <path d="M15 2 l5 4 -5 4" />
                </svg>

                {/* Campos que se completan */}
                <div className="flex-1 max-w-[120px] space-y-2">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                            <div
                                className="md-anim h-full rounded-full bg-gradient-to-r from-violet-400 to-blue-400 origin-left"
                                style={{ animationName: 'md-fill', animationDelay: `${i * 0.35}s` }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </Stage>
    )
}

/* ---- Avisos automáticos: notificación con check ---- */
export function NotifyDemo() {
    return (
        <Stage>
            <div className="h-full flex items-center justify-center px-3">
                <div
                    className="md-anim flex items-center gap-2.5 rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-3 py-2"
                    style={{ animationName: 'md-pop' }}
                >
                    <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/40">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path
                                className="md-anim"
                                d="M20 6 L9 17 l-5 -5"
                                strokeDasharray="22"
                                style={{ animationName: 'md-draw' }}
                            />
                        </svg>
                    </span>
                    <p className="text-[11px] font-medium text-emerald-100">Pedido entregado</p>
                </div>
            </div>
        </Stage>
    )
}

/* ---- Ficha del domicilio: datos de acceso guardados ---- */
export function HomeAccessDemo() {
    const rows: [string, string][] = [
        ['Portería', 'Sí, 24hs'],
        ['Timbre', 'No funciona'],
        ['Acceso', 'Dejar con vecino'],
    ]
    return (
        <Stage>
            <div className="h-full flex flex-col justify-center gap-1.5 px-4">
                {rows.map(([label, value], i) => (
                    <div
                        key={label}
                        className="md-anim flex items-center justify-between gap-2 rounded-md border border-violet-400/20 bg-violet-500/[0.08] px-2.5 py-1.5"
                        style={{ animationName: 'md-rise', animationDelay: `${i * 0.3}s` }}
                    >
                        <span className="text-[9px] text-neutral-400 shrink-0">{label}</span>
                        <span className="text-[9px] font-medium text-violet-200 text-right">{value}</span>
                    </div>
                ))}
            </div>
        </Stage>
    )
}

/* ---- Aviso por posición: notificación de paradas restantes ---- */
export function PositionAlertDemo() {
    return (
        <Stage>
            <div className="h-full flex flex-col justify-center gap-1.5 px-3">
                <div
                    className="md-anim self-end max-w-[85%] rounded-lg rounded-br-sm bg-violet-500/20 border border-violet-400/30 px-2.5 py-1.5"
                    style={{ animationName: 'md-rise' }}
                >
                    <p className="text-[10px] leading-snug text-violet-100">Tu pedido está a 2 paradas</p>
                </div>
                <div
                    className="md-anim self-end max-w-[85%] rounded-lg rounded-br-sm bg-violet-500/25 border border-violet-400/40 px-2.5 py-1.5"
                    style={{ animationName: 'md-rise', animationDelay: '1.1s' }}
                >
                    <p className="text-[10px] leading-snug text-violet-50 font-medium">Sos la próxima parada</p>
                </div>
            </div>
        </Stage>
    )
}

/* ---- Reloj de vencimiento: cuenta regresiva que degrada a rojo ---- */
export function ExpirationClockDemo() {
    const stages = [
        { label: 'Día 5', color: 'bg-emerald-400' },
        { label: 'Día 2', color: 'bg-amber-400' },
        { label: 'Último día', color: 'bg-rose-400' },
    ]
    return (
        <Stage>
            <div className="h-full flex items-center justify-center gap-1.5 px-3">
                {stages.map((s, i) => (
                    <div key={s.label} className="flex items-center gap-1.5">
                        <span
                            className="md-anim inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] font-medium text-neutral-300"
                            style={{ animationName: 'md-pop', animationDelay: `${i * 0.3}s` }}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${s.color}`} />
                            {s.label}
                        </span>
                        {i < stages.length - 1 && (
                            <svg viewBox="0 0 16 8" className="w-3 h-2 shrink-0" fill="none" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="1" y1="4" x2="12" y2="4" strokeDasharray="2 2" />
                                <path d="M9 1 l3 3 -3 3" />
                            </svg>
                        )}
                    </div>
                ))}
            </div>
        </Stage>
    )
}

/* ---- Memoria de contexto: datos de la empresa alimentando la respuesta ---- */
export function MemoryContextDemo() {
    const chips = ['Pedido #1042', 'Zona norte', 'Cliente frecuente']
    return (
        <Stage>
            <div className="h-full flex flex-col items-center justify-center gap-1.5 px-3">
                {chips.map((c, i) => (
                    <span
                        key={c}
                        className="md-anim inline-flex items-center gap-1.5 rounded-md border border-emerald-400/25 bg-emerald-500/10 px-2 py-1 text-[9px] text-emerald-100"
                        style={{ animationName: 'md-rise', animationDelay: `${i * 0.3}s` }}
                    >
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        {c}
                    </span>
                ))}
            </div>
        </Stage>
    )
}

/* ---- Derivación a persona: el caso pasa del asistente a alguien del equipo ---- */
export function HandoffDemo() {
    return (
        <Stage>
            <div className="h-full flex items-center justify-center gap-2.5 px-3">
                <span className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-white/[0.04]">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="7" width="16" height="12" rx="3" /><circle cx="9" cy="13" r="1.2" fill="#60a5fa" stroke="none" /><circle cx="15" cy="13" r="1.2" fill="#60a5fa" stroke="none" /><path d="M12 7V4" />
                    </svg>
                </span>
                <span
                    className="md-anim rounded-full border border-violet-400/30 bg-violet-500/20 px-2 py-0.5 text-[9px] text-violet-100"
                    style={{ animationName: 'md-rise', animationDelay: '0.4s' }}
                >
                    contexto
                </span>
                <svg viewBox="0 0 24 12" className="w-5 h-3 shrink-0" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="1" y1="6" x2="18" y2="6" strokeDasharray="2 3" /><path d="M15 2 l5 4 -5 4" />
                </svg>
                <span
                    className="md-anim shrink-0 flex items-center justify-center w-9 h-9 rounded-lg border border-emerald-400/30 bg-emerald-500/15"
                    style={{ animationName: 'md-pop', animationDelay: '0.8s' }}
                >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="3.5" /><path d="M5 20 a7 7 0 0 1 14 0" />
                    </svg>
                </span>
            </div>
        </Stage>
    )
}

/* ---- Coordinación previa: aviso de "¿vas a estar?" con Sí/Reprogramar ---- */
export function PriorNoticeDemo() {
    return (
        <Stage>
            <div className="h-full flex flex-col justify-center gap-1.5 px-3">
                <div
                    className="md-anim self-start max-w-[88%] rounded-lg rounded-bl-sm bg-white/[0.07] border border-white/10 px-2.5 py-1.5"
                    style={{ animationName: 'md-rise' }}
                >
                    <p className="text-[10px] leading-snug text-neutral-300">Mañana te llega el pedido #4820. ¿Vas a estar?</p>
                </div>
                <div className="flex items-center gap-1.5 pl-1">
                    <span
                        className="md-anim inline-flex items-center gap-1 rounded-full border border-violet-400/60 bg-violet-500/25 px-2.5 py-1 text-[9px] font-medium text-violet-100"
                        style={{ animationName: 'md-pop', animationDelay: '0.9s' }}
                    >
                        Sí, espero
                    </span>
                    <span
                        className="md-anim inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[9px] font-medium text-neutral-400"
                        style={{ animationName: 'md-pop', animationDelay: '1.1s' }}
                    >
                        Reprogramar
                    </span>
                </div>
            </div>
        </Stage>
    )
}

/* ---- Registro de anomalías: el evento queda asentado ---- */
export function AnomalyLogDemo() {
    const rows = [
        ['14:02', 'Visita fallida'],
        ['14:02', '620 m del domicilio'],
    ]
    return (
        <Stage>
            <div className="h-full flex flex-col justify-center gap-1.5 px-4">
                {rows.map(([time, label], i) => (
                    <div
                        key={label}
                        className="md-anim flex items-center gap-2 rounded-md border border-violet-400/20 bg-violet-500/[0.08] px-2 py-1.5"
                        style={{ animationName: 'md-rise', animationDelay: `${i * 0.35}s` }}
                    >
                        <span className="font-mono text-[9px] text-violet-300/80 shrink-0">{time}</span>
                        <span className="text-[9px] text-neutral-300">{label}</span>
                    </div>
                ))}
            </div>
        </Stage>
    )
}

/* ---- Escudo de reputación: flujo satisfacción → reseña / captura reclamo ---- */
export function ReputationShieldDemo() {
    return (
        <Stage>
            <div className="h-full flex flex-col justify-center gap-1.5 px-3">
                {/* Pregunta de satisfacción */}
                <div
                    className="md-anim self-end max-w-[88%] rounded-lg rounded-br-sm bg-violet-500/20 border border-violet-400/30 px-2.5 py-1.5"
                    style={{ animationName: 'md-rise' }}
                >
                    <p className="text-[10px] leading-snug text-violet-100">¿Cómo fue tu experiencia con la entrega?</p>
                </div>
                {/* Opciones */}
                <div className="flex items-center gap-1.5 pl-1">
                    <span
                        className="md-anim inline-flex items-center gap-1 rounded-full border border-emerald-400/50 bg-emerald-500/20 px-2 py-1 text-[9px] font-medium text-emerald-100"
                        style={{ animationName: 'md-pop', animationDelay: '0.8s' }}
                    >
                        ⭐ Excelente → Google
                    </span>
                    <span
                        className="md-anim inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] font-medium text-neutral-400"
                        style={{ animationName: 'md-pop', animationDelay: '1s' }}
                    >
                        😕 Tengo un reclamo
                    </span>
                </div>
            </div>
        </Stage>
    )
}
