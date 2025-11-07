'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Header from '@/components/Header'
import { FileSymlink } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner'
import { useTheme } from '@/app/context/ThemeContext'

export default function NewRecipe() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    country: '',
    type:'Any',
    vtype:'Veg',
    prep_time: '',
    cook_time: '',
    servings: '',
    image_url: ''
  })

  const { theme } = useTheme()

  if (isLoading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header user={user} />
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header user={user} />
        <div className="text-center py-12">
          <h1 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Please sign in</h1>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>You need to be signed in to create a recipe.</p>
          <a
            href="/api/auth/login"
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleArrayInputChange = (field: 'ingredients' | 'instructions', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field: 'ingredients' | 'instructions') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (field: 'ingredients' | 'instructions', index: number) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSubmitting(true)
    try {
      // First, ensure user exists in our users table
      const { error: userError } = await supabase
        .from('users')
        .upsert({
          id: user.sub,
          email: user.email,
          name: user.name,
          avatar_url: user.picture
        })

      if (userError) throw userError

      // Create the recipe
      const { data, error } = await supabase
        .from('recipes')
        .insert({
          title: formData.title,
          description: formData.description,
          ingredients: formData.ingredients.filter(ingredient => ingredient.trim() !== ''),
          instructions: formData.instructions.filter(instruction => instruction.trim() !== ''),
          country: formData.country,
          type: formData.type,
          vtype: formData.vtype,
          prep_time: parseInt(formData.prep_time),
          cook_time: parseInt(formData.cook_time),
          servings: parseInt(formData.servings),
          image_url: formData.image_url || null,
          user_id: user.sub
        })
        .select()
        .single()

      if (error) throw error

      router.push(`/recipes/${data.id}`)
    } catch (error) {
      console.error('Error creating recipe:', error)
      alert('Failed to create recipe. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const countries = [
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

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header user={user} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`rounded-xl shadow-sm p-6 md:p-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h1 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Share Your Recipe</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Basic Information</h2>
              
              <div>
                <label htmlFor="title" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Recipe Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400' : 'text-black border-gray-300'}`}
                  placeholder="Enter a delicious recipe title"
                />
              </div>

              <div>
                <label htmlFor="description" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400' : 'text-black border-gray-300'}`}
                  placeholder="Describe your recipe and what makes it special"
                />
              </div>

              <div >
                <label htmlFor="image_url" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Image URL (optional)
                </label>
                <div className='flex items-center'>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400' : 'text-black border-gray-300'}`}
                  placeholder="https://example.com/image.jpg"
                />
                <Link href={'https://postimages.org/'} target='_blanck'><FileSymlink className={`m-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}/></Link>
                </div>
                
              </div>

            </div>

            {/* Recipe Details */}
            <div className="space-y-6">
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Recipe Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div >
                  <label htmlFor="country" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Country *
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-100 border-gray-600' : 'border-gray-300'}`}
                  >
                    <option className={`${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'text-black'}`} value="">Select a country</option>
                    {countries.map(country => (
                      <option key={country.code} value={country.code} className={`${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'text-black'}`}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="prep_time" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Prep Time (minutes) *
                  </label>
                  <input
                    type="number"
                    id="prep_time"
                    name="prep_time"
                    value={formData.prep_time}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400' : 'text-black border-gray-300'}`}
                  />
                </div>

                <div>
                  <label htmlFor="cook_time" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Cook Time (minutes) *
                  </label>
                  <input
                    type="number"
                    id="cook_time"
                    name="cook_time"
                    value={formData.cook_time}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400' : 'text-black border-gray-300'}`}
                  />
                </div>
                <div>
                <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Meal Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-100 border-gray-600' : 'border-gray-300'}`}
                  required
                >
                  <option className={`${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'text-black'}`} value="Any">Any</option>
                  <option className={`${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'text-black'}`} value="Breakfast">🍳 Breakfast</option>
                  <option className={`${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'text-black'}`} value="Brunch">🥞 Brunch</option>
                  <option className={`${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'text-black'}`} value="Lunch">🥗 Lunch</option>
                  <option className={`${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'text-black'}`} value="Snack">🍿 Snack</option>
                  <option className={`${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'text-black'}`} value="Dinner">🍛 Dinner</option>
                  <option className={`${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'text-black'}`} value="Dessert">🍮 Dessert</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Type
                </label>
                <select
                  value={formData.vtype}
                  onChange={(e) => setFormData(prev => ({ ...prev, vtype: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-100 border-gray-600' : 'border-gray-300'}`}
                  required
                >
                  <option className={`${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'text-black'}`} value="Veg">Veg</option>
                  <option className={`${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'text-black'}`} value="Non-veg">Non-veg</option>
                </select>
              </div>
              </div>

              <div>
                <label htmlFor="servings" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Servings *
                </label>
                <input
                  type="number"
                  id="servings"
                  name="servings"
                  value={formData.servings}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400' : 'text-black border-gray-300'}`}
                />
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-6">
              <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Ingredients</h2>
              
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => handleArrayInputChange('ingredients', index, e.target.value)}
                    placeholder="Enter ingredient (e.g., 2 cups flour)"
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400' : 'text-black border-gray-300'}`}
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('ingredients', index)}
                      className="px-3 py-2 text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addArrayItem('ingredients')}
                className="px-4 py-2 text-orange-600 hover:text-orange-700 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
              >
                + Add Ingredient
              </button>
            </div>

            {/* Instructions */}
            <div className="space-y-6">
              <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Instructions</h2>
              
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="space-y-2">
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Step {index + 1}
                  </label>
                  <div className="flex space-x-2">
                    <textarea
                      value={instruction}
                      onChange={(e) => handleArrayInputChange('instructions', index, e.target.value)}
                      placeholder="Enter step instructions"
                      rows={2}
                      className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400' : 'text-black border-gray-300'}`}
                    />
                    {formData.instructions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('instructions', index)}
                        className="px-3 py-2 text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors self-start"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addArrayItem('instructions')}
                className="px-4 py-2 text-orange-600 hover:text-orange-700 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
              >
                + Add Step
              </button>
            </div>

            {/* Submit Button */}
            <div className={`flex justify-end space-x-4 pt-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                type="button"
                onClick={() => router.back()}
                className={`px-6 py-3 border rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Creating Recipe...' : 'Create Recipe'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
