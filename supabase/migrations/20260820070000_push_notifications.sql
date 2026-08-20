-- Web push buat reminder mingguan Kotak Waktu: simpen subscription browser
-- tiap user, catet event pas minggu couple maju, lalu pg_cron manggil Edge
-- Function `send-weekly-reminders` (lewat pg_net) buat ngirim pushnya.

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth_key text not null,
  created_at timestamptz not null default now()
);

create index if not exists push_subscriptions_user_id_idx on public.push_subscriptions (user_id);

alter table public.push_subscriptions enable row level security;

create policy "kelola subscription sendiri" on public.push_subscriptions
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Antrian: dicatat pas advance_due_weeks() majuin minggu couple, diproses &
-- ditandain notified_at oleh Edge Function.
create table if not exists public.week_advance_events (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  week integer not null,
  created_at timestamptz not null default now(),
  notified_at timestamptz
);

create index if not exists week_advance_events_pending_idx
  on public.week_advance_events (id) where notified_at is null;

alter table public.week_advance_events enable row level security;
-- Nggak ada policy buat anon/authenticated — cuma service_role (Edge
-- Function) yang boleh baca/update, RLS default-nya udah nutup semua akses.

create or replace function public.advance_due_weeks()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.week_advance_events (couple_id, week)
  select id, current_week + 1
  from public.couples
  where current_week < 10
    and now() - week_started_at >= interval '7 days';

  update public.couples
  set current_week = current_week + 1,
      week_started_at = now()
  where current_week < 10
    and now() - week_started_at >= interval '7 days';
end;
$$;

create extension if not exists pg_net with schema extensions;

-- Ganti nilai app.settings.* di bawah lewat:
--   alter database postgres set app.settings.edge_function_url = '...';
--   alter database postgres set app.settings.cron_secret = '...';
-- (dijalanin manual sekali lewat Management API / SQL editor, bukan lewat
-- migration, biar secret-nya nggak nyangkut di git history.)
create or replace function public.notify_weekly_reminders()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_url text := current_setting('app.settings.edge_function_url', true);
  v_secret text := current_setting('app.settings.cron_secret', true);
begin
  if v_url is null or v_secret is null then
    return;
  end if;

  perform net.http_post(
    url := v_url,
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-cron-secret', v_secret),
    body := '{}'::jsonb
  );
end;
$$;

select
  cron.schedule(
    'notify-weekly-reminders',
    '5 3 * * *', -- 5 menit setelah advance-weekly-rhythm, biar event-nya udah kecatet
    $$select public.notify_weekly_reminders()$$
  )
where not exists (
  select 1 from cron.job where jobname = 'notify-weekly-reminders'
);
