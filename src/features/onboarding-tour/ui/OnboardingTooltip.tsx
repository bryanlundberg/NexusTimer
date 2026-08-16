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
    <div {...tooltipProps} className="tour-notch pointer-events-auto relative w-[clamp(280px,90vw,368px)]">
      <span
        aria-hidden
        className="from-primary via-primary/45 pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r to-transparent"
      />

      <div key={index} className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300 ease-out">
        <div className="flex gap-3.5 p-5">
          <div className="relative grid size-16 shrink-0 place-items-center" aria-hidden>
            <span className="bg-primary/20 absolute inset-3 rounded-full blur-xl" />
            <span className="bg-primary/15 absolute inset-5 rounded-full blur-lg" />
            <Nexi state={nexiState} size={56} className="relative" />
          </div>

          <div className="min-w-0 flex-1">
            {step.title && (
              <h3 className="font-display text-base leading-tight font-semibold tracking-tight text-balance">
                {step.title}
              </h3>
            )}
            <p className="text-muted-foreground font-display mt-1.5 text-sm leading-relaxed text-pretty">
              {step.content}
            </p>
          </div>
        </div>

        <div className="border-border/60 flex items-center justify-between gap-3 border-t px-5 py-3">
          <div className="flex items-center gap-1.5" aria-hidden>
            {Array.from({ length: size }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  'diag-bar h-[5px] transition-all duration-300',
                  i === index ? 'bg-primary w-7' : i < index ? 'bg-primary/45 w-4' : 'bg-muted-foreground/25 w-4'
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            {showSkip && (
              <Button
                {...skipProps}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground font-display"
              >
                {locale.skip ?? 'Skip'}
              </Button>
            )}
            {showPrimary && (
              <Button {...primaryProps} size="sm" className="tour-cta font-display tracking-wide">
                {locale.next ?? 'Next'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
