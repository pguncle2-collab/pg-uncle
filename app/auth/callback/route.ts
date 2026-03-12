import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  // Add robust debug logging for the callback
  console.log(`[Auth Callback] Hit with code present: ${!!code}`);
  console.log(`[Auth Callback] URL Origin: ${origin}`);
  
  const cookieStore = cookies()
  const allCookies = cookieStore.getAll();
  console.log(`[Auth Callback] Cookies present:`, allCookies.map(c => c.name));

  if (code) {
    // Validate environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('[Auth Callback] Missing Supabase environment variables')
      return NextResponse.redirect(
        `${origin}/auth?error=${encodeURIComponent('Configuration error: Missing Supabase credentials')}`
      )
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch (error) {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      console.log(`[Auth Callback] Successfully exchanged code for session. Redirecting to ${next}`);
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.error('[Auth Callback] exchangeCodeForSession error:', error.message)
      // Redirect back to auth with a clear error payload
      return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent(error.message)}&error_description=${encodeURIComponent(error.name)}`)
    }
  }

  console.error('[Auth Callback] No code provided in URL search parameters');
  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth?error=No_code_provided_in_url`)
}
