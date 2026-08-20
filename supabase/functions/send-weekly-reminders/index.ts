// Dipanggil pg_cron (lewat pg_net) tiap hari, 5 menit setelah
// advance_due_weeks() jalan. Proses antrian public.week_advance_events yang
// belum notified, kirim web push ke kedua anggota couple, tandain selesai.

import { createClient } from 'jsr:@supabase/supabase-js@2'
import webpush from 'npm:web-push@3'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const CRON_SECRET = Deno.env.get('CRON_SECRET')!
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT')!
const APP_URL = Deno.env.get('APP_URL') ?? 'https://obrolin.am11.my.id'

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

Deno.serve(async (req) => {
  if (req.headers.get('x-cron-secret') !== CRON_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  const { data: events, error: eventsError } = await supabase
    .from('week_advance_events')
    .select('id, couple_id, week')
    .is('notified_at', null)

  if (eventsError) {
    return Response.json({ error: eventsError.message }, { status: 500 })
  }
  if (!events || events.length === 0) {
    return Response.json({ processed: 0 })
  }

  let sent = 0
  let failed = 0

  for (const event of events) {
    const { data: members } = await supabase
      .from('couple_members')
      .select('user_id')
      .eq('couple_id', event.couple_id)

    const userIds = (members ?? []).map((m) => m.user_id)
    if (userIds.length > 0) {
      const { data: subs } = await supabase
        .from('push_subscriptions')
        .select('id, endpoint, p256dh, auth_key')
        .in('user_id', userIds)

      const payload = JSON.stringify({
        title: 'Kotak Waktu minggu baru udah kebuka 💌',
        body: `Pertanyaan minggu ke-${event.week} udah bisa dijawab. Yuk isi jawaban kamu.`,
        url: `${APP_URL}/app/kotak-waktu`,
      })

      for (const sub of subs ?? []) {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth_key },
            },
            payload,
          )
          sent++
        } catch (err) {
          failed++
          // Subscription udah nggak valid (browser unsubscribe / expired) — buang.
          if (err?.statusCode === 404 || err?.statusCode === 410) {
            await supabase.from('push_subscriptions').delete().eq('id', sub.id)
          }
        }
      }
    }

    await supabase.from('week_advance_events').update({ notified_at: new Date().toISOString() }).eq('id', event.id)
  }

  return Response.json({ processed: events.length, sent, failed })
})
