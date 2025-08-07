import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get token and remember me status from cookies
  const token = request.cookies.get('token')?.value
  const rememberMe = request.cookies.get('rememberMe')?.value
  
  // Public routes that don't require authentication
  const publicRoutes = ['/auth', '/api/auth/login', '/api/auth/signup']
  
  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // If user is on root path, redirect based on auth status
  if (pathname === '/') {
    if (token && rememberMe === 'true') {
      // User is authenticated and has "Remember Me" enabled
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      // User is not authenticated or didn't check "Remember Me"
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }
  
  // If user is on dashboard or goals page without proper auth, redirect to auth
  if (pathname === '/dashboard' && !token) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }
  
  // If user is on auth page but already authenticated with remember me, redirect to dashboard
  if (pathname === '/auth' && token && rememberMe === 'true') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 