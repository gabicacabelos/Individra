'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
    CheckCircle2,
    ShieldCheck,
    ArrowRight,
    ArrowDown,
    Sparkles,
    RotateCcw,
    AlertTriangle,
    Clock,
    XCircle,
    ChevronRight,
    FileSpreadsheet,
    Scale,
    TrendingDown,
    DollarSign,
} from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'

/* =========================================================================
   PARTE 1: CASOS OPERATIVOS (NÚCLEO PRINCIPAL VALIDADO + MÓDULOS SECUNDARIOS)
   ========================================================================= */
const pains = [
    {
        id: 'reclamos-termometro',
        image: '/3d/icono-reloj-vto.png',
        badge: 'CASO 01 · FOCO PRINCIPAL · RECLAMOS Y TERMÓMETRO ML',
        badgeColor: 'text-[#FFA380] border-[#FF5520]/40 bg-[#FF5520]/10',
        cardBorder: 'border-[#FF5520]/40 hover:border-[#FF5520] shadow-[0_0_35px_-10px_rgba(255,85,32,0.25)]',
        glowColor: 'from-[#FF5520]/25 via-[#FF5520]/10 to-transparent',
        containerClass: 'card-hero-glow sheen-top bg-gradient-to-br from-[#19100D] via-[#131114] to-[#0B0D10]',
        telemetryTag: 'ALERTA INMEDIATA · PLAZO EXACTO + MARGEN DE COLOR',
        statusPulse: 'bg-[#FF5520]',
        contextLabel: 'Núcleo Principal Validado: Alertas de reclamos con plazo exacto y monitoreo en vivo de cuántas operaciones te separan de bajar de color en Mercado Libre.',
        title: 'Reclamos tapados entre notificaciones y falta de visibilidad sobre cuánto te falta para bajar de color',
        text: 'Cuando operás con volumen diario, el aviso de un reclamo o mediación abierta queda enterrado entre decenas de notificaciones de ventas y preguntas. Si vence el plazo sin respuesta fundada —o sumás una cancelación de más sin advertir el umbral—, el termómetro cae de verde a amarillo.',
        impactLabel: 'Riesgo operativo',
        impactValue: 'Mediación cerrada a favor del comprador por plazo vencido, caída de color en el termómetro y pérdida de exposición orgánica en listados.',
        solutionHighlight: 'Te avisa por WhatsApp apenas entra un reclamo con el plazo exacto de vencimiento, te dice cuántos reclamos o cancelaciones te faltan para bajar de color y prepara el expediente probatorio en 1 clic.',
    },
    {
        id: 'venta-blindada-secundario',
        image: '/3d/ecommerce/pago-check.webp',
        badge: 'CASO 02 · MÓDULO SECUNDARIO · VENTA BLINDADA',
        badgeColor: 'text-amber-300 border-amber-500/40 bg-amber-500/10',
        cardBorder: 'border-amber-500/35 hover:border-amber-400 shadow-[0_0_35px_-10px_rgba(245,158,11,0.2)]',
        glowColor: 'from-amber-500/20 via-amber-500/5 to-transparent',
        containerClass: 'card-obsidian sheen-top bg-gradient-to-br from-[#17140B] via-[#141314] to-[#0A0D10]',
        telemetryTag: 'MÓDULO COMPLEMENTARIO · STOCK 1-CLIC',
        statusPulse: 'bg-amber-400',
        contextLabel: 'Módulo Secundario (Venta Blindada): Para tiendas que también cierran ventas por WhatsApp con transferencia y necesitan descontar stock sin demoras.',
        title: 'El desfase entre el cobro por transferencia en WhatsApp y la baja de stock en Mercado Libre',
        text: 'Vender por WhatsApp ahorra comisiones de plataforma, pero mientras el equipo verifica la acreditación en cuenta y entra manualmente a descontar la unidad, puede ingresar una compra en Mercado Libre por ese mismo último producto.',
        impactLabel: 'Impacto en el termómetro',
        impactValue: 'Cancelación forzada en Mercado Libre por falta de stock que consume el margen de tu reputación.',
        solutionHighlight: 'Con 1 clic tras cotejar la acreditación en tu cuenta: extrae CUIT y operación por OCR para evitar comprobantes duplicados y descuenta o pausa la publicación en ML y Tiendanube al instante.',
    },
    {
        id: 'reservas-bloqueadas',
        image: '/3d/ecommerce/caja-cronometro.webp',
        badge: 'CASO 03 · MÓDULO SECUNDARIO · CONTROL DE RESERVAS',
        badgeColor: 'text-sky-300 border-sky-500/40 bg-sky-500/10',
        cardBorder: 'border-sky-500/35 hover:border-sky-400 shadow-[0_0_35px_-10px_rgba(14,165,233,0.2)]',
        glowColor: 'from-sky-500/20 via-sky-500/5 to-transparent',
        containerClass: 'card-obsidian sheen-top bg-gradient-to-br from-[#0A131A] via-[#0F1318] to-[#090D10]',
        telemetryTag: 'FRENO DE SEGURIDAD · AUTO-RELEASE 15m',
        statusPulse: 'bg-sky-400',
        contextLabel: 'Escenario Operativo Complementario: Gestión de reservas temporales de última unidad solicitadas por chat.',
        title: 'Pedidos de alias sin transferir que inmovilizan la última unidad disponible',
        text: 'En momentos de alta demanda entran consultas que piden el alias para transferir y demoran horas en enviar el comprobante. Si separás la mercadería sin límite de tiempo, frenás ventas inmediatas en Mercado Libre o Tiendanube.',
        impactLabel: 'Costo de oportunidad',
        impactValue: 'Mercadería bloqueada en depósito sin cobro confirmado y pérdida de compradores activos en otros canales.',
        solutionHighlight: 'Reserva temporal de 15 minutos: el stock solo se confirma tras el clic del operador al ver el impacto en cuenta. Si no envían comprobante en 15m, la unidad vuelve a estar disponible.',
    },
    {
        id: 'caos-liquidaciones',
        image: '/3d/ecommerce/monitor-oferta.webp',
        badge: 'CASO 04 · MÓDULO SECUNDARIO · LIQUIDACIONES',
        badgeColor: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10',
        cardBorder: 'border-emerald-500/35 hover:border-emerald-400 shadow-[0_0_35px_-10px_rgba(16,185,129,0.2)]',
        glowColor: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
        containerClass: 'card-emerald sheen-top bg-gradient-to-br from-[#081812] via-[#0C1513] to-[#090D10]',
        telemetryTag: 'CRUCE SQL DETERMINÍSTICO · EXPORT CSV',
        statusPulse: 'bg-emerald-400',
        contextLabel: 'Escenario Operativo Complementario: Visibilidad de costos de plataforma y percepciones por orden.',
        title: 'Cruce entre venta bruta, comisiones, costo de envíos y retenciones en Mercado Pago',
        text: 'Cada liquidación combina comisiones variables por categoría, cargos de envíos y retenciones impositivas (IIBB, IVA, Ganancias). Cruzar a mano cuánto quedó limpio por producto demanda horas de planillas administrativas.',
        impactLabel: 'Fricción administrativa',
        impactValue: 'Tiempo operativo invertido en conciliar liquidaciones lote por lote y demoras en el armado de reportes para el contador.',
        solutionHighlight: 'Conciliación determinística: cruza venta bruta contra retenciones y comisiones reales de cada orden y exporta un archivo CSV normalizado para tu estudio contable.',
    },
]

