import { getIntegerPart, getDecimalPart } from '@/shared/lib/formatTimeParts'

export function SolvingTime({ ms }: { ms: number }) {
  const main = getIntegerPart(ms)
  const decimals = getDecimalPart(ms)

  return (
    <div className="flex items-baseline tabular-nums font-semibold leading-none">
      <span className="text-5xl sm:text-7xl">{main}</span>
      {decimals && <span className="text-3xl sm:text-5xl text-muted-foreground">{decimals}</span>}
    </div>
  )
}
