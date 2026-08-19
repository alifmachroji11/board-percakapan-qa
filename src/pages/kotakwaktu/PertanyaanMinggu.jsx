import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, FastForward } from 'lucide-react'
import { WEEKLY_QUESTIONS, getWeeklyQuestion } from '../../data/weeklyQuestions.js'
import { PARTNER_NAME } from '../../data/dummyPartner.js'
import { getEntry, getEntryStatus, getCurrentWeek, advanceWeek, mingguEntryId } from '../../lib/storage.js'
import PillButton from '../../components/PillButton.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import DemoPanel from '../../components/DemoPanel.jsx'

export default function PertanyaanMinggu() {
  const navigate = useNavigate()
  const [week, setWeek] = useState(() => getCurrentWeek())
  const question = getWeeklyQuestion(week)
  const entryId = mingguEntryId(week)
  const entry = getEntry(entryId)
  const status = getEntryStatus(entry)
  const isLastWeek = week >= WEEKLY_QUESTIONS.length

  function handleAdvanceWeek() {
    const newWeek = advanceWeek()
    setWeek(newWeek)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Kotak Waktu</h1>
        <p className="mt-1 text-sm text-ink-soft">Minggu ke-{week} dari {WEEKLY_QUESTIONS.length}</p>
      </div>

      {/* Kartu "kapsul" pertanyaan minggu ini */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-soft-blue to-soft-blue-deep p-6 text-white shadow-md">
        <Mail size={22} className="opacity-80" />
        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-white/70">
          Pertanyaan minggu ini
        </p>
        <p className="mt-2 text-lg font-bold leading-snug">{question.question}</p>
        <div className="mt-5">
          <StatusBadge
            status={status}
            label={
              status === 'belum-dibahas'
                ? 'Kamu belum jawab'
                : status === 'menunggu-pasangan'
                  ? `Menunggu ${PARTNER_NAME} jawab`
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
          Jawabanmu tersimpan. Menunggu {PARTNER_NAME} jawab sebelum kalian bisa buka bareng.
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

      <DemoPanel>
        <p className="text-xs text-ink-soft">
          Lompat waktu supaya kamu bisa coba siklus mingguan tanpa nunggu seminggu sungguhan.
        </p>
        <PillButton
          variant="soft"
          onClick={handleAdvanceWeek}
          disabled={isLastWeek}
          className="w-fit"
        >
          <FastForward size={16} /> Simulasi: Lompat ke minggu berikutnya
        </PillButton>
      </DemoPanel>
    </div>
  )
}
