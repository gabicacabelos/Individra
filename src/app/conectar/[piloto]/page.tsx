import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { MarcoConectar } from '@/components/conectar/MarcoConectar'
import { Eyebrow } from '@/components/sitio/shared'
import { whatsappHref } from '@/components/sitio/contacto'

export const metadata: Metadata = {
    title: 'Conectá tu cuenta de Mercado Libre | INDIVIDRA',
    description: 'Conexión de tu cuenta de Mercado Libre para el piloto de INDIVIDRA.',
    robots: { index: false, follow: false },
}

// Genera el intento de autorización recién al tocar el botón: por eso este link no vence
const CONECTAR_URL = 'https://jdjkyuftiaebxjvapiiv.supabase.co/functions/v1/ml-conectar'

const PASOS = [
    'Entrá con la cuenta principal del negocio. Mercado Libre no deja autorizar desde la cuenta de un colaborador.',
    'Si en este navegador tenés abierta otra cuenta de Mercado Libre, cerrá esa sesión o abrí este link en una ventana privada.',
    'Mercado Libre te muestra los permisos que pide INDIVIDRA. Aceptalos y volvés a esta página.',
]

export default async function ConectarPage({ params }: { params: Promise<{ piloto: string }> }) {
    const { piloto } = await params
    if (!/^[A-Za-z0-9_-]{16,64}$/.test(piloto)) notFound()

    return (
        <MarcoConectar>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:p-8">
                <Eyebrow>Piloto de 30 días</Eyebrow>
                <h1 className="mt-2 text-[1.65rem] lg:text-4xl font-heading font-extrabold leading-tight tracking-tight">
                    Conectá tu cuenta de Mercado Libre
                </h1>
                <p className="mt-3 text-neutral-300 leading-relaxed">
                    Con esta conexión te avisamos por WhatsApp apenas entra un reclamo, con el plazo exacto, y medimos cuánto
                    margen te queda antes de bajar de color.
                </p>

                <h2 className="mt-6 text-sm font-semibold text-white">Antes de tocar el botón</h2>
                <ol className="mt-3 space-y-3">
                    {PASOS.map((paso, i) => (
                        <li key={paso} className="flex gap-3 text-sm text-neutral-300 leading-relaxed">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF5520]/15 font-mono text-[11px] font-bold text-[#FFA380]">
                                {i + 1}
                            </span>
                            {paso}
                        </li>
                    ))}
                </ol>

                <a
                    href={`${CONECTAR_URL}?p=${encodeURIComponent(piloto)}`}
                    data-track="conectar_ml_clicked"
                    className="mt-7 w-full py-4 px-5 bg-[#D4430E] hover:bg-[#BF3A0B] text-white font-heading font-bold text-base rounded-2xl flex items-center justify-center gap-2 active:scale-[0.99] transition shadow-[0_4px_30px_rgba(255,85,32,0.3)]"
                >
                    Conectar mi cuenta de Mercado Libre
                    <ArrowRight className="w-4 h-4" aria-hidden />
                </a>

                <div className="mt-6 flex gap-3 rounded-2xl border border-white/10 bg-black/40 p-4">
                    <ShieldCheck className="w-5 h-5 mt-0.5 shrink-0 text-[#FFA380]" aria-hidden />
                    <p className="text-sm text-neutral-400 leading-relaxed">
                        En la semana 2 del piloto solo leemos: no cambiamos nada en tu cuenta. Podés pedirnos que la
                        desconectemos cuando quieras, o quitar el permiso desde la seguridad de tu cuenta de Mercado Libre.
                    </p>
                </div>
            </div>

            <p className="mt-5 text-sm text-neutral-400">
                ¿Dudas?{' '}
                <a
                    href={whatsappHref('Hola Gabriel, tengo una duda para conectar mi cuenta de Mercado Libre al piloto.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FFA380] underline underline-offset-2 hover:text-white"
                >
                    Escribinos por WhatsApp
                </a>
            </p>
        </MarcoConectar>
    )
}
