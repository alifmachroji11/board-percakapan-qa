import { useCallback, useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { MessageCircleHeart, Clock, History } from 'lucide-react'
import PageTransition from '../components/PageTransition.jsx'
import SplashScreen from '../components/SplashScreen.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'
import { LogoIcon } from '../components/Logo.jsx'
import { ensureSession, getMyCouple } from '../lib/auth.js'
import { getCoupleMembers, subscribeToCouple } from '../lib/journal.js'
import { supabase } from '../lib/supabaseClient.js'
import { CoupleProvider } from '../context/CoupleContext.jsx'

const TABS = [
  { to: '/app/topik', label: 'Kartu Topik', icon: MessageCircleHeart },
  { to: '/app/kotak-waktu', label: 'Kotak Waktu', icon: Clock },
  { to: '/app/riwayat', label: 'Riwayat', icon: History },
]

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [leavingToLanding, setLeavingToLanding] = useState(false)
  const [coupleState, setCoupleState] = useState(null) // { couple, me, partner }
  const [checking, setChecking] = useState(true)

  const loadCouple = useCallback(async () => {
    await ensureSession()
    const couple = await getMyCouple()
    if (!couple) {
      navigate('/app/pairing', { replace: true })
      return
    }
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const members = await getCoupleMembers(couple.id)
    const me = members.find((m) => m.user_id === user.id) ?? null
    const partner = members.find((m) => m.user_id !== user.id) ?? null
    setCoupleState({ couple, me, partner })
    setChecking(false)
  }, [navigate])

  useEffect(() => {
    loadCouple()
  }, [loadCouple])

  // current_week bisa majuin sendiri (cron mingguan) sementara halaman ini
  // lagi kebuka — dengerin perubahan biar nggak butuh reload manual.
  useEffect(() => {
    if (!coupleState) return
    return subscribeToCouple(coupleState.couple.id, loadCouple)
  }, [coupleState?.couple.id, loadCouple])

  if (checking || !coupleState) {
    return <div className="min-h-dvh bg-cream" />
  }

  return (
    <CoupleProvider value={{ ...coupleState, refresh: loadCouple }}>
      <div className="min-h-dvh flex flex-col bg-cream">
        <header className="sticky top-0 z-20 border-b border-cream-deep/70 bg-cream/90 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
            <button
              onClick={() => setLeavingToLanding(true)}
              className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-terracotta-deep"
            >
              <LogoIcon size={22} className="text-terracotta" />
              Obrolin
            </button>
            <div className="flex items-center gap-1">
              <nav className="flex items-center gap-1">
                {TABS.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                        isActive
                          ? 'bg-terracotta text-white shadow-sm'
                          : 'text-ink-soft hover:bg-cream-deep'
                      }`
                    }
                  >
                    <Icon size={16} strokeWidth={2} />
                    <span className="hidden sm:inline">{label}</span>
                  </NavLink>
                ))}
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-6">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>

        {/* Transisi logo singkat sebelum balik ke landing page */}
        {leavingToLanding && <SplashScreen duration={650} onFinish={() => navigate('/')} />}
      </div>
    </CoupleProvider>
  )
}
