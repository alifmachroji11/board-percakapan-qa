-- ALTER DATABASE SET app.settings.* butuh superuser yang nggak tersedia di
-- hosted Supabase — pindah ke tabel biasa yang cuma bisa diakses lewat
-- fungsi security definer (nggak ada policy buat anon/authenticated).

create table if not exists public.app_settings (
  key text primary key,
  value text not null
);

alter table public.app_settings enable row level security;

create or replace function public.notify_weekly_reminders()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_url text;
  v_secret text;
begin
  select value into v_url from public.app_settings where key = 'edge_function_url';
  select value into v_secret from public.app_settings where key = 'cron_secret';

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
