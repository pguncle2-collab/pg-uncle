import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About PGUNCLE - Your Trusted PG Partner in Chandigarh',
  description: 'Learn about PGUNCLE, your trusted partner for quality PG accommodation in Tricity, Chandigarh. We provide safe, verified, and comfortable living spaces for students and professionals.',
  keywords: ['about PGUNCLE', 'PG accommodation Chandigarh', 'trusted PG provider', 'student accommodation'],
  openGraph: {
    title: 'About PGUNCLE - Your Trusted PG Partner in Chandigarh',
    description: 'Learn about PGUNCLE, your trusted partner for quality PG accommodation in Tricity, Chandigarh.',
    url: 'https://www.pguncle.com/about',
    type: 'website',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
