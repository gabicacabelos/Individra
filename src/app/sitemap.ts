import { MetadataRoute } from 'next'

// Solo páginas indexables: /diagnostico es noindex y /ecommerce redirige a la home.
export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://www.individratec.com',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: 'https://www.individratec.com/logistica',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'https://www.individratec.com/legal',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
    ]
}
