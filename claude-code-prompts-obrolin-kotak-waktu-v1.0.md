# Claude Code Terminal Prompts: Obrolin & Kotak Waktu

**Versi:** 1.0
**Status:** Prompt siap pakai untuk Claude Code Terminal — untuk membangun *prototype interaktif* (landing page + alur produk inti), bukan produk produksi final. Disusun dari seluruh dokumen riset project (landscape brief, observe persona, synthesize tema, product brief, diverge 5 konsep, claude design prompts v1.0).

---

## Catatan Jujur Sebelum Mulai

Beberapa hal yang perlu kamu tahu sebelum menjalankan prompt ini, supaya ekspektasinya tepat:

1. **Semua insight dasar di project ini masih 🔴/🟡 (hipotesis/pola, belum tervalidasi lewat wawancara user asli).** Artinya prototype ini fungsinya untuk *menguji* insight itu ke user nyata — bukan membangun di atas fondasi yang sudah pasti benar. Kalau nanti hasil user testing bilang "rasa aman" bukan hambatan utama, banyak keputusan desain di bawah ini perlu direvisi.
2. Claude Code Terminal akan generate **kode sungguhan** (bukan cuma mockup visual seperti Claude Design) — jadi prompt saya susun dengan asumsi kamu mau prototype yang *bisa diklik dan dicoba*, dengan data dummy/local storage dulu (belum perlu backend production).
3. Saya pisahkan strategi state management dari masing-masing konsep karena mekanismenya beda secara fundamental: Obrolin itu eksplorasi-bebas (pilih kartu kapan saja), Kotak Waktu itu ritme-terjadwal (sistem yang dorong). Ini bukan detail kosmetik — ini pengaruh ke struktur data & flow-nya.
4. Soal autentikasi/login: saya taruh rekomendasi terpisah di bagian paling bawah (setelah dua prompt), karena ini keputusan yang mempengaruhi kedua konsep dan menurut saya sebaiknya diputuskan sebelum kamu run promptnya, bukan sesudah — supaya Claude Code langsung generate flow yang benar dari awal.

---

## Prompt 1 — Obrolin (Prototype Interaktif)

Copy-paste blok di bawah ini langsung ke Claude Code Terminal di root folder project baru.

