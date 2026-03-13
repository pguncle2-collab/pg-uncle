import { createBrowserClient } from '@supabase/ssr'

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export const createClient = () => {
  // In production, always validate environment variables
  // Don't return cached instance if env vars are missing
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error(
      'Supabase configuration error: NEXT_PUBLIC_SUPABASE_URL is not set. ' +
      'Please add it to your environment variables.'
    )
  }

  if (!supabaseAnonKey) {
    throw new Error(
      'Supabase configuration error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. ' +
      'Please add it to your environment variables.'
    )
  }

  // Only return cached instance if it exists and env vars match
  if (supabaseInstance) {
    return supabaseInstance
  }

  // Create new instance with proper storage configuration
  supabaseInstance = createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        // Use localStorage for cross-tab session persistence
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: 'supabase.auth.token',
        // Enable automatic token refresh
        autoRefreshToken: true,
        // Persist session across page reloads
        persistSession: true,
        // Detect session in URL (for OAuth callbacks)
        detectSessionInUrl: true,
        // Flow type for PKCE (more secure)
        flowType: 'pkce',
      },
    }
  )

  return supabaseInstance
}
