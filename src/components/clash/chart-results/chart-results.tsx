'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import * as React from 'react'
import { useClashManager } from '@/store/ClashManager'
import { Room } from '@/interfaces/Room'

// Utilities
function formatSeconds(sec?: number): string {
  if (sec === undefined || Number.isNaN(sec)) return 'DNF'
  if (!Number.isFinite(sec)) return 'DNF'
  const negative = sec < 0
  const s = Math.abs(sec)
  const minutes = Math.floor(s / 60)
  const seconds = s % 60
  const secondsStr = seconds < 10 && minutes > 0 ? `0${seconds.toFixed(2)}` : seconds.toFixed(2)
  const out = minutes > 0 ? `${minutes}:${secondsStr}` : seconds.toFixed(2)
  return `${negative ? '-' : ''}${out}s`
}

function averageExcludingExtremes(values: number[]): number | undefined {
  const arr = values.filter((v) => Number.isFinite(v))
  if (arr.length < 3) return undefined
  const sorted = [...arr].sort((a, b) => a - b)
  const trimmed = sorted.slice(1, sorted.length - 1)
  const sum = trimmed.reduce((acc, v) => acc + v, 0)
  return sum / trimmed.length
}

function bestRollingAo5(solves: number[]): number | undefined {
  const arr = solves.filter((v) => Number.isFinite(v))
  if (arr.length < 5) return undefined
  let best: number | undefined = undefined
  for (let i = 0; i <= solves.length - 5; i++) {
    const window = solves.slice(i, i + 5).filter((v) => Number.isFinite(v))
    if (window.length < 5) continue
    const avg = averageExcludingExtremes(window as number[])
    if (avg === undefined) continue
    if (best === undefined || avg < best) best = avg
  }
  return best
}

function ao12(solves: number[]): number | undefined {
  const arr = solves.filter((v) => Number.isFinite(v))
  if (arr.length !== 12) return undefined
  return averageExcludingExtremes(arr)
}

type PlayerRow = {
  id: string
  name: string
  avatarUrl?: string
  solvesSeconds: (number | undefined)[] // seconds per round (DNF = Infinity, missing = undefined)
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

function computeStatsSeconds(solvesSeconds: (number | undefined)[]) {
  const finite = solvesSeconds.filter((v): v is number => v !== undefined && Number.isFinite(v))
  const best = finite.length ? Math.min(...finite) : undefined
  const worst = finite.length ? Math.max(...finite) : undefined
  const bestAo5 = bestRollingAo5(solvesSeconds as number[])
  const avg12 = solvesSeconds.length === 12 ? ao12(solvesSeconds as number[]) : undefined

  // Ranking key: by best available average of 5 first; if not available, by ao12; else Infinity (bottom)
  const rankingAverage = (bestAo5 ?? avg12 ?? Number.POSITIVE_INFINITY)

  return { best, worst, bestAo5, avg12, rankingAverage }
}

function msToSeconds(ms?: number): number | undefined {
  if (ms === undefined) return undefined
  if (!Number.isFinite(ms)) return Number.POSITIVE_INFINITY
  return ms / 1000
}

export default function ChartResults({ room }: { room: Room }) {
  const totalRounds = room?.totalRounds || 0
  const rounds = room?.rounds || []
  const presence = room?.presence || {}

  // Build participant ids from union of all round entries (immutable evidence), not from presence
  const playerIds = React.useMemo(() => {
    const ids = new Set<string>()
    for (const r of rounds) {
      if (!r?.entries) continue
      Object.keys(r.entries).forEach((uid) => ids.add(uid))
    }
    return Array.from(ids)
  }, [rounds])

  const rows: PlayerRow[] = React.useMemo(() => {
    return playerIds.map((uid) => {
      // Find the first entry carrying identity metadata; fallback to presence
      let entryWithId:
        | { name?: string; image?: string }
        | undefined
      for (const r of rounds) {
        const e = r?.entries?.[uid] as any
        if (e && (e.name || e.image)) {
          entryWithId = e
          break
        }
      }
      const name = (entryWithId?.name || presence[uid]?.name || 'Unknown') as string
      const avatarUrl = (entryWithId?.image || presence[uid]?.image || undefined) as string | undefined

      const solvesSeconds: (number | undefined)[] = Array.from({ length: totalRounds }, (_, i) => {
        const r = rounds?.[i]
        const e = r?.entries?.[uid] as any
        // If DNS, mark as Infinity (DNF); if participated and finalMs exists, convert to seconds; else undefined
        if (!e) return undefined
        if (e.dns) return Number.POSITIVE_INFINITY
        if (e.finalMs === undefined) return undefined
        return msToSeconds(e.finalMs)
      })
      return { id: uid, name, avatarUrl, solvesSeconds }
    })
  }, [playerIds, presence, rounds, totalRounds])

  // Compute derived and sort by best average
  const enriched = React.useMemo(() => {
    const data = rows.map((r) => ({ row: r, stats: computeStatsSeconds(r.solvesSeconds) }))
    data.sort((a, b) => a.stats.rankingAverage - b.stats.rankingAverage)
    return data
  }, [rows])

  if (!room) {
    return null
  }

  return (
    <div className="w-full h-full overflow-auto">
      <CardContent>
        <Table className={'overflow-hidden'}>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Cuber (name)</TableHead>
              <TableHead>
                <Tooltip>
                  <TooltipTrigger className="text-left">Single</TooltipTrigger>
                  <TooltipContent>Best single solve</TooltipContent>
                </Tooltip>
              </TableHead>
              <TableHead>
                <Tooltip>
                  <TooltipTrigger className="text-left">Average</TooltipTrigger>
                  <TooltipContent>{totalRounds === 12 ? 'Ao12' : 'Best rolling Ao5 (if available)'}</TooltipContent>
                </Tooltip>
              </TableHead>
              {Array.from({ length: totalRounds }, (_, i) => (
                <TableHead key={`h-${i + 1}`} className="w-12 text-center">{i + 1}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {enriched.map(({ row, stats }, idx) => (
              <TableRow key={row.id} data-rank={idx + 1}>
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {row.avatarUrl ? (
                        <AvatarImage src={row.avatarUrl} alt={row.name}/>
                      ) : (
                        <AvatarFallback>{initials(row.name)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col leading-tight">
                      <span className="font-medium">{row.name}</span>
                      <span className="text-muted-foreground text-xs">{row.solvesSeconds.filter((v) => v !== undefined).length}/{totalRounds} solves</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatSeconds(stats.best)}</TableCell>
                <TableCell className="font-semibold">{formatSeconds((totalRounds === 12 ? stats.avg12 : stats.bestAo5))}</TableCell>
                {Array.from({ length: totalRounds }, (_, i) => (
                  <TableCell key={`s-${row.id}-${i}`} className="text-center">
                    {formatSeconds(row.solvesSeconds[i])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          <TableCaption>Winner is determined by the best average.</TableCaption>
        </Table>
      </CardContent>
    </div>
  )
}
