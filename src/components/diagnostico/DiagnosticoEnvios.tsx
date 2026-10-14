'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle2, Truck, ShoppingBag, ArrowLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    construirOferta,
    MargenResultado,
    OfertaRecomendada,
    PasoReputacion,
    type DatosReputacion,
} from './oferta'

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
    /** 'reputacion': en vez de opciones, el vendedor carga sus números de ML (paso opcional). */
    tipo?: 'reputacion'
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
        ayuda: 'Sumando ausentes, timbre roto, comercio cerrado o rechazo en puerta ($9.980 ARS por parada fallida).',
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
            { label: 'No avisamos: el camión sale directo con toda la hoja de ruta a ciegas', puntos: 4 },
        ],
    },
    {
        id: 'evidencia_conflicto',
        titulo: 'Cuando el chofer marca "Ausente" y el cliente reclama "Estuve todo el día", ¿cómo zanjás la discusión?',
        opciones: [
            { label: 'Cruzamos registro geolocalizado del intento con confirmación previa del destinatario', puntos: 0 },
            { label: 'Le pedimos foto del frente de la casa por WhatsApp al chofer', puntos: 2 },
            { label: 'Es la palabra del chofer contra la del cliente: solemos asumir el segundo viaje', puntos: 4 },
        ],
    },
    {
        id: 'remitos_rendicion',
        titulo: '¿Cómo gestionan los remitos firmados y la rendición de los choferes al regresar al depósito?',
        opciones: [
            { label: 'Bot en Telegram/WhatsApp donde el chofer rinde el remito firmado en 1 toque al entregar', puntos: 0 },
            { label: 'Mandan fotos sueltas por grupos de WhatsApp que quedan perdidas en la galería', puntos: 3 },
            { label: 'En papel físico: se acumulan remitos que administración tarda 24–48 hs en procesar', puntos: 4 },
        ],
    },
    {
        id: 'intencion',
        titulo: 'Si pudieras reducir los viajes en falso filtrando ausencias antes de salir, sin instalar apps pesadas a los choferes, ¿lo evaluarías?',
        opciones: [
            { label: 'Sí, quiero ver el protocolo aplicado a mi flota en una reunión de 20 minutos' },
            { label: 'Sí, me interesa probarlo en una sola ruta piloto sin compromiso' },
            { label: 'Por ahora solo quería calcular mis costos de rebote' },
        ],
    },
]

/* ============================================================
   Recorrido 2: Mercado Libre
   ============================================================ */

