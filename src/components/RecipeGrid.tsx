'use client'

import { useState, useEffect } from 'react'
import { supabase, Recipe } from '@/lib/supabase'
import RecipeCard from './RecipeCard'
import LoadingSpinner from './LoadingSpinner'

interface RecipeGridProps {
  countryFilter: string
}

export default function RecipeGrid({ countryFilter }: RecipeGridProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRecipes()
  }, [countryFilter])

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('recipes')
        .select(`
          *,
          user:users(id, name, avatar_url),
          likes_count:likes(count),
          comments_count:comments(count)
        `)
        .order('created_at', { ascending: false })

      if (countryFilter !== 'all') {
        query = query.eq('country', countryFilter)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      // Transform the data to match our Recipe interface
      const transformedRecipes = data?.map(recipe => ({
        ...recipe,
        likes_count: recipe.likes_count?.[0]?.count || 0,
        comments_count: recipe.comments_count?.[0]?.count || 0
      })) || []

      setRecipes(transformedRecipes)
    } catch (err) {
      console.error('Error fetching recipes:', err)
      setError('Failed to load recipes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium mb-4">{error}</div>
        <button
          onClick={fetchRecipes}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">
          {countryFilter === 'all' 
            ? 'No recipes found. Be the first to share one!'
            : `No recipes found from ${countryFilter === 'other' ? 'other countries' : 'this country'}.`
          }
        </div>
        <div className="text-gray-400">
          Try selecting a different country or add a new recipe.
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}
