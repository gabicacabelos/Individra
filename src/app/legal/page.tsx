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
                    <div className="flex items-center gap-2 text-sm text-[#8C8C8C]">
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
                        <Shield className="w-5 h-5 text-[#B7B3B0]" />
                        <span>Política de Privacidad</span>
                    </a>
                    <a
                        href="#terminos"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                    >
                        <FileText className="w-5 h-5 text-[#C84214]" />
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
                                En <strong className="text-white">INDIVIDRA</strong> nos comprometemos con la privacidad, integridad y seguridad de la información operativa de tu empresa y de tus clientes. Esta política describe cómo tratamos y protegemos los datos personales y comerciales en cumplimiento estricto con la <strong className="text-white">Ley 25.326 de Protección de Datos Personales de la República Argentina</strong> y los estándares internacionales de seguridad informática aplicables.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">1. Información que Procesamos</h3>
                            <p className="mb-4">Para brindar el servicio de Venta Blindada y sincronización operativa, tratamos exclusivamente las siguientes categorías de datos:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong className="text-white">Credenciales y Tokens de Integración:</strong> Tokens de acceso OAuth 2.0 para Mercado Libre, Tiendanube y WhatsApp Cloud API. Se gestionan con principios de privilegios mínimos (lectura/escritura de stock y órdenes) y se almacenan cifrados. <span className="text-neutral-400">Nunca solicitamos ni almacenamos tus contraseñas personales ni bancarias.</span></li>
                                <li><strong className="text-white">Comprobantes de Transferencia (OCR):</strong> Imágenes y archivos PDF de transferencias bancarias enviados por tus compradores vía WhatsApp. El sistema procesa de forma transaccional los metadatos necesarios para validar el cobro: número de operación, fecha, importe, CUIT y banco emisor, garantizando que un comprobante no sea utilizado de manera duplicada.</li>
                                <li><strong className="text-white">Datos de Órdenes y Destinatarios:</strong> Identificador de orden, producto/SKU, talle, estado del pedido y dirección de entrega para la normalización logística en órdenes de canal propio.</li>
                                <li><strong className="text-white">Datos de Contacto y Reserva:</strong> Nombre, teléfono y correo electrónico corporativo al agendar sesiones de diagnóstico o soporte técnico.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">2. Compromiso de Cero Entrenamiento de Modelos de IA</h3>
                            <div className="p-4 rounded-xl border border-[#C84214]/30 bg-[#C84214]/10 text-neutral-200">
                                <p className="font-semibold text-white mb-1">Garantía estricta de confidencialidad en Inteligencia Artificial:</p>
                                <p className="text-sm leading-relaxed">
                                    Los datos de tu negocio, los comprobantes de tus clientes, las conversaciones y los reportes operativos <strong className="text-white">NUNCA son utilizados para entrenar, reentrenar ni mejorar modelos de Inteligencia Artificial públicos ni privados</strong>. Los procesamientos lingüísticos y de visión artificial (OCR) se ejecutan de manera efímera y privada dentro de instancias aisladas.
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">3. Finalidad del Tratamiento de Datos</h3>
                            <p className="mb-4">Toda información procesada tiene como único fin la correcta ejecución técnica del servicio contratado:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Validar en tiempo real la autenticidad y no duplicidad de comprobantes bancarios.</li>
                                <li>Actualizar el inventario disponible en Mercado Libre y Tiendanube para prevenir sobreventas y penalizaciones de reputación.</li>
                                <li>Organizar el panel de triage por urgencia para que el comerciante apruebe acciones con un solo clic.</li>
                                <li>Generar reportes y hojas de ruta para canales propios y transporte logístico autorizado.</li>
                            </ul>
                            <p className="mt-3 text-neutral-400 text-sm">
                                INDIVIDRA no comercializa, no alquila, no cede ni comparte bases de datos con agencias de publicidad, brokers de datos ni plataformas comerciales externas.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">4. Seguridad, Aislamiento de Infraestructura y Portabilidad</h3>
                            <p className="mb-3">
                                Aplicamos arquitectura de defensa en profundidad y buenas prácticas de seguridad informática:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong className="text-white">Instancias Aisladas:</strong> Los datos operativos de cada cliente se alojan en servidores dedicados e independientes en centros de datos de alta seguridad de Hetzner Online GmbH (Alemania), con estrictos controles físicos y lógicos de nivel empresarial.</li>
                                <li><strong className="text-white">Cifrado Fuerte:</strong> Comunicaciones en tránsito cifradas mediante TLS 1.3 y credenciales críticas cifradas en reposo con algoritmos AES-256.</li>
                                <li><strong className="text-white">Portabilidad Total:</strong> Tu información es propiedad exclusiva de tu empresa. Al finalizar el servicio o en cualquier momento que lo solicites, podés exportar el historial completo de comprobantes, pedidos y trazabilidad sin formatos propietarios ni penalizaciones.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">5. Derechos del Titular de los Datos (Ley 25.326)</h3>
                            <p className="mb-4">
                                El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto conforme lo establecido en el artículo 14, inciso 3 de la Ley Nº 25.326.
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong className="text-white">Acceso, Rectificación y Supresión:</strong> Podés solicitar la actualización, rectificación o eliminación total de tus datos personales enviando un correo a <a href="mailto:individratec@gmail.com" className="text-[#FFA380] underline">individratec@gmail.com</a>.</li>
                                <li><strong className="text-white">Autoridad de Control:</strong> La AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA (AAIP), en su carácter de Órgano de Control de la Ley Nº 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.</li>
                            </ul>
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
                        <div className="p-3 bg-[#C84214]/10 rounded-xl">
                            <FileText className="w-6 h-6 text-[#C84214]" />
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
                                INDIVIDRA provee una consola de sincronización operativa multicanal (Venta Blindada),
                                servicios de integración determinística vía APIs oficiales (Mercado Libre, Tiendanube,
                                WhatsApp Cloud API), y módulos de auditoría de remitos y procesos logísticos para
                                comerciantes y operadores de la República Argentina.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">2. Diagnóstico Gratuito</h3>
                            <p className="mb-4">El diagnóstico inicial de 30 minutos:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Es una conversación directa 1 a 1 para analizar tu operatoria actual de cobro y stock.</li>
                                <li>Es orientativo y no constituye asesoría contable ni jurídica vinculante.</li>
                                <li>Está diseñado exclusivamente para analizar procesos operativos comerciales.</li>
                                <li>Se agenda a través de Calendly; podés reprogramarlo o cancelarlo desde el mismo enlace de confirmación.</li>
                                <li>Cualquier propuesta posterior se formaliza en el Piloto de 30 Días con alcance y condiciones por escrito.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">3. Uso Aceptable</h3>
                            <p className="mb-4">Al usar nuestros servicios, te comprometés a:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Proporcionar información veraz y relacionada con tu actividad comercial.</li>
                                <li>No intentar manipular, hackear o abusar del sitio o nuestros sistemas.</li>
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
                                <li>Decisiones comerciales tomadas sin comprobación contable previa.</li>
                                <li>Interrupciones o caídas técnicas atribuibles a servicios de terceros (Meta WhatsApp Cloud API, Mercado Libre o Tiendanube).</li>
                                <li>Daños indirectos, incidentales o consecuentes de cualquier tipo.</li>
                            </ul>
                            <p className="mt-4">
                                La responsabilidad total contractual en servicios pagos quedará limitada al monto neto abonado por el usuario por el período mensual o piloto en curso.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">6. Servicios Pagos</h3>
                            <p>
                                Para el Piloto de 30 Días y abonos mensuales, los términos específicos, alcance,
                                costos en ARS netos y condiciones de cancelación se detallan por escrito previo al inicio.
                                No existen cláusulas de permanencia forzosa y la portabilidad de datos está garantizada.
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
                                Estos términos se rigen por las leyes de la República Argentina (Ley 24.240, Ley 25.326 y normas concordantes). Cualquier controversia
                                será sometida a la jurisdicción de los tribunales ordinarios competentes de la Provincia de Buenos Aires / Morón, renunciando a cualquier otro fuero.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">9. Identificación del Responsable y Contacto</h3>
                            <p>
                                En cumplimiento de la normativa comercial vigente en la República Argentina:
                            </p>
                            <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-xl space-y-2 text-sm text-neutral-300">
                                <p><strong className="text-white">Responsable:</strong> Gabriel Cacabelos (INDIVIDRA)</p>
                                <p><strong className="text-white">Domicilio Operativo:</strong> El Palomar, Partido de Morón, Provincia de Buenos Aires, Argentina</p>
                                <p className="flex items-center gap-2 pt-1">
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
                    <p className="text-[#8C8C8C] text-sm">
                        © {new Date().getFullYear()} INDIVIDRA · Todos los derechos reservados.
                    </p>
                    <p className="text-[#8C8C8C] text-xs mt-2">
                        El Palomar, Provincia de Buenos Aires, Argentina
                    </p>
                </motion.div>
            </main>
        </div>
    )
}
