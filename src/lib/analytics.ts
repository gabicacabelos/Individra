'use client'

type EventName =
    | 'logistica_nav_clicked'
    | 'logistica_bridge_clicked'
    | 'logistica_footer_clicked'
    | 'logistica_landing_cta_clicked'
    // Delegados en ConversionTracker
    | 'whatsapp_clicked'
    | 'email_clicked'
    | 'calendly_link_clicked'
    | 'diagnostico_cta_clicked'
    | 'home_hero_secundario_clicked'
    // Home
    | 'home_calculadora_usada'
    | 'home_calculadora_cta_clicked'
    | 'calendly_horario_elegido'
    | 'calendly_reunion_agendada'
    // Bloques vistos y barra fija
    | 'bloque_visto'
    | 'sticky_cta_clicked'

/** Misma clave que PostHogProvider. Sin consentimiento no se descarga PostHog (~180 KB). */
export function hayConsentimiento(): boolean {
    try {
        return localStorage.getItem('individra-cookie-consent') === 'accepted'
    } catch {
        return false
    }
}

export function trackEvent(
    name: EventName | string,
    properties?: Record<string, string | number | boolean | null | undefined>
) {
    if (typeof window === 'undefined' || !hayConsentimiento()) return

    try {
        import('posthog-js')
            .then(({ default: posthog }) => {
                if (posthog && typeof posthog.capture === 'function') {
                    posthog.capture(name, {
                        ...properties,
                        timestamp: new Date().toISOString(),
                    })
                }
            })
            .catch(() => {
                // PostHog no disponible o bloqueado por adblocker, degradación silenciosa
            })
    } catch {
        // Ignorar errores de tracking
    }
}
