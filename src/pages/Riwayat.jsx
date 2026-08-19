import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TOPICS } from '../data/topics.js'
import { WEEKLY_QUESTIONS } from '../data/weeklyQuestions.js'
import { getAllEntries, groupEntryPairs, deriveStatus, pairKey } from '../lib/journal.js'
import { supabase } from '../lib/supabaseClient.js'
import { useCouple } from '../context/CoupleContext.jsx'
import StatusBadge from '../components/StatusBadge.jsx'

export default function Riwayat() {
  const { couple } = useCouple()
  const currentWeek = couple.current_week
  const [pairs, setPairs] = useState(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const entries = await getAllEntries(couple.id)
      if (cancelled) return
      setPairs(groupEntryPairs(entries, user.id))
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [couple.id])

  if (loading) return null

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
            const status = deriveStatus(pairs.get(pairKey('topik', topic.id)))
            const href =
              status === 'belum-dibahas'
                ? `/app/topik/${topic.id}`
                : status === 'siap-dibuka' || status === 'sudah-dibuka'
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
            const isPastWeek = q.week < currentWeek
            const status = deriveStatus(pairs.get(pairKey('kotak-waktu', q.week)), { isPastWeek })
            return (
              <Link
                key={q.week}
                to="/app/kotak-waktu"
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
