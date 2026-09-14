-- Kotak Waktu sekarang punya gate kesepakatan sebelum nulis jawaban (kayak
-- Kartu Topik), tapi opsi ketiganya "perlu dipahami kembali pertanyaannya"
-- (bukan "lewati dulu") — pertanyaan mingguannya reflektif, kadang perlu
-- diklarifikasi dulu maknanya. Nilai lama ('lewati-dulu') tetap dibiarkan
-- valid, masih dipakai di gate "after" (hasil obrolan pas buka bareng) dan
-- ada baris lama yang mungkin masih pakai nilai itu.
alter table public.topic_status drop constraint topic_status_status_check;
alter table public.topic_status add constraint topic_status_status_check
  check (status = any (array['sepakat', 'perlu-dibahas', 'lewati-dulu', 'perlu-dipahami-kembali']));
