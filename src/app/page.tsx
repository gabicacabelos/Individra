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
} from '@/components/landing'

export default function Home() {
    return (
        <main id="main-content" className="bg-black min-h-screen">
            <Navbar />
            <HeroSection />
            <InteractiveConsultorSection />
            <PromoVideoSection />
            <ServicesSection />
            <ConnectionSection />
            <CatalogSection />
            <ComparativeSection />
            <FAQSection />
            <ContactSection />
            <Footer />
            <FloatingChatbot />
        </main>
    )
}
