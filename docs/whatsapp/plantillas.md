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

### `pedido_en_camino`

```
Tu pedido de {{1}} ya salió y llega hoy entre las {{2}}.
Si no vas a estar, respondé este mensaje y lo reprogramamos.
```

- Ejemplos: `{{1}}` Tienda Ejemplo · `{{2}}` 15 y 17 h

## Respuestas sin plantilla (dentro de las 24 h)

Cuando la persona toca un botón se abre la ventana de 24 h. Estas respuestas van como mensaje libre:

- **Sí, voy a estar** → "Listo, te esperamos mañana entre las {franja}."
- **No puedo** → "Entendido, mañana no lo llevamos. ¿Qué día te queda mejor?", con una lista de días disponibles.
- **Cambiar horario** → lista de franjas disponibles.
- **BAJA** → "Listo, no te vamos a mandar más avisos." Se registra la baja y no se vuelve a escribir.

## Costos de referencia (octubre de 2026)

- Alertas al vendedor: 30 por mes ≈ USD 0,78 (≈ $1.200); 100 por mes ≈ USD 2,60 (≈ $4.000). Las paga INDIVIDRA.
- Logística con 50 entregas por día, 22 días: 1.100 confirmaciones ≈ USD 28,6 por mes (≈ $44.000). Las paga la logística, porque Meta le factura directo a su número.
- Tarifa: USD 0,026 por plantilla de utilidad en Argentina, según la tabla de Zernio basada en la de Meta del 1/10/2026. Antes de fijar precios, confirmar con la tabla oficial en pesos de Meta.
