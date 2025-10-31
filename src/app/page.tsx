'use client'
export const dynamic = 'force-dynamic'

import { useUser } from '@auth0/nextjs-auth0/client'
import Header from '@/components/Header'
import { useState,useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Hero from '@/components/Hero'
import RecipeGrid from '@/components/RecipeGrid'
import CountryFilter from '@/components/CountryFilter'

export default function Home() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/recipes')
    }
  }, [user, isLoading, router])

  if (isLoading || user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

 

  if(!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} />
        <main>
          <Hero />
         
        </main>
      </div>
    )
  }

 
}