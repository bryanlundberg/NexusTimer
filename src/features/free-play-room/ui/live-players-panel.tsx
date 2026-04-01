'use client'

import formatTime from '@/shared/lib/formatTime'
import { TimerStatus } from '@/features/timer/model/enums'
import { motion } from 'motion/react'

interface LivePlayersPanelProps {
  onlineUsers: any[]
  solves: Record<string, Record<string, any>>
  currentRound: number
  sessionUserId?: string
}

function PlayerCard({ user, solve, isSelf, index }: { user: any; solve: any; isSelf: boolean; index: number }) {
  let timeText: string
  let colorClass: string
  let isSolving = false

  if (solve) {
    if (solve.dnf) {
      timeText = 'DNF'
      colorClass = 'text-destructive'
    } else {
      const ms = solve.time + (solve.plus2 ? 2000 : 0)
      timeText = formatTime(ms) + (solve.plus2 ? '+' : '')
      colorClass = 'text-emerald-500'
    }
  } else if (user.status === TimerStatus.SOLVING || user.status === TimerStatus.INSPECTING) {
    timeText = '...'
    colorClass = 'text-amber-400'
    isSolving = true
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
      <div className="relative shrink-0">
        {user.image ? (
          <img src={user.image} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
            {(user.name ?? '?')[0].toUpperCase()}
          </div>
        )}
        {isSolving && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
          </span>
        )}
      </div>
      <div className="min-w-0 flex flex-col flex-1">
        <span className="text-xs font-medium truncate leading-tight">{user.name ?? '?'}</span>
        <span className={`text-xs font-mono font-semibold leading-tight ${colorClass}`}>{timeText}</span>
      </div>
    </motion.div>
  )
}

export default function LivePlayersPanel({ onlineUsers, solves, currentRound, sessionUserId }: LivePlayersPanelProps) {
  if (!onlineUsers.length) return null

  return (
    <div className="flex flex-col gap-2">
      {onlineUsers.map((user, i) => {
        const userSolves = solves[user.id] ?? {}
        const roundSolve = (Object.values(userSolves) as any[]).find((s) => s.roundIndex === currentRound) ?? null
        return <PlayerCard key={user.id} user={user} solve={roundSolve} isSelf={user.id === sessionUserId} index={i} />
      })}
    </div>
  )
}
