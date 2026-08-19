const THEME_KEY = 'obrolin_theme'

// Default selalu light mode — class 'dark' cuma ditambahin kalau user
// pernah pilih dark sebelumnya (tersimpan di localStorage).
export function initTheme() {
  if (localStorage.getItem(THEME_KEY) === 'dark') {
    document.documentElement.classList.add('dark')
  }
}

export function isDarkTheme() {
  return document.documentElement.classList.contains('dark')
}

export function toggleTheme() {
  const next = !isDarkTheme()
  document.documentElement.classList.toggle('dark', next)
  localStorage.setItem(THEME_KEY, next ? 'dark' : 'light')
  return next
}