```
GOAL
Bangun prototype web app interaktif bernama "Obrolin" — sebuah mobile-first responsive web app yang membantu pasangan Indonesia (pra-nikah maupun sudah menikah) memulai obrolan penting yang selama ini mereka hindari, lewat kartu topik terkurasi + video pemantik singkat + jurnal privat per orang. Ini adalah prototype tahap validasi (pre-MVP) untuk diuji ke calon pengguna nyata — jadi harus terasa seperti produk sungguhan yang bisa diklik dan dicoba end-to-end, bukan cuma landing page statis. Gunakan React + Tailwind CSS. Data boleh disimpan di local state/localStorage (belum perlu backend/database sungguhan di tahap ini) — tapi struktur data harus rapi dan mudah diganti ke backend asli nanti.

Bangun DUA bagian:
1. Landing page (marketing/validasi minat) — untuk pengunjung yang belum jadi user
2. Alur produk inti (product flow) yang bisa dicoba langsung — untuk simulasi pengalaman pakai Obrolin sungguhan

CONTENT

Bagian 1 — Landing Page:
1. Hero section — headline yang menangkap pain point inti (bukan kurang topik untuk dibicarakan, tapi kurang rasa aman untuk memulai). Contoh arah: "Ada yang belum kalian bicarakan berdua?" Subheadline jelaskan singkat apa itu Obrolin. Satu CTA utama "Coba Obrolin" yang membawa ke product flow (bukan sekadar form waitlist — biarkan pengunjung benar-benar mencoba).
2. Problem framing — 2-3 baris singkat yang memvalidasi bahwa menunda obrolan penting itu wajar dialami pasangan Indonesia (nada tidak menghakimi), sertakan satu data poin ringan (contoh: "62% kasus perceraian di Indonesia disebabkan perselisihan yang terus-menerus, bukan insiden besar" — pakai sebagai konteks, bukan menakut-nakuti).
3. Cara kerja (3 langkah) — Pilih topik dari kartu yang sudah dikurasi sesuai fase hubunganmu → Tonton video pemantik singkat (2-3 menit) untuk konteks & contoh kalimat pembuka → Tulis jawabanmu di jurnal privat, baru dibuka bareng pasangan saat kalian berdua siap.
4. Preview kartu topik — tampilkan minimal 6 kartu topik nyata & spesifik konteks Indonesia (bukan placeholder generik), contoh: "Gimana kita atur uang kalau salah satu masih kirim ke orang tua?", "Seberapa banyak keterlibatan mertua yang kita berdua nyaman?", "Siapa yang pegang keputusan besar soal anak nanti?", "Kalau salah satu harus resign demi keluarga, gimana kita mutusinnya?", "Cara kamu marah itu kayak gimana, dan gimana aku sebaiknya nanggepin?", "Kalau nanti rezeki kita gak sama besar, gimana kita mandang itu?"
5. Kenapa jurnal privat dulu — section singkat yang menjelaskan filosofi "jawab sendiri dulu, baru dibuka bareng".
6. Testimonial placeholder — 2 kutipan dummy nada relatable (tandai jelas di komentar kode bahwa ini data dummy untuk prototype, perlu diganti testimoni asli setelah user testing).
7. FAQ (4 pertanyaan) — termasuk "Apakah ini pengganti konseling profesional?" (jawab: tidak, pelengkap untuk obrolan sehari-hari, bukan pengganti bantuan profesional untuk krisis/kekerasan dalam rumah tangga — kalau situasi kamu darurat, cari bantuan profesional/hotline segera).
8. CTA penutup — nada hangat, bukan mendesak.

Bagian 2 — Product Flow (bisa dicoba langsung):
1. Halaman pilih kartu topik — grid/scroll kartu topik dikelompokkan per fase hubungan (pra-nikah / pengantin baru / sudah lama menikah). User pilih satu fase dulu (simulasikan lewat toggle/tab sederhana, tidak perlu akun sungguhan — lihat bagian rekomendasi login terpisah).
2. Halaman detail kartu — saat kartu diklik, tampilkan: judul topik, player video placeholder (pakai placeholder visual dengan durasi dummy "2:30", tidak perlu video sungguhan), lalu tombol "Tulis jawabanku".
3. Halaman jurnal privat — textarea untuk menulis jawaban, dengan indikator jelas "Jawaban ini terkunci sampai kalian berdua submit" dan status "Menunggu jawaban [nama pasangan]" (simulasikan pasangan kedua dengan data dummy sudah/belum submit).
4. Halaman "buka bareng" — setelah simulasi kedua pihak submit, tampilkan kedua jawaban berdampingan dengan transisi/reveal yang halus (tidak instan/kaku — beri jeda visual kecil supaya terasa seperti momen, bukan sekadar loading data).
5. Halaman riwayat — daftar topik yang sudah pernah dibahas, dengan status (belum dibahas / sedang menunggu pasangan / sudah dibuka bareng).

LAYOUT
Mobile-first, satu kolom vertikal, base width 390-430px lalu responsive melebar untuk tablet/desktop (breakpoint standar Tailwind: sm/md/lg). Banyak whitespace — jangan padat. Kartu topik: rounded-xl ke atas, shadow halus (bukan hard border), grid 2 kolom di mobile atau horizontal scroll dengan snap. Tombol CTA: pill/rounded-full, warna kontras lembut (hindari merah alarm). Ikon: line-art sederhana dan bulat (pakai lucide-react), bukan tajam/geometris keras. Navigasi antar halaman product flow pakai transisi halus (fade/slide ringan), bukan perpindahan instan yang terasa kasar — ini penting karena topiknya sensitif, transisi kasar bikin terasa seperti aplikasi form biasa.

AUDIENCE
Pasangan Indonesia usia akhir 20-an hingga 30-an, melek digital, mayoritas akses lewat HP bukan desktop. Skeptis terhadap sesuatu yang terasa terlalu formal/klinis (seperti materi konseling institusional), tapi juga tidak mau sesuatu yang terasa seperti "app kencan" atau playful berlebihan — mereka sedang membicarakan hal serius (masa depan hubungan mereka).

CONTEXT
Ini prototype tahap validasi awal (pre-MVP) — tujuan utamanya adalah dipakai untuk sesi user testing dengan calon pengguna nyata, jadi harus benar-benar bisa diklik dan dicoba, bukan cuma indah dilihat. Visual harus terasa effortless: bersih, tidak membuat user merasa harus "usaha" untuk memahami atau memulai. Palet warna hangat & lembut (terracotta, krem, sage green, dusty pink, kombinasi earthy tone) — hindari biru korporat gelap atau abu-abu formal yang terkesan aplikasi kesehatan mental klinis atau aplikasi finansial serius. Font sans-serif hangat dan mudah dibaca (contoh: Inter, Plus Jakarta Sans, atau sejenis — hindari font yang terkesan korporat/tegas). Tambahkan komentar di kode pada bagian-bagian yang menggunakan data dummy (video, testimoni, simulasi pasangan kedua) supaya jelas mana yang perlu diganti data asli nanti.
```

