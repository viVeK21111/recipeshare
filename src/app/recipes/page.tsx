'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import CountryFilter from '@/components/CountryFilter'
import TypeFilter from '@/components/TypeFilter'
import VTypeFilter from '@/components/VTypeFilter'
import RecipeFeed from '@/components/RecipeFeed'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function RecipesPage() {
  const { user } = useUser()
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]) 
  const [selectedvType, setSelectedvType] = useState<string[]>([]) 
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  return (
    <div className="md:h-screen bg-gray-50 flex flex-col">
      <Header user={user} />

      <main className="flex-1 min-h-0 md:flex md:overflow-hidden">
        {/* Mobile filter toggle button */}
        <div className="md:hidden p-4 border-b border-gray-200 bg-white sticky top-0 z-20">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 text-gray-700 font-medium"
          >
            <span>Filters</span>
            <svg
              className={`h-4 w-4 transform transition-transform ${showMobileFilters ? 'rotate-180' : 'rotate-0'}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Mobile filters */}
        {showMobileFilters && (
          <div className="md:hidden p-4 bg-white border-b border-gray-200 space-y-4">
            <CountryFilter
              selectedCountries={selectedCountries}
              onCountriesChange={setSelectedCountries}
            />
            <TypeFilter 
              selectedTypes={selectedTypes}
              onTypesChange={setSelectedTypes}
            />
            <VTypeFilter 
              selectedTypes={selectedvType}
              onTypesChange={setSelectedvType}
            />
          </div>
        )}

        {/* Desktop filters */}
        <aside className="hidden md:block md:w-80 lg:w-96 md:border-r border-gray-200 bg-white">
          <div className="sticky top-0 z-20 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b md:border-b-0">
            <div className="p-4 md:p-5">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Recipe Feed</h1>
              <p className="text-gray-600">Discover and share amazing recipes from around the world</p>

              <div className="mt-4 space-y-4">
                <CountryFilter
                  selectedCountries={selectedCountries}
                  onCountriesChange={setSelectedCountries}
                />
                <TypeFilter 
                  selectedTypes={selectedTypes}
                  onTypesChange={setSelectedTypes}
                />
                <VTypeFilter 
                  selectedTypes={selectedvType}
                  onTypesChange={setSelectedvType}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Recipe feed */}
        <section className="flex-1 p-4 md:p-6 overflow-visible md:overflow-auto">
          <div className="max-w-4xl mx-auto">
            <RecipeFeed 
              countryFilters={selectedCountries}
              typeFilters={selectedTypes}
              vtypeFilters={selectedvType}
            />
          </div>
        </section>
      </main>
    </div>
  )
}
