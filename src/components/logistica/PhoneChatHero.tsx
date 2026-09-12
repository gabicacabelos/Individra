/**
 * Hero de /logistica: la conversación que ES el producto, animada en loop
 * dentro de un teléfono. Ciclo de 14s (keyframes ph-* en globals.css):
 * el cliente pregunta → "escribiendo…" → respuesta con estado real →
 * aviso automático de entrega → fade y repite.
 *
 * CSS puro, solo transform/opacity. El layout de los mensajes está siempre
 * reservado (animan opacidad, no flujo): cero layout shift.
 * Decorativo: aria-hidden. Paleta violeta/azul/cyan de la landing.
 */

function DoubleCheck({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 28 14" className={className} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M2 8 l4 4 8 -9" />
            <path d="M12 8 l4 4 8 -9" />
        </svg>
    )
}

function BotAvatar() {
    return (
        <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#C84214]">
            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="5" y="8" width="14" height="10" rx="3" />
                <circle cx="9.5" cy="13" r="1.1" fill="white" stroke="none" />
                <circle cx="14.5" cy="13" r="1.1" fill="white" stroke="none" />
                <path d="M12 8 V5" />
                <circle cx="12" cy="4" r="1" fill="white" stroke="none" />
            </svg>
        </span>
    )
}

