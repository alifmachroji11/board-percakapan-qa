import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { LogoLockup } from '../components/Logo.jsx'

export default function Privasi() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-5 py-10">
      <div className="flex items-center justify-between">
        <LogoLockup iconSize={22} textClassName="text-base" />
        <Link to="/" className="flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink">
          <ArrowLeft size={16} /> Kembali
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold text-ink">Kebijakan Privasi</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Ditulis sesederhana mungkin — ini prototype tahap validasi, bukan produk final, tapi
          data yang kamu tulis di sini tetap kami perlakukan serius.
        </p>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-terracotta-deep">
          Data apa yang kami simpan
        </h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          Jawaban jurnal yang kamu tulis di Kartu Topik & Kotak Waktu, dan nama tampilan (opsional)
          yang kamu isi pas pairing. Kami nggak minta nomor HP, email, atau data identitas lain di
          tahap prototype ini — kamu masuk lewat sesi anonim.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-terracotta-deep">
          Di mana disimpan & siapa yang bisa lihat
        </h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          Data tersimpan di server (Supabase), bukan cuma di HP kamu. Jawabanmu dan jawaban
          pasangan cuma bisa diakses oleh kalian berdua — dikunci di level database (row-level
          security) berdasarkan couple yang terhubung lewat kode pairing, bukan cuma dibatasi lewat
          tampilan aplikasi. Nggak ada pihak ketiga, termasuk kami, yang bisa baca jawaban kalian
          lewat aplikasi ini.
        </p>
        <p className="text-sm leading-relaxed text-ink-soft">
          Jawaban yang udah dikirim nggak bisa diubah lagi oleh siapapun (termasuk pasanganmu) —
          dikunci di level database supaya nggak ada yang bisa diam-diam nulis ulang jawaban orang
          lain.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-terracotta-deep">
          Video & artikel pihak ketiga
        </h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          Video pemantik (YouTube) dan artikel bacaan yang muncul di tiap kartu topik dikurasi
          manual dari sumber pihak ketiga (bukan konten kami), buat bantu mancing obrolan dari dua
          sudut pandang — psikologi/kesehatan relasi dan Islam.
          Nonton video YouTube dari sini tunduk ke kebijakan privasi YouTube/Google sendiri.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-terracotta-deep">
          Karena ini prototype
        </h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          Obrolin masih tahap validasi, dibangun buat diuji ke calon pengguna nyata — bukan produk
          final berbayar. Data bisa direset/dihapus sewaktu-waktu selama tahap pengembangan ini.
          Kalau kamu mau data kamu dihapus kapan aja, hubungi kami.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-terracotta-deep">
          Bukan pengganti bantuan profesional
        </h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          Obrolin & Kotak Waktu itu pelengkap obrolan sehari-hari, bukan pengganti konseling
          profesional. Kalau situasi kamu darurat (krisis, kekerasan dalam rumah tangga), segera
          cari bantuan profesional atau hotline terdekat.
        </p>
      </section>
    </div>
  )
}
