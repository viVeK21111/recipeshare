'use client'

import Link from 'next/link'
import { useTheme } from '@/app/context/ThemeContext'

export default function NotFound() { 
  const { theme } = useTheme() 
  return ( 
  <div className={`min-h-screen flex items-center justify-center px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}> 
  <div className="text-center"> 
    <h1 className={`text-6xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>404</h1> 
    <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Page Not Found</h2> 
    <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}> Sorry, we couldn't find the page you're looking for. </p>
     <Link href="/" className={`inline-block px-6 py-2 rounded-md font-medium ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`} > Go back home
      </Link> 
      </div> 
      </div> 
      ) 
    }