# Matriz de promesas de la web

Cada frase que la web le promete a un cliente, con la API que la sostiene, la evidencia y lo que falta probar. Actualizada al 16/10/2026.

**Estados**

- ✅ **Probado en real**: lo ejecutamos contra la plataforma real y funcionó.
- 📄 **Documentado**: la documentación oficial lo describe; falta probarlo en real.
- ⚠️ **Sin confirmar**: tecnología estándar o fuente secundaria; falta prototipo o fuente oficial.
- ✏️ **Texto corregido**: la web prometía algo que no se sostenía y se ajustó.

## Mercado Libre: reclamos y reputación

| Promesa | Cómo se construye | Estado | Falta |
|---|---|---|---|
| "Te llega un WhatsApp apenas entra cada reclamo, con el plazo exacto" | Tópico de notificaciones `claims` (hay que activarlo en la app) o sondeo cada hora de `GET /post-purchase/v1/claims/search`. El plazo es el `due_date` de las `available_actions` del vendedor, con `mandatory` y `action_responsible`. | ✅ acceso (el endpoint responde con nuestro token) · 📄 campos | Ver un reclamo real. Los usuarios de prueba no documentan reclamos: se valida en la semana 2 del piloto, en solo lectura. |
| "Cuánto margen te queda antes de bajar de color", todos los días | `GET /users/{id}` → `seller_reputation.metrics` (tasa, cantidad y período de reclamos, cancelaciones y demoras). Límites MLA vigentes desde el 16/09/2026: 60 días con 101 ventas o más; si no, 365 días. | ✅ lectura real · 📄 límites | Límites de demoras para 365 días: no confirmados, se usan los de 60 (más estrictos). |
| Saber si un reclamo afecta la reputación | `GET /post-purchase/v1/claims/{id}/affects-reputation` | 📄 | Probar con un reclamo real. |
| Devoluciones: aviso con plazo y "pedir la revisión a tiempo si vuelve distinta" | `related_entities` del reclamo trae la devolución; recurso de devoluciones y acción `return_review`. | 📄 | Probar con un caso real. |
| "Semana 2 en solo lectura: no tocamos tu cuenta" | La app pide permisos de lectura. El token actual solo tiene alcances de lectura en las áreas de Mercado Libre. | ✅ | — |
| Respuestas neutrales por canales oficiales, aprobadas por una persona | Acción `send-message` del reclamo y mensajería post-venta. | 📄 | Requiere permisos de escritura en la app. |
| Estirar plazo en vez de pausar (idea, todavía no está en la web) | `PUT /items/{id}` con `sale_terms` `MANUFACTURING_TIME` en días. | ✅ la API confirma el término y la unidad "días" en Celulares, Hogar, Ropa y Deportes · ⚠️ máximo de días y efecto en Flex/Full | Probar con un usuario de prueba antes de ofrecerlo. |

## Venta Blindada

| Promesa | Cómo se construye | Estado | Falta |
|---|---|---|---|
| Descontar stock en Tiendanube con 1 clic | `PATCH /products/stock-price` (hasta 50 variantes) o `POST /products/{id}/variants/stock`. Pedidos por webhook `order/created` firmado con HMAC. Límite: 40 pedidos en ráfaga, 2 por segundo, por tienda y app. | ✅ **probado el 16/10/2026**: producto sin publicar, stock de 5 a 4 por API, verificado y borrado | App de partner propia para que cada vendedor conecte su tienda. |
| Descontar stock en Mercado Libre | En Argentina: `PUT /user-products/{id}/stock/type/selling_address` con el header `x-version`, que evita pisar un cambio hecho en paralelo. En cuentas con varios depósitos, `PUT /items` puede responder 200 sin cambiar el stock real. | 📄 | Probar con un usuario de prueba y permisos de escritura. |
| No aplica a Full | Mercado Libre rechaza el cambio de stock en Full (error 400). | 📄 · ✏️ la web ya lo aclara | — |
| Leer el comprobante y detectar repetidos | IA con visión para leer el comprobante; el número de operación como clave para detectar repetidos. | ⚠️ | Prototipo con comprobantes reales de bancos y billeteras argentinas. |
| "Reservamos la unidad 15 minutos" | Mercado Libre no tiene reservas: habría que bajar el stock y devolverlo. | ✏️ quitado de la web | Si se quiere, diseñarlo y probarlo antes de volver a prometerlo. |
| Convivencia con Producteca o Multivende | Para leer no hay conflicto. Para descontar stock, dos sistemas pueden pisarse. | ✏️ la web dice que se define antes de activar | — |

## Conciliación de liquidaciones

| Promesa | Cómo se construye | Estado | Falta |
|---|---|---|---|
| Cruzar cada venta con lo que acreditó Mercado Pago: comisiones, envíos y retenciones, en un CSV | Reporte de Liquidaciones de Mercado Pago (`/v1/account/release_report`). Columnas: `MP_FEE_AMOUNT`, `FINANCING_FEE_AMOUNT`, `SHIPPING_FEE_AMOUNT`, `TAXES_AMOUNT`, `TAX_DETAIL`, `SALE_DETAIL`. Máximo 60 días por reporte. | 📄 | App de Mercado Pago separada (regla del 30/08/2026) y prueba con usuarios de prueba de Mercado Pago. |

