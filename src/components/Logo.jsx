// Bentuk bubble percakapan — sama seperti mark resmi Obrolin.
const ICON_PATH =
  'M34,8 H66 A26,26 0 0 1 92,34 V50 A26,26 0 0 1 66,76 L46,76 L26,94 L36,76 L34,76 A26,26 0 0 1 8,50 V34 A26,26 0 0 1 34,8 Z'

export function LogoIcon({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d={ICON_PATH} fill="currentColor" />
    </svg>
  )
}

export function LogoLockup({ iconSize = 28, textClassName = 'text-lg', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoIcon size={iconSize} className="shrink-0 text-terracotta" />
      <span className={`font-extrabold tracking-tight text-terracotta-deep ${textClassName}`}>Obrolin</span>
    </span>
  )
}
