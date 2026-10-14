'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Calendar, Database, CheckCircle2, ArrowRight } from 'lucide-react'

const reveal = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
}

const pilotWeeks = [
    {
        week: 'SEMANA 1',
        title: 'Medición de línea base real',
        desc: 'Auditamos el estado actual de tu termómetro en Mercado Libre, cuántos reclamos o cancelaciones te separan de bajar de color y dónde se producen demoras en respuestas o cruces de stock.',
    },
    {
        week: 'SEMANA 2',
        title: 'Conexión en Modo Espejo',
        desc: 'Conectamos las APIs oficiales en modo solo lectura. Recibís las alertas inmediatas de reclamos con plazo exacto y el cálculo de margen de tu termómetro sin tocar tus canales ni tu inventario real.',
    },
    {
        week: 'SEMANAS 3 Y 4',
        title: 'Ejecución activa + Comparativa',
        desc: 'Activamos la consola completa (alertas de reclamos, armado de descargos y módulo secundario Venta Blindada). Al día 30 comparamos los números contra la Semana 1 y decidís si pasás a abono mensual.',
    },
]

const pilares = [
    {
        Icon: Calendar,
        eyebrow: 'Sin permanencia',
        title: 'Mes a mes, sin ataduras',
        body: 'Ningún contrato de permanencia. Si el sistema deja de aportar valor, cortás cuando quieras. Sin costos de salida, sin cláusulas escondidas, sin llamados de retención.',
        accent: 'from-[#C84214] to-[#A8340E]',
        border: 'border-[#C84214]/30',
        glow: 'bg-[#C84214]/10',
        eyebrowColor: 'text-[#C84214]',
    },
    {
        Icon: Database,
        eyebrow: 'Portabilidad total',
        title: 'Tu base es tuya, siempre',
        body: 'Cada cliente corre en su propia instancia aislada, con su base de datos separada. Si te vas, te llevás todo — historial de conversaciones, comprobantes, contactos y reportes. Sin quedar encerrado en un formato propietario.',
        accent: 'from-[#B7B3B0] to-[#8E8B88]',
        border: 'border-[#B7B3B0]/30',
        glow: 'bg-[#B7B3B0]/10',
        eyebrowColor: 'text-[#B7B3B0]',
    },
]

