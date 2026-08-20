import { useEffect, useState } from 'react'
import { ShieldCheck, ShieldAlert, Mail } from 'lucide-react'
import { isAnonymousUser, getUserEmail, linkGoogleAccount } from '../lib/auth.js'
import PillButton from '../components/PillButton.jsx'

export default function Akun() {
  const [loading, setLoading] = useState(true)
  const [anonymous, setAnonymous] = useState(true)
  const [email, setEmail] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function loadStatus() {
    setLoading(true)
    const [isAnon, userEmail] = await Promise.all([isAnonymousUser(), getUserEmail()])
    setAnonymous(isAnon)
    setEmail(userEmail)
    setLoading(false)
  }

  useEffect(() => {
    // Supabase balikin error lewat query param kalau linking gagal
    // (mis. akun Google itu udah kepakai user lain).
    const params = new URLSearchParams(window.location.search)
    const desc = params.get('error_description')
    if (desc) setError(decodeURIComponent(desc.replace(/\+/g, ' ')))

    loadStatus()
  }, [])

  async function handleLink() {
    setBusy(true)
    setError('')
    try {
      await linkGoogleAccount('/app/akun')
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  if (loading) {
    return <div className="flex flex-col gap-4">
      <div className="h-6 w-40 animate-pulse rounded bg-cream-deep" />
      <div className="h-32 animate-pulse rounded-2xl bg-cream-deep" />
    </div>
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <div>
        <h1 className="text-xl font-extrabold text-ink">Akun kamu</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Kelola cara kamu masuk ke Obrolin, biar nggak kehilangan akses ke jurnal kalian.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta-deep">{error}</div>
      )}

      {anonymous ? (
        <div className="flex flex-col gap-4 rounded-2xl bg-surface p-5 shadow-sm shadow-ink/5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-mustard/15 text-mustard-deep">
              <ShieldAlert size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-ink">Sesi kamu sementara</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                Kamu masuk tanpa akun. Kalau data browser di HP/laptop ini kehapus, atau kamu ganti
                device, akses ke pasangan &amp; jurnal kalian bisa hilang dan nggak bisa dipulihkan.
              </p>
            </div>
          </div>
          <PillButton onClick={handleLink} disabled={busy} className="w-full">
            {busy ? 'Menghubungkan...' : 'Hubungkan akun Google'}
          </PillButton>
          <p className="text-center text-xs text-ink-soft">
            Jawaban jurnal kamu nggak berubah — ini cuma nambahin cara masuk yang lebih aman.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 rounded-2xl bg-surface p-5 shadow-sm shadow-ink/5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sage/15 text-sage-deep">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-ink">Akun kamu aman</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                Kamu bisa masuk dari device manapun pakai akun Google ini, tanpa kehilangan akses ke
                jurnal kalian.
              </p>
            </div>
          </div>
          {email && (
            <div className="flex items-center gap-2 rounded-xl bg-cream px-4 py-3 text-sm text-ink-soft">
              <Mail size={16} /> {email}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
