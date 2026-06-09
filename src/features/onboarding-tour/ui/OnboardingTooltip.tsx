'use client'
import { type TooltipRenderProps } from 'react-joyride'
import { Button } from '@/components/ui/button'
import { Nexi, type NexiState } from '@/shared/ui/nexi'
import { cn } from '@/shared/lib/utils'

export default function OnboardingTooltip({
  index,
  size,
  step,
  primaryProps,
  skipProps,
  tooltipProps
}: TooltipRenderProps) {
  const buttons = step.buttons ?? []
  const showSkip = buttons.includes('skip')
  const showPrimary = buttons.includes('primary')
  const nexiState = (step.data?.nexi ?? 'hello') as NexiState
  const locale = step.locale ?? {}

  return (
    <div
      {...tooltipProps}
      className="pointer-events-auto relative w-[clamp(280px,90vw,360px)] overflow-hidden rounded-2xl border border-border/60 bg-popover text-popover-foreground shadow-2xl ring-1 ring-primary/10"
    >
      <div className="flex gap-3 p-5">
        <div className="bg-primary/10 ring-primary/15 flex size-14 shrink-0 items-center justify-center rounded-xl ring-1">
          <Nexi state={nexiState} size={44} />
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          {step.title && <h3 className="text-base leading-tight font-semibold">{step.title}</h3>}
          <p className="text-muted-foreground text-sm leading-relaxed">{step.content}</p>
        </div>
      </div>

      <div className="border-border/50 flex items-center justify-between gap-3 border-t px-5 py-3">
        <div className="flex items-center gap-1.5" aria-hidden>
          {Array.from({ length: size }).map((_, i) => (
            <span
              key={i}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === index ? 'bg-primary w-4' : 'bg-muted-foreground/30 w-1.5'
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-1">
          {showSkip && (
            <Button {...skipProps} variant="ghost" size="sm" className="text-muted-foreground">
              {locale.skip ?? 'Skip'}
            </Button>
          )}
          {showPrimary && (
            <Button {...primaryProps} size="sm" className="shadow-primary/25 shadow-lg">
              {locale.next ?? 'Next'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
