-- Aktifin Realtime buat couple_members supaya layar "menunggu pasangan
-- gabung" bisa auto-lanjut begitu pasangan submit kode.
alter publication supabase_realtime add table public.couple_members;
