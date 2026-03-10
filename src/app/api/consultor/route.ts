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

// Validar que el contenido sea apropiado y relacionado a negocios
function validateContent(input: string): { valid: boolean; reason?: string } {
    const lowerInput = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Lista de palabras inapropiadas
    const inappropriateWords = [
        'pedo', 'culo', 'mierda', 'cagar', 'puto', 'puta', 'verga', 'chota', 'concha',
        'boludo', 'pelotudo', 'forro', 'garcha', 'coger', 'cojeme', 'porn', 'sexo',
        'drogas', 'cocaina', 'marihuana', 'matar', 'asesinar', 'robar', 'hackear',
        'fuck', 'shit', 'ass', 'dick', 'pussy', 'cock', 'bitch', 'bastard'
    ];

    // Verificar palabras inapropiadas
    for (const word of inappropriateWords) {
        if (lowerInput.includes(word)) {
            return { valid: false, reason: 'El contenido no es apropiado. Por favor, describí un problema real de tu negocio.' };
        }
    }

    // Palabras y frases que indican contextos personales NO empresariales
    const personalContextKeywords = [
        // Relaciones personales
        'novia', 'novio', 'ex', 'pareja', 'esposa', 'esposo', 'marido', 'mujer',
        'amor', 'enamorado', 'enamorada', 'relacion', 'romance', 'romantico',
        'recuperar', 'recuperarla', 'recuperarlo', 'volver', 'perdonar', 'perdon',
        'infidelidad', 'engano', 'celos', 'celoso', 'celosa', 'ruptura', 'separacion',
        'casamiento', 'boda', 'divorcio', 'matrimonio',
        // Familia personal
        'mama', 'papa', 'padre', 'madre', 'hermano', 'hermana', 'hijo', 'hija',
        'abuelo', 'abuela', 'tio', 'tia', 'primo', 'prima', 'suegra', 'suegro',
        'cunado', 'cunada', 'familia',
        // Salud personal
        'enfermedad', 'enfermo', 'enferma', 'doctor', 'medico', 'hospital',
        'depresion', 'ansiedad', 'estres personal', 'insomnio', 'terapia',
        'psicologo', 'psiquiatra', 'medicamento', 'pastilla',
        // Educación personal
        'examen', 'parcial', 'final', 'tesis', 'facultad', 'universidad',
        'colegio', 'escuela', 'profesor', 'estudiante', 'tarea', 'deberes',
        'aprobar', 'reprobar', 'nota', 'calificacion',
        // Finanzas personales
        'deuda personal', 'prestamo personal', 'alquiler', 'expensas',
        'sueldo', 'salario', 'aguinaldo',
        // Emociones personales
        'triste', 'tristeza', 'soledad', 'solo', 'sola', 'llorar', 'lloro',
        'feliz', 'felicidad', 'miedo', 'asustado', 'asustada', 'angustia',
        // Ocio y entretenimiento
        'juego', 'videojuego', 'pelicula', 'serie', 'netflix', 'spotify',
        'musica', 'cancion', 'fiesta', 'boliche', 'bar', 'cerveza', 'alcohol',
        'vacaciones', 'viaje personal', 'hobby', 'deporte',
        // Preguntas generales no empresariales
        'que es', 'como funciona', 'quien es', 'donde esta', 'cuando fue',
        'receta', 'cocinar', 'comida', 'dieta', 'gym', 'gimnasio',
        'mascota', 'perro', 'gato', 'animal',
        // Otros contextos no empresariales
        'horoscopo', 'signo zodiacal', 'carta astral', 'tarot',
        'loteria', 'quiniela', 'apuesta', 'casino', 'tragamonedas'
    ];

    // Patrones que indican consultas personales
    const personalPatterns = [
        /perdi (a )?mi (novia|novio|pareja|esposa|esposo)/i,
        /recuperar (a )?mi (novia|novio|pareja|ex)/i,
        /mi (novia|novio|pareja|ex) (me dejo|termino|se fue)/i,
        /(quiero|necesito) (volver|recuperar) con/i,
        /como (conquisto|enamoro|seduzco)/i,
        /problema (personal|familiar|de pareja|de salud)/i,
        /me siento (triste|solo|sola|mal|deprimido|deprimida)/i,
        /(estudiar|aprobar|pasar) (el|la|un|una) (examen|parcial|materia)/i,
        /bajar de peso/i,
        /^(hola|buenas|buen dia|buenos dias)$/i,
        /^quien (sos|eres)\??$/i,
        /^que (sos|eres|haces)\??$/i,
        /^(test|prueba|probando)$/i,
        /^(asdf|qwerty|1234|aaaa|hhhh)/i,
    ];

    // Verificar patrones de contexto personal
    for (const pattern of personalPatterns) {
        if (pattern.test(lowerInput)) {
            return {
                valid: false,
                reason: 'Esta herramienta está diseñada exclusivamente para diagnosticar cuellos de botella en empresas y negocios. Por favor, describí un proceso empresarial que te gustaría automatizar (ej: "Pierdo 3 horas diarias armando presupuestos en Excel").'
            };
        }
    }

    // Verificar palabras de contexto personal
    for (const keyword of personalContextKeywords) {
        if (lowerInput.includes(keyword)) {
            return {
                valid: false,
                reason: 'Esta herramienta está diseñada exclusivamente para diagnosticar cuellos de botella en empresas y negocios. Por favor, describí un proceso empresarial que te gustaría automatizar (ej: "Pierdo 3 horas diarias armando presupuestos en Excel").'
            };
        }
    }

    // Palabras clave que indican contexto de negocios
    const businessKeywords = [
        'tiempo', 'horas', 'trabajo', 'cliente', 'venta', 'factura', 'presupuesto',
        'email', 'correo', 'whatsapp', 'mensaje', 'responder', 'atender', 'llamada',
        'documento', 'excel', 'planilla', 'datos', 'sistema', 'proceso', 'manual',
        'automatizar', 'repetitivo', 'empleado', 'equipo', 'empresa', 'negocio',
        'pedido', 'inventario', 'stock', 'envio', 'entrega', 'pago', 'cobro',
        'agenda', 'cita', 'turno', 'calendario', 'recordatorio', 'seguimiento',
        'reporte', 'informe', 'analisis', 'crm', 'erp', 'gestion', 'administrar',
        'cotizacion', 'proveedor', 'compra', 'orden', 'registro', 'base de datos',
        'formulario', 'web', 'pagina', 'app', 'aplicacion', 'software', 'plataforma',
        'lead', 'prospecto', 'contacto', 'marketing', 'campaña', 'publicidad',
        'redes', 'social', 'instagram', 'facebook', 'contenido', 'publicar',
        'tarea', 'proyecto', 'deadline', 'productividad', 'eficiencia', 'optimizar',
        'servicio', 'producto', 'logistica', 'despacho', 'almacen', 'bodega',
        'facturacion', 'contabilidad', 'finanzas', 'cobranza', 'mora', 'cuenta',
        'ticket', 'soporte', 'atencion al cliente', 'reclamo', 'queja',
        'propuesta', 'licitacion', 'contrato', 'comercial', 'ventas'
    ];

    // Verificar que tenga al menos una palabra relacionada a negocios
    const hasBusinessContext = businessKeywords.some(keyword => lowerInput.includes(keyword));

    // SIEMPRE requerir contexto empresarial
    if (!hasBusinessContext) {
        return {
            valid: false,
            reason: 'No detectamos un contexto empresarial en tu consulta. Por favor, describí un problema o proceso específico de tu negocio que te gustaría automatizar (ej: "Tardo mucho tiempo respondiendo consultas de clientes por WhatsApp").'
        };
    }

    return { valid: true };
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

        // Validar contenido antes de gastar tokens
        const contentValidation = validateContent(sanitizedPrompt);
        if (!contentValidation.valid) {
            return NextResponse.json(
                { error: contentValidation.reason },
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
