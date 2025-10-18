'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export default function UserSync() {
  const { user } = useUser()
  const syncedRef = useRef(false)

  useEffect(() => {
    if (user && !syncedRef.current) {
      syncedRef.current = true
      syncUser()
    }
  }, [user])

  const syncUser = async () => {
    if (!user) return

    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.sub)
        .maybeSingle()

      if (!existingUser) {
        const { error } = await supabase.from('users').insert({
          id: user.sub,
          email: user.email,
          name: user.name,
          avatar_url: user.picture,
        })

        if (error) {
          console.error('Error creating user:', error)
        } else {
          console.log('✅ User created in database:', user.sub)
        }
      } else {
        console.log('✅ User already exists:', user.sub)
      }
    } catch (error) {
      console.error('Error syncing user:', error)
    }
  }

  return null
}