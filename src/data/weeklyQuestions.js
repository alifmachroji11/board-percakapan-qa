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
]

export function getWeeklyQuestion(week) {
  return WEEKLY_QUESTIONS.find((q) => q.week === week) ?? null
}
