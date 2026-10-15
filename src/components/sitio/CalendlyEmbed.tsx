'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { trackEvent } from '@/lib/analytics'
import { CALENDLY_URL, EMAIL, whatsappHref } from './contacto'

const InlineWidget = dynamic(() => import('react-calendly').then((m) => m.InlineWidget), { ssr: false })

/**
 * Agenda de Calendly embebida (solo desktop, ≥1024px). Se monta cuando el bloque
 * está por entrar en pantalla, así no suma peso a la carga inicial ni al celular,
 * donde se usa el link directo.
 */
export function CalendlyEmbed() {
    const ref = useRef<HTMLDivElement>(null)
    const [montar, setMontar] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el || !window.matchMedia('(min-width: 1024px)').matches) return
        const observador = new IntersectionObserver(
            ([entrada]) => {
                if (entrada.isIntersecting) {
                    setMontar(true)
                    observador.disconnect()
                }
            },
            { rootMargin: '600px 0px' }
        )
        observador.observe(el)
        return () => observador.disconnect()
    }, [])

    // El final del embudo: Calendly avisa por postMessage cuando eligen horario y cuando confirman
    useEffect(() => {
        if (!montar) return
        const alRecibir = (e: MessageEvent) => {
            if (e.origin !== 'https://calendly.com') return
            const evento = (e.data as { event?: string } | null)?.event
            if (evento === 'calendly.date_and_time_selected') trackEvent('calendly_horario_elegido', { seccion: 'contacto' })
            if (evento === 'calendly.event_scheduled') trackEvent('calendly_reunion_agendada', { seccion: 'contacto' })
        }
        window.addEventListener('message', alRecibir)
        return () => window.removeEventListener('message', alRecibir)
    }, [montar])

    return (
        <div ref={ref} className="rounded-3xl border border-white/10 bg-[#141618] overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-white/10">
                <p className="font-heading font-bold text-white">Elegí un horario · 30 min</p>
                <p className="text-xs text-neutral-400">Videollamada · sin costo</p>
            </div>
            <div className="relative h-[680px]">
                {montar ? (
                    <InlineWidget
                        url={`${CALENDLY_URL}?hide_gdpr_banner=1&locale=es-ES`}
                        styles={{ height: '680px', width: '100%' }}
                        pageSettings={{
                            backgroundColor: '141618',
                            primaryColor: 'ff5520',
                            textColor: 'ffffff',
                            hideEventTypeDetails: true,
                            hideLandingPageDetails: true,
                        }}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
                        <div className="w-8 h-8 rounded-full border-2 border-[#FF5520]/30 border-t-[#FF5520] animate-spin" />
                    </div>
                )}
            </div>
            <p className="px-6 py-4 border-t border-white/10 text-sm text-neutral-400">
                ¿No carga el calendario?{' '}
                <a
                    href={whatsappHref('Hola Gabriel, quiero agendar el diagnóstico de 30 minutos.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FFA380] hover:text-white underline underline-offset-2 transition-colors"
                >
                    Escribinos por WhatsApp
                </a>{' '}
                o a{' '}
                <a href={`mailto:${EMAIL}`} className="text-[#FFA380] hover:text-white underline underline-offset-2 transition-colors">
                    {EMAIL}
                </a>
                .
            </p>
        </div>
    )
}
