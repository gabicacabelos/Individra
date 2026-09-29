'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
}

type Pregunta = {
    id: string
    titulo: string
    ayuda?: string
    /** Si está, la pregunta solo se muestra para esos canales de ML. Ausente = siempre. */
    canales?: Canal[]
    opciones: Opcion[]
}

/**
 * Costo directo auditado por cada entrega fallida en AMBA / Argentina:
 * - Gasoil desvío promedio 8 km (12 L/100km × ARS $2.198/L): ARS $2.110
 * - Tiempo chofer perdido 20 min (CCT 40/89 costo empresa ARS $8.730/h): ARS $2.880
 * - Re-ruteo, manipulación en depósito y segundo viaje al día siguiente: ARS $4.990
 * Total por entrega fallida: ARS $9.980
 */
const COSTO_FALLO_UNITARIO_ARS = 9980
const DIAS_HABILES_MES = 22

function formatearArs(valor: number): string {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0,
    }).format(Math.round(valor))
}

function calcularEconomiaLogistica(entregasDia: number, porcentajeFallos: number) {
    const fallosDia = entregasDia * (porcentajeFallos / 100)
    const fallosMes = Math.round(fallosDia * DIAS_HABILES_MES)
    const perdidaDiariaArs = Math.round(fallosDia * COSTO_FALLO_UNITARIO_ARS)
    const perdidaMensualArs = Math.round(fallosDia * DIAS_HABILES_MES * COSTO_FALLO_UNITARIO_ARS)
    const ahorroMensualMinArs = Math.round(perdidaMensualArs * 0.5)
    const ahorroMensualMaxArs = Math.round(perdidaMensualArs * 0.6)

    return {
        entregasDia,
        porcentajeFallos,
        costoUnitarioArs: COSTO_FALLO_UNITARIO_ARS,
        diasHabilesMes: DIAS_HABILES_MES,
        fallosDia: Number(fallosDia.toFixed(1)),
        fallosMes,
        perdidaDiariaArs,
        perdidaMensualArs,
        ahorroMensualMinArs,
        ahorroMensualMaxArs,
    }
}

/* ============================================================
   Recorrido 1: Empresas de Logística y Distribuidoras Mayoristas
   ============================================================ */

const PREGUNTAS_LOGISTICA: Pregunta[] = [
    {
        id: 'tipo_operacion',
        titulo: '¿Qué tipo de operación manejás principalmente?',
        opciones: [
            { label: 'Logística de última milla / reparto para terceros (e-commerce, marcas, Flex)' },
            { label: 'Distribuidora mayorista con entrega a comercios (alimentos, bebidas, insumos, ferretería)' },
            { label: 'Operación mixta (distribución propia + reparto para clientes corporativos)' },
        ],
    },
    {
        id: 'flota',
        titulo: '¿Cuántos vehículos salen a repartir en un día normal (propios + fleteros)?',
        opciones: [
            { label: 'De 1 a 5 vehículos' },
            { label: 'De 6 a 15 vehículos' },
            { label: 'De 16 a 35 vehículos' },
            { label: 'Más de 35 vehículos' },
        ],
    },
    {
        id: 'volumen_logistica',
        titulo: '¿Cuántas entregas o paradas hacen por día entre toda la flota?',
        ayuda: 'También podés ajustar el número exacto en la calculadora en vivo de abajo.',
        opciones: [
            { label: 'Menos de 40 entregas por día', calcEntregasDia: 30 },
            { label: 'Entre 40 y 80 entregas por día', calcEntregasDia: 60 },
            { label: 'Entre 80 y 150 entregas por día', calcEntregasDia: 100 },
            { label: 'Entre 150 y 300 entregas por día', calcEntregasDia: 200 },
            { label: 'Más de 300 entregas por día', calcEntregasDia: 350 },
        ],
    },
    {
        id: 'rebote',
        titulo: 'Del total de salidas diarias, ¿qué porcentaje vuelve sin entregar en el primer intento?',
        ayuda: 'Sumando "no había nadie", dirección incompleta, comercio cerrado o rechazo en puerta.',
        opciones: [
            { label: 'Menos del 4%', puntos: 0, calcPorcentajeFallos: 3 },
            { label: 'Entre el 5% y el 8%', puntos: 2, calcPorcentajeFallos: 7 },
            { label: 'Entre el 9% y el 12%', puntos: 3, calcPorcentajeFallos: 10 },
            { label: 'Más del 12%', puntos: 4, calcPorcentajeFallos: 15 },
            { label: 'No lo tenemos medido con exactitud', puntos: 3, calcPorcentajeFallos: 10 },
        ],
    },
    {
        id: 'coordinacion',
        titulo: 'Antes de cargar el camión, ¿cómo confirman si el destinatario va a estar para recibir?',
        opciones: [
            { label: 'Avisamos automáticamente y sacamos de la jaula al que reprograma antes de salir', puntos: 0 },
            { label: 'Mandamos WhatsApp o llamamos a mano en algunos casos puntuales', puntos: 2 },
            { label: 'No avisamos: el camión sale directo con toda la hoja de ruta', puntos: 4 },
        ],
    },
    {
        id: 'ficha_domicilio',
        titulo: 'Cuando un chofer nuevo va a una dirección donde ya entregaron antes, ¿cómo sabe cómo acceder?',
        ayuda: 'Por ejemplo: timbre roto, portón al fondo, horario de recepción del comercio o guardia 24 hs.',
        opciones: [
            { label: 'Le sale automático en la hoja de ruta sin que nadie lo busque', puntos: 0 },
            { label: 'Le pregunta por WhatsApp al chofer anterior o a tráfico', puntos: 2 },
            { label: 'No queda guardado en ningún lado: va a ciegas', puntos: 3 },
        ],
    },
    {
        id: 'evidencia',
        titulo: 'Cuando el chofer marca "No había nadie" y el destinatario reclama "Estuve todo el día", ¿cómo sabés qué pasó?',
        opciones: [
            { label: 'Cruzamos registro del chofer con confirmación previa y respuesta del destinatario', puntos: 0 },
            { label: 'Le pedimos foto del frente por WhatsApp al chofer', puntos: 2 },
            { label: 'Es la palabra del chofer contra la del cliente', puntos: 3 },
        ],
    },
    {
        id: 'administracion',
        titulo: '¿Cuánto tiempo por día pierde administración contestando "¿dónde está mi pedido?" o pasando remitos y transferencias a mano?',
        opciones: [
            { label: 'Menos de 30 minutos por día', puntos: 0 },
            { label: 'Entre 1 y 2 horas por día', puntos: 2 },
            { label: 'Más de 2 horas por día o una persona casi dedicada a eso', puntos: 3 },
        ],
    },
    {
        id: 'intencion',
        titulo: 'Si pudieras bajar a la mitad las entregas fallidas sin cambiar tu sistema ni instalarle apps a los choferes, ¿lo evaluarías?',
        opciones: [
            { label: 'Sí, quiero verlo aplicado a mi operación en el diagnóstico de 30 min' },
            { label: 'Sí, me interesa probarlo en una ruta piloto sin compromiso' },
            { label: 'Por ahora solo quería calcular mis números' },
        ],
    },
]

