'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, HelpCircle } from 'lucide-react'
import { MobileFAQBackground } from '@/components/ui/MobileBackgroundEffects'

const faqs = [
    {
        id: 10,
        question: 'Mercado Libre ya me avisa cuando entra un reclamo. ¿Para qué necesito esto?',
        answer: 'Porque el aviso de Mercado Libre llega mezclado con decenas de notificaciones de ventas y preguntas, al que tenga la app abierta, y no te dice cuánto margen te queda. Nosotros tomamos el reclamo por la API oficial apenas se abre y se lo mandamos por WhatsApp a la persona responsable, con la fecha límite que fija Mercado Libre para responder y la cuenta regresiva. En el mismo mensaje te decimos cuántos reclamos, cancelaciones y demoras te quedan antes de salir de verde.',
    },
    {
        id: 1,
        question: '¿Mi equipo tiene que cambiar de WhatsApp o dejar de usar Mercado Libre y Tiendanube?',
        answer: 'No. Tu equipo puede seguir chateando donde siempre. Nuestra consola funciona como un panel de decisiones críticas: filtra el ruido por detrás y te muestra ordenadas por urgencia solo las tarjetas donde apretar un botón aprueba un comprobante, descuenta el stock en Mercado Libre y Tiendanube al mismo tiempo o frena un despacho.',
    },
    {
        id: 2,
        question: '¿Qué pasa si ya uso herramientas como Producteca o Multivende para sincronizar stock?',
        answer: 'Operamos en perfecta armonía. Si ya tenés un sincronizador de catálogo activo (como Producteca, Multivende o similares), INDIVIDRA activa el Modo Coexistencia: al validar un pago por WhatsApp, descuenta la unidad en el canal origen (Tiendanube) y deja que tu integrador replique el stock a Mercado Libre, evitando descuentos dobles. Y si el producto vendido por WhatsApp solo estaba publicado en Mercado Libre, la baja se aplica directo en ML.',
    },
    {
        id: 3,
        question: '¿El sistema le dice al comprador de Mercado Libre cómo devolver o que no abra reclamos?',
        answer: 'Rotundamente no. Las políticas de Mercado Libre sancionan a los vendedores que intentan guiar devoluciones por fuera o persuadir al comprador de evitar reclamos formales. INDIVIDRA protege tu cuenta reteniendo físicamente el paquete en mesa de empaque para no despachar mercadería equivocada, y prepara respuestas estrictamente neutrales que remiten a los canales oficiales de ayuda de Mercado Libre, siempre con supervisión y aprobación humana obligatoria.',
    },
    {
        id: 4,
        question: '¿Cómo evita el sistema que me pasen un comprobante trucho, duplicado o viejo?',
        answer: 'Cuando entra un comprobante (PDF o imagen) por WhatsApp, el motor OCR extrae de inmediato el monto, fecha, CUIT y número de operación, y valida que no figure ya en tu base histórica. Para prevenir comprobantes editados o truchos, la unidad queda reservada provisoriamente durante 15 minutos, pero el stock solo se descuenta definitivamente en tus canales cuando un operador humano coteja el impacto real en tu cuenta bancaria o Mercado Pago y lo aprueba en 1 clic.',
    },
    {
        id: 5,
        question: '¿Cómo se pagan los mensajes de WhatsApp y qué costo tienen?',
        answer: 'La infraestructura de mensajería utiliza la WhatsApp Cloud API oficial. Los costos de conversación son facturados directamente por Meta a la tarjeta de tu empresa según tu consumo real, sin ningún sobreprecio por parte de INDIVIDRA.',
    },
    {
        id: 6,
        question: '¿En qué consiste el diagnóstico gratuito de 30 minutos?',
        answer: 'Es una videollamada 1 a 1. Sin pedirte contraseñas ni permisos invasivos, revisamos juntos en pantalla compartida tu reputación en Mercado Libre: cuántas ventas entran en la ventana que evalúa ML, cuántos reclamos, cancelaciones y demoras tenés, y cuánto margen te queda en cada una antes de bajar de color. Vemos cómo te enterás hoy de un reclamo y quién lo responde, y con eso definimos la línea base del piloto de 30 días. Si además cobrás por WhatsApp, sumamos el cruce de pagos y stock.',
    },
    {
        id: 7,
        question: '¿Dónde se guardan los datos de mis ventas y hay algún contrato de permanencia?',
        answer: 'Tu operación corre en una instancia dedicada y aislada bajo estrictas normas de privacidad y la Ley 25.326 de Protección de Datos Personales. No mezclamos datos entre clientes y podés exportar toda tu base cuando quieras. Trabajamos mes a mes sin permanencia.',
    },
    {
        id: 8,
        question: '¿Cómo funciona la Conciliación de Liquidaciones y qué hace con mi contador?',
        answer: 'No calculamos impuestos ni tocamos ARCA. Lo que hace el motor es cruzar con SQL determinístico cada orden contra lo efectivamente acreditado en Mercado Pago y tu banco: descuenta comisiones de publicación, costo real de envíos Flex y retenciones impositivas (IIBB, IVA, Ganancias). Te muestra el margen neto real por producto y genera un archivo CSV limpio y normalizado para que tu contador no pierda horas cruzando planillas a ciegas.',
    },
    {
        id: 9,
        question: '¿Cómo me protege el Expediente de Evidencia ante devoluciones dudosas o fraudulentas?',
        answer: 'La frase que más repite el soporte de Mercado Libre ante un reclamo es "no tengo evidencia adicional para confirmarlo". INDIVIDRA genera esa evidencia antes de que surja el problema: asocia el registro de balanza en empaque (peso con foto y timestamp) y remito de colecta. Si el comprador devuelve una caja vacía o aduce un faltante, el sistema compila la discrepancia de peso y deja listo el texto formal con los artículos de políticas de la plataforma para que un operador humano lo pegue en mediación en 1 clic.',
    },
]

