'use client'

import { SpotlightInteractive } from "@/components/ui/spotlight-interactive"
import { Card } from "@/components/ui/card"

export default function TestSpotlight() {
    return (
        <main className="min-h-screen p-8 bg-neutral-950">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-bold text-white">
                        Spotlight Test Page
                    </h1>
                    <p className="text-neutral-400 text-lg">
                        Move your cursor over the cards to see the interactive spotlight effect
                    </p>
                </div>

                {/* Test 1: Blue-Purple-Pink Gradient */}
                <Card className="h-96 bg-black relative">
                    <SpotlightInteractive
                        size={400}
                        className="from-blue-400/50 via-purple-400/50 to-pink-400/50"
                    />
                    <div className="relative z-10 h-full flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Blue → Purple → Pink
                            </h2>
                            <p className="text-neutral-300">
                                Cursor spotlight with gradient
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Test 2: Green Gradient */}
                <Card className="h-96 bg-neutral-900 relative">
                    <SpotlightInteractive
                        size={500}
                        className="from-green-400/60 via-emerald-400/60 to-teal-400/60"
                    />
                    <div className="relative z-10 h-full flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Green → Emerald → Teal
                            </h2>
                            <p className="text-neutral-300">
                                Larger spotlight (500px)
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Test 3: Orange-Red Gradient */}
                <Card className="h-96 bg-neutral-950 relative">
                    <SpotlightInteractive
                        size={350}
                        className="from-orange-400/70 via-red-400/70 to-pink-400/70"
                    />
                    <div className="relative z-10 h-full flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Orange → Red → Pink
                            </h2>
                            <p className="text-neutral-300">
                                Higher opacity (70%)
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </main>
    )
}
