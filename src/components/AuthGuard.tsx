'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { isProtectedRoute, AUTH_CONFIG } from '@/lib/auth-config'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useUser()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // If still loading, wait
    if (isLoading) return

    // Check if current route needs authentication
    const needsAuth = isProtectedRoute(pathname)

    // If route needs auth and user is not logged in, redirect to login
    if (needsAuth && !user) {
      router.push(`${AUTH_CONFIG.loginUrl}?returnTo=${pathname}`)
    }
  }, [user, isLoading, pathname, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If protected route and no user, show loading (redirect is happening)
  if (isProtectedRoute(pathname) && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // User is authenticated or route is public, show the page
  return <>{children}</>
}
