'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import * as React from 'react'
import { useSession } from 'next-auth/react'
import formatTime from '@/lib/formatTime'
import { Room, Penalty } from '@/interfaces/Room'
import { useMemo } from 'react';

type PlayerRow = {
  id: string
  name: string
  avatarUrl?: string
  solvesMs: (number | undefined)[]
  penalties: (Penalty | undefined)[]
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

function computeStatsClassicMs(solvesMs: (number | undefined)[], penalties: (Penalty | undefined)[]) {
  const finishedTimes = solvesMs
    .map((ms, i) => (penalties[i] === 'DNF' ? undefined : ms))
    .filter((v): v is number => v !== undefined)
  const best = finishedTimes.length ? Math.min(...finishedTimes) : undefined

  let sum = 0
  let count = 0
  for (let i = 0; i < solvesMs.length; i++) {
    const hasDnf = penalties[i] === 'DNF'
    const ms = solvesMs[i]
    if (hasDnf) {
      count += 1
    } else if (ms !== undefined) {
      sum += ms
      count += 1
    }
  }
  const averageClassic = count > 0 ? sum / count : undefined

  const rankingAverage = averageClassic ?? Number.POSITIVE_INFINITY
  const rankingBest = best ?? Number.POSITIVE_INFINITY

  return { best, averageClassic, rankingAverage, rankingBest }
}

export default function ChartResults({ room }: { room?: Room }) {
  const { data: session } = useSession()
  const myUserId = session?.user?.id

  const totalRounds = room?.totalRounds || 0
  const rounds = useMemo(() => room?.rounds || [], [room?.rounds])
  const presence = useMemo(() => room?.presence || {}, [room?.presence])

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

      const solvesMs: (number | undefined)[] = Array.from({ length: totalRounds }, (_, i) => {
        const r = rounds?.[i]
        const e = r?.entries?.[uid] as any

        if (!e) return undefined
        if (e?.dns) return undefined
        if (e.penalty === 'DNF') return undefined
        if (e.finalMs === undefined) return undefined
        const plusTwo = e.penalty === '+2' ? 2000 : 0
        return e.finalMs + plusTwo
      })
      const penalties: (Penalty | undefined)[] = Array.from({ length: totalRounds }, (_, i) => {
        const r = rounds?.[i]
        const e = r?.entries?.[uid] as any
        if (!e) return undefined
        return e.penalty as Penalty | undefined
      })
      return { id: uid, name, avatarUrl, solvesMs, penalties }
    })
  }, [playerIds, presence, rounds, totalRounds])

  // Compute derived and sort by classic average
  const enriched = React.useMemo(() => {
    const data = rows.map((r) => ({ row: r, stats: computeStatsClassicMs(r.solvesMs, r.penalties) }))
    data.sort((a, b) => {
      const avgDiff = a.stats.rankingAverage - b.stats.rankingAverage
      if (avgDiff !== 0) return avgDiff
      return a.stats.rankingBest - b.stats.rankingBest
    })
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
              <TableHead>Cuber</TableHead>
              <TableHead>
                <Tooltip>
                  <TooltipTrigger className="text-left">Single</TooltipTrigger>
                  <TooltipContent>Best single solve</TooltipContent>
                </Tooltip>
              </TableHead>
              <TableHead>
                <Tooltip>
                  <TooltipTrigger className="text-left">Average</TooltipTrigger>
                  <TooltipContent>Classic average (DNF counts in divisor as 0)</TooltipContent>
                </Tooltip>
              </TableHead>
              {Array.from({ length: totalRounds }, (_, i) => (
                <TableHead key={`h-${i + 1}`} className="w-12 text-center">{i + 1}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {enriched.map(({ row, stats }, idx) => (
              <TableRow key={row.id} data-rank={idx + 1} data-user={row.id === myUserId ? 'me' : undefined} className={row.id === myUserId ? 'bg-primary/10' : undefined}>
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {row.avatarUrl ? (
                        <AvatarImage src={row.avatarUrl} alt={row.name} className={"object-cover"}/>
                      ) : (
                        <AvatarFallback>{initials(row.name)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col leading-tight">
                      <span className="font-medium">{row.name}</span>
                      <span className="text-muted-foreground text-xs">{row.solvesMs.filter((v, i) => v !== undefined || row.penalties[i] === 'DNF').length}/{totalRounds} solves</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{stats.best !== undefined ? formatTime(stats.best) : '--'}</TableCell>
                <TableCell className="font-semibold">{stats.averageClassic !== undefined ? formatTime(stats.averageClassic) : '--'}</TableCell>
                {Array.from({ length: totalRounds }, (_, i) => (
                  <TableCell key={`s-${row.id}-${i}`} className="text-center">
                    {row.penalties[i] === 'DNF' ? 'DNF' : (row.solvesMs[i] !== undefined ? formatTime(row.solvesMs[i] as number) : '')}
                    {row.penalties[i] === '+2' ? ' +2' : ''}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </div>
  )
}
