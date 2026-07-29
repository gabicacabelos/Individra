'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Quote } from 'lucide-react'
import {
    SaturatedOpsScene,
    AmbientOrbs,
    RouteDivider,
    RouteConfirmIcon,
    SelfSchedulingIcon,
    ProactiveStatusIcon,
    AnomalyLogIcon,
} from './LogisticaAnimations'
import { RouteRoadmap } from './RouteRoadmap'
import { PhoneChatHero } from './PhoneChatHero'
import { RouteConfirmDemo, SchedulingDemo, ProactiveStatusDemo, AnomalyLogDemo } from '@/components/ui/micro-demos'

const WHATSAPP_HREF =
    'https://wa.me/5491160152435?text=' +
    encodeURIComponent('Hola Individra, quiero coordinar el diagnostico gratuito de 30 minutos para logistica.')

const H1_TEXT = 'Tu administración se pasa el día contestando "¿dónde está mi pedido?".'

const pains = [
    'El teléfono y el WhatsApp de administración explotan con clientes preguntando por sus entregas. La misma pregunta, cien veces por día.',
    'Los remitos se cargan a mano, uno por uno, y siempre hay errores de tipeo.',
    'El seguimiento de entregas vive en planillas sueltas y en la cabeza de dos personas.',
    'Los avisos de "salió tu pedido" o "hay una demora" dependen de que alguien se acuerde de mandarlos.',
    'Fuera de horario, nadie contesta. La consulta espera al día siguiente o se va con otro.',
]

const PAIN_CLOSE =
    'Ninguna de estas tareas necesita criterio. Todas consumen horas de gente que debería estar resolviendo lo que sí importa.'

const modules = [
    {
        step: 1,
        context: 'Al coordinar la entrega',
        quote: 'Me imponen el día y el horario que ellos pueden. Nunca preguntan cuándo puedo yo.',
        name: 'Agenda de autoservicio',
        desc: 'El cliente elige su ventana de entrega entre las disponibles, desde un link, sin llamar a nadie. Su elección entra directo a tu planificación, dentro de las reglas de zona y capacidad que definas.',
        Icon: SelfSchedulingIcon,
        descShort: 'El cliente elige su ventana de entrega desde un link, sin llamar a nadie. Su elección entra directo a tu planificación.',
        Demo: SchedulingDemo,
    },
    {
        step: 2,
        context: 'El día del reparto',
        quote: 'Me tuvieron esperando de 8 a 20 y al final no vinieron. Perdí el día entero.',
        name: 'Pre-confirmación de ruta',
        desc: 'Antes de que el camión salga, cada destinatario del día recibe un WhatsApp para confirmar si va a estar, reprogramar o autorizar la entrega a un tercero. El que no está, sale de la hoja de ruta antes de cargar el paquete. Menos viajes perdidos, menos combustible quemado, menos reseñas de una estrella.',
        Icon: RouteConfirmIcon,
        descShort: 'Antes de que salga el camión, cada destinatario confirma por WhatsApp si va a estar, reprograma o autoriza a un tercero. El que no está, sale de la hoja de ruta.',
        Demo: RouteConfirmDemo,
    },
    {
        step: 3,
        context: 'Durante la entrega',
        quote: 'Pagué el anticipo hace 90 días. Llamo una vez por semana y nadie me responde.',
        name: 'Estado proactivo',
        desc: 'Tu cliente recibe cada semana, solo y sin pedirlo, en qué etapa está su pedido. Un cliente informado no llama, no reclama y no escribe la reseña que después hay que remar.',
        Icon: ProactiveStatusIcon,
        descShort: 'Tu cliente recibe cada semana, sin pedirlo, en qué etapa está su pedido. Un cliente informado no llama ni reclama.',
        Demo: ProactiveStatusDemo,
    },
    {
        step: 4,
        context: 'Después de la entrega',
        quote: 'Dijeron que pasaron y que no había nadie. Es mentira, estuve en casa todo el día.',
        name: 'Registro de anomalías de entrega',
        desc: 'Cuando una visita se marca como fallida lejos del domicilio, el evento queda registrado con fecha, hora y ubicación. A fin de mes tenés un reporte de qué pasó de verdad en tu operación, sin acusar a nadie en el momento.',
        Icon: AnomalyLogIcon,
        descShort: 'Cuando una visita se marca como fallida lejos del domicilio, queda registrada con fecha, hora y ubicación. A fin de mes tenés el reporte.',
        Demo: AnomalyLogDemo,
    },
]

