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
} from '@/components/landing'

export default function Home() {
    return (
        <main id="main-content" className="bg-black min-h-screen">
            <Navbar />
            <HeroSection />
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
