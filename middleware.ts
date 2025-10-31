import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Set CSP headers to allow WebAssembly and Vercel Live
  response.headers.set(
    'Content-Security-Policy',
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.vercel.live; " +
    "script-src-elem 'self' 'unsafe-inline' https://vercel.live https://*.vercel.live; " +
    "worker-src 'self' blob:;"
  )

  return response
}

export const config = {
  matcher: '/:path*',
}
