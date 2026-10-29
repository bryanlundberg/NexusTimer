'use client'

import { useId } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export default function FaqItem({
  question,
  answer,
  open,
  onToggle
}: {
  question: string
  answer: string
  open: boolean
  onToggle: () => void
}) {
  const id = useId()

  return (
    <div className="bg-background">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left outline-none transition-colors hover:bg-foreground/4 focus-visible:bg-foreground/8 md:px-10 md:py-6"
        >
          <span className="text-base font-medium text-foreground md:text-lg">{question}</span>
          <Plus
            aria-hidden
            className={cn(
              'size-5 shrink-0 text-muted-foreground transition-transform duration-300',
              open && 'rotate-45 text-foreground'
            )}
          />
        </button>
      </h3>
      <div
        id={id}
        role="region"
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <p className="max-w-3xl px-5 pb-6 text-base leading-relaxed text-muted-foreground text-pretty md:px-10">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}
