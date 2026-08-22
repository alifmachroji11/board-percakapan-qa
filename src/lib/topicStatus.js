import { supabase } from './supabaseClient.js'
import { pairKey } from './journal.js'

// Status kesepakatan pasangan buat satu topik/pertanyaan, ditandai setelah
// "buka bareng" — beda dari deriveStatus() di journal.js yang cuma ngukur
// progres baca (siap dibuka/sudah dibuka), ini nilainya hasil obrolan
// mereka. Satu baris per (couple, type, ref_id), siapa aja di couple boleh
// nulis/ubah — bukan per-penulis kayak journal_entries.
export const AGREEMENT_STATUSES = ['sepakat', 'perlu-dibahas', 'lewati-dulu']

export async function getAllTopicStatuses(coupleId) {
  const { data, error } = await supabase
    .from('topic_status')
    .select('type, ref_id, status, updated_by, updated_at')
    .eq('couple_id', coupleId)
  if (error) throw error

  const map = new Map()
  for (const row of data) map.set(pairKey(row.type, row.ref_id), row)
  return map
}

export async function setTopicStatus(coupleId, type, refId, status) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase.from('topic_status').upsert(
    {
      couple_id: coupleId,
      type,
      ref_id: String(refId),
      status,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'couple_id,type,ref_id' }
  )
  if (error) throw error
}

export function subscribeToTopicStatus(coupleId, onChange) {
  const channel = supabase
    .channel(`topic-status-${coupleId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'topic_status', filter: `couple_id=eq.${coupleId}` },
      onChange
    )
    .subscribe()
  return () => supabase.removeChannel(channel)
}
