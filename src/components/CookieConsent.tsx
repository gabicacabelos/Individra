'use client'

import { useEffect, useState } from 'react'
import { useConsent } from '@/providers/PostHogProvider'
import Link from 'next/link'

export function CookieConsent() {
    const { consent, accept, reject } = useConsent()
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (consent === null) {
            const t = setTimeout(() => setVisible(true), 800)
            return () => clearTimeout(t)
        } else {
            setVisible(false)
        }
    }, [consent])

    if (!visible) return null

    return (
        <div
            role="dialog"
            aria-label="Consentimiento de cookies"
            aria-live="polite"
            className="fixed bottom-0 left-0 right-0 z-[200] px-4 py-4 sm:px-6"
            style={{
                background: 'linear-gradient(to top, rgba(9,9,11,0.98) 0%, rgba(9,9,11,0.95) 100%)',
                borderTop: '1px solid rgba(139,92,246,0.2)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
            }}
        >
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-sm text-neutral-400 leading-relaxed max-w-2xl">
                    Usamos{' '}
                    <span className="text-neutral-300 font-medium">cookies de analíticas</span>
                    {' '}(PostHog) para entender cómo usás el sitio y mejorarlo. No compartimos tus datos con terceros.{' '}
                    <Link
                        href="/legal#privacidad"
                        className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors"
                    >
                        Política de Privacidad
                    </Link>
                </p>
                <div className="flex gap-3 flex-shrink-0">
                    <button
                        onClick={reject}
                        className="px-4 py-2 text-sm text-neutral-400 border border-white/10 rounded-lg hover:text-white hover:border-white/25 transition-colors duration-200"
                    >
                        Rechazar
                    </button>
                    <button
                        onClick={accept}
                        className="px-5 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200"
                        style={{
                            background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                            boxShadow: '0 0 20px rgba(124,58,237,0.25)',
                        }}
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    )
}
