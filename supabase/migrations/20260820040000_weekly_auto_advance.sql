-- Ritme mingguan otomatis buat Kotak Waktu: couples.current_week majuin
-- sendiri tiap 7 hari, nggak lagi cuma bisa lewat tombol demo.

alter table public.couples
  add column if not exists week_started_at timestamptz not null default now();

-- Batas atas minggu — HARUS disamain manual kalau nambah pertanyaan baru
-- di src/data/weeklyQuestions.js (saat ini 10 pertanyaan).
create or replace function public.advance_due_weeks()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.couples
  set current_week = current_week + 1,
      week_started_at = now()
  where current_week < 10
    and now() - week_started_at >= interval '7 days';
end;
$$;

-- Perlu pg_cron buat jadwalin. Kalau extension-nya belum ada di project
-- ini (baru/gratisan), migration ini akan gagal di baris create extension —
-- jalanin manual "create extension pg_cron;" lewat Dashboard > Database >
-- Extensions dulu, baru re-run migration ini.
create extension if not exists pg_cron with schema extensions;

select
  cron.schedule(
    'advance-weekly-rhythm',
    '0 3 * * *', -- tiap hari jam 03:00 UTC, cek couple mana yang minggunya udah lewat 7 hari
    $$select public.advance_due_weeks()$$
  )
where not exists (
  select 1 from cron.job where jobname = 'advance-weekly-rhythm'
);
