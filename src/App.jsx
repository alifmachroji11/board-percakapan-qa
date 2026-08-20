import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import SplashScreen from './components/SplashScreen.jsx'
import Landing from './pages/Landing.jsx'
import Privasi from './pages/Privasi.jsx'
import AppLayout from './layout/AppLayout.jsx'
import AppHome from './pages/AppHome.jsx'
import Pairing from './pages/Pairing.jsx'
import PilihFase from './pages/topik/PilihFase.jsx'
import DetailTopik from './pages/topik/DetailTopik.jsx'
import JurnalTopik from './pages/topik/JurnalTopik.jsx'
import BukaBarengTopik from './pages/topik/BukaBarengTopik.jsx'
import PertanyaanMinggu from './pages/kotakwaktu/PertanyaanMinggu.jsx'
import JurnalMinggu from './pages/kotakwaktu/JurnalMinggu.jsx'
import BukaBarengMinggu from './pages/kotakwaktu/BukaBarengMinggu.jsx'
import Riwayat from './pages/Riwayat.jsx'
import Akun from './pages/Akun.jsx'

const SPLASH_SEEN_KEY = 'obrolin_splash_seen'

export default function App() {
  // Splash logo tampil sekali per sesi browser — begitu link dibuka,
  // sebelum masuk ke landing page.
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem(SPLASH_SEEN_KEY))

  function handleSplashFinish() {
    sessionStorage.setItem(SPLASH_SEEN_KEY, '1')
    setShowSplash(false)
  }

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen key="splash" duration={1300} onFinish={handleSplashFinish} />}
      </AnimatePresence>

      {!showSplash && (
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/privasi" element={<Privasi />} />

          <Route path="/app/pairing" element={<Pairing />} />

          <Route path="/app" element={<AppLayout />}>
            <Route index element={<AppHome />} />

            <Route path="topik" element={<PilihFase />} />
            <Route path="topik/:topicId" element={<DetailTopik />} />
            <Route path="topik/:topicId/jurnal" element={<JurnalTopik />} />
            <Route path="topik/:topicId/buka-bareng" element={<BukaBarengTopik />} />

            <Route path="kotak-waktu" element={<PertanyaanMinggu />} />
            <Route path="kotak-waktu/jawab" element={<JurnalMinggu />} />
            <Route path="kotak-waktu/buka-bareng" element={<BukaBarengMinggu />} />

            <Route path="riwayat" element={<Riwayat />} />
            <Route path="akun" element={<Akun />} />
          </Route>
        </Routes>
      )}
    </>
  )
}
