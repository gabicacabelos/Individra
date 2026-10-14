import {
    PriorNoticeDemo,
    HomeAccessDemo,
    PositionAlertDemo,
    ExpirationClockDemo,
    ReputationShieldDemo,
    AnomalyLogDemo,
} from '@/components/ui/micro-demos'

// Textos y datos de /logistica, compartidos por la versión desktop y la mobile.

export const WHATSAPP_HREF =
    'https://wa.me/5491160152435?text=' +
    encodeURIComponent('Hola Gabriel, quiero coordinar el diagnóstico gratuito de 30 minutos para logística.')

export const H1_TEXT = 'Tu administración se pasa el día contestando "¿dónde está mi pedido?".'

export const pains = [
    'El teléfono y el WhatsApp de administración explotan con clientes preguntando por sus entregas. La misma pregunta, cien veces por día.',
    'Los remitos se cargan a mano, uno por uno, y siempre hay errores de tipeo.',
    'El seguimiento de entregas vive en planillas sueltas y en la cabeza de dos personas.',
    'Los avisos de "salió tu pedido" o "hay una demora" dependen de que alguien se acuerde de mandarlos.',
    'Fuera de horario, nadie contesta. La consulta espera al día siguiente o se va con otro.',
    'Las entregas fallan porque el chofer no sabe cómo acceder al domicilio. Nadie guarda esa información para la próxima vez.',
    'Los paquetes se devuelven al remitente sin que nadie avise a tiempo. El costo del viaje de ida ya se pagó y no se cobró.',
]

export const PAIN_CLOSE =
    'Ninguna de estas tareas necesita criterio. Todas consumen horas de gente que debería estar resolviendo lo que sí importa.'

