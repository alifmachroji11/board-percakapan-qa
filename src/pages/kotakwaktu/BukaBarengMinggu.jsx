import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, MailOpen } from 'lucide-react'
import { getWeeklyQuestion } from '../../data/weeklyQuestions.js'
import { PARTNER_NAME } from '../../data/dummyPartner.js'
import { getEntry, markOpened, getCurrentWeek, mingguEntryId } from '../../lib/storage.js'
import PillButton from '../../components/PillButton.jsx'

export default function BukaBarengMinggu() {
  const navigate = useNavigate()
  const week = getCurrentWeek()
  const question = getWeeklyQuestion(week)
  const entryId = mingguEntryId(week)
  const [entry] = useState(() => getEntry(entryId))
  const [step, setStep] = useState('closed') // closed -> opening -> open

  if (!entry?.myAnswer || !entry?.partnerAnswer) {
    return (
      <div className="text-center text-ink-soft">
        Belum ada jawaban lengkap untuk dibuka minggu ini.{' '}
        <Link to="/app/kotak-waktu" className="font-semibold text-soft-blue-deep">
          Kembali
        </Link>
      </div>
    )
  }

  function handleOpen() {
    setStep('opening')
    setTimeout(() => {
      setStep('open')
      markOpened(entryId)
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => navigate('/app/kotak-waktu')}
        className="flex w-fit items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={16} /> Kembali
      </button>

      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-soft-blue-deep">
          Kapsul minggu ke-{week}
        </p>
        <h1 className="mt-1 text-xl font-extrabold leading-snug text-ink">{question.question}</h1>
      </div>

      {step === 'closed' && (
        <div className="flex flex-col items-center gap-5 py-10">
          <Mail size={64} strokeWidth={1.5} className="text-soft-blue-deep" />
          <p className="text-center text-sm text-ink-soft">
            Jawaban kalian berdua sudah lengkap. Buka kapsulnya kalau kalian berdua sudah siap ngobrol.
          </p>
          <PillButton variant="blue" onClick={handleOpen}>
            Buka kapsul sekarang
          </PillButton>
        </div>
      )}

      {step === 'opening' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4 py-10 text-soft-blue-deep"
        >
          <motion.div
            animate={{ rotate: [0, -6, 6, -3, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          >
            <MailOpen size={64} strokeWidth={1.5} />
          </motion.div>
          <p className="text-sm">Membuka kapsul waktu kalian...</p>
        </motion.div>
      )}

      {step === 'open' && (
        <div className="flex flex-col gap-4 sm:flex-row">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex-1 rounded-2xl bg-soft-blue/15 p-5"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-soft-blue-deep">Jawabanmu</p>
            <p className="mt-2 text-sm leading-relaxed text-ink">{entry.myAnswer}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
            className="flex-1 rounded-2xl bg-mustard/15 p-5"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-mustard-deep">
              Jawaban {PARTNER_NAME}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink">{entry.partnerAnswer}</p>
          </motion.div>
        </div>
      )}

      {step === 'open' && (
        <PillButton as={Link} to="/app/kotak-waktu" variant="secondary" className="w-full">
          Selesai untuk minggu ini
        </PillButton>
      )}
    </div>
  )
}
