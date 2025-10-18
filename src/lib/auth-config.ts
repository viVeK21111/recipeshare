// Define which routes require authentication in ONE place
export const AUTH_CONFIG = {
    // Protected routes (require login)
    protectedRoutes: [
      '/recipes',
      '/my-recipes',
      '/profile',
      '/favorites',
      '/settings',
      '/favorites',
      '/profile',
      // Add more protected routes here as needed
    ],
    
    // Redirect to login when not authenticated
    loginUrl: '/api/auth/login',
  }
  
  // Helper function to check if a route is protected
  export function isProtectedRoute(pathname: string): boolean {
    return AUTH_CONFIG.protectedRoutes.some(route => 
      pathname.startsWith(route)
    )
  }
  