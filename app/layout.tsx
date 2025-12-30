import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Strava Wrapped 2025 - Premium',
  description: '2025 n\'était pas une année, c\'était une épopée. Vos exploits visualisés.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={GeistMono.className}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
