import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

// Sanitiza strings para prevenir XSS en HTML
function sanitizeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}

// Valida formato de email
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export async function POST(request: Request) {
    try {
        const { nombre, empresa, email, mensaje } = await request.json()

        // Validación de campos requeridos
        if (!nombre || !email || !mensaje) {
            return NextResponse.json(
                { error: 'Faltan campos requeridos' },
                { status: 400 }
            )
        }

        // Validación de formato de email
        if (!isValidEmail(email)) {
            return NextResponse.json(
                { error: 'El formato del email no es válido' },
                { status: 400 }
            )
        }

        // Validación de longitud máxima para prevenir ataques
        if (nombre.length > 100 || (empresa && empresa.length > 100) || email.length > 254 || mensaje.length > 5000) {
            return NextResponse.json(
                { error: 'Uno o más campos exceden la longitud máxima permitida' },
                { status: 400 }
            )
        }

        // Sanitizar todos los inputs
        const safeNombre = sanitizeHtml(nombre.trim())
        const safeEmpresa = empresa ? sanitizeHtml(empresa.trim()) : ''
        const safeEmail = sanitizeHtml(email.trim())
        const safeMensaje = sanitizeHtml(mensaje.trim())

        // Enviar email
        const { data, error } = await resend.emails.send({
            from: 'Individra <contacto@individratec.com>',
            to: ['individratec@gmail.com'],
            subject: `Nuevo contacto de ${safeNombre} - Individra`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                        <!-- Header -->
                        <div style="text-align: center; margin-bottom: 40px;">
                            <h1 style="color: #8b5cf6; font-size: 28px; margin: 0;">INDIVIDRA</h1>
                            <p style="color: #6b7280; font-size: 14px; margin-top: 8px;">Nuevo mensaje de contacto</p>
                        </div>

                        <!-- Card -->
                        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16162a 100%); border-radius: 16px; padding: 32px; border: 1px solid rgba(139, 92, 246, 0.2);">
                            <!-- Info Grid -->
                            <div style="margin-bottom: 24px;">
                                <div style="margin-bottom: 20px;">
                                    <p style="color: #8b5cf6; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px 0;">Nombre</p>
                                    <p style="color: #ffffff; font-size: 16px; margin: 0;">${safeNombre}</p>
                                </div>

                                ${safeEmpresa ? `
                                <div style="margin-bottom: 20px;">
                                    <p style="color: #8b5cf6; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px 0;">Empresa</p>
                                    <p style="color: #ffffff; font-size: 16px; margin: 0;">${safeEmpresa}</p>
                                </div>
                                ` : ''}

                                <div style="margin-bottom: 20px;">
                                    <p style="color: #8b5cf6; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px 0;">Email</p>
                                    <a href="mailto:${safeEmail}" style="color: #60a5fa; font-size: 16px; text-decoration: none;">${safeEmail}</a>
                                </div>
                            </div>

                            <!-- Divider -->
                            <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent); margin: 24px 0;"></div>

                            <!-- Message -->
                            <div>
                                <p style="color: #8b5cf6; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px 0;">Mensaje</p>
                                <p style="color: #d1d5db; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${safeMensaje}</p>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div style="text-align: center; margin-top: 32px;">
                            <p style="color: #4b5563; font-size: 12px; margin: 0;">
                                Este mensaje fue enviado desde el formulario de contacto de individra.com
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            replyTo: email.trim(),
        })

        if (error) {
            console.error('Error sending email:', error)
            return NextResponse.json(
                { error: 'Error al enviar el mensaje' },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { message: 'Mensaje enviado correctamente', id: data?.id },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error in contact API:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
