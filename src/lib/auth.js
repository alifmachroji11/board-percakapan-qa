import { supabase } from './supabaseClient.js'

// Anonymous sign-in: user langsung bisa pakai app tanpa akun dulu. Google
// bisa dihubungkan belakangan sebagai upgrade dari sesi anonim ini lewat
// linkGoogleAccount() di bawah — user id tetap sama, jadi couple & jurnal
// yang udah ada nggak hilang.
export async function ensureSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (session) return session

  const { data, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  return data.session
}

// Sesi anonim yang belum "diamankan" ke Google — kalau localStorage device ini
// hilang/reset, akses ke couple ikut hilang karena nggak ada identitas lain
// yang bisa dipakai buat masuk ulang.
export async function isAnonymousUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.is_anonymous ?? false
}

export async function getUserEmail() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.email ?? null
}

// Buat user yang lagi login anonim (udah pairing, punya jurnal) dan mau
// "mengamankan" akunnya biar bisa dipakai dari device lain juga — identitas
// (user id) tetap sama, jadi couple & jawaban yang udah ada nggak hilang.
export async function linkGoogleAccount(redirectPath = '/app/akun') {
  const { error } = await supabase.auth.linkIdentity({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}${redirectPath}` },
  })
  if (error) throw error
}

// Buat user yang udah pernah hubungkan Google sebelumnya (di device lain)
// dan sekarang mau masuk lagi dari device baru tanpa pairing ulang.
export async function signInWithGoogle(redirectPath = '/app') {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}${redirectPath}` },
  })
  if (error) throw error
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
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
