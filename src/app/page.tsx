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
    InteractiveConsultorSection,
    PromoVideoSection,
    PainSolutionSection,
    DifferentiatorsSection,
} from '@/components/landing'

export default function Home() {
    return (
        <main id="main-content" className="bg-black min-h-screen">
            <Navbar />
            <HeroSection />
            <InteractiveConsultorSection />
            <PromoVideoSection />
            <PainSolutionSection />
            <ServicesSection />
            <ConnectionSection />
            <CatalogSection />
            <DifferentiatorsSection />
            <ComparativeSection />
            <FAQSection />
            <ContactSection />
            <Footer />
            <FloatingChatbot />
        </main>
    )
}
