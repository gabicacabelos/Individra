# Matriz de promesas de la web

Cada frase que la web le promete a un cliente, con la API que la sostiene, la evidencia y lo que falta probar. Actualizada al 17/10/2026.

**Estados**

- ✅ **Probado en real**: lo ejecutamos contra la plataforma real y funcionó.
- 📄 **Documentado**: la documentación oficial lo describe; falta probarlo en real.
- ⚠️ **Sin confirmar**: tecnología estándar o fuente secundaria; falta prototipo o fuente oficial.
- ✏️ **Texto corregido**: la web prometía algo que no se sostenía y se ajustó.
- ❌ **Bloqueado**: lo probamos en real y falló; dice qué hace falta para destrabarlo.

## Mercado Libre: reclamos y reputación

| Promesa | Cómo se construye | Estado | Falta |
|---|---|---|---|
| "Te llega un WhatsApp apenas entra cada reclamo, con el plazo exacto" | Notificación de Mercado Libre al receptor `ml-notificaciones` (ver Infraestructura), más un sondeo periódico de `GET /post-purchase/v1/claims/search` por si se pierde alguna. El plazo es el `due_date` de las `available_actions` del vendedor, con `mandatory` y `action_responsible`. | ✅ acceso (el endpoint responde con nuestro token) · 📄 campos | Ver un reclamo real. Los usuarios de prueba no documentan reclamos: se valida en la semana 2 del piloto, en solo lectura. |
| "Cuánto margen te queda antes de bajar de color", todos los días | `GET /users/{id}` → `seller_reputation.metrics` (tasa, cantidad y período de reclamos, cancelaciones y demoras). Límites MLA vigentes desde el 16/09/2026: 60 días con 101 ventas o más; si no, 365 días. | ✅ lectura real · 📄 límites | Límites de demoras para 365 días: no confirmados, se usan los de 60 (más estrictos). |
| Saber si un reclamo afecta la reputación | `GET /post-purchase/v1/claims/{id}/affects-reputation` | 📄 | Probar con un reclamo real. |
| Lo que cuesta perder el verde, además de exposición | En el envío gratis de las ventas desde $33.000, Mercado Libre descuenta hasta 50% con reputación verde y el descuento depende del color. La calculadora de la web lo muestra. | 📄 oficial para verde (hasta 50%) · ⚠️ 40% en amarillo y 0% en naranja o rojo según fuente secundaria | Abrir la tabla de costos de la ayuda 48578 y cargar los montos por peso para el diagnóstico. |
| Devoluciones: aviso con plazo y "pedir la revisión a tiempo si vuelve distinta" | `related_entities` del reclamo trae la devolución; recurso de devoluciones y acción `return_review`. | 📄 | Probar con un caso real. |
| "Semana 2 en solo lectura: no tocamos tu cuenta" | Durante la semana 2 el código no hace ninguna escritura. Desde el 17/10/2026 la app pide permisos de escritura (para las pruebas), así que el vendedor ve escritura en la pantalla de autorización: el "solo lectura" lo garantiza el código, no el permiso. | ⚠️ | Decidir: explicarlo al vendedor antes de autorizar, o usar una segunda app solo de lectura para el piloto. |
| Respuestas neutrales por canales oficiales, aprobadas por una persona | Acción `send-message` del reclamo, mensajería post-venta y `POST /answers` para preguntas. Todo depende del permiso **Comunicación pre y postventa** (preguntas, mensajes, reclamos y devoluciones). | ❌ **bloqueado el 17/10/2026**: la app tiene ese permiso solo en lectura; una pregunta del comprador de prueba dio 403 `PA_UNAUTHORIZED_RESULT_FROM_POLICIES` | Pasar ese permiso a lectura y escritura en el DevCenter y repetir la prueba de pregunta y respuesta. |
| Estirar plazo en vez de pausar (idea, todavía no está en la web) | `PUT /items/{id}` con `sale_terms` `MANUFACTURING_TIME` en días. Sirve para Mercado Envíos estándar (Colecta o correo): evita pausar, que le quita posicionamiento a la publicación. En Full no aplica. En Flex choca con la entrega inmediata, así que si la publicación tiene Flex la consola tiene que avisar que sale de Flex mientras dure el plazo. | ✅ **probado el 17/10/2026** con el vendedor de prueba: `PUT` con 10 días → 200, se lee de vuelta y se quita → 200. La API aceptó también 46, 90 y 200 días sin error, así que el tope lo tiene que poner la consola · ⚠️ Full y Flex según fuente secundaria | Ver con una venta real cómo cambia la fecha límite de despacho. |

