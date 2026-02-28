'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react'

const navigation = {
    main: [
        { name: 'Inicio', href: '#inicio' },
        { name: 'Servicios', href: '#servicios' },
        { name: 'Soluciones', href: '#soluciones' },
        { name: 'Proceso', href: '#proceso' },
        { name: 'FAQ', href: '#faq' },
        { name: 'Contacto', href: '#contacto' },
    ],
    services: [
        { name: 'Automatización IA', href: '#servicios' },
        { name: 'Agentes Virtuales', href: '#servicios' },
        { name: 'Desarrollo Web', href: '#servicios' },
        { name: 'Consultoría Tech', href: '#contacto' },
    ],
    social: [
        { name: 'LinkedIn', href: 'https://linkedin.com' },
        { name: 'Instagram', href: 'https://instagram.com' },
        { name: 'X', href: 'https://x.com' },
    ],
}

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="relative bg-black border-t border-white/5 overflow-hidden">
            {/* Background Effects - consistent with other sections */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

            {/* Main Footer */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <motion.a
                            href="#inicio"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="inline-block"
                        >
                            <Image
                                src="/soloLetras2.png"
                                alt="INDIVIDRA"
                                width={280}
                                height={100}
                                className="h-24 w-auto"
                            />
                        </motion.a>
                        <p className="mt-4 text-neutral-400 text-sm leading-relaxed">
                            Transformamos negocios con inteligencia artificial y desarrollo de software a medida.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3 mt-6">
                            {navigation.social.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                                    aria-label={item.name}
                                >
                                    {item.name === 'LinkedIn' && (
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                        </svg>
                                    )}
                                    {item.name === 'Instagram' && (
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                                        </svg>
                                    )}
                                    {item.name === 'X' && (
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                        </svg>
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Navegación</h4>
                        <ul className="space-y-3">
                            {navigation.main.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className="text-neutral-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1 group"
                                    >
                                        {item.name}
                                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Servicios</h4>
                        <ul className="space-y-3">
                            {navigation.services.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className="text-neutral-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1 group"
                                    >
                                        {item.name}
                                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contacto</h4>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="mailto:individratec@gmail.com"
                                    className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-sm group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center group-hover:border-violet-500/50 transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    individratec@gmail.com
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://wa.me/5491100000000"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-sm group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center group-hover:border-violet-500/50 transition-colors">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    +54 9 11 0000-0000
                                </a>
                            </li>
                            <li>
                                <div className="flex items-center gap-3 text-neutral-400 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    Buenos Aires, Argentina
                                </div>
                            </li>
                        </ul>

                        {/* CTA Button */}
                        <a
                            href="#contacto"
                            className="group mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
                        >
                            Iniciar proyecto
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="relative z-10 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Copyright */}
                        <p className="text-neutral-500 text-sm">
                            © {currentYear} Individra. Todos los derechos reservados.
                        </p>

                        {/* Legal Links */}
                        <div className="flex items-center gap-6 text-sm">
                            <a href="#" className="text-neutral-500 hover:text-white transition-colors">
                                Política de privacidad
                            </a>
                            <a href="#" className="text-neutral-500 hover:text-white transition-colors">
                                Términos de servicio
                            </a>
                        </div>

                        {/* Logo icon */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <Image
                                src="/soloLogo.png"
                                alt="INDIVIDRA Logo"
                                width={70}
                                height={70}
                                className="h-16 w-auto opacity-50 hover:opacity-100 transition-opacity duration-300"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
