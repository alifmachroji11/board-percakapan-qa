# Obrolin & Kotak Waktu

Prototype interaktif tahap validasi (pre-MVP) buat sesi user testing dengan pasangan Indonesia
nyata — bukan produk final. Menggabungkan dua konsep produk dalam satu app:

- **Kartu Topik** (Obrolin) — pilih topik terkurasi sesuai fase hubungan, tonton video pemantik
  singkat, tulis jawaban di jurnal privat, baru buka bareng pasangan.
- **Kotak Waktu** — satu pertanyaan tiap minggu, jawab sendiri dulu tanpa lihat jawaban pasangan,
  buka bareng di waktu yang kalian jadwalkan sendiri.

Belum ada backend/login sungguhan — semua state disimpan di `localStorage` lewat `src/lib/storage.js`,
dan pasangan kedua disimulasikan lewat data dummy (`src/data/dummyPartner.js`) yang jelas ditandai
lewat panel "MODE DEMO" di produknya.

## Jalankan

```
npm install
npm run dev
```

Buka `http://localhost:5173`. Landing page ada di `/`, product flow ada di `/app`.

## Struktur

- `src/pages/Landing.jsx` — landing page marketing gabungan kedua konsep.
- `src/pages/topik/` — alur Kartu Topik (pilih fase → detail → jurnal → buka bareng).
- `src/pages/kotakwaktu/` — alur Kotak Waktu (pertanyaan minggu → jurnal → buka bareng).
- `src/pages/Riwayat.jsx` — riwayat topik & minggu yang pernah dibahas.
- `src/data/` — data topik, pertanyaan mingguan, dan jawaban dummy pasangan.
- `src/lib/storage.js` — lapisan state di localStorage, dirancang gampang diganti backend asli.
