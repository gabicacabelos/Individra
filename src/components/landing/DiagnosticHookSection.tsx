'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calculator, Truck, ShoppingBag, Store } from 'lucide-react'

const COSTO_FALLO_UNITARIO_ARS = 9980
const DIAS_HABILES_MES = 22

function formatearArs(valor: number): string {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0,
    }).format(Math.round(valor))
}

export function DiagnosticHookSection() {
    const [entregasDia, setEntregasDia] = useState(100)
    const [porcentajeFallos, setPorcentajeFallos] = useState(10)

    const fallosDia = entregasDia * (porcentajeFallos / 100)
    const fallosMes = Math.round(fallosDia * DIAS_HABILES_MES)
    const perdidaMensualArs = Math.round(fallosDia * DIAS_HABILES_MES * COSTO_FALLO_UNITARIO_ARS)
    const ahorroMinArs = Math.round(perdidaMensualArs * 0.5)
    const ahorroMaxArs = Math.round(perdidaMensualArs * 0.6)

    return (
        <section
            id="autodiagnostico"
            className="relative py-20 lg:py-28 bg-[#0B0D0E] border-y border-white/5 overflow-hidden"
        >
            {/* Ambient glow */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C84214]/10 via-transparent to-transparent"
            />

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                    {/* Columna izquierda: Gancho y selección directa de perfil */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-6 space-y-5"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#C84214]/40 bg-[#C84214]/10 px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.16em] text-[#E8E5DE]">
                            <Calculator className="w-3.5 h-3.5 text-[#C84214]" />
                            Autodiagnóstico Interactivo · 2 Minutos
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                            Poné en números cuánto{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C84214] to-[#B7B3B0]">
                                se escapa hoy en tu operación.
                            </span>
                        </h2>

                        <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
                            Antes de agendar una llamada, podés medir en 2 minutos tu nivel de riesgo
                            operativo y calcular cuánta plata perdés por mes en viajes en falso,
                            re-entregas o consultas sin responder.
                        </p>

                        <div className="pt-2 space-y-2.5">
                            <p className="font-mono text-xs uppercase tracking-widest text-[#8E8B88]">
                                Elegí tu perfil para hacer el test completo:
                            </p>

                            <div className="grid gap-2.5">
                                <Link
                                    href="/diagnostico?origen=logistica"
                                    className="group flex items-center justify-between rounded-xl border border-[#C84214]/50 bg-[#151719] px-4 py-3.5 transition-all hover:border-[#C84214] hover:bg-[#1E1D1C]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C84214]/15 border border-[#C84214]/30 text-[#C84214]">
                                            <Truck className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <span className="block text-sm sm:text-base font-semibold text-white">
                                                Logística o Distribuidora Mayorista
                                            </span>
                                            <span className="block text-xs text-neutral-400">
                                                Flota propia o fleteros · Última milla y reparto B2B
                                            </span>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-4 w-4 shrink-0 text-[#C84214] transition-transform group-hover:translate-x-1" />
                                </Link>

                                <div className="grid sm:grid-cols-2 gap-2.5">
                                    <Link
                                        href="/diagnostico?origen=home_meli"
                                        className="group flex items-center justify-between rounded-xl border border-[#3E3D3A] bg-[#151719] px-4 py-3 transition-all hover:border-[#C84214]/60 hover:bg-[#1E1D1C]"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <ShoppingBag className="h-4 w-4 text-[#B7B3B0] group-hover:text-white" />
                                            <span className="text-sm font-medium text-neutral-200 group-hover:text-white">
                                                Mercado Libre Flex
                                            </span>
                                        </div>
                                        <ArrowRight className="h-3.5 w-3.5 text-neutral-500 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
                                    </Link>

                                    <Link
                                        href="/diagnostico?origen=home_tienda"
                                        className="group flex items-center justify-between rounded-xl border border-[#3E3D3A] bg-[#151719] px-4 py-3 transition-all hover:border-[#C84214]/60 hover:bg-[#1E1D1C]"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Store className="h-4 w-4 text-[#B7B3B0] group-hover:text-white" />
                                            <span className="text-sm font-medium text-neutral-200 group-hover:text-white">
                                                Tienda Propia / Web
                                            </span>
                                        </div>
                                        <ArrowRight className="h-3.5 w-3.5 text-neutral-500 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Columna derecha: Calculadora interactiva en vivo */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="lg:col-span-6"
                    >
                        <div className="rounded-2xl border border-[#3E3D3A] bg-[#161514] p-6 sm:p-7 shadow-2xl">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
                                <div>
                                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#C84214]">
                                        Simulador rápido en vivo
                                    </span>
                                    <h3 className="mt-0.5 text-lg font-bold text-white">
                                        Costo de entregas fallidas (Flota / Reparto)
                                    </h3>
                                </div>
                                <span className="rounded-full border border-[#3E3D3A] bg-[#0B0D0E] px-3 py-1 font-mono text-xs text-[#B7B3B0]">
                                    {formatearArs(COSTO_FALLO_UNITARIO_ARS)} / fallo
                                </span>
                            </div>

                            <div className="mt-5 space-y-4">
                                <div className="rounded-xl border border-[#3E3D3A] bg-[#0B0D0E] p-4">
                                    <div className="flex items-baseline justify-between">
                                        <label
                                            htmlFor="home-slider-entregas"
                                            className="text-xs font-medium uppercase tracking-wider text-[#B7B3B0]"
                                        >
                                            Entregas o paradas por día
                                        </label>
                                        <span className="font-mono text-xl font-bold text-white">
                                            {entregasDia} / día
                                        </span>
                                    </div>
                                    <input
                                        id="home-slider-entregas"
                                        type="range"
                                        min={15}
                                        max={500}
                                        step={5}
                                        value={entregasDia}
                                        onChange={(e) => setEntregasDia(Number(e.target.value))}
                                        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#262523] accent-[#C84214]"
                                    />
                                </div>

                                <div className="rounded-xl border border-[#3E3D3A] bg-[#0B0D0E] p-4">
                                    <div className="flex items-baseline justify-between">
                                        <label
                                            htmlFor="home-slider-fallos"
                                            className="text-xs font-medium uppercase tracking-wider text-[#B7B3B0]"
                                        >
                                            % de rebote al 1° intento
                                        </label>
                                        <span className="font-mono text-xl font-bold text-[#C84214]">
                                            {porcentajeFallos}%
                                        </span>
                                    </div>
                                    <input
                                        id="home-slider-fallos"
                                        type="range"
                                        min={1}
                                        max={25}
                                        step={1}
                                        value={porcentajeFallos}
                                        onChange={(e) => setPorcentajeFallos(Number(e.target.value))}
                                        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#262523] accent-[#C84214]"
                                    />
                                </div>
                            </div>

                            <div className="mt-5 grid sm:grid-cols-2 gap-3">
                                <div className="rounded-xl border border-[#C84214]/40 bg-[#C84214]/10 p-4">
                                    <span className="block font-mono text-[11px] uppercase tracking-wider text-[#E8E5DE]">
                                        Fuga mensual ({fallosMes} rebotes)
                                    </span>
                                    <span className="mt-1 block font-mono text-2xl font-bold text-[#C84214]">
                                        {formatearArs(perdidaMensualArs)}
                                    </span>
                                    <span className="mt-0.5 block text-[11px] text-[#B7B3B0]">
                                        En {DIAS_HABILES_MES} días hábiles operativos
                                    </span>
                                </div>

                                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                                    <span className="block font-mono text-[11px] uppercase tracking-wider text-emerald-300">
                                        Ahorro recuperable (-50% a -60%)
                                    </span>
                                    <span className="mt-1 block font-mono text-lg sm:text-xl font-bold text-emerald-400">
                                        {formatearArs(ahorroMinArs)} a {formatearArs(ahorroMaxArs)}
                                    </span>
                                    <span className="mt-0.5 block text-[11px] text-emerald-200/70">
                                        Con Coordinación Previa + Ficha Domicilio
                                    </span>
                                </div>
                            </div>

                            <p className="mt-3 text-[11px] text-[#8E8B88] leading-relaxed">
                                * Cálculo base ({formatearArs(COSTO_FALLO_UNITARIO_ARS)} por entrega fallida): Gasoil desvío 8 km ($2.110) + 20 min chofer CCT 40/89 ($2.880) + Re-ruteo y 2° intento ($4.990).
                            </p>

                            <Link
                                href="/diagnostico?origen=logistica"
                                className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#C84214] px-5 py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-[#C84214]/20 transition-all hover:bg-[#B3390F] active:scale-[0.99]"
                            >
                                Hacer el autodiagnóstico completo (9 preguntas)
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