export function PropuestaComercialSection() {
    return (
        <section id="piloto" className="relative py-24 lg:py-32 bg-[#0B0D0E] overflow-hidden border-t border-[#3E3D3A]/40">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#363533]/20 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                {/* Header: El Piloto de 30 Días */}
                <motion.div {...reveal} className="text-center mb-12 lg:mb-16">
                    <div className="mb-3 flex justify-center">
                        <Image
                            src="/3d/icono-escudo-lock.png"
                            alt=""
                            aria-hidden
                            width={433}
                            height={512}
                            quality={95}
                            sizes="256px"
                            className="h-20 w-auto object-contain drop-shadow-[0_14px_30px_rgba(200,66,20,0.32)] sm:h-24"
                        />
                    </div>
                    <span className="text-[#C84214] text-xs sm:text-sm font-mono font-medium uppercase tracking-[0.2em]">
                        Cómo validamos juntos · Piloto de 30 días
                    </span>
                    <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl mx-auto">
                        No nos creas por una landing:{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C84214] to-[#B7B3B0]">
                            lo medimos 30 días en tu operación
                        </span>
                    </h2>
                    <p className="mt-5 text-neutral-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                        En vez de venderte un paquete cerrado a ciegas, entramos con un piloto acotado a blindar tus alertas de reclamos, plazos exactos y termómetro en Mercado Libre, sumando los módulos secundarios que tu tienda necesite.
                    </p>
                </motion.div>

                {/* 30-Day Pilot Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
                    {pilotWeeks.map((step, idx) => (
                        <motion.div
                            key={step.week}
                            {...reveal}
                            transition={{ delay: idx * 0.08 }}
                            className="rounded-2xl border border-[#3E3D3A] bg-[#16181B] p-6 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="px-2.5 py-1 rounded bg-[#C84214]/15 border border-[#C84214]/30 font-mono text-xs font-bold text-[#FFA380]">
                                        {step.week}
                                    </span>
                                    <CheckCircle2 className="w-4 h-4 text-[#C84214]" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-neutral-300 leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Planes Comerciales y Abonos */}
                <div className="mb-16">
                    <div className="text-center mb-8">
                        <span className="text-[#C84214] text-xs font-mono font-medium uppercase tracking-[0.2em]">
                            Estructura de Inversión Transparente
                        </span>
                        <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
                            Planes claros con volumen y límites precisos
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
                            Precios en ARS netos (+ IVA), actualizables trimestralmente por IPC (o equivalente en USD oficial). Sin cláusulas escondidas.
                        </p>
                    </div>

                    {/* Banner de Capacidad Operativa y Política de Seña */}
                    <motion.div
                        {...reveal}
                        className="mb-10 max-w-4xl mx-auto rounded-2xl border border-[#C84214]/50 bg-gradient-to-r from-[#C84214]/15 via-[#181A1D] to-[#121417] p-5 sm:p-6 shadow-[0_0_35px_-10px_rgba(200,66,20,0.3)]"
                    >
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                            <div className="flex items-start gap-3.5">
                                <div className="relative mt-1 shrink-0">
                                    <span className="flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C84214] opacity-75" />
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C84214]" />
                                    </span>
                                </div>
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#FFA380]">
                                            CAPACIDAD LIMITADA · MÁXIMO 3 CLIENTES POR MES
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-[#C84214]/25 border border-[#C84214]/50 text-[#FFA380] font-mono text-[10px] font-bold">
                                            Auditoría directa sin intermediarios
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                                        Para garantizar que el setup de APIs y la auditoría de bases de datos la hagamos nosotros directamente 1 a 1, admitimos un máximo de <strong className="text-white">3 operaciones simultáneas por cohorte</strong>. La seña de <strong className="text-white">$50.000</strong> es a cuenta del total del piloto ($95.000) y es 100% reembolsable si en el diagnóstico previo determinamos que el sistema no se adapta a tu negocio.
                                    </p>
                                </div>
                            </div>
                            <div className="shrink-0 w-full md:w-auto">
                                <a
                                    href="https://wa.me/5491160152435?text=Hola%20Gabriel,%20quiero%20coordinar%20el%20diagn%C3%B3stico%20de%2030%20min%20para%20evaluar%20el%20Piloto%20de%2030%20d%C3%ADas%20de%20INDIVIDRA."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2.5 rounded-xl bg-[#C84214] hover:bg-[#B3390F] text-white font-bold text-xs font-mono transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#C84214]/30 text-center"
                                >
                                    <span>Consultar disponibilidad</span>
                                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {/* Tarjeta Piloto */}
                        <motion.div
                            {...reveal}
                            className="rounded-2xl border border-[#C84214]/50 bg-[#16181B] p-6 sm:p-7 flex flex-col justify-between relative shadow-[0_0_30px_-10px_rgba(200,66,20,0.25)]"
                        >
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[#C84214]/20 text-[#FFA380] border border-[#C84214]/40">
                                        PASO 1 OBLIGATORIO
                                    </span>
                                    <span className="text-xs text-neutral-400 font-mono">30 días</span>
                                </div>
                                <h4 className="text-xl font-bold text-white">Piloto de Medición</h4>
                                <p className="text-xs text-neutral-400 mt-1">Para validar el impacto con números reales de tu tienda.</p>
                                
                                <div className="mt-5 mb-5 pb-5 border-b border-white/10">
                                    <div className="text-3xl font-extrabold text-white font-mono">$95.000 <span className="text-xs text-neutral-400 font-normal">pago único neto</span></div>
                                    <div className="text-xs text-[#FFA380] mt-1">Seña de $50.000 a cuenta para reservar fecha</div>

                                    {/* Cupo Box */}
                                    <div className="mt-3 p-2.5 rounded-lg bg-black/40 border border-[#C84214]/30">
                                        <div className="flex justify-between items-center text-[11px] font-mono mb-1">
                                            <span className="text-neutral-300 font-semibold">Cohorte mensual:</span>
                                            <span className="text-[#FFA380] font-bold">Máximo 3 tiendas</span>
                                        </div>
                                        <div className="text-[10px] text-neutral-400 leading-snug">
                                            Seña 100% reembolsable si el diagnóstico inicial no resulta viable.
                                        </div>
                                    </div>
                                </div>

                                <ul className="space-y-2.5 text-xs text-neutral-300">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#C84214] shrink-0 mt-0.5" />
                                        <span>Onboarding 1 a 1 y auditoría de tu operatoria</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#C84214] shrink-0 mt-0.5" />
                                        <span>Setup de APIs (Mercado Libre, Tiendanube, WhatsApp)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#C84214] shrink-0 mt-0.5" />
                                        <span>Semana 1 (línea base) + Semana 2 (Modo Espejo)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#C84214] shrink-0 mt-0.5" />
                                        <span>Semanas 3 y 4 en activo con informe de balance al día 30</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-6 pt-4 border-t border-white/5 space-y-2">
                                <a
                                    href="#contacto"
                                    className="w-full py-2.5 px-4 rounded-xl bg-[#C84214] hover:bg-[#B3390F] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                >
                                    <span>Agendar diagnóstico previo (30 min)</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </a>
                                <a
                                    href="https://wa.me/5491160152435?text=Hola%20Gabriel,%20quiero%20consultar%20disponibilidad%20para%20el%20Piloto%20de%2030%20d%C3%ADas%20de%20INDIVIDRA."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-2 px-3 rounded-xl border border-[#C84214]/40 bg-[#C84214]/10 hover:bg-[#C84214]/20 text-[#FFA380] hover:text-white font-mono font-medium text-[11px] flex items-center justify-center gap-1.5 transition-colors text-center"
                                >
                                    <span>Consultar por WhatsApp con Gabriel</span>
                                    <ArrowRight className="w-3 h-3" />
                                </a>
                            </div>
                        </motion.div>

                        {/* Plan 1: Escudo de Reputación + Venta Blindada */}
                        <motion.div
                            {...reveal}
                            transition={{ delay: 0.1 }}
                            className="rounded-2xl border border-[#3E3D3A] bg-[#141619] p-6 sm:p-7 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-white/5 text-neutral-300 border border-white/10">
                                        PLAN 1
                                    </span>
                                    <span className="text-xs text-neutral-400 font-mono">Hasta 600 ped./mes</span>
                                </div>
                                <h4 className="text-xl font-bold text-white">Reputación ML + Venta Blindada</h4>
                                <p className="text-xs text-neutral-400 mt-1">Alertas de reclamos y termómetro ML + módulo secundario de cobro y stock.</p>
                                
                                <div className="mt-5 mb-5 pb-5 border-b border-white/10">
                                    <div className="text-3xl font-extrabold text-white font-mono">$115.000 <span className="text-xs text-neutral-400 font-normal">/ mes</span></div>
                                    <div className="text-xs text-neutral-400 mt-1">Excedente: $180 por orden adicional</div>
                                </div>

                                <ul className="space-y-2.5 text-xs text-neutral-300">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#C84214] shrink-0 mt-0.5" />
                                        <span><strong>Foco Principal:</strong> Alerta inmediata apenas entra un reclamo con plazo exacto</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#C84214] shrink-0 mt-0.5" />
                                        <span><strong>Control de Color:</strong> Cálculo en vivo de cuánto te falta para bajar en el termómetro</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#C84214] shrink-0 mt-0.5" />
                                        <span>Expediente de evidencia probatoria (balanza + remito) para responder mediaciones</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#C84214] shrink-0 mt-0.5" />
                                        <span><strong>Módulo Secundario (Venta Blindada):</strong> Validación de comprobantes y baja de stock en 1 clic</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#C84214] shrink-0 mt-0.5" />
                                        <span>Conciliación de liquidaciones MP y exportación CSV para estudio contable</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#C84214] shrink-0 mt-0.5" />
                                        <span>Modo Coexistencia si ya operás con un sincronizador de catálogo</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-neutral-400">
                                        <span className="text-[#FFA380] font-mono text-[10px] mt-0.5 shrink-0">*</span>
                                        <span className="text-[11px]">Costos de Meta WhatsApp Cloud API a cargo del cliente</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-6 pt-4 border-t border-white/5">
                                <span className="text-xs text-neutral-500 font-mono text-center block">Disponible post-piloto de 30 días</span>
                            </div>
                        </motion.div>

                        {/* Plan 2: Operación Total */}
                        <motion.div
                            {...reveal}
                            transition={{ delay: 0.15 }}
                            className="rounded-2xl border border-[#3E3D3A] bg-[#141619] p-6 sm:p-7 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[#FFA380]/10 text-[#FFA380] border border-[#FFA380]/20">
                                        PLAN 2
                                    </span>
                                    <span className="text-xs text-neutral-400 font-mono">Hasta 1.200 ped./mes</span>
                                </div>
                                <h4 className="text-xl font-bold text-white">Operación Total</h4>
                                <p className="text-xs text-neutral-400 mt-1">Venta Blindada + Logística de entrega en canal propio.</p>
                                
                                <div className="mt-5 mb-5 pb-5 border-b border-white/10">
                                    <div className="text-3xl font-extrabold text-white font-mono">$220.000 <span className="text-xs text-neutral-400 font-normal">/ mes</span></div>
                                    <div className="text-xs text-neutral-400 mt-1">Excedente: $180 por orden adicional</div>
                                </div>

                                <ul className="space-y-2.5 text-xs text-neutral-300">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#C84214] shrink-0 mt-0.5" />
                                        <span>Todo lo incluido en el Plan 1 (Venta Blindada + Conciliación)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#C84214] shrink-0 mt-0.5" />
                                        <span>Normalización de direcciones con Google Maps API</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#C84214] shrink-0 mt-0.5" />
                                        <span>Coordinación previa y aviso &quot;a 2 paradas&quot; (solo canal propio con opt-in)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#C84214] shrink-0 mt-0.5" />
                                        <span>Integración con tu transportista o fletero propio y conciliación de remitos</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#C84214] shrink-0 mt-0.5" />
                                        <span>Protocolo de respaldo probatorio de despacho para exención de métricas en ML Flex</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-neutral-400">
                                        <span className="text-[#FFA380] font-mono text-[10px] mt-0.5 shrink-0">*</span>
                                        <span className="text-[11px]">Costos de Meta WhatsApp Cloud API a cargo del cliente</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-6 pt-4 border-t border-white/5">
                                <span className="text-xs text-neutral-500 font-mono text-center block">Disponible post-piloto de 30 días</span>
                            </div>
                        </motion.div>
                    </div>

                    <div className="mt-6 text-center text-xs text-neutral-400 font-mono">
                        ¿Operás como distribuidor mayorista, flota propia grande o necesitás integración ERP?{' '}
                        <a href="#contacto" className="text-[#FFA380] underline hover:text-white">
                            Cotización a medida tras el diagnóstico inicial
                        </a>
                        .
                    </div>
                </div>

                {/* Pilares de honestidad operativa */}
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {pilares.map((p, i) => {
                        const Icon = p.Icon
                        return (
                            <motion.div
                                key={p.eyebrow}
                                {...reveal}
                                transition={{ delay: i * 0.08 }}
                                className={`group relative flex flex-col p-6 lg:p-7 rounded-2xl border ${p.border} bg-[#222120] overflow-hidden transition-transform duration-300 hover:-translate-y-1`}
                            >
                                <div
                                    aria-hidden
                                    className={`pointer-events-none absolute -right-8 -top-8 w-40 h-40 rounded-full blur-3xl ${p.glow}`}
                                />

                                <div className="relative">
                                    <div
                                        className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${p.accent} shadow-lg`}
                                    >
                                        <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                                    </div>

                                    <div
                                        className={`mt-5 text-[11px] uppercase tracking-widest font-semibold ${p.eyebrowColor}`}
                                    >
                                        {p.eyebrow}
                                    </div>
                                    <h3 className="mt-2 text-xl font-bold text-white leading-tight">
                                        {p.title}
                                    </h3>
                                    <p className="mt-3 text-neutral-300 text-sm leading-relaxed">
                                        {p.body}
                                    </p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Honestidad de etapa: cierre transparente */}
                <motion.div
                    {...reveal}
                    transition={{ delay: 0.3 }}
                    className="mt-12 mx-auto max-w-3xl p-6 sm:p-7 rounded-2xl border border-[#3E3D3A] bg-[#1E1D1C] text-center"
                >
                    <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                        <strong className="text-white">
                            No prometemos porcentajes mágicos antes de conocer tus números.
                        </strong>{' '}
                        Prometemos medir tu caso real en la Semana 1, conectarlo sin romper lo que ya funciona, y que si al día 30 los datos no te cierran, te vas sin fricción y con tu base en la mano.
                    </p>
                    <div className="mt-3 text-xs font-mono text-[#FFA380]">
                        — Gabriel Cacabelos, Fundador de INDIVIDRA
                    </div>
                    <div className="mt-5">
                        <a
                            href="#contacto"
                            className="inline-flex items-center gap-2 text-sm font-bold text-[#FFA380] hover:text-white transition-colors cursor-pointer"
                        >
                            <span>Coordinar diagnóstico inicial de 30 minutos</span>
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
