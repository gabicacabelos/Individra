'use client'

import { Footer } from '@/components/landing/Footer'
import { EcommerceNav } from './sections/Nav'
import { Hero } from './sections/Hero'
import { ChannelStrip } from './sections/ChannelStrip'
import { Capabilities } from './sections/Capabilities'
import { StarSpotlight } from './sections/StarSpotlight'
import { FAQ } from './sections/FAQ'
import { FinalCTA } from './sections/FinalCTA'

/* ============================================================
   Identidad Individra (compartida con el resto del sitio):
   fondo #0B0D0E · acento #C84214 · crema #E8E5DE
   grises #B7B3B0 / #3E3D3A / #1E1D1C · tipografía Geist
   Layout propio de /ecommerce: NO reutiliza componentes de
   logística (sin PhoneChatHero, PainCarousel ni micro-demos).

   Cada sección vive en su propio archivo bajo ./sections; los
   assets 3D y los canales compartidos están en ./constants.
   ============================================================ */

export function EcommerceLanding() {
    return (
        <main id="main-content" className="min-h-screen bg-[#0B0D0E] text-[#E8E5DE] antialiased">
            <EcommerceNav />
            <Hero />
            <ChannelStrip />
            <Capabilities />
            <StarSpotlight />
            <FAQ />
            <FinalCTA />
            <Footer ctaHref="/diagnostico?origen=ecommerce" />
        </main>
    )
}
