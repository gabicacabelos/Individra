'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { createContext, useContext, useEffect, useState } from 'react'

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
    posthog.init(POSTHOG_KEY, {
        api_host: 'https://us.i.posthog.com',
        capture_pageview: true,
        capture_pageleave: true,
    })
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    const [consent, setConsent] = useState<ConsentState>(null)

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY) as ConsentState
        if (stored === 'accepted') {
            setConsent('accepted')
            initPostHog()
        } else if (stored === 'rejected') {
            setConsent('rejected')
        }
    }, [])

    const accept = () => {
        localStorage.setItem(STORAGE_KEY, 'accepted')
        setConsent('accepted')
        initPostHog()
    }

    const reject = () => {
        localStorage.setItem(STORAGE_KEY, 'rejected')
        setConsent('rejected')
    }

    return (
        <ConsentContext.Provider value={{ consent, accept, reject }}>
            <PHProvider client={posthog}>
                {children}
            </PHProvider>
        </ConsentContext.Provider>
    )
}
