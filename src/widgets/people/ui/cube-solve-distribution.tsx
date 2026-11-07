import type { CubeStats } from '@/entities/user-stats/model/types'

export function CubeSolveDistribution({ counts }: { counts: CubeStats['counts'] }) {
  const { ok: successCount, plus2: plus2Count, dnf: dnfCount } = counts
  const totalSolves = successCount + plus2Count + dnfCount

  return (
    <span className="flex flex-col gap-1.5 w-full">
      <span className="h-2 w-full overflow-hidden bg-muted/50 flex">
        {totalSolves > 0 ? (
          <>
            {successCount > 0 && (
              <span className="h-full bg-success" style={{ width: `${(successCount / totalSolves) * 100}%` }} />
            )}
            {plus2Count > 0 && (
              <span className="h-full bg-warning" style={{ width: `${(plus2Count / totalSolves) * 100}%` }} />
            )}
            {dnfCount > 0 && (
              <span className="h-full bg-destructive" style={{ width: `${(dnfCount / totalSolves) * 100}%` }} />
            )}
          </>
        ) : null}
      </span>
      <span className="flex items-center gap-2">
        <span className="size-1.5 bg-success shrink-0" />
        <span className="text-[10px] tabular-nums text-muted-foreground">{successCount}</span>
        <span className="size-1.5 bg-warning shrink-0" />
        <span className="text-[10px] tabular-nums text-muted-foreground">{plus2Count}</span>
        <span className="size-1.5 bg-destructive shrink-0" />
        <span className="text-[10px] tabular-nums text-muted-foreground">{dnfCount}</span>
      </span>
    </span>
  )
}
