'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Activity,
    Search,
    RotateCw,
    SlidersHorizontal,
    ArrowUpRight,
    ExternalLink,
    ChevronRight,
    Check,
    Clock,
    AlertCircle,
    Database,
    Shield
} from 'lucide-react'

interface LogEntry {
    time: string
    actor: 'CHOFER' | 'AGENTE IA' | 'DESTINATARIO' | 'ERP TANGO'
    actorColor: string
    action: string
}

interface IncidentRecord {
    id: string
    ref: string
    client: string
    zone: string
    carrier: string
    issue: string
    resolution: string
    status: 'RESUELTO' | 'EN CURSO' | 'VALIDADO'
    statusType: 'success' | 'warning' | 'info'
    timestamp: string
    auditLog: LogEntry[]
}

const records: IncidentRecord[] = [
    {
        id: 'rec-01',
        ref: 'REM-8429-T',
        client: 'Distribuidora San Martín S.R.L.',
        zone: 'Morón, Prov. Bs. As.',
        carrier: 'Móvil 03 · Carlos Rossi',
        issue: 'Reja baja / Sin respuesta en portería',
        resolution: 'Reprogramado p/ 16:30 hs vía WhatsApp. Hoja de ruta actualizada.',
        status: 'RESUELTO',
        statusType: 'success',
        timestamp: '11:04 hs',
        auditLog: [
            { time: '11:02:10', actor: 'CHOFER', actorColor: 'text-neutral-400', action: 'Geocerca de destino alcanzada. Reporte: Local cerrado, sin timbre visible.' },
            { time: '11:02:35', actor: 'AGENTE IA', actorColor: 'text-[#C84214]', action: 'Protocolo de rescate en calle activo. Notificación interactiva enviada a M. Rodríguez (Encargado).' },
            { time: '11:03:50', actor: 'DESTINATARIO', actorColor: 'text-neutral-300', action: 'Confirmación de cliente: "Estoy en el banco, regreso 16:15 hs. Por favor pasar 16:30".' },
            { time: '11:04:15', actor: 'ERP TANGO', actorColor: 'text-blue-400', action: 'Hoja de ruta del Móvil 03 reordenada. Segunda pasada agendada. Cero llamada de oficina.' },
        ],
    },
    {
        id: 'rec-02',
        ref: 'ENV-1092-N',
        client: 'Mariano Gastón López',
        zone: 'Quilmes Centro, GBA Sur',
        carrier: 'Móvil 08 · Diego Gutiérrez',
        issue: 'Altura de numeración no visible en arteria',
        resolution: 'Ubicación GPS exacta y referencia de fachada validadas por IA.',
        status: 'VALIDADO',
        statusType: 'info',
        timestamp: '10:54 hs',
        auditLog: [
            { time: '10:51:22', actor: 'CHOFER', actorColor: 'text-neutral-400', action: 'Móvil en calle Garay al 400. Inmuebles sin numeración catastral visible.' },
            { time: '10:52:05', actor: 'AGENTE IA', actorColor: 'text-[#C84214]', action: 'Mensaje directo con pin de Google Maps enviado a teléfono de compra.' },
            { time: '10:53:18', actor: 'DESTINATARIO', actorColor: 'text-neutral-300', action: 'Cliente aporta referencia: "Portón negro con rejas, frente a farmacia".' },
            { time: '10:54:02', actor: 'AGENTE IA', actorColor: 'text-[#C84214]', action: 'Ficha de domicilio creada e indexada para futuros envíos a la dirección.' },
        ],
    },
    {
        id: 'rec-03',
        ref: 'FAC-3310-B',
        client: 'Supermercados El Puente',
        zone: 'San Justo, Depósito Central',
        carrier: 'Móvil 01 · Esteban Morales',
        issue: 'Cola de descarga: 4 camiones en espera',
        resolution: 'Agente de voz gestionó acceso prioritario por Rampa 2.',
        status: 'EN CURSO',
        statusType: 'warning',
        timestamp: '10:48 hs',
        auditLog: [
            { time: '10:44:00', actor: 'CHOFER', actorColor: 'text-neutral-400', action: 'Llegada a playón. Demora estimada por guardia de ingreso: > 120 minutos.' },
            { time: '10:45:15', actor: 'AGENTE IA', actorColor: 'text-[#C84214]', action: 'Llamada automatizada a Jefatura de Recepción informando carga refrigerada prioritaria.' },
            { time: '10:47:30', actor: 'DESTINATARIO', actorColor: 'text-neutral-300', action: 'Recepción autoriza desvío y apertura de Rampa 2 lateral.' },
            { time: '10:48:10', actor: 'AGENTE IA', actorColor: 'text-[#C84214]', action: 'Telemetría enviada a la terminal del chofer con código de autorización #R2-99.' },
        ],
    },
    {
        id: 'rec-04',
        ref: 'REM-9021-T',
        client: 'Ferretería Industrial Avellaneda',
        zone: 'Avellaneda, Parque Industrial',
        carrier: 'Móvil 05 · Pablo Kowalski',
        issue: 'Conformidad de remito físico por triplicado',
        resolution: 'OCR de remito procesado e impactado en ERP, sin carga manual.',
        status: 'RESUELTO',
        statusType: 'success',
        timestamp: '10:32 hs',
        auditLog: [
            { time: '10:30:12', actor: 'CHOFER', actorColor: 'text-neutral-400', action: 'Carga de 14 bultos entregada. Captura fotográfica de remito remitida por app.' },
            { time: '10:31:02', actor: 'AGENTE IA', actorColor: 'text-[#C84214]', action: 'Motor de visión OCR extrae: N° 9021, 14 bultos conformes, firma R. Fernández.' },
            { time: '10:31:45', actor: 'ERP TANGO', actorColor: 'text-blue-400', action: 'Comprobante indexado. Asiento contable de remito conformado emitido.' },
        ],
    },
]

