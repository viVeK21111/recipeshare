'use client'
export const dynamic = 'force-dynamic'

import { UserProvider } from '@auth0/nextjs-auth0/client'
import AuthGuard from './AuthGuard'

export default function ClientAuth0Provider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
      <AuthGuard>
        {children}
      </AuthGuard>
    </UserProvider>
  )
}