// Datos estructurados para que Google pueda mostrar las preguntas en los resultados
const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
}

export function FAQSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index)
    }

    return (
        <section id="faq" className="relative py-32 bg-[#0B0D0E] overflow-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            {/* Mobile animated background */}
            <MobileFAQBackground />

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C84214]/5 via-transparent to-transparent" />

            {/* Animated line */}
            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C84214]/40 to-transparent"
            />

            <div className="relative z-10 max-w-4xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 14, scale: 0.9 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-3 flex justify-center"
                    >
                        <Image
                            src="/3d/icono-chat.png"
                            alt=""
                            aria-hidden
                            width={308}
                            height={291}
                            quality={95}
                            sizes="256px"
                            className="h-16 w-auto object-contain drop-shadow-[0_12px_26px_rgba(200,66,20,0.3)] sm:h-20"
                        />
                    </motion.div>
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 text-[#B7B3B0] text-xs sm:text-sm font-mono font-medium uppercase tracking-[0.2em]"
                    >
                        <HelpCircle className="w-4 h-4 text-[#B7B3B0]" />
                        Preguntas Frecuentes
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 text-4xl sm:text-5xl font-bold text-white"
                    >
                        Dudas habituales antes de{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C84214] to-[#B7B3B0]">
                            conectar tu tienda
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="mt-6 text-neutral-400 text-lg max-w-2xl mx-auto"
                    >
                        Respuestas directas sobre seguridad de tus cuentas, validación de comprobantes y cómo medimos el piloto de 30 días.
                    </motion.p>
                </motion.div>

                {/* FAQ Accordion */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="space-y-4"
                >
                    {faqs.map((faq, index) => {
                        const isActive = activeIndex === index

                        return (
                            <motion.div
                                key={faq.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                <div
                                    className={`relative rounded-2xl border backdrop-blur-sm transition-all duration-300 overflow-hidden ${
                                        isActive
                                            ? 'border-[#C84214]/50 bg-[#262523] shadow-lg shadow-[#C84214]/10'
                                            : 'border-[#3E3D3A] bg-[#222120] hover:border-[#3E3D3A]/80 hover:bg-[#262523]'
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="faq-glow"
                                            className="absolute inset-0 bg-gradient-to-r from-[#C84214]/10 to-transparent rounded-2xl"
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}

                                    {/* Question */}
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="relative w-full p-6 flex items-center justify-between gap-4 text-left cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span
                                                className={`text-sm font-mono transition-colors duration-300 ${
                                                    isActive ? 'text-[#C84214]' : 'text-neutral-600'
                                                }`}
                                            >
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <h3
                                                className={`text-lg font-semibold transition-colors duration-300 ${
                                                    isActive
                                                        ? 'text-white'
                                                        : 'text-neutral-300 group-hover:text-white'
                                                }`}
                                            >
                                                {faq.question}
                                            </h3>
                                        </div>
                                        <motion.div
                                            animate={{ rotate: isActive ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                                isActive
                                                    ? 'bg-[#C84214]'
                                                    : 'bg-neutral-800 group-hover:bg-neutral-700'
                                            }`}
                                        >
                                            {isActive ? (
                                                <Minus className="w-5 h-5 text-white" />
                                            ) : (
                                                <Plus className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                                            )}
                                        </motion.div>
                                    </button>

                                    {/* Answer */}
                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 pb-6 pl-16">
                                                    <motion.p
                                                        initial={{ y: -10, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        exit={{ y: -10, opacity: 0 }}
                                                        transition={{ delay: 0.1 }}
                                                        className="text-neutral-400 leading-relaxed"
                                                    >
                                                        {faq.answer}
                                                    </motion.p>
                                                    <motion.div
                                                        initial={{ scaleX: 0 }}
                                                        animate={{ scaleX: 1 }}
                                                        transition={{ delay: 0.2, duration: 0.4 }}
                                                        className="mt-4 h-px w-24 bg-gradient-to-r from-[#C84214]/50 to-transparent origin-left"
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )
                    })}
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <p className="text-neutral-500 mb-4">¿Tenés una casuística particular con tu stock?</p>
                    <a
                        href="#contacto"
                        className="group inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-[#C84214] text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg shadow-[#C84214]/20 hover:bg-[#B3390F] active:scale-[0.98] transition-all duration-200 ease-out whitespace-nowrap cursor-pointer"
                    >
                        Hablemos de tu operación
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                    </a>
                </motion.div>
            </div>
        </section>
    )
}
