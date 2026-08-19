import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, Sparkles } from 'lucide-react'
import { getWeeklyQuestion } from '../../data/weeklyQuestions.js'
import { PARTNER_NAME } from '../../data/dummyPartner.js'
import {
  getEntry,
  submitMyAnswer,
  simulatePartnerSubmit,
  getCurrentWeek,
  mingguEntryId,
} from '../../lib/storage.js'
import PillButton from '../../components/PillButton.jsx'
import DemoPanel from '../../components/DemoPanel.jsx'

export default function JurnalMinggu() {
  const navigate = useNavigate()
  const week = getCurrentWeek()
  const question = getWeeklyQuestion(week)
  const entryId = mingguEntryId(week)
  const [entry, setEntry] = useState(() => getEntry(entryId))
  const [draft, setDraft] = useState(entry?.myAnswer ?? '')

  const hasSubmitted = Boolean(entry?.myAnswer)
  const partnerSubmitted = Boolean(entry?.partnerAnswer)
  const bothReady = hasSubmitted && partnerSubmitted

  function handleSubmit() {
    if (!draft.trim()) return
    setEntry(submitMyAnswer(entryId, 'kotak-waktu', week, draft.trim()))
  }

  function handleSimulatePartner() {
    setEntry(simulatePartnerSubmit(entryId, 'kotak-waktu', week))
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
        <p className="text-xs font-bold uppercase tracking-wide text-soft-blue-deep">
          Minggu ke-{week} · Jurnal privat
        </p>
        <h1 className="mt-1 text-xl font-extrabold leading-snug text-ink">{question.question}</h1>
      </div>

      {!hasSubmitted ? (
        <>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Jawab jujur dulu — jawaban pasanganmu tersembunyi sampai kalian berdua siap buka bareng."
            rows={8}
            className="w-full resize-none rounded-2xl bg-surface p-4 text-sm leading-relaxed text-ink shadow-sm shadow-ink/5 outline-none ring-soft-blue/40 placeholder:text-ink-soft/60 focus:ring-2"
          />
          <PillButton variant="blue" onClick={handleSubmit} disabled={!draft.trim()} className="w-full">
            Kirim jawabanku
          </PillButton>
        </>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl bg-surface p-4 shadow-sm shadow-ink/5">
            <p className="text-xs font-bold uppercase tracking-wide text-sage-deep">Jawabanmu tersimpan</p>
            <p className="mt-2 text-sm leading-relaxed text-ink">{entry.myAnswer}</p>
          </div>

          {/* Preview jawaban pasangan — sengaja diblur, memperkuat rasa privasi
              sebelum sesi "buka bareng", walau pasangan sudah submit sekalipun. */}
          <div className="relative overflow-hidden rounded-2xl bg-soft-blue/10 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-soft-blue-deep">
              Jawaban {PARTNER_NAME}
            </p>
            <p className="mt-2 select-none text-sm leading-relaxed text-ink/70 blur-sm">
              {partnerSubmitted
                ? entry.partnerAnswer
                : 'Belum ada jawaban yang bisa dilihat di sini sampai waktunya buka bareng.'}
            </p>
            <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-white/10 text-xs font-semibold text-soft-blue-deep">
              <Lock size={13} />
              {partnerSubmitted ? 'Terkunci sampai dibuka bareng' : `Menunggu ${PARTNER_NAME}`}
            </div>
          </div>

          {!partnerSubmitted && (
            <DemoPanel>
              <p className="text-xs text-ink-soft">
                Simulasikan pasangan (dummy: "{PARTNER_NAME}") sudah menjawab minggu ini.
              </p>
              <PillButton variant="soft" onClick={handleSimulatePartner} className="w-fit">
                Simulasi: {PARTNER_NAME} sudah menjawab
              </PillButton>
            </DemoPanel>
          )}

          {bothReady && (
            <PillButton
              variant="blue"
              onClick={() => navigate('/app/kotak-waktu/buka-bareng')}
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
