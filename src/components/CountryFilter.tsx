'use client'

import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface CountryFilterProps {
  selectedCountry: string
  onCountryChange: (country: string) => void
}

const countries = [
  { code: 'all', name: 'All Countries', flag: '🌍' },
  { code: 'us', name: 'United States', flag: '🇺🇸' },
  { code: 'it', name: 'Italy', flag: '🇮🇹' },
  { code: 'fr', name: 'France', flag: '🇫🇷' },
  { code: 'jp', name: 'Japan', flag: '🇯🇵' },
  { code: 'in', name: 'India', flag: '🇮🇳' },
  { code: 'mx', name: 'Mexico', flag: '🇲🇽' },
  { code: 'th', name: 'Thailand', flag: '🇹🇭' },
  { code: 'cn', name: 'China', flag: '🇨🇳' },
  { code: 'kr', name: 'South Korea', flag: '🇰🇷' },
  { code: 'br', name: 'Brazil', flag: '🇧🇷' },
  { code: 'es', name: 'Spain', flag: '🇪🇸' },
  { code: 'gr', name: 'Greece', flag: '🇬🇷' },
  { code: 'tr', name: 'Turkey', flag: '🇹🇷' },
  { code: 'de', name: 'Germany', flag: '🇩🇪' },
  { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'au', name: 'Australia', flag: '🇦🇺' },
  { code: 'ca', name: 'Canada', flag: '🇨🇦' },
  { code: 'ru', name: 'Russia', flag: '🇷🇺' },
  { code: 'other', name: 'Other', flag: '🌎' }
]

export default function CountryFilter({ selectedCountry, onCountryChange }: CountryFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedCountryData = countries.find(country => country.code === selectedCountry)

  return (
    <div className="relative">
      <button
        type="button"
        className="relative w-full bg-white border border-gray-300 rounded-lg shadow-sm pl-3 pr-10 py-3 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <span className="text-2xl mr-3">{selectedCountryData?.flag}</span>
          <span className="block truncate text-gray-900 font-medium">
            {selectedCountryData?.name}
          </span>
        </div>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
          {countries.map((country) => (
            <button
              key={country.code}
              className={`relative w-full text-left py-2 pl-3 pr-9 hover:bg-orange-50 ${
                selectedCountry === country.code ? 'bg-orange-100 text-orange-900' : 'text-gray-900'
              }`}
              onClick={() => {
                onCountryChange(country.code)
                setIsOpen(false)
              }}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{country.flag}</span>
                <span className="block truncate font-medium">
                  {country.name}
                </span>
              </div>
              {selectedCountry === country.code && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className="h-5 w-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
