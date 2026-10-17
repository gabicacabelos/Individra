# Plantillas de WhatsApp para aprobar en Meta (vía Zernio)

Todas son de categoría **Utilidad** e idioma **español (Argentina)**. Una plantilla de utilidad cuesta USD 0,026 por mensaje en Argentina (≈ $40). Si Meta la reclasifica como marketing, cuesta 2,4 veces más.

## Reglas que seguimos para que las aprueben

- **Nada promocional**: sin ofertas, descuentos ni "conocé nuestro plan". Una plantilla mixta pasa a marketing.
- **Atadas a algo que la persona hizo o necesita**: su venta, su reclamo, su entrega.
- **Ninguna variable al principio ni al final del texto.** Es una causa común de rechazo.
- **Poco texto variable** en proporción al texto fijo.
- **Valores de ejemplo** cargados en cada variable al enviarla a revisión.
- **Fuera de la ventana de 24 h solo se envían plantillas aprobadas.** Las respuestas dentro de la ventana van como mensaje libre, sin plantilla: así entran en los 1.000 gratis por mes y por número.

## Alertas al vendedor (número de INDIVIDRA)

Consentimiento que se muestra al activar las alertas:

> Quiero recibir por WhatsApp las alertas de INDIVIDRA sobre los reclamos, devoluciones y reputación de mi cuenta de Mercado Libre. Puedo darme de baja cuando quiera respondiendo BAJA.

### `alerta_reclamo`

```
Entró un reclamo en Mercado Libre.
Venta {{1}} · {{2}}
Motivo: {{3}}
Tenés hasta el {{4}} para responder.
Te quedan {{5}} reclamos antes de bajar de color, así que conviene resolverlo a tiempo.
```

- Ejemplos: `{{1}}` 2000012345678 · `{{2}}` Auriculares Bluetooth X200 · `{{3}}` Producto con fallas · `{{4}}` viernes 17/10 a las 14:00 · `{{5}}` 2
- Botones de respuesta rápida: **Ya lo estoy viendo** · **Recordame en 2 horas**
- Pie: `Respondé BAJA para no recibir más alertas.`

### `resumen_reclamos_dia`

Una sola por día, en vez de una por reclamo, para bajar costos.

```
Resumen de hoy en Mercado Libre: tenés {{1}} reclamos abiertos.
El que vence primero es el de la venta {{2}}, hasta el {{3}}.
Te quedan {{4}} reclamos antes de bajar de color.
```

- Ejemplos: `{{1}}` 3 · `{{2}}` 2000012345678 · `{{3}}` hoy a las 18:00 · `{{4}}` 1
- Botón de respuesta rápida: **Ver el detalle**

### `alerta_devolucion`

```
Se abrió una devolución en Mercado Libre por {{1}} en la venta {{2}}.
Cuando llegue el paquete, revisalo: tenés hasta el {{3}} para pedir la revisión si vuelve distinto.
```

- Ejemplos: `{{1}}` Producto distinto al publicado · `{{2}}` 2000012345678 · `{{3}}` martes 21/10
- Botón de respuesta rápida: **Entendido**

## Confirmaciones de entrega (número de cada logística)

Consentimiento que pide la tienda en su checkout:

> Acepto recibir avisos de entrega por WhatsApp de {tienda} y de su servicio de envíos.

### `confirmacion_entrega`

```
Hola {{1}}, mañana {{2}} te llega tu pedido de {{3}} entre las {{4}}.
¿Vas a estar para recibirlo?
```

- Ejemplos: `{{1}}` Laura · `{{2}}` jueves 17/10 · `{{3}}` Tienda Ejemplo · `{{4}}` 9 y 13 h
- Botones de respuesta rápida: **Sí, voy a estar** · **No puedo** · **Cambiar horario**
- Pie: `Respondé BAJA si no querés recibir estos avisos.`
- Cada botón lleva un dato propio con el identificador de la parada. Así la respuesta se asocia a la parada aunque Meta oculte el teléfono de la persona (usernames y BSUID).

### `confirmacion_entrega_b` (plan B)

La misma confirmación con otra redacción, aprobada de antemano. Se usa si Meta pausa `confirmacion_entrega` por mala recepción.

```
Buenas tardes {{1}}, te escribimos por tu pedido de {{2}}: lo entregamos mañana {{3}}, entre las {{4}}.
Confirmanos si alguien va a estar en el domicilio.
```

- Mismos botones y pie.

### `pedido_en_camino` (respaldo)

```
Tu pedido de {{1}} ya salió y llega hoy entre las {{2}}.
Si no vas a estar, respondé este mensaje y lo reprogramamos.
```

- Ejemplos: `{{1}}` Tienda Ejemplo · `{{2}}` 15 y 17 h
- Solo para quien no tiene la ventana abierta el día de la entrega (ver abajo). A quien respondió la confirmación se le escribe sin plantilla.

## Mensajes del día de entrega dentro de la ventana de 24 h

Cuando la persona toca un botón de `confirmacion_entrega` la noche anterior, se abre la ventana de 24 h. Mientras siga abierta, los avisos del día de entrega van como mensaje libre, sin plantilla:

