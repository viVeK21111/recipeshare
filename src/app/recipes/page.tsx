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
    // Full-viewport column layout; lets inner areas control scrolling
    <div className="md:h-screen bg-gray-50 flex flex-col">
      {/* Top site header (not changed) */}
      <Header user={user} />

      {/* Main area: column on mobile, split on md+; min-h-0 allows overflow-auto children */}
      <main className="flex-1 min-h-0 md:flex md:overflow-hidden">
        {/* Sidebar / Filters:
            - Mobile: full width at top, sticky under the Header
            - Desktop: left column, sticky */}
        <aside className="w-full md:w-80 lg:w-96 md:border-r border-gray-200 bg-white">
          {/* Sticky container – mobile sticks to top-0; desktop sticks within its column */}
          <div className="sticky top-0 md:top-0 z-20 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b md:border-b-0">
            <div className="p-4 md:p-5">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Recipe Feed</h1>
              <p className="text-gray-600">Discover and share amazing recipes from around the world</p>

              <div className="mt-4">
                <CountryFilter
                  selectedCountries={selectedCountries}
                  onCountriesChange={setSelectedCountries}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Feed:
            - Mobile: appears below filters and page scrolls naturally
            - Desktop: only the feed scrolls independently */}
        <section className="flex-1 p-4 md:p-6 overflow-visible md:overflow-auto">
          <div className="max-w-4xl mx-auto">
            <RecipeFeed countryFilters={selectedCountries} />
          </div>
        </section>
      </main>
    </div>
  )
}
