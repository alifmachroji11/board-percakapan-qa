// Data pertanyaan mingguan "Kotak Waktu". Urut berdasar nomor minggu (1-based).
// Di produk asli, satu pertanyaan dikirim per minggu lewat notifikasi.
// Di prototype ini urutan disimulasikan lewat panel "MODE DEMO".

export const WEEKLY_QUESTIONS = [
  {
    week: 1,
    question:
      'Kalau orang tua kita butuh bantuan finansial besar suatu hari, gimana kita berdua mau menyikapinya?',
  },
  {
    week: 2,
    question:
      'Hal apa dari cara orang tuamu dulu berumah tangga yang pengen kamu bawa, dan yang pengen kamu hindari?',
  },
  {
    week: 3,
    question: 'Kapan terakhir kali kamu merasa didengar sama aku, dan kapan merasa nggak?',
  },
  {
    week: 4,
    question: 'Kalau salah satu dari kita harus pindah kota demi karier, gimana kita mutusinnya bareng?',
  },
  {
    week: 5,
    question:
      'Apa satu hal kecil yang aku lakukan yang bikin kamu ngerasa dicintai, yang mungkin belum pernah aku tahu?',
  },
  {
    week: 6,
    question:
      'Kalau kita capek sama rutinitas, apa yang biasanya bikin kita berdua ngerasa "connect" lagi?',
  },
  {
    week: 7,
    question:
      'Ada nggak kebiasaan soal uang dari keluarga masing-masing yang bikin kita beda pandangan?',
  },
  {
    week: 8,
    question: 'Gimana perasaanmu soal cara kita berdua nyelesain konflik selama ini?',
  },
  {
    week: 9,
    question: 'Apa yang kamu takutin soal masa depan kita, yang belum pernah kamu omongin?',
  },
  {
    week: 10,
    question: 'Kalau salah satu dari kita sakit parah suatu hari, gimana kita mau saling jagain?',
  },
]

export function getWeeklyQuestion(week) {
  return WEEKLY_QUESTIONS.find((q) => q.week === week) ?? null
}
