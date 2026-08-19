import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error('Supabase belum dikonfigurasi — cek VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY di .env.local')
}

export const supabase = createClient(url, anonKey)
