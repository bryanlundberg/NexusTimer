'use client'

import * as React from 'react'
import { type HTMLMotionProps, motion } from 'motion/react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/shared/lib/utils'
import { triggerHaptic } from '@/shared/model/useHaptics'

const buttonVariants = cva(
  "relative overflow-hidden cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-medium transition-all duration-[var(--dur-fast)] ease-[var(--ease-solve)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50'
      },
      size: {
        default: 'h-10 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-9 gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-11 px-8 has-[>svg]:px-6',
        icon: 'size-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

type RippleButtonProps = HTMLMotionProps<'button'> & {
  children: React.ReactNode
  haptic?: boolean
  notch?: boolean
} & VariantProps<typeof buttonVariants>

function RippleButton({
  ref,
  children,
  onClick,
  className,
  variant,
  size,
  haptic = true,
  notch = true,
  ...props
}: RippleButtonProps) {
  const notched = notch && size !== 'icon' && (!variant || variant === 'default' || variant === 'destructive')
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  React.useImperativeHandle(ref as any, () => buttonRef.current as HTMLButtonElement)

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (haptic && variant !== 'ghost') triggerHaptic()
      if (onClick) {
        onClick(event)
      }
    },
    [onClick, haptic, variant]
  )

  return (
    <motion.button
      ref={buttonRef}
      data-slot="ripple-button"
      onClick={handleClick}
      className={cn(buttonVariants({ variant, size }), notched && 'btn-notch', className)}
      {...(props as any)}
    >
      {children}
    </motion.button>
  )
}

export { RippleButton, type RippleButtonProps, buttonVariants }
