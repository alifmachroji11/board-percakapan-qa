import { useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { isDarkTheme, toggleTheme } from '../lib/theme.js'

export default function ThemeToggle({ className = '' }) {
  const [dark, setDark] = useState(() => isDarkTheme())

  return (
    <button
      onClick={() => setDark(toggleTheme())}
      aria-label={dark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
      title={dark ? 'Mode terang' : 'Mode gelap'}
      className={`flex size-9 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-cream-deep ${className}`}
    >
      {dark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
    </button>
  )
}
