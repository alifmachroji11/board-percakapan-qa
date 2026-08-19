import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Copy, Check, ArrowRight, Users } from 'lucide-react'
import { ensureSession, getMyCouple, createCouple, joinCouple } from '../lib/auth.js'
import { supabase } from '../lib/supabaseClient.js'
import PillButton from '../components/PillButton.jsx'

export default function Pairing() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('pilih') // pilih | buat | gabung
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [createdCouple, setCreatedCouple] = useState(null)
  const [copied, setCopied] = useState(false)

  // Kalau ternyata udah tergabung ke couple (mis. buka /app/pairing manual
  // padahal udah pairing), langsung lempar ke app.
  useEffect(() => {
    let cancelled = false
    async function check() {
      await ensureSession()
      const couple = await getMyCouple()
      if (!cancelled && couple) navigate('/app', { replace: true })
    }
    check()
    return () => {
      cancelled = true
    }
  }, [navigate])

  // Kalau nunggu di layar "kode udah dibuat", auto-lanjut begitu pasangan gabung.
  useEffect(() => {
    if (!createdCouple) return
    const channel = supabase
      .channel(`couple-${createdCouple.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'couple_members', filter: `couple_id=eq.${createdCouple.id}` },
        () => navigate('/app', { replace: true })
      )
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [createdCouple, navigate])

  async function handleCreate() {
    setBusy(true)
    setError('')
    try {
      await ensureSession()
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
      await ensureSession()
      await joinCouple(code, name)
      navigate('/app', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(createdCouple.invite_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (createdCouple) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-terracotta/15 text-terracotta-deep">
          <Users size={26} />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-ink">Kode pairing kamu</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Kasih kode ini ke pasanganmu. Begitu dia masukin, kalian otomatis kehubung.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-3 rounded-2xl bg-surface px-8 py-5 shadow-sm shadow-ink/5"
        >
          <span className="text-3xl font-extrabold tracking-[0.2em] text-terracotta-deep">
            {createdCouple.invite_code}
          </span>
          {copied ? <Check size={20} className="text-sage-deep" /> : <Copy size={20} className="text-ink-soft" />}
        </button>

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="text-xs text-ink-soft"
        >
          Menunggu pasanganmu gabung...
        </motion.p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-6">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-ink">Kamu &amp; pasangan</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Belum perlu akun — cukup satu kode buat saling terhubung berdua.
        </p>
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama kamu (biar pasangan tau ini jawaban siapa)"
        className="w-full rounded-2xl bg-surface p-4 text-sm text-ink shadow-sm shadow-ink/5 outline-none ring-terracotta/30 placeholder:text-ink-soft/60 focus:ring-2"
      />

      {mode === 'pilih' && (
        <div className="flex flex-col gap-3">
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
            maxLength={6}
            className="w-full rounded-2xl bg-surface p-4 text-center text-lg font-bold tracking-[0.3em] text-ink shadow-sm shadow-ink/5 outline-none ring-terracotta/30 placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-ink-soft/60 focus:ring-2"
          />
          {error && <p className="text-center text-sm text-terracotta-deep">{error}</p>}
          <PillButton onClick={handleJoin} disabled={busy || code.trim().length < 6} className="w-full">
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
