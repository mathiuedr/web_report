// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_USER_ID = '11111111-1111-1111-1111-111111111111'

export function proxy(request: NextRequest) {
  const userId = request.cookies.get('user_id')?.value
  const { pathname } = request.nextUrl

  const adminRoutes = ['/current-requests', '/archive']
  const userRoutes = ['/my-requests', '/new-request']
  const protectedRoutes = [...adminRoutes, ...userRoutes]

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Если не авторизован и пытается зайти на защищенный роут
  if (isProtectedRoute && !userId) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Если не админ и пытается зайти на админский роут
  if (isAdminRoute && userId !== ADMIN_USER_ID) {
    return NextResponse.redirect(new URL('/my-requests', request.url))
  }

  // Если авторизован и пытается зайти на страницу авторизации
  if (pathname === '/auth' && userId) {
    if (userId === ADMIN_USER_ID) {
      return NextResponse.redirect(new URL('/current-requests', request.url))
    } else {
      return NextResponse.redirect(new URL('/my-requests', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/current-requests/:path*',
    '/archive/:path*',
    '/my-requests/:path*',
    '/new-request/:path*',
    '/auth',
  ],
}
