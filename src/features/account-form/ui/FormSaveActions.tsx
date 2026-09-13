import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { Loader2, Save, Undo2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FormSaveActionsProps {
  isDirty: boolean
  isValid: boolean
  isSubmitting: boolean
  onDiscard: () => void
  onSave: () => void
}

const isMac = () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent)

export function FormSaveActions({ isDirty, isValid, isSubmitting, onDiscard, onSave }: FormSaveActionsProps) {
  const t = useTranslations('Index.AccountPage')
  const tInputs = useTranslations('Index.Inputs')

  useEffect(() => {
    if (!isDirty) return

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        if (isValid && !isSubmitting) onSave()
      }
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isDirty, isValid, isSubmitting, onSave])

  const status = isValid ? t('unsaved-changes') : t('fix-errors')

  return (
    <AnimatePresence initial={false}>
      {isDirty && (
        <motion.div
          key="save-actions"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 12 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="flex shrink-0 items-center gap-2"
        >
          <span role="status" className="flex min-w-0 items-center gap-2 text-xs font-medium" title={status}>
            <span className="relative flex size-2 shrink-0" aria-hidden>
              <span
                className={
                  isValid
                    ? 'absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none'
                    : 'hidden'
                }
              />
              <span
                className={`relative inline-flex size-2 rounded-full ${isValid ? 'bg-primary' : 'bg-destructive'}`}
              />
            </span>
            <span className="sr-only sm:not-sr-only sm:max-w-52 sm:truncate">{status}</span>
          </span>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDiscard}
            disabled={isSubmitting}
            aria-label={t('discard')}
            className="h-8 px-2.5"
          >
            <Undo2 className="size-4 sm:hidden" aria-hidden />
            <span className="hidden sm:inline">{t('discard')}</span>
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || !isValid}
            title={isMac() ? '⌘ S' : 'Ctrl S'}
            className="h-8 gap-1.5 px-3"
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {tInputs('save')}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
