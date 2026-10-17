'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    construirOferta,
    HallazgosLista,
    MargenResultado,
    PasoReputacion,
    PlanRecomendado,
    type DatosReputacion,
} from './oferta'
import { calcularMargen } from '@/lib/reputacionML'
import { trackEvent } from '@/lib/analytics'
import {
    CalculadoraFinancieraViva,
    calcularEconomiaLogistica,
    formatearArs,
} from '@/components/logistica/CalculadoraFallas'

/**
 * Autodiagnóstico operativo y calculadora financiera en vivo.
 *
 * Tres ramas específicas según el perfil del operador:
 *   1) 'logistica': Empresas de Logística de Última Milla y Distribuidoras Mayoristas
 *      con flota propia o tercerizada. Incluye calculadora financiera en vivo:
 *      (entregas/día × % fallos × ARS $9.980) diaria y mensual (22 días hábiles).
 *   2) 'meli': Vendedores de Mercado Libre (Flex / Envíos / Full / Mixto).
 *   3) 'otros': Tienda propia o multicanal (Tiendanube, Shopify, WhatsApp, IG).
 */

/** A qué se dedica la operación: define qué cuestionario y calculadora ve. */
type Plataforma = 'logistica' | 'meli' | 'otros'

/** Canales de entrega dentro de Mercado Libre. La P1 del recorrido meli define el resto. */
type Canal = 'flex' | 'envios' | 'full' | 'mixto'

type Opcion = {
    label: string
    /** Solo en la pregunta de canal (recorrido meli): define el sub-recorrido. */
    valor?: Canal
    /** Puntos de riesgo. Ausente = la pregunta no puntúa (es de segmentación o de intención). */
    puntos?: number
    /** Valor numérico opcional para sincronizar la calculadora en vivo de logística. */
    calcEntregasDia?: number
    calcPorcentajeFallos?: number
    /** En la pregunta de dolor principal: qué hallazgo va primero en el resultado. */
    tema?: string
}

type Pregunta = {
    id: string
    titulo: string
    ayuda?: string
    /** Si está, la pregunta solo se muestra para esos canales de ML. Ausente = siempre. */
    canales?: Canal[]
    /** 'reputacion': en vez de opciones, el vendedor carga sus números de ML (paso opcional). */
    tipo?: 'reputacion'
    opciones: Opcion[]
}

/* ============================================================
   Recorrido 1: Empresas de Logística y Distribuidoras Mayoristas
   ============================================================ */

const PREGUNTAS_LOGISTICA: Pregunta[] = [
    {
        id: 'tipo_operacion',
        titulo: '¿Qué tipo de operación tenés?',
        opciones: [
            { label: 'Última milla para terceros (e-commerce, marcas, Flex)' },
            { label: 'Distribuidora mayorista que entrega a comercios' },
            { label: 'Mixta: distribución propia y reparto para terceros' },
        ],
    },
    {
        id: 'flota',
        titulo: '¿Cuántos vehículos salen a repartir por día?',
        ayuda: 'Propios y fleteros.',
        opciones: [
            { label: 'De 1 a 5' },
            { label: 'De 6 a 15' },
            { label: 'De 16 a 35' },
            { label: 'Más de 35' },
        ],
    },
    {
        id: 'volumen_logistica',
        titulo: '¿Cuántas entregas hacen por día entre toda la flota?',
        ayuda: 'Después podés ajustar el número exacto en la calculadora.',
        opciones: [
            { label: 'Menos de 40', calcEntregasDia: 30 },
            { label: 'Entre 40 y 80', calcEntregasDia: 60 },
            { label: 'Entre 80 y 150', calcEntregasDia: 100 },
            { label: 'Entre 150 y 300', calcEntregasDia: 200 },
            { label: 'Más de 300', calcEntregasDia: 350 },
        ],
    },
    {
        id: 'rebote',
        titulo: '¿Qué porcentaje vuelve sin entregar en el primer intento?',
        ayuda: 'Ausentes, timbre roto, comercio cerrado o rechazo en puerta.',
        opciones: [
            { label: 'Menos del 4%', puntos: 0, calcPorcentajeFallos: 3 },
            { label: 'Entre el 5% y el 8%', puntos: 2, calcPorcentajeFallos: 7 },
            { label: 'Entre el 9% y el 12%', puntos: 3, calcPorcentajeFallos: 10 },
            { label: 'Más del 12%', puntos: 4, calcPorcentajeFallos: 15 },
            { label: 'No lo tenemos medido', puntos: 3, calcPorcentajeFallos: 10 },
        ],
    },
    {
        id: 'coordinacion',
        titulo: 'Antes de cargar, ¿cómo confirman que el destinatario va a estar?',
        opciones: [
            { label: 'Aviso automático y sacamos de la carga al que no puede', puntos: 0 },
            { label: 'WhatsApp o llamado a mano, solo a algunos', puntos: 2 },
            { label: 'No confirmamos: sale con toda la hoja de ruta', puntos: 4 },
        ],
    },
    {
        id: 'evidencia_conflicto',
        titulo: 'El chofer marca "ausente" y el cliente dice "estuve todo el día". ¿Cómo lo resolvés?',
        opciones: [
            { label: 'Tengo la ubicación del intento y la confirmación previa', puntos: 0 },
            { label: 'Le pido una foto al chofer por WhatsApp', puntos: 2 },
            { label: 'Es su palabra contra la del cliente: volvemos a ir', puntos: 4 },
        ],
    },
    {
        id: 'remitos_rendicion',
        titulo: '¿Cómo te rinden los choferes los remitos firmados?',
        opciones: [
            { label: 'Los mandan por un bot apenas entregan', puntos: 0 },
            { label: 'Fotos sueltas en grupos de WhatsApp', puntos: 3 },
            { label: 'En papel: administración tarda 1 o 2 días en procesarlos', puntos: 4 },
        ],
    },
    {
        id: 'intencion',
        titulo: '¿Te interesaría filtrar ausencias antes de salir, sin apps nuevas para los choferes?',
        opciones: [
            { label: 'Sí, quiero verlo aplicado a mi flota (20 min)' },
            { label: 'Sí, probándolo en una sola ruta' },
            { label: 'Por ahora solo quería calcular el costo' },
        ],
    },
]

/* ============================================================
   Recorrido 2: Mercado Libre
   Validado con lo que repiten los vendedores en grupos (oct. 2026):
   ventas sin stock (cancelar vs. demorar vs. arreglar por fuera),
   despacho fuera de horario y cargos de ML cada vez más difíciles de seguir.
   ============================================================ */

