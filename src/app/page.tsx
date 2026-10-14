import dynamic from 'next/dynamic'
import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { MobileHome } from '@/components/landing/mobile/MobileHome'

const IntegrationsBar = dynamic(() =>
    import('@/components/landing/IntegrationsBar').then((m) => m.IntegrationsBar)
)
const PainSolutionSection = dynamic(() =>
    import('@/components/landing/PainSolutionSection').then((m) => m.PainSolutionSection)
)
const MargenColorCalculator = dynamic(() =>
    import('@/components/landing/MargenColorCalculator').then((m) => m.MargenColorCalculator)
)
const PropuestaComercialSection = dynamic(() =>
    import('@/components/landing/PropuestaComercialSection').then((m) => m.PropuestaComercialSection)
)
const LogisticaBridgeSection = dynamic(() =>
    import('@/components/landing/LogisticaBridgeSection').then((m) => m.LogisticaBridgeSection)
)
const FAQSection = dynamic(() =>
    import('@/components/landing/FAQSection').then((m) => m.FAQSection)
)
const ContactSection = dynamic(() =>
    import('@/components/landing/ContactSection').then((m) => m.ContactSection)
)
const Footer = dynamic(() =>
    import('@/components/landing/Footer').then((m) => m.Footer)
)
const FloatingChatbot = dynamic(() =>
    import('@/components/landing/FloatingChatbot').then((m) => m.FloatingChatbot)
)

export default function Home() {
    return (
        <main id="main-content" className="bg-black min-h-screen">
            <Navbar />
            {/* Celular (< 768px): home compacta. Tablet y desktop: la home completa, sin cambios */}
            <MobileHome />
            <div className="hidden md:block">
                <HeroSection />
                <IntegrationsBar />
                <PainSolutionSection />
                <MargenColorCalculator />
                <PropuestaComercialSection />
                <LogisticaBridgeSection />
                <FAQSection />
                <ContactSection />
                <Footer />
                <FloatingChatbot />
            </div>
        </main>
    )
}
