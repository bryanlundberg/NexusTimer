'use client'

import React, { createContext, useCallback, useContext, useRef, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { useTranslations } from 'next-intl'

export type AlertParams = {
  title?: string
  subtitle?: string
  confirmText?: string
  cancelText?: string
  hideCancel?: boolean
}

// The function signature returned by useAlert
export type AlertFunction = (params: AlertParams) => Promise<boolean>

interface AlertContextValue {
  alert: AlertFunction
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined)

export function useAlertContext() {
  const ctx = useContext(AlertContext)
  if (!ctx) throw new Error('useAlert must be used within an AlertProvider')
  return ctx
}

export default function AlertsProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Index')
  const resolverRef = useRef<((value: boolean) => void) | null>(null)

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState<string | undefined>(undefined)
  const [subtitle, setSubtitle] = useState<string | undefined>(undefined)
  const [confirmText, setConfirmText] = useState<string | undefined>(undefined)
  const [cancelText, setCancelText] = useState<string | undefined>(undefined)
  const [hideCancel, setHideCancel] = useState<boolean | undefined>(undefined)

  const close = useCallback(() => setOpen(false), [])

  const alert = useCallback<AlertFunction>((params: AlertParams) => {
    setTitle(params.title)
    setSubtitle(params.subtitle)
    setConfirmText(params.confirmText)
    setCancelText(params.cancelText)
    setHideCancel(params.hideCancel)
    setOpen(true)

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve
    })
  }, [])

  const handleConfirm = useCallback(() => {
    if (resolverRef.current) {
      resolverRef.current(true)
      resolverRef.current = null
    }
    close()
  }, [close])

  const handleCancel = useCallback(() => {
    if (resolverRef.current) {
      resolverRef.current(false)
      resolverRef.current = null
    }
    close()
  }, [close])

  return (
    <AlertContext.Provider value={{ alert }}>
      {children}

      <AlertDialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleCancel()
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            {title ? <AlertDialogTitle>{title}</AlertDialogTitle> : null}
            {subtitle ? <AlertDialogDescription>{subtitle}</AlertDialogDescription> : null}
          </AlertDialogHeader>
          <AlertDialogFooter>
            {hideCancel ? null : (
              <AlertDialogCancel onClick={handleCancel}>{cancelText || t('Inputs.cancel')}</AlertDialogCancel>
            )}
            <AlertDialogAction onClick={handleConfirm}>{confirmText || t('Inputs.continue')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertContext.Provider>
  )
}
