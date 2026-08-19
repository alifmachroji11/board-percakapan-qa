import { Link } from 'react-router-dom'
import { TOPICS } from '../data/topics.js'
import { WEEKLY_QUESTIONS } from '../data/weeklyQuestions.js'
import { getEntry, getEntryStatus, getCurrentWeek, topikEntryId, mingguEntryId } from '../lib/storage.js'
import StatusBadge from '../components/StatusBadge.jsx'

export default function Riwayat() {
  const currentWeek = getCurrentWeek()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Riwayat</h1>
        <p className="mt-1 text-sm text-ink-soft">Semua topik & minggu yang pernah kalian bahas.</p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-terracotta-deep">Kartu Topik</h2>
        <div className="flex flex-col gap-2">
          {TOPICS.map((topic) => {
            const entry = getEntry(topikEntryId(topic.id))
            const status = getEntryStatus(entry)
            const href =
              status === 'belum-dibahas'
                ? `/app/topik/${topic.id}`
                : status === 'siap-dibuka'
                  ? `/app/topik/${topic.id}/buka-bareng`
                  : status === 'sudah-dibuka'
                    ? `/app/topik/${topic.id}/buka-bareng`
                    : `/app/topik/${topic.id}/jurnal`
            return (
              <Link
                key={topic.id}
                to={href}
                className="flex items-center justify-between gap-3 rounded-xl bg-surface p-4 shadow-sm shadow-ink/5"
              >
                <p className="text-sm font-semibold leading-snug text-ink">{topic.title}</p>
                <StatusBadge status={status} />
              </Link>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-soft-blue-deep">Kotak Waktu</h2>
        <div className="flex flex-col gap-2">
          {WEEKLY_QUESTIONS.filter((q) => q.week <= currentWeek).map((q) => {
            const entry = getEntry(mingguEntryId(q.week))
            const isPastWeek = q.week < currentWeek
            const status = getEntryStatus(entry, { isPastWeek })
            const href =
              status === 'sudah-dibuka'
                ? '/app/kotak-waktu/buka-bareng'
                : status === 'siap-dibuka'
                  ? '/app/kotak-waktu/buka-bareng'
                  : q.week === currentWeek
                    ? '/app/kotak-waktu'
                    : '/app/kotak-waktu'
            return (
              <Link
                key={q.week}
                to={href}
                className="flex items-center justify-between gap-3 rounded-xl bg-surface p-4 shadow-sm shadow-ink/5"
              >
                <div>
                  <p className="text-xs font-semibold text-soft-blue-deep">Minggu ke-{q.week}</p>
                  <p className="text-sm font-semibold leading-snug text-ink">{q.question}</p>
                </div>
                <StatusBadge status={status} />
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
