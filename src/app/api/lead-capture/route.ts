import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type LeadData = {
    email: string;
    problema: string;
    diagnostico: string;
    solucion: string;
    tiempoAhorrado: string;
};

function generatePremiumEmailHTML(data: LeadData): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tu Diagnóstico Completo - Individra</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">

                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
                                Tu Diagnóstico Completo
                            </h1>
                            <p style="color: #94a3b8; margin: 10px 0 0; font-size: 14px;">
                                Análisis personalizado por Individra AI
                            </p>
                        </td>
                    </tr>

                    <!-- Tu Problema -->
                    <tr>
                        <td style="padding: 30px 40px 20px;">
                            <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 20px;">
                                <h2 style="color: #ef4444; margin: 0 0 12px; font-size: 16px; font-weight: 600;">
                                    📋 Tu Problema Actual
                                </h2>
                                <p style="color: #e2e8f0; margin: 0; font-size: 15px; line-height: 1.6;">
                                    "${data.problema}"
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Diagnóstico -->
                    <tr>
                        <td style="padding: 10px 40px 20px;">
                            <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 12px; padding: 20px;">
                                <h2 style="color: #3b82f6; margin: 0 0 12px; font-size: 16px; font-weight: 600;">
                                    🔍 Diagnóstico Individra
                                </h2>
                                <p style="color: #e2e8f0; margin: 0; font-size: 15px; line-height: 1.6;">
                                    ${data.diagnostico}
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Solución -->
                    <tr>
                        <td style="padding: 10px 40px 20px;">
                            <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 12px; padding: 20px;">
                                <h2 style="color: #8b5cf6; margin: 0 0 12px; font-size: 16px; font-weight: 600;">
                                    💡 Solución Propuesta
                                </h2>
                                <p style="color: #e2e8f0; margin: 0; font-size: 15px; line-height: 1.6;">
                                    ${data.solucion}
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Tiempo Ahorrado -->
                    <tr>
                        <td style="padding: 10px 40px 20px;">
                            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 20px;">
                                <h2 style="color: #10b981; margin: 0 0 12px; font-size: 16px; font-weight: 600;">
                                    ⏱️ Tiempo que Ahorrarías
                                </h2>
                                <p style="color: #10b981; margin: 0; font-size: 20px; font-weight: 700;">
                                    ${data.tiempoAhorrado}
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Timeline Estimado -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <h2 style="color: #ffffff; margin: 0 0 20px; font-size: 18px; font-weight: 600; text-align: center;">
                                📅 Timeline Estimado de Implementación
                            </h2>
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 8px;">
                                        <p style="color: #3b82f6; margin: 0; font-size: 12px; font-weight: 600;">SEMANA 1-2</p>
                                        <p style="color: #e2e8f0; margin: 5px 0 0; font-size: 14px;">Análisis de requerimientos y diseño de arquitectura</p>
                                    </td>
                                </tr>
                                <tr><td style="height: 8px;"></td></tr>
                                <tr>
                                    <td style="padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                                        <p style="color: #8b5cf6; margin: 0; font-size: 12px; font-weight: 600;">SEMANA 3-4</p>
                                        <p style="color: #e2e8f0; margin: 5px 0 0; font-size: 14px;">Desarrollo e integración del sistema automatizado</p>
                                    </td>
                                </tr>
                                <tr><td style="height: 8px;"></td></tr>
                                <tr>
                                    <td style="padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                                        <p style="color: #10b981; margin: 0; font-size: 12px; font-weight: 600;">SEMANA 5</p>
                                        <p style="color: #e2e8f0; margin: 5px 0 0; font-size: 14px;">Testing, ajustes y lanzamiento en producción</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Rango de Inversión -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 12px; padding: 24px; text-align: center;">
                                <h2 style="color: #ffffff; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
                                    💰 Rango de Inversión Estimado
                                </h2>
                                <p style="color: #c4b5fd; margin: 0 0 8px; font-size: 14px;">
                                    Setup inicial (único)
                                </p>
                                <p style="color: #ffffff; margin: 0 0 16px; font-size: 24px; font-weight: 700;">
                                    USD $800 - $2,500*
                                </p>
                                <p style="color: #c4b5fd; margin: 0 0 8px; font-size: 14px;">
                                    Mantenimiento mensual (opcional)
                                </p>
                                <p style="color: #ffffff; margin: 0 0 16px; font-size: 20px; font-weight: 600;">
                                    USD $50 - $150/mes*
                                </p>
                                <p style="color: #94a3b8; margin: 0; font-size: 12px; font-style: italic;">
                                    *Los valores finales dependen del volumen de datos, integraciones requeridas y complejidad específica de tu caso. Este es un rango aproximado basado en proyectos similares.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- CTA -->
                    <tr>
                        <td style="padding: 30px 40px; text-align: center;">
                            <p style="color: #94a3b8; margin: 0 0 20px; font-size: 15px;">
                                ¿Listo para automatizar tu negocio?
                            </p>
                            <a href="https://wa.me/5491160152435?text=Hola%20Individra!%20Recibí%20el%20diagnóstico%20por%20email%20y%20quiero%20avanzar%20con%20la%20implementación."
                               style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: 600;">
                                📱 Agendar llamada por WhatsApp
                            </a>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background: rgba(0,0,0,0.3); text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
                            <p style="color: #64748b; margin: 0; font-size: 13px;">
                                Individra - Automatización con IA para empresas
                            </p>
                            <p style="color: #475569; margin: 10px 0 0; font-size: 12px;">
                                Buenos Aires, Argentina | individratec@gmail.com
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
}

export async function POST(req: Request) {
    try {
        const data: LeadData = await req.json();

        // Validar datos
        if (!data.email || !data.problema || !data.diagnostico || !data.solucion) {
            return NextResponse.json(
                { error: 'Datos incompletos' },
                { status: 400 }
            );
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return NextResponse.json(
                { error: 'Email inválido' },
                { status: 400 }
            );
        }

        // Enviar a n8n webhook para guardar en Google Sheets
        const n8nWebhookUrl = process.env.N8N_LEAD_WEBHOOK_URL;
        if (n8nWebhookUrl) {
            try {
                await fetch(n8nWebhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: data.email,
                        problema: data.problema,
                        diagnostico: data.diagnostico,
                        solucion: data.solucion,
                        tiempoAhorrado: data.tiempoAhorrado,
                        timestamp: new Date().toISOString(),
                        source: 'diagnostic-ia'
                    })
                });
            } catch (webhookError) {
                console.error('Error enviando a n8n:', webhookError);
                // No bloqueamos el flujo si falla el webhook
            }
        }

        // Enviar email premium con Resend
        const { error: emailError } = await resend.emails.send({
            from: 'Individra <noreply@individratec.com>',
            to: data.email,
            subject: '🔍 Tu Diagnóstico Completo + Costos Estimados - Individra',
            html: generatePremiumEmailHTML(data),
        });

        if (emailError) {
            console.error('Error enviando email:', emailError);
            return NextResponse.json(
                { error: 'Error al enviar el email' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error en lead-capture:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
