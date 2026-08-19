// ============================================================
// DATA DUMMY — simulasi pasangan kedua.
// Prototype ini dites oleh SATU orang, jadi jawaban "pasangan"
// di bawah ini dummy, dipakai lewat panel "MODE DEMO".
// Saat backend asli ada, ganti seluruh file ini dengan data
// pasangan sungguhan dari akun/pairing kedua user.
// ============================================================

export const PARTNER_NAME = 'Dinda'

const GENERIC_ANSWERS = [
  'Aku juga sebenernya udah lama mikirin ini, tapi belum nemu waktu yang pas buat ngomong.',
  'Jujur ini bikin aku agak deg-degan jawabnya, tapi aku coba jujur sejujur-jujurnya ya.',
  'Menurutku ini penting banget dibahas berdua, dan aku seneng kita akhirnya coba ngobrolin ini.',
]

const ANSWERS_BY_ENTRY_ID = {
  // kunci pakai id topik / "minggu-<n>" — lihat src/lib/storage.js
  'topik-uang-orang-tua':
    'Aku nyaman kok kirim ke rumah, cuma pengen kita samain angka pastinya biar nggak dadakan tiap bulan.',
  'topik-keterlibatan-mertua':
    'Aku pengen orang tua tetap dilibatkan, tapi keputusan akhir tetap kita berdua yang pegang.',
  'topik-keputusan-anak':
    'Aku mau kita berdua sama-sama belajar bareng, bukan salah satu ngerasa lebih "berkuasa".',
  'topik-resign-demi-keluarga':
    'Buat aku yang penting itu keputusannya dipikir bareng, bukan siapa yang "harus ngalah".',
  'topik-cara-marah':
    'Kalau aku marah biasanya jadi lebih banyak ngomong. Aku butuh kamu dengerin dulu sebelum kasih solusi.',
  'topik-rezeki-tidak-sama':
    'Buatku itu nggak masalah selama kita berdua ngerasa adil, bukan soal siapa lebih besar.',
}

/**
 * Ambil jawaban dummy pasangan untuk satu entry.
 * NOTE: fungsi ini simulasi — di produk asli ini diganti data
 * jawaban pasangan sungguhan dari server.
 */
export function getDummyPartnerAnswer(entryId) {
  if (ANSWERS_BY_ENTRY_ID[entryId]) return ANSWERS_BY_ENTRY_ID[entryId]
  const idx = Math.abs(hashString(entryId)) % GENERIC_ANSWERS.length
  return GENERIC_ANSWERS[idx]
}

function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return hash
}
