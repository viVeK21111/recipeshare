'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Recipe, supabase, formatDateTime } from '@/lib/supabase'
import { useUser } from '@auth0/nextjs-auth0/client'
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  ClockIcon, 
  UserGroupIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline'
import { 
  HeartIcon as HeartSolidIcon,
  BookmarkIcon as BookmarkSolidIcon
} from '@heroicons/react/24/solid'

interface RecipePostProps {
  recipe: Recipe
}

const COUNTRY_INFO: { [key: string]: { flag: string; name: string } } = {
  'us': { flag: '🇺🇸', name: 'United States' },
  'it': { flag: '🇮🇹', name: 'Italy' },
  'fr': { flag: '🇫🇷', name: 'France' },
  'jp': { flag: '🇯🇵', name: 'Japan' },
  'in': { flag: '🇮🇳', name: 'India' },
  'mx': { flag: '🇲🇽', name: 'Mexico' },
  'th': { flag: '🇹🇭', name: 'Thailand' },
  'cn': { flag: '🇨🇳', name: 'China' },
  'kr': { flag: '🇰🇷', name: 'South Korea' },
  'br': { flag: '🇧🇷', name: 'Brazil' },
  'es': { flag: '🇪🇸', name: 'Spain' },
  'gr': { flag: '🇬🇷', name: 'Greece' },
  'tr': { flag: '🇹🇷', name: 'Turkey' },
  'de': { flag: '🇩🇪', name: 'Germany' },
  'gb': { flag: '🇬🇧', name: 'United Kingdom' },
}