/* =========================================================================
   PARTE 2: LA CONSOLA DE TRIAGE (4 ESCENARIOS OPERATIVOS SIMULADOS)
   ========================================================================= */
interface FinancialBreakdown {
    gross: string
    mlFee: string
    flexCost: string
    iibbRet: string
    ivaGanRet: string
    netPayout: string
    netMargin: string
    marginAmount: string
}

interface EvidenceDetails {
    dossierId: string
    countdown: string
    buyerClaim: string
    packagingWeight: string
    returnedWeight: string
    weightDiff: string
    gpsStatus: string
    dispatchProof: string
}

interface ScenarioData {
    id: string
    categoryPill: string
    categoryPillColor: string
    tabNumber: string
    tabTitle: string
    tabSub: string
    priorityLabel: string
    priorityBadgeClass: string
    timeAgo: string
    render3d: {
        src: string
        alt: string
        width: number
        height: number
    }
    receipt: {
        bankName: string
        bankPillClass: string
        amount: string
        sku: string
        operationId: string
        cuit: string
        ocrSummary: string
    }
    financialBreakdown?: FinancialBreakdown
    evidenceDetails?: EvidenceDetails
    channels: {
        ml: {
            title: string
            statusBefore: string
            statusAfter: string
            badgeBefore: string
            badgeAfter: string
        }
        tn: {
            title: string
            statusBefore: string
            statusAfter: string
            badgeBefore: string
            badgeAfter: string
        }
        wa: {
            title: string
            statusBefore: string
            statusAfter: string
            badgeBefore: string
            badgeAfter: string
        }
    }
    primaryActionLabel: string
    secondaryActionLabel: string
    executionDuration: string
    successMessage: string
    pipelineSteps: {
        stepNumber: string
        channelName: string
        channelLogo?: string
        actionName: string
        detail: string
        doneBadge: string
    }[]
}

