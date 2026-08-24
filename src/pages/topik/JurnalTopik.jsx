import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Lock, Sparkles, CheckCircle2 } from 'lucide-react'
import { getTopicById, getQuestionRefId, getTopicProgress } from '../../data/topics.js'
import {
  getAllEntries,
  groupEntryPairs,
  deriveStatus,
  submitAnswer,
  subscribeToCoupleJournal,
  pairKey,
} from '../../lib/journal.js'
import { getAllTopicStatuses, setTopicStatus, subscribeToTopicStatus } from '../../lib/topicStatus.js'
import { supabase } from '../../lib/supabaseClient.js'
import { useCouple } from '../../context/CoupleContext.jsx'
import PillButton from '../../components/PillButton.jsx'
import AgreementBadge from '../../components/AgreementBadge.jsx'
import AgreementPicker from '../../components/AgreementPicker.jsx'

export default function JurnalTopik() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const { couple, partner } = useCouple()
  const topic = getTopicById(topicId)
  const partnerName = partner?.display_name || 'pasanganmu'

  const [loading, setLoading] = useState(true)
  const [pairsMap, setPairsMap] = useState(new Map())
  const [statusMap, setStatusMap] = useState(new Map())
  const [draft, setDraft] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [editingStatus, setEditingStatus] = useState(false)

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

  useEffect(() => {
    let cancelled = false
    function loadStatus() {
      getAllTopicStatuses(couple.id).then((map) => {
        if (!cancelled) setStatusMap(map)
      })
    }
    loadStatus()
    const unsubscribe = subscribeToTopicStatus(couple.id, loadStatus)
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [couple.id])

  if (!topic) {
    return (
      <div className="text-center text-ink-soft">
        Topik tidak ditemukan.{' '}
        <Link to="/app/topik" className="font-semibold text-terracotta-deep">
          Kembali
        </Link>
      </div>
    )
  }

  if (loading) return null

  const { activeIndex, total } = getTopicProgress(topic, pairsMap, deriveStatus)

  async function reloadEntries() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const entries = await getAllEntries(couple.id)
    setPairsMap(groupEntryPairs(entries, user.id))
  }

  if (activeIndex >= total) {
    return (
      <div className="flex flex-col gap-6">
        <button
          onClick={() => navigate('/app/topik')}
          className="flex w-fit items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
        >
          <ArrowLeft size={16} /> Kembali ke daftar topik
        </button>
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-sage/15 p-8 text-center">
          <CheckCircle2 size={32} className="text-sage-deep" />
          <p className="text-sm font-semibold text-ink">Semua pertanyaan topik ini udah dibahas!</p>
        </div>
      </div>
    )
  }

  const refId = getQuestionRefId(topic, activeIndex)
  const pair = pairsMap.get(pairKey('topik', refId)) ?? { mine: null, partner: null }
  const agreementStatus = statusMap.get(pairKey('topik', refId))?.status ?? null
  const hasSubmitted = Boolean(pair.mine)
  const partnerSubmitted = Boolean(pair.partner)
  const bothReady = hasSubmitted && partnerSubmitted
  const question = topic.questions[activeIndex]
  const showTextarea = agreementStatus === 'sepakat' && !editingStatus

  async function handleSubmit() {
    if (!draft.trim()) return
    setSubmitting(true)
    await submitAnswer(couple.id, 'topik', refId, draft.trim())
    await reloadEntries()
    setSubmitting(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => navigate(-1)}
        className="flex w-fit items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={16} /> Kembali
      </button>

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-terracotta-deep">
          Jurnal privat · Pertanyaan {activeIndex + 1} dari {total}
        </p>
        <h1 className="mt-1 text-xl font-extrabold leading-snug text-ink">{question}</h1>
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
              variant="before"
              onSelect={(status) => {
                setEditingStatus(false)
                setTopicStatus(couple.id, 'topik', refId, status)
              }}
            />
          )}

          {showTextarea && (
            <>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Tulis jawabanmu di sini. Cuma kamu yang bisa lihat, sampai kalian berdua siap buka bareng."
                rows={8}
                className="w-full resize-none rounded-2xl bg-surface p-4 text-sm leading-relaxed text-ink shadow-sm shadow-ink/5 outline-none ring-terracotta/30 placeholder:text-ink-soft/60 focus:ring-2"
              />
              <div className="flex items-center gap-2 rounded-xl bg-cream-deep px-4 py-3 text-xs text-ink-soft">
                <Lock size={14} />
                Jawaban ini terkunci sampai kalian berdua submit.
              </div>
              <PillButton onClick={handleSubmit} disabled={!draft.trim() || submitting} className="w-full">
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

          <div className="flex items-center gap-3 rounded-2xl bg-soft-blue/15 p-4">
            <Lock size={18} className="shrink-0 text-soft-blue-deep" />
            <p className="text-sm text-ink">
              {partnerSubmitted
                ? `${partnerName} juga sudah jawab. Siap dibuka bareng!`
                : `Menunggu jawaban ${partnerName}. Jawaban kalian berdua tetap terkunci sampai lengkap.`}
            </p>
          </div>

          {bothReady && (
            <PillButton
              onClick={() => navigate(`/app/topik/${topicId}/buka-bareng`)}
              className="w-full"
            >
              <Sparkles size={18} /> Buka bareng sekarang
            </PillButton>
          )}
        </div>
      )}
    </div>
  )
}
