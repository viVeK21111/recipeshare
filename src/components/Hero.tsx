'use client'
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0/client'
import { ArrowRightIcon, GlobeAltIcon, HeartIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

export default function Hero() {
  const { user } = useUser()

  return (
    <div
  className="relative bg-cover bg-center"
  style={{ backgroundImage: "url('/flames.jpg')" }}> 
  <div className="absolute inset-0 bg-black opacity-70"></div>
    <div className="relative bg-gradient-to-r ">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Share Your Culinary
            <span className="block text-yellow-300">Masterpieces</span>
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto">
            Discover amazing recipes from around the world and share your own cooking creations with a global community of food lovers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {user ? (
              <Link
                href="/recipes/new"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-orange-600 bg-white hover:bg-gray-50 transition-colors shadow-lg"
              >
                Add Your Recipe
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <Link
                href="/api/auth/login"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-orange-600 bg-white hover:bg-gray-50 transition-colors shadow-lg"
              >
                Get Started
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            )}
            <Link
              href="/recipes"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-lg text-white hover:bg-white hover:text-orange-600 transition-colors"
            >
              Explore Recipes
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-3 rounded-lg"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                <GlobeAltIcon className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-yellow-500 mb-2">Global Recipes</h3>
              <p className="text-orange-100">
                Discover authentic recipes from every corner of the world
              </p>
            </div>
            
            <div className="text-center p-3 rounded-lg"
             style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                <HeartIcon className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-yellow-500 mb-2">Social Features</h3>
              <p className="text-orange-100">
                Like, comment, and share your favorite recipes
              </p>
            </div>
            
            <div className="text-center p-3 rounded-lg"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-yellow-500 mb-2">Community</h3>
              <p className="text-orange-100">
                Connect with fellow food enthusiasts worldwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
