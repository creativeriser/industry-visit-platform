import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables. Please check .env.local")
}

// Validate URL format to prevent crash
try {
    if (!supabaseUrl) throw new Error("Supabase URL is missing");
    new URL(supabaseUrl)
} catch (error) {
    console.error("Supabase URL Error:", error)
    throw new Error("Invalid NEXT_PUBLIC_SUPABASE_URL. It must be a valid URL (e.g. https://xyz.supabase.co)")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
