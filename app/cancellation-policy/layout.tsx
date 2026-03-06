import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy - PGUNCLE',
  description: 'Read PGUNCLE cancellation and refund policy. 7-day refund window for token bookings, clear terms for full and monthly payments. Transparent and fair policies.',
  keywords: ['PGUNCLE cancellation policy', 'refund policy', 'booking cancellation', 'PG refund terms'],
  openGraph: {
    title: 'Cancellation & Refund Policy - PGUNCLE',
    description: 'Transparent cancellation and refund policy for PGUNCLE bookings.',
    url: 'https://www.pguncle.com/cancellation-policy',
    type: 'website',
  },
}

export default function CancellationPolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
