'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
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
import { ChatStatusDemo, OcrDemo, NotifyDemo, MemoryContextDemo, HandoffDemo } from '@/components/ui/micro-demos'

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
        text: 'Responde el estado de cada pedido en segundos, por WhatsApp o web, consultando tu sistema o tu planilla. Diseñado para resolver en el primer mensaje.',
        Demo: ChatStatusDemo,
    },
    {
        icon: ScanLine,
        text: 'Carga remitos y comprobantes desde una foto o PDF, listos para revisar, sin tipear a mano.',
        Demo: OcrDemo,
    },
    {
        icon: BellRing,
        text: 'Avisa automáticamente cuando un pedido sale, llega o se demora, según las reglas que definas.',
        Demo: NotifyDemo,
    },
    {
        icon: Brain,
        text: 'Recuerda el contexto de cada conversación y responde con la información de tu empresa, no con datos genéricos.',
        Demo: MemoryContextDemo,
    },
    {
        icon: UserCheck,
        text: 'Deriva a una persona con todo el contexto cuando el caso lo requiere.',
        Demo: HandoffDemo,
    },
]

export function PainSolutionSection() {
    const isMobile = useIsMobile()

    return (
        <section id="dolor-solucion" className="relative bg-black overflow-hidden">
            {/* Background accents */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3E3D3A]/25 via-[#1E1D1C]/40 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#C84214]/10 via-transparent to-transparent pointer-events-none" />
            {!isMobile && (
                <>
                    <motion.div
                        aria-hidden
                        className="absolute top-24 -left-24 w-[28rem] h-[28rem] rounded-full blur-[130px] pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(110,108,106,0.22) 0%, rgba(62,61,58,0.12) 50%, transparent 70%)' }}
                        animate={{ x: [0, 50, 0], y: [0, 40, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        aria-hidden
                        className="absolute bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full blur-[130px] pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(200,66,20,0.15) 0%, transparent 70%)' }}
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
                    <span className="text-[#B7B3B0] text-xs sm:text-sm font-mono font-medium uppercase tracking-[0.2em]">
                        El problema
                    </span>
                    <h2 className="mt-4 text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                        Si esto pasa en tu operación,{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C84214] to-[#B7B3B0]">
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
                    <Image
                        src="/3d/icono-manos-caja.png"
                        alt=""
                        aria-hidden
                        width={512}
                        height={349}
                        quality={95}
                        className="w-56 sm:w-64 h-auto object-contain drop-shadow-[0_24px_50px_rgba(200,66,20,0.28)]"
                    />
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
                                className="group relative flex items-start gap-4 p-4 sm:p-5 rounded-2xl border border-[#3E3D3A] bg-[#222120] overflow-hidden transition-colors duration-300 hover:border-[#B7B3B0]/40"
                            >
                                <div className="relative shrink-0 w-11 h-11 rounded-xl bg-[#2E2D2B] border border-[#44423F] flex items-center justify-center group-hover:scale-110 group-hover:border-[#B7B3B0]/50 transition-all duration-300">
                                    <Icon className="w-5 h-5 text-[#B7B3B0] group-hover:text-[#E8E5DE]" />
                                </div>
                                <p className="relative text-neutral-200 text-sm sm:text-base leading-relaxed pt-1.5 pr-8">
                                    {pain.text}
                                </p>
                                <span aria-hidden className="absolute top-2 right-3 text-2xl sm:text-3xl font-black text-white/[0.06] select-none tabular-nums">
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
                    className="w-px h-10 bg-gradient-to-b from-[#6E6C6A]/50 to-[#B7B3B0]/50"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 14 }}
                    className="relative flex items-center justify-center w-9 h-9 rounded-full border border-[#B7B3B0]/30 bg-[#262523] backdrop-blur-sm"
                >
                    <motion.div animate={{ y: [0, 3, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
                        <ArrowDown className="w-4 h-4 text-[#B7B3B0]" />
                    </motion.div>
                </motion.div>
            </div>

            {/* ===== SOLUCIÓN ===== */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 pt-4 pb-24 lg:pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    className="flex flex-col items-center text-center mb-10 lg:mb-14"
                >
                    <Image
                        src="/3d/icono-pulgar.png"
                        alt=""
                        aria-hidden
                        width={429}
                        height={512}
                        quality={95}
                        className="mb-3 h-14 w-auto object-contain drop-shadow-[0_12px_26px_rgba(200,66,20,0.3)] sm:h-16"
                    />
                    <span className="text-[#C84214] text-xs sm:text-sm font-mono font-medium uppercase tracking-[0.2em]">
                        La solución
                    </span>
                    <h2 className="mt-4 text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                        Un asistente que conoce tu operación y{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C84214] to-[#B7B3B0]">
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
                    <Image
                        src="/3d/icono-asistente-movil.png"
                        alt=""
                        aria-hidden
                        width={512}
                        height={471}
                        quality={95}
                        className="w-56 sm:w-64 h-auto object-contain drop-shadow-[0_24px_50px_rgba(200,66,20,0.28)]"
                    />
                </motion.div>

                <div className="grid sm:grid-cols-2 gap-3">
                    {solutions.map((sol, i) => {
                        const Icon = sol.icon
                        const Demo = sol.Demo
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ delay: i * 0.07, type: 'spring', stiffness: 120, damping: 18 }}
                                whileHover={isMobile ? undefined : { y: -4 }}
                                className={`group relative flex flex-col p-4 sm:p-5 rounded-2xl border border-[#3E3D3A] bg-[#262523] overflow-hidden transition-colors duration-300 hover:border-[#B7B3B0]/40 ${
                                    // La última queda sola en su fila: se centra manteniendo el
                                    // ancho de las demás. Si se estira a 2 columnas, su micro-demo
                                    // queda desierta y rompe con el resto.
                                    i === solutions.length - 1
                                        ? 'sm:col-span-2 sm:w-[calc(50%-0.375rem)] sm:mx-auto'
                                        : ''
                                }`}
                            >
                                {/* sheen sweep on hover */}
                                <div aria-hidden className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms] ease-out bg-gradient-to-r from-transparent via-white/[0.07] to-transparent -skew-x-12" />

                                {/* Micro-demo del concepto que describe la tarjeta */}
                                {Demo && (
                                    <div className="relative mb-4">
                                        <Demo />
                                    </div>
                                )}

                                <div className="relative flex items-start gap-4">
                                    <div className="relative shrink-0 w-11 h-11 rounded-xl bg-[#C84214]/15 border border-[#C84214]/25 flex items-center justify-center group-hover:scale-110 group-hover:border-[#C84214]/50 transition-all duration-300">
                                        <span aria-hidden className="absolute inset-0 rounded-xl bg-[#C84214]/0 group-hover:bg-[#C84214]/20 blur-md transition-colors duration-300" />
                                        <Icon className="relative w-5 h-5 text-[#C84214]" />
                                    </div>
                                    <p className="text-neutral-300 text-sm sm:text-base leading-relaxed pt-1.5">
                                        {sol.text}
                                    </p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
