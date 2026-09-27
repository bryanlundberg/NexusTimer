import { cn } from '@/shared/lib/utils'

interface MenuActionRowProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  label: string
  tone?: 'default' | 'destructive'
}

export function MenuActionRow({ icon, label, tone = 'default', className, ...props }: MenuActionRowProps) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        'flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left text-[15px] leading-snug transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-muted/30 active:bg-muted/50 disabled:pointer-events-none disabled:opacity-50 sm:text-sm [&_svg]:size-4 [&_svg]:shrink-0',
        tone === 'destructive' ? 'text-destructive' : '[&_svg]:text-muted-foreground',
        className
      )}
    >
      {icon}
      {label}
    </button>
  )
}
