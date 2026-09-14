-- Trigger anti-tamper journal_entries_guard_update ngeblokir FK author_id
-- ON DELETE SET NULL yang baru ditambahin (dibutuhin buat fitur hapus akun),
-- karena awalnya nganggep author_id itu kolom yang beku total. Longgarin
-- cuma buat kasus null-in author_id (akun kehapus) — reassign ke ID lain
-- tetap dilarang.
create or replace function public.journal_entries_guard_update()
returns trigger
language plpgsql
as $function$
begin
  if new.answer is distinct from old.answer
    or new.couple_id is distinct from old.couple_id
    or new.type is distinct from old.type
    or new.ref_id is distinct from old.ref_id
    or new.submitted_at is distinct from old.submitted_at
  then
    raise exception 'journal_entries: cuma kolom opened_at yang boleh diubah setelah jawaban dikirim';
  end if;

  if new.author_id is distinct from old.author_id and new.author_id is not null then
    raise exception 'journal_entries: cuma kolom opened_at yang boleh diubah setelah jawaban dikirim';
  end if;

  return new;
end;
$function$;
