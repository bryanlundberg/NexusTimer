import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface DisplayContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: ReactNode
}

export default function DisplayContainer({ className, children, ...rest }: DisplayContainerProps) {
  return (
    <>
      <div id="touch" className={cn('flex flex-col items-center justify-center grow', className)} {...rest}>
        {children}
      </div>
    </>
  )
}
