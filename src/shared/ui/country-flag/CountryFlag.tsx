import { hasFlag } from 'country-flag-icons'
import { cn } from '@/shared/lib/utils'

interface CountryFlagProps {
  /** ISO 3166-1 alpha-2 country code (e.g. "US", "MX") */
  code: string
  className?: string
}

export function CountryFlag({ code, className }: CountryFlagProps) {
  const country = code.toUpperCase()
  if (!hasFlag(country)) return null

  return (
    <img
      src={`/flags/${country}.svg`}
      alt=""
      loading="lazy"
      decoding="async"
      className={cn('w-4 aspect-[3/2] rounded-[2px]', className)}
    />
  )
}
