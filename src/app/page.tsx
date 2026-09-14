import {
    Navbar,
    HeroSection,
    ServicesSection,
    ConnectionSection,
    CatalogSection,
    FAQSection,
    ContactSection,
    Footer,
    FloatingChatbot,
    ComparativeSection,
    PainSolutionSection,
    DifferentiatorsSection,
    PropuestaComercialSection,
    IntegrationsBar,
    ProcessWorkflowSection,
} from '@/components/landing'

export default function Home() {
    return (
        <main id="main-content" className="bg-black min-h-screen">
            <Navbar />
            <HeroSection />
            <IntegrationsBar />
            <ProcessWorkflowSection />
            <PainSolutionSection />
            <ServicesSection />
            <ConnectionSection />
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
