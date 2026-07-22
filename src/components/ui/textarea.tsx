import * as React from 'react'

import { cn } from '@/shared/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <div data-slot="textarea-wrapper" className="field-notch flex w-full">
      <textarea
        data-slot="textarea"
        className={cn(
          'placeholder:text-muted-foreground relative z-[1] flex field-sizing-content min-h-16 w-full resize-none border-0 bg-transparent px-3 py-2 text-base outline-none transition-[color] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        {...props}
      />
    </div>
  )
}

export { Textarea }
