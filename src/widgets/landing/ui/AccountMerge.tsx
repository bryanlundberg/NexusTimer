import type { ElementType } from 'react'
import { Check } from 'lucide-react'
import { BrandMark } from '@/widgets/sidebar/ui/brand-mark'
import { cn } from '@/shared/lib/utils'

export type MergedFeature = { icon: ElementType; label: string }

export default function AccountMerge({
  title,
  features,
  active
}: {
  title: string
  features: MergedFeature[]
  active: number
}) {
  return (
    <div className="lp-panel relative isolate flex flex-col items-center px-6 pb-8 pt-14 text-center md:px-8 md:pb-10">
      <div aria-hidden className="lp-glow" />

      <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
        <span aria-hidden className="lp-ping absolute inset-0 rounded-[14px] border border-foreground" />
        <span className="relative flex size-14 items-center justify-center rounded-[14px] border border-border bg-[var(--lp-night)]">
          <BrandMark />
        </span>
      </div>

      <h3 className="font-[family-name:var(--font-space-grotesk)] text-balance text-2xl font-medium tracking-[-0.02em] md:text-3xl">
        {title}
      </h3>

      <ul className="mt-6 flex max-w-3xl flex-wrap justify-center gap-1 rounded-[12px] border border-border bg-[oklch(0.2_0.06_262/0.35)] p-2 backdrop-blur-sm">
        {features.map(({ icon: Icon, label }, i) => (
          <li
            key={label}
            className={cn(
              'flex items-center gap-2.5 rounded-[8px] px-3 py-2.5 transition-colors duration-300',
              i === active && 'bg-foreground/12'
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            <span className="text-sm font-medium">{label}</span>
            <span
              className={cn(
                'flex size-5 items-center justify-center rounded-full bg-foreground transition-transform duration-300',
                i === active ? 'scale-110' : 'scale-100'
              )}
            >
              <Check className="size-3 text-[var(--lp-accent)]" strokeWidth={3} aria-hidden />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
