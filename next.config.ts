import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    // Next 16 solo permite los valores de quality declarados acá (por defecto
    // [75]) y descarta el resto en silencio. El sitio usa quality={95} en los
    // logos y en los renders 3D de /ecommerce: sin esta lista ese prop no
    // tenía ningún efecto y todo se servía a 75, con banding visible en los
    // degradados suaves de los renders.
    qualities: [75, 95],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  }
};

export default nextConfig;
