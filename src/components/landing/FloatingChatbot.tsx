'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lottie from 'lottie-react'
import { X, Send, Sparkles } from 'lucide-react'
import robotAnimation from '../../../public/animations/robot.json'

const PREDEFINED_RESPONSES = [
    // Saludos
    {
        keywords: ['hola', 'buenas', 'que tal', 'saludos', 'buen dia', 'buenas tardes', 'buenas noches', 'hey', 'hi'],
        reply: '¡Hola! 👋 Soy el asistente virtual de Individra. Puedo contarte sobre nuestros servicios, precios, tiempos de entrega o ayudarte a contactarnos. ¿Qué te gustaría saber?'
    },
    // Precios
    {
        keywords: ['precio', 'costo', 'cuanto', 'cuánto', 'sale', 'pagar', 'presupuesto', 'valores', 'tarifa', 'inversion', 'inversión', 'cobran', 'caro', 'barato', 'economico', 'económico'],
        reply: '💰 Cada proyecto es único y el precio depende del alcance y complejidad.\n\nLo que sí te puedo decir:\n• Trabajamos con empresas de todos los tamaños\n• Siempre arrancamos con un MVP para validar rápido\n• La primera llamada es sin costo ni compromiso\n\n¿Querés agendar una consulta gratuita de 30 min? Ahí te damos un presupuesto a medida para tu caso específico.'
    },
    // Servicios generales
    {
        keywords: ['servicio', 'hacen', 'ofrecen', 'que hacen', 'qué hacen'],
        reply: '🛠️ En Individra ofrecemos:\n\n• **Automatización IA**: Chatbots, procesamiento de documentos, respuestas automáticas\n• **Agentes Virtuales**: Asistentes 24/7 para WhatsApp, web e Instagram\n• **Desarrollo Web/App**: Plataformas, e-commerce, sistemas internos\n\n¿Sobre cuál te gustaría saber más?'
    },
    // Chatbots específicos
    {
        keywords: ['chatbot', 'chat bot', 'bot', 'whatsapp', 'messenger', 'instagram', 'atencion automatica', 'atención automática', 'asistente virtual'],
        reply: '🤖 Creamos chatbots inteligentes que:\n\n• Responden 24/7 en WhatsApp, web e Instagram\n• Califican leads automáticamente\n• Agendan citas sin intervención humana\n• Se integran con tu CRM\n• Responden con el tono de tu marca\n\nPueden manejar +500 consultas diarias. ¿Te interesa uno para tu negocio?'
    },
    // Automatización
    {
        keywords: ['automatizacion', 'automatización', 'automatizar', 'automático', 'automatico', 'proceso', 'repetitivo', 'manual'],
        reply: '⚡ Automatizamos tareas repetitivas:\n\n• Respuestas a consultas frecuentes\n• Procesamiento de facturas y documentos\n• Envío de recordatorios y seguimientos\n• Conexión entre sistemas (CRM, email, etc.)\n• Reportes automáticos\n\nEl objetivo: que tu equipo se enfoque en lo importante.'
    },
    // Desarrollo web
    {
        keywords: ['web', 'pagina', 'página', 'sitio', 'landing', 'ecommerce', 'e-commerce', 'tienda', 'aplicacion', 'aplicación', 'app', 'plataforma', 'sistema'],
        reply: '💻 Desarrollamos soluciones web modernas:\n\n• Landing pages de alta conversión\n• E-commerce y tiendas online\n• Plataformas y sistemas internos\n• Aplicaciones web personalizadas\n• Dashboards y paneles de control\n\nUsamos React, Next.js y las mejores tecnologías del mercado.'
    },
    // Tiempos de entrega
    {
        keywords: ['tiempo', 'demora', 'plazo', 'rapido', 'rápido', 'urgente', 'cuando', 'cuándo', 'cuanto tarda', 'cuánto tarda', 'entrega'],
        reply: '⏱️ Tiempos estimados:\n\n• Chatbot básico: 2-3 semanas\n• Automatizaciones: 3-4 semanas\n• Landing page: 2-3 semanas\n• Web/App completa: 1-2 meses\n\nSiempre empezamos con un MVP para que veas resultados rápido. Los tiempos exactos dependen del alcance.'
    },
    // Tecnologías
    {
        keywords: ['tecnologia', 'tecnología', 'stack', 'react', 'next', 'python', 'lenguaje', 'herramienta', 'openai', 'claude', 'gpt'],
        reply: '🔧 Nuestro stack tecnológico:\n\n• Frontend: React, Next.js, TypeScript\n• Backend: Node.js, Python\n• IA: OpenAI, Claude, modelos custom\n• Integraciones: WhatsApp API, CRMs, ERPs\n\nElegimos la tecnología que mejor se adapte a tu proyecto.'
    },
    // Proceso de trabajo
    {
        keywords: ['proceso', 'metodologia', 'metodología', 'pasos', 'etapas', 'como trabajan', 'cómo trabajan'],
        reply: '📋 Nuestro proceso:\n\n1️⃣ **Descubrimiento**: Entendemos tu negocio\n2️⃣ **Estrategia**: Diseñamos la solución\n3️⃣ **Desarrollo**: Construimos iterativamente\n4️⃣ **Implementación**: Lanzamos y capacitamos\n5️⃣ **Optimización**: Mejoramos continuamente\n\nPodés ver más detalles en la sección "Proceso" de la web.'
    },
    // Soporte y garantía
    {
        keywords: ['garantia', 'garantía', 'soporte', 'mantenimiento', 'problema', 'falla', 'ayuda', 'bug', 'error'],
        reply: '🛡️ Nuestro compromiso post-entrega:\n\n• Soporte técnico incluido\n• Monitoreo de rendimiento\n• Corrección de bugs sin costo adicional\n• Actualizaciones periódicas\n• Capacitación para tu equipo\n\nSi algo falla, lo resolvemos. Tu tranquilidad es prioridad.'
    },
    // Diferenciador
    {
        keywords: ['diferencia', 'mejor', 'porque', 'por que', 'por qué', 'ventaja', 'beneficio', 'especial', 'unicos', 'únicos'],
        reply: '✨ ¿Por qué Individra?\n\n• Soluciones que realmente impactan tu operación\n• No vendemos humo: entregamos resultados medibles\n• Acompañamiento de principio a fin\n• Tecnología de punta accesible\n• Equipo especializado en IA + desarrollo\n\nNo somos una agencia más. Somos tu socio tecnológico.'
    },
    // Industrias/Rubros
    {
        keywords: ['rubro', 'industria', 'sector', 'tipo de empresa', 'negocio', 'para quien', 'para quién', 'clientes'],
        reply: '🏢 Trabajamos con múltiples industrias:\n\n• Servicios profesionales\n• E-commerce y retail\n• Salud y clínicas\n• Estudios contables\n• Construcción\n• Hotelería y turismo\n\nCada solución se adapta a tu rubro. ¡Explorá la sección "Soluciones" para ver ejemplos!'
    },
    // Contacto
    {
        keywords: ['contacto', 'hablar', 'reunion', 'reunión', 'agendar', 'email', 'correo', 'telefono', 'teléfono', 'whatsapp', 'llamar', 'escribir'],
        reply: '📞 Podés contactarnos por:\n\n• **Formulario**: Al final de esta página\n• **Email**: individratec@gmail.com\n• **LinkedIn**: /company/individra\n\nAgendá una llamada gratuita de 30 min para conocer tu proyecto. ¡Sin compromiso!'
    },
    // Ejemplos/Portfolio
    {
        keywords: ['ejemplo', 'portfolio', 'trabajos', 'proyectos', 'casos', 'exito', 'éxito', 'resultados'],
        reply: '📊 Algunos resultados de nuestros clientes:\n\n• -70% en tiempo de respuesta a consultas\n• +40% en conversión de leads\n• -95% en carga manual de datos\n• +500 consultas/día atendidas por bots\n\nCada caso es diferente. Contanos tu situación y te mostramos qué podemos lograr.'
    },
    // Integraciones
    {
        keywords: ['integrar', 'integración', 'integracion', 'conectar', 'crm', 'erp', 'sistema actual', 'existente'],
        reply: '🔗 Nos integramos con tus sistemas:\n\n• CRMs (Salesforce, HubSpot, etc.)\n• ERPs y sistemas contables\n• WhatsApp Business API\n• Google Workspace\n• Bases de datos existentes\n\nLa integración es transparente, sin interrumpir tu operación.'
    },
    // IA específico
    {
        keywords: ['ia', 'inteligencia artificial', 'machine learning', 'ml', 'artificial'],
        reply: '🧠 Usamos IA para potenciar tu negocio:\n\n• Chatbots con comprensión de lenguaje natural\n• Procesamiento automático de documentos\n• Análisis de datos y predicciones\n• Personalización de experiencias\n\nNo es magia: es tecnología aplicada con propósito.'
    },
    // Gracias/Despedida
    {
        keywords: ['gracias', 'gracia', 'chau', 'adios', 'adiós', 'nos vemos', 'hasta luego', 'bye'],
        reply: '¡Gracias a vos! 🙌 Si necesitás algo más, acá estoy. ¡Éxitos con tu proyecto! 🚀'
    },
    // Quién sos / About
    {
        keywords: ['quien sos', 'quién sos', 'quien eres', 'quién eres', 'que sos', 'qué sos', 'sos real', 'humano', 'robot', 'persona'],
        reply: '🤖 Soy un asistente virtual automatizado de Individra. Puedo responder preguntas frecuentes sobre nuestros servicios.\n\nPara consultas más específicas o iniciar un proyecto, te recomiendo usar el formulario de contacto donde te atenderá nuestro equipo humano.'
    },
    // Argentina/Ubicación
    {
        keywords: ['argentina', 'buenos aires', 'donde', 'dónde', 'ubicacion', 'ubicación', 'pais', 'país', 'local'],
        reply: '📍 Somos de Buenos Aires, Argentina.\n\nTrabajamos con clientes de toda Latinoamérica y España. Las reuniones son virtuales, así que la ubicación no es un límite. ¡Podemos ayudarte estés donde estés!'
    },
];

