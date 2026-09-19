'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export function EcommerceNav() {
    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-4 left-4 right-4 z-[100] rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10"
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
                <Link href="/" className="flex items-center py-1">
                    <Image
                        src="/logo-individra-rebrand.png"
                        alt="INDIVIDRA - Inteligencia Operativa"
                        width={640}
                        height={125}
                        quality={85}
                        sizes="(max-width: 640px) 190px, 240px"
                        className="h-8 sm:h-10 w-auto object-contain"
                        priority
                    />
                </Link>

                <div className="hidden md:flex items-center gap-7">
                    <a href="#capacidades" className="text-neutral-400 hover:text-[#E8E5DE] transition-colors text-sm font-medium">
                        Capacidades
                    </a>
                    <a href="#centro" className="text-neutral-400 hover:text-[#E8E5DE] transition-colors text-sm font-medium">
                        Centro multicanal
                    </a>
                    <a href="#faq" className="text-neutral-400 hover:text-[#E8E5DE] transition-colors text-sm font-medium">
                        Preguntas
                    </a>
                    <Link href="/logistica" className="text-neutral-400 hover:text-[#E8E5DE] transition-colors text-sm font-medium">
                        Logística
                    </Link>
                </div>

                <Link
                    href="/diagnostico?origen=ecommerce"
                    className="px-4 py-2 bg-[#C84214] text-white text-xs sm:text-sm font-bold rounded-full hover:bg-[#B3390F] hover:scale-105 active:scale-95 transition-all duration-200 whitespace-nowrap"
                >
                    Diagnóstico gratuito
                </Link>
            </div>
        </motion.nav>
    )
}
