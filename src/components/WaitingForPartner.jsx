import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Users } from 'lucide-react'
import { supabase } from '../lib/supabaseClient.js'

// Dipakai di dua tempat: layar "abis bikin kode" di Pairing, dan guard buat
// nahan Kartu Topik/Kotak Waktu selama pasangan belum gabung.
export default function WaitingForPartner({ coupleId, inviteCode, onPartnerJoined, title, description }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!onPartnerJoined) return
    const channel = supabase
      .channel(`couple-wait-${coupleId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'couple_members', filter: `couple_id=eq.${coupleId}` },
        onPartnerJoined
      )
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [coupleId, onPartnerJoined])

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <>
      <div className="flex size-14 items-center justify-center rounded-full bg-terracotta/15 text-terracotta-deep">
        <Users size={26} />
      </div>
      <div>
        <h1 className="text-xl font-extrabold text-ink">{title ?? 'Kode pairing kamu'}</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {description ?? 'Kasih kode ini ke pasanganmu. Begitu dia masukin, kalian otomatis kehubung.'}
        </p>
      </div>

      <button
        onClick={handleCopy}
        className="flex items-center gap-3 rounded-2xl bg-surface px-8 py-5 shadow-sm shadow-ink/5"
      >
        <span className="text-2xl font-extrabold tracking-[0.15em] text-terracotta-deep sm:text-3xl">
          {inviteCode}
        </span>
        {copied ? <Check size={20} className="text-sage-deep" /> : <Copy size={20} className="text-ink-soft" />}
      </button>

      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="text-xs text-ink-soft"
      >
        Menunggu pasanganmu gabung...
      </motion.p>
    </>
  )
}
