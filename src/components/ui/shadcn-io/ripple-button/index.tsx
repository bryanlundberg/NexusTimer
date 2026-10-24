'use client'

import * as React from 'react'
import { type HTMLMotionProps, motion } from 'motion/react'
import { type VariantProps } from 'class-variance-authority'

import { cn } from '@/shared/lib/utils'
import { buttonVariants } from '@/components/ui/button-variants'
import { triggerHaptic } from '@/shared/model/useHaptics'

type RippleButtonProps = HTMLMotionProps<'button'> & {
  children: React.ReactNode
  haptic?: boolean
} & VariantProps<typeof buttonVariants>

function RippleButton({
  ref,
  children,
  onClick,
  className,
  variant,
  size,
  haptic = true,
  ...props
}: RippleButtonProps) {
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
      className={cn(buttonVariants({ variant, size }), className)}
      {...(props as any)}
    >
      {children}
    </motion.button>
  )
}

export { RippleButton, type RippleButtonProps }
