import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { getMyCouple, createCouple, joinCouple, signInWithGoogle } from '../lib/auth.js'
import { supabase } from '../lib/supabaseClient.js'
import PillButton from '../components/PillButton.jsx'
import WaitingForPartner from '../components/WaitingForPartner.jsx'

export default function Pairing() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('pilih') // pilih | buat | gabung
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [createdCouple, setCreatedCouple] = useState(null)
  const [checking, setChecking] = useState(true)
  // Google wajib duluan sebelum bisa pairing baru, biar akses ke jurnal
  // nggak gampang ilang gara-gara ganti device. Couple lama yang masih
  // sesi anonim tetap boleh lewat (nggak dipaksa mundur).
  const [hasAccount, setHasAccount] = useState(false)

  const checkAccount = useCallback(
    async (cancelledRef) => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        const couple = await getMyCouple()
        if (!cancelledRef.current && couple) {
          navigate('/app', { replace: true })
          return
        }
      }

      if (!cancelledRef.current) {
        setHasAccount(!!session && !session.user.is_anonymous)
        setChecking(false)
      }
    },
    [navigate]
  )

  useEffect(() => {
    const cancelledRef = { current: false }
    checkAccount(cancelledRef)
    return () => {
      cancelledRef.current = true
    }
  }, [checkAccount])

  // Sama kayak guard di AppLayout — tombol back abis dari layar Google kadang
  // munculin snapshot halaman ini dari bfcache. Cek ulang biar statusnya nggak basi.
  useEffect(() => {
    const cancelledRef = { current: false }
    function handlePageShow(event) {
      if (!event.persisted) return
      setChecking(true)
      checkAccount(cancelledRef)
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => {
      cancelledRef.current = true
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [checkAccount])

  async function handleCreate() {
    setBusy(true)
    setError('')
    try {
      const couple = await createCouple(name)
      setCreatedCouple(couple)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleJoin() {
    setBusy(true)
    setError('')
    try {
      await joinCouple(code, name)
      navigate('/app', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleGoogleSignIn() {
    setBusy(true)
    setError('')
    try {
      await signInWithGoogle('/app/pairing')
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  if (checking) {
    return <div className="min-h-dvh bg-cream" />
  }

  if (!hasAccount) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-terracotta/15 text-terracotta-deep">
          <ShieldCheck size={26} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Kamu &amp; pasangan</h1>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            Masuk pakai Google dulu, biar kamu bisa pindah device kapan aja tanpa takut jurnal &amp;
            pasangan kalian hilang.
          </p>
        </div>
        {error && <p className="text-sm text-terracotta-deep">{error}</p>}
        <PillButton onClick={handleGoogleSignIn} disabled={busy} className="w-full">
          {busy ? 'Menghubungkan...' : 'Masuk dengan Google'}
        </PillButton>
      </div>
    )
  }

  if (createdCouple) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
        <WaitingForPartner
          coupleId={createdCouple.id}
          inviteCode={createdCouple.invite_code}
          onPartnerJoined={() => navigate('/app', { replace: true })}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-6">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-ink">Kamu &amp; pasangan</h1>
        <p className="mt-1 text-sm text-ink-soft">Cukup satu kode buat saling terhubung berdua.</p>
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama kamu (biar pasangan tau ini jawaban siapa)"
        className="w-full rounded-2xl bg-surface p-4 text-sm text-ink shadow-sm shadow-ink/5 outline-none ring-terracotta/30 placeholder:text-ink-soft/60 focus:ring-2"
      />

      {mode === 'pilih' && (
        <div className="flex flex-col gap-3">
          {error && <p className="text-center text-sm text-terracotta-deep">{error}</p>}
          <PillButton onClick={() => setMode('buat')} className="w-full">
            Buat kode pairing baru
          </PillButton>
          <PillButton variant="secondary" onClick={() => setMode('gabung')} className="w-full">
            Punya kode dari pasangan
          </PillButton>
        </div>
      )}

      {mode === 'buat' && (
        <div className="flex flex-col gap-3">
          <p className="text-center text-sm text-ink-soft">
            Kamu bakal dapet kode buat dikasih ke pasangan.
          </p>
          {error && <p className="text-center text-sm text-terracotta-deep">{error}</p>}
          <PillButton onClick={handleCreate} disabled={busy} className="w-full">
            {busy ? 'Bikin kode...' : 'Buat kode sekarang'} <ArrowRight size={18} />
          </PillButton>
          <button onClick={() => setMode('pilih')} className="text-sm text-ink-soft underline">
            Kembali
          </button>
        </div>
      )}

      {mode === 'gabung' && (
        <div className="flex flex-col gap-3">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Masukin kode dari pasangan"
            maxLength={8}
            className="w-full rounded-2xl bg-surface p-4 text-center text-lg font-bold tracking-[0.25em] text-ink shadow-sm shadow-ink/5 outline-none ring-terracotta/30 placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-ink-soft/60 focus:ring-2"
          />
          {error && <p className="text-center text-sm text-terracotta-deep">{error}</p>}
          <PillButton onClick={handleJoin} disabled={busy || code.trim().length < 8} className="w-full">
            {busy ? 'Menghubungkan...' : 'Gabung sekarang'} <ArrowRight size={18} />
          </PillButton>
          <button onClick={() => setMode('pilih')} className="text-sm text-ink-soft underline">
            Kembali
          </button>
        </div>
      )}
    </div>
  )
}
