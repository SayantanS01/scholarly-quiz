import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'
import { cookies } from 'next/headers'

// 1. Specify protected and public routes
const protectedRoutes = ['/admin', '/teacher', '/student']
const publicRoutes = ['/login', '/signup', '/']

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
  const isPublicRoute = publicRoutes.includes(path)

  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // 5. Redirect to role-specific dashboard if the user is authenticated
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith('/admin') &&
    !req.nextUrl.pathname.startsWith('/teacher') &&
    !req.nextUrl.pathname.startsWith('/student')
  ) {
    const role = session.role as string
    const dashboard = {
      ADMIN: '/admin',
      TEACHER: '/teacher',
      STUDENT: '/student',
    }[role] || '/'
    
    if (path !== dashboard) {
      return NextResponse.redirect(new URL(dashboard, req.nextUrl))
    }
  }

  // 6. Role-based authorization
  if (path.startsWith('/admin') && session?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }
  if (path.startsWith('/teacher') && session?.role !== 'TEACHER' && session?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }
  if (path.startsWith('/student') && session?.role !== 'STUDENT') {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
