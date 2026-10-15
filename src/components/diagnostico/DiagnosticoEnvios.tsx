'use client'

import { useEffect, useState } from 'react'
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

/** Mismo envío que el resto del sitio: solo si aceptó cookies. */
function track(evento: string, props?: Record<string, unknown>) {
    trackEvent(evento, props as Parameters<typeof trackEvent>[1])
}

type Paso = 'plataforma' | 'intro' | 'preguntas' | 'resultado' | 'listo'

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
        // En el celular vamos directo a la primera pregunta: la intro es una pantalla más para leer
        if (window.matchMedia('(max-width: 767px)').matches) {
            track('diagnostico_iniciado', { origen, plataforma: p, sinIntro: true })
            setPaso('preguntas')
            return
        }
        setPaso('intro')
    }

    function empezar() {
        track('diagnostico_iniciado', { origen, plataforma })
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
            // En el celular no hay intro: volvemos a la elección de perfil
            setPaso(window.matchMedia('(max-width: 767px)').matches ? 'plataforma' : 'intro')
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

    return (
        <main id="main-content" className="min-h-screen bg-[#0B0D0E] text-[#E8E5DE]">
            {(paso === 'plataforma' || paso === 'intro') && (
            <button
                type="button"
                onClick={salirHaciaAtras}
                className="fixed top-5 left-5 md:top-6 md:left-6 z-[100] flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                aria-label="Volver atrás"
            >
                <ArrowRight className="w-4 h-4 text-neutral-300 rotate-180" />
            </button>
            )}

            <div className="mx-auto flex min-h-screen max-w-4xl flex-col justify-start md:justify-center px-5 pt-5 pb-12 md:py-16 sm:px-6">
                <AnimatePresence mode="wait">
                    {/* ------------------------------------------- PLATAFORMA */}
                    {paso === 'plataforma' && (
                        <motion.div
                            key="plataforma"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.35 }}
                            className="w-full"
                        >
                            {/* Celular: tres opciones de un toque */}
                            <div className="md:hidden pt-12">
                                <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#FFA380]">
                                    Autodiagnóstico gratis · 2 minutos
                                </p>
                                <h1 className="mt-2 text-[1.75rem] font-heading font-extrabold text-white leading-[1.15] tracking-tight">
                                    ¿Qué querés revisar?
                                </h1>
                                <p className="mt-2 text-sm text-neutral-400">
                                    Sin conectar tu cuenta. Al final ves tu resultado y qué hacer.
                                </p>
                                <div className="mt-6 space-y-3">
                                    {(
                                        [
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
                                    ).map((o) => (
                                        <button
                                            key={o.id}
                                            type="button"
                                            onClick={() => elegirPlataforma(o.id)}
                                            className={`w-full flex items-center gap-4 rounded-2xl border p-4 text-left active:scale-[0.99] transition ${
                                                o.sugerido
                                                    ? 'border-[#FF5520]/70 bg-[#FF5520]/[0.08]'
                                                    : 'border-white/10 bg-white/[0.03]'
                                            }`}
                                        >
                                            <Image
                                                src={o.img.src}
                                                alt=""
                                                aria-hidden
                                                width={o.img.w}
                                                height={o.img.h}
                                                sizes="64px"
                                                className="w-14 h-14 shrink-0 object-contain"
                                            />
                                            <span className="flex-1">
                                                <span className="block font-heading font-bold text-white leading-snug">{o.titulo}</span>
                                                <span className="block mt-0.5 text-sm text-neutral-400">{o.detalle}</span>
                                            </span>
                                            <ChevronRight className="w-5 h-5 shrink-0 text-[#FF5520]" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="hidden md:block text-center sm:text-left">
                                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5520]/10 border border-[#FF5520]/30 text-[#FFA380] text-xs font-mono uppercase tracking-[0.18em]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5520] animate-ping" />
                                    Paso 1 de 2 · Selección de Perfil Operativo
                                </span>
                                <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white leading-tight tracking-tight">
                                    ¿Cuál es tu{' '}
                                    <span className="bg-gradient-to-r from-[#FF5520] via-[#FFA380] to-white bg-clip-text text-transparent">
                                        operación principal?
                                    </span>
                                </h1>
                                <p className="mt-3 text-sm sm:text-base leading-relaxed text-neutral-300 max-w-2xl font-sans">
                                    Para que las métricas, el cálculo de fugas financieras y las recomendaciones de auditoría se ajusten a tu realidad operativa, elegí tu vertical:
                                </p>
                            </div>

                            <div className="mt-8 hidden md:grid md:grid-cols-2 gap-6">
                                {/* CARD 1: VENDEDOR E-COMMERCE & MULTICANAL */}
                                <div
                                    className={`relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl border transition-all duration-300 card-obsidian sheen-top bg-gradient-to-br from-[#16181C] via-[#111316] to-[#0A0C0E] ${
                                        origen === 'ecommerce' || origen === 'home_meli' || origen === 'home_tienda'
                                            ? 'border-[#FF5520] shadow-[0_0_35px_-10px_rgba(255,85,32,0.35)] ring-1 ring-[#FF5520]/60'
                                            : 'border-white/[0.10] hover:border-[#FF5520]/60 hover:shadow-2xl'
                                    }`}
                                >
                                    {(origen === 'ecommerce' || origen === 'home_meli' || origen === 'home_tienda') && (
                                        <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#FF5520] text-white font-mono text-[10px] font-bold tracking-wider uppercase shadow-md shadow-[#FF5520]/30">
                                            💡 Sugerido según tu navegación
                                        </div>
                                    )}

                                    <div>
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div>
                                                <span className="font-mono text-[11px] font-bold tracking-wider px-3 py-1 rounded-md bg-[#FF5520]/15 border border-[#FF5520]/30 text-[#FFA380] uppercase">
                                                    VENTA ONLINE & RETAIL
                                                </span>
                                                <h2 className="text-xl sm:text-2xl font-bold font-heading text-white mt-3 leading-snug tracking-tight">
                                                    Vendedor de Mercado Libre y e-commerce
                                                </h2>
                                            </div>
                                            <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/[0.04] border border-white/10 p-2 flex items-center justify-center shadow-inner">
                                                <Image
                                                    src="/3d/icono-escudo-lock.png"
                                                    alt="E-Commerce"
                                                    width={96}
                                                    height={96}
                                                    className="w-full h-full object-contain drop-shadow-[0_6px_14px_rgba(255,85,32,0.35)]"
                                                />
                                            </div>
                                        </div>

                                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-5 font-sans">
                                            Vendés en Mercado Libre, Tiendanube o Shopify, y quizás también cobrás por transferencia en WhatsApp e Instagram.
                                        </p>

                                        <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.08] space-y-2.5 mb-6">
                                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFA380] block font-bold">
                                                ¿Qué evalúa este diagnóstico?
                                            </span>
                                            <ul className="space-y-2 text-xs text-neutral-200 font-mono">
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5520] shrink-0 mt-0.5" />
                                                    <span>Cuántos reclamos te quedan antes de bajar de color</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5520] shrink-0 mt-0.5" />
                                                    <span>Cómo te enterás de los reclamos y con qué pruebas los respondés</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5520] shrink-0 mt-0.5" />
                                                    <span>Sobreventas y comprobantes si también cobrás por WhatsApp</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                                        <button
                                            type="button"
                                            onClick={() => elegirPlataforma('meli')}
                                            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#FF5520] via-[#FF6E40] to-[#FF5520] hover:brightness-110 text-white font-heading font-bold text-xs flex items-center justify-between transition-all cursor-pointer group shadow-[0_4px_20px_rgba(255,85,32,0.35)]"
                                        >
                                            <div className="text-left">
                                                <div className="font-bold text-sm">Vendo en Mercado Libre</div>
                                                <div className="text-[10px] text-white/90 font-mono font-normal">Reclamos, reputación y Envíos Flex</div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => elegirPlataforma('otros')}
                                            className="w-full py-2.5 px-3.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.07] text-neutral-300 hover:text-white font-medium text-xs flex items-center justify-between transition-colors cursor-pointer"
                                        >
                                            <div className="text-left">
                                                <div className="font-semibold text-white">Cobro mucho por WhatsApp con transferencia</div>
                                                <div className="text-[10px] text-neutral-400 font-mono">Venta Blindada: cobro y stock cruzado entre canales</div>
                                            </div>
                                            <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
                                        </button>
                                    </div>
                                </div>

                                {/* CARD 2: LOGÍSTICA DE ÚLTIMA MILLA & FLEX */}
                                <div
                                    className={`relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl border transition-all duration-300 card-obsidian sheen-top bg-gradient-to-br from-[#16181C] via-[#111316] to-[#0A0C0E] ${
                                        origen === 'logistica'
                                            ? 'border-[#FF5520] shadow-[0_0_35px_-10px_rgba(255,85,32,0.35)] ring-1 ring-[#FF5520]/60'
                                            : 'border-white/[0.10] hover:border-[#FF5520]/60 hover:shadow-2xl'
                                    }`}
                                >
                                    {origen === 'logistica' && (
                                        <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#FF5520] text-white font-mono text-[10px] font-bold tracking-wider uppercase shadow-md shadow-[#FF5520]/30">
                                            💡 Sugerido según tu navegación
                                        </div>
                                    )}

                                    <div>
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div>
                                                <span className="font-mono text-[11px] font-bold tracking-wider px-3 py-1 rounded-md bg-[#FF5520]/15 border border-[#FF5520]/30 text-[#FFA380] uppercase">
                                                    TRANSPORTE & ÚLTIMA MILLA
                                                </span>
                                                <h2 className="text-xl sm:text-2xl font-bold font-heading text-white mt-3 leading-snug tracking-tight">
                                                    Logística Flex & Distribuidoras
                                                </h2>
                                            </div>
                                            <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/[0.04] border border-white/10 p-2 flex items-center justify-center shadow-inner">
                                                <Image
                                                    src="/3d/ilustracion-reparto.png"
                                                    alt="Logística"
                                                    width={96}
                                                    height={96}
                                                    className="w-full h-full object-contain drop-shadow-[0_6px_14px_rgba(255,85,32,0.35)]"
                                                />
                                            </div>
                                        </div>

                                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-5 font-sans">
                                            Operás con flota propia de utilitarios/motos o fleteros tercerizados haciendo entregas en el día o distribución mayorista.
                                        </p>

                                        <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.08] space-y-2.5 mb-6">
                                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFA380] block font-bold">
                                                ¿Qué evalúa este diagnóstico?
                                            </span>
                                            <ul className="space-y-2 text-xs text-neutral-200 font-mono">
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5520] shrink-0 mt-0.5" />
                                                    <span>Calculadora en vivo: costo de rebote ($9.980 por paquete)</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5520] shrink-0 mt-0.5" />
                                                    <span>Ficha de domicilio y coordinación previa de entrega</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5520] shrink-0 mt-0.5" />
                                                    <span>Protocolo de siniestro en ruta y Radar de Dadores 6/Oct</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/[0.08]">
                                        <button
                                            type="button"
                                            onClick={() => elegirPlataforma('logistica')}
                                            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#FF5520] via-[#FF6E40] to-[#FF5520] hover:brightness-110 text-white font-heading font-bold text-xs flex items-center justify-between transition-all cursor-pointer group shadow-[0_4px_20px_rgba(255,85,32,0.35)]"
                                        >
                                            <div className="text-left">
                                                <div className="font-bold text-sm">Iniciar Diagnóstico para Logística Flex</div>
                                                <div className="text-[10px] text-white/90 font-mono font-normal">Calculadora financiera en vivo + informe de fugas</div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ---------------------------------------------- INTRO */}
                    {paso === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.35 }}
                        >
                            <button
                                onClick={() => setPaso('plataforma')}
                                className="mb-3 font-mono text-xs text-[#8E8B88] transition-colors hover:text-[#E8E5DE]"
                            >
                                ‹ Cambiar perfil
                            </button>
                            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#C84214]">
                                Autodiagnóstico · 2 minutos
                            </span>
                            {plataforma === 'logistica' ? (
                                <>
                                    <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
                                        ¿Cuánto capital se te escapa en{' '}
                                        <span className="bg-gradient-to-r from-[#C84214] to-[#B7B3B0] bg-clip-text text-transparent">
                                            viajes en falso y re-entregas?
                                        </span>
                                    </h1>
                                    <p className="mt-5 text-base leading-relaxed text-[#B7B3B0] sm:text-lg">
                                        Cada vez que un utilitario o camión sale a un domicilio y vuelve con el
                                        paquete, perdés <strong className="text-[#E8E5DE]">ARS $9.980</strong> entre
                                        gasoil, tiempo de chofer y el costo de volver al día siguiente.
                                    </p>

                                    <div className="mt-7">
                                        <CalculadoraFinancieraViva
                                            entregasDia={entregasDia}
                                            setEntregasDia={setEntregasDia}
                                            porcentajeFallos={porcentajeFallos}
                                            setPorcentajeFallos={setPorcentajeFallos}
                                        />
                                    </div>

                                    <p className="mt-6 text-base leading-relaxed text-[#B7B3B0]">
                                        Completá <strong className="text-[#E8E5DE]">8 preguntas operativas</strong>{' '}
                                        sobre tu flota, coordinación previa y control en calle para recibir el
                                        diagnóstico exacto de dónde están tus cuellos de botella y cómo taparlos sin
                                        cambiar tu sistema actual.
                                    </p>
                                </>
                            ) : plataforma === 'meli' ? (
                                <>
                                    <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
                                        ¿Sabés cuánto te falta para{' '}
                                        <span className="bg-gradient-to-r from-[#C84214] to-[#B7B3B0] bg-clip-text text-transparent">
                                            bajar de color en Mercado Libre?
                                        </span>
                                    </h1>
                                    <p className="mt-5 text-base leading-relaxed text-[#B7B3B0] sm:text-lg">
                                        Mercado Libre penaliza cada cancelación y cada reclamo cuyo plazo vence sin
                                        respuesta fundada. Bastan un par de incidentes seguidos para caer de categoría
                                        en el termómetro y perder exposición orgánica en tus listados.
                                    </p>
                                    <p className="mt-4 text-base leading-relaxed text-[#B7B3B0]">
                                        Son <strong className="text-[#E8E5DE]">2 minutos</strong>. Al final te mostramos
                                        cuántos reclamos te quedan antes de bajar de color (con los límites oficiales de
                                        Mercado Libre Argentina), cuánto te puede costar y cómo blindarlo.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
                                        ¿Cuánto arriesgás en sobreventas y cancelaciones al{' '}
                                        <span className="bg-gradient-to-r from-[#C84214] to-[#B7B3B0] bg-clip-text text-transparent">
                                            vender por WhatsApp?
                                        </span>
                                    </h1>
                                    <p className="mt-5 text-base leading-relaxed text-[#B7B3B0] sm:text-lg">
                                        Vender por WhatsApp con transferencia te ahorra comisiones, pero
                                        una sobreventa cruzada te obliga a cancelar y destruye tu termómetro
                                        en Mercado Libre. Además, conciliar capturas bancarias a mano en
                                        pleno despacho es la puerta de entrada a comprobantes duplicados o falsos.
                                    </p>
                                    <p className="mt-4 text-base leading-relaxed text-[#B7B3B0]">
                                        Son <strong className="text-[#E8E5DE]">6 preguntas tácticas</strong>.
                                        Al final recibís la auditoría de tu circuito de cobro, stock y
                                        tres medidas inmediatas para blindar tu operación.
                                    </p>
                                </>
                            )}
                            <div className="mt-6 rounded-lg border border-[#3E3D3A] bg-[#151719] px-4 py-3 text-sm text-[#B7B3B0]">
                                No te pedimos conectar ninguna cuenta ni instalar nada. Solo tus respuestas.
                            </div>
                            <button
                                onClick={empezar}
                                className="mt-8 w-full rounded-lg bg-[#C84214] px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-[#B03A11] sm:w-auto"
                            >
                                Empezar el diagnóstico
                            </button>
                        </motion.div>
                    )}

                    {/* ------------------------------------------ PREGUNTAS */}
                    {paso === 'preguntas' && pregunta && (
                        <motion.div
                            key={`p-${indice}`}
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -24 }}
                            transition={{ duration: 0.25 }}
                        >
                            {/* Progreso */}
                            <div className="mb-6 md:mb-8">
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
                                        className="hidden md:inline transition-colors hover:text-[#FFA380]"
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

                            {indice === 0 && (
                                <p className="mb-2 text-[11px] font-mono uppercase tracking-[0.16em] text-[#FFA380]">
                                    2 minutos · sin conectar tu cuenta
                                </p>
                            )}
                            <h2 className="font-heading text-[1.4rem] md:text-3xl font-extrabold text-white leading-snug tracking-tight">
                                {pregunta.titulo}
                            </h2>
                            {pregunta.ayuda && <p className="mt-2 text-sm text-neutral-400 leading-relaxed">{pregunta.ayuda}</p>}

                            {pregunta.tipo === 'reputacion' ? (
                                <PasoReputacion
                                    onContinuar={(datos) => responderReputacion(datos)}
                                    onSaltear={() => responderReputacion(null)}
                                />
                            ) : (
                            <div className="mt-5 md:mt-6 flex flex-col gap-2.5 md:gap-3">
                                {pregunta.opciones.map((opcion, optIdx) => {
                                    const letters = ['A', 'B', 'C', 'D', 'E', 'F']
                                    return (
                                        <button
                                            key={opcion.label}
                                            onClick={() => responder(opcion)}
                                            className="group relative flex items-center justify-between gap-3 md:gap-4 rounded-2xl border border-white/[0.10] card-obsidian sheen-top bg-gradient-to-r from-[#14161A] via-[#111316] to-[#0D0F12] px-4 py-3.5 md:px-5 md:py-4.5 min-h-[56px] text-left text-[15px] leading-snug transition-all duration-200 hover:border-[#FF5520]/60 hover:from-[#1A1D23] hover:to-[#14161A] hover:shadow-[0_4px_25px_-5px_rgba(255,85,32,0.25)] cursor-pointer active:scale-[0.99]"
                                        >
                                            <div className="flex items-start gap-3.5">
                                                <span className="shrink-0 w-6 h-6 rounded-md bg-white/[0.06] border border-white/10 font-mono text-xs font-bold text-neutral-400 group-hover:text-white group-hover:bg-[#FF5520] group-hover:border-[#FF5520] flex items-center justify-center transition-colors">
                                                    {letters[optIdx] || optIdx + 1}
                                                </span>
                                                <span className="text-neutral-200 group-hover:text-white font-medium transition-colors">
                                                    {opcion.label}
                                                </span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-[#FFA380] group-hover:translate-x-1 shrink-0 transition-all" />
                                        </button>
                                    )
                                })}
                            </div>
                            )}

                            {/* En las preguntas de volumen o rebote de logística, mostramos la calculadora en vivo */}
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
                    )}

                    {/* ------------------------------------------ RESULTADO */}
                    {paso === 'resultado' && (
                        <motion.div
                            key="resultado"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <button
                                type="button"
                                onClick={() => setPaso('preguntas')}
                                className="mb-4 inline-flex items-center gap-1.5 py-1.5 font-mono text-xs text-neutral-300 transition-colors hover:text-white"
                            >
                                <ArrowRight className="w-4 h-4 rotate-180" />
                                Volver a las preguntas
                            </button>

                            {/* 1. Veredicto */}
                            <div
                                className="rounded-3xl border p-5 sm:p-8"
                                style={{ borderColor: `${resultado.color}88`, background: resultado.bg }}
                            >
                                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-300">
                                    Tu diagnóstico
                                </span>
                                <h2
                                    className="mt-1 font-heading text-3xl sm:text-4xl font-extrabold tracking-tight"
                                    style={{ color: resultado.color }}
                                >
                                    {resultado.titulo}
                                </h2>
                                <div className="mt-3 h-2 rounded-full bg-black/40 overflow-hidden" aria-hidden>
                                    <div
                                        className="h-full rounded-full"
                                        style={{ width: `${Math.max(6, porcentaje)}%`, backgroundColor: resultado.color }}
                                    />
                                </div>
                                {resumen && (
                                    <p className="mt-4 text-[15px] leading-relaxed text-neutral-100">{resumen}</p>
                                )}
                            </div>

                            {/* 2. Los números reales mandan */}
                            {plataforma === 'meli' && reputacion && <MargenResultado datos={reputacion} />}

                            {plataforma === 'logistica' && (
                                <div className="mt-6">
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
                                <>
                                    <h3 className="mt-8 text-xl font-extrabold font-heading text-white tracking-tight">
                                        Lo que encontramos
                                    </h3>
                                    <HallazgosLista oferta={oferta} />
                                </>
                            )}

                            {/* 4. Contacto: WhatsApp primero, email opcional */}
                            <div className="mt-8 rounded-3xl border border-white/[0.12] bg-gradient-to-br from-[#16181C] via-[#111316] to-[#0A0C0E] p-5 sm:p-8 shadow-2xl">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src="/gabriel-cacabelos.jpg"
                                        alt="Gabriel Cacabelos"
                                        width={480}
                                        height={480}
                                        sizes="48px"
                                        className="w-12 h-12 rounded-full object-cover border-2 border-[#FF5520]/50"
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
                                    <input
                                        type="text"
                                        autoComplete="name"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        placeholder="Tu nombre"
                                        className="rounded-xl border border-white/10 bg-black/60 px-4 py-3.5 text-base text-white outline-none placeholder:text-neutral-500 focus:border-[#FF5520]"
                                    />
                                    <input
                                        type="tel"
                                        inputMode="tel"
                                        autoComplete="tel"
                                        value={whatsapp}
                                        onChange={(e) => setWhatsapp(e.target.value)}
                                        placeholder="Tu WhatsApp (ej: 11 2345 6789)"
                                        className="rounded-xl border border-white/10 bg-black/60 px-4 py-3.5 text-base text-white outline-none placeholder:text-neutral-500 focus:border-[#FF5520]"
                                    />
                                    <input
                                        type="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Tu email (opcional)"
                                        className="rounded-xl border border-white/10 bg-black/60 px-4 py-3.5 text-base text-white outline-none placeholder:text-neutral-500 focus:border-[#FF5520]"
                                    />
                                    {error && <p className="text-sm text-red-400">{error}</p>}
                                    <button
                                        type="submit"
                                        disabled={enviando}
                                        className="mt-1 rounded-2xl bg-[#FF5520] hover:brightness-110 px-6 py-4 text-base font-bold font-heading text-white shadow-[0_4px_25px_rgba(255,85,32,0.35)] disabled:opacity-60"
                                    >
                                        {enviando ? 'Enviando…' : 'Quiero que me escriban'}
                                    </button>
                                    <p className="text-[11px] text-neutral-500 text-center">
                                        Usamos tus datos solo para contactarte por este diagnóstico.
                                    </p>
                                </form>
                            </div>

                            {/* 5. Más detalle, para el que lo quiera */}
                            <div className="mt-6 space-y-3">
                                {oferta && (
                                    <details className="group rounded-2xl border border-white/10 bg-white/[0.03]">
                                        <summary className="cursor-pointer list-none flex items-center justify-between gap-3 p-4 font-semibold text-white">
                                            Cómo seguiría y cuánto cuesta
                                            <ChevronRight className="w-4 h-4 text-[#FF5520] transition-transform group-open:rotate-90" />
                                        </summary>
                                        <div className="px-3 pb-3 sm:px-4 sm:pb-4">
                                            <PlanRecomendado oferta={oferta} />
                                        </div>
                                    </details>
                                )}
                                <details className="group rounded-2xl border border-white/10 bg-white/[0.03]">
                                    <summary className="cursor-pointer list-none flex items-center justify-between gap-3 p-4 font-semibold text-white">
                                        3 cosas que podés hacer hoy, por tu cuenta
                                        <ChevronRight className="w-4 h-4 text-[#FF5520] transition-transform group-open:rotate-90" />
                                    </summary>
                                    <ol className="px-4 pb-4 flex flex-col gap-3">
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
                            className="text-center"
                        >
                            <h2 className="pt-16 md:pt-0 text-3xl font-bold sm:text-4xl">Listo, recibido.</h2>
                            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#B7B3B0]">
                                Te escribimos a la brevedad para revisar los números juntos. Si no querés esperar,
                                escribinos ahora o elegí un horario:
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4">
                                <a
                                    href={`https://wa.me/5491160152435?text=${encodeURIComponent(
                                        `Hola Gabriel, terminé el autodiagnóstico de INDIVIDRA${oferta ? ` (me recomendó el ${oferta.plan.nombre})` : ''} y quiero coordinar el diagnóstico de 30 minutos.`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold font-heading text-[#0B0D0E]"
                                >
                                    Escribir por WhatsApp
                                </a>
                                <a
                                    href="https://calendly.com/individratec/30min"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF5520] px-6 py-3.5 text-sm font-bold font-heading text-white"
                                >
                                    Elegir horario (30 min)
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                                <Link
                                    href={plataforma === 'logistica' ? '/logistica' : '/'}
                                    className="inline-flex items-center justify-center rounded-xl border border-[#3E3D3A] px-6 py-3.5 text-sm font-semibold transition-colors hover:border-[#C84214]"
                                >
                                    {plataforma === 'logistica' ? 'Ver solución de Logística' : 'Volver al inicio'}
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    )
}