export function LogisticsDashboardDemo() {
    const [activeTab, setActiveTab] = useState<'all' | 'issues' | 'resolved'>('all')
    const [selectedId, setSelectedId] = useState<string>('rec-01')
    const [searchQuery, setSearchQuery] = useState('')

    const selectedRecord = records.find((r) => r.id === selectedId) || records[0]

    const filtered = records.filter((r) => {
        if (activeTab === 'issues' && r.status === 'RESUELTO') return false
        if (activeTab === 'resolved' && r.status !== 'RESUELTO') return false
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            return r.ref.toLowerCase().includes(q) || r.client.toLowerCase().includes(q) || r.zone.toLowerCase().includes(q)
        }
        return true
    })

    return (
        <section id="demo-en-vivo" className="relative py-24 bg-[#0A0B0D] border-t border-white/[0.06] text-neutral-200">
            {/* Ambient subtle lighting */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-gradient-to-b from-[#C84214]/[0.06] to-transparent blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header: Rigor Corporativo Minimalista */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <div className="flex items-center gap-2 font-mono text-xs text-neutral-400 uppercase tracking-wider mb-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Centro de Control de Operaciones // En Vivo</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white">
                            Supervisión de Entregas en Tiempo Real
                        </h2>
                        <p className="text-neutral-400 text-sm mt-1 max-w-2xl">
                            Resolución autónoma de excepciones en calle, validación de remitos e integración con ERPs contables sin llamadas de oficina.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 self-start md:self-auto">
                        <div className="px-3 py-1.5 rounded-md border border-white/[0.08] bg-[#121417] text-xs font-mono text-neutral-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            <span>ERP Sync: Tango Activo</span>
                        </div>
                    </div>
                </div>

                {/* Telemetría Strip: Monocromático, Números Tabulares, 0 IA Slop */}
                <div className="grid grid-cols-2 lg:grid-cols-4 rounded-xl border border-white/[0.08] bg-[#101216] divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06] mb-6 font-mono">
                    <div className="p-4 sm:p-5">
                        <div className="text-[11px] uppercase tracking-wider text-neutral-400">Total Envíos en Hoja de Ruta</div>
                        <div className="text-2xl sm:text-3xl font-semibold text-white mt-1 tabular-nums">84</div>
                        <div className="text-[11px] text-neutral-400 mt-1">4 flotas en calle activas</div>
                    </div>
                    <div className="p-4 sm:p-5">
                        <div className="text-[11px] uppercase tracking-wider text-neutral-400">Conformidad de Entrega</div>
                        <div className="text-2xl sm:text-3xl font-semibold text-emerald-400 mt-1 tabular-nums">92.8%</div>
                        <div className="text-[11px] text-neutral-400 mt-1">78 remitos cerrados hoy</div>
                    </div>
                    <div className="p-4 sm:p-5">
                        <div className="text-[11px] uppercase tracking-wider text-neutral-400">Incidencias Resueltas por IA</div>
                        <div className="text-2xl sm:text-3xl font-semibold text-white mt-1 tabular-nums">100%</div>
                        <div className="text-[11px] text-neutral-400 mt-1">4 de 4 sin llamada manual</div>
                    </div>
                    <div className="p-4 sm:p-5">
                        <div className="text-[11px] uppercase tracking-wider text-neutral-400">Tiempo Medio de Rescate</div>
                        <div className="text-2xl sm:text-3xl font-semibold text-[#C84214] mt-1 tabular-nums">1.8 min</div>
                        <div className="text-[11px] text-neutral-400 mt-1">Contacto y reprogramación</div>
                    </div>
                </div>

                {/* Main Console Frame */}
                <div className="rounded-xl border border-white/[0.08] bg-[#0E1013] overflow-hidden shadow-2xl">
                    {/* Console Controls Bar */}
                    <div className="p-3 sm:p-4 bg-[#131518] border-b border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
                        {/* Segmented Control */}
                        <div className="flex items-center p-1 rounded-lg bg-[#0A0B0D] border border-white/[0.08] text-xs font-mono w-full sm:w-auto">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                                    activeTab === 'all'
                                        ? 'bg-[#1C1F24] text-white font-medium shadow-xs'
                                        : 'text-neutral-400 hover:text-neutral-200'
                                }`}
                            >
                                Todas las Órdenes (4)
                            </button>
                            <button
                                onClick={() => setActiveTab('issues')}
                                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                                    activeTab === 'issues'
                                        ? 'bg-[#1C1F24] text-white font-medium shadow-xs'
                                        : 'text-neutral-400 hover:text-neutral-200'
                                }`}
                            >
                                En Gestión (2)
                            </button>
                            <button
                                onClick={() => setActiveTab('resolved')}
                                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                                    activeTab === 'resolved'
                                        ? 'bg-[#1C1F24] text-white font-medium shadow-xs'
                                        : 'text-neutral-400 hover:text-neutral-200'
                                }`}
                            >
                                Resueltas (2)
                            </button>
                        </div>

                        {/* Search */}
                        <div className="relative w-full sm:w-72">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Filtrar por remito, cliente o zona..."
                                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0A0B0D] border border-white/[0.08] text-xs text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 font-mono"
                            />
                        </div>
                    </div>

                    {/* Data Grid */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-white/[0.06] bg-[#111316] font-mono text-[11px] text-neutral-400 uppercase tracking-wider">
                                    <th className="py-2.5 px-4 font-medium">Remito</th>
                                    <th className="py-2.5 px-4 font-medium">Destinatario</th>
                                    <th className="py-2.5 px-4 font-medium">Zona / Chofer</th>
                                    <th className="py-2.5 px-4 font-medium">Excepción en Calle</th>
                                    <th className="py-2.5 px-4 font-medium">Resolución del Sistema</th>
                                    <th className="py-2.5 px-4 font-medium text-right">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {filtered.map((item) => {
                                    const isSelected = item.id === selectedId
                                    return (
                                        <tr
                                            key={item.id}
                                            onClick={() => setSelectedId(item.id)}
                                            className={`cursor-pointer transition-colors duration-150 ${
                                                isSelected
                                                    ? 'bg-[#181B20] text-white border-l-2 border-l-[#C84214]'
                                                    : 'hover:bg-white/[0.02] text-neutral-300'
                                            }`}
                                        >
                                            <td className="py-3 px-4 font-mono font-medium text-white whitespace-nowrap">
                                                {item.ref}
                                            </td>
                                            <td className="py-3 px-4 font-medium">
                                                {item.client}
                                            </td>
                                            <td className="py-3 px-4 text-neutral-400 whitespace-nowrap font-mono text-[11px]">
                                                {item.zone}
                                            </td>
                                            <td className="py-3 px-4 text-neutral-300">
                                                {item.issue}
                                            </td>
                                            <td className="py-3 px-4 text-neutral-300 max-w-xs truncate font-mono text-[11px]">
                                                {item.resolution}
                                            </td>
                                            <td className="py-3 px-4 text-right whitespace-nowrap font-mono">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium border ${
                                                    item.statusType === 'success'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                                                        : item.statusType === 'warning'
                                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                                                        : 'bg-blue-500/10 text-blue-400 border-blue-500/25'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        item.statusType === 'success' ? 'bg-emerald-400' : item.statusType === 'warning' ? 'bg-amber-400' : 'bg-blue-400'
                                                    }`} />
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Audit Trail Inspector Box (Linear/Vercel Log Inspection) */}
                    <div className="p-4 sm:p-5 bg-[#0C0D10] border-t border-white/[0.06]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-white/[0.06] gap-2">
                            <div className="flex items-center gap-2 text-xs font-mono">
                                <span className="text-neutral-400">TRAZA DE AUDITORÍA:</span>
                                <span className="font-semibold text-white">{selectedRecord.ref}</span>
                                <span className="text-neutral-400">·</span>
                                <span className="text-neutral-300">{selectedRecord.client}</span>
                            </div>
                            <span className="text-[11px] font-mono text-neutral-400">
                                Asignado a: {selectedRecord.carrier}
                            </span>
                        </div>

                        {/* Sequenced Log Events */}
                        <div className="space-y-2 font-mono text-xs">
                            {selectedRecord.auditLog.map((log, idx) => (
                                <div key={idx} className="flex items-start gap-3 py-1">
                                    <span className="text-neutral-400 shrink-0 text-[11px] pt-0.5">{log.time}</span>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] shrink-0 ${log.actorColor}`}>
                                        {log.actor}
                                    </span>
                                    <span className="text-neutral-300 leading-relaxed text-[11px]">{log.action}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Strip */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between px-5 py-4 rounded-xl border border-white/[0.06] bg-[#101215] text-xs gap-4">
                    <div className="flex items-center gap-3 text-neutral-400">
                        <Database className="w-4 h-4 text-neutral-400" />
                        <span>Arquitectura aislada por cliente con PostgreSQL y RLS. Tus datos de logística nunca se mezclan.</span>
                    </div>

                    <a
                        href="https://wa.me/5491160152435?text=%C2%A1Hola%20Individra!%20Quiero%20conectar%20este%20panel%20de%20control%20con%20mi%20operaci%C3%B3n."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-white font-medium transition-colors border border-white/[0.1] whitespace-nowrap inline-flex items-center gap-2 cursor-pointer"
                    >
                        <span>Conectar con mi ERP</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                </div>
            </div>
        </section>
    )
}
