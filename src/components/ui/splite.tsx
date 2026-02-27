'use client'

import { Suspense, lazy, useRef, useCallback } from 'react'
import type { Application } from '@splinetool/runtime'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
    scene: string
    className?: string
    onLoad?: (spline: Application) => void
}

export function SplineScene({ scene, className, onLoad }: SplineSceneProps) {
    const splineRef = useRef<Application | null>(null)

    const handleLoad = useCallback((spline: Application) => {
        splineRef.current = spline
        onLoad?.(spline)
    }, [onLoad])

    return (
        <Suspense
            fallback={
                <div className="w-full h-full flex items-center justify-center">
                    <div className="loader">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
                    </div>
                </div>
            }
        >
            <Spline
                scene={scene}
                className={className}
                onLoad={handleLoad}
            />
        </Suspense>
    )
}
