-- Realtime buat journal_entries: layar "menunggu pasangan" bisa auto-update
-- begitu pasangan submit jawaban, tanpa refresh manual.
alter publication supabase_realtime add table public.journal_entries;
