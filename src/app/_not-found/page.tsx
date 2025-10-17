
'use client'

export default function NotFound() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-800">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="text-gray-600 mb-6">Sorry, we couldn't find what you were looking for.</p>
          <a href="/" className="text-orange-600 hover:underline font-medium">Go back home</a>
        </div>
      </div>
    )
  }
  