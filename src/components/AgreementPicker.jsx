import { CheckCircle2, MessagesSquare, SkipForward } from 'lucide-react'

const OPTIONS = [
  { value: 'sepakat', label: 'Sepakat, yuk mulai jawab', icon: CheckCircle2, activeClass: 'bg-sage text-white' },
  { value: 'perlu-dibahas', label: 'Ngobrol dulu sebelum jawab', icon: MessagesSquare, activeClass: 'bg-mustard text-white' },
  { value: 'lewati-dulu', label: 'Lewati dulu', icon: SkipForward, activeClass: 'bg-dusty-pink text-white' },
]

// Dipakai SEBELUM nulis jawaban (JurnalTopik) — pasangan sepakat dulu mau
// mulai bahas pertanyaan ini apa nggak, baru textarea jawaban kebuka kalau
// statusnya 'sepakat'. Siapa aja di couple boleh pilih/ubah, dan realtime
// bikin pasangan yang lagi liat bareng langsung ikut lihat perubahannya.
export default function AgreementPicker({ status, onSelect }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-surface p-4 shadow-sm shadow-ink/5">
      <p className="text-sm font-semibold text-ink">Sebelum mulai nulis, kalian gimana?</p>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map(({ value, label, icon: Icon, activeClass }) => {
          const active = status === value
          return (
            <button
              key={value}
              onClick={() => onSelect(value)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${
                active ? activeClass : 'bg-cream-deep text-ink-soft hover:bg-cream-deep/70'
              }`}
            >
              <Icon size={14} strokeWidth={2.5} />
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
