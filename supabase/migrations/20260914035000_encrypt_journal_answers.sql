-- Enkripsi jawaban jurnal di server: kunci AES-256 disimpan di Supabase
-- Vault (dibangkitkan random di sini, nggak pernah keluar dari DB), jawaban
-- disimpan sebagai ciphertext (pgcrypto pgp_sym_encrypt). Ini ngelindungin
-- dari kebocoran dump/backup DB atau bug RLS yang keliru expose baris ke
-- couple yang salah — BUKAN end-to-end (kalau service_role/kunci Vault
-- bocor, tetap bisa didekrip; keputusan trade-off yang disengaja demi
-- kesederhanaan & nggak ada risiko data hilang kalau kunci ilang).
--
-- Baca/tulis jawaban sekarang HARUS lewat submit_journal_answer /
-- get_journal_entries (SECURITY DEFINER, enforce keanggotaan couple
-- sendiri) — akses tabel langsung buat kolom answer ditutup.
--
-- Catatan: pgcrypto (pgp_sym_encrypt/decrypt) terpasang di schema
-- extensions, bukan public, jadi search_path fungsi di bawah harus
-- nyebut keduanya TANPA kutip di sekitar seluruh daftar — 'public,
-- extensions' (satu string berkutip) kebaca Postgres sebagai satu nama
-- schema literal, bukan dua schema terpisah.

select vault.create_secret(
  encode(gen_random_bytes(32), 'base64'),
  'journal_answer_key',
  'Kunci enkripsi kolom journal_entries.answer'
);

-- Tabel masih kosong di prod, jadi aman ganti tipe kolom langsung tanpa
-- konversi data lama.
alter table public.journal_entries drop column answer;
alter table public.journal_entries add column answer bytea not null;

drop policy if exists "tulis jawaban sendiri" on public.journal_entries;
revoke insert on public.journal_entries from authenticated, anon;

create or replace function public.submit_journal_answer(
  p_couple_id uuid, p_type text, p_ref_id text, p_answer text
)
returns void
language plpgsql
security definer
set search_path to public, extensions
as $$
declare
  v_passphrase text;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  if not exists (
    select 1 from public.couple_members
    where couple_id = p_couple_id and user_id = auth.uid()
  ) then
    raise exception 'not_couple_member';
  end if;

  select decrypted_secret into v_passphrase
  from vault.decrypted_secrets where name = 'journal_answer_key';

  insert into public.journal_entries (couple_id, type, ref_id, author_id, answer, submitted_at)
  values (
    p_couple_id, p_type, p_ref_id, auth.uid(),
    pgp_sym_encrypt(p_answer, v_passphrase, 'cipher-algo=aes256'),
    now()
  )
  on conflict (couple_id, type, ref_id, author_id) do nothing;
end;
$$;

create or replace function public.get_journal_entries(p_couple_id uuid)
returns table (
  type text, ref_id text, author_id uuid, answer text,
  submitted_at timestamptz, opened_at timestamptz
)
language plpgsql
security definer
set search_path to public, extensions
as $$
declare
  v_passphrase text;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  if not exists (
    select 1 from public.couple_members
    where couple_id = p_couple_id and user_id = auth.uid()
  ) then
    raise exception 'not_couple_member';
  end if;

  select decrypted_secret into v_passphrase
  from vault.decrypted_secrets where name = 'journal_answer_key';

  return query
    select je.type, je.ref_id, je.author_id,
           pgp_sym_decrypt(je.answer, v_passphrase),
           je.submitted_at, je.opened_at
    from public.journal_entries je
    where je.couple_id = p_couple_id;
end;
$$;

grant execute on function public.submit_journal_answer(uuid, text, text, text) to anon, authenticated;
grant execute on function public.get_journal_entries(uuid) to anon, authenticated;
