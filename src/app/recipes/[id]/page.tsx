'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { CircleX } from 'lucide-react';
import { useUser } from '@auth0/nextjs-auth0/client'
import { supabase, Recipe, Comment } from '@/lib/supabase'
import Header from '@/components/Header'
import LoadingSpinner from '@/components/LoadingSpinner'
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  ClockIcon, 
  UserGroupIcon,
  MapPinIcon,
  ShareIcon,
  PencilIcon,
  DivideIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

export default function RecipeDetail() {
  const params = useParams() as { id?: string | string[] } | null
  const recipeId = params ? (Array.isArray(params.id) ? params.id?.[0] : params.id) : undefined
  const { user } = useUser()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl)
  }

  useEffect(() => {
    if (recipeId) {
      fetchRecipe()
      fetchComments()
    }
  }, [recipeId])

  const fetchRecipe = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          user:users(id, name, avatar_url),
          likes_count:likes(count),
          comments_count:comments(count)
        `)
        .eq('id', recipeId)
        .single()

      if (error) throw error

      const transformedRecipe = {
        ...data,
        likes_count: data.likes_count?.[0]?.count || 0,
        comments_count: data.comments_count?.[0]?.count || 0
      }

      setRecipe(transformedRecipe)
      setLikesCount(transformedRecipe.likes_count)

      // Check if current user has liked this recipe
      if (user && recipeId) {
        const { data: likeData } = await supabase
          .from('likes')
          .select('id')
          .eq('recipe_id', recipeId)
          .eq('user_id', user.sub)
          .single()

        setIsLiked(!!likeData)
      }
    } catch (error) {
      console.error('Error fetching recipe:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          user:users(id, name, avatar_url)
        `)
        .eq('recipe_id', recipeId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleLike = async () => {
    if (!user) return

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('recipe_id', recipeId)
          .eq('user_id', user.sub)

        if (!error) {
          setIsLiked(false)
          setLikesCount(prev => prev - 1)
        }
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({
            recipe_id: recipeId,
            user_id: user.sub
          })

        if (!error) {
          setIsLiked(true)
          setLikesCount(prev => prev + 1)
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newComment.trim()) return

    setSubmittingComment(true)
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          recipe_id: recipeId,
          user_id: user.sub,
          content: newComment.trim()
        })

      if (!error) {
        setNewComment('')
        fetchComments() // Refresh comments
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setSubmittingComment(false)
    }
  }

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'us': '🇺🇸', 'it': '🇮🇹', 'fr': '🇫🇷', 'jp': '🇯🇵', 'in': '🇮🇳',
      'mx': '🇲🇽', 'th': '🇹🇭', 'cn': '🇨🇳', 'kr': '🇰🇷', 'br': '🇧🇷',
      'es': '🇪🇸', 'gr': '🇬🇷', 'tr': '🇹🇷', 'de': '🇩🇪', 'gb': '🇬🇧',
      'au': '🇦🇺', 'ca': '🇨🇦', 'ru': '🇷🇺', 'other': '🌎'
    }
    return flags[country] || '🌍'
  }

  const getCountryName = (country: string) => {
    const names: { [key: string]: string } = {
      'us': 'United States', 'it': 'Italy', 'fr': 'France', 'jp': 'Japan', 'in': 'India',
      'mx': 'Mexico', 'th': 'Thailand', 'cn': 'China', 'kr': 'South Korea', 'br': 'Brazil',
      'es': 'Spain', 'gr': 'Greece', 'tr': 'Turkey', 'de': 'Germany', 'gb': 'United Kingdom',
      'au': 'Australia', 'ca': 'Canada', 'ru': 'Russia', 'other': 'Other'
    }
    return names[country] || 'Unknown'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} />
        <LoadingSpinner />
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} />
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Recipe not found</h1>
          <p className="text-gray-600">The recipe you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Recipe Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
         
            <div className="relative h-64 md:h-96 w-full">
              <img
                src={recipe.image_url || '/default.jpg'}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>
          
          
          <div className="p-6 md:p-8">
            <div className="flex-1 md:flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
                  {recipe.title}
                </h1>
                <p className="md:text-lg text-gray-600">
                  {recipe.description}
                </p>
                <div className='my-2 text-gray-500 flex items-center'>Best served for {recipe.type} 
                  <p
                className={`w-2 h-2 ml-1 ${
                  recipe.vtype === 'Non-veg' ? 'bg-red-500' : 'bg-green-500'
                }`}
              ></p></div>
              </div>
              
              <div className="flex items-center space-x-2 md:ml-4">
                <button
                  onClick={handleLike}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  {isLiked ? (
                    <HeartSolidIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5 text-gray-600" />
                  )}
                  <span className="font-medium text-black">{likesCount}</span>
                </button>
                
                <button
                onClick={() => setShowPopup(!showPopup)}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <ShareIcon className="h-5 w-5 text-gray-600" />
              </button>

              {showPopup && (
                <div className="absolute top-10 right-10 z-10 bg-white border border-gray-300 rounded-lg shadow-md p-3 w-64">
                  <button onClick={() => setShowPopup(!showPopup)}>
                  <CircleX size={15} className='text-black flex ml-auto'/>
                  </button>
                  <p className="text-sm text-gray-700 break-words">{currentUrl}</p>
                  <button
                    onClick={copyToClipboard}
                    className="mt-2 px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                  >
                    Copy Link
                  </button>
                </div>
              )}
              </div>
            </div>

            {/* Recipe Meta */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center space-x-2 text-gray-600">
                <ClockIcon className="h-5 w-5" />
                <span>{recipe.prep_time + recipe.cook_time} min</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <UserGroupIcon className="h-5 w-5" />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPinIcon className="h-5 w-5" />
                <span className="flex items-center space-x-1">
                  <span>{getCountryFlag(recipe.country)}</span>
                  <span>{getCountryName(recipe.country)}</span>
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <ChatBubbleLeftIcon className="h-5 w-5" />
                <span>{comments.length} comments</span>
              </div>
            </div>

            {/* Author */}
            <div className="flex items-center space-x-3 pb-6 border-b border-gray-200">
              {recipe.user?.avatar_url ? (
                <img
                  src={recipe.user.avatar_url}
                  alt={recipe.user.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {recipe.user?.name === recipe.user?.email ? recipe.user?.name.split('@')[0] : recipe.user?.name.split('@')[0]}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">{recipe.user?.name === recipe.user?.email ? recipe.user?.name.split('@')[0] : recipe.user?.name.split('@')[0]}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(recipe.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ingredients */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-orange-500 mt-1">•</span>
                  <span className="text-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
          
          {/* Add Comment Form */}
          {user ? (
            <form onSubmit={handleComment} className="mb-6">
              <div className="flex space-x-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this recipe..."
                  className="flex-1 p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  rows={3}
                />
                <button
                  type="submit"
                  disabled={submittingComment || !newComment.trim()}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submittingComment ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600 mb-2">Want to join the conversation?</p>
              <a
                href="/api/auth/login"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Sign in to comment
              </a>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3 p-4 bg-gray-50 rounded-lg">
                  {comment.user?.avatar_url ? (
                    <img
                      src={comment.user.avatar_url}
                      alt={comment.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {comment.user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {comment.user?.name || 'Anonymous'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
