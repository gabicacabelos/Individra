'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        posthog.init('phc_UayuHhgxCHSr8EkfbLQgKEbD6RZuw8opE9Nb20eq27D', {
            api_host: 'https://us.i.posthog.com',
            capture_pageview: true,
            capture_pageleave: true,
        })
    }, [])

    return <PHProvider client={posthog}>{children}</PHProvider>
}
