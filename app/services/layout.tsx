import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Services - PGUNCLE PG Accommodation in Chandigarh',
  description: 'Discover PGUNCLE services: verified PG accommodations, secure payments, easy booking, and 24/7 customer support for students and professionals in Chandigarh.',
  keywords: ['PGUNCLE services', 'PG booking', 'secure payments', 'verified PG', 'Chandigarh accommodation'],
  openGraph: {
    title: 'Our Services - PGUNCLE PG Accommodation',
    description: 'Verified PG accommodations with secure payments and 24/7 support in Chandigarh.',
    url: 'https://www.pguncle.com/services',
    type: 'website',
  },
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
