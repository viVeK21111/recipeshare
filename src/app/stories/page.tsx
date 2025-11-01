'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Coming soon</h2>
        <p className="text-gray-600 mb-8">
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