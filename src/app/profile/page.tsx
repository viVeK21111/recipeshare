'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import { supabase, Recipe, User as UserType, getFriendsCount } from '@/lib/supabase'
import Header from '@/components/Header'
import RecipeCard from '@/components/RecipeCard'
import { 
  PencilIcon,
  MapPinIcon,
  GlobeAltIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'

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
      <div className="min-h-screen bg-gray-50">
        <Header user={user} />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h2>
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
  
      // Refresh data
      await fetchPendingRequests()
      await fetchFriends()
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
  
      // Refresh data
      await fetchPendingRequests()
      await fetchFriends()
      alert('Friend request declined.')
    } catch (error) {
      console.error('Error rejecting request:', error)
      alert('Failed to decline request. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="md:flex items-start justify-between mb-6">
            <div className="flex items-center space-x-6">
              {profileUser.avatar_url ? (
                <Image
                  src={profileUser.avatar_url}
                  alt={profileUser.name}
                  width={120}
                  height={120}
                  className="rounded-full"
                />
              ) : (
                <div className="w-28 h-28 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-4xl">
                    {profileUser.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {profileUser.name}
                </h1>
                <p className="text-gray-600">{profileUser.email}</p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 px-4 mt-2 md:mt-0 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <PencilIcon className="h-4 w-4" />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Edit Form */}
          {isEditing ? (
            <div className="space-y-4 border-t pt-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={editForm.website}
                  onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                <p className="text-gray-700 mb-4">
                  {profileUser.bio}
                </p>
              )}

              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
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
                  <span className="font-bold text-gray-900">{recipes.length}</span>
                  <span className="text-gray-600 ml-1">Recipes</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900">{friendsCount}</span>
                  <span className="text-gray-600 ml-1">Friends</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Friend Requests Section */}
{pendingRequests.length > 0 && (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">
      Friend Requests ({pendingRequests.length})
    </h2>
    <div className="space-y-3">
      {pendingRequests.map((requester) => (
        <div
          key={requester.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            {requester.avatar_url ? (
              <Image
                src={requester.avatar_url}
                alt={requester.name}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {requester.name?.charAt(0) || 'U'}
                </span>
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900">{requester.name}</p>
              <p className="text-sm text-gray-600">wants to be friends</p>
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
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('recipes')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'recipes'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Recipes ({recipes.length})
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'friends'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-900'
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
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500 mb-4">No recipes yet</p>
                <Link
                  href="/recipes/create"
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
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      {friend.avatar_url ? (
                        <Image
                          src={friend.avatar_url}
                          alt={friend.name}
                          width={60}
                          height={60}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xl">
                            {friend.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">{friend.name}</h3>
                        {friend.bio && (
                          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                            {friend.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No friends yet</p>
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
