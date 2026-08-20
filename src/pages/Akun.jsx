import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, ShieldAlert, Mail, LogOut, Bell, BellOff } from 'lucide-react'
import { isAnonymousUser, getUserEmail, linkGoogleAccount, signOut } from '../lib/auth.js'
import { pushSupported, getPushSubscriptionStatus, enablePushNotifications, disablePushNotifications } from '../lib/push.js'
import PillButton from '../components/PillButton.jsx'

export default function Akun() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [anonymous, setAnonymous] = useState(true)
  const [email, setEmail] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [confirmingLogout, setConfirmingLogout] = useState(false)
  const [pushStatus, setPushStatus] = useState('unsupported')
  const [pushBusy, setPushBusy] = useState(false)
  const [pushError, setPushError] = useState('')

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
    if (pushSupported()) getPushSubscriptionStatus().then(setPushStatus)
  }, [])

  async function handleTogglePush() {
    setPushBusy(true)
    setPushError('')
    try {
      if (pushStatus === 'subscribed') {
        await disablePushNotifications()
        setPushStatus('not-subscribed')
      } else {
        await enablePushNotifications()
        setPushStatus('subscribed')
      }
    } catch (err) {
      setPushError(err.message)
    } finally {
      setPushBusy(false)
    }
  }

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

  async function handleLogout() {
    setBusy(true)
    setError('')
    try {
      await signOut()
      navigate('/', { replace: true })
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

      {pushStatus !== 'unsupported' && (
        <div className="flex flex-col gap-4 rounded-2xl bg-surface p-5 shadow-sm shadow-ink/5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-mustard/15 text-mustard-deep">
              {pushStatus === 'subscribed' ? <Bell size={20} /> : <BellOff size={20} />}
            </div>
            <div>
              <p className="text-sm font-bold text-ink">Pengingat Kotak Waktu</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                {pushStatus === 'denied'
                  ? 'Notifikasi diblokir di browser ini. Aktifin lewat pengaturan situs kalau mau dapet pengingat.'
                  : 'Dapet notifikasi tiap kali pertanyaan minggu baru kebuka, biar nggak lewat.'}
              </p>
            </div>
          </div>
          {pushError && <p className="text-sm text-terracotta-deep">{pushError}</p>}
          {pushStatus !== 'denied' && (
            <PillButton onClick={handleTogglePush} disabled={pushBusy} className="w-full">
              {pushBusy
                ? 'Memproses...'
                : pushStatus === 'subscribed'
                  ? 'Matikan notifikasi'
                  : 'Aktifkan notifikasi'}
            </PillButton>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-2xl bg-surface p-5 shadow-sm shadow-ink/5">
        {!confirmingLogout ? (
          <button
            onClick={() => setConfirmingLogout(true)}
            className="flex items-center justify-center gap-2 rounded-full border border-cream-deep px-6 py-3 text-sm font-semibold text-ink-soft transition-colors hover:border-terracotta/40 hover:text-terracotta-deep"
          >
            <LogOut size={16} /> Keluar dari sesi ini
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-center text-sm text-ink-soft">
              {anonymous
                ? 'Sesi ini belum diamankan ke Google — kalau keluar sekarang, akses ke pasangan & jurnal kalian bisa hilang total dan nggak bisa dipulihkan. Yakin mau keluar?'
                : 'Kamu bisa masuk lagi kapan aja pakai akun Google ini. Yakin mau keluar sekarang?'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmingLogout(false)}
                disabled={busy}
                className="flex-1 rounded-full border border-cream-deep px-6 py-3 text-sm font-semibold text-ink-soft hover:border-terracotta/40"
              >
                Batal
              </button>
              <PillButton onClick={handleLogout} disabled={busy} className="flex-1">
                {busy ? 'Keluar...' : 'Ya, tetap keluar'}
              </PillButton>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