const PREGUNTAS_MELI: Pregunta[] = [
    {
        id: 'canal',
        titulo: '¿Cómo despachás el grueso de tus ventas en Mercado Libre?',
        opciones: [
            { label: 'Flex — reparto yo o fleteros tercerizados en el día', valor: 'flex' },
            { label: 'Mercado Envíos Colecta — pasa el correo o camión de ML a retirar', valor: 'envios' },
            { label: 'Full — mi stock está en el depósito de Mercado Libre', valor: 'full' },
            { label: 'Mixto: Colecta + Envíos Flex para entregas rápidas en AMBA', valor: 'mixto' },
        ],
    },
    {
        id: 'volumen',
        titulo: '¿Cuántos paquetes despachás por día en promedio en Mercado Libre?',
        opciones: [
            { label: 'Menos de 10 paquetes por día' },
            { label: 'Entre 10 y 30 paquetes por día' },
            { label: 'Entre 30 y 70 paquetes por día' },
            { label: 'Más de 70 paquetes por día' },
        ],
    },
    {
        id: 'reclamos_plazo',
        titulo: 'Cuando un comprador abre un reclamo o mediación en ML con plazo de vencimiento, ¿cómo te enterás y cómo sabés cuánto te falta para bajar de color?',
        canales: ['flex', 'envios', 'mixto'],
        opciones: [
            { label: 'Tengo alertas inmediatas con el plazo exacto y sé cuántos incidentes me faltan para bajar de color', puntos: 0 },
            { label: 'Reviso manualmente el panel de reclamos y reputación de ML varias veces por día', puntos: 2 },
            { label: 'Suelo enterarme sobre la hora porque el aviso queda tapado entre decenas de notificaciones', puntos: 4 },
            { label: 'Me enteré cuando ya había vencido el plazo: ML le devolvió el dinero al comprador y golpeó mi métrica', puntos: 4 },
        ],
    },
    {
        id: 'evidencia_controversias',
        titulo: 'Cuando el comprador alega "caja vacía" o hay un paquete en controversia, ¿con qué evidencia defendés el caso?',
        canales: ['flex', 'envios', 'mixto'],
        opciones: [
            { label: 'Tengo un expediente digital ordenado por paquete con foto de pesaje y remito', puntos: 0 },
            { label: 'Tengo un remito o registro firmado pero desordenado en papel', puntos: 2 },
            { label: 'Busco fotos del empaque en chats o cámaras de seguridad del depósito (tardo horas)', puntos: 3 },
            { label: 'Es mi palabra contra la del comprador: casi siempre termino perdiendo el costo del producto', puntos: 4 },
        ],
    },
    {
        id: 'control_fleteros',
        titulo: 'Si operás con Envíos Flex, ¿cómo auditás la planilla que te factura la logística o fletero a fin de mes?',
        canales: ['flex', 'mixto'],
        opciones: [
            { label: 'No opero Flex o tengo choferes propios con sueldo fijo', puntos: 0 },
            { label: 'Cruzo a mano una por una las etiquetas de ML contra la liquidación del fletero', puntos: 2 },
            { label: 'Confío en lo que me pasan: no cruzo paquete por paquete porque me llevaría días', puntos: 3 },
            { label: 'Ya detecté que me cobraron paquetes cancelados, reintentos inexistentes o zonas equivocadas', puntos: 4 },
        ],
    },
    {
        id: 'costo_reputacion',
        titulo: 'Si por cancelaciones o demoras caés de Verde a Amarillo en Mercado Libre, ¿cuánto estimás que pierde tu negocio en facturación ese mes?',
        ayuda: 'Considerando caída en exposición de listados, pérdida de Buy Box y comisiones de mediaciones.',
        opciones: [
            { label: 'Menos de $800.000 ARS', puntos: 1 },
            { label: 'Entre $800.000 y $3.000.000 ARS entre pérdida de exposición y reclamos', puntos: 3 },
            { label: 'Más de $3.000.000 ARS (la caída de ventas en los listados es inmediata y brutal)', puntos: 4 },
            { label: 'Nunca caí de verde / No lo tengo medido', puntos: 2 },
        ],
    },
    {
        id: 'numeros_reputacion',
        tipo: 'reputacion',
        titulo: 'Último dato: cargá tus números de reputación y te calculamos cuántos reclamos te quedan antes de bajar de color',
        ayuda: 'Los ves en la sección Reputación de tu cuenta de Mercado Libre. Si no los tenés a mano, podés seguir sin cargarlos.',
        opciones: [],
    },
    {
        id: 'intencion',
        titulo: 'Si tuvieras un sistema que te avise apenas entra un reclamo con el plazo exacto y te diga cuánto te falta para bajar de color, ¿lo evaluarías?',
        opciones: [
            { label: 'Sí, quiero coordinar los 20 minutos de diagnóstico para blindar mi termómetro en un piloto' },
            { label: 'Me interesa probarlo si hay un periodo de prueba acotado sin permanencia' },
            { label: 'Por ahora no es mi prioridad' },
        ],
    },
]

/* ============================================================
   Recorrido 3: E-Commerce Multicanal (Tiendanube + ML + WhatsApp/IG)
   ============================================================ */

