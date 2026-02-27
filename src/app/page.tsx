import {
    Navbar,
    HeroSection,
    ServicesSection,
    CatalogSection,
    ProcessSection,
    FAQSection,
    ContactSection,
    Footer,
    FloatingChatbot,
} from '@/components/landing'

export default function Home() {
    return (
        <main className="bg-black min-h-screen">
            <Navbar />
            <HeroSection />
            <ServicesSection />
            <CatalogSection />
            <ProcessSection />
            <FAQSection />
            <ContactSection />
            <Footer />
            <FloatingChatbot />
        </main>
    )
}
