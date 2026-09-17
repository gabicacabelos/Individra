import { NextResponse } from 'next/server'

/**
 * Recibe el autodiagnóstico de envíos de Mercado Libre.
 *
 * El objetivo de este endpoint no es solo capturar el lead: las respuestas son
 * la entrevista de validación que no pudimos hacer a mano (volumen, tasa de
 * fallas, costo de un mes malo, disposición a pagar). Por eso se reenvía el
 * cuestionario completo, no solo el contacto.
 */
export async function POST(req: Request) {
    try {
        const data = await req.json()

        if (!data.contacto?.email) {
            return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(data.contacto.email)) {
            return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
        }

        const payload = {
            email: data.contacto.email,
            nombre: data.contacto.nombre || '',
            whatsapp: data.contacto.whatsapp || '',
            // Resultado del diagnóstico
            puntaje: data.puntaje ?? null,
            puntajeMaximo: data.puntajeMaximo ?? null,
            porcentaje: data.porcentaje ?? null,
            nivel: data.nivel || '',
            // De dónde vino: 'ecommerce' (landing) o 'directo' (link compartido).
            // Las dos fuentes miden cosas distintas, no hay que mezclarlas.
            origen: data.origen || 'directo',
            // Respuestas crudas: esto es la data de validación
            respuestas: data.respuestas || {},
            timestamp: new Date().toISOString(),
            source: 'autodiagnostico-envios-ml',
        }

        // Webhook de n8n — no crítico, con timeout corto para no bloquear la respuesta
        const webhookUrl =
            process.env.N8N_DIAGNOSTIC_WEBHOOK_URL || process.env.N8N_LEAD_WEBHOOK_URL

        if (webhookUrl) {
            try {
                const res = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    signal: AbortSignal.timeout(4000),
                })
                console.log(`[diagnostico] n8n response: ${res.status}`)
            } catch (e) {
                console.error('[diagnostico] n8n error (non-critical):', e)
            }
        } else {
            console.warn('[diagnostico] No hay webhook configurado')
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[diagnostico] Error:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
