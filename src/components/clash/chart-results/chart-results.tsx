'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import * as React from 'react'

// Utilities
function formatTime(sec?: number): string {
  if (sec === undefined || Number.isNaN(sec)) return '—'
  const negative = sec < 0
  const s = Math.abs(sec)
  const minutes = Math.floor(s / 60)
  const seconds = s % 60
  const secondsStr = seconds < 10 && minutes > 0 ? `0${seconds.toFixed(2)}` : seconds.toFixed(2)
  const out = minutes > 0 ? `${minutes}:${secondsStr}` : seconds.toFixed(2)
  return `${negative ? '-' : ''}${out}s`
}

function averageExcludingExtremes(values: number[]): number | undefined {
  if (values.length < 3) return undefined
  const sorted = [...values].sort((a, b) => a - b)
  const trimmed = sorted.slice(1, sorted.length - 1)
  const sum = trimmed.reduce((acc, v) => acc + v, 0)
  return sum / trimmed.length
}

function bestRollingAo5(solves: number[]): number | undefined {
  if (solves.length < 5) return undefined
  let best: number | undefined = undefined
  for (let i = 0; i <= solves.length - 5; i++) {
    const window = solves.slice(i, i + 5)
    const avg = averageExcludingExtremes(window)
    if (avg === undefined) continue
    if (best === undefined || avg < best) best = avg
  }
  return best
}

function ao12(solves: number[]): number | undefined {
  if (solves.length !== 12) return undefined
  return averageExcludingExtremes(solves)
}

type Player = {
  id: string
  name: string
  avatarUrl?: string
  solves: number[] // seconds
}

// Mock 8 players. Room configured to 12 solves, one player abandoned at 7.
const ROOM_SOLVES = 12 as const

const playersMock: Player[] = [
  {
    id: 'p1',
    name: 'Alex Rivera',
    solves: [12.31, 12.05, 11.88, 12.50, 11.97, 12.10, 12.22, 11.95, 12.44, 12.08, 12.00, 11.92]
  },
  {
    id: 'p2',
    name: 'Bella Chen',
    solves: [13.40, 12.95, 12.85, 13.12, 13.01, 12.77, 12.66, 12.90, 12.75, 12.80, 12.88, 12.70]
  },
  {
    id: 'p3',
    name: 'Carlos Mendez',
    solves: [14.10, 13.98, 14.25, 13.70, 13.65, 13.80, 13.75, 13.68, 13.72, 13.60, 13.82, 13.77]
  },
  {
    id: 'p4',
    name: 'Diana Smith',
    solves: [11.50, 11.42, 11.39, 11.55, 11.60, 11.48, 11.53, 11.46, 11.51, 11.44, 11.58, 11.47]
  },
  {
    id: 'p5',
    name: 'Ethan Clark',
    solves: [15.20, 15.05, 15.10, 15.30, 15.12, 15.00, 15.18, 15.25, 15.07, 15.16, 15.22, 15.09]
  },
  {
    id: 'p6',
    name: 'Fatima Ali',
    solves: [12.80, 12.65, 12.70, 12.60, 12.55, 12.75, 12.68, 12.72, 12.66, 12.58, 12.63, 12.61]
  },
  {
    id: 'p7',
    name: 'George Brown',
    solves: [13.05, 12.98, 13.02, 13.10, 12.96, 13.12, 13.00, 12.94, 13.08, 12.99, 13.06, 13.01]
  },
  { id: 'p8', name: 'Hannah Lee', solves: [12.90, 12.75, 12.82, 12.88, 12.70, 12.95, 12.85] }, // abandoned at 7
]

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

function computeStats(p: Player) {
  const best = p.solves.length ? Math.min(...p.solves) : undefined
  const worst = p.solves.length ? Math.max(...p.solves) : undefined
  const bestAo5 = bestRollingAo5(p.solves)
  const avg12 = p.solves.length === 12 ? ao12(p.solves) : undefined

  // Ranking key: by best available average of 5 first; if not available, by ao12; else Infinity (bottom)
  const rankingAverage = bestAo5 ?? avg12 ?? Number.POSITIVE_INFINITY

  return { best, worst, bestAo5, avg12, rankingAverage }
}

export default function ChartResults() {
  // Compute derived and sort by best average
  const enriched = playersMock.map((p) => ({ p, stats: computeStats(p) }))
  enriched.sort((a, b) => a.stats.rankingAverage - b.stats.rankingAverage)


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
                  <TooltipContent>Ao12 if 12 solves, otherwise best rolling Ao5</TooltipContent>
                </Tooltip>
              </TableHead>
              {Array.from({ length: ROOM_SOLVES }, (_, i) => (
                <TableHead key={`h-${i + 1}`} className="w-12 text-center">{i + 1}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {enriched.map(({ p, stats }, idx) => (
              <TableRow key={p.id} data-rank={idx + 1}>
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {p.avatarUrl ? (
                        <AvatarImage src={p.avatarUrl} alt={p.name}/>
                      ) : (
                        <AvatarFallback>{initials(p.name)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col leading-tight">
                      <span className="font-medium">{p.name}</span>
                      <span className="text-muted-foreground text-xs">{p.solves.length}/{ROOM_SOLVES} solves</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatTime(stats.best)}</TableCell>
                <TableCell className="font-semibold">{formatTime(stats.avg12 ?? stats.bestAo5)}</TableCell>
                {Array.from({ length: ROOM_SOLVES }, (_, i) => (
                  <TableCell key={`s-${p.id}-${i}`} className="text-center">
                    {formatTime(p.solves[i])}
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
