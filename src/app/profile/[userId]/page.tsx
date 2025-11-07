'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import { supabase, Recipe, User, getFriendshipStatus, getFriendsCount } from '@/lib/supabase'
import Header from '@/components/Header'
import RecipeCard from '@/components/RecipeCard'
import { 
  UserPlusIcon, 
  UserMinusIcon, 
  ClockIcon,
  MapPinIcon,
  GlobeAltIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useTheme } from '@/app/context/ThemeContext'

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user: currentUser } = useUser()
  const userId = (params?.userId ?? '') as string
  if (!userId) {
    return <div>Invalid profile</div>
  }
  const isOwnProfile = currentUser?.sub === userId
  useEffect(() => {
    if (isOwnProfile) {
      router.push('/profile')
      return
    }
    fetchUserProfile()
  }, [userId, currentUser])

  const [profileUser, setProfileUser] = useState<User | null>(null)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [friendsCount, setFriendsCount] = useState(0)
  const [friendshipStatus, setFriendshipStatus] = useState<'none' | 'pending_sent' | 'pending_received' | 'friends'>('none')
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState<'recipes'>('recipes')
  const { theme } = useTheme()

  

 

  const fetchUserProfile = async () => {
    try {
      setLoading(true)

      // Fetch user profile
      const decodedUserId = decodeURIComponent(userId)

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', decodedUserId)
        .single()

      if (userError) throw userError
      setProfileUser(userData)

      // Fetch user's recipes
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select(`
          *,
          user:users(id, name, avatar_url),
          likes_count:likes(count),
          comments_count:comments(count)
        `)
        .eq('user_id', decodedUserId)
        .order('created_at', { ascending: false })

      if (recipesError) throw recipesError

      
      console.log("recipess ",recipesData);
      const transformedRecipes = recipesData?.map(recipe => ({
        ...recipe,
        likes_count: recipe.likes_count?.[0]?.count || 0,
        comments_count: recipe.comments_count?.[0]?.count || 0,
      })) || []

      
      

      setRecipes(transformedRecipes)

      // Get friends count
      const count = await getFriendsCount(decodedUserId)
      setFriendsCount(count)

      // Get friendship status
      if (currentUser) {
        const status = await getFriendshipStatus(currentUser.sub!, decodedUserId)
        setFriendshipStatus(status)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFriendAction = async () => {
    if (!currentUser) {
      router.push('/api/auth/login')
      return
    }
    const decodedUserId = decodeURIComponent(userId)
    setIsProcessing(true)

    try {
      if (friendshipStatus === 'none') {
        // Send friend request
        const { error } = await supabase
          .from('friendships')
          .insert({
            user_id: currentUser.sub,
            friend_id: decodedUserId,
            status: 'pending'
          })

        if (error) throw error
        setFriendshipStatus('pending_sent')
      } else if (friendshipStatus === 'pending_received') {
        // Accept friend request
        const { error } = await supabase
          .from('friendships')
          .update({ status: 'accepted' })
          .eq('user_id', decodedUserId)
          .eq('friend_id', currentUser.sub)

        if (error) throw error
        setFriendshipStatus('friends')
        setFriendsCount(prev => prev + 1)
      } else if (friendshipStatus === 'friends' || friendshipStatus === 'pending_sent') {
        // Remove friendship
        await supabase
          .from('friendships')
          .delete()
          .or(`and(user_id.eq.${currentUser.sub},friend_id.eq.${userId}),and(user_id.eq.${userId},friend_id.eq.${currentUser.sub})`)

        setFriendshipStatus('none')
        if (friendshipStatus === 'friends') {
          setFriendsCount(prev => Math.max(0, prev - 1))
        }
      }
    } catch (error) {
      console.error('Error handling friend action:', error)
      alert('Failed to update friendship. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const getFriendButtonText = () => {
    switch (friendshipStatus) {
      case 'none':
        return 'Add Friend'
      case 'pending_sent':
        return 'Request Sent'
      case 'pending_received':
        return 'Accept Request'
      case 'friends':
        return 'Friends'
      default:
        return 'Add Friend'
    }
  }

  const getFriendButtonIcon = () => {
    switch (friendshipStatus) {
      case 'friends':
        return <CheckIcon className="h-5 w-5" />
      case 'pending_sent':
        return <ClockIcon className="h-5 w-5" />
      case 'pending_received':
        return <UserPlusIcon className="h-5 w-5" />
      default:
        return <UserPlusIcon className="h-5 w-5" />
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header user={currentUser} />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header user={currentUser} />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>User not found</h2>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header user={currentUser} />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className={`rounded-xl shadow-sm border p-6 mb-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-start justify-between">
            <div className="md:flex items-center space-x-6">
            {profileUser.avatar_url ? (
                <img
                  src={profileUser.avatar_url}
                  alt={profileUser.name}
                  width={120}
                  height={120}
                  className="rounded-full"
                />
              ) : (
                <img
                  src="/defaultU.png"
                  alt={profileUser.name}
                  width={120}
                  height={120}
                  className="rounded-full"
                />
              )}
              
              <div className="flex-1">
                <h1 className={`text-2xl md:text-3xl mt-2 md:mt-0 font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                {profileUser.name === profileUser.email ?  profileUser.name.split('@')[0] : profileUser.name}
                </h1>
                
                {profileUser.bio && (
                  <p className={`mb-4 max-w-2xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {profileUser.bio}
                  </p>
                )}

                <div className={`flex items-center space-x-6 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {profileUser.location && (
                    <div className="flex items-center space-x-1">
                      <MapPinIcon className="h-4 w-4" />
                      <span>{profileUser.location}</span>
                    </div>
                  )}
                  {profileUser.website && (
                    <a
                      href={profileUser.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 hover:text-orange-600"
                    >
                      <GlobeAltIcon className="h-4 w-4" />
                      <span>Website</span>
                    </a>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-6 mt-4">
                  <div>
                    <span className={`font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{recipes.length}</span>
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} ml-1`}>Recipes</span>
                  </div>
                  <div>
                    <span className={`font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{friendsCount}</span>
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} ml-1`}>Friends</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Friend Button */}
            {currentUser && !isOwnProfile && (
              <button
                onClick={handleFriendAction}
                disabled={isProcessing}
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg font-semibold transition-colors ${
                  friendshipStatus === 'friends'
                    ? (theme === 'dark' ? 'bg-gray-700 text-gray-100 hover:bg-red-600 hover:text-white' : 'bg-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600')
                    : friendshipStatus === 'pending_sent'
                    ? (theme === 'dark' ? 'bg-gray-700 text-gray-100 cursor-not-allowed' : 'bg-gray-200 text-gray-700 cursor-not-allowed')
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {getFriendButtonIcon()}
                <span>{getFriendButtonText()}</span>
              </button>
            )}
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="mb-6">
          <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Recipes</h2>
          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className={`text-center py-12 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-500'}`}>
              <p>No recipes yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}