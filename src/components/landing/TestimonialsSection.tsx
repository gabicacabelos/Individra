'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
    {
        id: 1,
        name: 'Martín Rodríguez',
        role: 'CEO',
        company: 'TechFlow Solutions',
        image: '/testimonials/avatar1.jpg',
        content: 'Implementaron un sistema de automatización que redujo nuestros tiempos de respuesta en un 80%. El chatbot que desarrollaron maneja más de 500 consultas diarias sin intervención humana.',
        rating: 5,
        metric: '80%',
        metricLabel: 'menos tiempo de respuesta',
    },
    {
        id: 2,
        name: 'Carolina Méndez',
        role: 'Directora de Operaciones',
        company: 'Logística Express',
        image: '/testimonials/avatar2.jpg',
        content: 'Nos ayudaron a digitalizar todo nuestro proceso de tracking. La plataforma que construyeron es intuitiva y nos permite escalar sin aumentar el equipo operativo.',
        rating: 5,
        metric: '3x',
        metricLabel: 'más capacidad operativa',
    },
    {
        id: 3,
        name: 'Federico Álvarez',
        role: 'Fundador',
        company: 'FinanceHub',
        image: '/testimonials/avatar3.jpg',
        content: 'El agente de IA que desarrollaron califica leads automáticamente y agenda reuniones. Nuestro equipo de ventas ahora se enfoca solo en cerrar negocios.',
        rating: 5,
        metric: '+150%',
        metricLabel: 'en conversiones',
    },
]

const clients = [
    { name: 'TechFlow', logo: '/clients/techflow.svg' },
    { name: 'Logística Express', logo: '/clients/logistica.svg' },
    { name: 'FinanceHub', logo: '/clients/financehub.svg' },
    { name: 'DataCorp', logo: '/clients/datacorp.svg' },
    { name: 'CloudServ', logo: '/clients/cloudserv.svg' },
]

export function TestimonialsSection() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [direction, setDirection] = useState(0)

    const nextTestimonial = () => {
        setDirection(1)
        setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }

    const prevTestimonial = () => {
        setDirection(-1)
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(() => {
            nextTestimonial()
        }, 8000)
        return () => clearInterval(timer)
    }, [])

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
        }),
    }

    return (
        <section id="testimonios" className="relative py-32 bg-black overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent" />

            {/* Decorative elements */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-violet-600/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px]" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-violet-400 text-sm font-semibold uppercase tracking-widest">
                        Testimonios
                    </span>
                    <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-white">
                        Lo que dicen{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400">
                            nuestros clientes
                        </span>
                    </h2>
                </motion.div>

                {/* Testimonial Carousel */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Main Card */}
                    <div className="relative min-h-[400px] flex items-center justify-center">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={activeIndex}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                                className="absolute w-full"
                            >
                                <div className="relative p-8 sm:p-12 rounded-3xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm">
                                    {/* Quote icon */}
                                    <Quote className="absolute top-8 right-8 w-12 h-12 text-violet-500/20" />

                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        {/* Left: Avatar & Info */}
                                        <div className="flex-shrink-0">
                                            <div className="relative">
                                                {/* Avatar placeholder */}
                                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                                                    {testimonials[activeIndex].name.charAt(0)}
                                                </div>
                                                {/* Metric badge */}
                                                <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold">
                                                    {testimonials[activeIndex].metric}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Content */}
                                        <div className="flex-1">
                                            {/* Rating */}
                                            <div className="flex gap-1 mb-4">
                                                {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                                                    <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                                                ))}
                                            </div>

                                            {/* Quote */}
                                            <p className="text-lg sm:text-xl text-neutral-200 leading-relaxed mb-6">
                                                "{testimonials[activeIndex].content}"
                                            </p>

                                            {/* Author */}
                                            <div>
                                                <p className="font-semibold text-white">
                                                    {testimonials[activeIndex].name}
                                                </p>
                                                <p className="text-neutral-400 text-sm">
                                                    {testimonials[activeIndex].role}, {testimonials[activeIndex].company}
                                                </p>
                                            </div>

                                            {/* Metric Label */}
                                            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20">
                                                <span className="text-violet-400 font-bold">{testimonials[activeIndex].metric}</span>
                                                <span className="text-neutral-400 text-sm">{testimonials[activeIndex].metricLabel}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={prevTestimonial}
                            className="w-12 h-12 rounded-full border border-white/10 bg-neutral-900/50 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/30 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </motion.button>

                        {/* Dots */}
                        <div className="flex gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setDirection(index > activeIndex ? 1 : -1)
                                        setActiveIndex(index)
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                        index === activeIndex
                                            ? 'w-8 bg-gradient-to-r from-violet-500 to-blue-500'
                                            : 'bg-neutral-700 hover:bg-neutral-600'
                                    }`}
                                />
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={nextTestimonial}
                            className="w-12 h-12 rounded-full border border-white/10 bg-neutral-900/50 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/30 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </motion.button>
                    </div>
                </div>

                {/* Trusted By Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-24"
                >
                    <p className="text-center text-neutral-500 text-sm uppercase tracking-widest mb-8">
                        Empresas que confían en nosotros
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
                        {clients.map((client, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                {/* Placeholder for client logos */}
                                <div className="px-6 py-3 rounded-lg border border-white/5 bg-neutral-900/30 text-neutral-500 font-semibold text-lg tracking-wide hover:border-white/10 hover:text-neutral-300 transition-all duration-300">
                                    {client.name}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
                >
                    {[
                        { value: '50+', label: 'Proyectos completados' },
                        { value: '98%', label: 'Clientes satisfechos' },
                        { value: '24/7', label: 'Soporte disponible' },
                        { value: '3x', label: 'ROI promedio' },
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <p className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400">
                                {stat.value}
                            </p>
                            <p className="mt-2 text-neutral-400 text-sm">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
