import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientAuth0Provider from '@/components/ClientAuth0Provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RecipeShare - Share Your Culinary Creations',
  description: 'A global platform for sharing and discovering amazing recipes from around the world',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientAuth0Provider>
          {children}
        </ClientAuth0Provider>
      </body>
    </html>
  )
}


