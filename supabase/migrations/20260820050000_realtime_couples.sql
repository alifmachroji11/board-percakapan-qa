-- Realtime buat couples: dipakai supaya current_week (majuin sama cron
-- mingguan) ke-update live di semua halaman yang lagi kebuka, bukan cuma
-- kebaca ulang pas reload.
alter publication supabase_realtime add table public.couples;
