import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Heart,
  PlayCircle,
  NotebookPen,
  Sparkles,
  Lock,
  Mail,
  Repeat,
  ChevronDown,
  ArrowRight,
} from 'lucide-react'
import { TOPICS } from '../data/topics.js'
import { WEEKLY_QUESTIONS } from '../data/weeklyQuestions.js'
import PillButton from '../components/PillButton.jsx'
import { LogoLockup } from '../components/Logo.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
}

const FAQ = [
  {
    q: 'Bedanya Kartu Topik sama Kotak Waktu apa?',
    a: 'Kartu Topik buat kamu pilih sendiri topik yang paling relevan sekarang, kapan aja. Kotak Waktu ngirim satu pertanyaan tiap minggu secara otomatis, buat pasangan yang lebih nyaman ada ritme yang mendorong duluan.',
  },
  {
    q: 'Apakah ini pengganti konseling profesional?',
    a: 'Bukan. Obrolin & Kotak Waktu itu pelengkap untuk obrolan sehari-hari, bukan pengganti bantuan profesional untuk krisis atau kekerasan dalam rumah tangga. Kalau situasi kamu darurat, segera cari bantuan profesional/hotline.',
  },
  {
    q: 'Kalau minggu ini lagi sibuk banget, gimana?',
    a: 'Bisa dijeda. Nggak ada tekanan deadline ketat — pertanyaan tetap nunggu sampai kalian berdua siap jawab.',
  },
  {
    q: 'Jawabanku disimpan di mana?',
    a: 'Di server (bukan cuma di HP kamu), terkunci per pasangan — cuma kamu & pasangan yang terhubung lewat kode pairing yang bisa lihat jawaban kalian berdua. Selengkapnya di kebijakan privasi (link di bagian bawah halaman).',
  },
  {
    q: 'Pasanganku harus pakai app yang sama nggak?',
    a: 'Iya. Masing-masing masuk pakai akun Google (biar akses ke jurnal aman meski ganti HP), lalu satu orang generate kode pairing dan pasangan masukin kodenya buat saling terhubung. Setelah itu kalian berdua beneran saling ngirim & baca jawaban masing-masing.',
  },
]

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(0)
  const previewTopics = TOPICS.slice(0, 6)
  const previewQuestions = WEEKLY_QUESTIONS.slice(0, 5)

  return (
    <div className="flex flex-col bg-cream text-ink">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 pt-6">
        <LogoLockup iconSize={22} textClassName="text-base" />
        <div className="flex items-center gap-3">
          <Link to="/app/pairing" className="text-sm font-semibold text-ink-soft hover:text-ink">
            Masuk
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* ============ HERO ============ */}
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-5 pb-14 pt-10 text-center sm:pt-16">
        <span className="flex items-center gap-1.5 rounded-full bg-dusty-pink/25 px-3 py-1 text-xs font-bold text-terracotta-deep">
          <Heart size={13} fill="currentColor" /> Untuk pasangan Indonesia
        </span>
        <h1 className="text-3xl font-extrabold leading-tight text-ink sm:text-5xl">
          Ada yang belum kalian bicarakan berdua?
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
          Obrolin bantu kamu & pasangan mulai obrolan penting yang selama ini kalian hindari — lewat
          kartu topik terkurasi, video pemantik singkat, dan jurnal privat per orang. Bukan soal kurang
          topik untuk dibicarakan, tapi kurang rasa aman untuk memulai.
        </p>
        <PillButton as={Link} to="/app" className="text-base">
          Coba Obrolin <ArrowRight size={18} />
        </PillButton>
        <p className="text-xs text-ink-soft">Gratis dicoba, langsung ke produknya — nggak perlu daftar akun.</p>
      </section>

      {/* ============ PROBLEM FRAMING ============ */}
      <motion.section {...fadeUp} className="mx-auto w-full max-w-2xl px-5 py-10 text-center">
        <p className="text-base leading-relaxed text-ink-soft">
          Menunda obrolan penting itu wajar. Bukan karena kalian nggak peduli satu sama lain, tapi
          karena nggak ada yang mau jadi pihak yang "mulai duluan" dan kedengaran menuduh.
        </p>
        <p className="mt-3 rounded-2xl bg-cream-deep px-5 py-4 text-sm text-ink-soft">
          62% kasus perceraian di Indonesia disebabkan perselisihan yang terus-menerus, bukan insiden
          besar — bukan buat menakut-nakuti, tapi supaya kita ngobrol soal hal kecil, sebelum menumpuk.
        </p>
      </motion.section>

      {/* ============ CARA KERJA OBROLIN ============ */}
      <motion.section {...fadeUp} className="mx-auto w-full max-w-3xl px-5 py-10">
        <h2 className="text-center text-2xl font-extrabold">Cara kerja Kartu Topik</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: NotebookPen,
              title: 'Pilih topik',
              desc: 'Kartu yang sudah dikurasi sesuai fase hubunganmu — pra-nikah, pengantin baru, atau sudah lama menikah.',
            },
            {
              icon: PlayCircle,
              title: 'Tonton video pemantik',
              desc: 'Video singkat 2-3 menit buat konteks & contoh kalimat pembuka yang nggak terasa menuduh.',
            },
            {
              icon: Lock,
              title: 'Tulis di jurnal privat',
              desc: 'Jawabanmu terkunci dulu, baru dibuka bareng pasangan saat kalian berdua siap.',
            },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="flex flex-col items-center gap-3 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-terracotta/15 text-terracotta-deep">
                <Icon size={22} />
              </div>
              <p className="font-bold text-ink">
                {i + 1}. {title}
              </p>
              <p className="text-sm text-ink-soft">{desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ============ PREVIEW KARTU TOPIK ============ */}
      <motion.section {...fadeUp} className="mx-auto w-full max-w-3xl px-5 py-10">
        <h2 className="text-center text-2xl font-extrabold">Contoh kartu topik</h2>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-ink-soft">
          Spesifik konteks Indonesia, bukan template generik.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {previewTopics.map((topic) => (
            <div
              key={topic.id}
              className="flex flex-col gap-2 rounded-t-xl rounded-b-lg bg-surface p-4 shadow-sm shadow-ink/5"
            >
              <span className="w-fit rounded-full bg-dusty-pink/25 px-2.5 py-1 text-[11px] font-bold text-terracotta-deep">
                {topic.category}
              </span>
              <p className="text-sm font-semibold leading-snug text-ink">{topic.title}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ============ KENAPA JURNAL PRIVAT ============ */}
      <motion.section {...fadeUp} className="mx-auto w-full max-w-2xl px-5 py-10 text-center">
        <h2 className="text-2xl font-extrabold">Kenapa jawab sendiri dulu?</h2>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          Jurnal privat bikin kamu jujur sama diri sendiri dulu, tanpa kepengaruh jawaban pasangan.
          Baru setelah kalian berdua siap, jawabannya dibuka bareng — jadi obrolannya berangkat dari dua
          kejujuran, bukan satu pihak yang menyesuaikan diri duluan.
        </p>
      </motion.section>

      {/* ============ TRANSISI KE KOTAK WAKTU ============ */}
      <div className="mx-auto h-px w-24 bg-cream-deep" />

      <motion.section
        {...fadeUp}
        className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-5 py-14 text-center"
      >
        <span className="flex items-center gap-1.5 rounded-full bg-soft-blue/20 px-3 py-1 text-xs font-bold text-soft-blue-deep">
          <Mail size={13} /> Cara lain pakai Obrolin: Kotak Waktu
        </span>
        <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
          Satu pertanyaan penting, tiap minggu.
          <br />
          Jawab sendiri dulu, buka bareng nanti.
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-ink-soft">
          Kalau kalian lebih nyaman ada ritme yang mendorong duluan (bukan harus berinisiatif sendiri),
          Kotak Waktu ngirim satu pertanyaan tiap minggu — seperti kapsul waktu mini untuk hubungan
          kalian.
        </p>
        <PillButton as={Link} to="/app/kotak-waktu" variant="blue" className="text-base">
          Coba minggu pertama <ArrowRight size={18} />
        </PillButton>
      </motion.section>

      <motion.section {...fadeUp} className="mx-auto w-full max-w-2xl px-5 py-6 text-center">
        <p className="text-base leading-relaxed text-ink-soft">
          Mencari waktu & topik yang "tepat" untuk ngobrol itu sendiri sering jadi hambatan. Kotak Waktu
          menghilangkan beban itu — sistem yang mendorong ritmis, bukan pasangan yang harus selalu
          berinisiatif duluan.
        </p>
      </motion.section>

      {/* ============ CARA KERJA KOTAK WAKTU (timeline) ============ */}
      <motion.section {...fadeUp} className="mx-auto w-full max-w-2xl px-5 py-10">
        <h2 className="text-center text-2xl font-extrabold">Cara kerja Kotak Waktu</h2>
        <div className="mt-8 flex flex-col gap-6 border-l-2 border-soft-blue/40 pl-6">
          {[
            'Tiap minggu dapat satu pertanyaan lewat notifikasi.',
            'Masing-masing jawab di jurnal pribadi — jawaban pasangan tersembunyi.',
            'Setelah keduanya submit, jawaban terkunci menunggu dibuka.',
            'Kalian pilih sendiri kapan waktu membuka & membahas bareng.',
          ].map((step, i) => (
            <div key={step} className="relative">
              <span className="absolute -left-[31px] flex size-6 items-center justify-center rounded-full bg-soft-blue text-xs font-bold text-white">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-ink">{step}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ============ PREVIEW PERTANYAAN MINGGUAN ============ */}
      <motion.section {...fadeUp} className="mx-auto w-full max-w-3xl px-5 py-10">
        <h2 className="text-center text-2xl font-extrabold">Contoh pertanyaan mingguan</h2>
        <div className="mt-8 flex flex-col gap-3">
          {previewQuestions.map((q) => (
            <div key={q.week} className="flex items-start gap-3 rounded-2xl bg-surface p-4 shadow-sm shadow-ink/5">
              <Mail size={18} className="mt-0.5 shrink-0 text-soft-blue-deep" />
              <p className="text-sm leading-relaxed text-ink">{q.question}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ============ KENAPA TERKUNCI + RITME MINGGUAN ============ */}
      <motion.section {...fadeUp} className="mx-auto grid w-full max-w-3xl gap-6 px-5 py-10 sm:grid-cols-2">
        <div className="rounded-2xl bg-soft-blue/10 p-5">
          <Lock size={20} className="text-soft-blue-deep" />
          <p className="mt-3 font-bold text-ink">Kenapa terkunci sampai keduanya submit?</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
            Supaya kalian jujur dulu tanpa terpengaruh jawaban pasangan sebelum sempat menulis
            jawabanmu sendiri.
          </p>
        </div>
        <div className="rounded-2xl bg-mustard/10 p-5">
          <Repeat size={20} className="text-mustard-deep" />
          <p className="mt-3 font-bold text-ink">Kenapa ritme mingguan?</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
            Obrolan penting bukan sesuatu yang selesai sekali duduk. Ritme kecil yang berkelanjutan
            lebih ringan dijalani dibanding satu sesi besar.
          </p>
        </div>
      </motion.section>

      {/* ============ FAQ ============ */}
      <motion.section {...fadeUp} className="mx-auto w-full max-w-2xl px-5 py-10">
        <h2 className="text-center text-2xl font-extrabold">Pertanyaan yang sering ditanya</h2>
        <div className="mt-8 flex flex-col gap-2">
          {FAQ.map((item, i) => (
            <div key={item.q} className="overflow-hidden rounded-2xl bg-surface shadow-sm shadow-ink/5">
              <button
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <span className="text-sm font-semibold text-ink">{item.q}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-ink-soft transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openFaq === i && (
                <p className="px-5 pb-4 text-sm leading-relaxed text-ink-soft">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </motion.section>

      {/* ============ CTA PENUTUP ============ */}
      <motion.section {...fadeUp} className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5 px-5 py-16 text-center">
        <Sparkles size={28} className="text-terracotta" />
        <h2 className="text-2xl font-extrabold sm:text-3xl">Nggak perlu buru-buru.</h2>
        <p className="max-w-md text-base leading-relaxed text-ink-soft">
          Coba salah satu, lihat mana yang paling terasa pas buat kalian berdua. Nggak ada yang lebih
          benar — cuma yang lebih cocok.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <PillButton as={Link} to="/app/topik">
            Coba Kartu Topik
          </PillButton>
          <PillButton as={Link} to="/app/kotak-waktu" variant="blue">
            Coba Kotak Waktu
          </PillButton>
        </div>
      </motion.section>

      <footer className="border-t border-cream-deep px-5 py-8 text-center text-xs text-ink-soft">
        Obrolin & Kotak Waktu — dibuat buat pasangan Indonesia yang mau lebih sering ngobrol.
        <br />
        <Link to="/privasi" className="mt-1 inline-block font-semibold text-terracotta-deep underline">
          Kebijakan Privasi
        </Link>
      </footer>
    </div>
  )
}
