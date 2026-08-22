import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PHASES, getTopicsByPhase } from '../../data/topics.js'
import {
  getAllEntries,
  groupEntryPairs,
  deriveStatus,
  pairKey,
  subscribeToCoupleJournal,
} from '../../lib/journal.js'
import { getAllTopicStatuses, subscribeToTopicStatus } from '../../lib/topicStatus.js'
import { supabase } from '../../lib/supabaseClient.js'
import { useCouple } from '../../context/CoupleContext.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import AgreementBadge from '../../components/AgreementBadge.jsx'

export default function PilihFase() {
  const { couple } = useCouple()
  const [phase, setPhase] = useState(PHASES[0].id)
  const [pairs, setPairs] = useState(new Map())
  const [agreements, setAgreements] = useState(new Map())
  const navigate = useNavigate()
  const topics = getTopicsByPhase(phase)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const entries = await getAllEntries(couple.id)
      if (!cancelled) setPairs(groupEntryPairs(entries, user.id))
    }
    load()
    const unsubscribe = subscribeToCoupleJournal(couple.id, load)
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [couple.id])

  useEffect(() => {
    let cancelled = false
    function loadStatuses() {
      getAllTopicStatuses(couple.id).then((map) => {
        if (!cancelled) setAgreements(map)
      })
    }
    loadStatuses()
    const unsubscribe = subscribeToTopicStatus(couple.id, loadStatuses)
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [couple.id])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Kartu Topik</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Pilih fase hubungan kalian dulu, biar topiknya relevan.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-thin">
        {PHASES.map((p) => (
          <button
            key={p.id}
            onClick={() => setPhase(p.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              phase === p.id
                ? 'bg-terracotta text-white shadow-sm'
                : 'bg-surface text-ink-soft hover:bg-cream-deep'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {topics.map((topic) => {
          const status = deriveStatus(pairs.get(pairKey('topik', topic.id)))
          const agreementStatus = agreements.get(pairKey('topik', topic.id))?.status
          return (
            <button
              key={topic.id}
              onClick={() => navigate(`/app/topik/${topic.id}`)}
              className="flex flex-col items-start gap-3 rounded-t-xl rounded-b-lg bg-surface p-4 text-left shadow-sm shadow-ink/5 transition-transform active:scale-[0.97]"
            >
              <span className="rounded-full bg-dusty-pink/25 px-2.5 py-1 text-[11px] font-bold text-terracotta-deep">
                {topic.category}
              </span>
              <p className="text-sm font-semibold leading-snug text-ink">{topic.title}</p>
              {status !== 'belum-dibahas' && <StatusBadge status={status} />}
              {agreementStatus && <AgreementBadge status={agreementStatus} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
