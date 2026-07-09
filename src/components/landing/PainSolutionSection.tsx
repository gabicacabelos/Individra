'use client'

import { motion } from 'framer-motion'
import {
    Phone,
    FileWarning,
    ClipboardList,
    BellOff,
    MoonStar,
    MessageSquare,
    ScanLine,
    BellRing,
    Brain,
    UserCheck,
    ArrowDown,
} from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { PainIllustration, SolutionIllustration } from './illustrations'

const pains = [
    {
        icon: Phone,
        text: 'El teléfono y el WhatsApp de administración explotan con clientes preguntando por sus entregas. La misma pregunta, cien veces por día.',
    },
    {
        icon: FileWarning,
        text: 'Los remitos se cargan a mano, uno por uno, y siempre hay errores de tipeo.',
    },
    {
        icon: ClipboardList,
        text: 'El seguimiento de entregas vive en planillas sueltas y en la cabeza de dos personas.',
    },
    {
        icon: BellOff,
        text: 'Los avisos de "salió tu pedido" o "hay una demora" dependen de que alguien se acuerde de mandarlos.',
    },
    {
        icon: MoonStar,
        text: 'Fuera de horario, nadie contesta. La consulta espera al día siguiente.',
    },
]

const solutions = [
    {
        icon: MessageSquare,
        text: 'Responde el estado de cada pedido en segundos, por WhatsApp, web o teléfono, consultando tu sistema o tu planilla.',
    },
    {
        icon: ScanLine,
        text: 'Carga remitos y comprobantes desde una foto o PDF, listos para revisar, sin tipear a mano.',
    },
    {
        icon: BellRing,
        text: 'Avisa automáticamente cuando un pedido sale, llega o se demora, según las reglas que definas.',
    },
    {
        icon: Brain,
        text: 'Recuerda el contexto de cada conversación y responde con la información de tu empresa, no con datos genéricos.',
    },
    {
        icon: UserCheck,
        text: 'Deriva a una persona con todo el contexto cuando el caso lo requiere.',
    },
]