## Venta Blindada

| Promesa | Cómo se construye | Estado | Falta |
|---|---|---|---|
| Descontar stock en Tiendanube con 1 clic | `PATCH /products/stock-price` (hasta 50 variantes) o `POST /products/{id}/variants/stock`. Pedidos por webhook `order/created` firmado con HMAC. Límite: 40 pedidos en ráfaga, 2 por segundo, por tienda y app. | ✅ **probado el 16/10/2026**: producto sin publicar, stock de 5 a 4 por API, verificado y borrado | App de partner propia para que cada vendedor conecte su tienda. |
| Descontar stock en Mercado Libre | En Argentina: `PUT /user-products/{id}/stock/type/selling_address` con el header `x-version`, que evita pisar un cambio hecho en paralelo. En cuentas con varios depósitos, `PUT /items` puede responder 200 sin cambiar el stock real. **Diseño:** al confirmar, nunca mandar un valor leído antes: `GET` del stock y la versión en ese momento, calcular stock − cantidad y `PUT` enseguida; si da 409 (entró una venta en el medio), repetir hasta 3 veces con 300 ms de espera. | ✅ **probado el 17/10/2026** con el vendedor de prueba: `GET` devuelve `x-version` 1; `PUT` con esa versión → 204 (stock 5 → 4, versión 2); el mismo `PUT` con la versión vieja → 409 `version mismatch`; sin el header → 400 `Missing X-Version header`. Reintento: otro sistema repuso 2 unidades entre nuestro `GET` y nuestro `PUT` → 409 → se releyó (6) y se escribió 5 → 204. No se pisó la reposición. | Repetir con una venta real entrando en paralelo. |
| No aplica a Full | Mercado Libre rechaza el cambio de stock en Full (error 400). | 📄 · ✏️ la web ya lo aclara | — |
| Leer el comprobante y detectar repetidos | IA con visión para leer el comprobante; clave de repetido: número de operación + CUIT de origen + monto + fecha. Un comprobante puede estar editado, así que el botón dice **"Confirmar acreditación y descontar stock"**: la persona da fe de que vio la plata en su cuenta. | ⚠️ | Prototipo con comprobantes reales de bancos y billeteras argentinas. |
| "Reservamos la unidad 15 minutos" | Mercado Libre no tiene reservas: habría que bajar el stock y devolverlo. | ✏️ quitado de la web | Si se quiere, diseñarlo y probarlo antes de volver a prometerlo. |
| Convivencia con Producteca o Multivende | Para leer no hay conflicto. Para descontar stock, dos sistemas pueden pisarse. | ✏️ la web dice que se define antes de activar | — |

## Conciliación de liquidaciones

| Promesa | Cómo se construye | Estado | Falta |
|---|---|---|---|
| Cruzar cada venta con lo que acreditó Mercado Pago: comisiones, envíos y retenciones, en un CSV | Reporte de Liquidaciones de Mercado Pago (`/v1/account/release_report`). Columnas: `MP_FEE_AMOUNT`, `FINANCING_FEE_AMOUNT`, `SHIPPING_FEE_AMOUNT`, `TAXES_AMOUNT`, `TAX_DETAIL`, `SALE_DETAIL`. Máximo 60 días por reporte. Es asíncrono y con datos al día anterior: se presenta como cierre diario o mensual, no en vivo. | ✅ el token de la app de Mercado Libre consulta `GET /v1/account/release_report/list` (HTTP 200 el 16/10/2026; lista vacía porque la cuenta no tiene ventas) · 📄 columnas | Generar y bajar un reporte con un vendedor real. Mercado Libre anunció apps separadas para Mercado Pago desde el 30/08/2026: si llega a aplicar a esta app, habrá que crear otra. |