const PREGUNTAS_MELI: Pregunta[] = [
    {
        id: 'canal',
        titulo: '¿Cómo despachás la mayoría de tus ventas?',
        opciones: [
            { label: 'Flex: reparto yo o un fletero', valor: 'flex' },
            { label: 'Colecta: pasa Mercado Libre a retirar', valor: 'envios' },
            { label: 'Full: mi stock está en el depósito de ML', valor: 'full' },
            { label: 'Combino Colecta y Flex', valor: 'mixto' },
        ],
    },
    {
        // Las opciones salen de la encuesta de Gabriel en grupos de vendedores (oct. 2026)
        id: 'dolor',
        titulo: '¿Qué es lo que más te complica hoy?',
        ayuda: 'Elegí el que más te pasa.',
        opciones: [
            { label: 'Enterarme tarde de un reclamo y tener que resolverlo antes de las 14 h', tema: 'plazo' },
            { label: 'No saber cuántos reclamos me quedan antes de bajar de color', tema: 'margen' },
            { label: 'Envíos Flex que se complican y terminan en reclamo', tema: 'flex' },
            { label: 'Vender lo mismo en dos canales y quedarme sin stock', tema: 'stock' },
            { label: 'Que lo que me acreditan no coincide con lo que vendí', tema: 'liquidacion' },
            { label: 'Perseguir comprobantes de transferencia y bajar el stock a mano', tema: 'stock' },
            { label: 'Devoluciones que vuelven cambiadas, usadas o vacías', tema: 'devoluciones' },
        ],
    },
    {
        id: 'volumen',
        titulo: '¿Cuántas ventas hacés por mes en Mercado Libre?',
        opciones: [
            { label: 'Menos de 50' },
            { label: 'Entre 50 y 150' },
            { label: 'Entre 150 y 600' },
            { label: 'Entre 600 y 1.500' },
            { label: 'Más de 1.500' },
        ],
    },
    {
        id: 'reclamos_plazo',
        titulo: 'Cuando entra un reclamo, ¿cómo te enterás?',
        ayuda: 'Si el asistente de ML te deriva el reclamo, tenés hasta las 14 h del día hábil siguiente para resolverlo.',
        opciones: [
            { label: 'Me llega una alerta con el plazo exacto', puntos: 0 },
            { label: 'Reviso el panel de ML varias veces por día', puntos: 2 },
            { label: 'Tarde: el aviso se pierde entre notificaciones', puntos: 4 },
            { label: 'Ya se me venció alguno y lo perdí', puntos: 4 },
        ],
    },
    {
        id: 'numeros_reputacion',
        tipo: 'reputacion',
        titulo: '¿Cuántos reclamos te quedan antes de bajar de color?',
        ayuda: 'Cargá los números de la sección Reputación de tu cuenta. Si no los tenés a mano, seguí sin cargarlos.',
        opciones: [],
    },
    {
        id: 'sin_stock',
        titulo: 'Si vendés algo que no tenés en stock, ¿qué hacés?',
        canales: ['flex', 'envios', 'mixto'],
        opciones: [
            { label: 'No me pasa: el stock está sincronizado', puntos: 0 },
            { label: 'Demoro el envío hasta conseguirlo', puntos: 2 },
            { label: 'Cancelo la venta', puntos: 4 },
            { label: 'Mando algo parecido y lo arreglo con el comprador', puntos: 4 },
        ],
    },
    {
        id: 'despacho',
        titulo: '¿Llegás con los paquetes listos al horario de la colecta?',
        ayuda: 'ML viene cambiando los horarios y sumando una segunda colecta.',
        canales: ['envios'],
        opciones: [
            { label: 'Siempre, con margen', puntos: 0 },
            { label: 'Casi siempre, a veces sobre la hora', puntos: 1 },
            { label: 'Seguido despacho tarde', puntos: 3 },
            { label: 'No sé cuántas demoras tengo', puntos: 2 },
        ],
    },
    {
        id: 'zonas_flex',
        titulo: '¿Te suspendieron zonas de Flex en el último mes?',
        ayuda: 'ML pide escanear los paquetes en una ubicación registrada antes de salir a repartir.',
        canales: ['flex', 'mixto'],
        opciones: [
            { label: 'No', puntos: 0 },
            { label: 'Sí, por el escaneo de los paquetes', puntos: 3 },
            { label: 'Sí, por demoras o entregas fallidas', puntos: 3 },
            { label: 'No sé si tengo zonas suspendidas', puntos: 2 },
        ],
    },
    {
        id: 'control_fleteros',
        titulo: '¿Controlás lo que te factura el fletero cada mes?',
        canales: ['flex', 'mixto'],
        opciones: [
            { label: 'No tengo fletero o tengo choferes propios', puntos: 0 },
            { label: 'Sí, cruzo envío por envío a mano', puntos: 2 },
            { label: 'No, confío en lo que me pasa', puntos: 3 },
            { label: 'Ya me cobró envíos cancelados o de más', puntos: 4 },
        ],
    },
    {
        id: 'liquidaciones',
        titulo: '¿Sabés cuánto te queda limpio de cada venta?',
        ayuda: 'Después de comisión, envío y retenciones. Desde septiembre, el costo por unidad cambia según el precio y el peso del paquete.',
        opciones: [
            { label: 'Sí, lo tengo calculado por producto', puntos: 0 },
            { label: 'Más o menos, con una planilla', puntos: 1 },
            { label: 'No, miro lo que entra a Mercado Pago', puntos: 3 },
            { label: 'Entre cargos, retenciones e impuestos, ya no lo sigo', puntos: 3 },
        ],
    },
    {
        id: 'costo_reputacion',
        titulo: 'Si bajás de verde a amarillo, ¿cuánto dejarías de vender en un mes?',
        ayuda: 'Una estimación: bajar de color reduce la exposición de tus publicaciones.',
        opciones: [
            { label: 'Menos de $800.000', puntos: 1 },
            { label: 'Entre $800.000 y $3.000.000', puntos: 3 },
            { label: 'Más de $3.000.000', puntos: 4 },
            { label: 'No lo sé', puntos: 2 },
        ],
    },
    {
        id: 'intencion',
        titulo: 'Si te avisáramos cada reclamo con su plazo y tu margen de color, ¿lo probarías?',
        opciones: [
            { label: 'Sí, quiero verlo en mi cuenta (30 min)' },
            { label: 'Sí, si hay una prueba sin permanencia' },
            { label: 'Por ahora no es prioridad' },
        ],
    },
]

/* ============================================================
   Recorrido 3: Cobro por WhatsApp + stock multicanal (Venta Blindada)
   ============================================================ */

const PREGUNTAS_OTROS: Pregunta[] = [
    {
        id: 'mezcla_canales',
        titulo: 'De cada 10 ventas, ¿cuántas cobrás por transferencia en WhatsApp o Instagram?',
        opciones: [
            { label: 'Más de 4', puntos: 4 },
            { label: 'Entre 2 y 4', puntos: 3 },
            { label: 'Menos de 2', puntos: 1 },
            { label: 'Ninguna: vendo todo por ML o Tiendanube', puntos: 0 },
        ],
    },
    {
        id: 'sobreventa_stock',
        titulo: 'Cuando vendés por WhatsApp, ¿cuándo bajás ese stock en ML y Tiendanube?',
        opciones: [
            { label: 'Al instante, con un sincronizador', puntos: 0 },
            { label: 'Guardo stock de seguridad sin publicar', puntos: 2 },
            { label: 'Alguien lo edita a mano apenas pagan', puntos: 3 },
            { label: 'Al final del día (ya se vendió dos veces)', puntos: 4 },
        ],
    },
    {
        id: 'validacion_comprobantes',
        titulo: 'Llega un comprobante y la colecta está en la puerta. ¿Cómo lo validás?',
        opciones: [
            { label: 'Si no veo la plata en la cuenta, no sale', puntos: 1 },
            { label: 'Chequeo que el número de operación no esté repetido', puntos: 2 },
            { label: 'Entro al banco o a Mercado Pago a buscarla', puntos: 3 },
            { label: 'Miro la captura y confío', puntos: 4 },
        ],
    },
    {
        id: 'horas_administracion',
        titulo: '¿Cuánto tiempo por día le dedican a validar pagos y bajar stock a mano?',
        opciones: [
            { label: 'Nada, está automatizado', puntos: 0 },
            { label: 'Menos de 45 minutos', puntos: 1 },
            { label: 'Entre 1 y 2 horas', puntos: 3 },
            { label: 'Más de 2 horas y media', puntos: 4 },
        ],
    },
    {
        id: 'reputacion_cancelaciones',
        titulo: 'En los últimos 3 meses, ¿cancelaste ventas en ML por falta de stock?',
        opciones: [
            { label: 'No, ninguna', puntos: 0 },
            { label: 'No, pero tuve que conseguir mercadería a las apuradas', puntos: 2 },
            { label: 'Sí, 1 o 2, y quedé al límite', puntos: 3 },
            { label: 'Sí, y perdí el verde', puntos: 4 },
        ],
    },
    {
        id: 'intencion',
        titulo: 'Si con 1 clic validaras el pago y bajaras el stock en todos tus canales, ¿lo probarías 30 días?',
        opciones: [
            { label: 'Sí, quiero verlo con mi catálogo (20 min)' },
            { label: 'Sí, si no interrumpe mis ventas' },
            { label: 'Por ahora solo quería medir mis costos' },
        ],
    },
]

type Nivel = 'verde' | 'amarillo' | 'rojo'

type Respuestas = Record<string, string>

/** Devuelve el canal de ML elegido (o undefined si todavía no respondió esa P1). */
function valorCanalMeli(r: Respuestas): Canal | undefined {
    const label = r.canal
    if (!label) return undefined
    return PREGUNTAS_MELI[0].opciones.find((o) => o.label === label)?.valor
}

/** Preguntas activas según la plataforma elegida y, dentro de meli, el canal. */
function preguntasPara(plataforma: Plataforma | null, r: Respuestas): Pregunta[] {
    if (plataforma === 'logistica') return PREGUNTAS_LOGISTICA
    if (plataforma === 'otros') return PREGUNTAS_OTROS
    const canal = valorCanalMeli(r)
    if (!canal) return PREGUNTAS_MELI
    return PREGUNTAS_MELI.filter((p) => !p.canales || p.canales.includes(canal))
}

