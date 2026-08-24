import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ArrowLeft, ArrowRight } from 'lucide-react'
import { getTopicById, getQuestionRefId, getTopicProgress } from '../../data/topics.js'
import {
  getAllEntries,
  groupEntryPairs,
  deriveStatus,
  markOpened,
  subscribeToCoupleJournal,
  pairKey,
} from '../../lib/journal.js'
import { supabase } from '../../lib/supabaseClient.js'
import { useCouple } from '../../context/CoupleContext.jsx'
import PillButton from '../../components/PillButton.jsx'

export default function BukaBarengTopik() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const { couple, partner } = useCouple()
  const topic = getTopicById(topicId)
  const partnerName = partner?.display_name || 'pasanganmu'

  const [loading, setLoading] = useState(true)
  const [pairsMap, setPairsMap] = useState(new Map())
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const entries = await getAllEntries(couple.id)
      if (cancelled) return
      setPairsMap(groupEntryPairs(entries, user.id))
      setLoading(false)
    }
    load()
    const unsubscribe = subscribeToCoupleJournal(couple.id, load)
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [couple.id])

  const { activeIndex, total } = topic ? getTopicProgress(topic, pairsMap, deriveStatus) : { activeIndex: 0, total: 0 }
  const refId = topic ? getQuestionRefId(topic, activeIndex) : null
  const pair = refId ? pairsMap.get(pairKey('topik', refId)) ?? { mine: null, partner: null } : { mine: null, partner: null }

  useEffect(() => {
    if (!pair.mine || !pair.partner) return
    const timer = setTimeout(() => {
      setRevealed(true)
      markOpened(couple.id, 'topik', refId)
    }, 1100)
    return () => clearTimeout(timer)
  }, [pair.mine, pair.partner, refId, couple.id])

  if (loading) return null

  if (!topic || activeIndex >= total || !pair.mine || !pair.partner) {
    return (
      <div className="text-center text-ink-soft">
        Belum ada jawaban lengkap untuk dibuka.{' '}
        <Link to={`/app/topik/${topicId}/jurnal`} className="font-semibold text-terracotta-deep">
          Isi jurnal dulu
        </Link>
      </div>
    )
  }

  const hasNext = activeIndex + 1 < total

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => navigate('/app/topik')}
        className="flex w-fit items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={16} /> Kembali ke daftar topik
      </button>

      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-terracotta-deep">
          Buka bareng · Pertanyaan {activeIndex + 1} dari {total}
        </p>
        <h1 className="mt-1 text-xl font-extrabold leading-snug text-ink">{topic.questions[activeIndex]}</h1>
      </div>

      {!revealed ? (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center gap-3 py-16 text-ink-soft"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
            className="text-terracotta"
          >
            <Heart size={40} fill="currentColor" />
          </motion.div>
          <p className="text-sm">Membuka jawaban kalian berdua...</p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex-1 rounded-2xl bg-terracotta/10 p-5"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-terracotta-deep">Jawabanmu</p>
            <p className="mt-2 text-sm leading-relaxed text-ink">{pair.mine.answer}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
            className="flex-1 rounded-2xl bg-soft-blue/15 p-5"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-soft-blue-deep">
              Jawaban {partnerName}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink">{pair.partner.answer}</p>
          </motion.div>
        </div>
      )}

      {revealed && hasNext && (
        <PillButton onClick={() => navigate(`/app/topik/${topicId}/jurnal`)} className="w-full">
          <ArrowRight size={18} /> Lanjut ke pertanyaan berikutnya
        </PillButton>
      )}

      {revealed && !hasNext && (
        <PillButton as={Link} to="/app/topik" variant="secondary" className="w-full">
          Selesai, lihat topik lain
        </PillButton>
      )}
    </div>
  )
}
