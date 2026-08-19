import { supabase } from './supabaseClient.js'

// Anonymous sign-in: user langsung bisa pakai app tanpa akun/nomor HP dulu.
// Nanti nomor HP+OTP bisa ditambahkan sebagai upgrade dari sesi anonim ini
// (supabase.auth.updateUser / linkIdentity), bukan ganti fondasi dari awal.
export async function ensureSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (session) return session

  const { data, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  return data.session
}

export async function getMyCouple() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('couple_members')
    .select('couples ( id, invite_code, current_week )')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) throw error
  return data?.couples ?? null
}

const ERROR_MESSAGES = {
  already_paired: 'Kamu udah tergabung di satu pasangan.',
  code_not_found: 'Kode nggak ketemu. Cek lagi kodenya.',
  couple_full: 'Kode ini udah dipakai berdua. Minta kode baru dari pasanganmu.',
  could_not_generate_code: 'Gagal bikin kode, coba lagi.',
}

function friendlyError(error) {
  const key = error?.message ?? ''
  return new Error(ERROR_MESSAGES[key] ?? 'Ada masalah, coba lagi sebentar.')
}

export async function createCouple(displayName) {
  const { data, error } = await supabase.rpc('create_couple', { p_display_name: displayName ?? null })
  if (error) throw friendlyError(error)
  return data
}

export async function joinCouple(code, displayName) {
  const { data, error } = await supabase.rpc('join_couple', {
    p_code: code,
    p_display_name: displayName ?? null,
  })
  if (error) throw friendlyError(error)
  return data
}
