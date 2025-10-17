

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientAuth0Provider from '@/components/ClientAuth0Provider'

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
  <head>
    <link rel="icon" type="image/png" href="/logo.png" />
    <title>RecipeShare - Share Your Culinary Creations</title>
    <meta name="description" content="A global platform for sharing and discovering amazing recipes from around the world" />
  </head>
      <body className={inter.className}>
        <ClientAuth0Provider>
          {children}
        </ClientAuth0Provider>
      </body>
    </html>
  )
}


