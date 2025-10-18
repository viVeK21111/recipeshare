'use client'

import { UserProvider } from '@auth0/nextjs-auth0/client'
import AuthGuard from './AuthGuard'
import UserSync from './UserSync'

export default function ClientAuth0Provider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
      <UserSync />
      <AuthGuard>
        {children}
      </AuthGuard>
    </UserProvider>
  )
}