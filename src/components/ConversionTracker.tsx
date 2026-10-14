'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

// Un solo listener para todos los puntos de contacto del sitio: WhatsApp, mail,
// Calendly y los CTA al diagnóstico. Así cualquier link nuevo queda medido sin
// tener que acordarse de agregar un onClick. Para medir otro elemento, sumarle
// data-track="nombre_del_evento".
function clasificar(href: string): string | null {
    if (href.startsWith('https://wa.me') || href.startsWith('https://api.whatsapp.com')) return 'whatsapp_clicked'
    if (href.startsWith('mailto:')) return 'email_clicked'
    if (href.includes('calendly.com')) return 'calendly_link_clicked'
    if (href.startsWith('/diagnostico')) return 'diagnostico_cta_clicked'
    return null
}

export function ConversionTracker() {
    useEffect(() => {
        function onClick(e: MouseEvent) {
            const target = e.target as Element | null
            const el = target?.closest<HTMLElement>('a[href], [data-track]')
            if (!el) return

            const href = el.getAttribute('href') ?? ''
            const evento = el.dataset.track ?? clasificar(href)
            if (!evento) return

            const seccion = el.closest<HTMLElement>('section[id], footer, nav')
            trackEvent(evento, {
                // Solo la ruta: los links de WhatsApp llevan en ?text= los números que cargó el usuario
                destino: href.startsWith('/') ? href : href.split('?')[0] || null,
                seccion: seccion?.id || seccion?.tagName.toLowerCase() || null,
                texto: el.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80) || null,
                pagina: window.location.pathname,
            })
        }

        // Captura: se registra aunque el link navegue o abra otra pestaña
        document.addEventListener('click', onClick, { capture: true })
        return () => document.removeEventListener('click', onClick, { capture: true })
    }, [])

    return null
}