## WhatsApp

| Promesa | Cómo se construye | Estado | Falta |
|---|---|---|---|
| Alertas al vendedor, incluidas en el Plan 1 | Número de INDIVIDRA vía Zernio. Plantilla de utilidad: USD 0,026 (≈ $40). Consentimiento al activar las alertas. Límite inicial: 250 destinatarios distintos por día. Desde el 1/10/2026 cada número tiene 1.000 mensajes de servicio gratis por mes y después se cobran a tarifa de utilidad (confirmado en la documentación de Meta). **Diseño:** todo envío de WhatsApp pasa por un único módulo, para poder cambiar Zernio por la API de Meta sin tocar el resto si Zernio falla. | 📄 · ✏️ la web ya dice "sin cargo de mensajes" | Alta en Meta/Zernio y aprobación de plantillas (ver `docs/whatsapp/plantillas.md`). Zernio no figura confirmado como partner de Meta. |
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
| Enterarse en el momento de reclamos, preguntas y ventas | Receptor `ml-notificaciones` (función de Supabase, sin JWT): valida el formato y el `application_id`, responde 200 enseguida y guarda en segundo plano en `ml_notificaciones`, una sola fila por envío original. Descarta cuentas no conectadas. Mercado Libre no firma las notificaciones: nunca se usa su contenido; se vuelve a pedir el recurso con el token del vendedor. | ✅ **probado el 17/10/2026** con notificaciones simuladas: ~0,3 s de respuesta (Mercado Libre pide menos de 0,5 s; un arranque en frío tardó 4,5 s y Mercado Libre reintenta), reintentos sin duplicar, otra app → 400, cuenta ajena → no se guarda | Cargar la URL y los tópicos en el DevCenter y ver llegar la primera notificación real. |
| Publicar y mantener publicaciones por API | Modelo User Products: el título va en `family_name`. Fotos: subirlas con `POST /pictures/items/upload` y asociarlas por `id`; por URL quedaron trabadas en `picture_download_pending`. | ✅ **probado el 17/10/2026**: publicación de prueba `MLA4087698366` creada, foto subida y activada | — |
| Conexión con Mercado Libre que no se corta | Tokens en Supabase y renovación automática cada hora, para todas las cuentas conectadas (`ml-refresh` recorre cada `account_label`, de a una y con turno exclusivo). | ✅ renovación verificada el 16/10/2026, también con la versión multicuenta | — |
| Instancia aislada, Ley 25.326, exportar todo | Separación por cliente en la base. | ⚠️ | Definir el diseño. |

## Lo que necesita al dueño de la cuenta

Credenciales y decisiones que no se pueden delegar:

1. **Mercado Libre DevCenter**: hecho el paso a lectura y escritura, salvo **Comunicación pre y postventa**, que sigue en lectura. Falta pasarlo y cargar la URL de notificaciones (`https://jdjkyuftiaebxjvapiiv.supabase.co/functions/v1/ml-notificaciones`) con los tópicos de ventas, preguntas, mensajes, publicaciones, envíos y reclamos.
2. **Usuarios de prueba de Mercado Libre**: creados el 16/10/2026 (vendedor `3767527720` y comprador `3767527722`) y autorizados el 17/10/2026. Las claves están en la tabla `ml_test_users` de Supabase, nunca en el chat. Mercado Libre los borra tras 60 días sin actividad.
3. **Compra y reclamo de prueba**: el entorno de Claude solo llega a la API de Mercado Libre, no al sitio. La compra la hace el dueño desde una ventana privada como comprador de prueba, o habilita los dominios del sitio en la red del entorno.
4. **Tiendanube**: cuenta de partner y app.
5. **Meta / Zernio**: cuenta y número. Claude redacta las plantillas.
6. **Mercado Pago**: por ahora no hace falta otra app; el token de Mercado Libre ya consulta los reportes de liquidaciones.

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
