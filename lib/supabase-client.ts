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
    supabaseAnonKey
  )

  return supabaseInstance
}
