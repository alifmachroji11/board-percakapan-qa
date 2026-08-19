import { Link } from 'react-router-dom'
import { MessageCircleHeart, Clock, ChevronRight } from 'lucide-react'

export default function AppHome() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Mau mulai dari mana?</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Dua cara pakai Obrolin — pilih topik kapan pun kamu siap, atau ikuti ritme satu pertanyaan
          tiap minggu lewat Kotak Waktu.
        </p>
      </div>

      <Link
        to="/app/topik"
        className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm shadow-ink/5 transition-transform active:scale-[0.98]"
      >
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-terracotta/15 text-terracotta-deep">
          <MessageCircleHeart size={22} strokeWidth={2} />
        </div>
        <div className="flex-1">
          <p className="font-bold text-ink">Kartu Topik</p>
          <p className="text-sm text-ink-soft">Pilih satu topik yang paling relevan sekarang, kapan aja.</p>
        </div>
        <ChevronRight className="text-ink-soft transition-transform group-hover:translate-x-0.5" size={20} />
      </Link>

      <Link
        to="/app/kotak-waktu"
        className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm shadow-ink/5 transition-transform active:scale-[0.98]"
      >
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-soft-blue/20 text-soft-blue-deep">
          <Clock size={22} strokeWidth={2} />
        </div>
        <div className="flex-1">
          <p className="font-bold text-ink">Kotak Waktu</p>
          <p className="text-sm text-ink-soft">Satu pertanyaan tiap minggu, jawab sendiri, buka bareng nanti.</p>
        </div>
        <ChevronRight className="text-ink-soft transition-transform group-hover:translate-x-0.5" size={20} />
      </Link>
    </div>
  )
}