const SCENARIOS: ScenarioData[] = [
    {
        id: 'reclamo-reputacion',
        categoryPill: 'FOCO PRINCIPAL',
        categoryPillColor: 'text-[#FFA380] border-[#FF5520]/40 bg-[#FF5520]/15',
        tabNumber: '01',
        tabTitle: 'Reclamo + Termómetro ML',
        tabSub: 'Plazo exacto y margen antes de bajar de color',
        priorityLabel: 'FOCO PRINCIPAL · ALERTA DE RECLAMO CON PLAZO EXACTO Y MARGEN DE COLOR',
        priorityBadgeClass: 'bg-[#FF5520]/15 text-[#FFA380] border-[#FF5520]/40',
        timeAgo: 'Recién ingresado',
        render3d: {
            src: '/3d/ecommerce/caja-abierta.webp',
            alt: 'Monitoreo de reclamo, plazo exacto y termómetro de reputación',
            width: 459,
            height: 512,
        },
        receipt: {
            bankName: 'MERCADO LIBRE RECLAMOS · ALERTA TEMPRANA',
            bankPillClass: 'bg-[#FF5520]/20 text-[#FFA380] border-[#FF5520]/30',
            amount: '$142.000,00',
            sku: 'Borcego Cuero Vacuno Talle 42 · Marrón',
            operationId: 'RECLAMO ML #REC-9410',
            cuit: 'Orden vinculada: #200000849102',
            ocrSummary: 'Reclamos 60 días: 5 de 400 ventas (1,25%) · Te queda 1 reclamo antes de salir de verde (límite en Argentina: 1,5%)',
        },
        evidenceDetails: {
            dossierId: 'EXP-9410-REPUTACION',
            countdown: 'Plazo exacto activo: Quedan 3h 20m para responder antes del cierre',
            buyerClaim: 'Disputa abierta por diferencia en recepción',
            packagingWeight: '1.420 gramos (Registro de empaque en mesa)',
            returnedWeight: '180 gramos (Control de devolución)',
            weightDiff: 'Margen de cuenta: 1 reclamo más y salís de verde',
            gpsStatus: 'Remito de despacho y trazabilidad asociados',
            dispatchProof: 'Evidencia de empaque con código de barras y hora verificada',
        },
        channels: {
            ml: {
                title: 'Termómetro & Mediación Mercado Libre',
                statusBefore: 'Reclamo abierto con reloj corriendo · 1 reclamo más y salís de verde',
                statusAfter: 'Descargo con evidencia listo en portapapeles · Plazo controlado a tiempo',
                badgeBefore: '⚠️ Plazo corriendo',
                badgeAfter: '✓ Termómetro protegido',
            },
            tn: {
                title: 'Mesa de Empaque & Registro Probatorio',
                statusBefore: 'Foto de balanza y remito guardados por separado',
                statusAfter: 'Expediente compilado por número de orden en 1 clic',
                badgeBefore: 'Sin consolidar',
                badgeAfter: '✓ Dossier armado',
            },
            wa: {
                title: 'Alerta Directa al Responsable',
                statusBefore: 'Aviso enterrado entre decenas de notificaciones de la app',
                statusAfter: 'Alerta crítica enviada con plazo exacto y margen de color actual',
                badgeBefore: 'Riesgo de olvido',
                badgeAfter: '✓ Notificado al instante',
            },
        },
        primaryActionLabel: 'Ver Plazo Exacto y Copiar Descargo con Evidencia para ML (1 Clic)',
        secondaryActionLabel: 'Ver Estado del Termómetro',
        executionDuration: '1.1s',
        successMessage: '¡Alerta atendida a tiempo! Descargo formal con registro de peso (1.420g) y remito copiado al portapapeles antes del vencimiento del plazo, cuidando tu margen para no bajar de color.',
        pipelineSteps: [
            {
                stepNumber: '01',
                channelName: 'Webhook Mercado Libre',
                channelLogo: '/logos/mercadolibre-isotipo.svg',
                actionName: 'Detección Instantánea + Plazo Exacto',
                detail: 'Te avisa por WhatsApp apenas entra el reclamo e inicia la cuenta regresiva del plazo real de respuesta.',
                doneBadge: 'Plazo medido',
            },
            {
                stepNumber: '02',
                channelName: 'Monitor de Reputación',
                actionName: 'Cálculo de Margen de Color',
                detail: 'Calcula por separado cuántos reclamos, cancelaciones y demoras te quedan antes de salir de verde, con los límites de Mercado Libre Argentina.',
                doneBadge: 'Margen calculado',
            },
            {
                stepNumber: '03',
                channelName: 'Expediente de Empaque',
                actionName: 'Cruce de Peso y Remito',
                detail: 'Reúne la foto de pesaje en mesa y el comprobante de despacho asociados al número de venta.',
                doneBadge: 'Evidencia lista',
            },
            {
                stepNumber: '04',
                channelName: 'Respuesta Supervisada',
                actionName: 'Copia en 1 Clic para Operador',
                detail: 'Deja el descargo técnico listo en el portapapeles para que el operador lo presente en ML a tiempo.',
                doneBadge: 'Listo en clipboard',
            },
        ],
    },
    {
        id: 'venta-blindada',
        categoryPill: 'MÓDULO SECUNDARIO',
        categoryPillColor: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
        tabNumber: '02',
        tabTitle: 'Venta Blindada (Stock 1-Clic)',
        tabSub: 'Cobro por transferencia + baja de stock',
        priorityLabel: 'MÓDULO SECUNDARIO · VENTA BLINDADA (COBRO WA + STOCK ML/TN)',
        priorityBadgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        timeAgo: 'Escenario simulado',
        render3d: {
            src: '/3d/ecommerce/pago-check.webp',
            alt: 'Pago verificado y comprobante validado',
            width: 512,
            height: 501,
        },
        receipt: {
            bankName: 'TRANSFERENCIA ENTRANTE · ESCENARIO SIMULADO',
            bankPillClass: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
            amount: '$185.000,00',
            sku: 'Camperón Urbano Térmico Talle L · Negro',
            operationId: 'OP #8849201',
            cuit: 'CUIT 20-34982144-8',
            ocrSummary: 'OCR: CUIT y Nº operación extraídos (0 duplicados en 90d) · Pendiente confirmación en cuenta',
        },
        channels: {
            ml: {
                title: 'Mercado Libre',
                statusBefore: 'Stock restante: 1 sola unidad en catálogo',
                statusAfter: 'Stock: 0 unidades (Publicación pausada)',
                badgeBefore: '⚠️ Peligro de sobreventa',
                badgeAfter: '✓ Blindado en ML',
            },
            tn: {
                title: 'Tiendanube',
                statusBefore: 'Orden #4109 pendiente de cobro',
                statusAfter: 'Orden #4109 Pagada con comprobante adjunto',
                badgeBefore: 'Esperando pago',
                badgeAfter: '✓ Pagada y lista',
            },
            wa: {
                title: 'WhatsApp',
                statusBefore: 'Cliente envió comprobante en PDF',
                statusAfter: 'Confirmación oficial enviada al cliente',
                badgeBefore: 'Mensaje sin procesar',
                badgeAfter: '✓ Notificado con resumen',
            },
        },
        primaryActionLabel: 'Aprobar Pago y Blindar Stock en ML + TN (1 Clic)',
        secondaryActionLabel: 'Rechazar Comprobante',
        executionDuration: '1.2s',
        successMessage: '¡Circuito blindado con éxito en 1.2s! Publicación pausada en ML y orden marcada pagada en Tiendanube sin tocar un Excel.',
        pipelineSteps: [
            {
                stepNumber: '01',
                channelName: 'OCR & Prevención de Duplicados',
                actionName: 'Comprobante Auditado',
                detail: 'ID #8849201 verificado único en historial. El operador aprueba en 1 clic tras cotejar la acreditación real en cuenta.',
                doneBadge: 'Cotejado',
            },
            {
                stepNumber: '02',
                channelName: 'Mercado Libre API',
                channelLogo: '/logos/mercadolibre-isotipo.svg',
                actionName: 'Stock Descontado / Pausado',
                detail: 'Evita bajas duplicadas con sincronizadores existentes o baja directo.',
                doneBadge: 'Stock blindado',
            },
            {
                stepNumber: '03',
                channelName: 'Tiendanube API',
                channelLogo: '/logos/tiendanube.png',
                actionName: 'Orden #4109 Pagada',
                detail: 'Lista para empaque en depósito sin tipear planillas ni saltar pestañas.',
                doneBadge: 'Orden pagada',
            },
            {
                stepNumber: '04',
                channelName: 'WhatsApp Cloud API',
                channelLogo: '/logos/whatsapp.svg',
                actionName: 'Confirmación con Resumen de Compra',
                detail: 'El cliente recibe el resumen oficial en segundos sin tipeo manual del operador.',
                doneBadge: 'Enviado',
            },
        ],
    },
    {
        id: 'reserva-vencida',
        categoryPill: 'MÓDULO SECUNDARIO',
        categoryPillColor: 'text-sky-300 border-sky-500/30 bg-sky-500/10',
        tabNumber: '03',
        tabTitle: 'Reserva Temporal (15m)',
        tabSub: 'Liberación automática de stock',
        priorityLabel: 'MÓDULO SECUNDARIO · STOCK INMOVILIZADO CON DEMANDA ACTIVA',
        priorityBadgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
        timeAgo: 'Escenario simulado',
        render3d: {
            src: '/3d/ecommerce/caja-cronometro.webp',
            alt: 'Paquete con cronómetro de vencimiento de reserva',
            width: 512,
            height: 446,
        },
        receipt: {
            bankName: 'RESERVA TEMPORAL · ALIAS PEDIDO EN WA',
            bankPillClass: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
            amount: '$142.000,00',
            sku: 'Borcego Cuero Talle 38 · Suela',
            operationId: 'RES #20419',
            cuit: 'WhatsApp +54 9 11 4821-XXXX',
            ocrSummary: 'Pidió CBU hace 45m; aún no envió comprobante de transferencia.',
        },
        channels: {
            ml: {
                title: 'Mercado Libre',
                statusBefore: '3 consultas activas preguntando si hay stock disponible',
                statusAfter: 'Stock re-publicado para compradores activos',
                badgeBefore: '3 consultas esperando',
                badgeAfter: '✓ Venta recuperada en ML',
            },
            tn: {
                title: 'Tiendanube',
                statusBefore: 'Unidad reservada provisoriamente sin pagar',
                statusAfter: 'Reserva cancelada limpiamente sin penalización',
                badgeBefore: 'Stock retenido',
                badgeAfter: '✓ Catálogo liberado',
            },
            wa: {
                title: 'WhatsApp',
                statusBefore: 'Sin respuesta del cliente tras pedir CBU',
                statusAfter: 'Mensaje amable de vencimiento (15 min) enviado',
                badgeBefore: 'Silencio hace 45m',
                badgeAfter: '✓ Timer activado',
            },
        },
        primaryActionLabel: 'Reclamar Comprobante (15 min) o Liberar Stock a ML',
        secondaryActionLabel: 'Liberar Stock a ML Ahora',
        executionDuration: '0.8s',
        successMessage: '¡Regla de protección activada! Recordatorio enviado por WhatsApp con cuenta regresiva. Si en 15m no ingresa comprobante, la unidad vuelve automáticamente a ML.',
        pipelineSteps: [
            {
                stepNumber: '01',
                channelName: 'WhatsApp Oficial',
                channelLogo: '/logos/whatsapp.svg',
                actionName: 'Recordatorio Amable con Timer',
                detail: 'Le avisa al comprador que su reserva vence en 15 minutos exactos.',
                doneBadge: 'Timer iniciado',
            },
            {
                stepNumber: '02',
                channelName: 'Motor de Reserva',
                actionName: 'Cronómetro Programado',
                detail: 'Si no entra comprobante verificado en 15m, el sistema ejecuta la liberación.',
                doneBadge: 'Regla activa',
            },
            {
                stepNumber: '03',
                channelName: 'Mercado Libre API',
                channelLogo: '/logos/mercadolibre-isotipo.svg',
                actionName: 'Stock Restaurado a Mercado Libre',
                detail: 'La unidad vuelve a estar disponible para los compradores que consultaron.',
                doneBadge: 'ML habilitado',
            },
            {
                stepNumber: '04',
                channelName: 'Depósito & Mesa',
                actionName: 'Alerta a Operadores',
                detail: 'El personal de depósito no aparta mercadería que no fue pagada.',
                doneBadge: 'Depósito libre',
            },
        ],
    },
    {
        id: 'conciliacion-liquidaciones',
        categoryPill: 'MÓDULO SECUNDARIO',
        categoryPillColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
        tabNumber: '04',
        tabTitle: 'Conciliación $450k',
        tabSub: 'Cruce de retenciones y neto',
        priorityLabel: 'MÓDULO SECUNDARIO · CRUCE DE RETENCIONES Y MARGEN POR ORDEN',
        priorityBadgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        timeAgo: 'Escenario simulado',
        render3d: {
            src: '/3d/ecommerce/monitor-oferta.webp',
            alt: 'Auditoría de liquidación multicanal',
            width: 512,
            height: 480,
        },
        receipt: {
            bankName: 'MERCADO LIBRE + MERCADO PAGO · LIQUIDACIÓN SIMULADA',
            bankPillClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
            amount: '$450.000,00',
            sku: 'Lote 3 Camperas Térmicas · Venta ML #784920',
            operationId: 'LIQ-MP #992814',
            cuit: 'Cuenta MP Vinculada: 30-71649281-4',
            ocrSummary: 'Cruce SQL Determinístico: Venta Bruta vs Retenciones e Impuestos',
        },
        financialBreakdown: {
            gross: '$450.000,00',
            mlFee: '-$72.000,00',
            flexCost: '-$15.480,00',
            iibbRet: '-$15.750,00',
            ivaGanRet: '-$28.350,00',
            netPayout: '$318.420,00',
            netMargin: '16.02%',
            marginAmount: '$72.100,00',
        },
        channels: {
            ml: {
                title: 'Mercado Pago Liquidaciones',
                statusBefore: 'Liquidación en lote sin discriminar retenciones',
                statusAfter: 'Cruzada al centavo: IIBB, IVA y Ganancias identificadas',
                badgeBefore: 'Cálculo a ciegas',
                badgeAfter: '✓ Conciliado 100%',
            },
            tn: {
                title: 'Estudio Contable (CSV Export)',
                statusBefore: 'Planilla pendiente de envío al contador',
                statusAfter: 'Archivo CSV normalizado listo para exportar',
                badgeBefore: 'Pendiente exportar',
                badgeAfter: '✓ CSV generado',
            },
            wa: {
                title: 'Control de Margen por SKU',
                statusBefore: 'Margen neto real sin desglosar',
                statusAfter: 'Margen neto calculado en 16.02% ($72.100 neto)',
                badgeBefore: 'Rentabilidad difusa',
                badgeAfter: '✓ Margen visible',
            },
        },
        primaryActionLabel: 'Conciliar Liquidación y Exportar Archivo para Contador (1 Clic)',
        secondaryActionLabel: 'Ver Detalle de Percepciones',
        executionDuration: '0.9s',
        successMessage: '¡Liquidación conciliada al centavo en 0.9s! Archivo CSV normalizado generado para tu contador con discriminación exacta de IIBB, IVA y comisiones.',
        pipelineSteps: [
            {
                stepNumber: '01',
                channelName: 'API Mercado Pago',
                channelLogo: '/logos/mercadolibre-isotipo.svg',
                actionName: 'Extracción de Liquidación',
                detail: 'Obtiene las comisiones exactas, retenciones de IIBB y cargos financieros del lote.',
                doneBadge: 'Lote extraído',
            },
            {
                stepNumber: '02',
                channelName: 'Motor Determinístico SQL',
                actionName: 'Cruce de Alícuotas Reales',
                detail: 'Calcula el margen neto real por SKU sin inventar fórmulas ni tocar ARCA.',
                doneBadge: 'Neto calculado',
            },
            {
                stepNumber: '03',
                channelName: 'Normalizador Contable',
                actionName: 'Generación de Archivo Limpio',
                detail: 'Exporta las percepciones ordenadas en formato estándar para tu estudio contable.',
                doneBadge: 'CSV generado',
            },
            {
                stepNumber: '04',
                channelName: 'Panel de Rentabilidad',
                actionName: 'Actualización de Margen Real',
                detail: 'Registra en tu panel qué productos realmente dejan plata tras los costos de venta.',
                doneBadge: 'Margen auditado',
            },
        ],
    },
]

