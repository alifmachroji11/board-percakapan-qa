-- Status kesepakatan per topik/pertanyaan: setelah "buka bareng", pasangan
-- bisa nandain hasil obrolannya — sudah sepakat, masih perlu dibahas lagi,
-- atau dilewati dulu. Ini beda dari status alur baca (belum-dibahas/siap-
-- dibuka/dst di journal_entries) — status kesepakatan ini satu nilai yang
-- dipakai bareng oleh couple, bukan per-penulis, makanya tabel terpisah.

create table if not exists public.topic_status (
  couple_id uuid not null references public.couples (id) on delete cascade,
  type text not null check (type in ('topik', 'kotak-waktu')),
  ref_id text not null,
  status text not null check (status in ('sepakat', 'perlu-dibahas', 'lewati-dulu')),
  updated_at timestamptz not null default now(),
  updated_by uuid not null references auth.users (id) on delete cascade,
  primary key (couple_id, type, ref_id)
);

alter table public.topic_status enable row level security;

create policy "lihat status couple sendiri" on public.topic_status
  for select using (couple_id = public.my_couple_id());

create policy "set status couple sendiri" on public.topic_status
  for insert with check (couple_id = public.my_couple_id() and updated_by = auth.uid());

create policy "ubah status couple sendiri" on public.topic_status
  for update using (couple_id = public.my_couple_id())
  with check (couple_id = public.my_couple_id() and updated_by = auth.uid());

alter publication supabase_realtime add table public.topic_status;
