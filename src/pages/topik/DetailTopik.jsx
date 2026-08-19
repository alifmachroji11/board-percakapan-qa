import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, PenLine } from 'lucide-react'
import { getTopicById } from '../../data/topics.js'
import PillButton from '../../components/PillButton.jsx'

export default function DetailTopik() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const topic = getTopicById(topicId)

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

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => navigate(-1)}
        className="flex w-fit items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={16} /> Kembali
      </button>

      <div>
        <span className="rounded-full bg-dusty-pink/25 px-2.5 py-1 text-[11px] font-bold text-terracotta-deep">
          {topic.category}
        </span>
        <h1 className="mt-3 text-2xl font-extrabold leading-snug text-ink">{topic.title}</h1>
      </div>

      {/* Player video placeholder — DATA DUMMY: ganti dengan video pemantik asli nanti */}
      <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-terracotta-deep via-terracotta to-dusty-pink-deep shadow-inner">
        <button
          aria-label="Putar video pemantik (placeholder prototype)"
          className="flex size-16 items-center justify-center rounded-full bg-white/90 text-terracotta-deep shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <Play size={28} fill="currentColor" className="ml-1" />
        </button>
        <span className="absolute bottom-3 right-3 rounded-full bg-black/40 px-2.5 py-1 text-xs font-semibold text-white">
          {topic.videoDuration}
        </span>
        <span className="absolute left-3 top-3 rounded-full bg-black/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/80">
          Video placeholder (dummy)
        </span>
      </div>

      <p className="text-sm leading-relaxed text-ink-soft">{topic.videoBlurb}</p>

      <div className="rounded-2xl bg-sage/15 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-sage-deep">Contoh kalimat pembuka</p>
        <p className="mt-1.5 text-sm italic text-ink">{topic.openerExample}</p>
      </div>

      <PillButton onClick={() => navigate(`/app/topik/${topic.id}/jurnal`)} className="w-full">
        <PenLine size={18} /> Tulis jawabanku
      </PillButton>
    </div>
  )
}
