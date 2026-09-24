'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import { Drawer as DrawerPrimitive } from 'vaul'

import { cn } from '@/shared/lib/utils'

const SHEET_QUERY = '(max-width: 767px)'

const DialogVariantContext = React.createContext<'modal' | 'sheet'>('modal')

function subscribeSheetQuery(onChange: () => void) {
  if (typeof window.matchMedia !== 'function') return () => {}
  const mql = window.matchMedia(SHEET_QUERY)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

function getSheetSnapshot() {
  return typeof window.matchMedia === 'function' && window.matchMedia(SHEET_QUERY).matches
}

function useIsSheetViewport() {
  return React.useSyncExternalStore(subscribeSheetQuery, getSheetSnapshot, () => false)
}

const KEYBOARD_MIN_INSET = 100

function subscribeVisualViewport(onChange: () => void) {
  const viewport = window.visualViewport
  if (!viewport) return () => {}
  viewport.addEventListener('resize', onChange)
  viewport.addEventListener('scroll', onChange)
  return () => {
    viewport.removeEventListener('resize', onChange)
    viewport.removeEventListener('scroll', onChange)
  }
}

function subscribeNothing() {
  return () => {}
}

function getKeyboardInset() {
  const viewport = window.visualViewport
  if (!viewport) return 0
  const inset = Math.round(window.innerHeight - viewport.height - viewport.offsetTop)
  return inset >= KEYBOARD_MIN_INSET ? inset : 0
}

function getNoInset() {
  return 0
}

function useKeyboardInset(enabled: boolean) {
  return React.useSyncExternalStore(
    enabled ? subscribeVisualViewport : subscribeNothing,
    enabled ? getKeyboardInset : getNoInset,
    getNoInset
  )
}

function Dialog({
  dismissible = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root> & { dismissible?: boolean }) {
  const isSheet = useIsSheetViewport()

  if (isSheet) {
    return (
      <DialogVariantContext.Provider value="sheet">
        <DrawerPrimitive.Root data-slot="dialog" repositionInputs={false} dismissible={dismissible} {...props} />
      </DialogVariantContext.Provider>
    )
  }

  return (
    <DialogVariantContext.Provider value="modal">
      <DialogPrimitive.Root data-slot="dialog" {...props} />
    </DialogVariantContext.Provider>
  )
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        className
      )}
      {...props}
    />
  )
}

const closeButtonClassName =
  "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

function DialogContent({
  className,
  children,
  showCloseButton = false,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  const variant = React.useContext(DialogVariantContext)
  const keyboardInset = useKeyboardInset(variant === 'sheet')

  if (variant === 'sheet') {
    const { style, ...contentProps } = props
    const keyboardStyle: React.CSSProperties = keyboardInset
      ? { bottom: keyboardInset, maxHeight: `calc(100dvh - ${keyboardInset}px - 1rem)` }
      : {}
    return (
      <DrawerPrimitive.Portal data-slot="dialog-portal">
        <DrawerPrimitive.Overlay data-slot="dialog-overlay" className="fixed inset-0 z-50 bg-black/60" />
        <DrawerPrimitive.Content
          data-slot="dialog-content"
          style={{ ...style, ...keyboardStyle }}
          className="modal-texture bg-background border-foreground/15 fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-none border-t pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_32px_-8px_rgb(0_0_0/0.45)] outline-none"
          {...contentProps}
        >
          <div aria-hidden className="bg-muted-foreground/60 mx-auto mt-2.5 mb-1 h-1 w-10 shrink-0 rounded-none" />
          <div
            className={cn(
              'grid min-h-0 w-full gap-4 overflow-y-auto overscroll-contain p-6 pt-3',
              className,
              'max-w-none sm:max-w-none'
            )}
          >
            {children}
          </div>
          {showCloseButton && (
            <DialogPrimitive.Close data-slot="dialog-close" className={closeButtonClassName}>
              <XIcon />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    )
  }

  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        onOpenAutoFocus={(e) => e.preventDefault()}
        data-slot="dialog-content"
        className={cn(
          'modal-texture bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-none border p-6 shadow-lg duration-200 sm:max-w-lg',
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close data-slot="dialog-close" className={closeButtonClassName}>
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('font-display text-lg leading-none font-semibold', className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger
}
