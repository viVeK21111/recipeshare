'use client'

import { FireIcon, BeakerIcon } from '@heroicons/react/24/outline'
import { useTheme } from '../app/context/ThemeContext'

interface NutritionInfoProps {
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
  sugar?: number
  sodium?: number
  servings: number
}

export default function NutritionInfo({
  calories,
  protein,
  carbs,
  fat,
  fiber,
  sugar,
  sodium,
  servings
}: NutritionInfoProps) {
  const { theme } = useTheme()
  // Check if any nutrition data exists
  const hasNutritionData = calories || protein || carbs || fat || fiber || sugar || sodium

  if (!hasNutritionData) {
    return null
  }

  const macroCalories = {
    protein: protein !== undefined && protein !== null ? protein * 4 : null,
    carbs: carbs !== undefined && carbs !== null ? carbs * 4 : null,
    fat: fat !== undefined && fat !== null ? fat * 9 : null
  }

  const calculatedCalories = Object.values(macroCalories).reduce<number>((total, value) => {
    return total + (value ?? 0)
  }, 0)

  const hasReportedCalories = calories !== undefined && calories !== null
  const reportedCalories = hasReportedCalories ? (calories as number) : null
  const hasCalculatedCalories = calculatedCalories > 0
  const caloriesDifference =
    reportedCalories !== null && hasCalculatedCalories ? Math.round(calculatedCalories - reportedCalories) : null
  const caloriesMismatch =
    reportedCalories !== null &&
    hasCalculatedCalories &&
    Math.abs(calculatedCalories - reportedCalories) > Math.max(0.1 * reportedCalories, 10)

  const referenceRanges: Record<string, string> = {
    protein: '20-40g per serving',
    carbs: '25-60g per serving',
    fat: '10-25g per serving',
    fiber: '3-10g per serving',
    sugar: '0-15g per serving',
    sodium: '≤600mg per serving'
  }

  const showCalorieBreakdown =
    reportedCalories !== null &&
    reportedCalories > 0 &&
    protein !== undefined &&
    protein !== null &&
    protein > 0 &&
    carbs !== undefined &&
    carbs !== null &&
    carbs > 0 &&
    fat !== undefined &&
    fat !== null &&
    fat > 0

  return (
    <div className={`rounded-xl shadow-sm border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
        <BeakerIcon className="h-6 w-6 text-orange-600" />
        Nutrition Facts
      </h2>
      
      <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Per serving (serves {servings})</p>

      <div className="space-y-3">
        {/* Calories */}
        {reportedCalories !== null && (
          <div className={`flex items-center justify-between py-3 border-b-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-900 text-black'}`}>
            <div className="flex items-center gap-2">
              <FireIcon className="h-5 w-5 text-orange-600" />
              <span className="font-bold text-lg">Calories</span>
            </div>
            <span className={`font-bold text-2xl ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{reportedCalories} kcal</span>
          </div>
        )}

        {/* Macronutrients */}
        <div className="space-y-2 pt-2">
          {protein !== undefined && protein !== null && (
            <div className={`py-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <span className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Protein</span>
                <span className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{protein}g</span>
              </div>
              <div className={`flex items-center justify-between text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <span>{macroCalories.protein !== null ? `${Math.round(macroCalories.protein)} kcal` : '—'}</span>
             
              </div>
            </div>
          )}

          {carbs !== undefined && carbs !== null && (
            <div className={`py-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <span className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Carbohydrates</span>
                <span className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{carbs}g</span>
              </div>
              <div className={`flex items-center justify-between text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <span>{macroCalories.carbs !== null ? `${Math.round(macroCalories.carbs)} kcal` : '—'}</span>
               
              </div>
            </div>
          )}

          {sugar !== undefined && sugar !== null && (
            <div className={`py-2 border-b pl-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>• Sugar</span>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>{sugar}g</span>
              </div>
            </div>
          )}

          {fiber !== undefined && fiber !== null && (
            <div className={`py-2 border-b pl-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>• Fiber</span>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>{fiber}g</span>
              </div>
            </div>
          )}

          {fat !== undefined && fat !== null && (
            <div className={`py-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <span className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Fat</span>
                <span className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{fat}g</span>
              </div>
              <div className={`flex items-center justify-between text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <span>{macroCalories.fat !== null ? `${Math.round(macroCalories.fat)} kcal` : '—'}</span>
              </div>
            </div>
          )}

          {sodium !== undefined && sodium !== null && (
            <div className={`py-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <span className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Sodium</span>
                <span className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{sodium}mg</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Optional: Calorie breakdown */}
      {showCalorieBreakdown && reportedCalories !== null && (
        <div className={`mt-6 pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Calorie Breakdown</p>
          <div className="flex gap-2 h-4 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500" 
              style={{ width: `${(protein * 4 / reportedCalories) * 100}%` }}
              title={`Protein: ${Math.round((protein * 4 / reportedCalories) * 100)}%`}
            />
            <div 
              className="bg-yellow-500" 
              style={{ width: `${(carbs * 4 / reportedCalories) * 100}%` }}
              title={`Carbs: ${Math.round((carbs * 4 / reportedCalories) * 100)}%`}
            />
            <div 
              className="bg-red-500" 
              style={{ width: `${(fat * 9 / reportedCalories) * 100}%` }}
              title={`Fat: ${Math.round((fat * 9 / reportedCalories) * 100)}%`}
            />
          </div>
          <div className={`flex justify-between text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-blue-500 rounded-sm"></span>
              Protein {Math.round((protein * 4 / reportedCalories) * 100)}%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-yellow-500 rounded-sm"></span>
              Carbs {Math.round((carbs * 4 / reportedCalories) * 100)}%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-500 rounded-sm"></span>
              Fat {Math.round((fat * 9 / reportedCalories) * 100)}%
            </span>
          </div>
        </div>
      )}

      {hasCalculatedCalories && (
        <div className={`mt-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900 border border-gray-700 text-gray-200' : 'bg-gray-50 border border-gray-200 text-gray-700'}`}>
          <p className="text-sm font-semibold">How we calculated it</p>
          <p className="text-xs mt-1">
            Protein &amp; carbohydrates contribute 4 kcal per gram and fat contributes 9 kcal per gram. Based on the macros provided, this recipe supplies approximately {Math.round(calculatedCalories)} kcal per serving.
            {reportedCalories !== null ? ` Reported calories: ${reportedCalories} kcal.` : ''}
          </p>
          {caloriesMismatch && caloriesDifference !== null && (
            <p className="text-xs mt-2 text-red-500">
              Heads up: the reported calories differ from the macro-based calories by {Math.abs(caloriesDifference)} kcal. Double-check the values entered for this recipe.
            </p>
          )}
         
        </div>
      )}

      <p className={`text-xs mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        * Nutrition values are approximate and may vary based on ingredients used.
      </p>
    </div>
  )
}