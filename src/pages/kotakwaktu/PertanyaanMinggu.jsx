import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Share2, History } from 'lucide-react'
import { WEEKLY_QUESTIONS, getWeeklyQuestion, buildWhatsAppShareUrl } from '../../data/weeklyQuestions.js'
import {
  getAllEntries,
  groupEntryPairs,
  getEntryPair,
  deriveStatus,
  pairKey,
  subscribeToCoupleJournal,
} from '../../lib/journal.js'
import { supabase } from '../../lib/supabaseClient.js'
import { useCouple } from '../../context/CoupleContext.jsx'
import PillButton from '../../components/PillButton.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'

export default function PertanyaanMinggu() {
  const navigate = useNavigate()
  const { couple, partner } = useCouple()
  const partnerName = partner?.display_name || 'pasanganmu'
  const week = couple.current_week
  const question = getWeeklyQuestion(week)

  const [loading, setLoading] = useState(true)
  const [pair, setPair] = useState({ mine: null, partner: null })
  const [missedWeeks, setMissedWeeks] = useState([])

  // Satu langganan realtime aja buat couple ini — dua subscribeToCoupleJournal
  // terpisah di komponen yang sama bentrok (nama channel-nya sama per
  // couple, dan channel yang udah subscribe() nggak boleh nambah callback lagi).
  useEffect(() => {
    let cancelled = false

    async function loadPair() {
      const result = await getEntryPair(couple.id, 'kotak-waktu', week)
      if (!cancelled) setPair(result)
    }

    // Cari minggu-minggu sebelumnya yang belum kamu jawab, biar ada jalan
    // buat balik lagi ke sana — bukan cuma nyangkut nunggu minggu berjalan.
    async function loadMissed() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const entries = await getAllEntries(couple.id)
      if (cancelled) return
      const pairs = groupEntryPairs(entries, user.id)
      const missed = WEEKLY_QUESTIONS.filter((q) => q.week < week).filter((q) => {
        const p = pairs.get(pairKey('kotak-waktu', q.week))
        return !p?.mine
      })
      setMissedWeeks(missed)
    }

    async function loadAll() {
      await Promise.all([loadPair(), loadMissed()])
      if (!cancelled) setLoading(false)
    }

    loadAll()
    const unsubscribe = subscribeToCoupleJournal(couple.id, loadAll)
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [couple.id, week])

  if (loading) return null

  const status = deriveStatus(pair)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Kotak Waktu</h1>
        <p className="mt-1 text-sm text-ink-soft">Minggu ke-{week} dari {WEEKLY_QUESTIONS.length}</p>
      </div>

      {missedWeeks.length > 0 && (
        <Link
          to="/app/riwayat"
          className="flex items-center gap-3 rounded-2xl bg-mustard/15 p-4 text-sm text-mustard-deep"
        >
          <History size={18} className="shrink-0" />
          Ada {missedWeeks.length} pertanyaan minggu lalu yang belum kamu jawab. Lihat di riwayat.
        </Link>
      )}

      {/* Kartu "kapsul" pertanyaan minggu ini */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-soft-blue to-soft-blue-deep p-6 text-white shadow-md">
        <Mail size={22} className="opacity-80" />
        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-white/70">
          Pertanyaan minggu ini
        </p>
        <p className="mt-2 text-lg font-bold leading-snug">{question.question}</p>
        <a
          href={buildWhatsAppShareUrl(week, question.question)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white/85 hover:text-white hover:underline"
        >
          <Share2 size={14} /> Share ke WhatsApp
        </a>
        <div className="mt-5">
          <StatusBadge
            status={status}
            label={
              status === 'belum-dibahas'
                ? 'Kamu belum jawab'
                : status === 'menunggu-pasangan'
                  ? `Menunggu ${partnerName} jawab`
                  : status === 'siap-dibuka'
                    ? 'Kalian berdua sudah jawab, siap dibuka'
                    : undefined
            }
          />
        </div>
      </div>

      {status === 'belum-dibahas' && (
        <PillButton onClick={() => navigate('/app/kotak-waktu/jawab')} className="w-full">
          Tulis jawabanku
        </PillButton>
      )}

      {status === 'menunggu-pasangan' && (
        <div className="flex items-center gap-3 rounded-2xl bg-cream-deep p-4 text-sm text-ink-soft">
          <Lock size={16} className="shrink-0" />
          Jawabanmu tersimpan. Menunggu {partnerName} jawab sebelum kalian bisa buka bareng.
        </div>
      )}

      {status === 'siap-dibuka' && (
        <PillButton variant="blue" onClick={() => navigate('/app/kotak-waktu/buka-bareng')} className="w-full">
          Buka kapsul minggu ini
        </PillButton>
      )}

      {status === 'sudah-dibuka' && (
        <div className="rounded-2xl bg-sage/15 p-4 text-sm text-sage-deep">
          Kapsul minggu ini sudah dibuka bareng. Lihat di{' '}
          <Link to="/app/riwayat" className="font-semibold underline">
            riwayat
          </Link>
          .
        </div>
      )}
    </div>
  )
}
