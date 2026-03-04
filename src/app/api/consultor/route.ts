import { NextResponse } from 'next/server';

// Rate limiting: máximo 5 requests por IP cada 10 minutos
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutos

function getRateLimitInfo(ip: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    // Limpiar registros antiguos periódicamente
    if (rateLimitMap.size > 10000) {
        for (const [key, value] of rateLimitMap.entries()) {
            if (now > value.resetTime) rateLimitMap.delete(key);
        }
    }

    if (!record || now > record.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
        return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
    }

    if (record.count >= RATE_LIMIT_MAX) {
        return { allowed: false, remaining: 0 };
    }

    record.count++;
    return { allowed: true, remaining: RATE_LIMIT_MAX - record.count };
}

// Sanitización básica contra prompt injection
function sanitizeInput(input: string): string {
    // Remover intentos obvios de inyección
    const dangerousPatterns = [
        /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?)/gi,
        /forget\s+(all\s+)?(previous|above|prior)/gi,
        /disregard\s+(all\s+)?(previous|above|prior)/gi,
        /new\s+instructions?:/gi,
        /system\s*:/gi,
        /assistant\s*:/gi,
        /\[INST\]/gi,
        /<\|im_start\|>/gi,
    ];

    let sanitized = input;
    for (const pattern of dangerousPatterns) {
        sanitized = sanitized.replace(pattern, '[FILTERED]');
    }

    return sanitized.trim();
}

// Validar que el response tenga la estructura esperada
function validateAIResponse(data: unknown): data is { diagnostico: string; solucion: string; tiempoAhorrado: string } {
    if (typeof data !== 'object' || data === null) return false;
    const obj = data as Record<string, unknown>;
    return (
        typeof obj.diagnostico === 'string' && obj.diagnostico.length > 0 &&
        typeof obj.solucion === 'string' && obj.solucion.length > 0 &&
        typeof obj.tiempoAhorrado === 'string' && obj.tiempoAhorrado.length > 0
    );
}

export async function POST(req: Request) {
    try {
        // Obtener IP del cliente
        const forwarded = req.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

        // Verificar rate limit
        const rateLimit = getRateLimitInfo(ip);
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Demasiadas solicitudes. Por favor, esperá unos minutos antes de intentar de nuevo.' },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Remaining': '0',
                        'Retry-After': '600'
                    }
                }
            );
        }

        const { prompt } = await req.json();

        if (!prompt || typeof prompt !== 'string') {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            );
        }

        if (prompt.length > 1000) {
            return NextResponse.json(
                { error: "El problema descrito es demasiado largo. Por favor, resumelo en menos de 1000 caracteres." },
                { status: 413 }
            );
        }

        // Sanitizar input
        const sanitizedPrompt = sanitizeInput(prompt);

        if (sanitizedPrompt.length < 10) {
            return NextResponse.json(
                { error: "Por favor, describí tu problema con más detalle." },
                { status: 400 }
            );
        }

        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            console.error('GROQ_API_KEY no configurada');
            return NextResponse.json(
                { error: 'Error de configuración del servidor' },
                { status: 500 }
            );
        }

        const systemPrompt = `
        Sos un consultor experto en automatización e Inteligencia Artificial B2B llamado "Individra Diagnostic AI".
        Tu trabajo es analizar el cuello de botella que describe el cliente y devolver una solución en formato JSON.

    REGLAS:
1. Tu respuesta DEBE ser un JSON válido.
        2. No incluyas explicaciones adicionales, formato markdown para código o texto antes / después del JSON.
        3. NUNCA menciones nombres de herramientas técnicas, plataformas o lenguajes(prohibido decir n8n, Make, Zapier, API, Python, Scraper, etc.).Las soluciones deben describirse conceptualmente o por su función(ej: "Agente IA", "Sistema automatizado").
        4. El JSON debe tener exactamente esta estructura:
{
    "diagnostico": "Breve análisis de por qué esto es un problema",
        "solucion": "De qué forma Individra lo automatizaría y qué beneficio trae",
            "tiempoAhorrado": "Aprox X horas semanales"
}

EJEMPLO:
Input: Pierdo horas mandando presupuestos pdf a mano.
    Output:
{
    "diagnostico": "Generación manual de documentos que bloquea el tiempo de ventas.",
        "solucion": "Implementación de un sistema automatizado que genere el PDF y lo envíe por WhatsApp en segundos tras cargar los datos.",
            "tiempoAhorrado": "Aprox 10 horas semanales"
}
`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: sanitizedPrompt }
                ],
                temperature: 0.7,
                response_format: { type: "json_object" }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error de la API de Groq:', errorText);
            throw new Error(`Error de Groq: ${response.status} `);
        }

        const completion = await response.json();
        const content = completion.choices[0].message.content;

        try {
            const parsedData = JSON.parse(content);

            // Validar que el response tenga la estructura correcta
            if (!validateAIResponse(parsedData)) {
                console.error('Response inválido de la IA:', parsedData);
                throw new Error('La IA no devolvió el formato esperado');
            }

            return NextResponse.json(parsedData, {
                headers: {
                    'X-RateLimit-Remaining': rateLimit.remaining.toString()
                }
            });
        } catch (jsonError) {
            console.error('Error parseando JSON:', content);
            throw new Error('La IA no devolvió un JSON válido');
        }

    } catch (error) {
        console.error('Error en ruta constultor:', error);
        return NextResponse.json(
            { error: 'Hubo un error al procesar tu solicitud.' },
            { status: 500 }
        );
    }
}
