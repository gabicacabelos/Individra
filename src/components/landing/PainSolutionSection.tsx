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
} from 'lucide-react'

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
    return (
        <section id="dolor-solucion" className="relative bg-black overflow-hidden">
            {/* Background accents */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/10 via-transparent to-transparent pointer-events-none" />

            {/* ===== DOLOR ===== */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 pt-24 lg:pt-32 pb-12 lg:pb-16">
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

                <div className="space-y-3">
                    {pains.map((pain, i) => {
                        const Icon = pain.icon
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ delay: i * 0.06 }}
                                className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl border border-rose-500/15 bg-gradient-to-r from-rose-500/[0.06] to-transparent"
                            >
                                <div className="shrink-0 w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-rose-400" />
                                </div>
                                <p className="text-neutral-300 text-sm sm:text-base leading-relaxed pt-1.5">
                                    {pain.text}
                                </p>
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

            {/* Divider */}
            <div className="relative z-10 max-w-4xl mx-auto px-6">
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* ===== SOLUCIÓN ===== */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 pt-12 lg:pt-16 pb-24 lg:pb-32">
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

                <div className="grid sm:grid-cols-2 gap-3">
                    {solutions.map((sol, i) => {
                        const Icon = sol.icon
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ delay: i * 0.06 }}
                                className={`flex items-start gap-4 p-4 sm:p-5 rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] to-transparent ${i === solutions.length - 1 ? 'sm:col-span-2' : ''}`}
                            >
                                <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-emerald-400" />
                                </div>
                                <p className="text-neutral-300 text-sm sm:text-base leading-relaxed pt-1.5">
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
                        className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm sm:text-base font-semibold rounded-full shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                    >
                        Probá el diagnóstico gratis
                    </a>
                </motion.div>
            </div>
        </section>
    )
}
