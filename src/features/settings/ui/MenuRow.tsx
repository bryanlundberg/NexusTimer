import { cn } from '@/shared/lib/utils'
import { MenuRowText } from './MenuRowText'

interface MenuRowProps {
  label: string
  description?: string
  children: React.ReactNode
  className?: string
  htmlFor?: string
  stack?: boolean
}

export function MenuRow({ label, description, children, className, htmlFor, stack }: MenuRowProps) {
  const content = (
    <div
      className={cn(
        'flex items-center justify-between gap-4',
        stack && 'flex-col items-stretch gap-3 sm:flex-row sm:items-center'
      )}
    >
      <MenuRowText label={label} description={description} />
      {children}
    </div>
  )
  const rowClassName = cn('block px-4 py-3.5 transition-colors hover:bg-muted/30', className)

  if (htmlFor) {
    return (
      <label
        htmlFor={htmlFor}
        className={cn(
          rowClassName,
          'cursor-pointer select-none [-webkit-tap-highlight-color:transparent] active:bg-muted/50'
        )}
      >
        {content}
      </label>
    )
  }

  return <div className={rowClassName}>{content}</div>
}
