import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/auth/', '/profile/'],
      },
    ],
    sitemap: 'https://www.pguncle.com/sitemap.xml',
  }
}
