'use client'

import Image from 'next/image'
import { ART } from '../constants/assets'
import { CHANNELS } from '../constants/channels'
import { Ripple } from '../motion'

/* ---------- Franja de canales ---------- */

export function ChannelStrip() {
    return (
        <section className="relative border-y border-white/5 bg-[#0B0D0E] py-8">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <span className="relative inline-flex w-9 h-9 shrink-0 items-center justify-center">
                        <Ripple />
                        <Image
                            src={ART.power.src}
                            alt={ART.power.alt}
                            width={ART.power.w}
                            height={ART.power.h}
                            quality={85}
                            sizes="96px"
                            className="relative w-9 h-9 object-contain drop-shadow-[0_0_14px_rgba(200,66,20,0.5)]"
                        />
                    </span>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#B7B3B0]">
                        Se conecta con donde ya vendés
                    </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                    {CHANNELS.map((c) => (
                        <div
                            key={c.name}
                            className="flex items-center gap-2.5 rounded-xl border border-[#3E3D3A] bg-[#121312] px-4 py-2.5"
                        >
                            <span
                                className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-black"
                                style={{ background: c.tint }}
                            >
                                {c.initial}
                            </span>
                            <span className="text-sm font-medium text-[#E8E5DE]">{c.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