---

## Prompt 2 — Kotak Waktu (Prototype Interaktif)

Copy-paste blok di bawah ini ke Claude Code Terminal (folder project terpisah dari Obrolin, atau sebagai route berbeda kalau kamu mau bandingkan dua konsep dalam satu app — sebutkan preferensimu ke Claude Code sebelum run kalau begitu).

```
GOAL
Bangun prototype web app interaktif bernama "Kotak Waktu" — sebuah mobile-first responsive web app yang mengirim satu pertanyaan penting per minggu ke pasangan Indonesia, masing-masing menjawab secara privat tanpa tahu jawaban pasangan, lalu jawaban "dibuka" bersama di waktu yang mereka jadwalkan sendiri — seperti kapsul waktu mini. Ini prototype tahap validasi (pre-MVP), harus bisa disimulasikan end-to-end oleh satu orang penguji (tidak perlu dua device sungguhan — simulasikan pasangan kedua lewat data dummy yang jelas ditandai di kode). Gunakan React + Tailwind CSS, state di local state/localStorage, struktur data rapi untuk nanti diganti backend asli.

Bangun DUA bagian:
1. Landing page (marketing/validasi minat)
2. Alur produk inti yang bisa disimulasikan — termasuk simulasi "waktu berjalan" untuk mendemokan ritme mingguan tanpa harus menunggu seminggu sungguhan

CONTENT

Bagian 1 — Landing Page:
1. Hero section — headline menonjolkan mekanisme unik "kapsul waktu" & ritme otomatis. Arah: "Satu pertanyaan penting, tiap minggu. Jawab sendiri dulu, buka bareng nanti." Subheadline jelaskan mekanismenya singkat. CTA utama "Coba minggu pertama" yang membawa ke product flow.
2. Problem framing — fokus ke masalah spesifik: mencari waktu & topik yang "tepat" untuk ngobrol itu sendiri sudah jadi hambatan. Framing Kotak Waktu menghilangkan beban itu — sistem yang mendorong ritmis, bukan pasangan yang harus berinisiatif.
3. Cara kerja (4 langkah, visualisasi timeline horizontal/vertikal) — Tiap minggu dapat satu pertanyaan lewat notifikasi → Masing-masing jawab di jurnal pribadi (jawaban pasangan tersembunyi) → Setelah keduanya submit, jawaban terkunci menunggu dibuka → Kalian pilih sendiri kapan waktu membuka & membahas bareng.
4. Preview contoh pertanyaan mingguan — minimal 5 contoh, nada personal & spesifik Indonesia: "Kalau orang tua kita butuh bantuan finansial besar suatu hari, gimana kita berdua mau menyikapinya?", "Hal apa dari cara orang tuamu dulu berumah tangga yang pengen kamu bawa, dan yang pengen kamu hindari?", "Kapan terakhir kali kamu merasa didengar sama aku, dan kapan merasa nggak?", "Kalau salah satu dari kita harus pindah kota demi karier, gimana kita mutusinnya bareng?", "Apa satu hal kecil yang aku lakukan yang bikin kamu ngerasa dicintai, yang mungkin belum pernah aku tahu?"
5. Kenapa "terkunci sampai keduanya submit" itu penting — filosofi supaya jujur dulu tanpa terpengaruh jawaban pasangan.
6. Kenapa ritme mingguan (bukan sekali kelas besar) — obrolan penting bukan sesuatu yang selesai sekali duduk.
7. Testimonial placeholder (2 kutipan dummy, ditandai jelas di kode).
8. FAQ (4 pertanyaan) — termasuk "Kalau minggu ini lagi sibuk banget, gimana?" (jawab: bisa dijeda, tidak ada tekanan deadline ketat) dan "Apakah ini pengganti konseling profesional?" (tidak, pelengkap untuk obrolan rutin, bukan pengganti bantuan profesional untuk krisis).
9. CTA penutup, nada hangat.

Bagian 2 — Product Flow (bisa disimulasikan):
1. Halaman "pertanyaan minggu ini" — tampilkan satu pertanyaan aktif dengan visual seperti kartu pos/kapsul kecil, status jelas: "Kamu belum jawab" / "Menunggu [nama pasangan] jawab" / "Kalian berdua sudah jawab, siap dibuka".
2. Halaman jawab — textarea jurnal privat, dengan elemen visual "terkunci" (ikon gembok halus atau blur ringan pada preview jawaban pasangan) untuk memperkuat rasa privasi sebelum dibuka bersama.
3. Simulasi kontrol waktu — sediakan tombol dev/demo yang jelas ditandai berbeda dari UI utama (misal panel kecil "Simulasi: Lompat ke minggu berikutnya" / "Simulasi: Pasangan sudah menjawab") supaya penguji bisa mendemokan siklus mingguan tanpa menunggu waktu sungguhan. Panel ini harus terlihat jelas sebagai alat demo, bukan bagian dari produk asli (styling berbeda, misal border dashed dan label "MODE DEMO").
4. Halaman "buka bareng" — reveal jawaban berdampingan dengan animasi "membuka kapsul/amplop" yang halus dan progresif, bukan instan.
5. Halaman riwayat kapsul — daftar pertanyaan minggu-minggu sebelumnya beserta status (sudah dibuka / masih terkunci menunggu / dilewati).

LAYOUT
Mobile-first satu kolom vertikal, base width 390-430px, responsive untuk tablet/desktop. Karena konsep intinya soal waktu & ritme, gunakan elemen visual timeline halus atau motif "kapsul/amplop tertutup" yang terbuka secara visual saat interaksi/scroll ke section cara kerja — beri kesan progresif seperti membuka sesuatu perlahan, bukan langsung muncul semua. Kartu pertanyaan mingguan: sudut membulat lembut, elemen visual "terkunci" yang jelas (ikon gembok/blur) sebelum dibuka. Tipografi hangat dan mudah dibaca, hindari kesan formal/klinis. Tombol CTA rounded/pill, warna kontras lembut.

AUDIENCE
Pasangan Indonesia usia akhir 20-an hingga 30-an, melek digital, terbiasa dengan notifikasi/reminder app sehari-hari (mirip habit tracker atau app jurnal). Menghargai kepraktisan — tidak punya banyak waktu untuk sesi panjang, tertarik dengan ritme kecil yang ringan dan berkelanjutan.

CONTEXT
Prototype tahap validasi awal (pre-MVP), untuk dipakai sesi user testing langsung — harus bisa disimulasikan end-to-end oleh satu penguji dalam waktu singkat (karena itu perlu panel simulasi waktu yang disebut di atas). Visual harus terasa effortless dan ringan — banyak whitespace, transisi halus (bukan ramai/penuh elemen dekoratif), nada warna tenang. Palet: soft blue, sage, cream, dengan aksen warna hangat (mustard/terracotta) untuk CTA. Hindari kesan "aplikasi to-do list" yang task-oriented — ini tentang hubungan, bukan checklist. Tandai jelas di komentar kode bagian mana yang data dummy (notifikasi, simulasi pasangan kedua, panel simulasi waktu) supaya gampang dibedakan dari logic produk asli saat nanti dikembangkan lebih lanjut.
```

