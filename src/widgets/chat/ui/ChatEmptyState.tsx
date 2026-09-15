import type { LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
}

export function ChatEmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="m-auto flex max-w-xs flex-col items-center gap-4 p-8 text-center">
      <span className="icon-notch flex size-14 items-center justify-center text-muted-foreground">
        <Icon className="size-6" />
      </span>

      <div className="flex flex-col gap-1.5">
        <p className="font-display text-sm font-semibold tracking-tight">{title}</p>
        {description && <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>}
      </div>

      {action}
    </div>
  )
}
