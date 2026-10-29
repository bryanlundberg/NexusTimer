'use client'

import { useId, useState } from 'react'
import { cn } from '@/shared/lib/utils'

export default function AboutBlock({
  paragraphs,
  moreLabel,
  lessLabel
}: {
  paragraphs: string[]
  moreLabel: string
  lessLabel: string
}) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const half = Math.ceil(paragraphs.length / 2)
  const columns = [paragraphs.slice(0, half), paragraphs.slice(half)]

  return (
    <div>
      <div
        id={id}
        className={cn(
          'grid gap-x-12 gap-y-4 overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none md:grid-cols-2',
          open ? 'max-h-[80rem]' : 'max-h-[4.9rem] [mask-image:linear-gradient(to_bottom,black_35%,transparent)]'
        )}
      >
        {columns.map((column, i) => (
          <div key={i} className="space-y-4">
            {column.map((text) => (
              <p key={text} className="text-sm leading-relaxed text-muted-foreground text-pretty">
                {text}
              </p>
            ))}
          </div>
        ))}
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
        className="mt-4 text-sm font-medium text-foreground underline-offset-4 outline-none hover:underline focus-visible:underline"
      >
        {open ? lessLabel : moreLabel}
      </button>
    </div>
  )
}
