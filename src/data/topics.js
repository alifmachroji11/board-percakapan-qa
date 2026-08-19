// Data kartu topik "Obrolin". Konten nyata & spesifik konteks Indonesia
// (bukan placeholder generik) — lihat spesifikasi produk.
// `phases` menandai fase hubungan mana yang paling relevan untuk topik ini.

export const PHASES = [
  { id: 'pra-nikah', label: 'Pra-nikah' },
  { id: 'pengantin-baru', label: 'Pengantin baru' },
  { id: 'lama-menikah', label: 'Sudah lama menikah' },
]

export const TOPICS = [
  {
    id: 'uang-orang-tua',
    category: 'Keuangan',
    phases: ['pra-nikah', 'pengantin-baru'],
    title: 'Gimana kita atur uang kalau salah satu masih kirim ke orang tua?',
    // NOTE: video pemantik = placeholder untuk prototype, ganti dengan video asli nanti
    videoDuration: '2:30',
    videoBlurb:
      'Konteks singkat soal kenapa topik ini sering ditunda, plus 2-3 contoh kalimat pembuka yang nggak terasa menuduh.',
    openerExample:
      '"Aku pengen kita samain dulu gambaran, sebenernya berapa yang biasanya kamu kirim ke rumah tiap bulan?"',
  },
  {
    id: 'keterlibatan-mertua',
    category: 'Keluarga besar',
    phases: ['pra-nikah', 'pengantin-baru'],
    title: 'Seberapa banyak keterlibatan mertua yang kita berdua nyaman?',
    videoDuration: '2:45',
    videoBlurb:
      'Bahas batasan yang sehat antara "menghormati orang tua" dan "keputusan tetap di tangan kita berdua".',
    openerExample:
      '"Kalau nanti ada keputusan rumah tangga kita, gimana enaknya soal ngajak orang tua diskusi dulu apa nggak?"',
  },
  {
    id: 'keputusan-anak',
    category: 'Anak & keluarga',
    phases: ['pengantin-baru', 'lama-menikah'],
    title: 'Siapa yang pegang keputusan besar soal anak nanti?',
    videoDuration: '2:20',
    videoBlurb:
      'Bukan soal siapa "menang", tapi gimana kita berdua tetap merasa didengar saat pendapat beda soal parenting.',
    openerExample:
      '"Kalau nanti kita beda pendapat soal cara didik anak, gimana kita mau mutusinnya bareng?"',
  },
  {
    id: 'resign-demi-keluarga',
    category: 'Karier',
    phases: ['pengantin-baru', 'lama-menikah'],
    title: 'Kalau salah satu harus resign demi keluarga, gimana kita mutusinnya?',
    videoDuration: '2:50',
    videoBlurb:
      'Contoh kalimat buat bahas skenario ini sebelum jadi keputusan mendadak di tengah situasi genting.',
    openerExample:
      '"Kalau suatu saat salah satu dari kita harus berhenti kerja, apa yang bakal jadi pertimbangan utama kita?"',
  },
  {
    id: 'cara-marah',
    category: 'Komunikasi',
    phases: ['pra-nikah', 'pengantin-baru', 'lama-menikah'],
    title: 'Cara kamu marah itu kayak gimana, dan gimana aku sebaiknya nanggepin?',
    videoDuration: '2:15',
    videoBlurb:
      'Mengenali pola marah masing-masing supaya konflik kecil nggak berubah jadi bola salju.',
    openerExample:
      '"Kalau aku lagi kesel, aku biasanya diem dulu. Kamu gimana, dan kamu maunya aku respon apa?"',
  },
  {
    id: 'rezeki-tidak-sama',
    category: 'Keuangan',
    phases: ['pra-nikah', 'pengantin-baru'],
    title: 'Kalau nanti rezeki kita gak sama besar, gimana kita mandang itu?',
    videoDuration: '2:35',
    videoBlurb:
      'Ngobrolin ekspektasi soal kontribusi finansial sebelum jadi sumber gengsi diam-diam.',
    openerExample:
      '"Kalau penghasilan kita beda jauh suatu saat nanti, apa itu bakal ganggu buat kamu? Kenapa?"',
  },
]

export function getTopicById(id) {
  return TOPICS.find((t) => t.id === id) ?? null
}

export function getTopicsByPhase(phaseId) {
  return TOPICS.filter((t) => t.phases.includes(phaseId))
}
