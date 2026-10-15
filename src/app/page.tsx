import { Navbar } from '@/components/sitio/Navbar'
import { Home as HomeSitio } from '@/components/sitio/Home'

export default function Home() {
    return (
        <main id="main-content" className="bg-[#0B0D0E] min-h-screen">
            <Navbar />
            <HomeSitio />
        </main>
    )
}
