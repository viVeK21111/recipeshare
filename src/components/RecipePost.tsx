'use client'

import { useState, useEffect } from 'react'
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

  // Check if recipe is favorited on mount
  useEffect(() => {
    if (user) {
      checkIfFavorited()
    }
  }, [user, recipe.id])

  const checkIfFavorited = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.sub)
        .eq('recipe_id', recipe.id)
        .single()

      if (data) {
        setIsFavorited(true)
      }
    } catch (error) {
      // Not favorited
      setIsFavorited(false)
    }
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      window.location.href = '/api/auth/login'
      return
    }
    
    // TODO: Implement like functionality with Supabase
    setIsLiked(!isLiked)
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      window.location.href = '/api/auth/login'
      return
    }

    try {
      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.sub)
          .eq('recipe_id', recipe.id)

        if (error) throw error
        setIsFavorited(false)
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert([
            {
              user_id: user.sub,
              recipe_id: recipe.id
            }
          ])

        if (error) throw error
        setIsFavorited(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert('Failed to update favorites. Please try again.')
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
        <div className="flex items-center space-x-3">
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
          <div>
            <p className="font-semibold text-gray-900">
              {recipe.user?.name || 'Anonymous'}
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>{countryInfo.flag} {countryInfo.name}</span>
              <span>•</span>
              <span>{formatDateTime(recipe.created_at)}</span>
            </div>
          </div>
        </div>
        
      
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
            className="flex items-center space-x-1.5 group"
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
          {/* Favorite Button*/}
          <button
          onClick={handleFavorite}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorited ? (
            <BookmarkSolidIcon className="h-6 w-6 text-orange-600" />
          ) : (
            <BookmarkIcon className="h-6 w-6 text-gray-600 hover:text-orange-600" />
          )}
        </button>
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