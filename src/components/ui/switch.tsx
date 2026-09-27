'use client'

import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'

import { cn } from '@/shared/lib/utils'

const TRACK_SHAPE = '[clip-path:polygon(0_0,calc(100%_-_6px)_0,100%_6px,100%_100%,6px_100%,0_calc(100%_-_6px))]'
const THUMB_SHAPE = '[clip-path:polygon(0_0,calc(100%_-_4px)_0,100%_4px,100%_100%,4px_100%,0_calc(100%_-_4px))]'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'group/switch peer relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center px-0.5 outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
    ref={ref}
  >
    <span
      aria-hidden
      className={cn(
        'absolute inset-0 bg-input transition-colors duration-200 group-data-[state=checked]/switch:bg-primary',
        TRACK_SHAPE
      )}
    />
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none relative block h-5 w-5 bg-muted-foreground transition-[translate,width,background-color] duration-200 ease-(--ease-solve) data-[state=checked]:translate-x-5 data-[state=checked]:bg-primary-foreground data-[state=unchecked]:translate-x-0 group-active/switch:w-6 group-active/switch:data-[state=checked]:translate-x-4',
        THUMB_SHAPE
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
