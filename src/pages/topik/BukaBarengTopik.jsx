import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ArrowLeft } from 'lucide-react'
import { getTopicById } from '../../data/topics.js'
import { getEntryPair, markOpened } from '../../lib/journal.js'
import { useCouple } from '../../context/CoupleContext.jsx'
import PillButton from '../../components/PillButton.jsx'

export default function BukaBarengTopik() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const { couple, partner } = useCouple()
  const topic = getTopicById(topicId)
  const partnerName = partner?.display_name || 'pasanganmu'

  const [loading, setLoading] = useState(true)
  const [pair, setPair] = useState({ mine: null, partner: null })
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    let cancelled = false
    getEntryPair(couple.id, 'topik', topicId).then((result) => {
      if (cancelled) return
      setPair(result)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [couple.id, topicId])

  useEffect(() => {
    if (!pair.mine || !pair.partner) return
    const timer = setTimeout(() => {
      setRevealed(true)
      markOpened(couple.id, 'topik', topicId)
    }, 1100)
    return () => clearTimeout(timer)
  }, [pair, couple.id, topicId])

  if (loading) return null

  if (!topic || !pair.mine || !pair.partner) {
    return (
      <div className="text-center text-ink-soft">
        Belum ada jawaban lengkap untuk dibuka.{' '}
        <Link to={`/app/topik/${topicId}/jurnal`} className="font-semibold text-terracotta-deep">
          Isi jurnal dulu
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => navigate('/app/topik')}
        className="flex w-fit items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={16} /> Kembali ke daftar topik
      </button>

      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-terracotta-deep">Buka bareng</p>
        <h1 className="mt-1 text-xl font-extrabold leading-snug text-ink">{topic.title}</h1>
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

      {revealed && (
        <PillButton as={Link} to="/app/topik" variant="secondary" className="w-full">
          Selesai, lihat topik lain
        </PillButton>
      )}
    </div>
  )
}
