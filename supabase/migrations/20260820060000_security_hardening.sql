-- Pengerasan keamanan & integritas data:
--
-- 1) Celah: kebijakan UPDATE journal_entries cuma ngecek couple_id, bukan
--    author_id — artinya salah satu pasangan bisa nulis ulang jawaban
--    pasangannya sendiri lewat panggilan API langsung (bukan lewat app).
--    Ditutup di level trigger supaya nggak bergantung ke nuansa RLS:
--    cuma kolom opened_at yang boleh berubah setelah jawaban tersimpan.
--
-- 2) Celah serupa di couples: kode undangan & created_at bisa diubah
--    siapapun anggota couple-nya. Dikunci ke immutable.
--
-- 3) Batas current_week dikunci via constraint, biar nggak bisa di-set
--    ke angka aneh lewat panggilan API langsung yang bikin frontend error.
--
-- 4) Kode undangan diperpanjang dari 6 ke 8 karakter heksadesimal —
--    6 karakter dari alfabet hex (16^6 ≈ 16 juta kombinasi) kurang kuat
--    buat jendela waktu sebelum pasangan gabung; 8 karakter (16^8 ≈ 4,3
--    miliar) jauh lebih aman ditebak, tetap pendek buat diketik manual.

create or replace function public.journal_entries_guard_update()
returns trigger
language plpgsql
as $$
begin
  if new.answer is distinct from old.answer
    or new.author_id is distinct from old.author_id
    or new.couple_id is distinct from old.couple_id
    or new.type is distinct from old.type
    or new.ref_id is distinct from old.ref_id
    or new.submitted_at is distinct from old.submitted_at
  then
    raise exception 'journal_entries: cuma kolom opened_at yang boleh diubah setelah jawaban dikirim';
  end if;
  return new;
end;
$$;

drop trigger if exists journal_entries_guard_update on public.journal_entries;
create trigger journal_entries_guard_update
  before update on public.journal_entries
  for each row execute function public.journal_entries_guard_update();

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
  return new;
end;
$$;

drop trigger if exists couples_guard_update on public.couples;
create trigger couples_guard_update
  before update on public.couples
  for each row execute function public.couples_guard_update();

alter table public.couples
  drop constraint if exists couples_current_week_range;
alter table public.couples
  add constraint couples_current_week_range check (current_week between 1 and 10);

-- Perpanjang kode undangan jadi 8 karakter.
create or replace function public.create_couple(p_display_name text default null)
returns public.couples
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text;
  v_couple public.couples;
  v_attempt int := 0;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  if exists (select 1 from public.couple_members where user_id = auth.uid()) then
    raise exception 'already_paired';
  end if;

  loop
    v_attempt := v_attempt + 1;
    v_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
    begin
      insert into public.couples (invite_code) values (v_code) returning * into v_couple;
      exit;
    exception when unique_violation then
      if v_attempt >= 5 then
        raise exception 'could_not_generate_code';
      end if;
    end;
  end loop;

  insert into public.couple_members (couple_id, user_id, display_name)
  values (v_couple.id, auth.uid(), nullif(trim(p_display_name), ''));

  return v_couple;
end;
$$;
