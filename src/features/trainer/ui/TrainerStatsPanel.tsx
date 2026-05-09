import { Card } from '@/components/ui/card'
import { ReactNode } from 'react'

interface TrainerStatsPanelProps {
  title: string
  icon?: ReactNode
  children: ReactNode
}

export default function TrainerStatsPanel({ title, icon, children }: TrainerStatsPanelProps) {
  return (
    <Card className="p-3 gap-1.5 bg-card/50">
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-primary [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>}
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      </div>
      <div className="flex flex-col">{children}</div>
    </Card>
  )
}
