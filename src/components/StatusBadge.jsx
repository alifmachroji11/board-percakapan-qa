import { Circle, Clock3, Sparkles, CheckCircle2, CircleSlash } from 'lucide-react'

const CONFIG = {
  'belum-dibahas': { label: 'Belum dibahas', icon: Circle, className: 'bg-cream-deep text-ink-soft' },
  'menunggu-pasangan': { label: 'Menunggu pasangan', icon: Clock3, className: 'bg-soft-blue/20 text-soft-blue-deep' },
  'siap-dibuka': { label: 'Siap dibuka bareng', icon: Sparkles, className: 'bg-mustard/25 text-mustard-deep' },
  'sudah-dibuka': { label: 'Sudah dibuka bareng', icon: CheckCircle2, className: 'bg-sage/25 text-sage-deep' },
  dilewati: { label: 'Dilewati', icon: CircleSlash, className: 'bg-dusty-pink/25 text-dusty-pink-deep' },
}

export default function StatusBadge({ status, label }) {
  const config = CONFIG[status] ?? CONFIG['belum-dibahas']
  const Icon = config.icon
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      <Icon size={13} strokeWidth={2.5} />
      {label ?? config.label}
    </span>
  )
}