/** Índice de la opción elegida en una pregunta (-1 si no la respondió). Evita atar los textos a los labels. */
function opcionElegida(preguntas: Pregunta[], id: string, r: Respuestas): number {
    const p = preguntas.find((q) => q.id === id)
    return p ? p.opciones.findIndex((o) => o.label === r[id]) : -1
}

const ORDEN_NIVEL: Nivel[] = ['verde', 'amarillo', 'rojo']

/**
 * Puntaje, máximo alcanzable y nivel, derivados del recorrido activo.
 * Si el vendedor cargó sus números de reputación, mandan sobre las respuestas:
 * con 1 o 2 reclamos de margen no puede salir "riesgo bajo".
 */
function calcular(r: Respuestas, plataforma: Plataforma | null, reputacion: DatosReputacion | null = null) {
    const activas = preguntasPara(plataforma, r)
    const puntaje = activas.reduce((acc, p) => {
        const op = p.opciones.find((o) => o.label === r[p.id])
        return acc + (op?.puntos ?? 0)
    }, 0)
    const maximo = activas.reduce((acc, p) => acc + Math.max(0, ...p.opciones.map((o) => o.puntos ?? 0)), 0)
    const porcentaje = maximo > 0 ? Math.round((puntaje / maximo) * 100) : 0
    let nivel: Nivel = porcentaje < 30 ? 'verde' : porcentaje <= 60 ? 'amarillo' : 'rojo'

    if (plataforma === 'meli' && reputacion && reputacion.ventas > 0) {
        const m = calcularMargen(reputacion.ventas, reputacion.conteos, reputacion.esLider)
        const porMargen: Nivel =
            m.colorActual !== 'verde' || m.masAjustada.margen <= 0 ? 'rojo' : m.masAjustada.margen <= 2 ? 'amarillo' : 'verde'
        if (ORDEN_NIVEL.indexOf(porMargen) > ORDEN_NIVEL.indexOf(nivel)) nivel = porMargen
    }
    return { activas, puntaje, maximo, porcentaje, nivel }
}

/** Título y color por nivel: son genéricos, valen para cualquier recorrido. */
const NIVEL_META: Record<Nivel, { titulo: string; color: string; bg: string }> = {
    verde: { titulo: 'Riesgo bajo', color: '#4ADE80', bg: 'rgba(74,222,128,0.1)' },
    amarillo: { titulo: 'Riesgo medio', color: '#FBBF24', bg: 'rgba(251,191,36,0.1)' },
    rojo: { titulo: 'Riesgo alto', color: '#FF5520', bg: 'rgba(255,85,32,0.12)' },
}

/** Lo que puede hacer por su cuenta, sin contratar nada. */
const ACCIONES_LOGISTICA: Record<Nivel, string[]> = {
    verde: [
        'Medí el rebote por zona y por cliente: suele esconder cuentas que te dan pérdida por re-entregas.',
        'Guardá cómo se accede a cada domicilio (timbre, portería, horario) para no depender de la memoria del chofer.',
        'Pedí una reseña en Google después de cada entrega conforme.',
    ],
    amarillo: [
        'Confirmá la visita la noche anterior por WhatsApp y sacá de la carga al que no puede.',
        'Guardá cómo se accede a cada domicilio para que el dato viaje con la hoja de ruta.',
        'Cuando el chofer marque "ausente", consultá al destinatario en el momento para tener las dos versiones.',
    ],
    rojo: [
        'Dejá de salir sin confirmar: cada entrega que vuelve te cuesta ARS $9.980 entre gasoil, chofer y segundo viaje.',
        'Sacá a administración de contestar "¿dónde está mi pedido?" con un aviso de paradas restantes.',
        'Avisá al destinatario a los 5, 2 y 1 días antes de devolver un paquete.',
    ],
}

const ACCIONES_MELI: Record<Nivel, string[]> = {
    verde: [
        'Revisá una vez por semana tus cancelaciones y demoras: el margen se pierde rápido.',
        'Tené anotado cuántos reclamos te separan del límite para bajar de color.',
        'Si vendés en varios canales, sincronizá el stock para no tener que cancelar.',
    ],
    amarillo: [
        'Revisá los reclamos todos los días antes de las 12: los que deriva el asistente vencen a las 14 h del día hábil siguiente.',
        'Si te falta stock, no mandes otra cosa: demorar suma a demoras (10% de límite), cancelar a cancelaciones (1%).',
        'Calculá cuánto te queda limpio por venta: los cargos de ML cambian seguido.',
    ],
    rojo: [
        'Estás cerca de bajar de color: respondé cada reclamo apenas entra, aunque sea para pedir más datos.',
        'Pausá las publicaciones sin stock real antes de que se vendan: una cancelación pesa más que una demora.',
        'No saques ventas de Mercado Libre para arreglar con el comprador: puede terminar en reclamo o sanción de la cuenta.',
    ],
}

/** Para quien opera 100% Full (el despacho lo hace ML). */
const ACCIONES_FULL = [
    'Mirá tus reclamos todos los días: en Full siguen pesando sobre tu reputación.',
    'Vigilá los quiebres de stock en el depósito: quedarte sin stock en Full también te baja exposición.',
    'Si además vendés por Flex o Colecta, repetí el diagnóstico pensando en ese canal.',
]

const ACCIONES_OTROS: Record<Nivel, string[]> = {
    verde: [
        'Revisá cada semana el cruce entre pagos de WhatsApp y ventas de ML: es lo primero que se rompe cuando crecés.',
        'Reservá la unidad un tiempo fijo (por ejemplo 15 minutos) mientras esperás la transferencia.',
        'Guardá los números de operación de los comprobantes para detectar repetidos.',
    ],
    amarillo: [
        'No bajes el stock al final del día: en esas horas se te puede vender lo mismo en ML.',
        'Validá contra la cuenta, no contra la captura: los comprobantes editados existen.',
        'Juntá en un solo lugar el chat, el comprobante y el envío de cada venta.',
    ],
    rojo: [
        'Cada cancelación por sobreventa te acerca al límite de ML (1% para seguir en verde).',
        'No despaches por la captura de WhatsApp: esperá ver la plata y que el comprobante no esté repetido.',
        'Centralizá la aprobación del pago y la baja de stock en un solo paso.',
    ],
}

/* ============================================================
   Resumen personalizado (por índice de opción, no por texto)
   ============================================================ */

const FRAG_MELI: Record<string, (string | null)[]> = {
    dolor: [
        'Lo que más te complica es enterarte tarde de un reclamo, con el plazo de las 14 h encima.',
        'Lo que más te complica es no saber cuántos reclamos te quedan antes de bajar de color.',
        'Lo que más te complica son los envíos Flex que terminan en reclamo.',
        'Lo que más te complica es vender lo mismo en dos canales y quedarte sin stock.',
        'Lo que más te complica es que lo acreditado no coincide con lo que vendiste.',
        'Lo que más te complica es perseguir comprobantes y bajar el stock a mano.',
        'Lo que más te complica son las devoluciones que vuelven distintas a lo que mandaste: además, cuando son por falla o producto distinto, cuentan como reclamo.',
    ],
    volumen: [
        'Con menos de 50 ventas por mes, ML mide tu reputación sobre los últimos 365 días: cada reclamo te pesa durante un año.',
        'Con 50 a 150 ventas por mes, ML mide tu reputación sobre 60 o 365 días según llegues a 101 ventas en 60 días.',
        'Con 150 a 600 ventas por mes, ML mide tu reputación sobre los últimos 60 días: un par de reclamos seguidos te mueven el color.',
        'Con 600 a 1.500 ventas por mes, ML mide tu reputación sobre los últimos 60 días y cada día entran reclamos nuevos.',
        'Con más de 1.500 ventas por mes, ML mide tu reputación sobre los últimos 60 días y el volumen de reclamos es diario.',
    ],
    reclamos_plazo: [
        'Ya tenés alertas con el plazo exacto.',
        'Revisás el panel de reclamos a mano varias veces por día: funciona, pero te come tiempo.',
        'Te enterás tarde de los reclamos porque el aviso se pierde, y los plazos son cortos.',
        'Ya perdiste reclamos por plazo vencido, y eso pegó en tu reputación.',
    ],
    sin_stock: [
        null,
        'Cuando te falta stock demorás el envío: suma a tus demoras (el límite para seguir en verde es 10%).',
        'Cuando te falta stock cancelás: es la métrica más estricta (1% para seguir en verde).',
        'Arreglar por fuera con el comprador es riesgoso: puede terminar en reclamo, y ML sanciona sacar la venta de la plataforma.',
    ],
    despacho: [null, null, 'Llegar tarde a la colecta seguido suma demoras y te puede bajar exposición.', 'No tenés medidas tus demoras de despacho.'],
    zonas_flex: [
        null,
        'Te suspendieron zonas de Flex por el escaneo: cada día sin esas zonas son ventas que no entran.',
        'Te suspendieron zonas de Flex por demoras o entregas fallidas.',
        'No sabés si tenés zonas de Flex suspendidas: conviene revisarlo hoy.',
    ],
    control_fleteros: [
        null,
        null,
        'No controlás lo que te factura el fletero envío por envío.',
        'Ya te cobraron envíos cancelados o de más.',
    ],
    liquidaciones: [
        null,
        null,
        'No sabés cuánto te queda limpio por venta.',
        'Entre cargos, retenciones e impuestos, ya no seguís cuánto te queda limpio por venta.',
    ],
    costo_reputacion: [
        'Estimás que bajar de color te costaría menos de $800.000 por mes.',
        'Estimás que bajar de color te costaría entre $800.000 y $3.000.000 por mes.',
        'Estimás que bajar de color te costaría más de $3.000.000 por mes.',
        'Todavía no le pusiste número a lo que te costaría bajar de color.',
    ],
}