export default function RecipePost({ recipe }: RecipePostProps) {
  const { user } = useUser()
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [likesCount, setLikesCount] = useState(recipe.likes_count || 0)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isProcessingLike, setIsProcessingLike] = useState(false)
  const [isProcessingFavorite, setIsProcessingFavorite] = useState(false)
  const router = useRouter()

  // Check if recipe is liked and favorited on mount
  useEffect(() => {
    if (user) {
      checkIfLiked()
      checkIfFavorited()
    }
  }, [user, recipe.id])

  const checkIfLiked = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.sub)
        .eq('recipe_id', recipe.id)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking like:', error)
        return
      }

      setIsLiked(!!data)
    } catch (error) {
      console.error('Error in checkIfLiked:', error)
    }
  }

  const checkIfFavorited = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.sub)
        .eq('recipe_id', recipe.id)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking favorite:', error)
        return
      }

      setIsFavorited(!!data)
    } catch (error) {
      console.error('Error in checkIfFavorited:', error)
    }
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      window.location.href = '/api/auth/login'
      return
    }

    if (isProcessingLike) return
    setIsProcessingLike(true)

    try {
      if (isLiked) {
        // Unlike: Remove from likes table
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.sub)
          .eq('recipe_id', recipe.id)

        if (error) {
          console.error('Unlike error:', error)
          throw error
        }
        
        setIsLiked(false)
        setLikesCount(prev => Math.max(0, prev - 1))
        console.log('Unliked recipe')
      } else {
        // Like: Add to likes table
        const { data, error } = await supabase
          .from('likes')
          .insert({
            user_id: user.sub,
            recipe_id: recipe.id
          })
          .select()

        if (error) {
          // Check if it's a duplicate error
          if (error.code === '23505') {
            // Already liked - just update UI
            setIsLiked(true)
            console.log('Already liked')
          } else {
            console.error('Like error:', error)
            throw error
          }
        } else {
          setIsLiked(true)
          setLikesCount(prev => prev + 1)
          console.log('Liked recipe')
        }
      }
    } catch (error: any) {
      console.error('Error toggling like:', error)
      
      // Revert UI on error
      setIsLiked(!isLiked)
      
      let errorMessage = 'Failed to update like. '
      if (error.code === '42501') {
        errorMessage += 'Permission denied. Please check your database policies.'
      } else {
        errorMessage += 'Please try again.'
      }
      
      alert(errorMessage)
    } finally {
      setIsProcessingLike(false)
    }
  }

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      window.location.href = '/api/auth/login'
      return
    }

    if (isProcessingFavorite) return
    setIsProcessingFavorite(true)

    try {
      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.sub)
          .eq('recipe_id', recipe.id)

        if (error) {
          console.error('Delete favorite error:', error)
          throw error
        }
        
        setIsFavorited(false)
        console.log('Removed from favorites')
      } else {
        // Add to favorites
        const { data, error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.sub,
            recipe_id: recipe.id
          })
          .select()

        if (error) {
          if (error.code === '23505') {
            setIsFavorited(true)
            console.log('Already favorited')
          } else {
            console.error('Add favorite error:', error)
            throw error
          }
        } else {
          setIsFavorited(true)
          console.log('Added to favorites')
        }
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error)
      
      let errorMessage = 'Failed to update favorites. '
      if (error.code === '42501') {
        errorMessage += 'Permission denied. Please check your database policies.'
      } else if (error.code === '23505') {
        errorMessage += 'This recipe is already in your favorites.'
        setIsFavorited(true)
      } else {
        errorMessage += 'Please try again.'
      }
      
      alert(errorMessage)
    } finally {
      setIsProcessingFavorite(false)
    }
  }

  const countryInfo = COUNTRY_INFO[recipe.country] || { flag: '🌍', name: 'Unknown' }
  const totalTime = recipe.prep_time + recipe.cook_time
  const shouldTruncate = recipe.description && recipe.description.length > 150
  const displayDescription = showFullDescription || !shouldTruncate 
    ? recipe.description 
    : recipe.description.substring(0, 150) + '...'

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (user?.sub === recipe.user_id) {
            router.push('/profile')
          } else {
            router.push(`/profile/${encodeURIComponent(recipe.user_id)}`)
          }
        }}
        className="flex items-center hover:cursor-pointer space-x-3 hover:opacity-80 transition-opacity"
      >
        {recipe.user?.avatar_url ? (
          <Image
            src={recipe.user.avatar_url}
            alt={recipe.user.name}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {recipe.user?.name?.charAt(0) || 'U'}
            </span>
          </div>
        )}
        <div className="text-left">
          <p className="font-semibold text-gray-900">
            {recipe.user?.name || 'Anonymous'}
          </p>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>{countryInfo.flag} {countryInfo.name}</span>
            <span>•</span>
            <span>{formatDateTime(recipe.created_at)}</span>
          </div>
        </div>
      </button>
        
        {/* Favorite Button in Header */}
        <button
          onClick={handleFavorite}
          disabled={isProcessingFavorite}
          className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${
            isProcessingFavorite ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorited ? (
            <BookmarkSolidIcon className="h-6 w-6 text-orange-600" />
          ) : (
            <BookmarkIcon className="h-6 w-6 text-gray-600 hover:text-orange-600" />
          )}
        </button>
      </div>

      {/* Recipe Image */}
      {recipe.image_url ? (
        <div className="w-full h-80 relative">
          <Image
            src={recipe.image_url}
            alt={recipe.title}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-80 bg-gradient-to-br from-orange-100 via-red-50 to-orange-100 flex items-center justify-center">
          <div className="text-8xl">🍽️</div>
        </div>
      )}

      {/* Engagement Bar */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            disabled={isProcessingLike}
            className={`flex items-center space-x-1.5 group ${
              isProcessingLike ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLiked ? (
              <HeartSolidIcon className="h-6 w-6 text-red-500" />
            ) : (
              <HeartIcon className="h-6 w-6 text-gray-600 group-hover:text-red-500 transition-colors" />
            )}
            <span className="text-sm font-medium text-gray-700">{likesCount}</span>
          </button>
          <button className="flex items-center space-x-1.5 group">
            <ChatBubbleLeftIcon className="h-6 w-6 text-gray-600 group-hover:text-blue-500 transition-colors" />
            <span className="text-sm font-medium text-gray-700">
              {recipe.comments_count || 0}
            </span>
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {recipe.title}
        </h3>
        
        <p className="text-gray-700 text-sm mb-3 leading-relaxed">
          {displayDescription}
          {shouldTruncate && !showFullDescription && (
            <button
              onClick={() => setShowFullDescription(true)}
              className="text-orange-600 hover:text-orange-700 font-medium ml-1"
            >
              Read more
            </button>
          )}
        </p>

        {/* Recipe Stats */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-1.5 text-sm text-gray-600">
            <ClockIcon className="h-4 w-4" />
            <span>{totalTime} min</span>
          </div>
          <div className="flex items-center space-x-1.5 text-sm text-gray-600">
            <UserGroupIcon className="h-4 w-4" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>

        {/* View Full Recipe Button */}
        <Link
          href={`/recipes/${recipe.id}`}
          className="block w-full text-center py-2.5 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
        >
          View Full Recipe
        </Link>
      </div>
    </div>
  )
}