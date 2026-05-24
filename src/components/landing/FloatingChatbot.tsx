'use client'

import { motion } from 'framer-motion'
import { useConsent } from '@/providers/PostHogProvider'

export function FloatingChatbot() {
    const { consent } = useConsent()
    const cookieBannerVisible = consent === null

    const phoneNumber = "5491160152435"
    const message = encodeURIComponent("¡Hola Individra! Quiero saber más sobre cómo automatizar mi negocio.")
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`fixed right-6 z-[201] flex items-center gap-3 group transition-all duration-300 ${cookieBannerVisible ? 'bottom-24' : 'bottom-6'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
        >
            {/* Tooltip text */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="hidden sm:flex px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium shadow-xl whitespace-nowrap"
            >
                ¿Dudas? Hablá con un experto ahora
            </motion.div>

            {/* WhatsApp Button */}
            <motion.button
                className="w-16 h-16 rounded-full bg-[#25D366] flex items-center justify-center overflow-hidden border border-white/10 relative"
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(37, 211, 102, 0.6)' }}
                whileTap={{ scale: 0.95 }}
                animate={{
                    boxShadow: [
                        '0 0 15px rgba(37, 211, 102, 0.3)',
                        '0 0 25px rgba(37, 211, 102, 0.5)',
                        '0 0 15px rgba(37, 211, 102, 0.3)'
                    ]
                }}
                transition={{
                    boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                }}
            >
                {/* Subtle hover overlay */}
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Custom WhatsApp SVG icon */}
                <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8 text-white"
                >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
            </motion.button>
        </motion.a>
    )
}