export function PainSolutionSection() {
    const isMobile = useIsMobile()

    return (
        <section id="dolor-solucion" className="relative bg-black overflow-hidden">
            {/* Background accents */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/15 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-emerald-950/15 via-transparent to-transparent pointer-events-none" />
            {!isMobile && (
                <>
                    <motion.div
                        aria-hidden
                        className="absolute top-24 -left-24 w-[26rem] h-[26rem] rounded-full blur-[120px] pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.10) 0%, transparent 70%)' }}
                        animate={{ x: [0, 50, 0], y: [0, 40, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        aria-hidden
                        className="absolute bottom-24 -right-24 w-[26rem] h-[26rem] rounded-full blur-[120px] pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)' }}
                        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
                        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </>
            )}
            {/* Grid texture */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:56px_56px] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

            {/* ===== DOLOR ===== */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 pt-24 lg:pt-32 pb-4">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    className="text-center mb-10 lg:mb-14"
                >
                    <span className="inline-flex items-center gap-2 text-rose-400 text-xs sm:text-sm font-semibold uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        El problema
                    </span>
                    <h2 className="mt-4 text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                        Si esto pasa en tu operación,{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-orange-400">
                            lo podemos automatizar.
                        </span>
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mb-8 lg:mb-10"
                >
                    <PainIllustration className="w-64 sm:w-72 h-auto" />
                </motion.div>

                <div className="space-y-3">
                    {pains.map((pain, i) => {
                        const Icon = pain.icon
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -24 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ delay: i * 0.07, type: 'spring', stiffness: 120, damping: 18 }}
                                whileHover={isMobile ? undefined : { x: 6 }}
                                className="group relative flex items-start gap-4 p-4 sm:p-5 rounded-2xl border border-rose-500/15 bg-gradient-to-r from-rose-500/[0.06] to-transparent overflow-hidden transition-colors duration-300 hover:border-rose-500/35"
                            >
                                {/* hover glow */}
                                <div aria-hidden className="pointer-events-none absolute -left-10 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-[50px] bg-rose-500/0 group-hover:bg-rose-500/20 transition-colors duration-500" />
                                <div className="relative shrink-0 w-11 h-11 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center group-hover:scale-110 group-hover:border-rose-500/50 transition-all duration-300">
                                    <Icon className="w-5 h-5 text-rose-400" />
                                </div>
                                <p className="relative text-neutral-300 text-sm sm:text-base leading-relaxed pt-1.5 pr-8">
                                    {pain.text}
                                </p>
                                <span aria-hidden className="absolute top-2 right-3 text-2xl sm:text-3xl font-black text-white/[0.04] select-none tabular-nums">
                                    0{i + 1}
                                </span>
                            </motion.div>
                        )
                    })}
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 text-center text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto"
                >
                    Ninguna de estas tareas necesita criterio. Todas consumen horas de gente que
                    <span className="text-white font-medium"> debería estar resolviendo lo que sí importa.</span>
                </motion.p>
            </div>

            {/* ===== CONECTOR ===== */}
            <div className="relative z-10 flex flex-col items-center py-2">
                <motion.div
                    initial={{ scaleY: 0, opacity: 0 }}
                    whileInView={{ scaleY: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{ transformOrigin: 'top' }}
                    className="w-px h-10 bg-gradient-to-b from-rose-500/40 to-emerald-500/40"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 14 }}
                    className="relative flex items-center justify-center w-10 h-10 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm"
                >
                    <span aria-hidden className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                    <motion.div animate={{ y: [0, 3, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
                        <ArrowDown className="w-5 h-5 text-emerald-400" />
                    </motion.div>
                </motion.div>
            </div>

            {/* ===== SOLUCIÓN ===== */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 pt-4 pb-24 lg:pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    className="text-center mb-10 lg:mb-14"
                >
                    <span className="inline-flex items-center gap-2 text-emerald-400 text-xs sm:text-sm font-semibold uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        La solución
                    </span>
                    <h2 className="mt-4 text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                        Un asistente que conoce tu operación y{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400">
                            trabaja 24/7.
                        </span>
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mb-8 lg:mb-10"
                >
                    <SolutionIllustration className="w-64 sm:w-72 h-auto" />
                </motion.div>

                <div className="grid sm:grid-cols-2 gap-3">
                    {solutions.map((sol, i) => {
                        const Icon = sol.icon
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ delay: i * 0.07, type: 'spring', stiffness: 120, damping: 18 }}
                                whileHover={isMobile ? undefined : { y: -4 }}
                                className={`group relative flex items-start gap-4 p-4 sm:p-5 rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] to-transparent overflow-hidden transition-colors duration-300 hover:border-emerald-500/35 ${i === solutions.length - 1 ? 'sm:col-span-2' : ''}`}
                            >
                                {/* sheen sweep on hover */}
                                <div aria-hidden className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms] ease-out bg-gradient-to-r from-transparent via-white/[0.07] to-transparent -skew-x-12" />
                                <div className="relative shrink-0 w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center group-hover:scale-110 group-hover:border-emerald-500/50 transition-all duration-300">
                                    <span aria-hidden className="absolute inset-0 rounded-xl bg-emerald-500/0 group-hover:bg-emerald-500/20 blur-md transition-colors duration-300" />
                                    <Icon className="relative w-5 h-5 text-emerald-400" />
                                </div>
                                <p className="relative text-neutral-300 text-sm sm:text-base leading-relaxed pt-1.5">
                                    {sol.text}
                                </p>
                            </motion.div>
                        )
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="mt-10 flex justify-center"
                >
                    <a
                        href="#diagnostico-ia"
                        className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm sm:text-base font-semibold rounded-full shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 overflow-hidden"
                    >
                        <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" />
                        <span className="relative">Probá el diagnóstico gratis</span>
                    </a>
                </motion.div>
            </div>
        </section>
    )
}
