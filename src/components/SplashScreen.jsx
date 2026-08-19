import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { LogoLockup } from './Logo.jsx'

// Transisi logo — dipakai saat pertama buka web (menuju landing) dan saat
// kembali dari menu ke landing, supaya perpindahannya terasa jadi satu momen
// bermerek, bukan potongan halaman yang kasar.
export default function SplashScreen({ duration = 1200, onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => onFinish?.(), duration)
    return () => clearTimeout(timer)
  }, [duration, onFinish])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-cream"
    >
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
      >
        <LogoLockup iconSize={40} textClassName="text-3xl" />
      </motion.div>
    </motion.div>
  )
}
