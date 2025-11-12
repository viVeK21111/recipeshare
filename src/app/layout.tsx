

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientAuth0Provider from '@/components/ClientAuth0Provider'
import { ThemeProvider } from './context/ThemeContext'

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
  <head>
    <link rel="icon" type="image/png" href="/logo1.png" />
    <title>RecipeShare - Share Your Culinary Creations</title>
    <meta name="description" content="A global platform for sharing and discovering amazing recipes from around the world" />
  </head>
      <body className={inter.className}>
        <ClientAuth0Provider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ClientAuth0Provider>
      </body>
    </html>
  )
}


