const VARIANTS = {
  primary: 'bg-terracotta text-white hover:bg-terracotta-deep shadow-sm shadow-terracotta/20',
  secondary: 'bg-surface text-ink border border-cream-deep hover:border-terracotta/40',
  soft: 'bg-cream-deep text-ink hover:bg-dusty-pink/40',
  blue: 'bg-soft-blue text-white hover:bg-soft-blue-deep shadow-sm shadow-soft-blue/20',
}

export default function PillButton({
  as: Component = 'button',
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
