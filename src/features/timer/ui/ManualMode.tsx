'use client'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import useSolveData from '@/features/timer/model/useSolveData'
import QuickActions from '@/features/manage-solves/ui/QuickActions'
import formatTime from '@/shared/lib/formatTime'
import ManualModeForm from './ManualModeForm'

export default function ManualMode() {
  const { saveSolveManualMode } = useSolveData()
  const selectedCube = useTimerStore((store) => store.selectedCube)
  const lastSolve = useTimerStore((store) => store.lastSolve)
  const setLastSolve = useTimerStore((store) => store.setLastSolve)
  const settings = useSettingsStore((store) => store.settings)

  if (!selectedCube) return null

  return (
    <>
      <ManualModeForm onSubmit={saveSolveManualMode} className="grow justify-center" />
      {lastSolve && (
        <div className="mt-2 text-center font-mono text-muted-foreground">Last one: {formatTime(lastSolve.time)}</div>
      )}
      {lastSolve && settings.features.quickActionButtons ? (
        <QuickActions solve={lastSolve} onDeleteSolve={() => setLastSolve(null)} />
      ) : null}
    </>
  )
}
