'use client'

import { useState, useRef, useEffect } from 'react'
import { MapPinIcon, ChevronDownIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'

interface Country {
  code: string
  name: string
  flag: string
}

const COUNTRIES: Country[] = [
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
]

interface CountryFilterProps {
  selectedCountries: string[]
  onCountriesChange: (countries: string[]) => void
}

export default function CountryFilter({ selectedCountries, onCountriesChange }: CountryFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCountryToggle = (countryCode: string) => {
    if (selectedCountries.includes(countryCode)) {
      onCountriesChange(selectedCountries.filter(c => c !== countryCode))
    } else {
      onCountriesChange([...selectedCountries, countryCode])
    }
  }

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    onCountriesChange([])
  }

  const handleSelectAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    onCountriesChange(COUNTRIES.map(c => c.code))
  }

  const getSelectedCountryNames = () => {
    if (selectedCountries.length === 0) return 'All Countries'
    if (selectedCountries.length === COUNTRIES.length) return 'All Countries'
    if (selectedCountries.length === 1) {
      const country = COUNTRIES.find(c => c.code === selectedCountries[0])
      return `${country?.flag} ${country?.name}`
    }
    return `${selectedCountries.length} countries selected`
  }

  return (
    <div className="mb-6 relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full md:w-auto min-w-[250px] bg-white rounded-lg shadow-sm border border-gray-200 p-3 flex items-center justify-between hover:border-orange-300 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <MapPinIcon className="h-5 w-5 text-gray-600" />
          <span className="font-medium text-gray-900">{getSelectedCountryNames()}</span>
        </div>
        <ChevronDownIcon className={`h-5 w-5 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <span className="text-sm font-semibold text-gray-700">Select Countries</span>
            <div className="flex items-center space-x-2">
              {selectedCountries.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded"
                >
                  Clear
                </button>
              )}
              <button
                onClick={handleSelectAll}
                className="text-xs text-orange-600 hover:text-orange-700 font-medium px-2 py-1 hover:bg-orange-50 rounded"
              >
                Select All
              </button>
            </div>
          </div>

          {/* Country List */}
          <div className="overflow-y-auto max-h-80">
            {COUNTRIES.map((country) => {
              const isSelected = selectedCountries.includes(country.code)
              return (
                <button
                  key={country.code}
                  onClick={() => handleCountryToggle(country.code)}
                  className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                    isSelected ? 'bg-orange-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{country.flag}</span>
                    <span className={`font-medium ${isSelected ? 'text-orange-700' : 'text-gray-700'}`}>
                      {country.name}
                    </span>
                  </div>
                  {isSelected && (
                    <CheckIcon className="h-5 w-5 text-orange-600" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Footer */}
          {selectedCountries.length > 0 && selectedCountries.length < COUNTRIES.length && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-wrap gap-2">
                {selectedCountries.map((code) => {
                  const country = COUNTRIES.find(c => c.code === code)
                  if (!country) return null
                  return (
                    <span
                      key={code}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
                    >
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCountryToggle(code)
                        }}
                        className="hover:bg-orange-200 rounded-full p-0.5"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}