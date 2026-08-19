import { FlaskConical } from 'lucide-react'

// Panel simulasi waktu/pasangan — SENGAJA dibuat beda gaya (border dashed,
// label "MODE DEMO") supaya jelas ini alat bantu user testing, bukan bagian
// dari produk asli. Hapus komponen ini saat sudah ada backend & waktu nyata.
export default function DemoPanel({ title = 'MODE DEMO', children }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-mustard-deep/60 bg-mustard/10 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-mustard-deep">
        <FlaskConical size={14} strokeWidth={2.5} />
        {title}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}
