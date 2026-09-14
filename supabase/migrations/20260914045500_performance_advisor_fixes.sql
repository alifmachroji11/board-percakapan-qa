-- Perbaikan dari Supabase performance advisor (bukan bug fungsional, murni
-- optimasi query di scale besar):
--
-- 1) RLS initplan: policy yang manggil auth.uid() langsung (bukan lewat
--    fungsi STABLE kayak my_couple_id()) dievaluasi ulang PER BARIS.
--    Bungkus jadi (select auth.uid()) biar postgres cache-in sekali per
--    statement. Semantik persis sama, cuma soal performa.
-- 2) Index buat foreign key yang belum ke-cover, biar JOIN/DELETE CASCADE
--    ke tabel ini gak full-table-scan pas datanya udah banyak.
--
-- Termasuk tabel sakinah_* (aplikasi Menuju Sakinah, satu Supabase project
-- sama dengan Obrolin) karena lint yang sama juga kena di situ.

alter policy "gabung couple (insert diri sendiri)" on public.couple_members
  with check (user_id = (select auth.uid()));

alter policy "kelola subscription sendiri" on public.push_subscriptions
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

alter policy "set status couple sendiri" on public.topic_status
  with check ((couple_id = my_couple_id()) and (updated_by = (select auth.uid())));

alter policy "ubah status couple sendiri" on public.topic_status
  using (couple_id = my_couple_id())
  with check ((couple_id = my_couple_id()) and (updated_by = (select auth.uid())));

alter policy "member reads own membership" on public.sakinah_room_members
  using (user_id = (select auth.uid()));

alter policy "members can select records" on public.sakinah_records
  using (room_id in (select sakinah_room_members.room_id from sakinah_room_members where sakinah_room_members.user_id = (select auth.uid())));

alter policy "members can insert records" on public.sakinah_records
  with check (room_id in (select sakinah_room_members.room_id from sakinah_room_members where sakinah_room_members.user_id = (select auth.uid())));

alter policy "members can update records" on public.sakinah_records
  using (room_id in (select sakinah_room_members.room_id from sakinah_room_members where sakinah_room_members.user_id = (select auth.uid())))
  with check (room_id in (select sakinah_room_members.room_id from sakinah_room_members where sakinah_room_members.user_id = (select auth.uid())));

alter policy "members can delete records" on public.sakinah_records
  using (room_id in (select sakinah_room_members.room_id from sakinah_room_members where sakinah_room_members.user_id = (select auth.uid())));

create index if not exists journal_entries_author_id_idx on public.journal_entries (author_id);
create index if not exists sakinah_room_members_user_id_idx on public.sakinah_room_members (user_id);
create index if not exists topic_status_updated_by_idx on public.topic_status (updated_by);
create index if not exists week_advance_events_couple_id_idx on public.week_advance_events (couple_id);
