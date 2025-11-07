'use client'

import { useTheme } from '@/app/context/ThemeContext'

const MEAL_TYPES = [
  { value: 'Breakfast', label: 'Breakfast', emoji: '🍳' },
  { value: 'Brunch', label: 'Brunch', emoji: '🥞' },
  { value: 'Lunch', label: 'Lunch', emoji: '🥗' },
  { value: 'Snack', label: 'Snack', emoji: '🍿' },
  { value: 'Dinner', label: 'Dinner', emoji: '🍛' },
  { value: 'Dessert', label: 'Dessert', emoji: '🍮' },
]

interface TypeFilterProps {
  selectedTypes: string[]
  onTypesChange: (types: string[]) => void
}

export default function TypeFilter({ selectedTypes, onTypesChange }: TypeFilterProps) {
  const handleTypeToggle = (typeValue: string) => {
    if (selectedTypes.includes(typeValue)) {
      onTypesChange(selectedTypes.filter(t => t !== typeValue))
    } else {
      onTypesChange([...selectedTypes, typeValue])
    }
  }

  const handleClearAll = () => {
    onTypesChange([])
  }

  const handleSelectAll = () => {
    onTypesChange(MEAL_TYPES.map(t => t.value))
  }

  const { theme } = useTheme()

  return (
    <div className={`rounded-lg shadow-sm border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-3 mb-3`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-700'} flex items-center space-x-2`}>
            <span>Meal Type</span>
          </h3>
          {selectedTypes.length > 0 && (
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
              {selectedTypes.length} selected
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {selectedTypes.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear All
            </button>
          )}
          <button
            onClick={handleSelectAll}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Select All
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {MEAL_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => handleTypeToggle(type.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              selectedTypes.includes(type.value)
                ? 'bg-orange-600 text-white shadow-md'
                : (theme === 'dark' ? 'bg-gray-700 text-gray-100 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
            }`}
          >
            <span className="text-lg">{type.emoji}</span>
            <span>{type.label}</span>
           
          </button>
        ))}
      </div>
    </div>
  )
}