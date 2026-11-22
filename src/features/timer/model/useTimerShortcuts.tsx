import { useEffect, useMemo, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { useTimerRailStore } from '@/features/timer-solves-rail/model/useTimerRailStore'
import { useFocusModeStore } from '@/features/focus-mode/model/useFocusModeStore'
import useQuickActions from '@/features/manage-solves/model/useQuickActions'
import SolveDetails from '@/features/manage-solves/ui/SolveDetails'
import DeleteSolveToast from '@/features/timer/ui/DeleteSolveToast'
import { TimerMode, TimerStatus } from '@/features/timer/model/enums'
import { useVirtualKeymapStore } from '@/features/timer/model/useVirtualKeymapStore'
import { compareNewestFirst } from '@/entities/solve/lib/sortSolves'
import { Solve } from '@/entities/solve/model/types'
import formatTime from '@/shared/lib/formatTime'

const DELETE_CONFIRM_MS = 3000
const DELETE_TOAST_ID = 'timer-shortcut-delete'
const FOCUS_RELEASE_KEYS = new Set(['o', '2', 'd', 'h', 'i', 'f', 'x', 'b', 'c', 'backspace', 'delete'])

const isTypingTarget = (): boolean => {
  const el = document.activeElement as HTMLElement | null
  if (!el) return false
  const tag = el.tagName?.toLowerCase()
  return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable || el.role === 'textbox'
}

const isDialogOpen = (): boolean =>
  useOverlayStore.getState().isOpen || !!document.querySelector('[role="dialog"], [role="alertdialog"], [role="menu"]')

const describeTime = (solve: Solve): string => {
  if (solve.dnf) return `DNF (${formatTime(solve.time)})`
  return `${formatTime(solve.time)}${solve.plus2 ? '+' : ''}`
}

export default function useTimerShortcuts() {
  const t = useTranslations('Index')
  const lastSolve = useTimerStore((state) => state.lastSolve)
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const activationKey = useSettingsStore((state) => state.settings.timer.activationKey) || 'Space'

  const target = useMemo<Solve | null>(() => {
    if (lastSolve) return lastSolve
    const session = selectedCube?.solves.session ?? []
    if (session.length === 0) return null
    return session.reduce((newest, solve) => (compareNewestFirst(solve, newest) < 0 ? solve : newest))
  }, [lastSolve, selectedCube])

  const { handleTogglePlus2, handleToggleDNF, handleDeleteSolve } = useQuickActions(target!)
  const pendingDelete = useRef<{ id: string; at: number } | null>(null)

  const latest = useRef({ target, t, handleTogglePlus2, handleToggleDNF, handleDeleteSolve })
  latest.current = { target, t, handleTogglePlus2, handleToggleDNF, handleDeleteSolve }

  useEffect(() => {
    const confirmDelete = (solve: Solve) => {
      pendingDelete.current = null
      toast.dismiss(DELETE_TOAST_ID)
      latest.current.handleDeleteSolve()
      const { lastSolve, setLastSolve } = useTimerStore.getState()
      if (lastSolve?.id === solve.id) setLastSolve(null)
    }

    const requestDelete = (solve: Solve, key: string) => {
      const pending = pendingDelete.current
      if (pending && pending.id === solve.id && Date.now() - pending.at < DELETE_CONFIRM_MS) {
        confirmDelete(solve)
        return
      }
      pendingDelete.current = { id: solve.id, at: Date.now() }
      const { t } = latest.current
      const title = t.rich('solve-details.delete-shortcut-title', {
        time: describeTime(solve),
        value: (chunks) => <span className="font-mono tabular-nums text-destructive">{chunks}</span>
      })
      const hint = t.rich('solve-details.delete-shortcut-hint', {
        key: key === 'Backspace' ? '⌫' : 'Del',
        kbd: (chunks) => (
          <kbd className="mx-0.5 inline-flex h-4 min-w-4 items-center justify-center border border-border bg-muted px-1 font-mono text-[10px] leading-none text-foreground">
            {chunks}
          </kbd>
        )
      })
      toast.custom(
        () => (
          <DeleteSolveToast
            title={title}
            hint={hint}
            actionLabel={t('tooltips.delete')}
            durationMs={DELETE_CONFIRM_MS}
            onConfirm={() => confirmDelete(solve)}
          />
        ),
        {
          id: DELETE_TOAST_ID,
          duration: DELETE_CONFIRM_MS,
          onDismiss: () => {
            if (pendingDelete.current?.id === solve.id) pendingDelete.current = null
          },
          onAutoClose: () => {
            if (pendingDelete.current?.id === solve.id) pendingDelete.current = null
          }
        }
      )
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return
      if (event.code === activationKey) return
      const { isSolving, timerStatus, timerMode, selectedCube, setNewScramble } = useTimerStore.getState()
      if (isSolving || timerStatus !== TimerStatus.IDLE) return
      if (timerMode === TimerMode.VIRTUAL) {
        const { keymap, isEditorOpen } = useVirtualKeymapStore.getState()
        if (isEditorOpen || event.code in keymap) return
      }
      if (isTypingTarget() || isDialogOpen()) return

      const key = event.key
      const lower = key.toLowerCase()
      const { target, handleTogglePlus2, handleToggleDNF } = latest.current

      if (lower === 'h') {
        event.preventDefault()
        useTimerRailStore.getState().toggle()
        return
      }
      if (lower === 'f') {
        if (!selectedCube) return
        event.preventDefault()
        useFocusModeStore.getState().toggle()
        return
      }
      if (lower === 'x') {
        const hintButton = document.querySelector<HTMLButtonElement>('[data-testid="hint-button"]')
        if (!hintButton) return
        event.preventDefault()
        hintButton.click()
        return
      }
      if (key === 'ArrowRight') {
        if (!selectedCube) return
        event.preventDefault()
        setNewScramble(selectedCube)
        return
      }
      if (!target) return

      if (lower === 'o') {
        event.preventDefault()
        if (target.plus2) handleTogglePlus2()
        else if (target.dnf) handleToggleDNF()
      } else if (key === '2') {
        event.preventDefault()
        if (!target.plus2) handleTogglePlus2()
      } else if (lower === 'd') {
        event.preventDefault()
        if (!target.dnf) handleToggleDNF()
      } else if (key === 'Backspace' || key === 'Delete') {
        event.preventDefault()
        requestDelete(target, key)
      } else if (lower === 'i') {
        event.preventDefault()
        useOverlayStore.getState().open({ id: 'solve-details', metadata: { ...target }, component: <SolveDetails /> })
      }
    }

    const releaseFocus = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return
      const isTimerKey = event.code === activationKey || FOCUS_RELEASE_KEYS.has(event.key.toLowerCase())
      if (!isTimerKey) return
      const el = document.activeElement as HTMLElement | null
      if (!el || el === document.body || isTypingTarget() || isDialogOpen()) return
      el.blur()
    }

    window.addEventListener('keydown', releaseFocus, { capture: true })
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', releaseFocus, { capture: true })
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activationKey])
}
