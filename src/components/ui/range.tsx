import * as React from 'react'

import { cn } from '@/shared/lib/utils'

type RangeProps = Omit<React.ComponentProps<'input'>, 'type' | 'value' | 'min' | 'max'> & {
  value: number
  min: number
  max: number
}

function Range({ className, value, min, max, style, ...props }: RangeProps) {
  const ratio = max > min ? Math.min(1, Math.max(0, (value - min) / (max - min))) : 0
  const fill = `calc(24px + ${ratio} * (100% - 24px))`

  return (
    <input
      type="range"
      data-slot="range"
      value={value}
      min={min}
      max={max}
      style={{
        backgroundImage: `linear-gradient(to right, var(--primary) ${fill}, var(--input) ${fill})`,
        ...style
      }}
      className={cn(
        'h-6 w-full min-w-0 cursor-pointer appearance-none border-2 border-transparent bg-origin-border outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
        '[&::-webkit-slider-runnable-track]:h-full [&::-webkit-slider-runnable-track]:bg-transparent',
        '[&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-primary-foreground',
        '[&::-moz-range-track]:h-full [&::-moz-range-track]:bg-transparent',
        '[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary-foreground',
        className
      )}
      {...props}
    />
  )
}

export { Range }
