-- Skema awal Obrolin: pairing pasangan + jurnal jawaban.
-- Menggantikan localStorage & data dummy di prototype.

create table if not exists public.couples (
  id uuid primary key default gen_random_uuid(),
  invite_code text unique not null,
  current_week integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.couple_members (
  couple_id uuid not null references public.couples (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  display_name text,
  joined_at timestamptz not null default now(),
  primary key (couple_id, user_id)
);

-- Satu user cuma boleh gabung ke satu couple.
create unique index if not exists couple_members_user_id_key on public.couple_members (user_id);

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  type text not null check (type in ('topik', 'kotak-waktu')),
  ref_id text not null,
  author_id uuid not null references auth.users (id) on delete cascade,
  answer text not null,
  submitted_at timestamptz not null default now(),
  opened_at timestamptz,
  unique (couple_id, type, ref_id, author_id)
);

alter table public.couples enable row level security;
alter table public.couple_members enable row level security;
alter table public.journal_entries enable row level security;

-- Helper: couple_id milik user yang lagi login.
create or replace function public.my_couple_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select couple_id from public.couple_members where user_id = auth.uid()
$$;

create policy "lihat couple sendiri" on public.couples
  for select using (id = public.my_couple_id());

create policy "update couple sendiri (mis. current_week)" on public.couples
  for update using (id = public.my_couple_id());

create policy "lihat anggota couple sendiri" on public.couple_members
  for select using (couple_id = public.my_couple_id());

create policy "gabung couple (insert diri sendiri)" on public.couple_members
  for insert with check (user_id = auth.uid());

create policy "lihat jurnal couple sendiri" on public.journal_entries
  for select using (couple_id = public.my_couple_id());

create policy "tulis jawaban sendiri" on public.journal_entries
  for insert with check (couple_id = public.my_couple_id() and author_id = auth.uid());

create policy "update jawaban sendiri (mis. opened_at)" on public.journal_entries
  for update using (couple_id = public.my_couple_id());