export const modules = [
    {
        step: 1,
        context: 'Al coordinar la entrega',
        quote: 'Me imponen el día y nunca preguntan si voy a estar.',
        name: 'Coordinación previa',
        desc: 'La noche anterior, cada destinatario de canal propio (con opt-in previo) recibe un mensaje: ¿vas a estar mañana? El que no puede, se saca de la carga antes de cargar el camión. Es el primer filtro del circuito: casi todas las entregas fallidas se evitan antes de que el camión salga. (En envíos Flex de ML opera bajo protocolos autorizados de la plataforma).',
        img: '/3d/icono-campana.png', iw: 473, ih: 512, anim: 'ring' as const,
        descShort: 'La noche anterior, cada destinatario confirma si va a estar (canal propio con opt-in). El que no puede, se saca antes de salir.',
        Demo: PriorNoticeDemo,
    },
    {
        step: 2,
        context: 'Antes de cargar el camión',
        quote: 'Es un barrio cerrado con guardia 24 horas y ponen que no había nadie.',
        name: 'Ficha del domicilio',
        desc: 'Después de la primera entrega a una dirección, el sistema guarda cómo se accede: portería, timbre, entre calles, si acepta dejar con vecino. La próxima vez, el dato viaja con la hoja de ruta sin que nadie lo busque.',
        img: '/3d/icono-casa.png', iw: 512, ih: 363,
        descShort: 'Después de la primera entrega, el sistema guarda cómo se accede: portería, timbre, entre calles. La próxima vez, viaja con la hoja de ruta.',
        Demo: HomeAccessDemo,
    },
    {
        step: 3,
        context: 'Durante la entrega',
        quote: 'Estuve de 9 a 18 esperando y nunca vinieron. Perdí el día entero.',
        name: 'Aviso por posición',
        desc: 'El chofer comparte su ubicación en vivo desde el bot de Telegram: sin app propia que instalar, sin hardware que comprar. En entregas de canal propio con opt-in, el destinatario recibe cuántas paradas faltan: la última chance de que reaccione antes del timbre. Sin horarios inventados.',
        img: '/3d/icono-pin-oro.png', iw: 425, ih: 512,
        descShort: 'El chofer comparte ubicación por Telegram y el destinatario recibe cuántas paradas faltan (canal propio con opt-in). Sin horarios inventados.',
        Demo: PositionAlertDemo,
    },
    {
        step: 4,
        context: 'Si algo falla',
        quote: 'Hoy era el último día de plazo. Nadie me avisó y lo devolvieron al remitente.',
        name: 'Reloj de vencimiento',
        desc: 'Cuenta los días que un paquete lleva sin entregarse. Avisa al destinatario a los 5, 2 y 1 día antes de que se devuelva (en pedidos de canal propio). Y le envía al dueño la lista de paquetes en riesgo cada mañana.',
        img: '/3d/icono-reloj-vto.png', iw: 457, ih: 512,
        descShort: 'Cuenta los días sin entrega y avisa al destinatario antes de la devolución. Al dueño le manda la lista de riesgo cada mañana.',
        Demo: ExpirationClockDemo,
    },
    {
        step: 5,
        context: 'Después de la entrega',
        quote: 'Una empresa espectacular pero nadie te pide que dejes reseña. Los únicos que escriben son los enojados.',
        name: 'Escudo de reputación',
        desc: 'Después de cada entrega exitosa, el destinatario recibe una invitación transparente para calificar en Google. En paralelo, se ofrece un canal directo y prioritario por WhatsApp para resolver cualquier reclamo en el acto. Cumple 100% con las políticas de Google (sin filtrado desleal) y da solución inmediata.',
        img: '/3d/icono-escudo.png', iw: 439, ih: 512,
        descShort: 'Invita a calificar en Google y ofrece en paralelo un canal directo por WhatsApp para resolver reclamos en el acto.',
        Demo: ReputationShieldDemo,
    },
    {
        step: 6,
        context: 'Control de operación',
        quote: 'Dijeron que pasaron y que no había nadie. Es mentira, estuve en casa todo el día.',
        name: 'Registro de anomalías',
        desc: 'Acá cierra el circuito. Si el destinatario había confirmado en Coordinación previa y aun así no estaba, eso es una anomalía, no la norma: el evento se guarda con fecha, hora y ubicación, y se cruza con esa confirmación para que el reporte tenga evidencia de dos fuentes, no una sospecha. A fin de mes tenés qué pasó de verdad en tu operación —sin acusar a nadie en el momento— y la prueba lista para el Parte del dador y el Escudo de reputación.',
        img: '/3d/icono-lupa.png', iw: 512, ih: 498,
        descShort: 'Si confirmó que iba a estar y aun así no estaba, es una anomalía: queda registrada con hora y ubicación, cruzada con su confirmación de Coordinación previa. La prueba de qué pasó de verdad.',
        Demo: AnomalyLogDemo,
    },
    {
        step: 7,
        context: 'Retención de dadores clave',
        quote: 'Un vendedor grande nos bajó los paquetes a cero de un día para el otro porque ML le pasó publicaciones a Full y ni nos enteramos.',
        name: 'Radar de Dadores (Alertas Flex)',
        desc: 'Monitorea el volumen diario de paquetes entregados por cada tienda o dador. Si una cuenta cae más del 50% de volumen respecto de su promedio habitual, el sistema dispara una alerta proactiva por Telegram a la dirección para comunicarse con el cliente antes de perder la cuenta definitivamente.',
        img: '/3d/icono-comparativa.png', iw: 512, ih: 512,
        descShort: 'Monitorea el volumen diario por vendedor. Alerta si un dador cae >50% para retenerlo antes de que se pase a Full.',
    },
    {
        step: 8,
        context: 'Cumplimiento normativo y métricas ML',
        quote: 'Se me pinchó una goma a las 18:00, le pedí al comprador pasar mañana y Mercado Libre nos penalizó a todos por reprogramar.',
        name: 'Protocolo de Incidente en Ruta (Política de Envíos Flex de Mercado Libre)',
        desc: 'Ante las políticas de Envíos Flex de Mercado Libre (Octubre), reprogramar entregas impacta las métricas del vendedor y la logística. Cuando un chofer sufre una avería, choque o siniestro imprevisto, el bot de Telegram captura fotos y GPS en tiempo real para armar el respaldo probatorio necesario para solicitar la exención ante ML, sin comprometer al comprador.',
        img: '/3d/icono-escudo-lock.png', iw: 433, ih: 512,
        descShort: 'Ante averías mecánicas o siniestros, documenta fotos y GPS por Telegram para respaldar la solicitud de exención de métricas en ML.',
    },
]


// Flujo de un pedido en 3 pasos (íconos clay: caja → sobre → pulgar).
export const flowSteps = [
    {
        n: '01',
        src: '/3d/icono-caja.png',
        w: 512,
        h: 457,
        title: 'Entra el pedido',
        desc: 'Ingresa desde tu ERP, Tiendanube o MercadoLibre. Sin carga manual ni tipeo.',
    },
    {
        n: '02',
        src: '/3d/icono-sobre.png',
        w: 467,
        h: 512,
        title: 'Avisás al cliente',
        desc: 'Aviso automático por WhatsApp con el estado real de la entrega, antes de que pregunte.',
    },
    {
        n: '03',
        src: '/3d/icono-pulgar.png',
        w: 429,
        h: 512,
        title: 'Entrega conforme',
        desc: 'Se cierra con evidencia del chofer y confirmación del destinatario. Prueba de que se hizo bien.',
    },
]
