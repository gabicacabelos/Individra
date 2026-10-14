'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
    Calculator,
    AlertTriangle,
    Clock,
    ShieldAlert,
    ArrowRight,
    Info,
    CheckCircle2,
} from 'lucide-react'

function formatARS(value: number): string {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0,
    }).format(Math.round(value))
}

export function VentaBlindadaCalculator() {
    // 1. Volumen de ventas por WhatsApp/IG con transferencia por semana
    const [weeklyWaSales, setWeeklyWaSales] = useState<number>(30)
    // 2. Ticket promedio en ARS
    const [avgTicket, setAvgTicket] = useState<number>(65000)
    // 3. Margen neto estimado (%) sobre el ticket
    const [marginPct, setMarginPct] = useState<number>(28)
    // 4. Sobreventas en ML/TN o comprobantes conflictivos/duplicados por mes
    const [monthlyIncidents, setMonthlyIncidents] = useState<number>(4)
    // 5. Horas diarias del equipo cruzando pagos, bajando stock a mano y contestando tracking
    const [dailyManualHours, setDailyManualHours] = useState<number>(2.5)
    // 6. Costo hora operativo editable (referencia convenio Comercio ~ $1.250.000 / 200 hs = $6.250/h)
    const [hourlyCost, setHourlyCost] = useState<number>(6250)

    const metrics = useMemo(() => {
        const monthlyWaSales = weeklyWaSales * 4.33
        // Cada incidente (sobreventa cancelada en ML o comprobante mal validado)
        // implica perder el margen de esa venta + tiempo de gestión/reposición (~1.5 hs)
        // Nota: Si es un comprobante falso despachado, se pierde el 100% del ticket, pero usamos
        // el cálculo conservador basado en margen + gestión para no inflar números.
        const marginPerSale = avgTicket * (marginPct / 100)
        const incidentDirectLoss = monthlyIncidents * (marginPerSale + hourlyCost * 1.5)

        // Horas manuales por mes (24 días operativos de lunes a sábado en e-commerce)
        const operatingDaysPerMonth = 24
        const monthlyManualHours = dailyManualHours * operatingDaysPerMonth
        const manualLaborCost = monthlyManualHours * hourlyCost

        const totalMonthlyDrain = incidentDirectLoss + manualLaborCost
        const totalAnnualDrain = totalMonthlyDrain * 12

        return {
            monthlyWaSales: Math.round(monthlyWaSales),
            marginPerSale,
            incidentDirectLoss,
            monthlyManualHours: Math.round(monthlyManualHours),
            manualLaborCost,
            totalMonthlyDrain,
            totalAnnualDrain,
        }
    }, [weeklyWaSales, avgTicket, marginPct, monthlyIncidents, dailyManualHours, hourlyCost])

    const whatsappMessage = useMemo(() => {
        const text =
            `Hola Gabriel, hice el cálculo en la web de INDIVIDRA:\n` +
            `• Ventas por WhatsApp/semana: ${weeklyWaSales}\n` +
            `• Ticket promedio: ${formatARS(avgTicket)}\n` +
            `• Incidentes stock/comprobantes al mes: ${monthlyIncidents}\n` +
            `• Horas manuales por día: ${dailyManualHours} hs (${metrics.monthlyManualHours} hs/mes)\n` +
            `• Fuga mensual estimada: ${formatARS(metrics.totalMonthlyDrain)}\n\n` +
            `Quiero ver cómo funcionaría el Piloto de 30 días en mi operación.`
        return `https://wa.me/5491160152435?text=${encodeURIComponent(text)}`
    }, [weeklyWaSales, avgTicket, monthlyIncidents, dailyManualHours, metrics])

    return (
        <section
            id="calculadora"
            className="relative py-24 sm:py-32 bg-[#0B0D0E] border-t border-[#3E3D3A]/50 overflow-hidden"
        >
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C84214]/8 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5520]/10 border border-[#FF5520]/30 text-[#FFA380] text-xs font-mono uppercase tracking-[0.18em]">
                        <Calculator className="w-3.5 h-3.5 text-[#FF5520]" />
                        Sección Secundaria · Módulo Venta Blindada + Calculadora Operativa
                    </span>
                    <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
                        ¿También cobrás por WhatsApp?{' '}
                        <span className="bg-gradient-to-r from-[#FF5520] via-[#FFA380] to-white bg-clip-text text-transparent">
                            Calculá el costo de cruzar pagos y stock a mano
                        </span>
                    </h2>
                    <p className="mt-4 text-neutral-300 text-base sm:text-lg leading-relaxed">
                        Además del monitoreo principal de reclamos y termómetro en Mercado Libre, nuestro módulo secundario <strong className="text-white">Venta Blindada</strong> conecta tus cobros por transferencia en WhatsApp con el stock de ML y Tiendanube. Mové los cursores con tus números y mirá la fórmula transparente debajo.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Inputs (Obsidian Hardware) */}
                    <div className="lg:col-span-7 card-obsidian sheen-top rounded-3xl border border-white/[0.12] bg-gradient-to-br from-[#121418] via-[#0F1115] to-[#0A0C0E] p-6 sm:p-8 space-y-7 shadow-xl">
                        {/* Input 1 */}
                        <div>
                            <div className="flex items-center justify-between gap-4 mb-2">
                                <label
                                    htmlFor="calc-weekly-wa"
                                    className="text-sm sm:text-base font-semibold text-white font-heading"
                                >
                                    1. Ventas por WhatsApp / Instagram por semana
                                </label>
                                <span className="px-3 py-1 rounded-lg bg-black/60 border border-white/10 font-mono text-sm font-bold text-[#FFA380] shadow-inner">
                                    {weeklyWaSales} ventas/sem
                                </span>
                            </div>
                            <p className="text-xs text-neutral-400 mb-3">
                                Pedidos que cerrás por chat (con transferencia, link de pago o retiro) fuera del checkout automático.
                            </p>
                            <input
                                id="calc-weekly-wa"
                                type="range"
                                min={5}
                                max={200}
                                step={5}
                                value={weeklyWaSales}
                                onChange={(e) => setWeeklyWaSales(Number(e.target.value))}
                                className="w-full accent-[#FF5520] cursor-pointer h-2 bg-white/10 rounded-lg"
                            />
                            <div className="flex justify-between text-[11px] font-mono text-neutral-500 mt-1">
                                <span>5 / sem</span>
                                <span>50 / sem</span>
                                <span>100 / sem</span>
                                <span>200 / sem</span>
                            </div>
                        </div>

                        {/* Input 2 & 3: Ticket + Margen */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3 border-t border-white/[0.08]">
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <label
                                        htmlFor="calc-ticket"
                                        className="text-sm font-semibold text-white font-heading"
                                    >
                                        2. Ticket promedio (ARS)
                                    </label>
                                    <span className="font-mono text-xs font-bold text-[#FFA380] bg-black/60 px-2 py-0.5 rounded border border-white/10">
                                        {formatARS(avgTicket)}
                                    </span>
                                </div>
                                <input
                                    id="calc-ticket"
                                    type="range"
                                    min={15000}
                                    max={300000}
                                    step={5000}
                                    value={avgTicket}
                                    onChange={(e) => setAvgTicket(Number(e.target.value))}
                                    className="w-full accent-[#FF5520] cursor-pointer h-2 bg-white/10 rounded-lg"
                                />
                                <div className="flex justify-between text-[11px] font-mono text-neutral-500 mt-1">
                                    <span>$15.000</span>
                                    <span>$150.000</span>
                                    <span>$300.000</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <label
                                        htmlFor="calc-margin"
                                        className="text-sm font-semibold text-white font-heading"
                                    >
                                        3. Margen sobre venta (%)
                                    </label>
                                    <span className="font-mono text-xs font-bold text-[#FFA380] bg-black/60 px-2 py-0.5 rounded border border-white/10">
                                        {marginPct}% ({formatARS(metrics.marginPerSale)})
                                    </span>
                                </div>
                                <input
                                    id="calc-margin"
                                    type="range"
                                    min={10}
                                    max={60}
                                    step={2}
                                    value={marginPct}
                                    onChange={(e) => setMarginPct(Number(e.target.value))}
                                    className="w-full accent-[#FF5520] cursor-pointer h-2 bg-white/10 rounded-lg"
                                />
                                <div className="flex justify-between text-[11px] font-mono text-neutral-500 mt-1">
                                    <span>10%</span>
                                    <span>30%</span>
                                    <span>60%</span>
                                </div>
                            </div>
                        </div>

                        {/* Input 4: Incidentes de stock / comprobantes */}
                        <div className="pt-3 border-t border-white/[0.08]">
                            <div className="flex items-center justify-between gap-4 mb-2">
                                <label
                                    htmlFor="calc-incidents"
                                    className="text-sm sm:text-base font-semibold text-white font-heading"
                                >
                                    4. Sobreventas o errores de comprobante al mes
                                </label>
                                <span className="px-3 py-1 rounded-lg bg-black/60 border border-white/10 font-mono text-sm font-bold text-[#FFA380] shadow-inner">
                                    {monthlyIncidents} casos/mes
                                </span>
                            </div>
                            <p className="text-xs text-neutral-400 mb-3">
                                Veces al mes que se vende por WhatsApp algo que también se vendió en Mercado Libre/Tiendanube antes de llegar a bajar el stock, o entra un comprobante conflictivo.
                            </p>
                            <input
                                id="calc-incidents"
                                type="range"
                                min={0}
                                max={25}
                                step={1}
                                value={monthlyIncidents}
                                onChange={(e) => setMonthlyIncidents(Number(e.target.value))}
                                className="w-full accent-[#FF5520] cursor-pointer h-2 bg-white/10 rounded-lg"
                            />
                            <div className="flex justify-between text-[11px] font-mono text-neutral-500 mt-1">
                                <span>0 / mes</span>
                                <span>5 / mes</span>
                                <span>15 / mes</span>
                                <span>25 / mes</span>
                            </div>
                        </div>

                        {/* Input 5 & 6: Horas operativas + Costo hora */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3 border-t border-white/[0.08]">
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <label
                                        htmlFor="calc-hours"
                                        className="text-sm font-semibold text-white font-heading"
                                    >
                                        5. Horas/día en tareas manuales
                                    </label>
                                    <span className="font-mono text-xs font-bold text-[#FFA380] bg-black/60 px-2 py-0.5 rounded border border-white/10">
                                        {dailyManualHours} hs/día
                                    </span>
                                </div>
                                <p className="text-[11px] text-neutral-400 mb-2">
                                    Verificar transferencias, actualizar stock entre canales y responder seguimiento.
                                </p>
                                <input
                                    id="calc-hours"
                                    type="range"
                                    min={0.5}
                                    max={8}
                                    step={0.5}
                                    value={dailyManualHours}
                                    onChange={(e) => setDailyManualHours(Number(e.target.value))}
                                    className="w-full accent-[#FF5520] cursor-pointer h-2 bg-white/10 rounded-lg"
                                />
                                <div className="flex justify-between text-[11px] font-mono text-neutral-500 mt-1">
                                    <span>0.5 h</span>
                                    <span>4 hs</span>
                                    <span>8 hs</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <label
                                        htmlFor="calc-hourly-cost"
                                        className="text-sm font-semibold text-white font-heading"
                                    >
                                        6. Costo hora operativo (ARS)
                                    </label>
                                    <span className="font-mono text-xs font-bold text-[#FFA380] bg-black/60 px-2 py-0.5 rounded border border-white/10">
                                        {formatARS(hourlyCost)}/h
                                    </span>
                                </div>
                                <p className="text-[11px] text-neutral-400 mb-2">
                                    Editable. Ref. empleado Comercio / tiempo del dueño (~$1.25M / 200 hs).
                                </p>
                                <input
                                    id="calc-hourly-cost"
                                    type="range"
                                    min={3500}
                                    max={15000}
                                    step={250}
                                    value={hourlyCost}
                                    onChange={(e) => setHourlyCost(Number(e.target.value))}
                                    className="w-full accent-[#FF5520] cursor-pointer h-2 bg-white/10 rounded-lg"
                                />
                                <div className="flex justify-between text-[11px] font-mono text-neutral-500 mt-1">
                                    <span>$3.500/h</span>
                                    <span>$8.000/h</span>
                                    <span>$15.000/h</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Obsidian Financial Vault Card */}
                    <div className="lg:col-span-5 card-obsidian sheen-top rounded-3xl border border-[#FF5520]/40 bg-gradient-to-b from-[#1C100C] via-[#141014] to-[#0A0D10] p-6 sm:p-8 shadow-[0_20px_60px_-10px_rgba(255,85,32,0.2)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#FF5520]/20 via-[#FF5520]/5 to-transparent blur-3xl pointer-events-none" />

                        <div className="relative z-10 flex items-center justify-between border-b border-white/[0.08] pb-4">
                            <div>
                                <span className="text-[11px] font-mono uppercase tracking-widest text-[#FFA380] font-bold">
                                    Diagnóstico Auditado en Vivo
                                </span>
                                <h3 className="text-lg sm:text-xl font-bold font-heading text-white mt-0.5 tracking-tight">
                                    Costo de fricción multicanal
                                </h3>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-[#FF5520]/15 border border-[#FF5520]/30 font-mono text-xs font-bold text-[#FFA380]">
                                ~{metrics.monthlyWaSales} ventas WA/mes
                            </span>
                        </div>

                        {/* Breakdown items */}
                        <div className="relative z-10 mt-6 space-y-3.5">
                            <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.08] backdrop-blur-md">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-2.5">
                                        <Clock className="w-4 h-4 text-[#FF5520] shrink-0" />
                                        <span className="text-sm font-semibold text-neutral-200 font-heading">
                                            Costo operativo de gestión manual ({metrics.monthlyManualHours} hs/mes)
                                        </span>
                                    </div>
                                    <span className="font-mono text-sm font-bold text-white shrink-0">
                                        {formatARS(metrics.manualLaborCost)}
                                    </span>
                                </div>
                                <p className="mt-1.5 text-xs text-neutral-400 font-mono">
                                    Cálculo: {dailyManualHours} hs/día × 24 días × {formatARS(hourlyCost)}/h (tiempo en planillas, comprobantes y stock)
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.08] backdrop-blur-md">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-2.5">
                                        <AlertTriangle className="w-4 h-4 text-[#FF5520] shrink-0" />
                                        <span className="text-sm font-semibold text-neutral-200 font-heading">
                                            Sobreventas y fricción de cobro ({monthlyIncidents}/mes)
                                        </span>
                                    </div>
                                    <span className="font-mono text-sm font-bold text-white shrink-0">
                                        {formatARS(metrics.incidentDirectLoss)}
                                    </span>
                                </div>
                                <p className="mt-1.5 text-xs text-neutral-400 font-mono">
                                    Cálculo: {monthlyIncidents} casos × ({formatARS(metrics.marginPerSale)} margen + 1.5h gestión)
                                </p>
                            </div>

                            {/* Non-quantified reputation warning */}
                            <div className="p-3.5 rounded-2xl bg-[#FF5520]/10 border border-[#FF5520]/30 flex items-start gap-3">
                                <ShieldAlert className="w-4 h-4 text-[#FFA380] shrink-0 mt-0.5" />
                                <p className="text-xs text-neutral-200 leading-relaxed">
                                    <strong className="text-white">Impacto no incluido en pesos:</strong> cada cancelación por falta de stock en Mercado Libre golpea tu termómetro de reputación, encarece tus envíos o te baja exposición en los listados.
                                </p>
                            </div>
                        </div>

                        {/* Total Box */}
                        <div className="relative z-10 mt-6 pt-6 border-t border-white/[0.08]">
                            <span className="text-[11px] font-mono text-[#FFA380] uppercase tracking-wider block font-bold">
                                Fuga mensual estimada:
                            </span>
                            <div className="mt-1 text-4xl sm:text-5xl font-black text-white font-heading tracking-tight drop-shadow-md">
                                {formatARS(metrics.totalMonthlyDrain)}
                            </div>
                            <div className="flex items-center justify-between mt-3 p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs">
                                <span className="text-neutral-400">Proyección a 12 meses:</span>
                                <span className="font-bold text-[#FFA380] text-sm">
                                    {formatARS(metrics.totalAnnualDrain)} / año
                                </span>
                            </div>
                        </div>

                        {/* Honest disclaimer */}
                        <div className="relative z-10 mt-5 p-3 rounded-xl bg-black/40 border border-white/5 flex items-start gap-2.5">
                            <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                                No prometemos un ahorro mágico del 100%: el operador mantiene la decisión humana en 1 clic, pero reduce minutos de planillas y chats a segundos por operación. En el <strong>Piloto de 30 días</strong> medimos la reducción neta de horas y errores en tu tienda.
                            </p>
                        </div>

                        {/* Single Conversion CTA */}
                        <div className="relative z-10 mt-6 space-y-3">
                            <a
                                href={whatsappMessage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-4.5 px-6 bg-gradient-to-r from-[#FF5520] via-[#FF6E40] to-[#FF5520] hover:brightness-110 text-white font-heading font-bold text-sm sm:text-base rounded-2xl shadow-[0_4px_30px_rgba(255,85,32,0.4)] flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer active:scale-[0.99]"
                            >
                                Medir mi caso real en el Piloto de 30 días
                                <ArrowRight className="w-4 h-4" />
                            </a>
                            <a
                                href="#contacto"
                                className="w-full py-3 px-4 bg-white/[0.03] hover:bg-white/[0.08] text-neutral-300 hover:text-white font-mono text-xs sm:text-sm rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5520]" />
                                O elegí un horario en el calendario (30 min)
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
