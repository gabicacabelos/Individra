import type { Metadata } from 'next'
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { MarcoConectar } from '@/components/conectar/MarcoConectar'
import { whatsappHref } from '@/components/sitio/contacto'

export const metadata: Metadata = {
    title: 'Conexión con Mercado Libre | INDIVIDRA',
    robots: { index: false, follow: false },
}

type Tono = 'ok' | 'aviso' | 'error'

// Los estados los manda ml-conectar o ml-callback (supabase/functions) al terminar cada intento
const ESTADOS: Record<string, { titulo: string; texto: string; tono: Tono }> = {
    listo: {
        titulo: 'Listo: tu cuenta quedó conectada',
        texto: 'Ya podés cerrar esta pestaña. Te escribimos por WhatsApp para arrancar el piloto.',
        tono: 'ok',
    },
    otra_cuenta: {
        titulo: 'Entraste con otra cuenta',
        texto:
            'Este link ya está conectado a otra cuenta de Mercado Libre y no la cambiamos. Cerrá sesión en Mercado Libre, entrá con la cuenta del negocio y volvé a abrir el link que te pasamos.',
        tono: 'aviso',
    },
    cancelado: {
        titulo: 'No se conectó',
        texto: 'Cancelaste en Mercado Libre. Cuando quieras, volvé a abrir el link que te pasamos y tocá el botón de nuevo.',
        tono: 'aviso',
    },
    vencido: {
        titulo: 'Ese intento ya se usó',
        texto: 'Cada intento sirve una sola vez. Volvé a abrir el link que te pasamos y tocá el botón de nuevo.',
        tono: 'aviso',
    },
    invalido: {
        titulo: 'Este link no es válido',
        texto: 'Revisá que lo hayas copiado completo. Si sigue sin funcionar, escribinos y te pasamos otro.',
        tono: 'error',
    },
    error: {
        titulo: 'No se pudo conectar',
        texto: 'Algo falló de nuestro lado. Escribinos por WhatsApp y lo resolvemos.',
        tono: 'error',
    },
}

const ICONO = {
    ok: { Icono: CheckCircle2, color: 'text-[#34D399]' },
    aviso: { Icono: AlertTriangle, color: 'text-[#FBBF24]' },
    error: { Icono: XCircle, color: 'text-[#F87171]' },
}

export default async function ResultadoPage({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
    const { estado } = await searchParams
    const e = ESTADOS[estado ?? ''] ?? ESTADOS.error
    const { Icono, color } = ICONO[e.tono]

    return (
        <MarcoConectar>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:p-8">
                <Icono className={`w-10 h-10 ${color}`} aria-hidden />
                <h1 className="mt-4 text-[1.65rem] lg:text-4xl font-heading font-extrabold leading-tight tracking-tight">
                    {e.titulo}
                </h1>
                <p className="mt-3 text-neutral-300 leading-relaxed">{e.texto}</p>
                {e.tono !== 'ok' && (
                    <a
                        href={whatsappHref(
                            `Hola Gabriel, estoy conectando mi cuenta de Mercado Libre al piloto y me apareció: "${e.titulo}".`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center justify-center w-full py-3.5 px-5 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 font-semibold transition"
                    >
                        Escribinos por WhatsApp
                    </a>
                )}
            </div>
        </MarcoConectar>
    )
}
