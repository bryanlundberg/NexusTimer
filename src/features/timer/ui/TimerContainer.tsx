import React from 'react'
import { twMerge } from 'tailwind-merge'

interface TimerContainer extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export default function TimerContainer({ children, className, ...rest }: TimerContainer) {
  return (
    <div {...rest} className={twMerge('flex flex-col justify-between px-2 pt-2 sm:px-3 grow z-2', className)}>
      {children}
    </div>
  )
}
