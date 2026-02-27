'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lottie from 'lottie-react'
import { X, Send, Sparkles } from 'lucide-react'
import robotAnimation from '../../../public/animations/robot.json'

const PREDEFINED_RESPONSES = [
    {
        keywords: ['precio', 'costo', 'cuanto', 'sale', 'pagar', 'presupuesto', 'valores'],
        reply: 'Nuestros precios varían según el alcance del proyecto. Te invitamos a agendar una llamada en la sección de contacto para armar un presupuesto a medida.'
    },
    {
        keywords: ['servicio', 'hacen', 'ofrecen', 'web', 'bot', 'ia', 'inteligencia', 'automatizacion'],
        reply: 'Ofrecemos desarrollo web moderno, integraciones con IA, bots de atención automatizada y asesoramiento tecnológico para escalar tu negocio.'
    },
    {
        keywords: ['contacto', 'hablar', 'reunion', 'agendar', 'email', 'correo', 'tel', 'whatsapp', 'llamar'],
        reply: 'Podés contactarnos a través del formulario al final de esta página, agendar una llamada, o enviarnos un correo.'
    },
    {
        keywords: ['hola', 'buenas', 'que tal', 'saludos', 'buen dia', 'buenas tardes'],
        reply: '¡Hola! ¿Cómo estás? Soy el asistente virtual de Individra. Puedo contarte sobre nuestros servicios de desarrollo y automatización, o ayudarte a contactarnos.'
    },
    {
        keywords: ['ejemplo', 'portfolio', 'trabajos', 'proyectos', 'clientes'],
        reply: 'Podés ver ejemplos de nuestros proyectos y componentes en nuestro catálogo y explorar cómo las automatizaciones han ayudado a otros clientes.'
    }
];

export function FloatingChatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
        { role: 'bot', text: '¡Hola! Soy el asistente de Individra. ¿En qué puedo ayudarte hoy?' }
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)

    const getBotResponse = (userText: string) => {
        const lowerText = userText.toLowerCase();

        for (const preset of PREDEFINED_RESPONSES) {
            if (preset.keywords.some(keyword => lowerText.includes(keyword))) {
                return preset.reply;
            }
        }

        // Fallback response
        return '¡Gracias por tu mensaje! Soy un asistente automatizado. Para consultas específicas, empezar un proyecto o una atención personalizada, te recomiendo usar el formulario de contacto de la web.';
    }

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage = input.trim()
        setInput('')
        setMessages(prev => [...prev, { role: 'user', text: userMessage }])
        setIsTyping(true)

        // Simulate typing/network delay
        setTimeout(() => {
            const reply = getBotResponse(userMessage);
            setMessages(prev => [...prev, { role: 'bot', text: reply }]);
            setIsTyping(false);
        }, 1200 + Math.random() * 800)
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
                        className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] h-[480px] max-h-[calc(100vh-120px)] bg-neutral-900 rounded-2xl border border-white/10 shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
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
                                    transition={{ delay: i * 0.1 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${msg.role === 'user'
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
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/10 bg-neutral-900/80 backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Escribí tu mensaje..."
                                    className="flex-1 bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500/50 transition-colors"
                                />
                                <button
                                    onClick={handleSend}
                                    className="w-10 h-10 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl flex items-center justify-center text-white hover:brightness-110 active:scale-95 transition-all duration-150"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="mt-2 text-center text-neutral-600 text-xs flex items-center justify-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Respuestas Automatizadas
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
