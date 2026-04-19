import { createBrowserClient } from '@supabase/ssr'

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export const createClient = () => {
  if (supabaseInstance) return supabaseInstance

  // Validate environment variables before creating client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error(
      'Supabase configuration error: NEXT_PUBLIC_SUPABASE_URL is not set. ' +
      'Please add it to your .env.local file.'
    )
  }

  if (!supabaseAnonKey) {
    throw new Error(
      'Supabase configuration error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. ' +
      'Please add it to your .env.local file.'
    )
  }

  supabaseInstance = createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        // Disable the Web Locks API used for cross-tab token-refresh
        // coordination. It causes "AbortError: Lock broken by another request
        // with the 'steal' option" on dev hot-reloads and multiple tabs.
        // Cookie-based SSR auth (handled server-side) makes this lock
        // unnecessary.
        lock: undefined,
        detectSessionInUrl: true,
        persistSession: true,
      },
    }
  )

  return supabaseInstance
}

// Allow resetting the singleton (e.g. on sign-out) so a fresh
// client is created on the next call, avoiding stale lock state.
export const resetClient = () => {
  supabaseInstance = null
}
