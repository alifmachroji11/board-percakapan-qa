import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, MailOpen } from 'lucide-react'
import { getWeeklyQuestion } from '../../data/weeklyQuestions.js'
import { getEntryPair, markOpened, pairKey } from '../../lib/journal.js'
import { getAllTopicStatuses, setTopicStatus, subscribeToTopicStatus } from '../../lib/topicStatus.js'
import { useCouple } from '../../context/CoupleContext.jsx'
import PillButton from '../../components/PillButton.jsx'
import AgreementPicker from '../../components/AgreementPicker.jsx'

export default function BukaBarengMinggu() {
  const navigate = useNavigate()
  const { week: weekParam } = useParams()
  const { couple, partner } = useCouple()
  const partnerName = partner?.display_name || 'pasanganmu'
  // Riwayat bisa link ke minggu lama lewat :week di URL — kalau nggak ada
  // (dibuka dari alur normal minggu ini), pakai minggu couple saat ini.
  const week = weekParam ? Number(weekParam) : couple.current_week
  const question = getWeeklyQuestion(week)
  const isHistoryView = week !== couple.current_week
  const backTo = isHistoryView ? '/app/riwayat' : '/app/kotak-waktu'

  const [loading, setLoading] = useState(true)
  const [pair, setPair] = useState({ mine: null, partner: null })
  const [step, setStep] = useState('closed') // closed -> opening -> open
  const [agreementStatus, setAgreementStatus] = useState(null)

  useEffect(() => {
    let cancelled = false
    getEntryPair(couple.id, 'kotak-waktu', week).then((result) => {
      if (cancelled) return
      setPair(result)
      // Minggu yang udah pernah dibuka (mis. diliat lagi lewat Riwayat) langsung
      // ditampilin isinya, nggak perlu ngulang animasi "buka kapsul".
      setStep(result.mine?.opened_at || result.partner?.opened_at ? 'open' : 'closed')
      setLoading(false)
    })
    return () => {
      cancelled = true
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

  if (!pair.mine || !pair.partner) {
    return (
      <div className="text-center text-ink-soft">
        Belum ada jawaban lengkap untuk dibuka minggu ini.{' '}
        <Link to={backTo} className="font-semibold text-soft-blue-deep">
          Kembali
        </Link>
      </div>
    )
  }

  function handleOpen() {
    setStep('opening')
    setTimeout(() => {
      setStep('open')
      markOpened(couple.id, 'kotak-waktu', week)
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => navigate(backTo)}
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
            <p className="mt-2 text-sm leading-relaxed text-ink">{pair.mine.answer}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
            className="flex-1 rounded-2xl bg-mustard/15 p-5"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-mustard-deep">
              Jawaban {partnerName}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink">{pair.partner.answer}</p>
          </motion.div>
        </div>
      )}

      {step === 'open' && (
        <AgreementPicker
          status={agreementStatus}
          onSelect={(status) => {
            setAgreementStatus(status)
            setTopicStatus(couple.id, 'kotak-waktu', week, status)
          }}
        />
      )}

      {step === 'open' && (
        <PillButton as={Link} to={backTo} variant="secondary" className="w-full">
          {isHistoryView ? 'Kembali ke riwayat' : 'Selesai untuk minggu ini'}
        </PillButton>
      )}
    </div>
  )
}
