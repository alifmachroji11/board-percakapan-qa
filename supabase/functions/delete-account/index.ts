import { createClient } from 'jsr:@supabase/supabase-js@2'

// Hapus akun user yang minta sendiri (id diambil dari JWT-nya, bukan dari
// body request, biar nggak bisa dipakai buat hapus akun orang lain).
// couple_members/push_subscriptions ikut kehapus (FK CASCADE), sementara
// journal_entries.author_id & topic_status.updated_by di-SET NULL lewat
// migration account_deletion_preserve_shared_history, jadi jawaban yang
// udah ditulis tetap kelihatan buat pasangan yang masih ada di couple-nya.
// Kalau couple jadi kosong (nggak ada pasangan sama sekali), couple-nya
// ikut dibersihkan sekalian karena nggak ada lagi yang bisa lihat datanya.
Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), { status: 405 })
  }

  const authHeader = req.headers.get('Authorization') ?? ''

  const callerClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )

  const {
    data: { user },
    error: userError,
  } = await callerClient.auth.getUser()

  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 })
  }

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: membership } = await admin
    .from('couple_members')
    .select('couple_id')
    .eq('user_id', user.id)
    .maybeSingle()

  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id)
  if (deleteError) {
    return new Response(JSON.stringify({ error: deleteError.message }), { status: 500 })
  }

  if (membership?.couple_id) {
    const { count } = await admin
      .from('couple_members')
      .select('user_id', { count: 'exact', head: true })
      .eq('couple_id', membership.couple_id)

    if (!count) {
      await admin.from('couples').delete().eq('id', membership.couple_id)
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
