// Data kartu topik "Obrolin". Konten nyata & spesifik konteks Indonesia
// (bukan placeholder generik) — lihat spesifikasi produk.
// `phases` menandai fase hubungan mana yang paling relevan untuk topik ini.
//
// `videoUrl` / `articles` = konten pemantik nyata (video YouTube & artikel
// referensi) yang dikurasi manual per topik, BUKAN dummy — tapi tetap konten
// pihak ketiga untuk kebutuhan prototype/validasi, bukan produksi bersponsor.
// `articles[].perspective`: 'agama' (perspektif Islam) atau
// 'psikologi' (psikolog/media kesehatan-relasi) — dua sudut pandang
// disandingkan, bukan buat menyaingkan satu sama lain.

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
    videoUrl: 'https://www.youtube.com/watch?v=nZfyukoPpzU',
    videoTitle: 'Hukum Nafkah Suami terhadap Istri',
    videoChannel: 'Ustadz Dr. Khalid Basalamah, M.A.',
    articles: [
      {
        perspective: 'agama',
        url: 'https://rumaysho.com/14668-menafkahi-orang-tua-yang-tidak-mampu.html',
        title: 'Menafkahi Orang Tua yang Tidak Mampu',
        source: 'Rumaysho.com',
      },
      {
        perspective: 'psikologi',
        url: 'https://mindsetpsychology.co.id/artikel/kesiapan-finansial-pranikah-psikologi-uang',
        title: 'Kesiapan Finansial Pranikah: Cara Membicarakan Uang Tanpa Merusak Hubungan',
        source: 'Mindset Psychology',
      },
    ],
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
    videoUrl: 'https://www.youtube.com/watch?v=1nwE_F24Dq4',
    videoTitle: 'Menghadapi Mertua Tukang Ngatur dan Suka Ikut Campur',
    videoChannel: 'Buat Apa Susah (Psikiater Aimee Nugroho)',
    articles: [
      {
        perspective: 'agama',
        url: 'https://konsultasisyariah.com/17614-3-hal-yang-wajib-dihindari-dalam-pertengkaran-rumah-tangga.html',
        title: '3 Hal yang Wajib Dihindari dalam Pertengkaran Rumah Tangga',
        source: 'KonsultasiSyariah.com',
      },
      {
        perspective: 'psikologi',
        url: 'https://mindsetpsychology.co.id/artikel/cara-menetapkan-batasan-boundaries-sehat-dengan-mertua-tanpa-memicu-konflik',
        title: 'Cara Menetapkan Batasan (Boundaries) Sehat dengan Mertua Tanpa Memicu Konflik',
        source: 'Mindset Psychology',
      },
    ],
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
    videoUrl: 'https://www.youtube.com/watch?v=aRTABvIC8xo',
    videoTitle: 'Beda Pola Asuh Antara Ayah dan Ibu, Apakah Wajar?',
    videoChannel: 'dr Aisah Dahlan CHt',
    articles: [
      {
        perspective: 'agama',
        url: 'https://muslim.or.id/20835-pendidikan-anak-tanggung-jawab-siapa.html',
        title: 'Pendidikan Anak, Tanggung Jawab Siapa?',
        source: 'Muslim.or.id',
      },
      {
        perspective: 'psikologi',
        url: 'https://psikologi.uici.ac.id/2026/02/22/rahasia-hubungan-harmonis-suami-istri-dalam-mendidik-anak-kunci-keluarga-bahagia-dan-anak-tumbuh-optimal/',
        title: 'Rahasia Hubungan Harmonis Suami Istri dalam Mendidik Anak',
        source: 'Psikologi UICI',
      },
    ],
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
    videoUrl: 'https://www.youtube.com/watch?v=AupORy2Yxuw',
    videoTitle: 'Suami Berhenti Kerja, Begini Cara Kelola Keuangan Rumah Tangga',
    videoChannel: 'YouTube',
    articles: [
      {
        perspective: 'agama',
        url: 'https://muslim.or.id/98098-ketika-istri-bekerja.html',
        title: 'Ketika Istri Bekerja',
        source: 'Muslim.or.id',
      },
      {
        perspective: 'psikologi',
        url: 'https://www.ibupedia.com/artikel/keluarga/4-pertimbangan-sebelum-ibu-memutuskan-resign-kerja',
        title: '4 Pertimbangan Sebelum Ibu Memutuskan Resign Kerja',
        source: 'Ibupedia',
      },
    ],
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
    videoUrl: 'https://www.youtube.com/watch?v=8BvGjvt1utE',
    videoTitle: 'Tips Menghindari Konflik Dengan Pasangan',
    videoChannel: 'Dunia Parenting Indonesia (Rena Masri, S.Psi., M.Si., Psikolog)',
    articles: [
      {
        perspective: 'agama',
        url: 'https://rumaysho.com/16156-5-kiat-meredam-marah.html',
        title: '5 Kiat Meredam Marah',
        source: 'Rumaysho.com',
      },
      {
        perspective: 'psikologi',
        url: 'https://www.klikdokter.com/psikologi/relationship/tips-komunikasi-yang-efektif-saat-berkonflik-dengan-pasangan',
        title: 'Tips Komunikasi yang Efektif saat Berkonflik dengan Pasangan',
        source: 'KlikDokter',
      },
    ],
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
    videoUrl: 'https://www.youtube.com/watch?v=TvJrTQHC2iQ',
    videoTitle: 'Rumah Tangga Retak karena Penghasilan Istri Lebih Besar dari Suami, Bagaimana Solusinya?',
    videoChannel: 'Al-Bahjah TV',
    articles: [
      {
        perspective: 'agama',
        url: 'https://muslim.or.id/111586-istri-lebih-kaya-dan-lebih-berilmu-dari-suami-apakah-qiwamah-masih-relevan.html',
        title: 'Istri Lebih Kaya dan Berilmu dari Suami: Apakah Qiwamah Masih Relevan?',
        source: 'Muslim.or.id',
      },
      {
        perspective: 'psikologi',
        url: 'https://www.tabloidbintang.com/gaya-hidup/217170-studi-ungkap-dampak-istri-berpenghasilan-lebih-tinggi-dari-suami-benarkah-bisa-memengaruhi-hubungan',
        title: 'Studi Ungkap Dampak Istri Berpenghasilan Lebih Tinggi dari Suami',
        source: 'Tabloid Bintang',
      },
    ],
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
    videoUrl: 'https://www.youtube.com/watch?v=uXgy2QGADsk',
    videoTitle: '5 Tipe Pengaturan Keuangan untuk Suami Istri, Tipe Mana yang Adil dan Buat Bahagia?',
    videoChannel: 'ZAP Finance',
    articles: [
      {
        perspective: 'agama',
        url: 'https://rumaysho.com/41885-haruskah-suami-terbuka-soal-gaji-ini-jawaban-syariat-dan-solusi-rumah-tangga.html',
        title: 'Haruskah Suami Terbuka Soal Gaji? Ini Jawaban Syariat dan Solusi Rumah Tangga',
        source: 'Rumaysho.com',
      },
      {
        perspective: 'psikologi',
        url: 'https://www.finetiks.com/blog/tips-mengelola-keuangan-keluarga-satu-pintu-kunci-rumah-tangga-harmonis',
        title: 'Tips Mengelola Keuangan Keluarga Satu Pintu: Kunci Rumah Tangga Harmonis',
        source: 'Finetiks',
      },
    ],
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
    videoUrl: 'https://www.youtube.com/watch?v=cTPFPEBimYA',
    videoTitle: "Mom's Meet Up — Tinggal Bareng Mertua vs Rumah Sendiri",
    videoChannel: "Mom's Meet Up",
    articles: [
      {
        perspective: 'agama',
        url: 'https://konsultasisyariah.com/39815-setelah-menikah-lebih-baik-pisah-rumah-dengan-orang-tua-atau-serumah.html',
        title: 'Setelah Menikah Lebih Baik Pisah Rumah dengan Orang Tua atau Serumah?',
        source: 'KonsultasiSyariah.com',
      },
      {
        perspective: 'psikologi',
        url: 'https://www.kalindoland.co.id/read-plus-minus-tinggal-bersama-orang-tua-setelah-menikah-270.html',
        title: 'Plus Minus Tinggal Bersama Orang Tua Setelah Menikah',
        source: 'Kalindoland',
      },
    ],
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
    videoUrl: 'https://www.youtube.com/watch?v=2QEnPY7tUtA',
    videoTitle: 'Buat Bapak-Bapak!! Pekerjaan Rumah Tangga Bukan Kewajiban Istri',
    videoChannel: 'Mamah Dedeh (SIRQOL)',
    articles: [
      {
        perspective: 'agama',
        url: 'https://muslim.or.id/39376-sunnah-membantu-istri-di-rumah.html',
        title: 'Sunnah Membantu Istri di Rumah',
        source: 'Muslim.or.id',
      },
      {
        perspective: 'psikologi',
        url: 'https://www.logosconsulting.co.id/media/dalam-pernikahan-bagaimana-cara-membagi-tugas-dan-tanggung-jawab-secara-adil/',
        title: 'Dalam Pernikahan: Bagaimana Cara Membagi Tugas dan Tanggung Jawab Secara Adil?',
        source: 'Logos Consulting',
      },
    ],
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
    videoUrl: 'https://www.youtube.com/watch?v=CrVnBH_pkJQ',
    videoTitle: 'Mengatasi Jenuh / Bosan Dalam Rumah Tangga',
    videoChannel: 'dr Aisah Dahlan CHt',
    articles: [
      {
        perspective: 'agama',
        url: 'https://rumaysho.com/8896-pujilah-istrimu.html',
        title: 'Pujilah Istrimu',
        source: 'Rumaysho.com',
      },
      {
        perspective: 'psikologi',
        url: 'https://www.halodoc.com/artikel/monoton-dalam-hubungan-ini-cara-bangkitkan-percikan',
        title: 'Monoton dalam Hubungan? Ini Cara Bangkitkan Percikan',
        source: 'Halodoc',
      },
    ],
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
    videoUrl: 'https://www.youtube.com/watch?v=0ZfuDt4KMwA',
    videoTitle: 'Checklist Kesiapan Finansial dan Mental Sebelum Menikah',
    videoChannel: 'POD. RUANG TUNGGU',
    articles: [
      {
        perspective: 'agama',
        url: 'https://muslim.or.id/1055-seperti-apa-keluarga-berencana-islami.html',
        title: 'Seperti Apa Keluarga Berencana Islami?',
        source: 'Muslim.or.id',
      },
      {
        perspective: 'psikologi',
        url: 'https://hellosehat.com/kehamilan/kesuburan/program-hamil/mempertimbangkan-punya-anak-banyak/',
        title: '5 Pertimbangan Sebelum Memutuskan Punya Anak Banyak',
        source: 'Hello Sehat',
      },
    ],
  },
]

export function getTopicById(id) {
  return TOPICS.find((t) => t.id === id) ?? null
}

export function getTopicsByPhase(phaseId) {
  return TOPICS.filter((t) => t.phases.includes(phaseId))
}
