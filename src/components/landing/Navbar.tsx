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
        { href: '#servicios', label: 'Servicios' },
        { href: '#proceso', label: 'Proceso' },
        { href: '#soluciones', label: 'Soluciones' },
        { href: '#faq', label: 'FAQ' },
        { href: '#contacto', label: 'Contacto' },
    ]

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled || isMobileMenuOpen
                ? 'bg-black/95 backdrop-blur-xl border-b border-violet-500/10'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <a href="#inicio" onClick={(e) => handleNavClick(e, '#inicio')} className="flex items-center">
                        <Image
                            src="/logo-individra.png"
                            alt="INDIVIDRA"
                            width={320}
                            height={120}
                            className="h-14 sm:h-20 lg:h-28 w-auto"
                            priority
                        />
                    </a>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm font-medium"
                            >
                                {link.label}
                            </a>
                        ))}
                        <a
                            href="#contacto"
                            onClick={(e) => handleNavClick(e, '#contacto')}
                            className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium rounded-full hover:opacity-90 transition-opacity"
                        >
                            Empezar ahora
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-white p-2"
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
                        className="md:hidden mt-4 pb-6 border-t border-white/10 pt-6"
                    >
                        <div className="flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className="text-neutral-300 hover:text-white hover:bg-white/5 transition-all duration-200 text-base font-medium py-3 px-4 rounded-xl"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <a
                                href="#contacto"
                                onClick={(e) => handleNavClick(e, '#contacto')}
                                className="mt-4 px-5 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-base font-medium rounded-xl hover:opacity-90 transition-opacity text-center"
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
