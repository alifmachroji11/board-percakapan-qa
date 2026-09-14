import { supabase } from './supabaseClient.js'

// Pengganti src/lib/storage.js (localStorage) — jawaban jurnal sekarang
// tersimpan beneran di Supabase, per couple, per topik/minggu.

export async function getCoupleMembers(coupleId) {
  const { data, error } = await supabase
    .from('couple_members')
    .select('user_id, display_name')
    .eq('couple_id', coupleId)
  if (error) throw error
  return data
}

// Ambil SEMUA entri jurnal satu couple sekaligus — dipakai halaman
// yang butuh status banyak topik/minggu sekaligus (pilih fase, riwayat).
// Lewat RPC get_journal_entries, bukan select langsung ke tabel — jawaban
// tersimpan terenkripsi (lihat migration encrypt_journal_answers), didekrip
// di server pakai kunci yang cuma dipegang Vault, nggak pernah dikirim ke klien.
export async function getAllEntries(coupleId) {
  const { data, error } = await supabase.rpc('get_journal_entries', { p_couple_id: coupleId })
  if (error) throw error
  return data
}

export function pairKey(type, refId) {
  return `${type}:${refId}`
}

// Kelompokkan hasil getAllEntries jadi { "type:refId": { mine, partner } }
export function groupEntryPairs(entries, myUserId) {
  const map = new Map()
  for (const entry of entries) {
    const key = pairKey(entry.type, entry.ref_id)
    const pair = map.get(key) ?? { mine: null, partner: null }
    if (entry.author_id === myUserId) pair.mine = entry
    else pair.partner = entry
    map.set(key, pair)
  }
  return map
}

export async function getEntryPair(coupleId, type, refId) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const entries = await getAllEntries(coupleId)
  const data = entries.filter((r) => r.type === type && r.ref_id === String(refId))

  const mine = data.find((r) => r.author_id === user.id) ?? null
  const partner = data.find((r) => r.author_id !== user.id) ?? null
  return { mine, partner }
}

// Jawaban dienkripsi di server (di dalam RPC-nya) sebelum disimpan — lihat
// migration encrypt_journal_answers. Akses insert langsung ke tabel udah
// ditutup, jadi ini satu-satunya jalan buat nulis jawaban.
export async function submitAnswer(coupleId, type, refId, answer) {
  const { error } = await supabase.rpc('submit_journal_answer', {
    p_couple_id: coupleId,
    p_type: type,
    p_ref_id: String(refId),
    p_answer: answer,
  })
  if (error) throw error
}

export async function markOpened(coupleId, type, refId) {
  const { error } = await supabase
    .from('journal_entries')
    .update({ opened_at: new Date().toISOString() })
    .eq('couple_id', coupleId)
    .eq('type', type)
    .eq('ref_id', String(refId))
  if (error) throw error
}

/**
 * Status baca-manusia dari sepasang entri (mine + partner).
 * type 'topik': belum-dibahas | menunggu-pasangan | siap-dibuka | sudah-dibuka
 * type 'kotak-waktu': tambahan 'dilewati' kalau minggu udah lewat tapi
 * belum lengkap dijawab berdua.
 */
export function deriveStatus({ mine, partner } = {}, { isPastWeek = false } = {}) {
  if (!mine) return isPastWeek ? 'dilewati' : 'belum-dibahas'
  if (mine.opened_at || partner?.opened_at) return 'sudah-dibuka'
  if (partner) return 'siap-dibuka'
  return isPastWeek ? 'dilewati' : 'menunggu-pasangan'
}

// Langganan realtime: kepanggil tiap kali ada perubahan journal_entries
// couple ini (mis. pasangan baru submit). Return fungsi unsubscribe.
export function subscribeToCoupleJournal(coupleId, onChange) {
  const channel = supabase
    .channel(`journal-${coupleId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'journal_entries', filter: `couple_id=eq.${coupleId}` },
      onChange
    )
    .subscribe()
  return () => supabase.removeChannel(channel)
}

// Langganan realtime buat baris couples-nya sendiri — dipakai supaya
// current_week (dimajuin cron mingguan) ke-update live tanpa reload.
export function subscribeToCouple(coupleId, onChange) {
  const channel = supabase
    .channel(`couple-row-${coupleId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'couples', filter: `id=eq.${coupleId}` },
      onChange
    )
    .subscribe()
  return () => supabase.removeChannel(channel)
}