const QUICK_SUGGESTIONS = [
    { label: '💰 Precios', message: '¿Cuánto cuestan sus servicios?' },
    { label: '🛠️ Servicios', message: '¿Qué servicios ofrecen?' },
    { label: '⏱️ Tiempos', message: '¿Cuánto tiempo toma un proyecto?' },
    { label: '📞 Contactar', message: '¿Cómo puedo contactarlos?' },
];

export function FloatingChatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
        { role: 'bot', text: '¡Hola! 👋 Soy el asistente de Individra. ¿En qué puedo ayudarte hoy?' }
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(true)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    const getBotResponse = (userText: string) => {
        const lowerText = userText.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ''); // Remove accents for better matching

        for (const preset of PREDEFINED_RESPONSES) {
            if (preset.keywords.some(keyword => {
                const normalizedKeyword = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                return lowerText.includes(normalizedKeyword);
            })) {
                return preset.reply;
            }
        }

        // Fallback response
        return '🤔 No tengo una respuesta específica para eso, pero puedo ayudarte con:\n\n• Información sobre servicios y precios\n• Tiempos de entrega\n• Proceso de trabajo\n• Cómo contactarnos\n\nO podés usar el formulario de contacto para una consulta personalizada. ¡Nuestro equipo te responderá pronto!';
    }

    const handleSend = async (messageText?: string) => {
        const textToSend = messageText || input.trim()
        if (!textToSend) return

        setInput('')
        setShowSuggestions(false)
        setMessages(prev => [...prev, { role: 'user', text: textToSend }])
        setIsTyping(true)

        // Simulate typing delay (varies by response length)
        const response = getBotResponse(textToSend);
        const typingDelay = Math.min(800 + response.length * 5, 2000);

        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'bot', text: response }]);
            setIsTyping(false);
        }, typingDelay)
    }

    const handleSuggestionClick = (suggestion: typeof QUICK_SUGGESTIONS[0]) => {
        handleSend(suggestion.message)
    }

    return (
        <>
            {/* Floating Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/30 flex items-center justify-center overflow-hidden border-2 border-white/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                    boxShadow: isOpen
                        ? '0 0 0 rgba(139, 92, 246, 0)'
                        : ['0 0 20px rgba(139, 92, 246, 0.4)', '0 0 40px rgba(139, 92, 246, 0.2)', '0 0 20px rgba(139, 92, 246, 0.4)']
                }}
                transition={{
                    boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X className="w-6 h-6 text-white" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="robot"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-14 h-14"
                        >
                            <Lottie
                                animationData={robotAnimation}
                                loop={true}
                                style={{ width: '100%', height: '100%' }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] h-[520px] max-h-[calc(100vh-120px)] bg-neutral-900 rounded-2xl border border-white/10 shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-violet-900/50 to-blue-900/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center overflow-hidden">
                                    <Lottie
                                        animationData={robotAnimation}
                                        loop={true}
                                        style={{ width: 36, height: 36 }}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-sm">Asistente Individra</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-emerald-400 text-xs">En línea</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i === messages.length - 1 ? 0 : 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line ${msg.role === 'user'
                                            ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-br-sm'
                                            : 'bg-neutral-800 text-neutral-200 rounded-bl-sm border border-white/5'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Typing indicator */}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-neutral-800 px-4 py-3 rounded-2xl rounded-bl-sm border border-white/5">
                                        <div className="flex gap-1">
                                            <motion.span
                                                animate={{ y: [0, -4, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                                className="w-2 h-2 bg-violet-400 rounded-full"
                                            />
                                            <motion.span
                                                animate={{ y: [0, -4, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                                                className="w-2 h-2 bg-violet-400 rounded-full"
                                            />
                                            <motion.span
                                                animate={{ y: [0, -4, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                                className="w-2 h-2 bg-violet-400 rounded-full"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Quick Suggestions */}
                            {showSuggestions && messages.length === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex flex-wrap gap-2 pt-2"
                                >
                                    {QUICK_SUGGESTIONS.map((suggestion, index) => (
                                        <motion.button
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.4 + index * 0.1 }}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            className="px-3 py-1.5 text-xs font-medium bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 hover:border-violet-500/50 text-violet-300 rounded-full transition-all duration-200"
                                        >
                                            {suggestion.label}
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/10 bg-neutral-900/80 backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                    placeholder="Escribí tu mensaje..."
                                    className="flex-1 bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500/50 transition-colors"
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={!input.trim()}
                                    className="w-10 h-10 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl flex items-center justify-center text-white hover:brightness-110 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="mt-2 text-center text-neutral-600 text-xs flex items-center justify-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Respuestas automatizadas
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
