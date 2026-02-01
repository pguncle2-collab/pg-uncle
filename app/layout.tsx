import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'pgUncle - Your Trusted Uncle for a Comfortable PG Stay in Chandigarh',
  description: 'Whether you\'re a student chasing dreams or professional building a career, pgUncle gives you a safe, clean and homely PG - without stress, brokers, or surprises.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
