'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import posthog from 'posthog-js'

/**
 * Autodiagnóstico de envíos de Mercado Libre.
 *
 * PROTOTIPO — el objetivo no es la landing en sí: las preguntas son las 6 del
 * documento maestro (volumen, tasa de fallas, cómo se entera, workaround manual,
 * costo de un mes malo, disposición a pagar) convertidas en algo que se responde
 * en dos minutos y a escala. Cada respuesta es la entrevista que no pudimos
 * conseguir a mano.
 *
 * Deliberadamente NO pide OAuth ni datos privados: la fricción tiene que ser cero
 * para que el test mida demanda y no capacidad técnica.
 */

type Opcion = {
    label: string
    /** Puntos de riesgo. Ausente = la pregunta no puntúa (es de segmentación o de intención). */
    puntos?: number
}

type Pregunta = {
    id: string
    titulo: string
    ayuda?: string
    opciones: Opcion[]
}

const PREGUNTAS: Pregunta[] = [
    {
        id: 'canal',
        titulo: '¿Cómo entregás tus ventas de Mercado Libre?',
        opciones: [
            { label: 'Flex — reparto yo o un fletero que contrato' },
            { label: 'Mercado Envíos — pasa el correo a buscar' },
            { label: 'Full — mi stock está en el depósito de ML' },
            { label: 'Mezclo varios' },
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

const PUNTAJE_MAXIMO = PREGUNTAS.reduce(
    (acc, p) => acc + Math.max(...p.opciones.map((o) => o.puntos ?? 0)),
    0
)

type Nivel = 'verde' | 'amarillo' | 'rojo'

const RESULTADOS: Record<
    Nivel,
    { titulo: string; color: string; bg: string; resumen: string; acciones: string[] }
> = {
    verde: {
        titulo: 'Riesgo bajo',
        color: '#4ADE80',
        bg: 'rgba(74,222,128,0.1)',
        resumen:
            'Tu operación de envíos está razonablemente bajo control. El riesgo no es perder el color esta semana, es no enterarte el día que algo cambie: un fletero nuevo, un pico de ventas o una zona que empieza a fallar.',
        acciones: [
            'Anotá una vez por semana tu porcentaje de envíos correctos. Si no lo medís, no vas a ver la caída hasta que ya pasó.',
            'Definí de antemano cuántas entregas caídas por semana son tu señal de alarma.',
            'Si sumás volumen o cambiás de fletero, volvé a mirar este número los primeros 15 días.',
        ],
    },
    amarillo: {
        titulo: 'Riesgo medio',
        color: '#FBBF24',
        bg: 'rgba(251,191,36,0.1)',
        resumen:
            'Hay señales de que tu operación depende de que todo salga bien. Estás absorbiendo fallas con trabajo manual o enterándote tarde. Funciona hasta que tenés una semana mala — y ahí el golpe llega junto.',
        acciones: [
            'Cortá el día más temprano: revisá los pendientes a media tarde, no a la noche, cuando ya no hay margen para reaccionar.',
            'Avisale al comprador la ventana de entrega antes de que salga el reparto. La mayoría de las entregas fallidas son ausencias, no demoras.',
            'Llevá registro de qué zona y qué día concentran las fallas. Casi siempre están concentradas, no repartidas.',
        ],
    },
    rojo: {
        titulo: 'Riesgo alto',
        color: '#C84214',
        bg: 'rgba(200,66,20,0.12)',
        resumen:
            'Tu operación está expuesta: te enterás de los problemas cuando ya impactaron, y el control depende de tiempo tuyo o de tu equipo. En Mercado Libre el margen es finísimo — pocas entregas caídas en una semana te bajan la exposición de la semana siguiente.',
        acciones: [
            'Lo primero es medir: sacá tu porcentaje real de envíos correctos de las últimas 4 semanas. Sin ese número estás manejando a ciegas.',
            'Identificá el punto exacto donde te enterás tarde (¿el chofer no avisa? ¿nadie mira el panel a las 18?) y ponele un control ahí, aunque sea manual.',
            'Si tercerizás, empezá a cruzar lo que te facturan contra lo que Mercado Libre registró como entregado. Es el lugar donde más plata se escapa sin que se note.',
        ],
    },
}

function calcularNivel(puntaje: number): Nivel {
    if (puntaje <= 5) return 'verde'
    if (puntaje <= 11) return 'amarillo'
    return 'rojo'
}

/** PostHog solo está inicializado si el usuario aceptó cookies; esto lo hace inofensivo si no. */
function track(evento: string, props?: Record<string, unknown>) {
    try {
        posthog.capture(evento, props)
    } catch {
        /* noop */
    }
}

type Paso = 'intro' | 'preguntas' | 'resultado' | 'listo'

export function DiagnosticoEnvios() {
    const [paso, setPaso] = useState<Paso>('intro')
    const [indice, setIndice] = useState(0)
    const [respuestas, setRespuestas] = useState<Record<string, string>>({})
    const [puntaje, setPuntaje] = useState(0)

    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [whatsapp, setWhatsapp] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [error, setError] = useState('')

    const pregunta = PREGUNTAS[indice]
    const nivel = calcularNivel(puntaje)
    const resultado = RESULTADOS[nivel]

    function empezar() {
        track('diagnostico_iniciado')
        setPaso('preguntas')
    }

    function responder(opcion: Opcion) {
        const nuevas = { ...respuestas, [pregunta.id]: opcion.label }
        setRespuestas(nuevas)
        setPuntaje((p) => p + (opcion.puntos ?? 0))

        track('diagnostico_respuesta', {
            pregunta: pregunta.id,
            respuesta: opcion.label,
            paso: indice + 1,
        })

        if (indice < PREGUNTAS.length - 1) {
            setIndice(indice + 1)
        } else {
            const puntajeFinal = puntaje + (opcion.puntos ?? 0)
            track('diagnostico_completado', {
                puntaje: puntajeFinal,
                nivel: calcularNivel(puntajeFinal),
                volumen: nuevas.volumen,
                intencion: nuevas.intencion,
            })
            setPaso('resultado')
        }
    }

    function volver() {
        if (indice === 0) {
            setPaso('intro')
            return
        }
        const anterior = PREGUNTAS[indice - 1]
        const respuestaPrevia = respuestas[anterior.id]
        const opcionPrevia = anterior.opciones.find((o) => o.label === respuestaPrevia)
        setPuntaje((p) => p - (opcionPrevia?.puntos ?? 0))
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
                    nivel,
                    respuestas,
                }),
            })
            if (!res.ok) throw new Error('No se pudo enviar')
            // La métrica que realmente importa del experimento.
            track('diagnostico_contacto', { nivel, puntaje, intencion: respuestas.intencion })
            setPaso('listo')
        } catch {
            setError('No pudimos enviarlo. Probá de nuevo en un momento.')
        } finally {
            setEnviando(false)
        }
    }

    return (
        <main className="min-h-screen bg-[#0B0D0E] text-[#E8E5DE]">
            <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-5 py-16 sm:px-6">
                <AnimatePresence mode="wait">
                    {/* ---------------------------------------------- INTRO */}
                    {paso === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.35 }}
                        >
                            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#C84214]">
                                Autodiagnóstico · 2 minutos
                            </span>
                            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
                                ¿Qué tan cerca estás de{' '}
                                <span className="bg-gradient-to-r from-[#C84214] to-[#B7B3B0] bg-clip-text text-transparent">
                                    perder el verde?
                                </span>
                            </h1>
                            <p className="mt-5 text-base leading-relaxed text-[#B7B3B0] sm:text-lg">
                                Mercado Libre te exige un porcentaje muy alto de envíos correctos por
                                semana. Pocas entregas caídas te bajan la exposición de la semana
                                siguiente — y la mayoría de los vendedores se entera cuando ya pasó.
                            </p>
                            <p className="mt-4 text-base leading-relaxed text-[#B7B3B0]">
                                Son <strong className="text-[#E8E5DE]">9 preguntas</strong>. Al final te
                                decimos en qué nivel de riesgo está tu operación y tres cosas concretas
                                para bajarlo.
                            </p>
                            <div className="mt-6 rounded-lg border border-[#3E3D3A] bg-[#151719] px-4 py-3 text-sm text-[#B7B3B0]">
                                No te pedimos conectar tu cuenta ni ningún dato privado de Mercado
                                Libre. Solo tus respuestas.
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
                    {paso === 'preguntas' && (
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
                                        {indice + 1} de {PREGUNTAS.length}
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
                                            width: `${((indice + 1) / PREGUNTAS.length) * 100}%`,
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
                            <div
                                className="rounded-xl border p-6 sm:p-7"
                                style={{ borderColor: resultado.color, background: resultado.bg }}
                            >
                                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#B7B3B0]">
                                    Tu resultado
                                </span>
                                <div className="mt-2 flex items-baseline gap-3">
                                    <h2
                                        className="text-3xl font-bold sm:text-4xl"
                                        style={{ color: resultado.color }}
                                    >
                                        {resultado.titulo}
                                    </h2>
                                    <span className="font-mono text-sm text-[#8E8B88]">
                                        {puntaje}/{PUNTAJE_MAXIMO}
                                    </span>
                                </div>
                                <p className="mt-4 text-[15px] leading-relaxed text-[#E8E5DE]">
                                    {resultado.resumen}
                                </p>
                            </div>

                            <h3 className="mt-8 text-lg font-bold">Tres cosas para hacer ya</h3>
                            <ol className="mt-4 flex flex-col gap-3">
                                {resultado.acciones.map((accion, i) => (
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
                                    Estamos construyendo el monitoreo automático
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-[#B7B3B0]">
                                    Lo que acabás de responder lo tuviste que estimar de memoria.
                                    Estamos armando algo que lo calcule solo con los datos reales de tu
                                    cuenta y te avise <strong className="text-[#E8E5DE]">antes</strong> de
                                    que una entrega se caiga. Dejanos tu contacto y te escribimos cuando
                                    esté — o antes, si querés que lo hagamos con tu operación.
                                </p>

                                <form onSubmit={enviar} className="mt-5 flex flex-col gap-3">
                                    <input
                                        type="text"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        placeholder="Tu nombre"
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
                                        {enviando ? 'Enviando…' : 'Quiero que me avisen'}
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
                            <h2 className="text-3xl font-bold sm:text-4xl">Listo, anotado.</h2>
                            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#B7B3B0]">
                                Te vamos a escribir. Si en el medio querés contarnos cómo es tu
                                operación con más detalle, respondé ese mail — nos sirve muchísimo más
                                que cualquier encuesta.
                            </p>
                            <a
                                href="/"
                                className="mt-8 inline-block rounded-lg border border-[#3E3D3A] px-6 py-3 text-sm font-semibold transition-colors hover:border-[#C84214]"
                            >
                                Volver al inicio
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    )
}
