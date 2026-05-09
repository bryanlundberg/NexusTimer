interface TrainerStatRowProps {
  label: string
  value: string
}

export default function TrainerStatRow({ label, value }: TrainerStatRowProps) {
  return (
    <div className="flex items-center justify-between gap-2 py-1 border-b last:border-b-0 border-border/60">
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
      <span className="text-sm font-mono tabular-nums">{value}</span>
    </div>
  )
}
