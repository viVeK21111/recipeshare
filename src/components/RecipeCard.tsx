'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Recipe } from '@/lib/supabase'
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  ClockIcon, 
  UserGroupIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface RecipeCardProps {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(recipe.likes_count || 0)

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // TODO: Implement like functionality with Supabase
    setIsLiked(!isLiked)
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'us': '🇺🇸',
      'it': '🇮🇹',
      'fr': '🇫🇷',
      'jp': '🇯🇵',
      'in': '🇮🇳',
      'mx': '🇲🇽',
      'th': '🇹🇭',
      'cn': '🇨🇳',
      'kr': '🇰🇷',
      'br': '🇧🇷',
      'es': '🇪🇸',
      'gr': '🇬🇷',
      'tr': '🇹🇷',
      'de': '🇩🇪',
      'gb': '🇬🇧',
      'au': '🇦🇺',
      'ca': '🇨🇦',
      'ru': '🇷🇺',
      'other': '🌎'
    }
    return flags[country] || '🌍'
  }

  const getCountryName = (country: string) => {
    const names: { [key: string]: string } = {
      'us': 'United States',
      'it': 'Italy',
      'fr': 'France',
      'jp': 'Japan',
      'in': 'India',
      'mx': 'Mexico',
      'th': 'Thailand',
      'cn': 'China',
      'kr': 'South Korea',
      'br': 'Brazil',
      'es': 'Spain',
      'gr': 'Greece',
      'tr': 'Turkey',
      'de': 'Germany',
      'gb': 'United Kingdom',
      'au': 'Australia',
      'ca': 'Canada',
      'ru': 'Russia',
      'other': 'Other'
    }
    return names[country] || 'Unknown'
  }

  return (
    <Link href={`/recipes/${recipe.id}`} className="group">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 group-hover:border-orange-200">
        {/* Recipe Image */}
        <div className="relative h-48 w-full overflow-hidden">
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
            <div className="w-full h-80 relative">
              <Image
                src="/default.jpg"
                alt={recipe.title}
                fill
                className="object-cover"
              />
            </div>
          )}
                    
          {/* Country Badge */}
          <div className="absolute top-3 left-3 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 text-sm font-medium text-gray-700">
            <span className="text-lg">{getCountryFlag(recipe.country)}</span>
            <span>{getCountryName(recipe.country)}</span>
          </div>

          {/* Like Button */}
          <button
            onClick={handleLike}
            className="absolute top-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2 hover:bg-opacity-100 transition-all duration-200"
          >
            {isLiked ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500" />
            )}
          </button>
        </div>

        {/* Recipe Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {recipe.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {recipe.description}
          </p>

          {/* Recipe Stats */}
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-1">
              <ClockIcon className="h-4 w-4" />
              <span>{recipe.prep_time + recipe.cook_time} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <UserGroupIcon className="h-4 w-4" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>

          {/* Author and Engagement */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {recipe.user?.avatar_url ? (
                <Image
                  src={recipe.user.avatar_url}
                  alt={recipe.user.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {recipe.user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <span className="text-sm font-medium text-gray-700">
                {recipe.user?.name || 'Anonymous'}
              </span>
            </div>

            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <HeartIcon className="h-4 w-4" />
                <span>{likesCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ChatBubbleLeftIcon className="h-4 w-4" />
                <span>{recipe.comments_count || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
