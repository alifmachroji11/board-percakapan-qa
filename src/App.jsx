import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import AppLayout from './layout/AppLayout.jsx'
import AppHome from './pages/AppHome.jsx'
import PilihFase from './pages/topik/PilihFase.jsx'
import DetailTopik from './pages/topik/DetailTopik.jsx'
import JurnalTopik from './pages/topik/JurnalTopik.jsx'
import BukaBarengTopik from './pages/topik/BukaBarengTopik.jsx'
import PertanyaanMinggu from './pages/kotakwaktu/PertanyaanMinggu.jsx'
import JurnalMinggu from './pages/kotakwaktu/JurnalMinggu.jsx'
import BukaBarengMinggu from './pages/kotakwaktu/BukaBarengMinggu.jsx'
import Riwayat from './pages/Riwayat.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

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
      </Route>
    </Routes>
  )
}
