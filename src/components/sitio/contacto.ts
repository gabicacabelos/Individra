export const WHATSAPP_NUMERO = '5491160152435'
export const CALENDLY_URL = 'https://calendly.com/individratec/30min'
export const EMAIL = 'individratec@gmail.com'
export const DIAGNOSTICO_HREF = '/diagnostico?origen=home_meli'

export function whatsappHref(texto: string) {
    return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`
}
