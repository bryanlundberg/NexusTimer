import { useEffect, useMemo, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { useTimerRailStore } from '@/features/timer-solves-rail/model/useTimerRailStore'
import useQuickActions from '@/features/manage-solves/model/useQuickActions'
import SolveDetails from '@/features/manage-solves/ui/SolveDetails'
import { TimerMode, TimerStatus } from '@/features/timer/model/enums'
import { useVirtualKeymapStore } from '@/features/timer/model/useVirtualKeymapStore'
import { compareNewestFirst } from '@/entities/solve/lib/sortSolves'
import { Solve } from '@/entities/solve/model/types'
import formatTime from '@/shared/lib/formatTime'

const DELETE_CONFIRM_MS = 3000
const DELETE_TOAST_ID = 'timer-shortcut-delete'

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
      toast(t('solve-details.delete-shortcut-title', { key }), {
        id: DELETE_TOAST_ID,
        duration: DELETE_CONFIRM_MS,
        description: (
          <span className="flex flex-col gap-0.5">
            <span className="font-mono font-semibold tabular-nums">{describeTime(solve)}</span>
            {solve.scramble && <span className="font-mono text-xs text-muted-foreground">{solve.scramble}</span>}
            <span className="text-xs text-muted-foreground">{new Date(solve.endTime).toLocaleString()}</span>
          </span>
        ),
        action: { label: t('tooltips.delete'), onClick: () => confirmDelete(solve) },
        onDismiss: () => {
          if (pendingDelete.current?.id === solve.id) pendingDelete.current = null
        },
        onAutoClose: () => {
          if (pendingDelete.current?.id === solve.id) pendingDelete.current = null
        }
      })
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

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activationKey])
}
