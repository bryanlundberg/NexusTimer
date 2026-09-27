import { cn } from '@/shared/lib/utils'

interface MenuFieldRowProps {
  label: string
  htmlFor?: string
  hint?: React.ReactNode
  error?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function MenuFieldRow({ label, htmlFor, hint, error, children, className }: MenuFieldRowProps) {
  const labelClassName = 'text-[15px] leading-snug sm:text-sm'

  return (
    <div className={cn('flex flex-col gap-2 px-4 py-3.5', className)}>
      <div className="flex items-baseline justify-between gap-3">
        {htmlFor ? (
          <label htmlFor={htmlFor} className={labelClassName}>
            {label}
          </label>
        ) : (
          <span className={labelClassName}>{label}</span>
        )}
        {hint}
      </div>
      {children}
      {error && <p className="text-[13px] font-medium text-destructive sm:text-xs">{error}</p>}
    </div>
  )
}
