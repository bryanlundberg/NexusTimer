'use client'

import formatTime from '@/shared/lib/formatTime'
import { motion } from 'motion/react'
import { Trophy } from 'lucide-react'

interface LivePlayersPanelProps {
  onlineUsers: any[]
  solves: Record<string, Record<string, any>>
  currentRound: number
  sessionUserId?: string
}

function computeWins(solves: Record<string, Record<string, any>>, totalRounds: number): Record<string, number> {
  const wins: Record<string, number> = {}
  for (let r = 0; r < totalRounds; r++) {
    let bestTime = Infinity
    let winnerId: string | null = null
    for (const [userId, userSolves] of Object.entries(solves)) {
      const solve = (Object.values(userSolves) as any[]).find((s) => s.roundIndex === r)
      if (!solve || solve.dnf) continue
      const ms = solve.time + (solve.plus2 ? 2000 : 0)
      if (ms < bestTime) {
        bestTime = ms
        winnerId = userId
      }
    }
    if (winnerId) wins[winnerId] = (wins[winnerId] ?? 0) + 1
  }
  return wins
}

function PlayerCard({
  user,
  solve,
  wins,
  isSelf,
  index
}: {
  user: any
  solve: any
  wins: number
  isSelf: boolean
  index: number
}) {
  let timeText: string
  let colorClass: string

  if (solve) {
    if (solve.dnf) {
      timeText = 'DNF'
      colorClass = 'text-destructive'
    } else {
      const ms = solve.time + (solve.plus2 ? 2000 : 0)
      timeText = formatTime(ms) + (solve.plus2 ? '+' : '')
      colorClass = 'text-emerald-500'
    }
  } else {
    timeText = '-'
    colorClass = 'text-muted-foreground/50'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border bg-card w-full ${
        isSelf ? 'border-primary/30 bg-primary/5' : 'border-border'
      }`}
    >
      <div className="shrink-0">
        {user.image ? (
          <img src={user.image} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
            {(user.name ?? '?')[0].toUpperCase()}
          </div>
        )}
      </div>
      <div className="min-w-0 flex flex-col flex-1">
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium truncate leading-tight">{user.name ?? '?'}</span>
          {wins > 0 && (
            <span className="flex items-center gap-0.5 text-amber-400 shrink-0">
              <Trophy className="size-2.5" />
              <span className="text-[10px] font-bold leading-none">{wins}</span>
            </span>
          )}
        </div>
        <span className={`text-xs font-mono font-semibold leading-tight ${colorClass}`}>{timeText}</span>
      </div>
    </motion.div>
  )
}

export default function LivePlayersPanel({ onlineUsers, solves, currentRound, sessionUserId }: LivePlayersPanelProps) {
  if (!onlineUsers.length) return null

  const previousRound = currentRound - 1
  const wins = computeWins(solves, currentRound)

  return (
    <div className="flex flex-col gap-2">
      {onlineUsers.map((user, i) => {
        const userSolves = solves[user.id] ?? {}
        const prevSolve =
          previousRound >= 0
            ? ((Object.values(userSolves) as any[]).find((s) => s.roundIndex === previousRound) ?? null)
            : null
        return (
          <PlayerCard
            key={user.id}
            user={user}
            solve={prevSolve}
            wins={wins[user.id] ?? 0}
            isSelf={user.id === sessionUserId}
            index={i}
          />
        )
      })}
    </div>
  )
}
