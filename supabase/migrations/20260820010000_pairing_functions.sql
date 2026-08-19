-- Fungsi pairing pasangan lewat kode undangan.
-- security definer supaya user yang BELUM tergabung ke couple manapun
-- tetap bisa cari & gabung couple lewat kode (RLS di tabel couples
-- normalnya cuma izinin lihat couple sendiri).

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
    v_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
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

create or replace function public.join_couple(p_code text, p_display_name text default null)
returns public.couples
language plpgsql
security definer
set search_path = public
as $$
declare
  v_couple public.couples;
  v_member_count int;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  if exists (select 1 from public.couple_members where user_id = auth.uid()) then
    raise exception 'already_paired';
  end if;

  select * into v_couple from public.couples where invite_code = upper(trim(p_code));
  if not found then
    raise exception 'code_not_found';
  end if;

  select count(*) into v_member_count from public.couple_members where couple_id = v_couple.id;
  if v_member_count >= 2 then
    raise exception 'couple_full';
  end if;

  insert into public.couple_members (couple_id, user_id, display_name)
  values (v_couple.id, auth.uid(), nullif(trim(p_display_name), ''));

  return v_couple;
end;
$$;

revoke all on function public.create_couple(text) from public;
revoke all on function public.join_couple(text, text) from public;
grant execute on function public.create_couple(text) to authenticated;
grant execute on function public.join_couple(text, text) to authenticated;
