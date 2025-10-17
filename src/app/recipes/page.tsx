'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import CountryFilter from '@/components/CountryFilter'
import RecipeFeed from '@/components/RecipeFeed'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function RecipesPage() {
  const { user } = useUser()
  const [selectedCountry, setSelectedCountry] = useState('all')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <main>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Recipe Feed</h1>
              <p className="text-gray-600">Discover and share amazing recipes from around the world</p>
            </div>
            <div className="ml-auto mt-5 md:mt-0">
              <CountryFilter 
                selectedCountry={selectedCountry}
                onCountryChange={setSelectedCountry}
              />
            </div>
          </div>

          <RecipeFeed countryFilter={selectedCountry} />
        </div>
      </main>
    </div>
  )
}
