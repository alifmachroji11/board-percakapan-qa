-- Saat satu user hapus akun, jawaban & status yang udah dia tulis di couple
-- yang masih ada pasangannya harus tetap kelihatan buat pasangan (shared
-- history), jadi author_id/updated_by di-SET NULL, bukan ikut CASCADE
-- terhapus kayak default FK ke auth.users sebelumnya.

alter table public.journal_entries
  alter column author_id drop not null;

alter table public.journal_entries
  drop constraint journal_entries_author_id_fkey;

alter table public.journal_entries
  add constraint journal_entries_author_id_fkey
  foreign key (author_id) references auth.users(id) on delete set null;

alter table public.topic_status
  alter column updated_by drop not null;

alter table public.topic_status
  drop constraint topic_status_updated_by_fkey;

alter table public.topic_status
  add constraint topic_status_updated_by_fkey
  foreign key (updated_by) references auth.users(id) on delete set null;
