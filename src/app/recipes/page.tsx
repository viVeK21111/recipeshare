'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import CountryFilter from '@/components/CountryFilter'
import RecipeFeed from '@/components/RecipeFeed'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function RecipesPage() {
  const { user } = useUser()
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <main>
        <div className="max-w-full mx-auto px-4  py-8">
          {/* Header with Filter on Right */}
          <div className="mb-8 md:flex items-start justify-between gap-4">
            <div className='md:mx-5'>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Recipe Feed</h1>
              <p className="text-gray-600">Discover and share amazing recipes from around the world</p>
            </div>
            
            {/* Country Filter on Right */}
            <div className="flex-shrink-0 mt-3 md:mt-0">
              <CountryFilter 
                selectedCountries={selectedCountries}
                onCountriesChange={setSelectedCountries}
              />
            </div>
          </div>

          <RecipeFeed countryFilters={selectedCountries} />
        </div>
      </main>
    </div>
  )
}