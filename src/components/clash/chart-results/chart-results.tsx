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

function computeWcaAo5Ms(solvesMs: (number | undefined)[], penalties: (Penalty | undefined)[]) {
  // Determine best single from all valid solves
  const validSingles: number[] = []
  for (let i = 0; i < solvesMs.length; i++) {
    if (penalties[i] === 'DNF') continue
    const ms = solvesMs[i]
    if (ms !== undefined) validSingles.push(ms)
  }
  const best = validSingles.length ? Math.min(...validSingles) : undefined

  // Build list of attempts (by index) that have a result (time or DNF)
  const attempts: { ms: number | undefined; isDNF: boolean }[] = []
  for (let i = 0; i < solvesMs.length; i++) {
    const isDNF = penalties[i] === 'DNF'
    const hasTime = solvesMs[i] !== undefined
    if (isDNF || hasTime) {
      attempts.push({ ms: solvesMs[i], isDNF })
    }
  }

  // Take last 5 attempts
  const last5 = attempts.slice(-5)
  if (last5.length < 5) {
    return { best, ao5Ms: undefined as number | undefined | null, rankingAverage: Number.POSITIVE_INFINITY, rankingBest: best ?? Number.POSITIVE_INFINITY }
  }

  const dnfCount = last5.filter(a => a.isDNF).length
  if (dnfCount >= 2) {
    // Ao5 is DNF
    return { best, ao5Ms: null, rankingAverage: Number.POSITIVE_INFINITY, rankingBest: best ?? Number.POSITIVE_INFINITY }
  }

  // Map DNFs to +Infinity for sorting (worst), keep numbers for times
  const values = last5.map(a => (a.isDNF ? Number.POSITIVE_INFINITY : (a.ms as number)))
  // Sort ascending
  values.sort((a, b) => a - b)
  // Drop best (index 0) and worst (last)
  const middle = values.slice(1, values.length - 1)

  // If any middle is Infinity, remaining DNF stayed -> Ao5 is DNF
  if (middle.some(v => !Number.isFinite(v))) {
    return { best, ao5Ms: null, rankingAverage: Number.POSITIVE_INFINITY, rankingBest: best ?? Number.POSITIVE_INFINITY }
  }

  const sum = middle.reduce((acc, v) => acc + v, 0)
  const ao5Ms = sum / middle.length
  return { best, ao5Ms, rankingAverage: ao5Ms, rankingBest: best ?? Number.POSITIVE_INFINITY }
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
        return e.finalMs
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

  // Compute derived and sort by WCA Ao5
  const enriched = React.useMemo(() => {
    const data = rows.map((r) => ({ row: r, stats: computeWcaAo5Ms(r.solvesMs, r.penalties) }))
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
                  <TooltipTrigger className="text-left">Average (Ao5)</TooltipTrigger>
                  <TooltipContent>WCA Ao5: drop best and worst of the last 5 attempts; 2+ DNFs = DNF</TooltipContent>
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
                <TableCell className="font-semibold">{stats.ao5Ms === null ? 'DNF' : (stats.ao5Ms !== undefined ? formatTime(stats.ao5Ms as number) : '--')}</TableCell>
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