export function PhoneChatHero({ className }: { className?: string }) {
    return (
        <div aria-hidden className={`relative ${className ?? ''}`}>
            {/* Glow ambiente detrás del teléfono */}
            <div className="absolute inset-0 -m-8 bg-[radial-gradient(circle_at_50%_45%,rgba(200,66,20,0.18),transparent_65%)] blur-2xl pointer-events-none" />

            {/* Chips flotantes alrededor */}
            <div
                className="md-anim absolute -left-2 sm:-left-8 top-24 z-20 flex items-center gap-1.5 rounded-full border border-[#C84214]/40 bg-[#1E1D1C]/95 px-3 py-1.5 backdrop-blur-sm shadow-[0_8px_30px_rgba(200,66,20,0.15)]"
                style={{ animationName: 'md-float', animationDuration: '5s' }}
            >
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="#C84214" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3 c4 0 7 3 7 7 c0 5 -7 11 -7 11 c0 0 -7 -6 -7 -11 c0 -4 3 -7 7 -7 z" />
                    <circle cx="12" cy="10" r="2.5" />
                </svg>
                <span className="text-[10px] font-medium text-[#FFE8DF]">En camino</span>
            </div>
            <div
                className="md-anim absolute -right-2 sm:-right-8 bottom-28 z-20 flex items-center gap-1.5 rounded-full border border-[#B7B3B0]/30 bg-[#1E1D1C]/95 px-3 py-1.5 backdrop-blur-sm shadow-[0_8px_30px_rgba(183,179,176,0.15)]"
                style={{ animationName: 'md-float', animationDuration: '6s', animationDelay: '1.2s' }}
            >
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 L9 17 l-5 -5" />
                </svg>
                <span className="text-[10px] font-medium text-emerald-300">Entregado</span>
            </div>

            {/* Marco del teléfono: bisel con degradé + sombra profunda */}
            <div className="relative mx-auto w-[270px] sm:w-[300px] rounded-[44px] bg-gradient-to-b from-white/20 via-[#3E3D3A]/50 to-white/10 p-[2px] shadow-[0_30px_90px_-20px_rgba(200,66,20,0.25)]">
                <div className="rounded-[42px] bg-[#0B0D0E] p-2">
                    <div className="relative rounded-[34px] overflow-hidden bg-[#161514]">
                        {/* Reflejo de pantalla */}
                        <div className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent" />

                        {/* Status bar + cámara */}
                        <div className="relative flex items-center justify-between px-6 pt-2.5 pb-1">
                            <span className="text-[10px] font-semibold text-neutral-300">9:41</span>
                            <span className="absolute left-1/2 -translate-x-1/2 top-2 w-14 h-[18px] rounded-full bg-black" />
                            <span className="flex items-center gap-1">
                                <svg viewBox="0 0 16 12" className="w-3 h-2.5" fill="#d4d4d8"><rect x="0" y="8" width="3" height="4" rx="0.5"/><rect x="4.5" y="5" width="3" height="7" rx="0.5"/><rect x="9" y="2" width="3" height="10" rx="0.5"/></svg>
                                <svg viewBox="0 0 24 12" className="w-5 h-2.5" fill="none"><rect x="0.5" y="0.5" width="19" height="11" rx="3" stroke="#71717a"/><rect x="2" y="2" width="13" height="8" rx="1.5" fill="#d4d4d8"/><rect x="21" y="4" width="2.5" height="4" rx="1" fill="#71717a"/></svg>
                            </span>
                        </div>

                        {/* Header del chat */}
                        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#1E1D1C] border-b border-[#3E3D3A]">
                            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="#a1a1aa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5 l-7 7 7 7"/></svg>
                            <BotAvatar />
                            <div className="min-w-0">
                                <p className="text-[12px] font-semibold text-white leading-tight">Individra</p>
                                <p className="flex items-center gap-1 text-[10px] text-neutral-400 leading-tight">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    en línea
                                </p>
                            </div>
                        </div>

                        {/* Mensajes */}
                        <div className="relative px-3 pt-3 pb-2 space-y-2 bg-[radial-gradient(rgba(200,66,20,0.08)_1px,transparent_1px)] bg-[size:14px_14px]">
                            {/* Chip de fecha */}
                            <div className="flex justify-center pb-1">
                                <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[9px] font-medium text-neutral-400">Hoy</span>
                            </div>

                            {/* Cliente pregunta */}
                            <div className="ph-anim flex justify-start" style={{ animationName: 'ph-msg-a' }}>
                                <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-white/[0.08] border border-white/10 px-3 py-2">
                                    <p className="text-[12px] leading-snug text-neutral-200">Hola, ¿dónde está mi pedido?</p>
                                    <p className="mt-0.5 text-right text-[9px] text-neutral-500">9:41</p>
                                </div>
                            </div>

                            {/* Respuesta del asistente (con typing superpuesto) */}
                            <div className="relative flex justify-end">
                                <div className="ph-anim absolute right-0 top-0 rounded-2xl rounded-br-md bg-[#C84214]/15 border border-[#C84214]/25 px-3.5 py-2.5" style={{ animationName: 'ph-typing' }}>
                                    <span className="flex items-center gap-1">
                                        {[0, 1, 2].map((i) => (
                                             <span
                                                key={i}
                                                className="w-1.5 h-1.5 rounded-full bg-[#B7B3B0]"
                                                style={{ animation: `ph-dot-bounce 1s ease-in-out ${i * 0.18}s infinite` }}
                                            />
                                        ))}
                                    </span>
                                </div>
                                <div className="ph-anim max-w-[85%] rounded-2xl rounded-br-md bg-[#C84214]/20 border border-[#C84214]/35 px-3 py-2" style={{ animationName: 'ph-msg-b' }}>
                                    <p className="text-[12px] leading-snug text-white">Sale hoy en el reparto de zona norte, 9–12hs</p>
                                    <p className="mt-0.5 flex items-center justify-end gap-1 text-[9px] text-[#B7B3B0]/80">
                                        9:41
                                        <DoubleCheck className="w-3.5 h-2 text-[#C84214]" />
                                    </p>
                                </div>
                            </div>

                            {/* Aviso automático de entrega */}
                            <div className="ph-anim flex justify-end" style={{ animationName: 'ph-msg-c' }}>
                                <div className="ph-anim max-w-[85%] rounded-2xl rounded-br-md bg-[#C84214]/20 border border-[#C84214]/35 px-3 py-2">
                                    <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-[#B7B3B0]">
                                        <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 v10 M12 3 l-4 4 M12 3 l4 4"/><path d="M4 15 v4 a2 2 0 0 0 2 2 h12 a2 2 0 0 0 2 -2 v-4"/></svg>
                                        Aviso automático
                                    </p>
                                    <p className="mt-1 text-[12px] leading-snug text-white">Pedido #1042 entregado</p>
                                    <p className="mt-0.5 flex items-center justify-end gap-1 text-[9px] text-[#B7B3B0]/80">
                                        12:04
                                        <DoubleCheck className="w-3.5 h-2 text-[#C84214]" />
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Barra de entrada (decorativa) */}
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-[#1E1D1C] border-t border-[#3E3D3A]">
                            <div className="flex-1 rounded-full bg-white/[0.06] px-3.5 py-2">
                                <p className="text-[11px] text-neutral-500">Escribí un mensaje</p>
                            </div>
                            <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#C84214]">
                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12 h13 M13 6 l6 6 -6 6"/></svg>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
