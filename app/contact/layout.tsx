import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact PGUNCLE - Get in Touch for PG Accommodation in Chandigarh',
  description: 'Contact PGUNCLE for queries about PG accommodation in Chandigarh. Email us at info@pguncle.com or visit our office in Sector 82A, IT City, Mohali.',
  keywords: ['contact PGUNCLE', 'PG accommodation contact', 'Chandigarh PG inquiry', 'PGUNCLE support'],
  openGraph: {
    title: 'Contact PGUNCLE - Get in Touch',
    description: 'Contact PGUNCLE for queries about PG accommodation in Chandigarh.',
    url: 'https://www.pguncle.com/contact',
    type: 'website',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
