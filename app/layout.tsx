import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { AuthProvider } from '@/contexts/AuthContext'
// WhatsApp Button - COMMENTED OUT
// import { WhatsAppButton } from '@/components/WhatsAppButton'

export const metadata: Metadata = {
  title: 'PGUNCLE - Your Trusted Uncle for a Comfortable PG Stay in Chandigarh',
  description: 'Whether you\'re a student chasing dreams or professional building a career, PGUNCLE gives you a safe, clean and homely PG - without stress, brokers, or surprises.',
  applicationName: 'PGUNCLE',
  keywords: ['PGUNCLE', 'PG accommodation', 'Chandigarh PG', 'student accommodation', 'paying guest'],
  authors: [{ name: 'PGUNCLE' }],
  creator: 'PGUNCLE',
  publisher: 'PGUNCLE',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.pguncle.com',
    siteName: 'PGUNCLE',
    title: 'PGUNCLE - Your Trusted Uncle for a Comfortable PG Stay in Chandigarh',
    description: 'Whether you\'re a student chasing dreams or professional building a career, PGUNCLE gives you a safe, clean and homely PG - without stress, brokers, or surprises.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'PGUNCLE Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PGUNCLE - Your Trusted Uncle for a Comfortable PG Stay in Chandigarh',
    description: 'Whether you\'re a student chasing dreams or professional building a career, PGUNCLE gives you a safe, clean and homely PG - without stress, brokers, or surprises.',
    images: ['/logo.png'],
    creator: '@PGUNCLE',
  },
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/logo.png',
  },
  metadataBase: new URL('https://www.pguncle.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PGUNCLE',
    alternateName: 'PGUNCLE',
    url: 'https://www.pguncle.com',
    logo: 'https://www.pguncle.com/logo.png',
    description: 'Your Trusted Uncle for a Comfortable PG Stay in Chandigarh',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Chandigarh',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@pguncle.com',
      contactType: 'Customer Service',
    },
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <AuthProvider>
          {children}
          {/* WhatsApp Button - COMMENTED OUT */}
          {/* <WhatsAppButton /> */}
        </AuthProvider>
      </body>
    </html>
  )
}
