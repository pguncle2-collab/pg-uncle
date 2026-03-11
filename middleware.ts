import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Add cache control headers to prevent stale auth state
  supabaseResponse.headers.set('Cache-Control', 'no-store, must-revalidate')
  supabaseResponse.headers.set('Pragma', 'no-cache')
  supabaseResponse.headers.set('Expires', '0')

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          
          // Re-apply cache control headers after creating new response
          supabaseResponse.headers.set('Cache-Control', 'no-store, must-revalidate')
          supabaseResponse.headers.set('Pragma', 'no-cache')
          supabaseResponse.headers.set('Expires', '0')

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh the session so it doesn't expire
  await supabase.auth.getUser()

  return supabaseResponse
}

// Apply middleware to all routes except static files
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth/callback (prevents cookie header conflict with route.ts)
     */
    '/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
