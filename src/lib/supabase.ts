import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
}

export interface Recipe {
  id: string
  title: string
  description: string
  ingredients: string[]
  instructions: string[]
  country: string
  prep_time: number
  cook_time: number
  servings: number
  image_url?: string
  user_id: string
  created_at: string
  updated_at: string
  user?: User
  likes_count: number
  comments_count: number
}

export interface Like {
  id: string
  user_id: string
  recipe_id: string
  created_at: string
}

export interface Comment {
  id: string
  user_id: string
  recipe_id: string
  content: string
  created_at: string
  user?: User
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  created_at: string
  status?: 'new' | 'read' | 'replied'
}

export interface Favorite {
  id: string
  user_id: string
  recipe_id: string
  created_at: string
}

// Helper function to format date with time
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return 'Just now'
  }
  
  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  }
  
  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  }
  
  // Less than a week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  }
  
  // Show full date with time
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}