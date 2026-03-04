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
} from '@/components/landing'

export default function Home() {
    return (
        <main className="bg-black min-h-screen">
            <Navbar />
            <HeroSection />
            <InteractiveConsultorSection />
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
