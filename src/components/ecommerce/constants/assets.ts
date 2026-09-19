/* ---------- Íconos 3D ----------
   Los .webp viven en /public/3d/ecommerce. Se recortaron al bounding box
   real del alfa y se bajaron a 512px de lado mayor, así que el width/height
   de acá es la proporción exacta del archivo: pasarlos mal deforma el render.
   Solo se usa la familia "objeto" (cajas, carritos, teléfonos): los assets
   con personajes ilustrados rompen la estética oscura del resto del sitio. */

export type Art = { src: string; w: number; h: number; alt: string }

export const ART = {
    auriculares: {
        src: '/3d/ecommerce/auriculares.webp',
        w: 512,
        h: 367,
        alt: 'Auriculares de atención al cliente',
    },
    carritoLleno: {
        src: '/3d/ecommerce/carrito-lleno.webp',
        w: 448,
        h: 512,
        alt: 'Carrito de compras cargado de paquetes',
    },
    multicanal: {
        src: '/3d/ecommerce/multicanal.webp',
        w: 504,
        h: 512,
        alt: 'Teléfono con los íconos de los canales de venta y paquetes en tránsito',
    },
    cajaCronometro: {
        src: '/3d/ecommerce/caja-cronometro.webp',
        w: 512,
        h: 446,
        alt: 'Paquete junto a un cronómetro',
    },
    pagoCheck: {
        src: '/3d/ecommerce/pago-check.webp',
        w: 512,
        h: 501,
        alt: 'Mano con un teléfono y una operación aprobada',
    },
    cajaAbierta: {
        src: '/3d/ecommerce/caja-abierta.webp',
        w: 459,
        h: 512,
        alt: 'Caja abierta con productos saliendo',
    },
    tiendaPhone: {
        src: '/3d/ecommerce/tienda-phone.webp',
        w: 317,
        h: 512,
        alt: 'Teléfono con la vidriera de una tienda y una bolsa de compras',
    },
    ideaBurbuja: {
        src: '/3d/ecommerce/idea-burbuja.webp',
        w: 479,
        h: 512,
        alt: 'Globo de diálogo con una lamparita encendida',
    },
    power: {
        src: '/3d/ecommerce/power.webp',
        w: 504,
        h: 512,
        alt: 'Botón de encendido iluminado',
    },
    monitorOferta: {
        src: '/3d/ecommerce/monitor-oferta.webp',
        w: 460,
        h: 512,
        alt: 'Monitor con la ficha de un producto y una etiqueta de descuento',
    },
    /**
     * Render ancho con el 56% superior izquierdo completamente vacío
     * (medido sobre el canal alfa: 0% de píxeles con contenido ahí).
     * Ese hueco no es decorativo, es el lienzo donde va el copy del cierre.
     */
    slabCarrito: {
        src: '/3d/ecommerce/slab-carrito.webp',
        w: 1024,
        h: 715,
        alt: 'Teléfono apoyado con un carrito de compras recibiendo paquetes',
    },
} satisfies Record<string, Art>
