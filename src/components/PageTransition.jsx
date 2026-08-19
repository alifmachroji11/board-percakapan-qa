import { motion } from 'framer-motion'

// Transisi halus antar halaman product flow — topiknya sensitif,
// perpindahan instan/kaku bikin terasa seperti aplikasi form biasa.
export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
