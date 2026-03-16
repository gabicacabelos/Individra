import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // Solo email es obligatorio
        if (!data.email) {
            return NextResponse.json(
                { error: 'Email requerido' },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return NextResponse.json(
                { error: 'Email inválido' },
                { status: 400 }
            );
        }

        // Preparar campos con defaults
        const costoSetup = (data.costoSetupMin && data.costoSetupMax)
            ? `$${data.costoSetupMin} - $${data.costoSetupMax}`
            : 'A cotizar';
        const costoMensual = (data.costoMensualMin && data.costoMensualMax)
            ? `$${data.costoMensualMin} - $${data.costoMensualMax}/mes`
            : 'A cotizar';
        const timeline = data.timeline
            ? `${data.timeline.fase1} | ${data.timeline.fase2} | ${data.timeline.fase3}`
            : 'A definir en llamada';

        // n8n webhook — NO crítico, con timeout de 4 segundos
        const n8nWebhookUrl = process.env.N8N_LEAD_WEBHOOK_URL;
        if (n8nWebhookUrl) {
            try {
                // En Vercel NECESITAMOS await, de lo contrario la función termina y mata el proceso antes de enviar el request
                const n8nRes = await fetch(n8nWebhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: data.email,
                        problema: data.problema || '',
                        diagnostico: data.diagnostico || '',
                        solucion: data.solucion || '',
                        tiempoAhorrado: data.tiempoAhorrado || '',
                        costoSetup,
                        costoMensual,
                        timeline,
                        timestamp: new Date().toISOString(),
                        source: 'diagnostic-premium'
                    }),
                    signal: AbortSignal.timeout(4000)
                });
                console.log(`[lead-capture] n8n response: ${n8nRes.status}`);
            } catch (e) {
                console.error('[lead-capture] n8n error (non-critical):', e);
            }
        } else {
            console.warn('[lead-capture] N8N_LEAD_WEBHOOK_URL no configurada');
        }

        // Responder inmediatamente sin esperar n8n
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('[lead-capture] Error:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