- **En camino:** "Hola Laura, tu pedido de Tienda Ejemplo está a 3 paradas. Llega en unos 30 minutos." Puede llevar los botones **Ya estoy** · **No llego a estar**.
- **Después de entregar:** "¡Gracias, Laura! Si tenés un minuto, contanos cómo te fue en Google: {link}."

Reglas:

1. **Solo a quien respondió.** Sin un mensaje de la persona no hay ventana: a quien no tocó ningún botón se le manda `pedido_en_camino` (plantilla de utilidad) o nada. El pedido de reseña, sin ventana, no se manda: como plantilla sería de marketing.
2. **La ventana dura 24 h desde el último mensaje de la persona,** no desde la plantilla. Si respondió a las 20:00 y la entrega es al día siguiente después de las 20:00, la ventana ya cerró. El sistema guarda `ventana_hasta` por destinatario (último mensaje entrante + 24 h) y antes de cada mensaje libre verifica que falten al menos 10 minutos; si no, usa la plantilla de respaldo.
3. **No es gratis ilimitado.** Los mensajes libres entran en los 1.000 mensajes de servicio gratis por mes y por número, junto con las respuestas a los botones ("Listo, te esperamos..."). Pasado ese número, cada uno cuesta lo mismo que una plantilla de utilidad (≈ $40).
4. **Reseñas en Google: a todos por igual.** Google prohíbe pedirle reseñas solo a los clientes conformes ("selectively solicit positive reviews") y dar algo a cambio. Se le pide a todos los que recibieron el pedido, sin filtrar antes por satisfacción.
5. **Por confirmar en la primera prueba con Zernio:** que tocar un botón de respuesta rápida llega como mensaje de la persona y abre la ventana. Es lo que describen los proveedores, pero no lo encontramos dicho así en la documentación de Meta.

## Respuestas sin plantilla (dentro de las 24 h)

Cuando la persona toca un botón se abre la ventana de 24 h. Estas respuestas van como mensaje libre:

- **Sí, voy a estar** → "Listo, te esperamos mañana entre las {franja}."
- **No puedo** → "Entendido, mañana no lo llevamos. ¿Qué día te queda mejor?", con una lista de días disponibles.
- **Cambiar horario** → lista de franjas disponibles.
- **BAJA** → "Listo, no te vamos a mandar más avisos." Se registra la baja y no se vuelve a escribir.

## Plantillas que Meta probablemente clasifique como marketing

- **Invitación a calificar en Google** (módulo Escudo de reputación de logística): como plantilla, pedir una reseña pública se acerca a lo promocional y costaría tarifa de marketing (USD 0,0618 ≈ $95). Por eso va solo como mensaje libre dentro de la ventana (ver arriba), y nunca mezclada con una confirmación de entrega, porque arrastraría toda la plantilla a marketing.
- Si Meta reclasifica una plantilla de utilidad a marketing, el costo por mensaje pasa de ≈ $40 a ≈ $95 sin aviso previo para cuentas advertidas.

## Por qué el diseño de botones sale más barato que un chatbot

Desde el 1/10/2026, pasados los 1.000 mensajes de servicio gratis por mes y por número, cada mensaje libre que manda la empresa se cobra a tarifa de utilidad. Un chatbot que charla 8 mensajes por entrega consume esa franquicia en pocos días y después multiplica la factura. Una plantilla con 3 botones y una respuesta corta resuelve lo mismo con 1 o 2 mensajes.

## Costos de referencia (octubre de 2026)

- Alertas al vendedor: 30 por mes ≈ USD 0,78 (≈ $1.200); 100 por mes ≈ USD 2,60 (≈ $4.000). Las paga INDIVIDRA.
- Logística con 50 entregas por día, 22 días (1.100 entregas por mes), suponiendo que el 70% responde la confirmación. Las paga la logística, porque Meta le factura directo a su número:

| Mensaje | Todo con plantillas | Con la ventana de 24 h |
|---|---|---|
| Confirmación la noche anterior (1.100 plantillas de utilidad) | $44.000 | $44.000 |
| "En camino" | 1.100 plantillas: $44.000 | 330 plantillas a quien no respondió: $13.200 + 770 mensajes libres |
| Pedido de reseña | 1.100 plantillas de marketing: $104.500 | 770 mensajes libres; a quien no respondió no se le pide |
| Mensajes libres del mes (respuestas a botones incluidas) | 770, dentro de los 1.000 gratis | 2.310: 1.000 gratis y 1.310 a $40 = $52.400 |
| **Total por mes** | **$192.500** | **$109.600** |

El ahorro (≈ 43%) viene casi todo de no mandar el pedido de reseña como plantilla de marketing. Sin pedido de reseña, la diferencia es chica: $88.000 contra $78.800.
- Tarifa: USD 0,026 por plantilla de utilidad en Argentina, según la tabla de Zernio basada en la de Meta del 1/10/2026. Antes de fijar precios, confirmar con la tabla oficial en pesos de Meta.
