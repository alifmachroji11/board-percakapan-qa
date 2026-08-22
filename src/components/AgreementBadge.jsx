import { CheckCircle2, MessagesSquare, SkipForward } from 'lucide-react'

const CONFIG = {
  sepakat: { label: 'Sudah sepakat', icon: CheckCircle2, className: 'bg-sage/25 text-sage-deep' },
  'perlu-dibahas': {
    label: 'Perlu dibahas lagi',
    icon: MessagesSquare,
    className: 'bg-mustard/25 text-mustard-deep',
  },
  'lewati-dulu': { label: 'Dilewati dulu', icon: SkipForward, className: 'bg-dusty-pink/25 text-dusty-pink-deep' },
}

export default function AgreementBadge({ status }) {
  const config = CONFIG[status]
  if (!config) return null
  const Icon = config.icon
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      <Icon size={13} strokeWidth={2.5} />
      {config.label}
    </span>
  )
}
