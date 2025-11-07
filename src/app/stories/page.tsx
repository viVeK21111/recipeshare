'use client'

import Link from 'next/link'
import { useTheme } from '@/app/context/ThemeContext'

export default function NotFound() {
  const { theme } = useTheme()
  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="text-center">
        
        <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-700'}`}>Coming soon</h2>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
          This feature is not available yet.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}