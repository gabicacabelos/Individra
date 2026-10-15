'use client'

import { createContext, useContext, useEffect, useSyncExternalStore } from 'react'

type ConsentState = 'accepted' | 'rejected' | null

type ConsentContextType = {
    consent: ConsentState
    accept: () => void
    reject: () => void
}

const ConsentContext = createContext<ConsentContextType>({
    consent: null,
    accept: () => {},
    reject: () => {},
})

export const useConsent = () => useContext(ConsentContext)

const POSTHOG_KEY = 'phc_UayuHhgxCHSr8EkfbLQgKEbD6RZuw8opE9Nb20eq27D'
const STORAGE_KEY = 'individra-cookie-consent'
let posthogInitialized = false

function initPostHog() {
    if (posthogInitialized) return
    posthogInitialized = true
    import('posthog-js').then(({ default: posthog }) => {
        posthog.init(POSTHOG_KEY, {
            api_host: 'https://us.i.posthog.com',
            capture_pageview: true,
            capture_pageleave: true,
        })
    })
}

// El consentimiento vive en localStorage. Se lee con useSyncExternalStore: en el
// servidor (y en la hidratación) vale null y en el cliente se toma lo guardado,
// sin setState dentro de un efecto. Si el navegador bloquea el storage, queda en memoria.
const oyentes = new Set<() => void>()
let enMemoria: ConsentState = null

function suscribir(avisar: () => void) {
    oyentes.add(avisar)
    window.addEventListener('storage', avisar)
    return () => {
        oyentes.delete(avisar)
        window.removeEventListener('storage', avisar)
    }
}

function leerConsentimiento(): ConsentState {
    try {
        const guardado = localStorage.getItem(STORAGE_KEY)
        if (guardado === 'accepted' || guardado === 'rejected') return guardado
    } catch {
        // storage bloqueado: usamos lo que quedó en memoria
    }
    return enMemoria
}

function guardarConsentimiento(valor: Exclude<ConsentState, null>) {
    enMemoria = valor
    try {
        localStorage.setItem(STORAGE_KEY, valor)
    } catch {
        // storage bloqueado: vale lo de memoria para esta visita
    }
    oyentes.forEach((avisar) => avisar())
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    const consent = useSyncExternalStore(suscribir, leerConsentimiento, () => null)

    useEffect(() => {
        if (consent === 'accepted') initPostHog()
    }, [consent])

    const accept = () => guardarConsentimiento('accepted')
    const reject = () => guardarConsentimiento('rejected')

    return (
        <ConsentContext.Provider value={{ consent, accept, reject }}>
            {children}
        </ConsentContext.Provider>
    )
}
