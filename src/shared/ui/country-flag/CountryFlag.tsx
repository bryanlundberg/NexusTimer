import * as React from 'react'
import * as Flags from 'country-flag-icons/react/3x2'
import { cn } from '@/shared/lib/utils'

interface CountryFlagProps {
  /** ISO 3166-1 alpha-2 country code (e.g. "US", "MX") */
  code: string
  className?: string
}

export function CountryFlag({ code, className }: CountryFlagProps) {
  const Flag = (Flags as Record<string, React.ComponentType<{ className?: string }> | undefined>)[code.toUpperCase()]

  if (!Flag) return null

  return <Flag className={cn('w-4 rounded-[2px]', className)} />
}
