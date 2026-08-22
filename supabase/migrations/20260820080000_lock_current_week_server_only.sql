-- Tutup jalur API langsung buat ubah current_week/week_started_at di couples.
--
-- Tombol "MODE DEMO: lompat minggu" yang dulu nulis kolom ini langsung dari
-- client udah dihapus dari UI, tapi RLS di couples ("update couple sendiri")
-- masih ngizinin siapapun anggota couple update kolom ini lewat panggilan
-- REST API mentah (bukan cuma lewat app). Kunci di level trigger: cuma proses
-- server (advance_due_weeks(), jalan sebagai security definer) yang boleh
-- ubah current_week/week_started_at — dibedain dari panggilan client biasa
-- lewat current_user, yang buat PostgREST selalu 'authenticated', sedangkan
-- security definer function jalan sebagai pemilik function-nya (bukan
-- 'authenticated'). Panggilan pakai service_role (admin/QA) juga tetap lolos
-- karena current_user-nya 'service_role', bukan 'authenticated'.

create or replace function public.couples_guard_update()
returns trigger
language plpgsql
as $$
begin
  if new.invite_code is distinct from old.invite_code
    or new.created_at is distinct from old.created_at
  then
    raise exception 'couples: kode undangan & tanggal dibuat tidak boleh diubah';
  end if;

  if current_user = 'authenticated'
    and (new.current_week is distinct from old.current_week
      or new.week_started_at is distinct from old.week_started_at)
  then
    raise exception 'couples: current_week cuma bisa dimajuin otomatis oleh server';
  end if;

  return new;
end;
$$;
