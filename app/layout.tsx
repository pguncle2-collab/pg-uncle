import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { AuthProvider } from '@/contexts/AuthContext'
// WhatsApp Button - COMMENTED OUT
// import { WhatsAppButton } from '@/components/WhatsAppButton'

export const metadata: Metadata = {
  title: 'PGUNCLE - Your Trusted Uncle for a Comfortable PG Stay in Chandigarh',
  description: 'Whether you\'re a student chasing dreams or professional building a career, PGUNCLE gives you a safe, clean and homely PG - without stress, brokers, or surprises.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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
