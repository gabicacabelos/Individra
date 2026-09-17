'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { ART } from '../constants/assets'

/* ---------- FAQ propia ---------- */

const FAQS = [
    {
        q: '¿Necesito cambiar de plataforma de ventas?',
        a: 'No. Individra se conecta a lo que ya usás (Mercado Libre, Tiendanube, Shopify, WhatsApp, Instagram, WooCommerce). Seguís vendiendo igual, solo que la atención se unifica y se automatiza.',
    },
    {
        q: '¿La IA responde sola o mi equipo mantiene el control?',
        a: 'Las dos cosas. La IA resuelve lo repetitivo y deriva a una persona cuando el caso lo amerita. Vos definís qué se responde solo y qué se escala.',
    },
    {
        q: '¿Puedo activar solo un módulo?',
        a: 'Sí. Podés empezar por el Centro multicanal o por el Vendedor 24/7 y sumar el resto cuando quieras. Se arma según tu operación.',
    },
    {
        q: '¿Cómo empiezo?',
        a: 'Con el diagnóstico gratuito: unas pocas preguntas sobre cómo vendés hoy y te devolvemos dónde estás perdiendo tiempo o ventas, y qué módulos te conviene activar primero.',
    },
]

export function FAQ() {
    const [open, setOpen] = useState<number | null>(0)
    return (
        <section id="faq" className="relative py-24 border-t border-white/5">
            <div className="max-w-3xl mx-auto px-6">
                {/* La lamparita se enciende cuando hay una pregunta abierta:
                    el ícono responde a lo que hace la persona en vez de ser adorno. */}
                <div className="flex flex-col items-center mb-12">
                    <div className="relative mb-4">
                        <motion.div
                            aria-hidden
                            className="absolute inset-0 -m-1 rounded-full bg-[#C84214] blur-xl"
                            animate={{ opacity: open !== null ? 0.5 : 0.14 }}
                            transition={{ duration: 0.5 }}
                        />
                        <motion.div
                            animate={{ scale: open !== null ? 1.06 : 1, y: open !== null ? -3 : 0 }}
                            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                        >
                            <Image
                                src={ART.ideaBurbuja.src}
                                alt={ART.ideaBurbuja.alt}
                                width={ART.ideaBurbuja.w}
                                height={ART.ideaBurbuja.h}
                                quality={85}
                                sizes="192px"
                                className="relative h-16 sm:h-20 w-auto object-contain"
                            />
                        </motion.div>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#E8E5DE] text-center text-balance">
                        Preguntas frecuentes
                    </h2>
                </div>
                <div className="space-y-3">
                    {FAQS.map((f, i) => {
                        const isOpen = open === i
                        return (
                            <div
                                key={f.q}
                                className="rounded-xl border border-[#3E3D3A] bg-[#121312] overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpen(isOpen ? null : i)}
                                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                                    aria-expanded={isOpen}
                                >
                                    <span className="text-[#E8E5DE] font-semibold">{f.q}</span>
                                    <span className="shrink-0 text-[#C84214]">
                                        {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                    </span>
                                </button>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        transition={{ duration: 0.25 }}
                                        className="px-5 pb-5"
                                    >
                                        <p className="text-sm text-[#B7B3B0] leading-relaxed text-pretty">{f.a}</p>
                                    </motion.div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
