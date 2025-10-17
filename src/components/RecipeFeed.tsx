'use client'

import { useState, useEffect } from 'react'
import { supabase, Recipe } from '@/lib/supabase'
import RecipePost from './RecipePost'
import LoadingSpinner from './LoadingSpinner'

interface RecipeFeedProps {
  countryFilter: string
}

const RECIPES_PER_PAGE = 20

export default function RecipeFeed({ countryFilter }: RecipeFeedProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [displayCount, setDisplayCount] = useState(RECIPES_PER_PAGE)

  useEffect(() => {
    fetchRecipes()
    setDisplayCount(RECIPES_PER_PAGE) // Reset display count when filter changes
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

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + RECIPES_PER_PAGE)
  }

  const displayedRecipes = recipes.slice(0, displayCount)
  const hasMore = displayCount < recipes.length

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
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🍽️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
        <p className="text-gray-600">
          {countryFilter === 'all' 
            ? 'Be the first to share a recipe!'
            : 'No recipes from this country yet. Try selecting a different country.'}
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="max-w-2xl mx-auto">
        {displayedRecipes.map((recipe) => (
          <RecipePost key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8 mb-12">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3 bg-white border-2 border-orange-600 text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-colors"
          >
            Load More Recipes
          </button>
        </div>
      )}

      {!hasMore && recipes.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          You've reached the end! 🎉
        </div>
      )}
    </div>
  )
}
