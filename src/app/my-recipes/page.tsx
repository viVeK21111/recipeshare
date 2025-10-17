'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { useEffect, useState } from 'react'
import { supabase, Recipe } from '@/lib/supabase'
import Header from '@/components/Header'
import MyRecipeCard from '@/components/MyRecipeCard'

export default function MyRecipesPage() {
  const { user } = useUser()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    fetchRecipes()
  }, [user])

  const fetchRecipes = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const { data } = await supabase
        .from('recipes')
        .select(`*, user:users(id, name, avatar_url), likes_count:likes(count), comments_count:comments(count)`)
        .eq('user_id', user.sub)
        .order('created_at', { ascending: false })

      const transformed = (data || []).map((r: any) => ({
        ...r,
        likes_count: r.likes_count?.[0]?.count || 0,
        comments_count: r.comments_count?.[0]?.count || 0,
      }))
      setRecipes(transformed)
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRecipe = async (recipeId: string) => {
    try {
      // Delete associated likes first
      await supabase
        .from('likes')
        .delete()
        .eq('recipe_id', recipeId)

      // Delete associated comments
      await supabase
        .from('comments')
        .delete()
        .eq('recipe_id', recipeId)

      // Delete the recipe
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId)

      if (error) {
        throw error
      }

      // Remove from local state
      setRecipes(prev => prev.filter(r => r.id !== recipeId))
      
      // Show success message (optional - you can use a toast library)
      alert('Recipe deleted successfully!')
    } catch (error) {
      console.error('Error deleting recipe:', error)
      alert('Failed to delete recipe. Please try again.')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to view your recipes.</p>
            <a
              href="/api/auth/login"
              className="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Recipes</h1>
          <p className="text-gray-600">
            Manage your shared recipes • {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent"></div>
          </div>
        )}

        {/* Recipes Grid */}
        {!loading && (
          <>
            {recipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((r) => (
                  <MyRecipeCard 
                    key={r.id} 
                    recipe={r} 
                    onDelete={handleDeleteRecipe}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes yet</h3>
                <p className="text-gray-600 mb-6">Start sharing your favorite recipes with the world!</p>
                <a
                  href="/recipes/create"
                  className="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Create Your First Recipe
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}