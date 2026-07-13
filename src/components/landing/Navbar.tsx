'use client'

import { useState, useEffect } from 'react'
import { motion, animate } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('#')) {
            e.preventDefault()
            const targetId = href.replace('#', '')
            const element = document.getElementById(targetId)

            if (element) {
                setIsMobileMenuOpen(false)

                const y = element.getBoundingClientRect().top + window.scrollY

                animate(window.scrollY, y, {
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                    onUpdate: (latest) => window.scrollTo(0, latest)
                })

                window.history.pushState(null, '', href)
            }
        }
    }


    const navLinks = [
        { href: '#inicio', label: 'Inicio' },
        { href: '#diagnostico-ia', label: 'Diagnóstico IA' },
        { href: '#servicios', label: 'Servicios' },
        { href: '#proceso', label: 'Proceso' },
        { href: '/logistica', label: 'Logística' },
        { href: '#soluciones', label: 'Soluciones' },
        { href: '#faq', label: 'FAQ' },
    ]

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed top-4 left-4 right-4 z-[100] transition-all duration-500 rounded-2xl ${isScrolled || isMobileMenuOpen
                ? 'bg-black/80 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20'
                : 'bg-black/20 backdrop-blur-sm border border-white/5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <a href="#inicio" onClick={(e) => handleNavClick(e, '#inicio')} className="flex items-center cursor-pointer">
                        <Image
                            src="/logo-individra.png"
                            alt="INDIVIDRA"
                            width={280}
                            height={100}
                            className="h-12 sm:h-16 lg:h-20 w-auto"
                            priority
                        />
                    </a>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-6 lg:gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm font-medium flex items-center h-10 cursor-pointer relative after:absolute after:bottom-2 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-violet-500 after:to-blue-500 after:transition-all after:duration-300 hover:after:w-full"
                            >
                                {link.label}
                            </a>
                        ))}
                        <a
                            href="#contacto"
                            onClick={(e) => handleNavClick(e, '#contacto')}
                            className="px-4 py-2 lg:px-5 lg:py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs lg:text-sm font-medium rounded-full hover:shadow-lg hover:shadow-violet-500/25 hover:scale-105 active:scale-95 transition-all duration-200 whitespace-nowrap flex items-center h-10 cursor-pointer"
                        >
                            Empezar ahora
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                        aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="md:hidden mt-2 pb-4 border-t border-white/10 pt-4"
                    >
                        <div className="flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className="text-neutral-300 hover:text-white hover:bg-white/10 transition-all duration-200 text-base font-medium py-3 px-4 rounded-xl cursor-pointer"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <a
                                href="#contacto"
                                onClick={(e) => handleNavClick(e, '#contacto')}
                                className="mt-3 px-5 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-base font-medium rounded-xl hover:shadow-lg hover:shadow-violet-500/25 active:scale-[0.98] transition-all duration-200 text-center cursor-pointer"
                            >
                                Empezar ahora
                            </a>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.nav>
    )
}
