'use client'
export const dynamic = 'force-dynamic'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import { SearchIcon,MessageCircleMore } from 'lucide-react'
import { useTheme } from '@/app/context/ThemeContext'
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
  const { theme, toggleTheme } = useTheme()


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
    <header className={!user ? `sticky top-0 z-50 bg-black border-b shadow-sm border-gray-700` : theme === 'dark' ? `sticky top-0 z-50 bg-black border-b shadow-sm border-gray-700 ` : `sticky top-0 z-50 bg-white border-b shadow-sm border-gray-200 `}>
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
          <div className="hidden lg:block ">
            <div className="ml-10 flex items-baseline space-x-4">
              {user && (
                 <Link
                 href="/recipes"
                 className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                   isActive('/recipes') 
                     ? (theme === 'dark' ? 'text-white' : 'text-gray-900') 
                     : (theme === 'dark' ? 'text-gray-500 hover:text-orange-500' : 'text-gray-500 hover:text-orange-600')
                 }`}
               >
                 Home
               </Link>
              )}
             
               {user && (
                <Link
                  href="/best-recipes"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/best-recipes') ? 'text-gray-900' : 'text-gray-500 hover:text-orange-600'
                  }`}
                >
                  Best Recipes
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
          <div className={user ? 'block' : 'ml-auto block'}>
            <div className="ml-6 m-1 flex items-center">
              
            <button
                onClick={toggleTheme}
                className={user ? `p-2 rounded-md focus:outline-none transition-colors mr-2` : `hidden`}
              >
                {theme === 'dark' ? (
                  <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 3v1m0 16v1m9-9h1M3 12h1m15.325-4.243l-.707.707M4.675 19.325l-.707.707M19.325 19.325l-.707-.707M4.675 4.675l-.707-.707"
                    />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
              {user ? (
                <div className="flex items-center space-x-6">
                  <Link
                    href="/recipes/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add <p className='hidden md:flex ml-1'>Recipe</p>
                  </Link>
                

                 
                </div>
              ) : (
                <div className="flex hidden lg:block items-center space-x-4">
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
                    className={`inline-flex items-center md:mr-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md ${theme === 'dark' ? 'text-gray-100 bg-gray-700 hover:bg-gray-600' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'} hover:text-orange-600 transition-colors`}
                  >
                    <SearchIcon className="h-4 w-4 md:mr-2" />
                    <p className="hidden md:block">Search</p>
                  </Link>
                  <Link
                  className='hidden lg:flex items-center hover:text-orange-600 dark:text-gray-600 text-gray-800 p-2'
                    href="/chat"
                  >
                    <MessageCircleMore className=" md:mr-2" />
                  </Link>
              </div>
              <div ref={profileRef}>
             <button
               onClick={() => setProfileOpen(!profileOpen)}
               className="hidden lg:flex items-center hover:cursor-pointer space-x-2 focus:outline-none"
             >
                     {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name || 'User'}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              ) : (
                <img
                  src="/defaultU.png"
                  alt={user?.name || 'User'}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
               <span className={theme === 'dark' ? `text-sm font-medium text-gray-400` : `text-sm font-medium  text-gray-700`}> {user.name === user.email ?  user.name.split('@')[0] : user.name}</span>
             </button>

             {profileOpen && (
               <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <Link href="/profile" className={`block px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-100 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                   Profile
                 </Link>
                 
                 <Link href="/settings" className={`block px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-100 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                   Settings
                 </Link>
                 <Link href="/favorites" className={`block px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-100 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                   Favorites
                 </Link>
                 <Link href="/contact" className={`block px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-100 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                   Contact Us
                 </Link>
                 <a
                   href="/api/auth/logout"
                   className={`block px-4 py-2 text-sm text-red-600 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                 >
                   Logout
                 </a>
               </div>
             )}
           </div>
           </>
          )}
          

          {/* Mobile Menu Button */}
          <div className="lg:hidden ml-auto">
            <button
              type="button"
              className={`${user ? (theme === 'dark' ? 'bg-gray-800' : 'bg-white') : 'bg-black'}  inline-flex items-center justify-center p-2 rounded-md ${theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-400 hover:text-gray-500'} `}
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
  <div className="lg:hidden">
    <div className={`${user ? (theme === 'dark' ? 'bg-gray-800' : 'bg-white') : 'bg-black'} px-2 pt-2 mt-2 pb-3 space-y-1 sm:px-3 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-500'}`}>
    
      {user && (
        <>
          <Link href="/recipes" className={`block px-3 py-2 rounded-md text-base font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-500'}`}>
        Home
      </Link>
         
         
          <Link href="/best-recipes" className={`block px-3 py-2 rounded-md text-base font-medium ${theme === 'dark' ? 'text-gray-300 hover:text-orange-600' : 'text-gray-500 hover:text-orange-600'}`}>
           Best Recipes
          </Link>
          <Link href="/stories" className={`block px-3 py-2 rounded-md text-base font-medium ${theme === 'dark' ? 'text-gray-300 hover:text-orange-600' : 'text-gray-500 hover:text-orange-600'}`}>
           Stories
          </Link>
          <Link href="/chat" className={`block px-3 py-2 rounded-md text-base font-medium ${theme === 'dark' ? 'text-gray-300 hover:text-orange-600' : 'text-gray-500 hover:text-orange-600'}`}>
           Chat
          </Link>

         {/* Profile Toggle Button */}
        <div
          onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
          className="flex items-center px-3 py-2 cursor-pointer"
        >
          {user?.picture ? (
  <img
    src={user.picture}
    alt={user.name || 'User'}
    width={30}
    height={30}
    className="rounded-full"
  />
) : (
  <img
    src="/defaultU.png"
    alt={user?.name || 'User'}
    width={40}
    height={40}
    className="rounded-full"
  />
)}
          <div className="ml-3 flex items-center space-x-1">
            <div>
              <div className={`text-base font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}> {user.name === user.email ?  user.name.split('@')[0] : user.name}</div>
            </div>
            <svg
              className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} transform transition-transform ${
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
        <div className={`mt-2 border-t pt-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
           <Link href="/profile" className={`block px-3 py-2 text-base font-medium ${theme === 'dark' ? 'text-gray-100 hover:text-orange-600' : 'text-gray-500 hover:text-orange-600'}`}>
            Profile
          </Link>
          
          <Link href="/settings" className={`block px-3 py-2 text-base font-medium ${theme === 'dark' ? 'text-gray-100 hover:text-orange-600' : 'text-gray-500 hover:text-orange-600'}`}>
            Settings
          </Link>
          <Link href="/favorites" className={`block px-3 py-2 text-base font-medium ${theme === 'dark' ? 'text-gray-100 hover:text-orange-600' : 'text-gray-500 hover:text-orange-600'}`}>
            Favorites
          </Link>
          <Link href="/contact" className={`block px-3 py-2 text-base font-medium ${theme === 'dark' ? 'text-gray-100 hover:text-orange-600' : 'text-gray-500 hover:text-orange-600'}`}>
            Contact Us
          </Link>
          <a
            href="/api/auth/logout"
            className={`block px-3 py-2 text-base font-medium text-red-600 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
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
          className={`block px-3 py-2 rounded-md text-base font-medium ${theme === 'dark' ? 'text-gray-100 hover:text-orange-600' : 'text-gray-500 hover:text-orange-600'}`}>
          Login
        </a>
          <Link href="/contact" className={`block px-3 py-2 text-base font-medium ${theme === 'dark' ? 'text-gray-100 hover:text-orange-600' : 'text-gray-500 hover:text-orange-600'}`}>
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
