import formatTime from '@/shared/lib/formatTime'
import { buildCfopBarSegments, buildCfopPhases } from '@/shared/lib/timer/solveAnalysis'
import { tryAnalyzeSolution } from '@/shared/lib/tryAnalyzeSolution'

interface SolveBreakdownProps {
  analysis: ReturnType<typeof tryAnalyzeSolution>
  totalMs: number
}

export function SolveBreakdown({ analysis, totalMs }: SolveBreakdownProps) {
  const phases = buildCfopPhases(analysis)
  if (!phases) return null

  const barSegments = buildCfopBarSegments(phases, totalMs)

  return (
    <div className="flex flex-col gap-3">
      {/* Segmented bar */}
      <div className="flex h-3 w-full overflow-hidden rounded-full">
        {barSegments.map((seg) => (
          <div key={seg.key} className={seg.bgClass} style={{ width: `${seg.pct}%` }} />
        ))}
      </div>

      {/* Phase rows */}
      <div className="flex flex-col gap-1">
        {phases.map((phase) => {
          const pct = totalMs > 0 ? Math.round((phase.duration / totalMs) * 100) : 0
          return (
            <div key={phase.key}>
              {/* Main phase row */}
              <div className="flex items-center gap-2">
                <span className={`w-12 text-[11px] font-semibold ${phase.textClass}`}>{phase.label}</span>
                <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full ${phase.bgClass}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="w-14 text-right font-mono text-[11px] text-muted-foreground tabular-nums">
                  {formatTime(phase.duration, 2)}
                </span>
                <span className="w-8 text-right text-[11px] text-muted-foreground tabular-nums">{pct}%</span>
              </div>

              {/* F2L sub-slots */}
              {phase.slots?.map((slot) => {
                const slotPct = totalMs > 0 ? Math.round((slot.duration / totalMs) * 100) : 0
                return (
                  <div key={slot.key} className="flex items-center gap-2 pl-3 mt-0.5">
                    <span className="w-9 text-[10px] text-muted-foreground">{slot.label}</span>
                    <div className="flex-1 h-px rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${slot.bgClass} opacity-60`}
                        style={{ width: `${slotPct}%` }}
                      />
                    </div>
                    <span className="w-14 text-right font-mono text-[10px] text-muted-foreground/70 tabular-nums">
                      {formatTime(slot.duration, 2)}
                    </span>
                    <span className="w-8 text-right text-[10px] text-muted-foreground/70 tabular-nums">{slotPct}%</span>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
