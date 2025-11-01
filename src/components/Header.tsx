'use client'
export const dynamic = 'force-dynamic'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import { SearchIcon } from 'lucide-react'
import {
  Bars3Icon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

interface HeaderProps {
  user: any
}

export default function Header({ user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false)


  const isActive = (href: string) => pathname === href

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className={user ? `bg-white border-b shadow-sm border-gray-200` : `bg-black`}>
      <nav className="max-w-full px-6">
        <div className="flex  items-center h-16">

          {/* Logo */}
          <div className="flex-shrink-0 items-center">
            <Link href="/" className="flex items-center">
              <div className="  items-center">
                <img src={'/logo.png'} className='w-6 md:w-7 ml-5 mt-2' ></img>
                <img src={'/title.png'} className=' h-4'></img>
              </div>
             
              
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block ">
            <div className="ml-10 flex items-baseline space-x-4">
              {user && (
                 <Link
                 href="/recipes"
                 className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                   isActive('/recipes') ? 'text-gray-900' : 'text-gray-500 hover:text-orange-600'
                 }`}
               >
                 Home
               </Link>
              )}
              {user && (
                <Link
                  href="/my-recipes"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/my-recipes') ? 'text-gray-900' : 'text-gray-500 hover:text-orange-600'
                  }`}
                >
                  My Recipes
                </Link>
              )}
               {user && (
                <Link
                  href="/favorites"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/favorites') ? 'text-gray-900' : 'text-gray-500 hover:text-orange-600'
                  }`}
                >
                  Favorites
                </Link>
              )}
                {user && (
                <Link
                  href="/stories"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/stories') ? 'text-gray-900' : 'text-gray-500 hover:text-orange-600'
                  }`}
                >
                  Stories
                </Link>
              )}
            </div>
          </div>

          {/* User Menu */}
          <div className="block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/recipes/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Recipe
                  </Link>
                

                 
                </div>
              ) : (
                <div className="flex hidden md:block items-center space-x-4">
                  <a
                    href="/api/auth/login"
                    className="text-gray-400 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Login
                  </a>

                 <Link href="/contact" className=" px-4 py-2 text-sm text-gray-400 hover:text-orange-600">
                   Contact Us
                 </Link>
                </div>
              )}
            </div>
          </div>

          {user && (
          <>
             <div className="flex relative ml-auto" >
                <Link
                    href="/search"
                    className="inline-flex items-center mr-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-black bg-gray-300 hover:bg-gray-400 transition-colors"
                  >
                    <SearchIcon className="h-4 w-4 md:mr-2" />
                    <p className="hidden md:block">Search</p>
                  </Link>
              </div>
              <div ref={profileRef}>
             <button
               onClick={() => setProfileOpen(!profileOpen)}
               className="hidden md:flex items-center hover:cursor-pointer space-x-2 focus:outline-none"
             >
               <img
                 className="h-8 w-8 rounded-full"
                 src={user.picture || '/default-avatar.png'}
                 alt={user.name}
               />
               <span className="text-sm font-medium text-gray-700">{user.name}</span>
             </button>

             {profileOpen && (
               <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                   Profile
                 </Link>
                 <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                   Settings
                 </Link>
                 <Link href="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                   Contact Us
                 </Link>
                 <a
                   href="/api/auth/logout"
                   className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                 >
                   Logout
                 </a>
               </div>
             )}
           </div>
           </>
          )}
          

          {/* Mobile Menu Button */}
          <div className="md:hidden ml-auto">
            <button
              type="button"
              className={`${user ? 'bg-white' : 'bg-black'}  inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 `}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
  <div className="md:hidden">
    <div className={`${user ? 'bg-white' : 'bg-black'} px-2 pt-2 mt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-500`}>
    
      {user && (
        <>
          <Link href="/recipes" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500">
        Home
      </Link>
          <Link href="/my-recipes" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-orange-600">
            My Recipes
          </Link>
         
          <Link href="/favorites" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-orange-600">
           Favorites
          </Link>
          <Link href="/stories" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-orange-600">
           Stories
          </Link>

         {/* Profile Toggle Button */}
        <div
          onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
          className="flex items-center px-3 py-2 cursor-pointer"
        >
          <img
            className="h-8 w-8 rounded-full"
            src={user.picture || '/default-avatar.png'}
            alt={user.name}
          />
          <div className="ml-3 flex items-center space-x-1">
            <div>
              <div className="text-base font-medium text-gray-800">{user.name}</div>
            </div>
            <svg
              className={`h-4 w-4 text-gray-500 transform transition-transform ${
                mobileProfileOpen ? 'rotate-180' : 'rotate-0'
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {mobileProfileOpen && (
        <div className="mt-2 border-t border-gray-200 pt-2">
           <Link href="/profile" className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-orange-600">
            Profile
          </Link>
          <Link href="/settings" className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-orange-600">
            Settings
          </Link>
          <Link href="/contact" className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-orange-600">
            Contact Us
          </Link>
          <a
            href="/api/auth/logout"
            className="block px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-100"
          >
            Logout
          </a>
        </div>
      )}


        </>
      )}
      {!user && (
        <>
        <a
          href="/api/auth/login"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-orange-600"
        >
          Login
        </a>
          <Link href="/contact" className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-orange-600">
          Contact Us
        </Link>
        </>
        
      )}
    
    </div>
  </div>
)}

      </nav>
    </header>
  )
}
