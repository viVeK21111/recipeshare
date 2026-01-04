'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import { supabase, Recipe, User as UserType, getFriendsCount } from '@/lib/supabase'
import Header from '@/components/Header'
import RecipeCard from '@/components/RecipeCard'
import MyRecipeCard from '@/components/MyRecipeCard'
import { 
  PencilIcon,
  MapPinIcon,
  GlobeAltIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@/app/context/ThemeContext'

export default function MyProfilePage() {
  const { user } = useUser()
  const router = useRouter()
  
  const [profileUser, setProfileUser] = useState<UserType | null>(null)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [friends, setFriends] = useState<UserType[]>([])
  const [friendsCount, setFriendsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'recipes' | 'friends'>('recipes')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    bio: '',
    location: '',
    website: ''
  })
  const [pendingRequests, setPendingRequests] = useState<UserType[]>([])
  const { theme } = useTheme()

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


  // Add this inside fetchMyProfile or as a separate function
  const fetchPendingRequests = async () => {
    if (!user) return
   console.log("usersub ",user.sub);
    try {
      // Get pending friend requests WHERE YOU are the friend_id
      const { data: requests } = await supabase
        .from('friendships')
        .select('user_id')
        .eq('friend_id', user.sub)
        .eq('status', 'pending')
        console.log("requests",requests);
      if (requests && requests.length > 0) {
        const userIds = requests.map(r => r.user_id)

        console.log("reqids ",userIds);
        
        const { data: requestUsers } = await supabase
          .from('users')
          .select('*')
          .in('id', userIds)
  
        setPendingRequests(requestUsers || [])
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error)
    }
  }
  useEffect(() => {
    if (user) {
      fetchMyProfile()
      fetchPendingRequests();
    }
  }, [user])
  
  

  const fetchMyProfile = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Fetch user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.sub)
        .single()

      if (userError) throw userError
      setProfileUser(userData)
      setEditForm({
        bio: userData.bio || '',
        location: userData.location || '',
        website: userData.website || ''
      })

      // Fetch user's recipes
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select(`
          *,
          user:users(id, name, avatar_url),
          likes_count:likes(count),
          comments_count:comments(count)
        `)
        .eq('user_id', user.sub)
        .order('created_at', { ascending: false })

      if (recipesError) throw recipesError

      const transformedRecipes = recipesData?.map(recipe => ({
        ...recipe,
        likes_count: recipe.likes_count?.[0]?.count || 0,
        comments_count: recipe.comments_count?.[0]?.count || 0,
      })) || []

    //  console.log("recipes ",transformedRecipes)

      setRecipes(transformedRecipes)

      // Fetch friends
      await fetchFriends()
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFriends = async () => {
    if (!user) return

    try {
      // Get friendships where user is user_id
      const { data: sentFriendships } = await supabase
        .from('friendships')
        .select('friend_id')
        .eq('user_id', user.sub)
        .eq('status', 'accepted')

      // Get friendships where user is friend_id
      const { data: receivedFriendships } = await supabase
        .from('friendships')
        .select('user_id')
        .eq('friend_id', user.sub)
        .eq('status', 'accepted')

      const friendIds = [
        ...(sentFriendships?.map(f => f.friend_id) || []),
        ...(receivedFriendships?.map(f => f.user_id) || [])
      ]

      setFriendsCount(friendIds.length)

      if (friendIds.length > 0) {
        const { data: friendsData } = await supabase
          .from('users')
          .select('*')
          .in('id', friendIds)

        setFriends(friendsData || [])
      }
    } catch (error) {
      console.error('Error fetching friends:', error)
    }
  }

  const handleUpdateProfile = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('users')
        .update({
          bio: editForm.bio,
          location: editForm.location,
          website: editForm.website
        })
        .eq('id', user.sub)

      if (error) throw error

      setProfileUser(prev => prev ? {
        ...prev,
        bio: editForm.bio,
        location: editForm.location,
        website: editForm.website
      } : null)

      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header user={user} />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header user={user} />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Profile not found</h2>
        </div>
      </div>
    )
  }
  
  const handleAcceptRequest = async (requesterId: string) => {
    if (!user) return
  
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('user_id', requesterId)
        .eq('friend_id', user.sub)
  
      if (error) throw error
  
      // Immediately remove from pending requests UI
      setPendingRequests(prev => prev.filter(req => req.id !== requesterId))
      
      // Refresh data in background
      fetchPendingRequests()
      fetchFriends()
      
      alert('Friend request accepted!')
    } catch (error) {
      console.error('Error accepting request:', error)
      alert('Failed to accept request. Please try again.')
    }
  }
  
  const handleRejectRequest = async (requesterId: string) => {
    if (!user) return
  
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('user_id', requesterId)
        .eq('friend_id', user.sub)
  
      if (error) throw error
  
      // Immediately remove from pending requests UI
      setPendingRequests(prev => prev.filter(req => req.id !== requesterId))
      
      // Refresh data in background
      fetchPendingRequests()
      
      alert('Friend request declined.')
    } catch (error) {
      console.error('Error rejecting request:', error)
      alert('Failed to decline request. Please try again.')
    }
  }
  
  

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header user={user} />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className={`rounded-xl shadow-sm border p-6 mb-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="md:flex items-start justify-between mb-6">
            <div className="flex items-center space-x-6">
             {/* Profile Header */}
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
              
              <div>
                <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  {profileUser.name === profileUser.email ?  profileUser.name.split('@')[0] : profileUser.name}
                </h1>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{profileUser.email}</p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center space-x-2 px-4 mt-2 md:mt-0 py-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-700 text-gray-100 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <PencilIcon className="h-4 w-4" />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Edit Form */}
          {isEditing ? (
            <div className={`space-y-4 border-t pt-6 ${theme === 'dark' ? 'border-gray-700' : ''}`}>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Bio
                </label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400' : 'text-black border-gray-300'}`}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Location
                </label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400' : 'text-black border-gray-300'}`}
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Website
                </label>
                <input
                  type="url"
                  value={editForm.website}
                  onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400' : 'text-black border-gray-300'}`}
                  placeholder="https://example.com"
                />
              </div>

              <button
                onClick={handleUpdateProfile}
                className="px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <>
              {profileUser.bio && (
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                  {profileUser.bio}
                </p>
              )}

              <div className={`flex items-center space-x-6 text-sm mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
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
              <div className="flex items-center space-x-6">
                <div>
                  <span className={`font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{recipes.length}</span>
                  <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} ml-1`}>Recipes</span>
                </div>
                <div>
                  <span className={`font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{friendsCount}</span>
                  <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} ml-1`}>Friends</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Friend Requests Section */}
{pendingRequests.length > 0 && (
  <div className={`rounded-xl shadow-sm border p-6 mb-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
    <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
      Friend Requests ({pendingRequests.length})
    </h2>
    <div className="space-y-3">
      {pendingRequests.map((requester) => (
        <div
          key={requester.id}
          className={`flex items-center justify-between p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
        >
          <div className="flex items-center space-x-3">
           {/* In Friends List */}
          {requester.avatar_url ? (
            <img
              src={requester.avatar_url}
              alt={requester.name}
              width={60}
              height={60}
              className="rounded-full"
            />
          ) : (
            <img
              src="/defaultU.png"
              alt={requester.name}
              width={60}
              height={60}
              className="rounded-full"
            />
          )}
            <div>
              <p className={`font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}> {requester.name === requester.email ?  requester.name.split('@')[0] : requester.name}</p>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>wants to be friends</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleAcceptRequest(requester.id)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Accept
            </button>
            <button
              onClick={() => handleRejectRequest(requester.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-700 text-gray-100 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

        {/* Tabs */}
        <div className={`flex border-b mb-6 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={() => setActiveTab('recipes')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'recipes'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : (theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900')
            }`}
          >
            Recipes ({recipes.length})
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'friends'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : (theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900')
            }`}
          >
            Friends ({friendsCount})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'recipes' && (
          <div>
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
              <div className={`text-center py-12 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-500'}`}>
                <p className="mb-4">No recipes yet</p>
                <Link
                  href="/recipes/new"
                  className="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Create Your First Recipe
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'friends' && (
          <div>
            {friends.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {friends.map((friend) => (
                  <Link
                    key={friend.id}
                    href={`/profile/${friend.id}`}
                    className={`block rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                  >
                    <div className="flex items-center space-x-4">
                      {/* In Friends List */}
                  {friend.avatar_url ? (
                    <img
                      src={friend.avatar_url}
                      alt={friend.name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                  ) : (
                    <img
                      src="/defaultU.png"
                      alt={friend.name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                  )}
                      <div>
                        <h3 className={`font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}> {friend.name === friend.email ?  friend.name.split('@')[0] : friend.name}</h3>
                        {friend.bio && (
                          <p className={`text-sm line-clamp-2 mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            {friend.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={`text-center py-12 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-500'}`}>
                <UserGroupIcon className={`h-16 w-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className="mb-4">No friends yet</p>
                <Link
                  href="/recipes"
                  className="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Discover Recipes
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
