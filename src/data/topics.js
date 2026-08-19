// Data kartu topik "Obrolin". Konten nyata & spesifik konteks Indonesia
// (bukan placeholder generik) — lihat spesifikasi produk.
// `phases` menandai fase hubungan mana yang paling relevan untuk topik ini.
//
// `videoUrl` / `articleUrl` = konten pemantik nyata (video YouTube & artikel
// referensi) yang dikurasi manual per topik, BUKAN dummy — tapi tetap konten
// pihak ketiga untuk kebutuhan prototype/validasi, bukan produksi bersponsor.

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
    videoBlurb:
      'Konteks singkat soal kenapa topik ini sering ditunda, plus 2-3 contoh kalimat pembuka yang nggak terasa menuduh.',
    openerExample:
      '"Aku pengen kita samain dulu gambaran, sebenernya berapa yang biasanya kamu kirim ke rumah tiap bulan?"',
    videoUrl: null,
    videoTitle: null,
    videoChannel: null,
    articleUrl: null,
    articleTitle: null,
    articleSource: null,
  },
  {
    id: 'keterlibatan-mertua',
    category: 'Keluarga besar',
    phases: ['pra-nikah', 'pengantin-baru'],
    title: 'Seberapa banyak keterlibatan mertua yang kita berdua nyaman?',
    videoBlurb:
      'Bahas batasan yang sehat antara "menghormati orang tua" dan "keputusan tetap di tangan kita berdua".',
    openerExample:
      '"Kalau nanti ada keputusan rumah tangga kita, gimana enaknya soal ngajak orang tua diskusi dulu apa nggak?"',
    videoUrl: null,
    videoTitle: null,
    videoChannel: null,
    articleUrl: null,
    articleTitle: null,
    articleSource: null,
  },
  {
    id: 'keputusan-anak',
    category: 'Anak & keluarga',
    phases: ['pengantin-baru', 'lama-menikah'],
    title: 'Siapa yang pegang keputusan besar soal anak nanti?',
    videoBlurb:
      'Bukan soal siapa "menang", tapi gimana kita berdua tetap merasa didengar saat pendapat beda soal parenting.',
    openerExample:
      '"Kalau nanti kita beda pendapat soal cara didik anak, gimana kita mau mutusinnya bareng?"',
    videoUrl: null,
    videoTitle: null,
    videoChannel: null,
    articleUrl: null,
    articleTitle: null,
    articleSource: null,
  },
  {
    id: 'resign-demi-keluarga',
    category: 'Karier',
    phases: ['pengantin-baru', 'lama-menikah'],
    title: 'Kalau salah satu harus resign demi keluarga, gimana kita mutusinnya?',
    videoBlurb:
      'Contoh kalimat buat bahas skenario ini sebelum jadi keputusan mendadak di tengah situasi genting.',
    openerExample:
      '"Kalau suatu saat salah satu dari kita harus berhenti kerja, apa yang bakal jadi pertimbangan utama kita?"',
    videoUrl: null,
    videoTitle: null,
    videoChannel: null,
    articleUrl: null,
    articleTitle: null,
    articleSource: null,
  },
  {
    id: 'cara-marah',
    category: 'Komunikasi',
    phases: ['pra-nikah', 'pengantin-baru', 'lama-menikah'],
    title: 'Cara kamu marah itu kayak gimana, dan gimana aku sebaiknya nanggepin?',
    videoBlurb:
      'Mengenali pola marah masing-masing supaya konflik kecil nggak berubah jadi bola salju.',
    openerExample:
      '"Kalau aku lagi kesel, aku biasanya diem dulu. Kamu gimana, dan kamu maunya aku respon apa?"',
    videoUrl: null,
    videoTitle: null,
    videoChannel: null,
    articleUrl: null,
    articleTitle: null,
    articleSource: null,
  },
  {
    id: 'rezeki-tidak-sama',
    category: 'Keuangan',
    phases: ['pra-nikah', 'pengantin-baru'],
    title: 'Kalau nanti rezeki kita gak sama besar, gimana kita mandang itu?',
    videoBlurb:
      'Ngobrolin ekspektasi soal kontribusi finansial sebelum jadi sumber gengsi diam-diam.',
    openerExample:
      '"Kalau penghasilan kita beda jauh suatu saat nanti, apa itu bakal ganggu buat kamu? Kenapa?"',
    videoUrl: null,
    videoTitle: null,
    videoChannel: null,
    articleUrl: null,
    articleTitle: null,
    articleSource: null,
  },
  {
    id: 'kendali-keuangan',
    category: 'Keuangan',
    phases: ['pengantin-baru', 'lama-menikah'],
    title: 'Gimana kita nentuin siapa yang pegang kendali keuangan bulanan?',
    videoBlurb:
      'Bahas model pengelolaan keuangan rumah tangga (satu pintu, rekening bersama, atau split) yang paling cocok buat kalian berdua.',
    openerExample:
      '"Menurut kamu enaknya gimana, gaji kita digabung semua atau tetap ada yang dipegang masing-masing?"',
    videoUrl: null,
    videoTitle: null,
    videoChannel: null,
    articleUrl: null,
    articleTitle: null,
    articleSource: null,
  },
  {
    id: 'tinggal-dekat-siapa',
    category: 'Keluarga besar',
    phases: ['pra-nikah', 'pengantin-baru'],
    title: 'Kita mau tinggal deket orang tua siapa, atau pisah rumah?',
    videoBlurb:
      'Pertimbangan yang sering luput: bukan cuma soal jarak, tapi ekspektasi keterlibatan sehari-hari dari masing-masing keluarga.',
    openerExample:
      '"Kalau kita bisa milih bebas, kamu ngebayangin kita tinggal di mana, deket siapa?"',
    videoUrl: null,
    videoTitle: null,
    videoChannel: null,
    articleUrl: null,
    articleTitle: null,
    articleSource: null,
  },
  {
    id: 'bagi-tugas-rumah',
    category: 'Rumah tangga',
    phases: ['pengantin-baru', 'lama-menikah'],
    title: 'Gimana kita bagi tugas rumah tangga biar adil buat kita berdua?',
    videoBlurb:
      'Ngobrolin beban kerja domestik yang sering nggak keliatan, biar nggak ada yang diam-diam ngerasa lebih capek.',
    openerExample:
      '"Kalau kita list semua kerjaan rumah, kira-kira siapa yang selama ini megang paling banyak?"',
    videoUrl: null,
    videoTitle: null,
    videoChannel: null,
    articleUrl: null,
    articleTitle: null,
    articleSource: null,
  },
  {
    id: 'hubungan-monoton',
    category: 'Keintiman',
    phases: ['lama-menikah'],
    title: 'Kalau salah satu ngerasa hubungan kita mulai monoton, gimana cara ngomonginnya?',
    videoBlurb:
      'Cara buka obrolan soal rasa "jenuh" tanpa bikin pasangan defensif atau ngerasa disalahkan.',
    openerExample:
      '"Akhir-akhir ini aku ngerasa kita jalan otomatis aja. Kamu ngerasa gitu juga nggak?"',
    videoUrl: null,
    videoTitle: null,
    videoChannel: null,
    articleUrl: null,
    articleTitle: null,
    articleSource: null,
  },
  {
    id: 'rencana-anak',
    category: 'Anak & keluarga',
    phases: ['pra-nikah', 'pengantin-baru'],
    title: 'Berapa anak yang kita berdua pengen, dan kapan waktunya?',
    videoBlurb:
      'Menyamakan gambaran jumlah & waktu punya anak sebelum jadi asumsi yang ternyata beda jauh.',
    openerExample:
      '"Kalau ngebayangin keluarga kita nanti, kamu kebayang ada berapa anak, dan kapan mulainya?"',
    videoUrl: null,
    videoTitle: null,
    videoChannel: null,
    articleUrl: null,
    articleTitle: null,
    articleSource: null,
  },
]

export function getTopicById(id) {
  return TOPICS.find((t) => t.id === id) ?? null
}

export function getTopicsByPhase(phaseId) {
  return TOPICS.filter((t) => t.phases.includes(phaseId))
}