const FRAG_OTROS: Record<string, (string | null)[]> = {
    mezcla_canales: [
        'Cobrás más de 4 de cada 10 ventas por transferencia: el riesgo de vender dos veces lo mismo es alto.',
        'Una parte importante de tus ventas se cobra por transferencia.',
        'La mayoría de tus ventas entra por canales con pago integrado.',
        null,
    ],
    sobreventa_stock: [
        null,
        'Guardar stock sin publicar te evita sobreventas, pero vendés menos.',
        'Editar las publicaciones a mano con cada pago no aguanta los picos de venta.',
        'Bajar el stock al final del día te deja horas en las que se vende lo mismo en ML.',
    ],
    validacion_comprobantes: [
        null,
        'Chequear repetidos a mano funciona, pero lleva tiempo.',
        'Entrar al banco por cada pedido te frena en plena hora de despacho.',
        'Despachar por la captura te expone a comprobantes editados o que nunca se acreditaron.',
    ],
    reputacion_cancelaciones: [
        null,
        'Conseguir mercadería a las apuradas te come el margen de la venta.',
        'Quedaste al límite de cancelaciones: una más te puede bajar de color.',
        'Ya perdiste el verde por cancelaciones.',
    ],
}

/** Hasta 4 frases: el resto ya aparece en "Lo que encontramos". Si sobran, la de volumen es la primera que sale. */
function construirResumenDesde(frag: Record<string, (string | null)[]>, preguntas: Pregunta[], r: Respuestas) {
    const frases = Object.keys(frag)
        .map((id) => ({ id, texto: frag[id][opcionElegida(preguntas, id, r)] ?? null }))
        .filter((f): f is { id: string; texto: string } => Boolean(f.texto))
    const elegidas = frases.length > 4 ? frases.filter((f) => f.id !== 'volumen') : frases
    return elegidas.slice(0, 4).map((f) => f.texto).join(' ')
}

function construirResumenMeli(r: Respuestas): string {
    if (valorCanalMeli(r) === 'full') {
        return [
            'Operás con Full: el despacho lo hace Mercado Libre, pero los reclamos y la falta de stock siguen pesando sobre tu reputación.',
            FRAG_MELI.reclamos_plazo[opcionElegida(PREGUNTAS_MELI, 'reclamos_plazo', r)] ?? '',
            FRAG_MELI.costo_reputacion[opcionElegida(PREGUNTAS_MELI, 'costo_reputacion', r)] ?? '',
        ]
            .filter(Boolean)
            .join(' ')
    }
    return construirResumenDesde(FRAG_MELI, PREGUNTAS_MELI, r)
}

function construirResumenLogistica(r: Respuestas, entregasDia: number, porcentajeFallos: number): string {
    const econ = calcularEconomiaLogistica(entregasDia, porcentajeFallos)
    const partes: string[] = [
        `Con ${entregasDia} entregas por día y ${porcentajeFallos}% que vuelve al primer intento, son ~${econ.fallosMes} viajes en falso por mes: ${formatearArs(econ.perdidaMensualArs)}.`,
    ]
    const coord = opcionElegida(PREGUNTAS_LOGISTICA, 'coordinacion', r)
    if (coord === 2) partes.push('Los vehículos salen sin confirmar quién va a estar, que es donde se origina la mayoría de los rebotes.')
    if (coord === 1) partes.push('La confirmación depende de mensajes a mano que no llegan a cubrir toda la carga.')
    if (opcionElegida(PREGUNTAS_LOGISTICA, 'evidencia_conflicto', r) === 2)
        partes.push('Ante un "estuve todo el día" no tenés cómo probar la visita, y terminás volviendo a ir.')
    if (opcionElegida(PREGUNTAS_LOGISTICA, 'remitos_rendicion', r) === 2)
        partes.push('Los remitos en papel te atrasan la facturación hasta 2 días.')
    return partes.join(' ')
}

function construirResumen(r: Respuestas, plataforma: Plataforma | null, entregasDia: number, porcentajeFallos: number): string {
    if (plataforma === 'logistica') return construirResumenLogistica(r, entregasDia, porcentajeFallos)
    if (plataforma === 'otros') return construirResumenDesde(FRAG_OTROS, PREGUNTAS_OTROS, r)
    return construirResumenMeli(r)
}

/** Consejos que dependen de una respuesta puntual: van antes que los genéricos del nivel. */
function accionesPuntualesMeli(r: Respuestas): string[] {
    const a: string[] = []
    if (opcionElegida(PREGUNTAS_MELI, 'zonas_flex', r) === 1)
        a.push('Que los cadetes escaneen todos los paquetes en la dirección que tenés cargada en Mis ubicaciones, antes de salir.')
    if ([2, 3].includes(opcionElegida(PREGUNTAS_MELI, 'reclamos_plazo', r)))
        a.push('Revisá los reclamos todos los días antes de las 12: los que deriva el asistente vencen a las 14 h del día hábil siguiente.')
    if (opcionElegida(PREGUNTAS_MELI, 'sin_stock', r) === 3)
        a.push('Si te falta stock, no mandes otra cosa: es preferible demorar y avisar por la mensajería de ML.')
    if (opcionElegida(PREGUNTAS_MELI, 'liquidaciones', r) === 3)
        a.push('Mirá Facturación > Tarifas y pagos > Impuestos: si no estás inscripto en IIBB (por ejemplo, en AGIP) te pueden aplicar percepciones más altas. Consultalo con tu contador.')
    if ([2, 3].includes(opcionElegida(PREGUNTAS_MELI, 'liquidaciones', r)))
        a.push('Revisá los precios que quedan justo arriba de un corte (por ejemplo $15.000): un peso más puede duplicar el costo por unidad que te cobra ML.')
    if (opcionElegida(PREGUNTAS_MELI, 'despacho', r) === 2)
        a.push('Revisá el horario de tu colecta cada semana: ML lo viene cambiando y en algunas zonas suma una segunda.')
    return a
}

function construirAcciones(r: Respuestas, nivel: Nivel, plataforma: Plataforma | null): string[] {
    if (plataforma === 'logistica') return ACCIONES_LOGISTICA[nivel]
    if (plataforma === 'otros') return ACCIONES_OTROS[nivel]
    if (valorCanalMeli(r) === 'full') return ACCIONES_FULL
    const puntuales = accionesPuntualesMeli(r)
    return [...puntuales, ...ACCIONES_MELI[nivel].filter((x) => !puntuales.some((p) => p.slice(0, 30) === x.slice(0, 30)))].slice(0, 3)
}

const CalendlyEmbed = dynamic(() => import('@/components/sitio/CalendlyEmbed').then((m) => m.CalendlyEmbed), {
    ssr: false,
})

const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

/** Mismo envío que el resto del sitio: solo si aceptó cookies. */
function track(evento: string, props?: Record<string, unknown>) {
    trackEvent(evento, props as Parameters<typeof trackEvent>[1])
}

type Paso = 'plataforma' | 'preguntas' | 'resultado' | 'listo'