const PREGUNTAS_OTROS: Pregunta[] = [
    {
        id: 'mezcla_canales',
        titulo: 'De cada 10 ventas que cerrás en una semana normal, ¿cuántas se cobran por transferencia en WhatsApp o Instagram y cuántas salen por ML / Tiendanube?',
        opciones: [
            { label: 'Más del 40% las cierro por WhatsApp/IG con transferencia bancaria directa', puntos: 4 },
            { label: 'Entre un 15% y un 40% entran por WhatsApp con transferencia, el resto automáticas', puntos: 3 },
            { label: 'Menos del 15%: casi todo entra directo por Tiendanube o Mercado Libre con pasarela', puntos: 1 },
            { label: 'Vendo 100% por Mercado Libre', puntos: 0 },
        ],
    },
    {
        id: 'sobreventa_stock',
        titulo: 'Cuando vendés una unidad por WhatsApp con transferencia, ¿en qué momento se descuenta ese stock en Mercado Libre y Tiendanube?',
        opciones: [
            { label: 'Tenemos un sincronizador que ya contempla las ventas cerradas por WhatsApp al instante', puntos: 0 },
            { label: 'Dejamos stock de seguridad guardado sin publicar para no correr riesgo de sobreventa', puntos: 2 },
            { label: 'Alguien del equipo entra a las apuradas a editar la publicación apenas mandan comprobante', puntos: 3 },
            { label: 'Lo bajamos a mano al final del día o al día siguiente (ya nos pasó que se vendió en ML en el medio)', puntos: 4 },
        ],
    },
    {
        id: 'validacion_comprobantes',
        titulo: 'Son las 16:30 hs, la moto de Flex o la colecta está en la puerta y entra un pedido por WhatsApp. ¿Cómo confirmás que la transferencia es real antes de despachar?',
        opciones: [
            { label: 'Si no impactó en cuenta en el momento, el paquete no sale (aunque el cliente se enoje)', puntos: 1 },
            { label: 'Chequeamos que el ID de operación no esté repetido en una planilla de Excel', puntos: 2 },
            { label: 'Entramos al homebanking o Mercado Pago a buscar el dinero en cuenta (perdemos 10-20 min por pedido)', puntos: 3 },
            { label: 'Miramos la captura que mandó el cliente por WhatsApp y confiamos para no demorar el despacho', puntos: 4 },
        ],
    },
    {
        id: 'horas_administracion',
        titulo: '¿Cuánto tiempo por día le dedica tu equipo a conciliar pagos, bajar stock a mano entre pestañas y pasar números de guía?',
        opciones: [
            { label: 'Cero tiempo: el proceso está 100% automatizado sin intervención manual', puntos: 0 },
            { label: 'Menos de 45 minutos por día', puntos: 1 },
            { label: 'Entre 1 y 2 horas por día repartidas entre el dueño y depósito', puntos: 3 },
            { label: 'Más de 2 horas y media por día (equivale a casi medio sueldo administrativo al mes)', puntos: 4 },
        ],
    },
    {
        id: 'reputacion_cancelaciones',
        titulo: 'En los últimos 90 días, ¿tuviste que cancelar alguna venta en Mercado Libre o comerte un reclamo porque no tenías stock o no encontraste el comprobante a tiempo?',
        opciones: [
            { label: 'Cero cancelaciones ni problemas de stock en los últimos 3 meses', puntos: 0 },
            { label: 'No cancelé, pero tuve que salir corriendo a comprar mercadería más cara a un colega', puntos: 2 },
            { label: 'Sí, 1 o 2 cancelaciones que me dejaron al límite del porcentaje permitido por ML', puntos: 3 },
            { label: 'Sí, me costó perder el color verde del termómetro y bajaron mis visitas drásticamente', puntos: 4 },
        ],
    },
    {
        id: 'intencion',
        titulo: 'Si con 1 solo clic en una pantalla pudieras verificar el comprobante, evitar duplicados y descontar el stock en ML y Tiendanube al instante, ¿evaluarías medirlo durante 30 días?',
        opciones: [
            { label: 'Sí, quiero coordinar 20 minutos para ver cómo se aplica a mi catálogo en un piloto de 30 días' },
            { label: 'Sí, pero solo si la configuración no interrumpe mis ventas actuales' },
            { label: 'Por ahora solo quería auditar mis costos operativos' },
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
        'Filtrá ausencias antes de cargar: un WhatsApp interactivo a las 20:00 hs del día anterior permite reprogramar antes de subir el paquete al vehículo.',
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
        'Auditá una vez por semana tu porcentaje de cancelaciones y demoras Flex: mantenerse en verde exige no relajarse con las horas de corte.',
        'Tené siempre medido cuántos reclamos o cancelaciones te separan del umbral para bajar de color.',
        'Mantené los expedientes con fotos de empaque y pesaje ordenados para responder mediaciones antes del vencimiento.',
    ],
    amarillo: [
        'Activá alertas inmediatas apenas entra un reclamo con su plazo exacto: la mayoría de las mediaciones se pierden porque el aviso queda tapado.',
        'Monitoreá en vivo cuántas operaciones de margen te quedan antes de bajar de color en el termómetro.',
        'Auditá la facturación de Envíos Flex cruzando paquete por paquete contra los códigos de entrega confirmada.',
    ],
    rojo: [
        'Alerta roja de reputación: caer a amarillo o rojo en Mercado Libre reduce drásticamente la exposición orgánica de tu catálogo.',
        'Centralizá avisos inmediatos de reclamos con cuenta regresiva del plazo exacto y expediente de empaque para responder a tiempo.',
        'Control estricto de entregas Flex: si el chofer no entrega a tiempo o cobra zonas erróneas, el costo económico y la sanción recaen sobre tu cuenta.',
    ],
}

/** Acciones específicas para quien opera 100% Full (el resto no le aplica). */
const ACCIONES_FULL = [
    'Mirá tu porcentaje de despachos a tiempo al depósito de Full: es la parte de la cadena que sigue en tus manos.',
    'Vigilá los quiebres de stock en el depósito; quedarte sin stock en Full también te baja exposición.',
    'Si además vendés por Flex o Envíos, repetí este diagnóstico pensando en ese canal: ahí es donde más te aplica.',
]

/** Acciones por defecto según nivel, recorrido E-Commerce Multicanal ("Venta Blindada"). */
const ACCIONES_OTROS: Record<Nivel, string[]> = {
    verde: [
        'Mantené auditado semanalmente el cruce entre pagos de WhatsApp y cancelaciones en ML: cuando el volumen crece, es el primer punto en quebrarse.',
        'Definí un límite de reserva de stock para transferencias (ej. 15 minutos) para no tener mercadería congelada que podría venderse en Tiendanube.',
        'Guardá registro de los IDs de comprobante bancario para blindarte ante compradores que reenvían comprobantes antiguos.',
    ],
    amarillo: [
        'Eliminá la bajada manual de stock al final del día: si vendés la última unidad por WhatsApp a la tarde, una hora después puede venderse en Mercado Libre.',
        'Dejá de chequear comprobantes abriendo homebanking en pleno despacho: un lector con deduplicación de ID te ahorra minutos críticos por orden.',
        'Armá un expediente único de orden (chat + comprobante + remito de despacho) para responder reclamos de Mercado Libre a tiempo.',
    ],
    rojo: [
        'Blindaje de stock urgente: cada cancelación forzada en Mercado Libre por sobreventa en WhatsApp te acerca al límite de degradación del termómetro.',
        'Cortá el despacho a ciegas por captura de WhatsApp: validá siempre la acreditación real y que el ID de operación no esté duplicado.',
        'Liberá al equipo de saltar entre 5 pestañas: centralizá la aprobación de pagos y la baja simultánea de stock en una consola unificada en 1 clic.',
    ],
}

/* ============================================================
   Fragmentos de resumen personalizado
   ============================================================ */

const FRAG_VOLUMEN_MELI: Record<string, string> = {
    'Menos de 10 paquetes por día': 'Con un volumen inicial (menos de 10 paquetes/día)',
    'Entre 10 y 30 paquetes por día': 'Con un volumen medio (10 a 30 paquetes/día)',
    'Entre 30 y 70 paquetes por día': 'Con volumen consolidado (30 a 70 paquetes/día)',
    'Más de 70 paquetes por día': 'Con alto volumen de despacho (>70 paquetes/día)',
}
const FRAG_RECLAMOS_PLAZO: Record<string, string> = {
    'Suelo enterarme sobre la hora porque el aviso queda tapado entre decenas de notificaciones':
        'Hoy te enterás de los reclamos sobre la hora porque el aviso queda tapado entre notificaciones de ventas y preguntas, con riesgo alto de perder mediaciones por plazo vencido.',
    'Reviso manualmente el panel de reclamos y reputación de ML varias veces por día':
        'Revisar el panel de reclamos a mano varias veces al día evita sorpresas pero desgasta tiempo crítico del equipo.',
    'Me enteré cuando ya había vencido el plazo: ML le devolvió el dinero al comprador y golpeó mi métrica':
        'Ya perdiste mediaciones por vencimiento del plazo de respuesta, lo que impactó directamente en tu termómetro de reputación.',
    'Tengo alertas inmediatas con el plazo exacto y sé cuántos incidentes me faltan para bajar de color':
        'Contás con un sistema de alerta temprana que te da margen para responder mediaciones y controlar el termómetro.',
}
const FRAG_EVIDENCIA: Record<string, string> = {
    'Es mi palabra contra la del comprador: casi siempre termino perdiendo el costo del producto':
        'Ante controversias de paquetes terminás asumiendo el costo por falta de expediente con evidencia fotográfica y de pesaje.',
    'Busco fotos del empaque en chats o cámaras de seguridad del depósito (tardo horas)':
        'Recuperar evidencia desde chats o cámaras te lleva horas de búsqueda manual ante cada reclamo.',
    'Tengo un remito o registro firmado pero desordenado en papel':
        'Tener remitos físicos sin digitalizar dificulta apelar mediaciones en tiempo y forma.',
    'Tengo un expediente digital ordenado por paquete con foto de pesaje y remito':
        'Tenés un expediente ordenado para defender mediaciones en ML.',
}
const FRAG_FLETEROS: Record<string, string> = {
    'Confío en lo que me pasan: no cruzo paquete por paquete porque me llevaría días':
        'No auditar la liquidación del fletero paquete por paquete suele esconder cobros de reintentos o cancelaciones indebidas.',
    'Ya detecté que me cobraron paquetes cancelados, reintentos inexistentes o zonas equivocadas':
        'Ya comprobaste fugas de dinero por liquidaciones de Envíos Flex mal calculadas.',
    'Cruzo a mano una por una las etiquetas de ML contra la liquidación del fletero':
        'Cruzar etiquetas contra fleteros a mano te protege pero se rompe apenas aumenta el volumen.',
}
const FRAG_COSTO_MELI: Record<string, string> = {
    'Más de $3.000.000 ARS (la caída de ventas en los listados es inmediata y brutal)':
        'Estimás que una caída de reputación le cuesta a tu negocio más de $3.000.000 ARS en ventas perdidas.',
    'Entre $800.000 y $3.000.000 ARS entre pérdida de exposición y reclamos':
        'Estimás un impacto de entre $800.000 y $3.000.000 ARS por degradación de termómetro.',
    'Menos de $800.000 ARS':
        'Estimás el impacto en menos de $800.000 ARS.',
    'Nunca caí de verde / No lo tengo medido':
        'Todavía no le pusiste número a lo que te cuesta caer de verde en Mercado Libre.',
}

function construirResumenMeli(r: Respuestas): string {
    if (valorCanalMeli(r) === 'full') {
        return [
            'Operás principalmente con Full, donde ML gestiona el despacho directo.',
            FRAG_COSTO_MELI[r.costo_reputacion] ?? '',
            'Tu riesgo crítico se concentra en no quebrar stock en el depósito y evitar cancelaciones pre-despacho.',
        ]
            .filter(Boolean)
            .join(' ')
    }

    const cabeza = FRAG_VOLUMEN_MELI[r.volumen] ?? ''
    return [
        cabeza ? `${cabeza},` : '',
        FRAG_RECLAMOS_PLAZO[r.reclamos_plazo] ?? '',
        FRAG_EVIDENCIA[r.evidencia_controversias] ?? '',
        FRAG_FLETEROS[r.control_fleteros] ?? '',
        FRAG_COSTO_MELI[r.costo_reputacion] ?? '',
    ]
        .filter(Boolean)
        .join(' ')
}

const FRAG_MEZCLA: Record<string, string> = {
    'Más del 40% las cierro por WhatsApp/IG con transferencia bancaria directa':
        'Manejás un volumen alto de cobro manual por transferencia (>40%), donde el riesgo de sobreventa cruzada es crítico.',
    'Entre un 15% y un 40% entran por WhatsApp con transferencia, el resto automáticas':
        'Tenés una mezcla activa entre canal directo y plataformas automáticas.',
    'Menos del 15%: casi todo entra directo por Tiendanube o Mercado Libre con pasarela':
        'La mayoría de tus ventas ingresa por canales integrados.',
}
const FRAG_SOBREVENTA: Record<string, string> = {
    'Lo bajamos a mano al final del día o al día siguiente (ya nos pasó que se vendió en ML en el medio)':
        'Bajar stock a mano al final del día te deja una ventana de varias horas donde se pueden duplicar ventas en ML.',
    'Alguien del equipo entra a las apuradas a editar la publicación apenas mandan comprobante':
        'Editar publicaciones a mano ante cada pago consume atención crítica y no escala ante picos de demanda.',
    'Dejamos stock de seguridad guardado sin publicar para no correr riesgo de sobreventa':
        'Guardar stock de seguridad sin publicar reduce tu volumen de ventas visibles y congela capital de trabajo.',
    'Tenemos un sincronizador que ya contempla las ventas cerradas por WhatsApp al instante':
        'Ya contás con descuento inmediato de stock entre canales.',
}
const FRAG_COMPROBANTES: Record<string, string> = {
    'Miramos la captura que mandó el cliente por WhatsApp y confiamos para no demorar el despacho':
        'Despachar confiando en la captura de WhatsApp te expone a comprobantes editados o transferencias no acreditadas.',
    'Entramos al homebanking o Mercado Pago a buscar el dinero en cuenta (perdemos 10-20 min por pedido)':
        'Entrar al homebanking por cada pedido genera un cuello de botella administrativo en plena hora de despacho.',
    'Chequeamos que el ID de operación no esté repetido en una planilla de Excel':
        'Chequear IDs de operación a mano en Excel evita duplicados pero quema horas valiosas de tu equipo.',
}
const FRAG_CANCELACIONES: Record<string, string> = {
    'Sí, me costó perder el color verde del termómetro y bajaron mis visitas drásticamente':
        'Ya sufriste una caída de termómetro en Mercado Libre por cancelaciones, con impacto directo en tu facturación.',
    'Sí, 1 o 2 cancelaciones que me dejaron al límite del porcentaje permitido por ML':
        'Estás al límite de cancelaciones toleradas por Mercado Libre: un nuevo quiebre de stock puede degradar tu cuenta.',
    'No cancelé, pero tuve que salir corriendo a comprar mercadería más cara a un colega':
        'Comprar mercadería a las apuradas para tapar quiebres de stock te erosiona el margen neto de cada venta.',
    'Cero cancelaciones ni problemas de stock en los últimos 3 meses':
        'Mantenés cero cancelaciones en el último trimestre, que es el objetivo a preservar.',
}

function construirResumenOtros(r: Respuestas): string {
    return [
        FRAG_MEZCLA[r.mezcla_canales] ?? '',
        FRAG_SOBREVENTA[r.sobreventa_stock] ?? '',
        FRAG_COMPROBANTES[r.validacion_comprobantes] ?? '',
        FRAG_CANCELACIONES[r.reputacion_cancelaciones] ?? '',
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
        `Con ${entregasDia} paradas diarias y un ${porcentajeFallos}% de rebote al primer intento, tu operación acumula ~${econ.fallosMes} viajes en falso por mes (${formatearArs(econ.perdidaMensualArs)}/mes sumando gasoil, tiempo de chofer y re-despacho a $9.980/parada).`,
    ]

    if (r.coordinacion === 'No avisamos: el camión sale directo con toda la hoja de ruta a ciegas') {
        partes.push(
            'Hoy los vehículos salen sin filtrar quién va a estar en el domicilio, que es donde se origina más de la mitad de esos rebotes.'
        )
    } else if (r.coordinacion === 'Mandamos WhatsApp o llamamos a mano en algunos casos puntuales') {
        partes.push(
            'La confirmación previa depende de llamados o mensajes manuales que no logran cubrir toda la jaula antes de salir.'
        )
    }

    if (r.evidencia_conflicto === 'Es la palabra del chofer contra la del cliente: solemos asumir el segundo viaje') {
        partes.push(
            'Cuando un destinatario alega que estuvo todo el día y el chofer marcó ausente, no contás con evidencia geolocalizada para sostener el cobro del segundo intento.'
        )
    }

    if (r.remitos_rendicion === 'En papel físico: se acumulan remitos que administración tarda 24–48 hs en procesar') {
        partes.push(
            'Rendir remitos en papel físico retrasa la facturación y la rendición ante dadores de carga hasta 48 horas.'
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

                <div className="rounded-lg border border-[#3E3D3A] bg-[#0B0D0E]/90 p-3.5">
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-[#FFA380]">
                        Proyección anual (12 meses)
                    </span>
                    <span className="mt-1 block font-mono text-lg sm:text-xl font-bold text-white">
                        {formatearArs(econ.perdidaMensualArs * 12)}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-[#8E8B88]">
                        Medimos cuánto recuperás en un piloto de 30 días
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
    const { activas, puntaje, maximo, porcentaje, nivel } = calcular(respuestas, plataforma)
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
          })
        : null

    function elegirPlataforma(p: Plataforma) {
        setPlataforma(p)
        setIndice(0)
        setRespuestas({})
        setReputacion(null)
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
        avanzar(nuevas)
    }

    function avanzar(nuevas: Respuestas) {
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
        <main className="min-h-screen bg-[#0B0D0E] text-[#E8E5DE]">
            <button
                type="button"
                onClick={salirHaciaAtras}
                className="fixed top-6 left-6 z-[100] flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                aria-label="Volver atrás"
            >
                <ArrowRight className="w-4 h-4 text-neutral-300 rotate-180" />
            </button>

            <div className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-5 py-16 sm:px-6">
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
                            <div className="text-center sm:text-left">
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

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <div className="mb-8">
                                <div className="mb-2 flex items-center justify-between font-mono text-xs text-[#8E8B88]">
                                    <span>
                                        {indice + 1} de {activas.length}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setPaso('plataforma')}
                                            className="transition-colors hover:text-[#FFA380] text-[#8E8B88]"
                                        >
                                            ‹ Cambiar perfil
                                        </button>
                                        <span className="text-[#3E3D3A]">|</span>
                                        <button
                                            type="button"
                                            onClick={volver}
                                            className="transition-colors hover:text-[#E8E5DE]"
                                        >
                                            ← Volver
                                        </button>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10 shadow-inner">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-[#FF5520] via-[#FF6E40] to-emerald-400"
                                        initial={false}
                                        animate={{
                                            width: `${((indice + 1) / activas.length) * 100}%`,
                                        }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            </div>

                            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white leading-snug tracking-tight">
                                {pregunta.titulo}
                            </h2>
                            {pregunta.ayuda && (
                                <p className="mt-2 text-sm text-neutral-400 font-sans">{pregunta.ayuda}</p>
                            )}

                            {pregunta.tipo === 'reputacion' ? (
                                <PasoReputacion
                                    onContinuar={(datos) => responderReputacion(datos)}
                                    onSaltear={() => responderReputacion(null)}
                                />
                            ) : (
                            <div className="mt-6 flex flex-col gap-3">
                                {pregunta.opciones.map((opcion, optIdx) => {
                                    const letters = ['A', 'B', 'C', 'D', 'E', 'F']
                                    return (
                                        <button
                                            key={opcion.label}
                                            onClick={() => responder(opcion)}
                                            className="group relative flex items-center justify-between gap-4 rounded-2xl border border-white/[0.10] card-obsidian sheen-top bg-gradient-to-r from-[#14161A] via-[#111316] to-[#0D0F12] px-5 py-4.5 text-left text-[15px] leading-snug transition-all duration-200 hover:border-[#FF5520]/60 hover:from-[#1A1D23] hover:to-[#14161A] hover:shadow-[0_4px_25px_-5px_rgba(255,85,32,0.25)] cursor-pointer active:scale-[0.99]"
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
                                className="mb-4 inline-flex items-center gap-1.5 font-mono text-xs text-[#8E8B88] transition-colors hover:text-[#E8E5DE]"
                            >
                                ← Volver a las preguntas
                            </button>
                            <div
                                className="rounded-3xl border card-obsidian sheen-top p-6 sm:p-8 shadow-2xl relative overflow-hidden"
                                style={{ borderColor: resultado.color, background: resultado.bg }}
                            >
                                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#FFA380] font-bold">
                                    Tu diagnóstico
                                </span>
                                <div className="mt-2 flex items-baseline gap-3">
                                    <h2
                                        className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight"
                                        style={{ color: resultado.color }}
                                    >
                                        {resultado.titulo}
                                    </h2>
                                    <span className="font-mono text-sm text-neutral-300 bg-black/60 px-2.5 py-0.5 rounded-md border border-white/10">
                                        {puntaje}/{maximo} puntos
                                    </span>
                                </div>
                                <p className="mt-4 text-[15px] leading-relaxed text-neutral-200 font-sans">
                                    {resumen}
                                </p>
                            </div>

                            {plataforma === 'meli' && reputacion && <MargenResultado datos={reputacion} />}

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

                            <h3 className="mt-8 text-xl font-extrabold font-heading text-white tracking-tight">
                                Tres acciones concretas para tu operación
                            </h3>
                            <ol className="mt-4 flex flex-col gap-3">
                                {acciones.map((accion, i) => (
                                    <li
                                        key={i}
                                        className="flex gap-4 rounded-2xl border border-white/[0.10] card-obsidian bg-gradient-to-r from-[#14161A] to-[#0E1013] p-4.5"
                                    >
                                        <span className="font-mono text-sm font-bold text-[#FFA380] bg-[#FF5520]/15 border border-[#FF5520]/30 px-2 py-0.5 rounded-md shrink-0 h-fit">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <span className="text-[15px] leading-relaxed text-neutral-200 font-sans">
                                            {accion}
                                        </span>
                                    </li>
                                ))}
                            </ol>

                            {oferta && <OfertaRecomendada oferta={oferta} />}

                            {/* Captura de contacto */}
                            <div className="mt-10 rounded-3xl border border-white/[0.12] card-obsidian sheen-top bg-gradient-to-br from-[#16181C] via-[#111316] to-[#0A0C0E] p-6 sm:p-8 shadow-2xl">
                                <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-white tracking-tight">
                                    {plataforma === 'logistica'
                                        ? 'Recibí el desglose para tu flota y coordinemos el diagnóstico de 30 minutos'
                                        : 'Reservá tu diagnóstico gratis de 30 minutos'}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-neutral-300 font-sans">
                                    {plataforma === 'logistica' ? (
                                        <>
                                            Dejanos tu contacto para enviarte este cálculo junto con el esquema de{' '}
                                            <strong className="text-white">Coordinación Previa y Ficha del Domicilio</strong>{' '}
                                            montado sobre tu planilla o ERP actual, sin instalarle aplicaciones a los choferes.
                                        </>
                                    ) : (
                                        <>
                                            Dejanos tus datos y te escribimos por WhatsApp para coordinar. En la
                                            llamada revisamos tu reputación con vos, te mostramos cómo te llegarían
                                            las alertas y, si te sirve, reservamos tu lugar en el{' '}
                                            <strong className="text-white">piloto de 30 días</strong>. Sin compromiso.
                                        </>
                                    )}
                                </p>

                                <form onSubmit={enviar} className="mt-6 flex flex-col gap-3.5">
                                    <input
                                        type="text"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        placeholder="Tu nombre y empresa"
                                        className="rounded-xl border border-white/10 bg-black/60 px-4 py-3.5 text-[15px] text-white outline-none transition-colors placeholder:text-neutral-500 focus:border-[#FF5520] focus:ring-1 focus:ring-[#FF5520]"
                                    />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Tu email *"
                                        className="rounded-xl border border-white/10 bg-black/60 px-4 py-3.5 text-[15px] text-white outline-none transition-colors placeholder:text-neutral-500 focus:border-[#FF5520] focus:ring-1 focus:ring-[#FF5520]"
                                    />
                                    <input
                                        type="tel"
                                        value={whatsapp}
                                        onChange={(e) => setWhatsapp(e.target.value)}
                                        placeholder="WhatsApp (para coordinar más rápido)"
                                        className="rounded-xl border border-white/10 bg-black/60 px-4 py-3.5 text-[15px] text-white outline-none transition-colors placeholder:text-neutral-500 focus:border-[#FF5520] focus:ring-1 focus:ring-[#FF5520]"
                                    />
                                    {error && <p className="text-sm text-red-400 font-mono">{error}</p>}
                                    <button
                                        type="submit"
                                        disabled={enviando}
                                        className="mt-2 rounded-2xl bg-gradient-to-r from-[#FF5520] via-[#FF6E40] to-[#FF5520] hover:brightness-110 px-6 py-4 text-base font-bold font-heading text-white transition-all shadow-[0_4px_25px_rgba(255,85,32,0.4)] disabled:opacity-60 cursor-pointer"
                                    >
                                        {enviando
                                            ? 'Enviando…'
                                            : plataforma === 'logistica'
                                              ? 'Recibir informe y coordinar diagnóstico'
                                              : 'Quiero mi diagnóstico gratis'}
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
                                Ya registramos los datos de tu operación. Te escribimos a la brevedad para
                                revisar los números juntos. Si querés, elegí el horario ahora mismo:
                            </p>
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                                <a
                                    href="https://calendly.com/individratec/30min"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5520] via-[#FF6E40] to-[#FF5520] hover:brightness-110 px-6 py-3 text-sm font-bold font-heading text-white shadow-[0_4px_25px_rgba(255,85,32,0.4)]"
                                >
                                    Elegir horario (30 min)
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                                <a
                                    href={`https://wa.me/5491160152435?text=${encodeURIComponent(
                                        `Hola Gabriel, terminé el autodiagnóstico de INDIVIDRA${oferta ? ` (me recomendó el ${oferta.plan.nombre})` : ''} y quiero coordinar el diagnóstico de 30 minutos.`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block rounded-lg border border-[#3E3D3A] px-6 py-3 text-sm font-semibold transition-colors hover:border-[#C84214]"
                                >
                                    Escribir por WhatsApp
                                </a>
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
