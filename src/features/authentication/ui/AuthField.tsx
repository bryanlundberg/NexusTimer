import { cn } from '@/shared/lib/utils'

type Props = React.ComponentProps<'input'> & {
  label: string
  error?: string
}

export default function AuthField({ label, error, id, className, ...props }: Props) {
  return (
    <div data-auth-row className="auth-flow-row" data-invalid={!!error}>
      <label htmlFor={id} className="auth-flow-label">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        className={cn(
          'h-7 w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted-foreground/55 selection:bg-primary selection:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