const reveal = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
}

export function LogisticaLanding() {
    return (
        <main className="min-h-screen bg-[#0f0f1a] text-white antialiased">
            {/* ===== Top bar ===== */}
            <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-6 py-2 sm:py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link href="/" className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors" aria-label="Volver al inicio">
                            <ArrowRight className="w-4 h-4 text-neutral-300 rotate-180" />
                        </Link>
                        <Link href="/" className="flex items-center" aria-label="Volver al inicio">
                            <Image src="/logo-individra.png" alt="INDIVIDRA" width={280} height={100} className="h-12 sm:h-16 lg:h-20 w-auto" priority />
                        </Link>
                    </div>
                    <a
                        href={WHATSAPP_HREF}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 text-white text-xs sm:text-sm font-medium hover:brightness-110 active:scale-[0.98] transition-all duration-200 whitespace-nowrap"
                    >
                        Diagnóstico gratuito
                    </a>
                </div>
            </header>

            {/* ===== 1) HERO ===== */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/25 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.04)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />

                <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
                    <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-8 items-center">
                        <div>
                            <motion.p {...reveal} className="text-violet-400 text-sm font-medium uppercase tracking-widest">
                                Logística y distribución
                            </motion.p>

                            <motion.h1
                                {...reveal}
                                transition={{ delay: 0.05 }}
                                className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white"
                            >
                                {H1_TEXT}
                            </motion.h1>

                            <motion.p
                                {...reveal}
                                transition={{ delay: 0.1 }}
                                className="mt-6 text-neutral-400 text-lg leading-relaxed max-w-2xl"
                            >
                                Montamos un asistente por WhatsApp, web y teléfono que responde el estado de cada entrega con datos
                                reales, coordina las visitas antes de que salga el camión y avisa solo cuando algo se demora.{' '}
                                <span className="text-neutral-200">Sin cambiar tu sistema actual.</span>
                            </motion.p>

                            <motion.div {...reveal} transition={{ delay: 0.15 }} className="mt-9">
                                <a
                                    href={WHATSAPP_HREF}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 text-white font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                                >
                                    Pedí un diagnóstico gratuito de 30 minutos
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                                </a>
                                <p className="mt-3 text-neutral-500 text-sm">
                                    Sin permanencia. Mes a mes. Infraestructura propia y aislada (GDPR).
                                </p>
                            </motion.div>
                        </div>

                        {/* El producto es la conversacion: telefono con el chat en loop */}
                        <motion.div
                            initial={{ opacity: 0, y: 24, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                            className="relative py-4"
                        >
                            <PhoneChatHero />
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* ===== 2) DOLOR ===== */}
            <section className="relative border-y border-white/5 overflow-hidden">
                <AmbientOrbs className="absolute inset-0 pointer-events-none opacity-60" />
                <div className="relative max-w-4xl mx-auto px-6 py-20 sm:py-24">
                    <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center">
                        <motion.h2 {...reveal} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                            Si esto pasa en tu operación, se puede automatizar.
                        </motion.h2>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.6 }}
                            className="hidden lg:block shrink-0"
                        >
                            <SaturatedOpsScene className="w-56 h-auto" />
                        </motion.div>
                    </div>

                    <div className="mt-10 grid sm:grid-cols-2 gap-4">
                        {pains.map((pain, i) => (
                            <motion.div
                                key={i}
                                {...reveal}
                                transition={{ delay: i * 0.06 }}
                                className={`flex gap-4 p-5 rounded-xl border border-white/10 bg-white/[0.02] ${
                                    i === pains.length - 1 ? 'sm:col-span-2' : ''
                                }`}
                            >
                                <span className="shrink-0 mt-1.5 w-2 h-2 rounded-full bg-violet-500" aria-hidden />
                                <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">{pain}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.p
                        {...reveal}
                        className="mt-8 border-l-2 border-violet-500 pl-5 text-lg sm:text-xl text-white font-medium leading-relaxed"
                    >
                        {PAIN_CLOSE}
                    </motion.p>
                </div>
            </section>

            {/* ===== 3) QUEJAS -> MÓDULOS ===== */}
            <section className="relative">
                <RouteDivider className="absolute top-0 left-0 w-full h-8" />
                <div className="max-w-6xl mx-auto px-6 py-20 sm:py-28">
                    <motion.h2 {...reveal} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white max-w-3xl">
                        Esto dicen los clientes de las logísticas en Google. Todos los días.
                    </motion.h2>
                    <motion.p {...reveal} transition={{ delay: 0.05 }} className="mt-5 text-neutral-400 text-base sm:text-lg max-w-3xl leading-relaxed">
                        Son reseñas reales, públicas, de empresas del rubro. Cada una es una tarea que hoy depende de que una
                        persona se acuerde, llame o tipee. Cada una se automatiza.
                    </motion.p>

                    <div className="mt-12 grid md:grid-cols-2 gap-5 lg:gap-6">
                        {modules.map((m, i) => {
                            const Icon = m.Icon
                            const Demo = m.Demo
                            return (
                            <motion.div
                                key={i}
                                {...reveal}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -4 }}
                                className="group relative flex flex-col p-6 lg:p-7 rounded-2xl border border-white/10 bg-[#1a1a2e]/60 overflow-hidden transition-colors duration-300 hover:border-violet-500/40"
                            >
                                {/* hover glow — solo desktop: en mobile no hay hover y el blur
                                    igual crea una capa de composición por card. */}
                                <div aria-hidden className="hidden lg:block pointer-events-none absolute -right-8 -top-8 w-40 h-40 rounded-full blur-[60px] bg-violet-500/0 group-hover:bg-violet-500/15 transition-colors duration-500" />

                                {/* Quote */}
                                <div className="relative border-l-2 border-violet-500 pl-4">
                                    <Quote className="absolute -left-1 -top-1 w-5 h-5 text-violet-500/40" aria-hidden />
                                    <p className="pl-4 text-neutral-400 italic leading-relaxed">{m.quote}</p>
                                </div>

                                {/* Module */}
                                <div className="mt-6">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-violet-500/40 bg-violet-500/15 text-[11px] font-bold text-violet-300">{m.step}</span>
                                        <span className="text-[11px] uppercase tracking-widest text-violet-400/70 font-medium">{m.context}</span>
                                        <span className="h-px flex-1 bg-white/10" />
                                    </div>
                                    <div className="mt-2 flex items-center gap-3">
                                        <div className="shrink-0 w-12 h-12 rounded-xl border border-violet-500/25 bg-violet-500/[0.07] p-1.5 group-hover:border-violet-500/50 group-hover:scale-105 transition-all duration-300">
                                            <Icon />
                                        </div>
                                        <h3 className="text-lg font-bold text-violet-400">{m.name}</h3>
                                    </div>
                                    <p className="mt-3 text-neutral-300 text-sm leading-relaxed lg:hidden">{m.descShort}</p>
                                    <p className="mt-3 text-neutral-300 text-sm leading-relaxed hidden lg:block">{m.desc}</p>

                                    {/* Micro-demo del módulo */}
                                    {Demo && (
                                        <div className="mt-4">
                                            <Demo />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                            )
                        })}
                    </div>

                    {/* Cierre de conversión */}
                    {/* Remate: la ruta se dibuja con el scroll y enciende los módulos.
                        Cierra la metáfora que abre el hero. */}
                    <div className="mt-16">
                        <RouteRoadmap />
                    </div>

                    <motion.div
                        {...reveal}
                        className="mt-10 flex flex-col items-start gap-3 p-6 sm:p-8 rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-900/20 to-blue-900/10"
                    >
                        <a
                            href={WHATSAPP_HREF}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 text-white font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                        >
                            Pedí un diagnóstico gratuito de 30 minutos
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                        </a>
                        <p className="text-neutral-500 text-sm">
                            Sin permanencia. Mes a mes. Infraestructura propia y aislada (GDPR).
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ===== Footer mínimo ===== */}
            <footer className="border-t border-white/10 bg-[#0f0f1a]">
                <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Link href="/" className="text-neutral-400 hover:text-white text-sm transition-colors">
                        Volver al inicio
                    </Link>
                    <div className="flex items-center gap-5 text-sm text-neutral-500">
                        <Link href="/legal#privacidad" className="hover:text-white transition-colors">
                            Privacidad
                        </Link>
                        <Link href="/legal#terminos" className="hover:text-white transition-colors">
                            Términos
                        </Link>
                    </div>
                    <p className="text-neutral-600 text-sm">© {new Date().getFullYear()} Individra</p>
                </div>
            </footer>
        </main>
    )
}
