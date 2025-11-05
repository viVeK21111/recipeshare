'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import { supabase, Recipe, User as UserType } from '@/lib/supabase'
import Header from '@/components/Header'
import { 
  MagnifyingGlassIcon,
  UserIcon,
  DocumentTextIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'

type SearchType = 'users' | 'recipes'

export default function SearchPage() {
  const { user } = useUser()
  const router = useRouter()
  
  const [searchType, setSearchType] = useState<SearchType>(() => {
    if (typeof window !== 'undefined') {
      return (sessionStorage.getItem('searchType') as SearchType) || 'recipes'
    }
    return 'recipes'
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<{
    users: UserType[]
    recipes: Recipe[]
  }>({
    users: [],
    recipes: []
  })
  const [isSearching, setIsSearching] = useState(false)

  // Debounced search
  useEffect(() => {
    sessionStorage.setItem('searchType', searchType)
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        handleSearch()
      } else {
        setSearchResults({ users: [], recipes: [] })
      }
    }, 300) // Wait 300ms after user stops typing

    return () => clearTimeout(timer)
  }, [searchQuery, searchType])

  const handleSearch = async () => {
    if (searchQuery.length < 2) return

    setIsSearching(true)

    try {
      if (searchType === 'users') {
        // Search users by name
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*')
          .ilike('name', `%${searchQuery}%`)
          .limit(20)

        if (usersError) throw usersError

        setSearchResults({
          users: usersData || [],
          recipes: []
        })
      } else {
        // Search recipes by title
        const { data: recipesData, error: recipesError } = await supabase
          .from('recipes')
          .select(`
            *,
            user:users(id, name, avatar_url),
            likes_count:likes(count),
            comments_count:comments(count)
          `)
          .ilike('title', `%${searchQuery}%`)
          .order('created_at', { ascending: false })
          .limit(20)

        if (recipesError) throw recipesError

        const transformedRecipes = recipesData?.map(recipe => ({
          ...recipe,
          likes_count: recipe.likes_count?.[0]?.count || 0,
          comments_count: recipe.comments_count?.[0]?.count || 0,
        })) || []

        setSearchResults({
          users: [],
          recipes: transformedRecipes
        })
      }
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search</h1>
          <p className="text-gray-600">Find recipes and connect with other food lovers</p>
        </div>

        {/* Search Type Tabs */}
        <div className="flex space-x-2 mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
          <button
            onClick={() => {
              setSearchType('recipes')
              setSearchResults({ users: [], recipes: [] })
            }}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all ${
              searchType === 'recipes'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <DocumentTextIcon className="h-5 w-5" />
            <span>Recipes</span>
          </button>
          <button
            onClick={() => {
              setSearchType('users')
              setSearchResults({ users: [], recipes: [] })
            }}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all ${
              searchType === 'users'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <UserIcon className="h-5 w-5" />
            <span>Users</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchType === 'recipes' ? 'Search recipes...' : 'Search users...'}
            className="w-full pl-12 pr-4 py-4 text-black text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm"
          />
          {isSearching && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-orange-600 border-t-transparent"></div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchQuery.length < 2 ? (
          <div className="text-center py-20">
            <MagnifyingGlassIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              Type at least 2 characters to start searching {searchType}
            </p>
          </div>
        ) : (
          <>
            {/* Users Results */}
            {searchType === 'users' && (
              <div className="space-y-3">
                {searchResults.users.length > 0 ? (
                  <>
                    <p className="text-sm text-gray-600 mb-4">
                      Found {searchResults.users.length} user{searchResults.users.length !== 1 ? 's' : ''}
                    </p>
                    {searchResults.users.map((foundUser) => (
                      <Link
                        key={foundUser.id}
                        href={`/profile/${foundUser.id}`}
                        className="block bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-orange-300 transition-all"
                      >
                        <div className="flex items-center space-x-4">
                          {foundUser.avatar_url ? (
                            <Image
                              src={foundUser.avatar_url}
                              alt={foundUser.name}
                              width={60}
                              height={60}
                              className="rounded-full"
                            />
                          ) : (
                            <Image
                              src="/defaultu.jpg"
                              alt={foundUser.name}
                              width={60}
                              height={60}
                              className="rounded-full"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {foundUser.name}
                            </h3>
                            <p className="text-sm text-gray-600">{foundUser.email}</p>
                            {foundUser.bio && (
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {foundUser.bio}
                              </p>
                            )}
                          </div>
                          <div className="text-gray-400">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </>
                ) : (
                  !isSearching && (
                    <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                      <UserIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        No users found matching "{searchQuery}"
                      </p>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Recipes Results */}
            {searchType === 'recipes' && (
              <div className="space-y-3">
                {searchResults.recipes.length > 0 ? (
                  <>
                    <p className="text-sm text-gray-600 mb-4">
                      Found {searchResults.recipes.length} recipe{searchResults.recipes.length !== 1 ? 's' : ''}
                    </p>
                    {searchResults.recipes.map((recipe) => (
                      <Link
                        key={recipe.id}
                        href={`/recipes/${recipe.id}`}
                        className="block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-orange-300 transition-all"
                      >
                        <div className="flex">
                          {/* Recipe Image */}
                          <div className="w-32 h-32 flex-shrink-0 relative">
                            <Image
                              src={recipe.image_url || '/default.jpg'}
                              alt={recipe.title}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Recipe Info */}
                          <div className="flex-1 p-4">
                            <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
                              {recipe.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {recipe.description}
                            </p>

                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <ClockIcon className="h-4 w-4" />
                                <span>{recipe.prep_time + recipe.cook_time} min</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <UserGroupIcon className="h-4 w-4" />
                                <span>{recipe.servings} servings</span>
                              </div>
                            </div>

                            {/* Author */}
                            <div className="flex items-center space-x-2 mt-3">
                              {recipe.user?.avatar_url ? (
                                <Image
                                  src={recipe.user.avatar_url}
                                  alt={recipe.user.name}
                                  width={24}
                                  height={24}
                                  className="rounded-full"
                                />
                              ) : (
                                <Image
                                  src="/defaultu.jpg"
                                  alt={recipe.user?.name || 'User'}
                                  width={24}
                                  height={24}
                                  className="rounded-full"
                                />
                              )}
                              <span className="text-sm text-gray-600">
                                by {recipe.user?.name || 'Anonymous'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center pr-4">
                            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </>
                ) : (
                  !isSearching && (
                    <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                      <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        No recipes found matching "{searchQuery}"
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
