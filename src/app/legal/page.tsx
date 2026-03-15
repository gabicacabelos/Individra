'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Shield, FileText, Mail, Calendar } from 'lucide-react'

export default function LegalPage() {
    const lastUpdated = '15 de marzo de 2026'

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Volver al inicio</span>
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Calendar className="w-4 h-4" />
                        <span>Actualizado: {lastUpdated}</span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-16">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Información Legal
                    </h1>
                    <p className="text-neutral-400 text-lg">
                        Política de Privacidad y Términos y Condiciones de Individra
                    </p>
                </motion.div>

                {/* Quick Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap gap-4 justify-center mb-16"
                >
                    <a
                        href="#privacidad"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                    >
                        <Shield className="w-5 h-5 text-blue-400" />
                        <span>Política de Privacidad</span>
                    </a>
                    <a
                        href="#terminos"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                    >
                        <FileText className="w-5 h-5 text-violet-400" />
                        <span>Términos y Condiciones</span>
                    </a>
                </motion.div>

                {/* Privacy Policy */}
                <motion.section
                    id="privacidad"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-20"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <Shield className="w-6 h-6 text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-bold">Política de Privacidad</h2>
                    </div>

                    <div className="space-y-8 text-neutral-300 leading-relaxed">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                            <p>
                                En <strong className="text-white">Individra</strong> nos comprometemos a proteger tu privacidad.
                                Esta política describe cómo recopilamos, usamos y protegemos tu información personal
                                de acuerdo con la Ley 25.326 de Protección de Datos Personales de Argentina.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">1. Información que Recopilamos</h3>
                            <p className="mb-4">Recopilamos los siguientes tipos de información:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong className="text-white">Dirección de correo electrónico:</strong> Cuando solicitás recibir el diagnóstico completo por email.</li>
                                <li><strong className="text-white">Descripción de tu problema o proceso:</strong> El texto que ingresás en el diagnóstico de IA para analizar tu situación empresarial.</li>
                                <li><strong className="text-white">Datos de uso:</strong> Información sobre cómo interactuás con nuestro sitio (páginas visitadas, tiempo de permanencia, acciones realizadas).</li>
                                <li><strong className="text-white">Información técnica:</strong> Dirección IP, tipo de navegador, dispositivo y sistema operativo.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">2. Cómo Usamos tu Información</h3>
                            <p className="mb-4">Utilizamos tu información para:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Generar diagnósticos personalizados de automatización para tu negocio.</li>
                                <li>Enviarte el análisis completo con timeline y costos estimados por email.</li>
                                <li>Mejorar nuestros servicios y la experiencia de usuario.</li>
                                <li>Contactarte sobre servicios que puedan interesarte (solo si diste tu consentimiento).</li>
                                <li>Cumplir con obligaciones legales.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">3. Servicios de Terceros</h3>
                            <p className="mb-4">Utilizamos los siguientes servicios de terceros que pueden procesar tu información:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong className="text-white">Resend:</strong> Para el envío de correos electrónicos transaccionales.</li>
                                <li><strong className="text-white">PostHog:</strong> Para analíticas y mejora de la experiencia de usuario.</li>
                                <li><strong className="text-white">Groq:</strong> Para el procesamiento de inteligencia artificial en los diagnósticos.</li>
                                <li><strong className="text-white">Vercel:</strong> Para el alojamiento de nuestra plataforma web.</li>
                            </ul>
                            <p className="mt-4">
                                Estos proveedores tienen sus propias políticas de privacidad y están sujetos a regulaciones
                                de protección de datos en sus respectivas jurisdicciones.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">4. Cookies y Tecnologías de Seguimiento</h3>
                            <p>
                                Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el uso del sitio
                                y personalizar el contenido. Podés configurar tu navegador para rechazar cookies, aunque esto
                                puede afectar algunas funcionalidades del sitio.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">5. Retención de Datos</h3>
                            <p>
                                Conservamos tu información personal solo durante el tiempo necesario para cumplir con los fines
                                para los que fue recopilada, o según lo requiera la ley. Los datos de diagnóstico se conservan
                                por un período máximo de 2 años.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">6. Tus Derechos</h3>
                            <p className="mb-4">Conforme a la Ley 25.326, tenés derecho a:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong className="text-white">Acceso:</strong> Solicitar información sobre los datos que tenemos sobre vos.</li>
                                <li><strong className="text-white">Rectificación:</strong> Corregir datos inexactos o incompletos.</li>
                                <li><strong className="text-white">Supresión:</strong> Solicitar la eliminación de tus datos personales.</li>
                                <li><strong className="text-white">Oposición:</strong> Oponerte al procesamiento de tus datos para ciertos fines.</li>
                            </ul>
                            <p className="mt-4">
                                Para ejercer estos derechos, contactanos a{' '}
                                <a href="mailto:individratec@gmail.com" className="text-blue-400 hover:underline">
                                    individratec@gmail.com
                                </a>
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">7. Seguridad</h3>
                            <p>
                                Implementamos medidas de seguridad técnicas y organizativas para proteger tu información
                                contra acceso no autorizado, alteración, divulgación o destrucción. Sin embargo, ningún
                                método de transmisión por Internet es 100% seguro.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">8. Menores de Edad</h3>
                            <p>
                                Nuestros servicios están dirigidos a empresas y profesionales mayores de 18 años.
                                No recopilamos intencionalmente información de menores de edad.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Terms and Conditions */}
                <motion.section
                    id="terminos"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-20"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-violet-500/10 rounded-xl">
                            <FileText className="w-6 h-6 text-violet-400" />
                        </div>
                        <h2 className="text-3xl font-bold">Términos y Condiciones</h2>
                    </div>

                    <div className="space-y-8 text-neutral-300 leading-relaxed">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                            <p>
                                Al usar el sitio web y los servicios de <strong className="text-white">Individra</strong>,
                                aceptás estos términos y condiciones en su totalidad. Si no estás de acuerdo,
                                por favor no utilices nuestros servicios.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">1. Descripción del Servicio</h3>
                            <p>
                                Individra ofrece servicios de consultoría en automatización e inteligencia artificial
                                para empresas, incluyendo un diagnóstico gratuito basado en IA, desarrollo de chatbots,
                                agentes de IA, y soluciones de automatización personalizadas.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">2. Diagnóstico de IA</h3>
                            <p className="mb-4">El diagnóstico gratuito de IA:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Es una herramienta orientativa y no constituye asesoría profesional vinculante.</li>
                                <li>Está diseñado exclusivamente para analizar procesos empresariales, no problemas personales.</li>
                                <li>Tiene un límite de 2 usos por usuario cada 24 horas.</li>
                                <li>Los resultados son estimaciones basadas en información general y pueden variar según cada caso específico.</li>
                                <li>Los costos y tiempos mostrados son aproximados y están sujetos a evaluación detallada.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">3. Uso Aceptable</h3>
                            <p className="mb-4">Al usar nuestros servicios, te comprometés a:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Proporcionar información veraz y relacionada con tu actividad empresarial.</li>
                                <li>No intentar manipular, hackear o abusar del sistema de diagnóstico.</li>
                                <li>No utilizar el servicio para fines ilegales o no autorizados.</li>
                                <li>No ingresar contenido ofensivo, discriminatorio o inapropiado.</li>
                                <li>Respetar la propiedad intelectual de Individra y terceros.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">4. Propiedad Intelectual</h3>
                            <p>
                                Todo el contenido del sitio web, incluyendo pero no limitado a textos, gráficos,
                                logotipos, íconos, imágenes, código y software, es propiedad de Individra o sus
                                licenciantes y está protegido por leyes de propiedad intelectual. No se permite
                                la reproducción, distribución o modificación sin autorización expresa.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">5. Limitación de Responsabilidad</h3>
                            <p className="mb-4">Individra no será responsable por:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Decisiones tomadas basándose únicamente en el diagnóstico de IA.</li>
                                <li>Pérdidas económicas derivadas del uso o imposibilidad de uso del servicio.</li>
                                <li>Interrupciones o errores técnicos en la plataforma.</li>
                                <li>Contenido de terceros o sitios web enlazados.</li>
                                <li>Daños indirectos, incidentales o consecuentes de cualquier tipo.</li>
                            </ul>
                            <p className="mt-4">
                                En ningún caso nuestra responsabilidad total excederá el monto pagado por el
                                usuario por los servicios contratados.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">6. Servicios Pagos</h3>
                            <p>
                                Para servicios de implementación y desarrollo, los términos específicos, alcance,
                                costos y plazos se acordarán por escrito antes del inicio del proyecto.
                                Los pagos y condiciones comerciales se detallarán en propuestas o contratos individuales.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">7. Modificaciones</h3>
                            <p>
                                Nos reservamos el derecho de modificar estos términos en cualquier momento.
                                Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio.
                                El uso continuado del servicio después de los cambios constituye aceptación de los nuevos términos.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">8. Jurisdicción y Ley Aplicable</h3>
                            <p>
                                Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa
                                será sometida a la jurisdicción de los tribunales ordinarios de la Ciudad Autónoma
                                de Buenos Aires, renunciando a cualquier otro fuero que pudiera corresponder.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">9. Contacto</h3>
                            <p>
                                Para cualquier consulta sobre estos términos o nuestra política de privacidad,
                                podés contactarnos a través de:
                            </p>
                            <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                                <p className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-blue-400" />
                                    <a href="mailto:individratec@gmail.com" className="text-blue-400 hover:underline">
                                        individratec@gmail.com
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center pt-8 border-t border-white/10"
                >
                    <p className="text-neutral-500 text-sm">
                        © {new Date().getFullYear()} Individra. Todos los derechos reservados.
                    </p>
                    <p className="text-neutral-600 text-xs mt-2">
                        Buenos Aires, Argentina
                    </p>
                </motion.div>
            </main>
        </div>
    )
}
