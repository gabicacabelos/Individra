'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { ART, type Art } from '../constants/assets'
import { Float } from '../motion'

/* ---------- Capacidades: riel de ciclo de venta (layout propio) ---------- */

type Capability = {
    art: Art
    title: string
    desc: string
    star?: boolean
}

type Phase = {
    label: string
    kicker: string
    items: Capability[]
}

const PHASES: Phase[] = [
    {
        label: 'Captar y convertir',
        kicker: 'Antes de la compra',
        items: [
            {
                art: ART.auriculares,
                title: 'Vendedor 24/7',
                desc: 'Contesta al instante preguntas de stock, talles, medidas, compatibilidad y envíos en publicaciones, web y WhatsApp. Aprende de tu catálogo y no deja una consulta sin respuesta.',
            },
            {
                art: ART.carritoLleno,
                title: 'Recuperador de carritos',
                desc: 'Retoma automáticamente al que preguntó y no compró o abandonó el carrito, con un seguimiento oportuno y no invasivo que vuelve a abrir la conversación.',
            },
        ],
    },
    {
        label: 'Operar sin fricción',
        kicker: 'Durante la venta',
        items: [
            {
                art: ART.monitorOferta,
                title: 'Centro multicanal',
                desc: 'El corazón de Individra para ecommerce: unifica Mercado Libre, Tiendanube, Shopify, WhatsApp e Instagram en una sola bandeja. Una conversación por cliente, sin saltar entre apps ni perder el hilo.',
                star: true,
            },
            {
                art: ART.cajaCronometro,
                title: 'Estado del pedido automático',
                desc: 'Un bot genérico responde "tu pedido está en camino". Individra se conecta al mismo seguimiento logístico que usa en /logistica: detecta la demora antes de que se note y avisa al cliente antes de que pregunte.',
            },
        ],
    },
    {
        label: 'Retener y proteger',
        kicker: 'Después de la compra',
        items: [
            {
                art: ART.pagoCheck,
                title: 'Escudo de reputación',
                desc: 'Detecta al cliente molesto apenas aparece la señal y lo deriva a una solución real antes de que el problema escale a reclamo. Menos reclamos abiertos es lo que cuida tu ranking en Mercado Libre.',
            },
            {
                art: ART.cajaAbierta,
                title: 'Post-venta y recompra',
                desc: 'Gestiona cambios, devoluciones y garantías, y dispara campañas de recompra segmentadas para que el cliente vuelva sin trabajo manual de tu equipo.',
            },
        ],
    },
]

export function Capabilities() {
    return (
        <section id="capacidades" className="relative py-24">
            <div className="max-w-6xl mx-auto px-6">
                <div className="max-w-2xl mb-16">
                    <p className="text-[#C84214] text-sm font-semibold uppercase tracking-[0.15em] mb-3">
                        Qué automatiza Individra
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#E8E5DE] leading-tight text-balance">
                        Seis capacidades que cubren todo el ciclo de tu venta online
                    </h2>
                    <p className="mt-4 text-[#B7B3B0] leading-relaxed text-pretty">
                        Desde la primera pregunta hasta la recompra. Se activan de a una o todas juntas, según lo que tu operación necesite.
                    </p>
                </div>

                {/* Riel vertical de fases */}
                <div className="relative">
                    {/* línea del riel (desktop) */}
                    <div className="hidden md:block absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-[#C84214]/60 via-[#3E3D3A] to-transparent" />

                    <div className="space-y-16">
                        {PHASES.map((phase, pi) => (
                            <div key={phase.label} className="relative md:pl-12">
                                {/* nodo de fase */}
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="hidden md:flex absolute left-0 w-4 h-4 rounded-full bg-[#C84214] ring-4 ring-[#C84214]/15" />
                                    <span className="text-xs font-mono text-[#B7B3B0]">0{pi + 1}</span>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#E8E5DE] leading-none">{phase.label}</h3>
                                        <p className="text-xs text-[#B7B3B0] mt-1.5">{phase.kicker}</p>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {phase.items.map((cap, ci) => (
                                        <CapabilityCard
                                            key={cap.title}
                                            cap={cap}
                                            // Desfasamos la flotación para que las seis
                                            // tarjetas no suban y bajen en bloque.
                                            delay={(pi * 2 + ci) * 0.45}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

function CapabilityCard({ cap, delay = 0 }: { cap: Capability; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className={`group relative rounded-2xl border p-6 transition-all duration-300 ${
                cap.star
                    ? 'border-[#C84214]/40 bg-gradient-to-b from-[#C84214]/10 to-[#121312]'
                    : 'border-[#3E3D3A] bg-[#121312] hover:border-[#C84214]/40'
            }`}
        >
            {cap.star && (
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C84214] text-white text-[10px] font-bold uppercase tracking-wide">
                    <Sparkles className="w-2.5 h-2.5" />
                    Estrella
                </span>
            )}

            {/* Render 3D sobre un halo terracota: el halo reemplaza al recuadro
                de color del ícono plano, que contra un render con volumen
                quedaba como una estampilla pegada. */}
            <div className="relative mb-4 h-20 sm:h-24 flex items-end">
                <div
                    aria-hidden
                    className="absolute left-2 bottom-1 w-20 h-20 rounded-full bg-[#C84214]/20 blur-2xl group-hover:bg-[#C84214]/35 transition-colors duration-500"
                />
                <Float delay={delay} distance={5} duration={4.2}>
                    <Image
                        src={cap.art.src}
                        alt={cap.art.alt}
                        width={cap.art.w}
                        height={cap.art.h}
                        quality={85}
                        // Se muestra a ~96-134px, pero en pantallas 2x hace falta el
                        // doble de píxeles reales o el render sale blando. El archivo
                        // pesa 14-48KB, así que pedir el candidato grande no cuesta nada.
                        sizes="256px"
                        className="relative h-20 sm:h-24 w-auto object-contain drop-shadow-[0_14px_30px_rgba(200,66,20,0.28)] transition-transform duration-500 group-hover:scale-[1.08]"
                    />
                </Float>
            </div>

            <h4 className="text-lg font-bold text-[#E8E5DE] mb-2">{cap.title}</h4>
            <p className="text-sm text-[#B7B3B0] leading-relaxed text-pretty">{cap.desc}</p>
        </motion.div>
    )
}
