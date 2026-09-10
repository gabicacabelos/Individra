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
    PromoVideoSection,
    PainSolutionSection,
    DifferentiatorsSection,
    PropuestaComercialSection,
} from '@/components/landing'

export default function Home() {
    return (
        <main id="main-content" className="bg-black min-h-screen">
            <Navbar />
            <HeroSection />
            <PromoVideoSection />
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
