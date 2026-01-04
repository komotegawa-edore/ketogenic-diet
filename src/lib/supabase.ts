import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Server-side client (for API routes)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Singleton browser client to avoid multiple GoTrueClient instances
let browserClient: SupabaseClient | null = null

export function createBrowserClient() {
  if (browserClient) return browserClient
  browserClient = createClient(supabaseUrl, supabaseAnonKey)
  return browserClient
}
