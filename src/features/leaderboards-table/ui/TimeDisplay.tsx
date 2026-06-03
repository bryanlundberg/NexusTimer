export function TimeDisplay({ value }: { value: string }) {
  const [main, decimal] = value.includes('.') ? value.split('.') : [value, null]
  return (
    <div className="flex items-baseline gap-0.5">
      <span className="text-sm font-bold tabular-nums">{main}</span>
      {decimal && <span className="text-xs text-muted-foreground tabular-nums">.{decimal}</span>}
    </div>
  )
}