export function PainSolutionSection() {
    const isMobile = useIsMobile()
    const [activeScenarioId, setActiveScenarioId] = useState<string>('reclamo-reputacion')
    const [executedMap, setExecutedMap] = useState<Record<string, boolean>>({})
    const [stockStrategy, setStockStrategy] = useState<'extender' | 'pausar'>('pausar')

    const activeScenario =
        SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0]
    const isCurrentExecuted = !!executedMap[activeScenario.id]

    const isVentaBlindada = activeScenario.id === 'venta-blindada'

    const mlStatusAfter = isVentaBlindada
        ? stockStrategy === 'extender'
            ? 'Stock: Plazo extendido (+3 días). Publicación activa en ML sin perder inercia.'
            : 'Stock: 0 unidades (Publicación pausada preventivamente)'
        : activeScenario.channels.ml.statusAfter

    const mlBadgeAfter = isVentaBlindada
        ? stockStrategy === 'extender'
            ? '✓ Posicionamiento blindado'
            : '✓ Pausada en ML'
        : activeScenario.channels.ml.badgeAfter

    const primaryActionLabel = isVentaBlindada
        ? stockStrategy === 'extender'
            ? 'Aprobar Pago y Extender Plazo en ML (+3 días)'
            : 'Aprobar Pago y Pausar Publicación en ML'
        : activeScenario.primaryActionLabel

    const successMessage = isVentaBlindada
        ? stockStrategy === 'extender'
            ? '¡Circuito blindado en 1.2s! Plazo de fabricación extendido en Mercado Libre (+3 días): la publicación no cae en el algoritmo de ML y la orden se cobró en Tiendanube.'
            : '¡Circuito blindado en 1.2s! Publicación pausada a 0 stock en Mercado Libre para evitar sobreventas, y orden pagada en Tiendanube.'
        : activeScenario.successMessage

    const handleExecuteCurrent = () => {
        setExecutedMap((prev) => ({ ...prev, [activeScenario.id]: true }))
    }

    const handleResetCurrent = () => {
        setExecutedMap((prev) => ({ ...prev, [activeScenario.id]: false }))
    }

    const handleNextScenario = () => {
        const currentIndex = SCENARIOS.findIndex((s) => s.id === activeScenario.id)
        const nextIndex = (currentIndex + 1) % SCENARIOS.length
        setActiveScenarioId(SCENARIOS[nextIndex].id)
    }

    return (
        <section id="dolor-solucion" className="relative bg-black overflow-hidden">
            {/* Background accents */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3E3D3A]/25 via-[#1E1D1C]/40 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#C84214]/10 via-transparent to-transparent pointer-events-none" />

            {/* Grid texture */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:56px_56px] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

            {/* =========================================================================
               PARTE 1: NÚCLEO PRINCIPAL VALIDADO + MÓDULOS SECUNDARIOS
               ========================================================================= */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 lg:pt-32 pb-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    className="text-center mb-12 lg:mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5520]/10 border border-[#FF5520]/30 text-[#FFA380] text-xs font-mono uppercase tracking-[0.18em]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5520] animate-ping" />
                        Núcleo Principal + Módulos Secundarios
                    </span>
                    <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight max-w-4xl mx-auto">
                        Blindá primero tu termómetro de reclamos en Mercado Libre{' '}
                        <span className="bg-gradient-to-r from-[#FF5520] via-[#FFA380] to-white bg-clip-text text-transparent">
                            y sumá control multicanal a tu medida.
                        </span>
                    </h2>
                    <p className="mt-4 text-neutral-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        El foco principal es avisarte apenas entra un reclamo con su plazo exacto y decirte cuánto margen te queda antes de bajar de color. Sobre esa base, podés activar módulos secundarios como <strong>Venta Blindada</strong> (cobro por WhatsApp + baja de stock), control de reservas y conciliación.
                    </p>
                </motion.div>

                {/* 4 Casos Operativos con Arquitectura Obsidian Hardware & Telemetría */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pains.map((pain, i) => (
                        <motion.div
                            key={pain.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ delay: i * 0.08, duration: 0.4 }}
                            className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl border overflow-hidden transition-all duration-300 ${pain.containerClass} ${pain.cardBorder}`}
                        >
                            {/* Subtle Ambient Glow */}
                            <div className={`absolute top-0 right-0 w-72 h-72 bg-gradient-to-br ${pain.glowColor} blur-3xl pointer-events-none opacity-50 group-hover:opacity-90 transition-opacity duration-500`} />

                            <div>
                                {/* Micro Telemetry Bar */}
                                <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-white/[0.08]">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${pain.statusPulse}`} />
                                        <span className="font-mono text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                            {pain.telemetryTag}
                                        </span>
                                    </div>
                                    <span className="font-mono text-[10px] text-neutral-500">
                                        ID: {pain.id}
                                    </span>
                                </div>

                                {/* Header: Badge + 3D Render Hardware Lens */}
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <span className={`font-mono text-[11px] font-bold tracking-wider px-3 py-1 rounded-md border uppercase ${pain.badgeColor}`}>
                                        {pain.badge}
                                    </span>

                                    {/* 3D Asset in Hardware Lens */}
                                    <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center p-1.5 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/15 group-hover:scale-105 group-hover:border-white/30 transition-all duration-300 shadow-inner">
                                        <Image
                                            src={pain.image}
                                            alt={pain.title}
                                            width={140}
                                            height={140}
                                            quality={95}
                                            sizes="140px"
                                            className="w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(255,85,32,0.35)]"
                                        />
                                    </div>
                                </div>

                                {/* Operational Context Tag (Sin citas de terceros) */}
                                <div className="relative border-l-2 border-[#FF5520] bg-black/60 border border-white/[0.08] backdrop-blur-md p-3.5 rounded-xl mb-4 shadow-sm">
                                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#FFA380] font-bold mb-1">
                                        <ShieldCheck className="w-3.5 h-3.5 text-[#FF5520]" />
                                        <span>Alcance del Caso Operativo</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-neutral-200 leading-snug">
                                        {pain.contextLabel}
                                    </p>
                                </div>

                                {/* Title & Text */}
                                <h3 className="font-heading text-lg sm:text-xl font-bold text-white leading-snug mt-2 mb-2 tracking-tight">
                                    {pain.title}
                                </h3>
                                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-5">
                                    {pain.text}
                                </p>
                            </div>

                            {/* Impact Callout vs INDIVIDRA Deterministic Solution */}
                            <div className="pt-4 border-t border-white/[0.08] space-y-2.5">
                                <div className="flex items-start gap-2 text-xs p-2.5 rounded-lg bg-red-950/20 border border-red-500/20">
                                    <span className="font-mono text-red-400 font-bold shrink-0">⚠️ {pain.impactLabel}:</span>
                                    <span className="text-neutral-200">{pain.impactValue}</span>
                                </div>
                                <div className="flex items-start gap-2 text-xs bg-emerald-950/30 border border-emerald-500/30 p-2.5 rounded-lg">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                    <span className="text-emerald-200">
                                        <strong className="text-emerald-300 font-mono">INDIVIDRA:</strong> {pain.solutionHighlight}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ===== CONECTOR ===== */}
            <div className="relative z-10 flex flex-col items-center py-6">
                <div className="w-px h-12 bg-gradient-to-b from-[#3E3D3A] to-[#C84214]" />
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#C84214]/40 bg-[#1E1D1C] shadow-lg shadow-[#C84214]/20">
                    <ArrowDown className="w-4 h-4 text-[#C84214]" />
                </div>
            </div>

            {/* =========================================================================
               PARTE 2: LA CONSOLA DE EXCEPCIONES INTERACTIVA (ESCENARIOS SIMULADOS)
               ========================================================================= */}
            <div id="consola-operativa" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-24 lg:pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    className="flex flex-col items-center text-center mb-10 lg:mb-12"
                >
                    <Image
                        src="/3d/icono-pulgar.png"
                        alt="Consola operativa de 1 clic"
                        width={429}
                        height={512}
                        quality={95}
                        sizes="256px"
                        className="mb-3 h-14 w-auto object-contain drop-shadow-[0_12px_26px_rgba(255,85,32,0.35)] sm:h-16"
                    />
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5520]/10 border border-[#FF5520]/30 text-[#FFA380] text-xs font-mono uppercase tracking-[0.18em]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5520] animate-ping" />
                        Demostración Interactiva · Alertas de Reclamos + Módulos Secundarios
                    </span>
                    <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white leading-tight max-w-4xl tracking-tight">
                        Avisos con plazo exacto y botones de 1 clic que{' '}
                        <span className="bg-gradient-to-r from-[#FF5520] via-[#FFA380] to-white bg-clip-text text-transparent">
                            ejecutan el circuito por detrás.
                        </span>
                    </h2>
                    <p className="mt-4 text-neutral-300 text-base sm:text-lg max-w-3xl leading-relaxed">
                        Cero promesas de «IA mágica» que tome decisiones a ciegas en tu cuenta. INDIVIDRA es <strong>software determinístico con supervisión humana obligatoria</strong>: probá abajo los 4 escenarios simulados (encabezados por el monitoreo de reclamos y termómetro en ML, seguido de los módulos secundarios como Venta Blindada).
                    </p>
                </motion.div>

                {/* ===== CONSOLE WORKSTATION CONTAINER (OBSIDIAN HARDWARE) ===== */}
                <div className="rounded-3xl border border-white/[0.12] bg-[#0A0C0E] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative overflow-hidden sheen-top">
                    {/* Console Header Bar */}
                    <div className="border-b border-white/[0.08] bg-[#111317] px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-[#FF5520] shadow-[0_0_8px_rgba(255,85,32,0.6)]" />
                                <span className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                <span className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            </div>
                            <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />
                            <span className="font-heading text-xs sm:text-sm text-white font-bold tracking-tight">
                                INDIVIDRA OS · Simulador de Consola Operativa
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 beacon-active" />
                                SIMULACIÓN INTERACTIVA · 4 ESCENARIOS
                            </span>
                        </div>
                    </div>

                    {/* Interactive Scenario Tabs (Selector de Cola) */}
                    <div className="border-b border-white/[0.08] bg-[#0D0F13] px-3 sm:px-6 py-3 flex items-center gap-2.5 overflow-x-auto scrollbar-none">
                        {SCENARIOS.map((s) => {
                            const isSelected = s.id === activeScenario.id
                            const isDone = !!executedMap[s.id]

                            return (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => setActiveScenarioId(s.id)}
                                    className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer shrink-0 border ${
                                        isSelected
                                            ? 'bg-gradient-to-r from-[#FF5520]/20 via-[#FF5520]/10 to-[#1C1F24] border-[#FF5520] text-white shadow-[0_0_20px_-5px_rgba(255,85,32,0.35)]'
                                            : 'bg-white/[0.02] border-white/[0.06] text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                                    }`}
                                >
                                    <span
                                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                                            isSelected
                                                ? 'bg-[#FF5520] text-white shadow-sm'
                                                : 'bg-white/10 text-neutral-400'
                                        }`}
                                    >
                                        {s.tabNumber}
                                    </span>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs sm:text-sm font-bold leading-tight font-heading">
                                                {s.tabTitle}
                                            </span>
                                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase border ${s.categoryPillColor}`}>
                                                {s.categoryPill}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-neutral-400 font-mono hidden sm:inline">
                                            {s.tabSub}
                                        </span>
                                    </div>
                                    {isDone && (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
                                    )}
                                </button>
                            )
                        })}
                    </div>

                    {/* Active Scenario Canvas */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeScenario.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                            className="p-4 sm:p-6 lg:p-8"
                        >
                            {/* Meta Bar of the Scenario */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#222429] mb-6">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <span
                                        className={`px-3 py-1 rounded-lg border text-xs font-mono font-bold tracking-wider uppercase ${activeScenario.priorityBadgeClass}`}
                                    >
                                        {activeScenario.priorityLabel}
                                    </span>
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-neutral-300">
                                        <Image
                                            src="/logos/whatsapp.svg"
                                            alt="WhatsApp"
                                            width={14}
                                            height={14}
                                            className="w-3.5 h-3.5 object-contain"
                                        />
                                        <span>WhatsApp</span>
                                        <span className="text-neutral-500">➔</span>
                                        <Image
                                            src="/logos/mercadolibre-isotipo.svg"
                                            alt="ML"
                                            width={16}
                                            height={16}
                                            className="w-4 h-4 object-contain"
                                        />
                                        <span>Mercado Libre</span>
                                        <span className="text-neutral-500">+</span>
                                        <Image
                                            src="/logos/tiendanube.png"
                                            alt="Tiendanube"
                                            width={14}
                                            height={14}
                                            className="w-3.5 h-3.5 object-contain"
                                        />
                                        <span>Tiendanube</span>
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                                    {activeScenario.timeAgo}
                                </span>
                            </div>

                            {/* Main Split: Ticket Físico / Desglose vs. Conflicto & Botón 1-Clic */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                                {/* LEFT (Cols 5): Digital Voucher / Breakdown Card with 3D Asset */}
                                <div className="lg:col-span-5 card-obsidian sheen-top rounded-2xl border border-white/[0.12] bg-gradient-to-br from-[#121418] via-[#0F1115] to-[#0A0C0E] p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden shadow-xl">
                                    <div>
                                        {/* Top Receipt Header */}
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            <span
                                                className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold tracking-wider uppercase border ${activeScenario.receipt.bankPillClass}`}
                                            >
                                                {activeScenario.receipt.bankName}
                                            </span>
                                            <span className="text-[11px] font-mono text-neutral-400">
                                                {activeScenario.receipt.operationId}
                                            </span>
                                        </div>

                                        {/* SCENARIO 4 SPECIAL: FINANCIAL BREAKDOWN TABLE */}
                                        {activeScenario.financialBreakdown ? (
                                            <div className="my-3 p-3.5 rounded-xl bg-black/60 border border-emerald-500/30 font-mono text-xs space-y-1.5">
                                                <div className="flex justify-between py-0.5 text-neutral-300">
                                                    <span>Venta Bruta (ML):</span>
                                                    <span className="font-bold text-white">{activeScenario.financialBreakdown.gross}</span>
                                                </div>
                                                <div className="flex justify-between py-0.5 text-red-400">
                                                    <span>Comisión ML (16% Clásica):</span>
                                                    <span>{activeScenario.financialBreakdown.mlFee}</span>
                                                </div>
                                                <div className="flex justify-between py-0.5 text-red-400">
                                                    <span>Costo Envío Flex neto:</span>
                                                    <span>{activeScenario.financialBreakdown.flexCost}</span>
                                                </div>
                                                <div className="flex justify-between py-0.5 text-amber-400">
                                                    <span>Retención IIBB MP (Conv. Mult.):</span>
                                                    <span>{activeScenario.financialBreakdown.iibbRet}</span>
                                                </div>
                                                <div className="flex justify-between py-0.5 text-amber-400">
                                                    <span>Retención IVA / Ganancias MP:</span>
                                                    <span>{activeScenario.financialBreakdown.ivaGanRet}</span>
                                                </div>
                                                <div className="pt-2 border-t border-emerald-500/40 flex justify-between text-sm text-emerald-300 font-extrabold">
                                                    <span>Neto Acreditado en Cuenta:</span>
                                                    <span>{activeScenario.financialBreakdown.netPayout}</span>
                                                </div>
                                                <div className="flex justify-between text-[11px] text-[#FFA380] font-bold">
                                                    <span>Margen Neto Real de la Orden:</span>
                                                    <span>{activeScenario.financialBreakdown.netMargin} ({activeScenario.financialBreakdown.marginAmount})</span>
                                                </div>
                                            </div>
                                        ) : activeScenario.evidenceDetails ? (
                                            /* SCENARIO 1 SPECIAL: RECLAMO + PLAZO EXACTO + TERMÓMETRO */
                                            <div className="my-3 p-3.5 rounded-xl bg-black/60 border border-[#FF5520]/30 font-mono text-xs space-y-2">
                                                <div className="flex justify-between text-neutral-400 pb-1 border-b border-white/5">
                                                    <span>Plazo del Reclamo:</span>
                                                    <span className="text-[#FFA380] font-bold">{activeScenario.evidenceDetails.countdown}</span>
                                                </div>
                                                <div className="flex justify-between text-neutral-300">
                                                    <span>Balanza Mesa (Empaque):</span>
                                                    <span className="text-emerald-400 font-bold">{activeScenario.evidenceDetails.packagingWeight}</span>
                                                </div>
                                                <div className="flex justify-between text-neutral-300">
                                                    <span>Control Devolución:</span>
                                                    <span className="text-red-400 font-bold">{activeScenario.evidenceDetails.returnedWeight}</span>
                                                </div>
                                                <div className="p-2 rounded bg-[#FF5520]/15 border border-[#FF5520]/40 text-[#FFA380] text-[11px] font-bold flex items-center justify-between">
                                                    <span>Estado del Termómetro:</span>
                                                    <span>{activeScenario.evidenceDetails.weightDiff}</span>
                                                </div>
                                                <div className="text-[10px] text-neutral-400">
                                                    ✓ {activeScenario.evidenceDetails.dispatchProof}
                                                </div>
                                            </div>
                                        ) : (
                                            /* STANDARD RECEIPT VIEW (Scenarios 2 & 3) */
                                            <div className="mt-2 mb-4">
                                                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest block mb-0.5">
                                                    Importe detectado por OCR:
                                                </span>
                                                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight flex items-baseline gap-2">
                                                    <span>{activeScenario.receipt.amount}</span>
                                                </div>
                                                <div className="text-xs font-semibold text-[#FFA380] mt-1">
                                                    SKU: {activeScenario.receipt.sku}
                                                </div>
                                            </div>
                                        )}

                                        {/* Verification details */}
                                        <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-neutral-300 space-y-1">
                                            <div className="text-neutral-400">
                                                Referencia: {activeScenario.receipt.cuit}
                                            </div>
                                            <div className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                                {activeScenario.receipt.ocrSummary}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3D Asset Floating Badge */}
                                    <div className="mt-5 pt-4 border-t border-dashed border-white/10 flex items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                                                Estado en Consola:
                                            </span>
                                            <div
                                                className={`mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold border transition-colors duration-300 ${
                                                    isCurrentExecuted
                                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                                }`}
                                            >
                                                {isCurrentExecuted ? (
                                                    <>
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                                        ✓ EJECUTADO Y AUDITADO
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                                        PENDIENTE DE ACCIÓN
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Render 3D */}
                                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center">
                                            <Image
                                                src={activeScenario.render3d.src}
                                                alt={activeScenario.render3d.alt}
                                                width={activeScenario.render3d.width}
                                                height={activeScenario.render3d.height}
                                                quality={95}
                                                sizes="128px"
                                                className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(200,66,20,0.3)] transition-transform duration-300 hover:scale-105"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT (Cols 7): Live Multichannel Impact & 1-Click Action Hub */}
                                <div className="lg:col-span-7 card-obsidian sheen-top rounded-2xl border border-white/[0.12] bg-gradient-to-br from-[#121418] via-[#0F1115] to-[#0A0C0E] p-5 sm:p-6 space-y-5 flex flex-col justify-between shadow-xl">
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                                                Impacto Operativo en Tiempo Real:
                                            </span>
                                            <span className="text-xs font-mono text-[#FFA380]">
                                                {isCurrentExecuted ? '✓ Sincronizado' : '⚠️ Acción requerida'}
                                            </span>
                                        </div>

                                        {/* Selector de estrategia ante quiebre de stock en ML */}
                                        {isVentaBlindada && !isCurrentExecuted && (
                                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 mb-3.5">
                                                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
                                                    <span className="text-[11px] font-mono text-neutral-300 font-bold uppercase">
                                                        Estrategia ante última unidad vendida:
                                                    </span>
                                                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                                                        💡 Configuración opcional
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setStockStrategy('pausar')}
                                                        className={`p-2.5 rounded-lg text-left border transition-all text-xs font-mono cursor-pointer ${
                                                            stockStrategy === 'pausar'
                                                                ? 'bg-red-500/25 border-red-500 text-white shadow-sm ring-1 ring-red-500'
                                                                : 'bg-white/5 border-transparent text-neutral-400 hover:text-white'
                                                        }`}
                                                    >
                                                        <div className="font-bold text-red-300">🛑 Opción A (Por defecto): Pausar a 0 stock</div>
                                                        <div className="text-[10px] text-neutral-300 mt-0.5">
                                                            Pausa preventiva en ML: blindaje total contra sobreventa si no hay reposición inmediata.
                                                        </div>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setStockStrategy('extender')}
                                                        className={`p-2.5 rounded-lg text-left border transition-all text-xs font-mono cursor-pointer ${
                                                            stockStrategy === 'extender'
                                                                ? 'bg-[#C84214]/25 border-[#C84214] text-white shadow-sm ring-1 ring-[#C84214]'
                                                                : 'bg-white/5 border-transparent text-neutral-400 hover:text-white'
                                                        }`}
                                                    >
                                                        <div className="font-bold text-[#FFA380]">⚡ Opción B: Extender plazo (+3 días)</div>
                                                        <div className="text-[10px] text-neutral-300 mt-0.5">
                                                            Solo si tenés reposición confirmada: mantiene activa la publicación sin perder inercia en el algoritmo.
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* 3 Channels Comparison Pills */}
                                        <div className="space-y-2.5">
                                            {/* Mercado Libre Pill */}
                                            <div
                                                className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                                                    isCurrentExecuted
                                                        ? 'bg-emerald-950/20 border-emerald-500/30'
                                                        : 'bg-[#191B20] border-[#2F323A]'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-[#FFE600]/10 border border-[#FFE600]/20 flex items-center justify-center shrink-0">
                                                        <Image
                                                            src="/logos/mercadolibre-isotipo.svg"
                                                            alt="Mercado Libre"
                                                            width={18}
                                                            height={18}
                                                            className="w-4 h-4 object-contain"
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-bold text-white block">
                                                            {activeScenario.channels.ml.title}
                                                        </span>
                                                        <span className="text-xs text-neutral-300">
                                                            {isCurrentExecuted
                                                                ? mlStatusAfter
                                                                : activeScenario.channels.ml.statusBefore}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span
                                                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold shrink-0 border ${
                                                        isCurrentExecuted
                                                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                                            : 'bg-red-500/15 text-red-300 border-red-500/30'
                                                    }`}
                                                >
                                                    {isCurrentExecuted
                                                        ? mlBadgeAfter
                                                        : activeScenario.channels.ml.badgeBefore}
                                                </span>
                                            </div>

                                            {/* Tiendanube Pill */}
                                            <div
                                                className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                                                    isCurrentExecuted
                                                        ? 'bg-emerald-950/20 border-emerald-500/30'
                                                        : 'bg-[#191B20] border-[#2F323A]'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-[#0080FF]/10 border border-[#0080FF]/20 flex items-center justify-center shrink-0">
                                                        <Image
                                                            src="/logos/tiendanube.png"
                                                            alt="Tiendanube"
                                                            width={18}
                                                            height={18}
                                                            className="w-4 h-4 object-contain"
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-bold text-white block">
                                                            {activeScenario.channels.tn.title}
                                                        </span>
                                                        <span className="text-xs text-neutral-300">
                                                            {isCurrentExecuted
                                                                ? activeScenario.channels.tn.statusAfter
                                                                : activeScenario.channels.tn.statusBefore}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span
                                                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold shrink-0 border ${
                                                        isCurrentExecuted
                                                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                                            : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                                    }`}
                                                >
                                                    {isCurrentExecuted
                                                        ? activeScenario.channels.tn.badgeAfter
                                                        : activeScenario.channels.tn.badgeBefore}
                                                </span>
                                            </div>

                                            {/* WhatsApp / Canal 3 Pill */}
                                            <div
                                                className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                                                    isCurrentExecuted
                                                        ? 'bg-emerald-950/20 border-emerald-500/30'
                                                        : 'bg-[#191B20] border-[#2F323A]'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center shrink-0">
                                                        <Image
                                                            src="/logos/whatsapp.svg"
                                                            alt="WhatsApp"
                                                            width={18}
                                                            height={18}
                                                            className="w-4 h-4 object-contain"
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-bold text-white block">
                                                            {activeScenario.channels.wa.title}
                                                        </span>
                                                        <span className="text-xs text-neutral-300">
                                                            {isCurrentExecuted
                                                                ? activeScenario.channels.wa.statusAfter
                                                                : activeScenario.channels.wa.statusBefore}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span
                                                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold shrink-0 border ${
                                                        isCurrentExecuted
                                                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                                            : 'bg-neutral-800 text-neutral-400 border-white/10'
                                                    }`}
                                                >
                                                    {isCurrentExecuted
                                                        ? activeScenario.channels.wa.badgeAfter
                                                        : activeScenario.channels.wa.badgeBefore}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 1-Click Interactive Trigger Box */}
                                    <div className="pt-4 border-t border-white/[0.08]">
                                        {!isCurrentExecuted ? (
                                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={handleExecuteCurrent}
                                                    className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-[#FF5520] via-[#FF6E40] to-[#FF5520] hover:brightness-110 text-white font-heading font-bold text-sm sm:text-base shadow-[0_4px_25px_rgba(255,85,32,0.4)] flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer active:scale-[0.98] group"
                                                >
                                                    <CheckCircle2 className="w-5 h-5 text-white shrink-0 group-hover:scale-110 transition-transform" />
                                                    <span>{primaryActionLabel}</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleExecuteCurrent}
                                                    className="px-4 py-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white font-mono text-xs border border-white/10 flex items-center justify-center gap-1.5 transition-colors duration-200 cursor-pointer"
                                                >
                                                    <XCircle className="w-4 h-4 text-neutral-400" />
                                                    <span>{activeScenario.secondaryActionLabel}</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                                                <div className="flex items-center gap-2.5 text-emerald-300 text-xs sm:text-sm font-mono">
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                                    <span>
                                                        <strong>{successMessage}</strong>
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={handleResetCurrent}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-neutral-300 hover:text-white font-mono cursor-pointer transition-colors"
                                                    >
                                                        <RotateCcw className="w-3.5 h-3.5" />
                                                        Reiniciar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleNextScenario}
                                                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#C84214] hover:bg-[#B3390F] text-xs font-bold text-white font-mono cursor-pointer transition-colors shadow-md shadow-[#C84214]/25"
                                                    >
                                                        <span>Siguiente caso</span>
                                                        <ChevronRight className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        <p className="text-[11px] font-mono text-neutral-400 text-center sm:text-left mt-2.5">
                                            💡 Hacé clic en el botón naranja: observarás cómo la acción se ejecuta en {activeScenario.executionDuration}.
                                        </p>
                                        <p className="text-[10px] font-mono text-neutral-500 text-center sm:text-left mt-1">
                                            * Escenarios operativos simulados con datos, comercios y montos ficticios para demostrar el funcionamiento del sistema.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* BOTTOM PIPELINE: QUÉ EJECUTA EL SISTEMA EN < 2 SEGUNDOS */}
                            <div className="mt-8 pt-6 border-t border-[#26282E]">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-[#C84214]" />
                                        <span className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-bold">
                                            {isCurrentExecuted
                                                ? '✓ Operaciones disparadas y registradas en tus canales:'
                                                : 'Lo que este botón ejecuta por detrás en menos de 2 segundos:'}
                                        </span>
                                    </div>
                                    <span className="text-xs font-mono text-[#FFA380]">
                                        Latencia total: {activeScenario.executionDuration}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                    {activeScenario.pipelineSteps.map((step, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                                                isCurrentExecuted
                                                    ? 'bg-emerald-950/25 border-emerald-500/40 shadow-sm'
                                                    : 'bg-[#15171B] border-[#2B2E35]'
                                            }`}
                                        >
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-mono text-[11px] font-bold text-[#FFA380]">
                                                        Paso {step.stepNumber}
                                                    </span>
                                                    {isCurrentExecuted ? (
                                                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                                                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                                            {step.doneBadge}
                                                        </span>
                                                    ) : (
                                                        <span className="px-1.5 py-0.5 rounded bg-white/5 text-neutral-400 text-[10px] font-mono">
                                                            En cola
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1.5 mb-1">
                                                    {step.channelLogo && (
                                                        <Image
                                                            src={step.channelLogo}
                                                            alt=""
                                                            width={14}
                                                            height={14}
                                                            className="w-3.5 h-3.5 object-contain"
                                                        />
                                                    )}
                                                    <span className="text-xs font-bold text-white leading-tight">
                                                        {step.channelName}
                                                    </span>
                                                </div>

                                                <p className="text-xs font-semibold text-neutral-200 mt-1">
                                                    {step.actionName}
                                                </p>
                                            </div>

                                            <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">
                                                {step.detail}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Bottom CTA leading to the Calculator */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="mt-12 flex flex-col items-center text-center"
                >
                    <a
                        href="#calculadora"
                        className="group inline-flex items-center gap-3 px-8 py-4.5 bg-gradient-to-r from-[#FF5520] via-[#FF6E40] to-[#FF5520] hover:brightness-110 text-white text-base sm:text-lg font-heading font-bold rounded-2xl shadow-[0_4px_30px_rgba(255,85,32,0.4)] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                    >
                        Calcular cuánto margen me queda antes de bajar de color
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
                    </a>
                </motion.div>
            </div>
        </section>
    )
}
