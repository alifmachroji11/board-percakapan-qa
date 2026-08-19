import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Lock, Sparkles } from 'lucide-react'
import { getTopicById } from '../../data/topics.js'
import { PARTNER_NAME } from '../../data/dummyPartner.js'
import {
  getEntry,
  submitMyAnswer,
  simulatePartnerSubmit,
  topikEntryId,
} from '../../lib/storage.js'
import PillButton from '../../components/PillButton.jsx'
import DemoPanel from '../../components/DemoPanel.jsx'

export default function JurnalTopik() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const topic = getTopicById(topicId)
  const entryId = topikEntryId(topicId)
  const [entry, setEntry] = useState(() => getEntry(entryId))
  const [draft, setDraft] = useState(entry?.myAnswer ?? '')

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

  const hasSubmitted = Boolean(entry?.myAnswer)
  const partnerSubmitted = Boolean(entry?.partnerAnswer)
  const bothReady = hasSubmitted && partnerSubmitted

  function handleSubmit() {
    if (!draft.trim()) return
    const updated = submitMyAnswer(entryId, 'topik', topicId, draft.trim())
    setEntry(updated)
  }

  function handleSimulatePartner() {
    const updated = simulatePartnerSubmit(entryId, 'topik', topicId)
    setEntry(updated)
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
        <p className="text-xs font-bold uppercase tracking-wide text-terracotta-deep">Jurnal privat</p>
        <h1 className="mt-1 text-xl font-extrabold leading-snug text-ink">{topic.title}</h1>
      </div>

      {!hasSubmitted ? (
        <>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Tulis jawabanmu di sini. Cuma kamu yang bisa lihat, sampai kalian berdua siap buka bareng."
            rows={8}
            className="w-full resize-none rounded-2xl bg-white p-4 text-sm leading-relaxed text-ink shadow-sm shadow-ink/5 outline-none ring-terracotta/30 placeholder:text-ink-soft/60 focus:ring-2"
          />
          <div className="flex items-center gap-2 rounded-xl bg-cream-deep px-4 py-3 text-xs text-ink-soft">
            <Lock size={14} />
            Jawaban ini terkunci sampai kalian berdua submit.
          </div>
          <PillButton onClick={handleSubmit} disabled={!draft.trim()} className="w-full">
            Kirim jawabanku
          </PillButton>
        </>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl bg-white p-4 shadow-sm shadow-ink/5">
            <p className="text-xs font-bold uppercase tracking-wide text-sage-deep">Jawabanmu tersimpan</p>
            <p className="mt-2 text-sm leading-relaxed text-ink">{entry.myAnswer}</p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-soft-blue/15 p-4">
            <Lock size={18} className="shrink-0 text-soft-blue-deep" />
            <p className="text-sm text-ink">
              {partnerSubmitted
                ? `${PARTNER_NAME} juga sudah jawab. Siap dibuka bareng!`
                : `Menunggu jawaban ${PARTNER_NAME}. Jawaban kalian berdua tetap terkunci sampai lengkap.`}
            </p>
          </div>

          {!partnerSubmitted && (
            <DemoPanel>
              <p className="text-xs text-ink-soft">
                Simulasikan pasangan (dummy: "{PARTNER_NAME}") supaya kamu bisa coba lanjutan alurnya
                sendirian.
              </p>
              <PillButton variant="soft" onClick={handleSimulatePartner} className="w-fit">
                Simulasi: {PARTNER_NAME} sudah menjawab
              </PillButton>
            </DemoPanel>
          )}

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
