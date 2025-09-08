import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const isDashboard = req.nextUrl.pathname.startsWith('/courses') || req.nextUrl.pathname.startsWith('/journals') || req.nextUrl.pathname.startsWith('/skilltree') || req.nextUrl.pathname.startsWith('/insights') || req.nextUrl.pathname.startsWith('/profile') ||req.nextUrl.pathname.startsWith('/logout') || req.nextUrl.pathname.startsWith('/onboarding') || req.nextUrl.pathname.startsWith('/dashboard') 

  if (isDashboard && !token) {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Optionally scope it
export const config = {
  matcher: ['/dashboard/:path*', '/courses/:path*', '/journals/:path*', '/skilltree/:path*', '/insights/:path*', '/profile/:path*', '/logout/:path*', '/onboarding/:path*'],
}