---

## Rekomendasi Soal Login/Autentikasi

Ini pertanyaan yang bagus untuk diselesaikan **sebelum** run prompt di atas, karena akan menentukan apakah Claude Code perlu generate flow login sungguhan atau tidak. Saya kasih pertimbangannya, bukan cuma jawaban sepihak — karena ini keputusan produk, bukan cuma keputusan teknis.

### Kenapa saya condong ke "tidak perlu login email/password" untuk tahap prototype ini

1. **Tujuan prototype ini adalah validasi, bukan retensi jangka panjang.** Product brief-nya sendiri bilang kriteria sukses tahap awal itu soal resonansi masalah dan minat, bukan soal engagement berkelanjutan. Login formal cuma nambah friction di sesi user testing — orang yang kamu ajak coba prototype ini kemungkinan besar cuma akan mencobanya sekali, di depan kamu atau lewat link.
2. **Insight intinya sendiri soal "menurunkan risiko emosional untuk memulai."** Kalau langkah pertama yang mereka temui adalah bikin akun + verifikasi email, itu kontradiktif dengan janji "effortless" yang jadi anchor kreatif seluruh project ini.
3. Untuk tahap prototype, **local state/localStorage sudah cukup** — tidak perlu autentikasi sungguhan sama sekali. User buka link, langsung bisa coba flow-nya. Ini juga yang sudah saya masukkan di kedua prompt di atas.

