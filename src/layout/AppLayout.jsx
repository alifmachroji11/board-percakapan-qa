import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { MessageCircleHeart, Clock, History } from 'lucide-react'
import PageTransition from '../components/PageTransition.jsx'

const TABS = [
  { to: '/app/topik', label: 'Kartu Topik', icon: MessageCircleHeart },
  { to: '/app/kotak-waktu', label: 'Kotak Waktu', icon: Clock },
  { to: '/app/riwayat', label: 'Riwayat', icon: History },
]

export default function AppLayout() {
  const location = useLocation()

  return (
    <div className="min-h-dvh flex flex-col bg-cream">
      <header className="sticky top-0 z-20 border-b border-cream-deep/70 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <NavLink to="/app" className="text-lg font-extrabold tracking-tight text-terracotta-deep">
            Obrolin
          </NavLink>
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
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-6">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
    </div>
  )
}
