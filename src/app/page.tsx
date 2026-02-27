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
} from '@/components/landing'

export default function Home() {
    return (
        <main className="bg-black min-h-screen">
            <Navbar />
            <HeroSection />
            <ServicesSection />
            <ConnectionSection />
            <CatalogSection />
            <FAQSection />
            <ContactSection />
            <Footer />
            <FloatingChatbot />
        </main>
    )
}
