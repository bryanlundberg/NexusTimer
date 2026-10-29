import { cn } from '@/shared/lib/utils'

export default function SectionBand({ variant = 'dots' }: { variant?: 'dots' | 'hatch' }) {
  return (
    <div
      aria-hidden
      className={cn('relative h-12 border-b border-border md:h-16', variant === 'dots' ? 'lp-dots' : 'lp-hatch')}
    >
      <span className="lp-handle left-0 top-full hidden md:block" />
      <span className="lp-handle left-full top-full hidden md:block" />
    </div>
  )
}
