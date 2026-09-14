import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Lock, Sparkles, Share2 } from 'lucide-react'
import { getWeeklyQuestion, buildWhatsAppShareUrl } from '../../data/weeklyQuestions.js'
import { getEntryPair, submitAnswer, subscribeToCoupleJournal, pairKey } from '../../lib/journal.js'
import { getAllTopicStatuses, setTopicStatus, subscribeToTopicStatus } from '../../lib/topicStatus.js'
import { useCouple } from '../../context/CoupleContext.jsx'
import PillButton from '../../components/PillButton.jsx'
import AgreementBadge from '../../components/AgreementBadge.jsx'
import AgreementPicker from '../../components/AgreementPicker.jsx'

export default function JurnalMinggu() {
  const navigate = useNavigate()
  const { week: weekParam } = useParams()
  const { couple, partner } = useCouple()
  const partnerName = partner?.display_name || 'pasanganmu'
  // Minggu yang kelewat/belum sempat dijawab bisa diakses lagi belakangan
  // lewat Riwayat, yang link ke sini pakai :week — kalau nggak ada
  // (dibuka dari alur normal minggu ini), pakai minggu couple saat ini.
  const week = weekParam ? Number(weekParam) : couple.current_week
  const question = getWeeklyQuestion(week)
  const isHistoryView = week !== couple.current_week
  const backTo = isHistoryView ? '/app/riwayat' : '/app/kotak-waktu'

  const [loading, setLoading] = useState(true)
  const [pair, setPair] = useState({ mine: null, partner: null })
  const [draft, setDraft] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [agreementStatus, setAgreementStatus] = useState(null)
  const [editingStatus, setEditingStatus] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const result = await getEntryPair(couple.id, 'kotak-waktu', week)
      if (cancelled) return
      setPair(result)
      setDraft(result.mine?.answer ?? '')
      setLoading(false)
    }
    load()
    const unsubscribe = subscribeToCoupleJournal(couple.id, load)
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [couple.id, week])

  useEffect(() => {
    let cancelled = false
    function loadStatus() {
      getAllTopicStatuses(couple.id).then((map) => {
        if (cancelled) return
        setAgreementStatus(map.get(pairKey('kotak-waktu', week))?.status ?? null)
      })
    }
    loadStatus()
    const unsubscribe = subscribeToTopicStatus(couple.id, loadStatus)
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [couple.id, week])

  if (loading) return null

  const hasSubmitted = Boolean(pair.mine)
  const partnerSubmitted = Boolean(pair.partner)
  const bothReady = hasSubmitted && partnerSubmitted
  const showTextarea = agreementStatus === 'sepakat' && !editingStatus

  async function handleSubmit() {
    if (!draft.trim()) return
    setSubmitting(true)
    await submitAnswer(couple.id, 'kotak-waktu', week, draft.trim())
    const result = await getEntryPair(couple.id, 'kotak-waktu', week)
    setPair(result)
    setSubmitting(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => navigate(backTo)}
        className="flex w-fit items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={16} /> Kembali
      </button>

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-soft-blue-deep">
          Minggu ke-{week} · Jurnal privat
        </p>
        <h1 className="mt-1 text-xl font-extrabold leading-snug text-ink">{question.question}</h1>
        <a
          href={buildWhatsAppShareUrl(week, question.question)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-soft-blue-deep hover:underline"
        >
          <Share2 size={14} /> Share pertanyaan ke WhatsApp
        </a>
      </div>

      {!hasSubmitted ? (
        <>
          {showTextarea ? (
            <div className="flex items-center justify-between gap-3">
              <AgreementBadge status={agreementStatus} variant="before" />
              <button
                onClick={() => setEditingStatus(true)}
                className="text-xs font-semibold text-ink-soft hover:text-ink"
              >
                Ubah
              </button>
            </div>
          ) : (
            <AgreementPicker
              status={agreementStatus}
              variant="before-kotak-waktu"
              onSelect={(status) => {
                setEditingStatus(false)
                setTopicStatus(couple.id, 'kotak-waktu', week, status)
              }}
            />
          )}

          {showTextarea && (
            <>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Jawab jujur dulu — jawaban pasanganmu tersembunyi sampai kalian berdua siap buka bareng."
                rows={8}
                className="w-full resize-none rounded-2xl bg-surface p-4 text-sm leading-relaxed text-ink shadow-sm shadow-ink/5 outline-none ring-soft-blue/40 placeholder:text-ink-soft/60 focus:ring-2"
              />
              <PillButton variant="blue" onClick={handleSubmit} disabled={!draft.trim() || submitting} className="w-full">
                {submitting ? 'Menyimpan...' : 'Kirim jawabanku'}
              </PillButton>
            </>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl bg-surface p-4 shadow-sm shadow-ink/5">
            <p className="text-xs font-bold uppercase tracking-wide text-sage-deep">Jawabanmu tersimpan</p>
            <p className="mt-2 text-sm leading-relaxed text-ink">{pair.mine.answer}</p>
          </div>

          {/* Preview jawaban pasangan — sengaja diblur, memperkuat rasa privasi
              sebelum sesi "buka bareng", walau pasangan sudah submit sekalipun. */}
          <div className="relative overflow-hidden rounded-2xl bg-soft-blue/10 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-soft-blue-deep">
              Jawaban {partnerName}
            </p>
            <p className="mt-2 select-none text-sm leading-relaxed text-ink/70 blur-sm">
              {partnerSubmitted
                ? pair.partner.answer
                : 'Belum ada jawaban yang bisa dilihat di sini sampai waktunya buka bareng.'}
            </p>
            <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-white/10 text-xs font-semibold text-soft-blue-deep">
              <Lock size={13} />
              {partnerSubmitted ? 'Terkunci sampai dibuka bareng' : `Menunggu ${partnerName}`}
            </div>
          </div>

          {bothReady && (
            <PillButton
              variant="blue"
              onClick={() => navigate(isHistoryView ? `/app/kotak-waktu/buka-bareng/${week}` : '/app/kotak-waktu/buka-bareng')}
              className="w-full"
            >
              <Sparkles size={18} /> Lanjut buka bareng
            </PillButton>
          )}
        </div>
      )}
    </div>
  )
}
