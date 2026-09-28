import dynamic from 'next/dynamic'
import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'

const IntegrationsBar = dynamic(() =>
    import('@/components/landing/IntegrationsBar').then((m) => m.IntegrationsBar)
)
const ProcessWorkflowSection = dynamic(() =>
    import('@/components/landing/ProcessWorkflowSection').then((m) => m.ProcessWorkflowSection)
)
const PainSolutionSection = dynamic(() =>
    import('@/components/landing/PainSolutionSection').then((m) => m.PainSolutionSection)
)
const ServicesSection = dynamic(() =>
    import('@/components/landing/ServicesSection').then((m) => m.ServicesSection)
)
const CatalogSection = dynamic(() =>
    import('@/components/landing/CatalogSection').then((m) => m.CatalogSection)
)
const DifferentiatorsSection = dynamic(() =>
    import('@/components/landing/DifferentiatorsSection').then((m) => m.DifferentiatorsSection)
)
const ComparativeSection = dynamic(() =>
    import('@/components/landing/ComparativeSection').then((m) => m.ComparativeSection)
)
const PropuestaComercialSection = dynamic(() =>
    import('@/components/landing/PropuestaComercialSection').then((m) => m.PropuestaComercialSection)
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
            <HeroSection />
            <IntegrationsBar />
            <ProcessWorkflowSection />
            <PainSolutionSection />
            <ServicesSection />
            <CatalogSection />
            <DifferentiatorsSection />
            <ComparativeSection />
            <PropuestaComercialSection />
            <FAQSection />
            <ContactSection />
            <Footer />
            <FloatingChatbot />
        </main>
    )
}
