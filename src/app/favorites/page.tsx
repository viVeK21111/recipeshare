'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { supabase, Recipe } from '@/lib/supabase'
import Header from '@/components/Header'
import RecipePost from '@/components/RecipePost'
import RecipeFav from '@/components/RecipeFav'
import { useTheme } from '@/app/context/ThemeContext'

export default function FavoritesPage() {
  const { user } = useUser()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()

  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user])

  const fetchFavorites = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Get user's favorites with recipe details
      const { data: favorites, error: favError } = await supabase
        .from('favorites')
        .select('recipe_id')
        .eq('user_id', user.sub)
        .order('created_at', { ascending: false })

      if (favError) throw favError

      if (!favorites || favorites.length === 0) {
        setRecipes([])
        setLoading(false)
        return
      }

      // Get recipe IDs
      const recipeIds = favorites.map(f => f.recipe_id)

      // Fetch full recipe details
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select(`
          *,
          user:users(id, name, avatar_url),
          likes_count:likes(count),
          comments_count:comments(count)
        `)
        .in('id', recipeIds)

      if (recipesError) throw recipesError

      // Transform the data
      const transformedRecipes = recipesData?.map(recipe => ({
        ...recipe,
        likes_count: recipe.likes_count?.[0]?.count || 0,
        comments_count: recipe.comments_count?.[0]?.count || 0,
      })) || []

      // Sort by favorite creation date
      const sortedRecipes = transformedRecipes.sort((a, b) => {
        const aIndex = recipeIds.indexOf(a.id)
        const bIndex = recipeIds.indexOf(b.id)
        return aIndex - bIndex
      })

      setRecipes(sortedRecipes)
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header user={user} />
      <main>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>My Favorites</h1>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Recipes you've saved for later • {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent"></div>
            </div>
          )}

          {!loading && recipes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeFav key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}


          {!loading && recipes.length === 0 && (
            <div className={`text-center py-20 ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-500'} rounded-lg border border-gray-200`}>
              <div className="text-6xl mb-4">📖</div>
              <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>No favorites yet</h3>
              <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Start exploring recipes and save your favorites!
              </p>
              <a
                href="/recipes"
                className="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
              >
                Browse Recipes
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
