'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { ART } from '../constants/assets'
import { Float } from '../motion'

/* ---------- CTA final ---------- */

export function FinalCTA() {
    const reduce = useReducedMotion()
    return (
        <section className="relative py-24 border-t border-white/5 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C84214]/10 via-transparent to-transparent pointer-events-none" />

            {/* El copy y el render comparten un mismo contenedor de proporción fija.
                En desktop el texto se posiciona en porcentajes sobre el hueco vacío
                del render, así que acompaña la imagen a cualquier ancho. En mobile
                el mismo bloque vuelve al flujo normal, arriba de la imagen. */}
            <div className="relative z-10 max-w-5xl mx-auto px-6">
                <div className="relative">
                    <div className="md:absolute md:left-[3%] md:top-[7%] md:w-[52%] mb-10 md:mb-0">
                        <h2 className="text-3xl md:text-[1.75rem] lg:text-4xl font-bold text-[#E8E5DE] leading-tight text-balance">
                            Dejá de contestar lo mismo cien veces al día
                        </h2>
                        <p className="mt-3 lg:mt-4 text-sm lg:text-base text-[#B7B3B0] leading-relaxed text-pretty">
                            Empezá por el diagnóstico gratuito y descubrí qué parte de tu
                            atención puede funcionar sola.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href="/diagnostico?origen=ecommerce"
                                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-[#C84214] text-white font-bold rounded-xl shadow-lg shadow-[#C84214]/25 hover:bg-[#B3390F] active:scale-[0.98] transition-all duration-200"
                            >
                                Hacer el diagnóstico gratis
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                            <a
                                href="mailto:individratec@gmail.com"
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[#3E3D3A] text-[#E8E5DE] font-semibold hover:border-[#C84214]/50 hover:bg-white/5 transition-all duration-200"
                            >
                                Hablar con el equipo
                            </a>
                        </div>
                    </div>

                    {/* Resplandor bajo el carrito, del lado donde caen los paquetes */}
                    <motion.div
                        aria-hidden
                        className="absolute right-[12%] bottom-[6%] w-1/3 h-1/4 rounded-full bg-[#C84214]/30 blur-3xl pointer-events-none"
                        animate={reduce ? undefined : { opacity: [0.4, 0.85, 0.4] }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    {/* Entra con un rebote corto: los paquetes leen como que aterrizan */}
                    <motion.div
                        initial={reduce ? undefined : { opacity: 0, y: 44 }}
                        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ type: 'spring', stiffness: 90, damping: 13 }}
                    >
                        <Float distance={7} duration={5.5}>
                            <Image
                                src={ART.slabCarrito.src}
                                alt={ART.slabCarrito.alt}
                                width={ART.slabCarrito.w}
                                height={ART.slabCarrito.h}
                                quality={85}
                                sizes="(max-width: 768px) 100vw, 900px"
                                className="relative w-full h-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
                            />
                        </Float>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