/* ============================================================
   Recorrido 2: Mercado Libre
   ============================================================ */

const PREGUNTAS_MELI: Pregunta[] = [
    {
        id: 'canal',
        titulo: '¿Cómo entregás tus ventas de Mercado Libre?',
        opciones: [
            { label: 'Flex — reparto yo o un fletero que contrato', valor: 'flex' },
            { label: 'Mercado Envíos — pasa el correo a buscar', valor: 'envios' },
            { label: 'Full — mi stock está en el depósito de ML', valor: 'full' },
            { label: 'Mezclo varios', valor: 'mixto' },
        ],
    },
    {
        id: 'volumen',
        titulo: '¿Cuántos paquetes despachás por día, en promedio?',
        opciones: [
            { label: 'Menos de 5' },
            { label: 'Entre 5 y 20' },
            { label: 'Entre 20 y 50' },
            { label: 'Entre 50 y 150' },
            { label: 'Más de 150' },
        ],
    },
    {
        id: 'fallas',
        titulo: 'En una semana normal, ¿cuántas entregas se caen o llegan tarde?',
        canales: ['flex', 'envios', 'mixto'],
        opciones: [
            { label: 'Ninguna o casi ninguna', puntos: 0 },
            { label: '1 o 2', puntos: 1 },
            { label: 'Entre 3 y 5', puntos: 2 },
            { label: 'Más de 5', puntos: 3 },
            { label: 'No lo sé con precisión', puntos: 3 },
        ],
    },
    {
        id: 'aviso',
        titulo: '¿Cómo te enterás de que una entrega se complicó?',
        canales: ['flex', 'envios', 'mixto'],
        opciones: [
            { label: 'Me avisa un sistema, antes de que pase', puntos: 0 },
            { label: 'Lo veo yo, revisando el panel de Mercado Libre', puntos: 1 },
            { label: 'Me entero cuando el comprador reclama', puntos: 3 },
            { label: 'Me entero al otro día, cuando ya impactó la métrica', puntos: 4 },
        ],
    },
    {
        id: 'workaround',
        titulo: '¿Usás algo por fuera del panel de ML para controlar los envíos del día?',
        ayuda: 'Si hacés más de una cosa, elegí la que más tiempo te lleva.',
        canales: ['flex', 'envios', 'mixto'],
        opciones: [
            { label: 'Un software pago que ya me lo resuelve', puntos: 0 },
            { label: 'No, solo el panel de Mercado Libre', puntos: 1 },
            { label: 'Una planilla o Excel propio', puntos: 2 },
            { label: 'Mensajes o llamados al chofer para saber cómo viene', puntos: 2 },
            { label: 'Tengo a alguien dedicado a mirar eso', puntos: 3 },
        ],
    },
    {
        id: 'reputacion',
        titulo: '¿Alguna vez perdiste reputación o exposición por temas de envíos?',
        opciones: [
            { label: 'Nunca me pasó', puntos: 0 },
            { label: 'Me pasó una vez', puntos: 2 },
            { label: 'Me pasó varias veces', puntos: 3 },
            { label: 'Me está pasando ahora', puntos: 4 },
        ],
    },
    {
        id: 'fletero',
        titulo: 'Si tercerizás el reparto, ¿cómo controlás lo que te factura?',
        canales: ['flex', 'mixto'],
        opciones: [
            { label: 'No tercerizo, reparto con gente propia', puntos: 0 },
            { label: 'Pago una tarifa fija mensual, no lo cruzo', puntos: 0 },
            { label: 'Confío en lo que me pasa, no lo cruzo con nada', puntos: 2 },
            { label: 'Lo cruzo a mano contra mis ventas', puntos: 2 },
        ],
    },
    {
        id: 'costo',
        titulo: 'Un mes malo de envíos, ¿cuánto calculás que te cuesta?',
        ayuda: 'Sumando reentregas, reclamos, ventas perdidas por menos exposición y horas de tu equipo.',
        opciones: [
            { label: 'Menos de $100.000', puntos: 0 },
            { label: 'Entre $100.000 y $500.000', puntos: 1 },
            { label: 'Entre $500.000 y $2.000.000', puntos: 2 },
            { label: 'Más de $2.000.000', puntos: 3 },
            { label: 'Nunca lo calculé', puntos: 2 },
        ],
    },
    {
        id: 'intencion',
        titulo:
            'Si existiera algo que te avisara automáticamente cuándo una entrega está por caerse, ¿lo usarías?',
        opciones: [
            { label: 'Sí, y pagaría una mensualidad por eso' },
            { label: 'Sí, pero solo si fuera gratis' },
            { label: 'Lo probaría para ver si sirve' },
            { label: 'No me hace falta' },
        ],
    },
]

/* ============================================================
   Recorrido 3: tienda propia o multicanal
   ============================================================ */

