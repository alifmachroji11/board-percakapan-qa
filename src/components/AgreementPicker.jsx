import { CheckCircle2, MessagesSquare, SkipForward, HelpCircle } from 'lucide-react'

const VARIANTS = {
  after: {
    prompt: 'Gimana hasil obrolan kalian soal ini?',
    options: [
      { value: 'sepakat', label: 'Sudah sepakat', icon: CheckCircle2, activeClass: 'bg-sage text-white' },
      { value: 'perlu-dibahas', label: 'Perlu dibahas lagi', icon: MessagesSquare, activeClass: 'bg-mustard text-white' },
      { value: 'lewati-dulu', label: 'Lewati dulu', icon: SkipForward, activeClass: 'bg-dusty-pink text-white' },
    ],
  },
  before: {
    prompt: 'Sebelum mulai nulis, kalian gimana?',
    options: [
      { value: 'sepakat', label: 'Sepakat, yuk mulai jawab', icon: CheckCircle2, activeClass: 'bg-sage text-white' },
      { value: 'perlu-dibahas', label: 'Ngobrol dulu sebelum jawab', icon: MessagesSquare, activeClass: 'bg-mustard text-white' },
      { value: 'lewati-dulu', label: 'Lewati dulu', icon: SkipForward, activeClass: 'bg-dusty-pink text-white' },
    ],
  },
  'before-kotak-waktu': {
    prompt: 'Sebelum mulai nulis, kalian gimana?',
    options: [
      { value: 'sepakat', label: 'Sepakat, yuk mulai jawab', icon: CheckCircle2, activeClass: 'bg-sage text-white' },
      { value: 'perlu-dibahas', label: 'Ngobrol dulu sebelum jawab', icon: MessagesSquare, activeClass: 'bg-mustard text-white' },
      {
        value: 'perlu-dipahami-kembali',
        label: 'Perlu dipahami lagi pertanyaannya',
        icon: HelpCircle,
        activeClass: 'bg-soft-blue text-white',
      },
    ],
  },
}

// `variant`: 'after' (default) = dipakai di layar "buka bareng" Kotak Waktu
// — setelah pasangan baca jawaban satu sama lain, mereka nandain hasil
// obrolannya (makna asli komponen ini). 'before' = dipakai SEBELUM nulis
// jawaban di JurnalTopik — pasangan sepakat dulu mau mulai bahas pertanyaan
// ini apa nggak, baru textarea jawaban kebuka kalau statusnya 'sepakat'.
// 'before-kotak-waktu' = sama gate-nya, tapi buat Kotak Waktu — opsi
// ketiganya beda: "perlu dipahami lagi pertanyaannya" (bukan "lewati dulu"),
// karena pertanyaan mingguannya reflektif & kadang perlu diklarifikasi dulu
// maknanya, bukan sekadar mau di-skip.
// Siapa aja di couple boleh pilih/ubah, dan realtime bikin pasangan yang
// lagi liat bareng langsung ikut lihat perubahannya.
export default function AgreementPicker({ status, onSelect, variant = 'after' }) {
  const { prompt, options } = VARIANTS[variant]
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-surface p-4 shadow-sm shadow-ink/5">
      <p className="text-sm font-semibold text-ink">{prompt}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(({ value, label, icon: Icon, activeClass }) => {
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
