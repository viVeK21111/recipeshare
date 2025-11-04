'use client'



const MEAL_TYPES = [
  { value: 'any', label: 'All Types', emoji: '🍽️' },
  { value: 'breakfast', label: 'Breakfast', emoji: '🍳' },
  { value: 'brunch', label: 'Brunch', emoji: '🥞' },
  { value: 'lunch', label: 'Lunch', emoji: '🥗' },
  { value: 'snack', label: 'Snack', emoji: '🍿' },
  { value: 'dinner', label: 'Dinner', emoji: '🍛' },
]

interface TypeFilterProps {
  selectedType: string
  onTypeChange: (type: string) => void
}

export default function TypeFilter({ selectedType, onTypeChange }: TypeFilterProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
        <span>Meal Type</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {MEAL_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => onTypeChange(type.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              selectedType === type.value
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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