### Tapi ini bukan keputusan permanen — untuk versi setelah prototype (real MVP)

Begitu kamu lewat tahap validasi dan mau bangun versi yang benar-benar dipakai dua orang (pasangan) secara terpisah dan datanya harus sinkron di server, kamu **akan** butuh semacam autentikasi. Di titik itu, pilihannya kira-kira:

- **Google Sign-In** — cepat diimplementasi, familiar buat user Indonesia yang mayoritas sudah pakai akun Google di HP-nya, tapi ada friksi kecil "app ini connect ke Google saya" untuk topik sepribadi ini (beberapa orang mungkin agak segan).
- **Nomor HP + OTP (WhatsApp/SMS)** — ini yang menurut saya paling masuk akal untuk konteks Indonesia dan konteks produk ini. Kenapa: (a) nomor HP jauh lebih universal dipakai orang Indonesia dibanding email aktif, (b) secara psikologis "connect by phone number" terasa lebih personal/langsung dibanding "sign in with Google" untuk aplikasi yang menyentuh topik hubungan, (c) memudahkan mekanisme "pairing" — satu pasangan bisa saling connect lewat nomor HP masing-masing, mirip cara kerja WhatsApp yang sudah sangat familiar.
- **Kode pairing sederhana** (tanpa akun sama sekali) — satu orang generate kode unik, pasangan masukkan kode itu untuk terhubung sebagai satu "pasangan" di sistem. Tidak butuh email/HP sama sekali. Ini paling minim-friction, tapi ada risiko: kalau device hilang/ganti HP, tidak ada cara recovery akun kecuali disimpan manual.

**Saran saya:** untuk *prototype* sekarang, jangan bangun sistem login sama sekali (sesuai dua prompt di atas). Untuk *real MVP* setelah validasi, saya akan condong ke **nomor HP + OTP** dibanding Google Sign-In — tapi ini juga sebaiknya divalidasi lewat pertanyaan langsung ke calon user saat sesi testing ("kalau nanti harus bikin akun, kamu lebih nyaman pakai apa?"), bukan diputuskan dari asumsi saya semata. Saya bisa saja salah baca preferensi user Indonesia di sini — ini area yang layak dicek, bukan diasumsikan.

---

## Riwayat Versi

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | 19 Agustus 2026 | Draf awal — 2 prompt Claude Code Terminal (Obrolin & Kotak Waktu) untuk prototype interaktif, plus rekomendasi strategi autentikasi. Disusun dari seluruh dokumen project (landscape brief, observe persona, synthesize tema, product brief, diverge 5 konsep, claude design prompts v1.0). |