## WhatsApp

| Promesa | Cómo se construye | Estado | Falta |
|---|---|---|---|
| Alertas al vendedor, incluidas en el Plan 1 | Número de INDIVIDRA vía Zernio. Plantilla de utilidad: USD 0,026 (≈ $40). Consentimiento al activar las alertas. Límite inicial: 250 destinatarios distintos por día. | 📄 · ✏️ la web ya dice "sin cargo de mensajes" | Alta en Meta/Zernio y aprobación de plantillas (ver `docs/whatsapp/plantillas.md`). |
| Logística: confirmación la noche anterior, y el que no puede sale de la ruta | Plantilla de utilidad con 3 botones; cada respuesta llega sola y se asocia a la parada por el dato del botón, no por el teléfono. Cada logística con su propio número. | 📄 | Consentimiento: lo pide la tienda en su checkout. Plan B si Meta pausa la plantilla: una segunda plantilla aprobada y una lista para llamar. |
| Los clientes consultan el estado por WhatsApp | Los mensajes que inician ellos abren la ventana de 24 h: se responde sin plantilla, con 1.000 respuestas gratis por mes y por número. | 📄 | — |

## Logística

| Promesa | Cómo se construye | Estado | Falta |
|---|---|---|---|
| Remito firmado en 1 toque por Telegram | API de bots de Telegram (gratis): fotos y ubicación. | ⚠️ | Prototipo. |
| Cada visita registrada con ubicación y hora | Ubicación compartida en Telegram. | ⚠️ | Prototipo. |
| Cruzar la liquidación del fletero contra las entregas reales de ML | Envíos Flex por API (estados por envío) más el archivo del fletero. | 📄 / ⚠️ | Un archivo real de liquidación para armar el lector. |

## Infraestructura

| Promesa | Cómo se construye | Estado | Falta |
|---|---|---|---|
| Conexión con Mercado Libre que no se corta | Tokens en Supabase y renovación automática cada hora. | ✅ renovación verificada el 16/10/2026 | Soportar varias cuentas (hoy renueva solo la de INDIVIDRA). |
| Instancia aislada, Ley 25.326, exportar todo | Separación por cliente en la base. | ⚠️ | Definir el diseño. |

## Lo que necesita al dueño de la cuenta

Credenciales y decisiones que no se pueden delegar:

1. **Mercado Libre DevCenter**: pasar la app a lectura y escritura cuando se prueben escrituras.
2. **Usuarios de prueba de Mercado Libre**: los crea Claude; el dueño los autoriza con un link, iniciando sesión en una ventana privada.
3. **Tiendanube**: cuenta de partner y app.
4. **Meta / Zernio**: cuenta y número. Claude redacta las plantillas.
5. **Mercado Pago**: app separada para la conciliación.

## Cláusula legal propuesta (para revisar con un abogado)

Meta exige consentimiento previo, y la responsabilidad es de quien envía. Texto sugerido para los términos:

> El Cliente declara contar con el consentimiento de las personas a quienes INDIVIDRA envíe mensajes por WhatsApp en su nombre, conforme a la Ley 25.326 y a la Política de Mensajería de WhatsApp Business, y se compromete a respetar de inmediato cada pedido de baja.

## Fuentes principales

- Reputación: [nota de Mercado Libre sobre el cambio del 16/09](https://vendedores.mercadolibre.com.ar/nota/vamos-a-cambiar-la-forma-en-que-calculamos-tu-reputacion), [máximos de cancelaciones por color](https://www.mercadolibre.com.ar/ayuda/maximos-cancelaciones-por-color_15070), [reputación para desarrolladores](https://developers.mercadolibre.com.ar/es_ar/reputacion-de-vendedores)
- Reclamos y devoluciones: [reclamos](https://developers.mercadolibre.com.ar/es_ar/que-es-un-reclamo), [devoluciones](https://developers.mercadolibre.com.ar/es_ar/gestionar-devoluciones)
- Stock: [User Products](https://developers.mercadolibre.com.ar/en_us/user-products), [convivencia Full y Flex](https://developers.mercadolivre.com.br/en_us/users-addresses/full-and-flex-coexistence), [stock de Fulfillment](https://global-selling.mercadolibre.com/devsite/fulfillment-stock-gs), [MANUFACTURING_TIME](https://developers.mercadolibre.com.ar/en_us/products-sync-listings)
- Tiendanube: [variantes y stock](https://tiendanube.github.io/api-documentation/resources/product-variant), [webhooks](https://tiendanube.github.io/api-documentation/resources/webhook), [autenticación y límites](https://tiendanube.github.io/api-documentation/authentication)
- Mercado Pago: [campos del reporte de liquidaciones](https://www.mercadopago.com.ar/developers/es/docs/reports/released-money/report-fields)
- WhatsApp: [precios](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing), [consentimiento](https://developers.facebook.com/documentation/business-messaging/whatsapp/getting-opt-in), [límites](https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits), [categorías de plantillas](https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/template-categorization), [tarifas de Argentina (Zernio)](https://zernio.com/whatsapp-api-pricing)
