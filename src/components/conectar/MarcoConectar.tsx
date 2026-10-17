import Image from 'next/image'
import Link from 'next/link'

/*
 * Marco de las páginas de conexión con Mercado Libre (/conectar/...): logo, una tarjeta centrada y el pie.
 * Son páginas a las que se llega por un link directo, sin el menú del sitio.
 */
export function MarcoConectar({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <header className="mx-auto w-full max-w-xl px-5 sm:px-8 pt-6 pb-4 lg:pt-10">
                <Link href="/" className="inline-flex">
                    <Image
                        src="/logo-individra-rebrand.png"
                        alt="INDIVIDRA, inicio"
                        width={640}
                        height={125}
                        quality={95}
                        sizes="200px"
                        className="h-9 sm:h-10 w-auto object-contain"
                        priority
                    />
                </Link>
            </header>
            <main className="flex-1 mx-auto w-full max-w-xl px-5 sm:px-8 pb-10">{children}</main>
            <footer className="mx-auto w-full max-w-xl px-5 sm:px-8 py-6 text-xs text-neutral-500">
                INDIVIDRA ·{' '}
                <Link href="/legal" className="underline underline-offset-2 hover:text-neutral-300">
                    Términos y privacidad
                </Link>
            </footer>
        </div>
    )
}