const PREGUNTAS_OTROS: Pregunta[] = [
    {
        id: 'respuesta',
        titulo: 'En una semana normal, ¿cuánto tardás en responder una consulta de un cliente nuevo?',
        opciones: [
            { label: 'Menos de 15 minutos', puntos: 0 },
            { label: 'Entre 15 minutos y 2 horas', puntos: 1 },
            { label: 'Entre 2 y 24 horas', puntos: 2 },
            { label: 'Más de un día, o depende de quién esté disponible', puntos: 3 },
        ],
    },
    {
        id: 'fuerahorario',
        titulo: '¿Qué pasa con las consultas que llegan de noche o el fin de semana?',
        opciones: [
            { label: 'Se responden igual, tenemos guardia', puntos: 0 },
            { label: 'Esperan hasta el horario de atención', puntos: 2 },
            { label: 'Se pierden si nadie se acuerda de volver a mirar', puntos: 3 },
        ],
    },
    {
        id: 'carritos',
        titulo: '¿Hacés algo con los carritos abandonados o las consultas que no cerraron en venta?',
        opciones: [
            { label: 'Sí, hay un seguimiento automático o manual sistemático', puntos: 0 },
            { label: 'A veces, si alguien se acuerda', puntos: 2 },
            { label: 'No, se pierden', puntos: 3 },
        ],
    },
    {
        id: 'seguimiento_pedido',
        titulo: 'Después de la compra, ¿cómo se entera el cliente del estado de su pedido?',
        opciones: [
            { label: 'Recibe avisos automáticos (envío, demora, etc.)', puntos: 0 },
            { label: 'Solo si pregunta y alguien le contesta', puntos: 2 },
            { label: 'No hay un proceso definido', puntos: 3 },
        ],
    },
    {
        id: 'reclamos',
        titulo: '¿Alguna vez perdiste una venta o un cliente por una consulta o un reclamo que no se atendió a tiempo?',
        opciones: [
            { label: 'Nunca me pasó', puntos: 0 },
            { label: 'Me pasó una vez', puntos: 2 },
            { label: 'Me pasó varias veces', puntos: 3 },
            { label: 'Me está pasando seguido', puntos: 4 },
        ],
    },
    {
        id: 'equipo',
        titulo: '¿Quién contesta hoy las consultas de clientes?',
        ayuda: 'Si hacés más de una cosa, elegí la principal.',
        opciones: [
            { label: 'Un equipo dedicado, con horarios cubiertos', puntos: 0 },
            { label: 'Yo o un socio, entre otras tareas', puntos: 2 },
            { label: 'Se reparte entre quien esté disponible en el momento', puntos: 3 },
        ],
    },
    {
        id: 'costo',
        titulo: 'Un mes con mala atención (consultas sin responder, carritos perdidos, reclamos), ¿cuánto calculás que te cuesta en ventas perdidas?',
        opciones: [
            { label: 'Menos de $100.000', puntos: 0 },
            { label: 'Entre $100.000 y $500.000', puntos: 1 },
            { label: 'Entre $500.000 y $2.000.000', puntos: 2 },
            { label: 'Más de $2.000.000', puntos: 3 },
            { label: 'Nunca lo calculé', puntos: 2 },
        ],
    },
    {
        id: 'intencion',
        titulo: 'Si existiera algo que unifique tus canales y responda solo lo repetitivo, ¿lo usarías?',
        opciones: [
            { label: 'Sí, y pagaría una mensualidad por eso' },
            { label: 'Sí, pero solo si fuera gratis' },
            { label: 'Lo probaría para ver si sirve' },
            { label: 'No me hace falta' },
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

/** Puntaje, máximo alcanzable y nivel, derivados del recorrido activo. */
function calcular(r: Respuestas, plataforma: Plataforma | null) {
    const activas = preguntasPara(plataforma, r)
    const puntaje = activas.reduce((acc, p) => {
        const op = p.opciones.find((o) => o.label === r[p.id])
        return acc + (op?.puntos ?? 0)
    }, 0)
    const maximo = activas.reduce(
        (acc, p) => acc + Math.max(0, ...p.opciones.map((o) => o.puntos ?? 0)),
        0
    )
    const porcentaje = maximo > 0 ? Math.round((puntaje / maximo) * 100) : 0
    const nivel: Nivel = porcentaje < 30 ? 'verde' : porcentaje <= 60 ? 'amarillo' : 'rojo'
    return { activas, puntaje, maximo, porcentaje, nivel }
}

/** Título y color por nivel: son genéricos, valen para cualquier recorrido. */
const NIVEL_META: Record<Nivel, { titulo: string; color: string; bg: string }> = {
    verde: { titulo: 'Riesgo bajo', color: '#4ADE80', bg: 'rgba(74,222,128,0.1)' },
    amarillo: { titulo: 'Riesgo medio', color: '#FBBF24', bg: 'rgba(251,191,36,0.1)' },
    rojo: { titulo: 'Riesgo alto', color: '#C84214', bg: 'rgba(200,66,20,0.12)' },
}

/** Acciones por defecto según nivel, recorrido Logística y Distribuidoras. */
const ACCIONES_LOGISTICA: Record<Nivel, string[]> = {
    verde: [
        'Mantené medido el porcentaje de rebote por zona y por dador de carga: suele esconder clientes que dan pérdida por re-entregas.',
        'Empezá a guardar la Ficha del Domicilio (timbre, portería, horario comercial) asociada a la dirección para no depender de la memoria del chofer.',
        'Activá el pedido de reseña en Google con un toque después de cada entrega conforme para capitalizar tu tasa de cumplimiento.',
    ],
    amarillo: [
        'Filtrá ausencias antes de cargar: un WhatsApp interactivo a las 20:00 hs del día anterior evita entre el 40% y el 60% de los viajes en falso.',
        'Documentá cómo se accede a cada domicilio después de la primera visita para que el dato viaje pegado a la hoja de ruta del chofer.',
        'Cuando el chofer marque "No había nadie", dispará una consulta inmediata al destinatario para cruzar ambas fuentes sin discusiones a ciegas.',
    ],
    rojo: [
        'Cortá la salida a ciegas mañana mismo: cada paquete que sube al camión y rebota te cuesta ARS $9.980 entre gasoil, tiempo de chofer y segundo viaje.',
        'Sacá a administración de contestar "¿dónde está mi pedido?": conectá tu planilla o ERP a un aviso por paradas restantes sin prometer horarios inventados.',
        'Poné un reloj de vencimiento a los paquetes en depósito (alertas a 5, 2 y 1 días) y cruzá la evidencia de visitas fallidas antes de perder cuentas.',
    ],
}

/** Acciones por defecto según nivel, recorrido Mercado Libre. */
const ACCIONES_MELI: Record<Nivel, string[]> = {
    verde: [
        'Anotá una vez por semana tu porcentaje de envíos correctos. Si no lo medís, no vas a ver la caída hasta que ya pasó.',
        'Definí de antemano cuántas entregas caídas por semana son tu señal de alarma.',
        'Si sumás volumen o cambiás de fletero, volvé a mirar este número los primeros 15 días.',
    ],
    amarillo: [
        'Cortá el día más temprano: revisá los pendientes a media tarde, no a la noche, cuando ya no hay margen para reaccionar.',
        'Avisale al comprador la ventana de entrega antes de que salga el reparto. La mayoría de las entregas fallidas son ausencias, no demoras.',
        'Llevá registro de qué zona y qué día concentran las fallas. Casi siempre están concentradas, no repartidas.',
    ],
    rojo: [
        'Lo primero es medir: sacá tu porcentaje real de envíos correctos de las últimas 4 semanas. Sin ese número estás manejando a ciegas.',
        'Identificá el punto exacto donde te enterás tarde (¿el chofer no avisa? ¿nadie mira el panel a las 18?) y ponele un control ahí, aunque sea manual.',
        'Si tercerizás, empezá a cruzar lo que te facturan contra lo que Mercado Libre registró como entregado. Es el lugar donde más plata se escapa sin que se note.',
    ],
}

/** Acciones específicas para quien opera 100% Full (el resto no le aplica). */
const ACCIONES_FULL = [
    'Mirá tu porcentaje de despachos a tiempo al depósito de Full: es la parte de la cadena que sigue en tus manos.',
    'Vigilá los quiebres de stock en el depósito; quedarte sin stock en Full también te baja exposición.',
    'Si además vendés por Flex o Envíos, repetí este diagnóstico pensando en ese canal: ahí es donde más te aplica.',
]

/** Acciones por defecto según nivel, recorrido tienda propia / multicanal. */
const ACCIONES_OTROS: Record<Nivel, string[]> = {
    verde: [
        'Anotá una vez por semana cuánto tardás en responder la primera consulta. Si no lo medís, no vas a ver cuándo empieza a empeorar.',
        'Definí de antemano cuál es tu tiempo máximo aceptable de respuesta, y quién cubre cuando falta alguien.',
        'Si sumás un canal nuevo (otra red, otra plataforma), volvé a mirar este número los primeros 15 días.',
    ],
    amarillo: [
        'Ordená un solo lugar donde caigan todas las consultas, aunque sea manual: hoy se pierden entre pestañas.',
        'Definí una respuesta automática mínima para fuera de horario, aunque sea derivando a un horario de contacto.',
        'Llevá registro de cuántos carritos o consultas se pierden por semana sin seguimiento. Casi siempre es más de lo que parece.',
    ],
    rojo: [
        'Lo primero es medir: contá cuántas consultas te llegaron la semana pasada y cuántas quedaron sin respuesta a tiempo. Sin ese número estás manejando a ciegas.',
        'Identificá el canal donde más se te escapa (¿WhatsApp? ¿Instagram? ¿el chat de la tienda?) y ponele un responsable fijo, aunque sea por turnos.',
        'Empezá a registrar los carritos abandonados y las consultas que no cerraron venta: es plata que se va sin que nadie la vea.',
    ],
}

/* ============================================================
   Fragmentos de resumen personalizado
   ============================================================ */

const FRAG_VOLUMEN: Record<string, string> = {
    'Menos de 5': 'A tu volumen (menos de 5 envíos por día)',
    'Entre 5 y 20': 'Con entre 5 y 20 envíos por día',
    'Entre 20 y 50': 'Con entre 20 y 50 envíos por día',
    'Entre 50 y 150': 'Con entre 50 y 150 envíos por día',
    'Más de 150': 'Con más de 150 envíos por día',
}
const FRAG_FALLAS: Record<string, string> = {
    'Ninguna o casi ninguna': 'y prácticamente sin entregas caídas',
    '1 o 2': 'y 1 o 2 entregas caídas por semana',
    'Entre 3 y 5': 'y entre 3 y 5 entregas caídas por semana',
    'Más de 5': 'y más de 5 entregas caídas por semana',
    'No lo sé con precisión': 'y sin un número preciso de cuántas se caen',
}
const FRAG_AVISO: Record<string, string> = {
    'Me avisa un sistema, antes de que pase':
        'Ya tenés un aviso automático antes de que pase, que es lo más difícil de resolver.',
    'Lo veo yo, revisando el panel de Mercado Libre':
        'Hoy dependés de entrar vos al panel de ML a mirarlo: el día que no entrás, no te enterás.',
    'Me entero cuando el comprador reclama':
        'Hoy te enterás cuando el comprador reclama, es decir, cuando la métrica ya se movió.',
    'Me entero al otro día, cuando ya impactó la métrica':
        'Hoy te enterás al otro día, con el golpe a la métrica ya hecho y sin margen para reaccionar.',
}
const FRAG_REPUTACION: Record<string, string> = {
    'Nunca me pasó': 'Todavía no te golpeó la reputación, y la idea es que siga así.',
    'Me pasó una vez': 'Ya te pasó una vez, así que sabés lo que cuesta recuperarlo.',
    'Me pasó varias veces': 'Ya te pasó varias veces, así que no es un riesgo teórico.',
    'Me está pasando ahora':
        'Y lo estás sintiendo ahora mismo: nos dijiste que estás perdiendo reputación o exposición en este momento.',
}
const FRAG_FLETERO: Record<string, string> = {
    'Confío en lo que me pasa, no lo cruzo con nada':
        'Además, no cruzás lo que te factura el fletero contra lo que ML registró como entregado, que es donde más plata se escapa sin que se note.',
    'Lo cruzo a mano contra mis ventas':
        'Cruzás la facturación del fletero a mano: funciona, pero se rompe apenas sube el volumen.',
}
const FRAG_COSTO: Record<string, string> = {
    'Entre $100.000 y $500.000':
        'Vos mismo calculás que un mes malo te cuesta entre $100.000 y $500.000.',
    'Entre $500.000 y $2.000.000':
        'Vos mismo calculás que un mes malo te cuesta entre $500.000 y $2.000.000.',
    'Más de $2.000.000': 'Vos mismo estimás que un mes malo te cuesta más de $2.000.000.',
    'Nunca lo calculé':
        'Y todavía no le pusiste número a lo que te cuesta un mes malo, que suele ser señal de que es más de lo que parece.',
}

function construirResumenMeli(r: Respuestas): string {
    if (valorCanalMeli(r) === 'full') {
        return [
            'Operás con Full, así que ML se ocupa de casi toda la entrega: este diagnóstico está pensado sobre todo para quien reparte por Flex o Envíos.',
            FRAG_REPUTACION[r.reputacion] ?? '',
            FRAG_COSTO[r.costo] ?? '',
            'Lo que sí sigue dependiendo de vos es despachar a tiempo al depósito y no quedarte sin stock; ahí es donde todavía podés perder exposición.',
        ]
            .filter(Boolean)
            .join(' ')
    }

    const cabeza = [FRAG_VOLUMEN[r.volumen], FRAG_FALLAS[r.fallas]].filter(Boolean).join(' ')
    return [
        cabeza ? `${cabeza}.` : '',
        FRAG_AVISO[r.aviso] ?? '',
        FRAG_REPUTACION[r.reputacion] ?? '',
        FRAG_FLETERO[r.fletero] ?? '',
        FRAG_COSTO[r.costo] ?? '',
    ]
        .filter(Boolean)
        .join(' ')
}

const FRAG_RESPUESTA: Record<string, string> = {
    'Menos de 15 minutos':
        'Hoy respondés rápido (menos de 15 minutos), que es lo más difícil de sostener cuando crece el volumen.',
    'Entre 15 minutos y 2 horas': 'Hoy una consulta tarda entre 15 minutos y 2 horas en tener respuesta.',
    'Entre 2 y 24 horas': 'Hoy una consulta puede esperar entre 2 y 24 horas para tener respuesta.',
    'Más de un día, o depende de quién esté disponible':
        'Hoy una consulta puede esperar más de un día, o depende de quién esté disponible en ese momento.',
}
const FRAG_FUERAHORARIO: Record<string, string> = {
    'Se responden igual, tenemos guardia':
        'Ya cubrís las consultas fuera de horario, que es donde más se te escaparía si no lo hicieras.',
    'Esperan hasta el horario de atención': 'Las consultas fuera de horario esperan hasta el otro día hábil.',
    'Se pierden si nadie se acuerda de volver a mirar':
        'Las consultas fuera de horario dependen de que alguien se acuerde de volver a mirar, así que algunas se pierden.',
}
const FRAG_RECLAMOS: Record<string, string> = {
    'Nunca me pasó': 'Todavía no perdiste una venta o un cliente por esto, y la idea es que siga así.',
    'Me pasó una vez': 'Ya te pasó una vez, así que sabés lo que cuesta.',
    'Me pasó varias veces': 'Ya te pasó varias veces, así que no es un riesgo teórico.',
    'Me está pasando seguido': 'Y te está pasando seguido ahora mismo, según nos contaste.',
}
const FRAG_COSTO_OTROS: Record<string, string> = {
    'Entre $100.000 y $500.000':
        'Vos mismo calculás que un mes de mala atención te cuesta entre $100.000 y $500.000 en ventas perdidas.',
    'Entre $500.000 y $2.000.000':
        'Vos mismo calculás que un mes de mala atención te cuesta entre $500.000 y $2.000.000 en ventas perdidas.',
    'Más de $2.000.000':
        'Vos mismo estimás que un mes de mala atención te cuesta más de $2.000.000 en ventas perdidas.',
    'Nunca lo calculé':
        'Y todavía no le pusiste número a lo que te cuesta, que suele ser señal de que es más de lo que parece.',
}

function construirResumenOtros(r: Respuestas): string {
    return [
        FRAG_RESPUESTA[r.respuesta] ?? '',
        FRAG_FUERAHORARIO[r.fuerahorario] ?? '',
        FRAG_RECLAMOS[r.reclamos] ?? '',
        FRAG_COSTO_OTROS[r.costo] ?? '',
    ]
        .filter(Boolean)
        .join(' ')
}

function construirResumenLogistica(
    r: Respuestas,
    entregasDia: number,
    porcentajeFallos: number
): string {
    const econ = calcularEconomiaLogistica(entregasDia, porcentajeFallos)
    const partes: string[] = [
        `Con ${entregasDia} entregas diarias y un ${porcentajeFallos}% de rebote al primer intento, tu operación acumula ~${econ.fallosMes} viajes en falso por mes (${formatearArs(econ.perdidaMensualArs)}/mes sumando gasoil, tiempo de chofer y re-despacho).`,
    ]

    if (r.coordinacion === 'No avisamos: el camión sale directo con toda la hoja de ruta') {
        partes.push(
            'Hoy los camiones salen sin filtrar quién va a estar en el domicilio, que es donde se origina más de la mitad de esos rebotes.'
        )
    } else if (r.coordinacion === 'Mandamos WhatsApp o llamamos a mano en algunos casos puntuales') {
        partes.push(
            'Hoy la confirmación previa depende de mensajes manuales, por lo que no llega a cubrir toda la carga antes de armar la jaula.'
        )
    }

    if (r.ficha_domicilio === 'No queda guardado en ningún lado: va a ciegas') {
        partes.push(
            'Además, cada vez que rota un chofer se pierde el conocimiento de cómo acceder a cada domicilio o comercio.'
        )
    }

    if (r.evidencia === 'Es la palabra del chofer contra la del cliente') {
        partes.push(
            'Cuando un envío falla, no tenés doble evidencia independiente para demostrarle al dador de carga o al cliente qué pasó de verdad.'
        )
    }

    return partes.join(' ')
}

function construirResumen(
    r: Respuestas,
    plataforma: Plataforma | null,
    entregasDia: number,
    porcentajeFallos: number
): string {
    if (plataforma === 'logistica') return construirResumenLogistica(r, entregasDia, porcentajeFallos)
    if (plataforma === 'otros') return construirResumenOtros(r)
    return construirResumenMeli(r)
}

function construirAcciones(r: Respuestas, nivel: Nivel, plataforma: Plataforma | null): string[] {
    if (plataforma === 'logistica') return ACCIONES_LOGISTICA[nivel]
    if (plataforma === 'otros') return ACCIONES_OTROS[nivel]
    if (valorCanalMeli(r) === 'full') return ACCIONES_FULL
    return ACCIONES_MELI[nivel]
}

/** PostHog solo está inicializado si el usuario aceptó cookies; esto lo hace inofensivo si no. */
function track(evento: string, props?: Record<string, unknown>) {
    import('posthog-js')
        .then(({ default: posthog }) => {
            posthog.capture(evento, props)
        })
        .catch(() => {
            /* noop */
        })
}

/* ============================================================
   Componente: Calculadora Financiera en Vivo (Logística / Distribuidoras)
   ============================================================ */

interface CalculadoraVivaProps {
    entregasDia: number
    setEntregasDia: (v: number) => void
    porcentajeFallos: number
    setPorcentajeFallos: (v: number) => void
    compacta?: boolean
}

function CalculadoraFinancieraViva({
    entregasDia,
    setEntregasDia,
    porcentajeFallos,
    setPorcentajeFallos,
    compacta = false,
}: CalculadoraVivaProps) {
    const econ = calcularEconomiaLogistica(entregasDia, porcentajeFallos)

    return (
        <div className="rounded-xl border border-[#C84214]/40 bg-[#151719] p-5 sm:p-6 shadow-xl shadow-black/30">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3.5">
                <div>
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#C84214]">
                        Calculadora Financiera en Vivo
                    </span>
                    <h3 className="mt-0.5 text-base sm:text-lg font-bold text-[#E8E5DE]">
                        Costo real de entregas fallidas en tu operación
                    </h3>
                </div>
                <span className="rounded-full border border-[#3E3D3A] bg-[#0B0D0E] px-3 py-1 font-mono text-xs text-[#B7B3B0]">
                    {entregasDia}/día × {porcentajeFallos}% × {formatearArs(COSTO_FALLO_UNITARIO_ARS)}
                </span>
            </div>

            {/* Sliders interactivos */}
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="rounded-lg border border-[#3E3D3A] bg-[#0B0D0E] p-4">
                    <div className="flex items-baseline justify-between">
                        <label
                            htmlFor="slider-entregas"
                            className="text-xs font-medium uppercase tracking-wider text-[#B7B3B0]"
                        >
                            Entregas / paradas por día
                        </label>
                        <span className="font-mono text-xl font-bold text-white">
                            {entregasDia}
                        </span>
                    </div>
                    <input
                        id="slider-entregas"
                        type="range"
                        min={15}
                        max={500}
                        step={5}
                        value={entregasDia}
                        onChange={(e) => setEntregasDia(Number(e.target.value))}
                        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#262523] accent-[#C84214]"
                    />
                    <div className="mt-1.5 flex justify-between font-mono text-[11px] text-[#8E8B88]">
                        <span>15/día</span>
                        <span>100/día</span>
                        <span>300/día</span>
                        <span>500/día</span>
                    </div>
                </div>

                <div className="rounded-lg border border-[#3E3D3A] bg-[#0B0D0E] p-4">
                    <div className="flex items-baseline justify-between">
                        <label
                            htmlFor="slider-fallos"
                            className="text-xs font-medium uppercase tracking-wider text-[#B7B3B0]"
                        >
                            % Fallos al 1° intento
                        </label>
                        <span className="font-mono text-xl font-bold text-[#C84214]">
                            {porcentajeFallos}%
                        </span>
                    </div>
                    <input
                        id="slider-fallos"
                        type="range"
                        min={1}
                        max={25}
                        step={1}
                        value={porcentajeFallos}
                        onChange={(e) => setPorcentajeFallos(Number(e.target.value))}
                        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#262523] accent-[#C84214]"
                    />
                    <div className="mt-1.5 flex justify-between font-mono text-[11px] text-[#8E8B88]">
                        <span>1%</span>
                        <span>8% (prom.)</span>
                        <span>15%</span>
                        <span>25%</span>
                    </div>
                </div>
            </div>

            {/* Resultados numéricos en vivo */}
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-[#3E3D3A] bg-[#0B0D0E]/90 p-3.5">
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-[#8E8B88]">
                        Pérdida por día ({econ.fallosDia} fallos)
                    </span>
                    <span className="mt-1 block font-mono text-lg sm:text-xl font-bold text-[#E8E5DE]">
                        {formatearArs(econ.perdidaDiariaArs)}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-[#8E8B88]">
                        Cada día operativo en la calle
                    </span>
                </div>

                <div className="rounded-lg border border-[#C84214]/50 bg-[#C84214]/10 p-3.5">
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-[#E8E5DE]">
                        Fuga mensual ({econ.fallosMes} fallos/mes)
                    </span>
                    <span className="mt-1 block font-mono text-xl sm:text-2xl font-bold text-[#C84214]">
                        {formatearArs(econ.perdidaMensualArs)}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-[#B7B3B0]">
                        En {DIAS_HABILES_MES} días hábiles × {formatearArs(COSTO_FALLO_UNITARIO_ARS)}/fallo
                    </span>
                </div>

                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5">
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-emerald-300">
                        Capital recuperable (-50% a -60%)
                    </span>
                    <span className="mt-1 block font-mono text-lg sm:text-xl font-bold text-emerald-400">
                        {formatearArs(econ.ahorroMensualMinArs)} a {formatearArs(econ.ahorroMensualMaxArs)}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-emerald-200/70">
                        Ahorro mensual con Coordinación Previa + Ficha
                    </span>
                </div>
            </div>

            {!compacta && (
                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-[#8E8B88]">
                    <span>
                        * Costo unitario auditado ({formatearArs(COSTO_FALLO_UNITARIO_ARS)}/fallo): Gasoil desvío 8 km ($2.110) + 20 min chofer CCT 40/89 ($2.880) + Re-ruteo y 2° viaje ($4.990).
                    </span>
                </div>
            )}
        </div>
    )
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
            if (paramOrigen === 'logistica') {
                setPlataforma('logistica')
                setPaso('intro')
            } else if (paramOrigen === 'home_meli') {
                setPlataforma('meli')
                setPaso('intro')
            } else if (paramOrigen === 'home_tienda') {
                setPlataforma('otros')
                setPaso('intro')
            }
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
    const { activas, puntaje, maximo, porcentaje, nivel } = calcular(respuestas, plataforma)
    const pregunta = activas[indice]
    const resultado = NIVEL_META[nivel]
    const resumen = construirResumen(respuestas, plataforma, entregasDia, porcentajeFallos)
    const acciones = construirAcciones(respuestas, nivel, plataforma)
    const economiaLogistica = calcularEconomiaLogistica(entregasDia, porcentajeFallos)

    function elegirPlataforma(p: Plataforma) {
        setPlataforma(p)
        setIndice(0)
        setRespuestas({})
        track('diagnostico_plataforma', { plataforma: p, origen })
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

        const info = calcular(nuevas, plataforma)
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
            setPaso('intro')
            return
        }
        setIndice(indice - 1)
    }

    async function enviar(e: React.FormEvent) {
        e.preventDefault()
        setError('')
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
        <main className="min-h-screen bg-[#0B0D0E] text-[#E8E5DE]">
            <button
                type="button"
                onClick={salirHaciaAtras}
                className="fixed top-6 left-6 z-[100] flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                aria-label="Volver atrás"
            >
                <ArrowRight className="w-4 h-4 text-neutral-300 rotate-180" />
            </button>

            <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 py-16 sm:px-6">
                <AnimatePresence mode="wait">
                    {/* ------------------------------------------- PLATAFORMA */}
                    {paso === 'plataforma' && (
                        <motion.div
                            key="plataforma"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.35 }}
                        >
                            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#C84214]">
                                Autodiagnóstico Operativo · 2 minutos
                            </span>
                            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
                                ¿Cómo es tu{' '}
                                <span className="bg-gradient-to-r from-[#C84214] to-[#B7B3B0] bg-clip-text text-transparent">
                                    operación hoy?
                                </span>
                            </h1>
                            <p className="mt-5 text-base leading-relaxed text-[#B7B3B0] sm:text-lg">
                                Elegí tu perfil para que las preguntas y el cálculo de fugas de capital se
                                ajusten a tu realidad operativa.
                            </p>

                            <div className="mt-8 flex flex-col gap-3.5">
                                <button
                                    onClick={() => elegirPlataforma('logistica')}
                                    className="group relative rounded-xl border border-[#C84214]/50 bg-[#151719] px-5 py-4.5 text-left transition-all hover:border-[#C84214] hover:bg-[#1B1E20]"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <span className="block text-base sm:text-lg font-semibold text-[#E8E5DE] transition-colors group-hover:text-white">
                                            Empresa de Logística o Distribuidora Mayorista
                                        </span>
                                        <span className="rounded-full border border-[#C84214]/40 bg-[#C84214]/15 px-2.5 py-0.5 font-mono text-[11px] font-medium text-[#E8E5DE]">
                                            Calculadora en vivo
                                        </span>
                                    </div>
                                    <span className="mt-1.5 block text-sm text-[#8E8B88]">
                                        Flota propia o fleteros tercerizados · Reparto de última milla, B2B o abastecimiento a comercios
                                    </span>
                                </button>

                                <button
                                    onClick={() => elegirPlataforma('meli')}
                                    className="group rounded-xl border border-[#3E3D3A] bg-[#151719] px-5 py-4 text-left transition-all hover:border-[#C84214] hover:bg-[#1B1E20]"
                                >
                                    <span className="block text-base font-semibold text-[#E8E5DE] transition-colors group-hover:text-white">
                                        Vendedor de Mercado Libre
                                    </span>
                                    <span className="mt-1 block text-sm text-[#8E8B88]">
                                        Reparto por Flex, Mercado Envíos o Full
                                    </span>
                                </button>

                                <button
                                    onClick={() => elegirPlataforma('otros')}
                                    className="group rounded-xl border border-[#3E3D3A] bg-[#151719] px-5 py-4 text-left transition-all hover:border-[#C84214] hover:bg-[#1B1E20]"
                                >
                                    <span className="block text-base font-semibold text-[#E8E5DE] transition-colors group-hover:text-white">
                                        Tienda propia o multicanal
                                    </span>
                                    <span className="mt-1 block text-sm text-[#8E8B88]">
                                        Tiendanube, Shopify, WhatsApp, Instagram, WooCommerce
                                    </span>
                                </button>
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
                                        Completá <strong className="text-[#E8E5DE]">9 preguntas operativas</strong>{' '}
                                        sobre tu flota, coordinación previa y control en calle para recibir el
                                        diagnóstico exacto de dónde están tus cuellos de botella y cómo taparlos sin
                                        cambiar tu sistema actual.
                                    </p>
                                </>
                            ) : plataforma === 'meli' ? (
                                <>
                                    <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
                                        ¿Qué tan cerca estás de{' '}
                                        <span className="bg-gradient-to-r from-[#C84214] to-[#B7B3B0] bg-clip-text text-transparent">
                                            perder el verde?
                                        </span>
                                    </h1>
                                    <p className="mt-5 text-base leading-relaxed text-[#B7B3B0] sm:text-lg">
                                        Mercado Libre te exige un porcentaje muy alto de envíos correctos
                                        por semana. Pocas entregas caídas te bajan la exposición de la
                                        semana siguiente — y la mayoría de los vendedores se entera cuando
                                        ya pasó.
                                    </p>
                                    <p className="mt-4 text-base leading-relaxed text-[#B7B3B0]">
                                        Son <strong className="text-[#E8E5DE]">9 preguntas rápidas</strong>{' '}
                                        (algunas se saltean según cómo entregues). Al final te decimos en
                                        qué nivel de riesgo está tu operación y tres cosas concretas para
                                        bajarlo.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
                                        ¿Cuánto se te está{' '}
                                        <span className="bg-gradient-to-r from-[#C84214] to-[#B7B3B0] bg-clip-text text-transparent">
                                            escapando por atención lenta?
                                        </span>
                                    </h1>
                                    <p className="mt-5 text-base leading-relaxed text-[#B7B3B0] sm:text-lg">
                                        Cada consulta sin responder a tiempo es una venta que se enfría o
                                        un cliente que no vuelve. La mayoría de los vendedores no mide
                                        cuánto se les escapa por esto hasta que ya es mucho.
                                    </p>
                                    <p className="mt-4 text-base leading-relaxed text-[#B7B3B0]">
                                        Son <strong className="text-[#E8E5DE]">8 preguntas rápidas</strong>.
                                        Al final te decimos en qué nivel de riesgo está tu atención y tres
                                        cosas concretas para bajarlo.
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
                            <div className="mb-8">
                                <div className="mb-2 flex items-center justify-between font-mono text-xs text-[#8E8B88]">
                                    <span>
                                        {indice + 1} de {activas.length}
                                    </span>
                                    <button
                                        onClick={volver}
                                        className="transition-colors hover:text-[#E8E5DE]"
                                    >
                                        ← Volver
                                    </button>
                                </div>
                                <div className="h-1 w-full overflow-hidden rounded-full bg-[#222120]">
                                    <motion.div
                                        className="h-full bg-[#C84214]"
                                        initial={false}
                                        animate={{
                                            width: `${((indice + 1) / activas.length) * 100}%`,
                                        }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            </div>

                            <h2 className="text-xl font-bold leading-snug sm:text-2xl">
                                {pregunta.titulo}
                            </h2>
                            {pregunta.ayuda && (
                                <p className="mt-2 text-sm text-[#8E8B88]">{pregunta.ayuda}</p>
                            )}

                            <div className="mt-6 flex flex-col gap-2.5">
                                {pregunta.opciones.map((opcion) => (
                                    <button
                                        key={opcion.label}
                                        onClick={() => responder(opcion)}
                                        className="group rounded-lg border border-[#3E3D3A] bg-[#151719] px-5 py-4 text-left text-[15px] leading-snug transition-all hover:border-[#C84214] hover:bg-[#1B1E20]"
                                    >
                                        <span className="transition-colors group-hover:text-white">
                                            {opcion.label}
                                        </span>
                                    </button>
                                ))}
                            </div>

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
                                className="mb-4 inline-flex items-center gap-1.5 font-mono text-xs text-[#8E8B88] transition-colors hover:text-[#E8E5DE]"
                            >
                                ← Volver a las preguntas
                            </button>
                            <div
                                className="rounded-xl border p-6 sm:p-7"
                                style={{ borderColor: resultado.color, background: resultado.bg }}
                            >
                                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#B7B3B0]">
                                    Tu resultado operativo
                                </span>
                                <div className="mt-2 flex items-baseline gap-3">
                                    <h2
                                        className="text-3xl font-bold sm:text-4xl"
                                        style={{ color: resultado.color }}
                                    >
                                        {resultado.titulo}
                                    </h2>
                                    <span className="font-mono text-sm text-[#8E8B88]">
                                        {puntaje}/{maximo}
                                    </span>
                                </div>
                                <p className="mt-4 text-[15px] leading-relaxed text-[#E8E5DE]">
                                    {resumen}
                                </p>
                            </div>

                            {/* Si es logística/distribuidora, destacamos la calculadora interactiva en el resultado */}
                            {plataforma === 'logistica' && (
                                <div className="mt-7">
                                    <CalculadoraFinancieraViva
                                        entregasDia={entregasDia}
                                        setEntregasDia={setEntregasDia}
                                        porcentajeFallos={porcentajeFallos}
                                        setPorcentajeFallos={setPorcentajeFallos}
                                    />
                                </div>
                            )}

                            <h3 className="mt-8 text-lg font-bold">Tres acciones concretas para tu operación</h3>
                            <ol className="mt-4 flex flex-col gap-3">
                                {acciones.map((accion, i) => (
                                    <li
                                        key={i}
                                        className="flex gap-3 rounded-lg border border-[#3E3D3A] bg-[#151719] px-4 py-3.5"
                                    >
                                        <span className="font-mono text-sm font-semibold text-[#C84214]">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <span className="text-[15px] leading-relaxed text-[#B7B3B0]">
                                            {accion}
                                        </span>
                                    </li>
                                ))}
                            </ol>

                            {/* Captura de contacto */}
                            <div className="mt-10 rounded-xl border border-[#3E3D3A] bg-[#151719] p-6">
                                <h3 className="text-lg font-bold">
                                    {plataforma === 'logistica'
                                        ? 'Recibí el desglose para tu flota y coordinemos el diagnóstico de 30 minutos'
                                        : 'Estamos construyendo el monitoreo automático'}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-[#B7B3B0]">
                                    {plataforma === 'logistica' ? (
                                        <>
                                            Dejanos tu contacto para enviarte este cálculo junto con el esquema de{' '}
                                            <strong className="text-[#E8E5DE]">Coordinación Previa y Ficha del Domicilio</strong>{' '}
                                            montado sobre tu planilla o ERP actual, sin instalarle aplicaciones a los choferes.
                                        </>
                                    ) : (
                                        <>
                                            Lo que acabás de responder lo tuviste que estimar de memoria.
                                            Estamos armando algo que lo calcule solo con los datos reales de tu
                                            operación y te avise <strong className="text-[#E8E5DE]">antes</strong>{' '}
                                            de que se te escape una venta o una entrega. Dejanos tu contacto y te
                                            escribimos cuando esté — o antes, si querés que lo hagamos con tu
                                            operación.
                                        </>
                                    )}
                                </p>

                                <form onSubmit={enviar} className="mt-5 flex flex-col gap-3">
                                    <input
                                        type="text"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        placeholder="Tu nombre y empresa"
                                        className="rounded-lg border border-[#3E3D3A] bg-[#0B0D0E] px-4 py-3 text-[15px] text-[#E8E5DE] outline-none transition-colors placeholder:text-[#6B6865] focus:border-[#C84214]"
                                    />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Tu email *"
                                        className="rounded-lg border border-[#3E3D3A] bg-[#0B0D0E] px-4 py-3 text-[15px] text-[#E8E5DE] outline-none transition-colors placeholder:text-[#6B6865] focus:border-[#C84214]"
                                    />
                                    <input
                                        type="tel"
                                        value={whatsapp}
                                        onChange={(e) => setWhatsapp(e.target.value)}
                                        placeholder="WhatsApp (opcional)"
                                        className="rounded-lg border border-[#3E3D3A] bg-[#0B0D0E] px-4 py-3 text-[15px] text-[#E8E5DE] outline-none transition-colors placeholder:text-[#6B6865] focus:border-[#C84214]"
                                    />
                                    {error && <p className="text-sm text-[#C84214]">{error}</p>}
                                    <button
                                        type="submit"
                                        disabled={enviando}
                                        className="mt-1 rounded-lg bg-[#C84214] px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#B03A11] disabled:opacity-60"
                                    >
                                        {enviando
                                            ? 'Enviando…'
                                            : plataforma === 'logistica'
                                              ? 'Recibir informe y coordinar diagnóstico'
                                              : 'Quiero que me avisen'}
                                    </button>
                                </form>
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
                            <h2 className="text-3xl font-bold sm:text-4xl">Listo, recibido.</h2>
                            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#B7B3B0]">
                                Ya registramos los datos de tu operación. Te vamos a contactar a la brevedad
                                para revisar los números juntos.
                            </p>
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                                <Link
                                    href={plataforma === 'logistica' ? '/logistica' : '/'}
                                    className="inline-block rounded-lg border border-[#3E3D3A] px-6 py-3 text-sm font-semibold transition-colors hover:border-[#C84214]"
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
