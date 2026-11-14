'use client'

import { useRef, useState } from 'react'
import type { ReactNode } from 'react'

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useSwipeToClose } from '@/shared/model/useSwipeToClose'

interface NavUserSheetProps {
  trigger: ReactNode
  title: string
  children: ReactNode
}

export function NavUserSheet({ trigger, title, children }: NavUserSheetProps) {
  const [open, setOpen] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useSwipeToClose(sheetRef, overlayRef, () => setOpen(false), { side: 'right', enabled: open })

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        ref={sheetRef}
        overlayRef={overlayRef}
        side="right"
        aria-describedby={undefined}
        className="w-[min(20rem,85vw)] gap-0 [&>button]:hidden"
      >
        <SheetTitle className="sr-only">{title}</SheetTitle>
        <div className="flex-1 overflow-y-auto pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}
