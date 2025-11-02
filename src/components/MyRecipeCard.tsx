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
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface MyRecipeCardProps {
  recipe: Recipe
  onDelete: (recipeId: string) => void
}

export default function MyRecipeCard({ recipe, onDelete }: MyRecipeCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(recipe.likes_count || 0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // TODO: Implement like functionality with Supabase
    setIsLiked(!isLiked)
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDeleting(true)
    await onDelete(recipe.id)
  }

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowDeleteConfirm(false)
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
    <>
      <Link href={`/recipes/${recipe.id}`} className="group block">
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 group-hover:border-orange-200 relative">
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

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex space-x-2">
             
              
              <button
                onClick={handleDeleteClick}
                className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2 hover:bg-red-50 hover:bg-opacity-100 transition-all duration-200"
                title="Delete recipe"
              >
                <TrashIcon className="h-5 w-5 text-gray-600 hover:text-red-600" />
              </button>
            </div>
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

            {/* Engagement Stats */}
            <div className="flex items-center justify-between">
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCancelDelete}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete Recipe</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>"{recipe.title}"</strong>? 
              This will permanently remove the recipe and all associated comments and likes.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete Recipe'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}