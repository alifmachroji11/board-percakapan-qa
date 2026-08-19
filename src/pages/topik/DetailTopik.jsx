import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, PenLine, BookOpen, ExternalLink } from 'lucide-react'
import { getTopicById } from '../../data/topics.js'
import { getYoutubeEmbedUrl } from '../../lib/youtube.js'
import PillButton from '../../components/PillButton.jsx'

export default function DetailTopik() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const topic = getTopicById(topicId)
  const embedUrl = topic ? getYoutubeEmbedUrl(topic.videoUrl) : null

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

      {/* Video pemantik — video YouTube asli yang dikurasi per topik. Kalau
          belum ada video yang dikurasi untuk topik ini, tampilkan placeholder. */}
      {embedUrl ? (
        <div className="flex flex-col gap-1.5">
          <div className="overflow-hidden rounded-2xl shadow-inner">
            <iframe
              className="aspect-video w-full"
              src={embedUrl}
              title={topic.videoTitle ?? topic.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {topic.videoChannel && (
            <p className="text-xs text-ink-soft">
              {topic.videoTitle} — {topic.videoChannel}
            </p>
          )}
        </div>
      ) : (
        <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-terracotta-deep via-terracotta to-dusty-pink-deep shadow-inner">
          <button
            aria-label="Putar video pemantik (placeholder prototype)"
            className="flex size-16 items-center justify-center rounded-full bg-white/90 text-terracotta-deep shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <Play size={28} fill="currentColor" className="ml-1" />
          </button>
          <span className="absolute left-3 top-3 rounded-full bg-black/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/80">
            Video placeholder (dummy)
          </span>
        </div>
      )}

      <p className="text-sm leading-relaxed text-ink-soft">{topic.videoBlurb}</p>

      <div className="rounded-2xl bg-sage/15 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-sage-deep">Contoh kalimat pembuka</p>
        <p className="mt-1.5 text-sm italic text-ink">{topic.openerExample}</p>
      </div>

      {topic.articleUrl && (
        <a
          href={topic.articleUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm shadow-ink/5 transition-colors hover:bg-cream-deep"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-soft-blue/15 text-soft-blue-deep">
            <BookOpen size={18} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-soft-blue-deep">Bacaan lebih lanjut</p>
            <p className="text-sm font-semibold text-ink">{topic.articleTitle}</p>
            <p className="text-xs text-ink-soft">{topic.articleSource}</p>
          </div>
          <ExternalLink size={16} className="shrink-0 text-ink-soft" />
        </a>
      )}

      <PillButton onClick={() => navigate(`/app/topik/${topic.id}/jurnal`)} className="w-full">
        <PenLine size={18} /> Tulis jawabanku
      </PillButton>
    </div>
  )
}