export function DiagnosticoEnvios() {
    const router = useRouter()
    const [paso, setPaso] = useState<Paso>('plataforma')
    const [plataforma, setPlataforma] = useState<Plataforma | null>(null)
    const [indice, setIndice] = useState(0)
    const [respuestas, setRespuestas] = useState<Respuestas>({})

    // Estado de la calculadora financiera en vivo para Logística / Distribuidoras
    const [entregasDia, setEntregasDia] = useState<number>(100)
    const [porcentajeFallos, setPorcentajeFallos] = useState<number>(10)

    // Números de reputación que el vendedor de ML carga en el paso opcional
    const [reputacion, setReputacion] = useState<DatosReputacion | null>(null)

    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [whatsapp, setWhatsapp] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [error, setError] = useState('')

    const [origen, setOrigen] = useState('directo')
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const paramOrigen = params.get('origen')
        if (paramOrigen) {
            setOrigen(paramOrigen)
            // Pre-asignar sugerencia de plataforma sin saltear la elección del perfil
            if (paramOrigen === 'logistica') {
                setPlataforma('logistica')
            } else if (paramOrigen === 'home_meli') {
                setPlataforma('meli')
            } else if (paramOrigen === 'home_tienda' || paramOrigen === 'ecommerce') {
                setPlataforma('otros')
            }
            // paso queda SIEMPRE en 'plataforma' para que el usuario elija y confirme su perfil
        }
    }, [])

    function salirHaciaAtras() {
        if (
            typeof window !== 'undefined' &&
            window.history.length > 1 &&
            document.referrer &&
            document.referrer.includes(window.location.host)
        ) {
            router.back()
            return
        }
        router.push(origen === 'logistica' ? '/logistica' : '/')
    }

    // Todo se deriva del recorrido activo: nada de acumuladores que se desincronizan.
    const { activas, puntaje, maximo, porcentaje, nivel } = calcular(respuestas, plataforma, reputacion)
    const pregunta = activas[indice]
    const resultado = NIVEL_META[nivel]
    const resumen = construirResumen(respuestas, plataforma, entregasDia, porcentajeFallos)
    const acciones = construirAcciones(respuestas, nivel, plataforma)
    const economiaLogistica = calcularEconomiaLogistica(entregasDia, porcentajeFallos)
    const puntosPorPregunta = Object.fromEntries(
        activas.map((p) => [p.id, p.opciones.find((o) => o.label === respuestas[p.id])?.puntos ?? 0])
    )
    const oferta = plataforma
        ? construirOferta({
              plataforma,
              respuestas,
              puntos: puntosPorPregunta,
              reputacion: plataforma === 'meli' ? reputacion : null,
              perdidaLogisticaMensual: economiaLogistica.perdidaMensualArs,
              foco: PREGUNTAS_MELI.find((q) => q.id === 'dolor')?.opciones.find((o) => o.label === respuestas.dolor)?.tema,
          })
        : null

    function elegirPlataforma(p: Plataforma) {
        setPlataforma(p)
        setIndice(0)
        setRespuestas({})
        setReputacion(null)
        track('diagnostico_plataforma', { plataforma: p, origen })
        // Directo a la primera pregunta en todos los tamaños: la intro era una pantalla más para leer
        track('diagnostico_iniciado', { origen, plataforma: p, sinIntro: true })
        setPaso('preguntas')
    }

    function responder(opcion: Opcion) {
        const nuevas = { ...respuestas, [pregunta.id]: opcion.label }
        setRespuestas(nuevas)

        // Si la opción trae valores de referencia para la calculadora de logística, actualizamos
        if (typeof opcion.calcEntregasDia === 'number') {
            setEntregasDia(opcion.calcEntregasDia)
        }
        if (typeof opcion.calcPorcentajeFallos === 'number') {
            setPorcentajeFallos(opcion.calcPorcentajeFallos)
        }

        track('diagnostico_respuesta', {
            pregunta: pregunta.id,
            respuesta: opcion.label,
            paso: indice + 1,
            plataforma,
        })

        avanzar(nuevas)
    }

    function responderReputacion(datos: DatosReputacion | null) {
        const nuevas = { ...respuestas, [pregunta.id]: datos ? 'cargado' : 'salteado' }
        setRespuestas(nuevas)
        setReputacion(datos)
        track('diagnostico_respuesta', {
            pregunta: pregunta.id,
            respuesta: datos ? 'cargado' : 'salteado',
            paso: indice + 1,
            plataforma,
            ...(datos ? { ventas: datos.ventas, ...datos.conteos, esLider: datos.esLider } : {}),
        })
        avanzar(nuevas, datos)
    }

    function avanzar(nuevas: Respuestas, rep: DatosReputacion | null = reputacion) {
        const info = calcular(nuevas, plataforma, rep)
        if (indice < info.activas.length - 1) {
            setIndice(indice + 1)
        } else {
            track('diagnostico_completado', {
                puntaje: info.puntaje,
                maximo: info.maximo,
                porcentaje: info.porcentaje,
                nivel: info.nivel,
                plataforma,
                canal: nuevas.canal,
                volumen: nuevas.volumen || nuevas.volumen_logistica,
                intencion: nuevas.intencion,
                origen,
                ...(plataforma === 'logistica'
                    ? {
                          entregasDia,
                          porcentajeFallos,
                          perdidaMensualArs: economiaLogistica.perdidaMensualArs,
                      }
                    : {}),
            })
            setPaso('resultado')
        }
    }

    function volver() {
        if (indice === 0) {
            setPaso('plataforma')
            return
        }
        setIndice(indice - 1)
    }

    async function enviar(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        const digitos = whatsapp.replace(/\D/g, '')
        if (!email.trim() && digitos.length < 8) {
            setError('Dejanos tu WhatsApp o tu email para mandarte el informe.')
            return
        }
        setEnviando(true)
        try {
            const res = await fetch('/api/diagnostico', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contacto: { nombre, email, whatsapp },
                    puntaje,
                    puntajeMaximo: maximo,
                    porcentaje,
                    nivel,
                    respuestas,
                    origen,
                    plataforma,
                    calculadora:
                        plataforma === 'logistica' ? economiaLogistica : null,
                    reputacion: plataforma === 'meli' ? reputacion : null,
                    planRecomendado: oferta?.plan.nombre ?? null,
                }),
            })
            if (!res.ok) throw new Error('No se pudo enviar')
            track('diagnostico_contacto', {
                nivel,
                puntaje,
                porcentaje,
                intencion: respuestas.intencion,
                origen,
                plataforma,
                ...(plataforma === 'logistica'
                    ? {
                          entregasDia,
                          porcentajeFallos,
                          perdidaMensualArs: economiaLogistica.perdidaMensualArs,
                      }
                    : {}),
            })
            setPaso('listo')
        } catch {
            setError('No pudimos enviarlo. Probá de nuevo en un momento.')
        } finally {
            setEnviando(false)
        }
    }

    // Desktop: se puede responder con las teclas de las letras (A, B, C…)
    useEffect(() => {
        if (paso !== 'preguntas' || !pregunta || pregunta.tipo === 'reputacion') return
        const alTeclear = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.altKey) return
            const destino = e.target as HTMLElement | null
            if (destino && (destino.tagName === 'INPUT' || destino.tagName === 'TEXTAREA' || destino.isContentEditable)) return
            const i = LETRAS.indexOf(e.key.toUpperCase())
            if (i >= 0 && i < pregunta.opciones.length) {
                e.preventDefault()
                responder(pregunta.opciones[i])
            }
        }
        window.addEventListener('keydown', alTeclear)
        return () => window.removeEventListener('keydown', alTeclear)
    })

    const PERFILES = [
        {
            id: 'meli',
            titulo: 'Vendo en Mercado Libre',
            detalle: 'Reclamos, reputación y envíos',
            img: { src: '/3d/icono-velocimetro.png', w: 560, h: 382 },
            sugerido: origen === 'home_meli' || origen === 'directo',
        },
        {
            id: 'otros',
            titulo: 'Cobro por WhatsApp con transferencia',
            detalle: 'Comprobantes y stock entre canales',
            img: { src: '/3d/ecommerce/pago-check.webp', w: 512, h: 501 },
            sugerido: origen === 'home_tienda' || origen === 'ecommerce',
        },
        {
            id: 'logistica',
            titulo: 'Tengo una logística o reparto',
            detalle: 'Entregas fallidas y avisos al cliente',
            img: { src: '/3d/ilustracion-reparto.png', w: 900, h: 522 },
            sugerido: origen === 'logistica',
        },
    ] as const

    const waListo = `https://wa.me/5491160152435?text=${encodeURIComponent(
        `Hola Gabriel, terminé el autodiagnóstico de INDIVIDRA${oferta ? ` (me recomendó el ${oferta.plan.nombre})` : ''} y quiero coordinar el diagnóstico de 30 minutos.`
    )}`

    return (
        <main id="main-content" className="min-h-screen bg-[#0B0D0E] text-[#E8E5DE]">
            {paso === 'plataforma' && (
                <div className="fixed top-5 left-5 lg:top-6 lg:left-8 z-[100] flex items-center gap-3">
                    <button
                        type="button"
                        onClick={salirHaciaAtras}
                        className="flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                        aria-label="Volver atrás"
                    >
                        <ArrowRight className="w-4 h-4 text-neutral-300 rotate-180" />
                    </button>
                    <Image
                        src="/logo-individra-rebrand.png"
                        alt="INDIVIDRA"
                        width={640}
                        height={125}
                        sizes="200px"
                        className="hidden lg:block h-9 w-auto"
                    />
                </div>
            )}

            <div
                className={`mx-auto flex min-h-screen w-full max-w-4xl lg:max-w-6xl flex-col px-5 pt-5 pb-12 sm:px-6 lg:px-8 ${
                    paso === 'plataforma' || paso === 'listo' ? 'lg:justify-center lg:py-20' : 'lg:pt-14 lg:pb-20'
                }`}
            >
                <AnimatePresence mode="wait">
                    {/* ------------------------------------------- PLATAFORMA */}
                    {paso === 'plataforma' && (
                        <motion.div
                            key="plataforma"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.35 }}
                            className="w-full pt-12 lg:pt-0"
                        >
                            <div className="lg:text-center lg:max-w-2xl lg:mx-auto">
                                <p className="text-[11px] lg:text-xs font-mono uppercase tracking-[0.16em] text-[#FFA380]">
                                    Autodiagnóstico gratis · 2 minutos
                                </p>
                                <h1 className="mt-2 lg:mt-4 text-[1.75rem] lg:text-[3rem] font-heading font-extrabold text-white leading-[1.15] lg:leading-[1.05] tracking-tight">
                                    ¿Qué querés revisar?
                                </h1>
                                <p className="mt-2 lg:mt-4 text-sm lg:text-lg text-neutral-400">
                                    Sin conectar tu cuenta. Al final ves tu resultado y qué hacer.
                                </p>
                            </div>
                            <div className="mt-6 lg:mt-12 space-y-3 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-5">
                                {PERFILES.map((o, i) => (
                                    <motion.button
                                        key={o.id}
                                        type="button"
                                        onClick={() => elegirPlataforma(o.id)}
                                        initial={{ opacity: 0, y: 14 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.45, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
                                        className={`group relative w-full flex items-center gap-4 rounded-2xl lg:rounded-3xl border p-4 lg:p-7 text-left active:scale-[0.99] transition-[border-color,background-color,box-shadow,transform] lg:flex-col lg:items-start lg:gap-0 lg:hover:-translate-y-1 ${
                                            o.sugerido
                                                ? 'border-[#FF5520]/70 bg-[#FF5520]/[0.08] lg:shadow-[0_20px_50px_-20px_rgba(255,85,32,0.45)]'
                                                : 'border-white/10 bg-white/[0.03] lg:hover:border-[#FF5520]/50 lg:hover:bg-white/[0.05]'
                                        }`}
                                    >
                                        {o.sugerido && (
                                            <span className="hidden lg:block absolute top-5 right-5 rounded-full bg-[#D4430E] px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-white">
                                                Sugerido
                                            </span>
                                        )}
                                        <Image
                                            src={o.img.src}
                                            alt=""
                                            aria-hidden
                                            width={o.img.w}
                                            height={o.img.h}
                                            sizes="(min-width: 1024px) 144px, 64px"
                                            className="w-14 h-14 lg:w-auto lg:h-24 lg:max-w-[150px] shrink-0 object-contain lg:object-left drop-shadow-[0_12px_28px_rgba(200,66,20,0.3)] lg:transition-transform lg:duration-300 lg:group-hover:scale-105"
                                        />
                                        <span className="flex-1 lg:mt-6">
                                            <span className="block font-heading font-bold text-white leading-snug lg:text-xl">{o.titulo}</span>
                                            <span className="block mt-0.5 lg:mt-1.5 text-sm lg:text-base text-neutral-400">{o.detalle}</span>
                                        </span>
                                        <ChevronRight className="w-5 h-5 shrink-0 text-[#FF5520] lg:hidden" />
                                        <span className="hidden lg:flex mt-6 items-center gap-1.5 text-sm font-semibold text-[#FFA380] group-hover:text-white transition-colors">
                                            Empezar
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden />
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                            <ul className="hidden lg:flex mt-10 items-center justify-center gap-8 text-sm text-neutral-400">
                                {['Sin registrarte', 'Sin conectar tu cuenta', 'Resultado al instante'].map((t) => (
                                    <li key={t} className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#FF5520]" aria-hidden />
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}

                    {/* ------------------------------------------ PREGUNTAS */}
                    {paso === 'preguntas' && pregunta && (
                        <motion.div
                            key="preguntas"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="w-full lg:grid lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px] lg:gap-12 xl:gap-16 lg:items-start"
                        >
                            <div className="lg:max-w-2xl">
                                {/* Progreso */}
                                <div className="mb-6 lg:mb-10">
                                    <div className="mb-2.5 flex items-center justify-between gap-3 font-mono text-xs text-[#8E8B88]">
                                        <button
                                            type="button"
                                            onClick={volver}
                                            aria-label="Volver"
                                            className="flex items-center gap-1.5 -ml-1 py-1.5 pr-2 text-neutral-300 transition-colors hover:text-white"
                                        >
                                            <ArrowRight className="w-4 h-4 rotate-180" />
                                            <span>Volver</span>
                                        </button>
                                        <span>
                                            {indice + 1} de {activas.length}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setPaso('plataforma')}
                                            className="hidden lg:inline transition-colors hover:text-[#FFA380]"
                                        >
                                            Cambiar perfil
                                        </button>
                                    </div>
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-[#FF5520] via-[#FF6E40] to-emerald-400"
                                            initial={false}
                                            animate={{ width: `${((indice + 1) / activas.length) * 100}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                </div>

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={`p-${indice}`}
                                        initial={{ opacity: 0, x: 24 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -24 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        {indice === 0 && (
                                            <p className="mb-2 text-[11px] font-mono uppercase tracking-[0.16em] text-[#FFA380]">
                                                2 minutos · sin conectar tu cuenta
                                            </p>
                                        )}
                                        <h2 className="font-heading text-[1.4rem] lg:text-[2rem] font-extrabold text-white leading-snug lg:leading-tight tracking-tight">
                                            {pregunta.titulo}
                                        </h2>
                                        {pregunta.ayuda && (
                                            <p className="mt-2 lg:mt-3 text-sm lg:text-base text-neutral-400 leading-relaxed">{pregunta.ayuda}</p>
                                        )}

                                        {pregunta.tipo === 'reputacion' ? (
                                            <PasoReputacion
                                                onContinuar={(datos) => responderReputacion(datos)}
                                                onSaltear={() => responderReputacion(null)}
                                            />
                                        ) : (
                                            <div className="mt-5 lg:mt-8 flex flex-col gap-2.5 lg:gap-3">
                                                {pregunta.opciones.map((opcion, optIdx) => {
                                                    const elegida = respuestas[pregunta.id] === opcion.label
                                                    return (
                                                        <button
                                                            key={opcion.label}
                                                            type="button"
                                                            onClick={() => responder(opcion)}
                                                            aria-keyshortcuts={LETRAS[optIdx]}
                                                            className={`group relative flex items-center justify-between gap-3 lg:gap-4 rounded-2xl border card-obsidian sheen-top bg-gradient-to-r from-[#14161A] via-[#111316] to-[#0D0F12] px-4 py-3.5 lg:px-5 lg:py-4 min-h-[56px] text-left text-[15px] lg:text-base leading-snug transition-all duration-200 hover:border-[#FF5520]/60 hover:from-[#1A1D23] hover:to-[#14161A] hover:shadow-[0_4px_25px_-5px_rgba(255,85,32,0.25)] cursor-pointer active:scale-[0.99] ${
                                                                elegida ? 'border-[#FF5520]/70' : 'border-white/[0.10]'
                                                            }`}
                                                        >
                                                            <div className="flex items-start gap-3.5">
                                                                <span
                                                                    className={`shrink-0 w-6 h-6 lg:w-7 lg:h-7 rounded-md border font-mono text-xs font-bold flex items-center justify-center transition-colors group-hover:text-white group-hover:bg-[#D4430E] group-hover:border-[#D4430E] ${
                                                                        elegida
                                                                            ? 'bg-[#D4430E] border-[#D4430E] text-white'
                                                                            : 'bg-white/[0.06] border-white/10 text-neutral-400'
                                                                    }`}
                                                                >
                                                                    {LETRAS[optIdx] || optIdx + 1}
                                                                </span>
                                                                <span className="text-neutral-200 group-hover:text-white font-medium transition-colors lg:pt-0.5">
                                                                    {opcion.label}
                                                                </span>
                                                            </div>
                                                            <ChevronRight className="w-4 h-4 text-[#8C8C8C] group-hover:text-[#FFA380] group-hover:translate-x-1 shrink-0 transition-all" />
                                                        </button>
                                                    )
                                                })}
                                                <p className="hidden lg:block mt-2 text-xs text-[#8C8C8C]">
                                                    Tip: también podés responder con las teclas{' '}
                                                    {LETRAS.slice(0, pregunta.opciones.length).map((l, i) => (
                                                        <span key={l}>
                                                            <kbd className="mx-0.5 rounded border border-white/15 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[11px] text-neutral-300">
                                                                {l}
                                                            </kbd>
                                                            {i < pregunta.opciones.length - 1 ? '' : '.'}
                                                        </span>
                                                    ))}
                                                </p>
                                            </div>
                                        )}

                                        {/* En las preguntas de volumen o rebote de logística, la calculadora en vivo */}
                                        {plataforma === 'logistica' &&
                                            (pregunta.id === 'volumen_logistica' || pregunta.id === 'rebote') && (
                                                <div className="mt-7">
                                                    <CalculadoraFinancieraViva
                                                        entregasDia={entregasDia}
                                                        setEntregasDia={setEntregasDia}
                                                        porcentajeFallos={porcentajeFallos}
                                                        setPorcentajeFallos={setPorcentajeFallos}
                                                        compacta
                                                    />
                                                </div>
                                            )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Desktop: el resultado se va armando al costado */}
                            <PanelEnVivo
                                activas={activas}
                                respuestas={respuestas}
                                indice={indice}
                                perdidaMensual={plataforma === 'logistica' ? economiaLogistica.perdidaMensualArs : null}
                                onIr={(i) => setIndice(i)}
                            />
                        </motion.div>
                    )}

                    {/* ------------------------------------------ RESULTADO */}
                    {paso === 'resultado' && (
                        <motion.div
                            key="resultado"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="w-full lg:grid lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px] lg:grid-rows-[repeat(5,auto)_1fr] lg:gap-x-12 xl:gap-x-16 lg:items-start"
                        >
                            <button
                                type="button"
                                onClick={() => setPaso('preguntas')}
                                className="mb-4 lg:mb-6 inline-flex items-center gap-1.5 py-1.5 font-mono text-xs text-neutral-300 transition-colors hover:text-white lg:col-start-1 lg:justify-self-start"
                            >
                                <ArrowRight className="w-4 h-4 rotate-180" />
                                Volver a las preguntas
                            </button>

                            {/* 1. Veredicto */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="rounded-3xl border p-5 sm:p-8 lg:col-start-1"
                                style={{ borderColor: `${resultado.color}88`, background: resultado.bg }}
                            >
                                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-300">
                                    Tu diagnóstico
                                </span>
                                <h2
                                    className="mt-1 font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight"
                                    style={{ color: resultado.color }}
                                >
                                    {resultado.titulo}
                                </h2>
                                <div className="mt-3 lg:mt-5 h-2 rounded-full bg-black/40 overflow-hidden" aria-hidden>
                                    <motion.div
                                        className="h-full rounded-full"
                                        initial={{ width: '0%' }}
                                        animate={{ width: `${Math.max(6, porcentaje)}%` }}
                                        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                        style={{ backgroundColor: resultado.color }}
                                    />
                                </div>
                                {resumen && (
                                    <p className="mt-4 lg:mt-5 text-[15px] lg:text-lg leading-relaxed text-neutral-100">{resumen}</p>
                                )}
                            </motion.div>

                            {/* 2. Los números reales mandan */}
                            {plataforma === 'meli' && reputacion && (
                                <div className="lg:col-start-1">
                                    <MargenResultado datos={reputacion} />
                                </div>
                            )}

                            {plataforma === 'logistica' && (
                                <div className="mt-6 lg:col-start-1">
                                    <CalculadoraFinancieraViva
                                        entregasDia={entregasDia}
                                        setEntregasDia={setEntregasDia}
                                        porcentajeFallos={porcentajeFallos}
                                        setPorcentajeFallos={setPorcentajeFallos}
                                        compacta
                                    />
                                </div>
                            )}

                            {/* 3. Qué encontramos y cómo se resuelve */}
                            {oferta && (
                                <div className="lg:col-start-1">
                                    <h3 className="mt-8 lg:mt-10 text-xl lg:text-2xl font-extrabold font-heading text-white tracking-tight">
                                        Lo que encontramos
                                    </h3>
                                    <HallazgosLista oferta={oferta} />
                                </div>
                            )}

                            {/* 4. Contacto: WhatsApp primero, email opcional. En desktop, fijo a la derecha */}
                            <div className="mt-8 lg:mt-0 lg:col-start-2 lg:row-start-1 lg:row-span-6 lg:self-stretch">
                                <div className="lg:sticky lg:top-10 rounded-3xl border border-white/[0.12] bg-gradient-to-br from-[#16181C] via-[#111316] to-[#0A0C0E] p-5 sm:p-8 lg:p-7 shadow-2xl">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src="/gabriel-cacabelos.jpg"
                                            alt="Gabriel Cacabelos"
                                            width={480}
                                            height={480}
                                            quality={95}
                                            sizes="56px"
                                            className="w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover border-2 border-[#FF5520]/50"
                                        />
                                        <div>
                                            <h3 className="text-lg sm:text-2xl font-extrabold font-heading text-white leading-tight tracking-tight">
                                                ¿Lo revisamos juntos?
                                            </h3>
                                            <p className="text-xs text-neutral-400">Te escribe Gabriel, el fundador. No es un bot.</p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm leading-relaxed text-neutral-300">
                                        {plataforma === 'logistica'
                                            ? 'Te mando este cálculo y coordinamos 30 minutos para ver cómo filtrar ausencias en tu operación, sin apps para los choferes.'
                                            : 'Te mando este informe y coordinamos 30 minutos para mirar tu cuenta con vos. Sin compromiso.'}
                                    </p>

                                    <form onSubmit={enviar} className="mt-5 flex flex-col gap-3">
                                        <label className="sr-only" htmlFor="diag-nombre">Tu nombre</label>
                                        <input
                                            id="diag-nombre"
                                            type="text"
                                            autoComplete="name"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            placeholder="Tu nombre"
                                            className="rounded-xl border border-white/10 bg-black/60 px-4 py-3.5 text-base text-white outline-none placeholder:text-neutral-500 focus:border-[#FF5520]"
                                        />
                                        <label className="sr-only" htmlFor="diag-whatsapp">Tu WhatsApp</label>
                                        <input
                                            id="diag-whatsapp"
                                            type="tel"
                                            inputMode="tel"
                                            autoComplete="tel"
                                            value={whatsapp}
                                            onChange={(e) => setWhatsapp(e.target.value)}
                                            placeholder="Tu WhatsApp (ej: 11 2345 6789)"
                                            className="rounded-xl border border-white/10 bg-black/60 px-4 py-3.5 text-base text-white outline-none placeholder:text-neutral-500 focus:border-[#FF5520]"
                                        />
                                        <label className="sr-only" htmlFor="diag-email">Tu email (opcional)</label>
                                        <input
                                            id="diag-email"
                                            type="email"
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Tu email (opcional)"
                                            className="rounded-xl border border-white/10 bg-black/60 px-4 py-3.5 text-base text-white outline-none placeholder:text-neutral-500 focus:border-[#FF5520]"
                                        />
                                        {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
                                        <button
                                            type="submit"
                                            disabled={enviando}
                                            className="mt-1 rounded-2xl bg-[#D4430E] hover:bg-[#BF3A0B] px-6 py-4 text-base font-bold font-heading text-white shadow-[0_4px_25px_rgba(255,85,32,0.35)] disabled:opacity-60 transition"
                                        >
                                            {enviando ? 'Enviando…' : 'Quiero que me escriban'}
                                        </button>
                                        <p className="text-[11px] text-[#8C8C8C] text-center">
                                            Usamos tus datos solo para contactarte por este diagnóstico.
                                        </p>
                                    </form>
                                    <div className="hidden lg:block mt-5 pt-5 border-t border-white/10 text-center text-sm text-neutral-400">
                                        ¿Preferís hablar ahora?{' '}
                                        <a href={waListo} target="_blank" rel="noopener noreferrer" className="text-[#FFA380] hover:text-white underline underline-offset-2 transition-colors">
                                            Escribile por WhatsApp
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* 5. Más detalle, para el que lo quiera */}
                            <div className="mt-6 lg:mt-8 space-y-3 lg:col-start-1">
                                {oferta && (
                                    <details className="group rounded-2xl border border-white/10 bg-white/[0.03]">
                                        <summary className="cursor-pointer list-none flex items-center justify-between gap-3 p-4 lg:p-5 font-semibold text-white">
                                            Cómo seguiría y cuánto cuesta
                                            <ChevronRight className="w-4 h-4 text-[#FF5520] transition-transform group-open:rotate-90" />
                                        </summary>
                                        <div className="px-3 pb-3 sm:px-4 sm:pb-4">
                                            <PlanRecomendado oferta={oferta} />
                                        </div>
                                    </details>
                                )}
                                <details className="group rounded-2xl border border-white/10 bg-white/[0.03]">
                                    <summary className="cursor-pointer list-none flex items-center justify-between gap-3 p-4 lg:p-5 font-semibold text-white">
                                        3 cosas que podés hacer hoy, por tu cuenta
                                        <ChevronRight className="w-4 h-4 text-[#FF5520] transition-transform group-open:rotate-90" />
                                    </summary>
                                    <ol className="px-4 pb-4 lg:px-5 lg:pb-5 flex flex-col gap-3">
                                        {acciones.map((accion, i) => (
                                            <li key={i} className="flex gap-3">
                                                <span className="font-mono text-xs font-bold text-[#FFA380] bg-[#FF5520]/15 border border-[#FF5520]/30 px-1.5 py-0.5 rounded-md shrink-0 h-fit">
                                                    {String(i + 1).padStart(2, '0')}
                                                </span>
                                                <span className="text-sm leading-relaxed text-neutral-200">{accion}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </details>
                            </div>
                        </motion.div>
                    )}

                    {/* ---------------------------------------------- LISTO */}
                    {paso === 'listo' && (
                        <motion.div
                            key="listo"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="w-full text-center"
                        >
                            <motion.div
                                initial={{ scale: 0.6, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                                className="mx-auto mt-16 lg:mt-0 w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center"
                            >
                                <CheckCircle2 className="w-7 h-7 text-emerald-400" aria-hidden />
                            </motion.div>
                            <h2 className="mt-5 text-3xl font-bold font-heading sm:text-4xl text-white">Listo, recibido.</h2>
                            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#B7B3B0]">
                                Te escribimos a la brevedad para revisar los números juntos. Si no querés esperar,
                                escribinos ahora o elegí un horario:
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4">
                                <a
                                    href={waListo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:brightness-110 px-6 py-3.5 text-sm font-bold font-heading text-[#0B0D0E] transition"
                                >
                                    Escribir por WhatsApp
                                </a>
                                <a
                                    href="https://calendly.com/individratec/30min"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="lg:hidden inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4430E] px-6 py-3.5 text-sm font-bold font-heading text-white"
                                >
                                    Elegir horario (30 min)
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                                <Link
                                    href={plataforma === 'logistica' ? '/logistica' : '/'}
                                    className="inline-flex items-center justify-center rounded-xl border border-[#3E3D3A] px-6 py-3.5 text-sm font-semibold transition-colors hover:border-[#FF5520]"
                                >
                                    {plataforma === 'logistica' ? 'Ver solución de Logística' : 'Volver al inicio'}
                                </Link>
                            </div>
                            {/* Desktop: la agenda a la vista, para cerrar el horario sin salir */}
                            <div className="hidden lg:block mt-12 max-w-3xl mx-auto text-left">
                                <CalendlyEmbed seccion="diagnostico_listo" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    )
}

/** Desktop: progreso, respuestas (para corregir) y lo que viene al final. */
function PanelEnVivo({
    activas,
    respuestas,
    indice,
    perdidaMensual,
    onIr,
}: {
    activas: Pregunta[]
    respuestas: Respuestas
    indice: number
    perdidaMensual: number | null
    onIr: (i: number) => void
}) {
    const avance = Math.round((indice / activas.length) * 100)
    const textoRespuesta = (p: Pregunta) => {
        const r = respuestas[p.id]
        if (p.tipo === 'reputacion') return r === 'cargado' ? 'Cargaste tus números de reputación' : 'Sin números por ahora'
        return r
    }
    return (
        <aside aria-label="Tu resultado se va armando" className="hidden lg:block lg:sticky lg:top-10">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6">
                <div className="flex items-baseline justify-between gap-3">
                    <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#FFA380]">Tu resultado se va armando</p>
                    <span className="font-mono text-sm font-bold text-white tabular-nums">{avance}%</span>
                </div>
                <div className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#FF5520] to-emerald-400"
                        initial={false}
                        animate={{ width: `${Math.max(3, avance)}%` }}
                        transition={{ duration: 0.4 }}
                    />
                </div>

                {perdidaMensual !== null && (
                    <div className="mt-5 rounded-2xl border border-[#FF5520]/40 bg-[#FF5520]/10 p-4">
                        <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-300">Fuga estimada por mes</p>
                        <motion.p
                            key={perdidaMensual}
                            initial={{ opacity: 0.4, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-1 font-mono text-2xl font-bold text-[#FF6E40] tabular-nums"
                        >
                            {formatearArs(perdidaMensual)}
                        </motion.p>
                        <p className="mt-0.5 text-[11px] text-neutral-400">Se ajusta con tus respuestas</p>
                    </div>
                )}

                <ol className="mt-5 space-y-1">
                    {activas.map((p, i) => {
                        const hecha = i < indice
                        const actual = i === indice
                        return (
                            <li key={p.id}>
                                <button
                                    type="button"
                                    disabled={!hecha}
                                    onClick={() => onIr(i)}
                                    title={hecha ? 'Cambiar esta respuesta' : undefined}
                                    className={`group w-full flex items-start gap-3 rounded-xl px-2.5 py-2 text-left transition-colors ${
                                        hecha ? 'hover:bg-white/[0.05] cursor-pointer' : 'cursor-default'
                                    }`}
                                >
                                    <span
                                        className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center border text-[10px] font-mono font-bold ${
                                            hecha
                                                ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-300'
                                                : actual
                                                  ? 'border-[#FF5520] text-[#FFA380]'
                                                  : 'border-white/15 text-[#8C8C8C]'
                                        }`}
                                        aria-hidden
                                    >
                                        {hecha ? '✓' : i + 1}
                                    </span>
                                    <span
                                        className={`text-sm leading-snug line-clamp-2 ${
                                            hecha ? 'text-neutral-200 group-hover:text-white' : actual ? 'text-white font-medium' : 'text-[#8C8C8C]'
                                        }`}
                                    >
                                        {hecha ? textoRespuesta(p) : actual ? 'Respondiendo ahora…' : `Pregunta ${i + 1}`}
                                    </span>
                                </button>
                            </li>
                        )
                    })}
                </ol>

                <div className="mt-5 pt-5 border-t border-white/10">
                    <p className="text-sm font-semibold text-white">Al terminar vas a ver</p>
                    <ul className="mt-2.5 space-y-2 text-sm text-neutral-400">
                        {['Tu nivel de riesgo', 'Lo que encontramos en tu operación', '3 cosas para hacer hoy'].map((t) => (
                            <li key={t} className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#FF5520] shrink-0" aria-hidden />
                                {t}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <p className="mt-3 text-center text-xs text-[#8C8C8C]">Sin conectar tu cuenta · Sin registrarte</p>
        </aside>
    )
}
