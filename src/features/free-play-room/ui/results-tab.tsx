'use client'

import formatTime from '@/shared/lib/formatTime'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import useFreeMode from '@/features/free-play-room/model/useFreeMode'
import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { Trophy, TrendingDown, TrendingUp, Timer } from 'lucide-react'

const ROUNDS_TO_SHOW = 5

export default function ResultsTab() {
  const t = useTranslations('Multiplayer.results-tab')
  const tMultiplayer = useTranslations('Multiplayer')
  const { roomId } = useParams<{ roomId: string }>() ?? { roomId: '' }
  const { useUsersPresence, useRoomSolves, useRoomCurrentRound } = useFreeMode()
  const onlineUsers = useUsersPresence(roomId?.toString() || '')
  const solves = useRoomSolves(roomId?.toString() || '')
  const currentRound = useRoomCurrentRound(roomId?.toString() || '')

  // Compute the highest round index seen across all solves (for rooms created before round tracking)
  const maxRoundInSolves = Object.values(solves).reduce((max, userSolves) => {
    return Object.values(userSolves).reduce((m, s: any) => Math.max(m, s.roundIndex ?? 1), max)
  }, 1)
  const totalRounds = Math.max(currentRound, maxRoundInSolves)

  // Rounds to display: last ROUNDS_TO_SHOW
  const startRound = Math.max(1, totalRounds - ROUNDS_TO_SHOW + 1)
  const visibleRounds = Array.from({ length: totalRounds - startRound + 1 }, (_, i) => startRound + i)

  // Build per-user data with solve indexed by roundIndex
  const usersData = Object.entries(solves).map(([userId, userSolves]) => {
    const allSolves = Object.values(userSolves) as any[]

    // Build a map roundIndex → solve
    const solveByRound: Record<number, (typeof allSolves)[0] | null> = {}
    allSolves.forEach((s) => {
      solveByRound[s.roundIndex] = s
    })

    const onlineUser = onlineUsers.find((u) => u.id === userId)
    const solveWithName = allSolves.find((s) => s.userName)
    const userName = onlineUser?.name ?? solveWithName?.userName ?? tMultiplayer('anonymous')
    const userImage = onlineUser?.image ?? solveWithName?.userImage ?? null

    const validSolves = allSolves.filter((s) => !s.dnf)
    const allTimes = validSolves.map((s) => s.time + (s.plus2 ? 2000 : 0))
    const best = allTimes.length ? Math.min(...allTimes) : null

    // Average of last 5 rounds (relative to totalRounds), missed/DNF rounds count toward denominator
    const lastFiveCount = Math.min(5, totalRounds)
    const lastFiveRounds = Array.from({ length: lastFiveCount }, (_, i) => totalRounds - lastFiveCount + 1 + i)
    const lastFiveTimes = lastFiveRounds.map((r) => {
      const s = solveByRound[r]
      if (!s || s.dnf) return null
      return s.time + (s.plus2 ? 2000 : 0)
    })
    const validLastFive = lastFiveTimes.filter((t): t is number => t !== null)
    const avg = validLastFive.length > 0 ? Math.round(validLastFive.reduce((a, b) => a + b, 0) / lastFiveCount) : null

    return { userId, userName, userImage, solveByRound, best, avg }
  })

  const formatSolve = (s: any): { text: string; missed: boolean; dnf: boolean } => {
    if (!s) return { text: '-', missed: true, dnf: false }
    if (s.dnf) return { text: 'DNF', missed: false, dnf: true }
    const time = formatTime(s.time + (s.plus2 ? 2000 : 0))
    return { text: s.plus2 ? `${time}+` : time, missed: false, dnf: false }
  }

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      {/* Live indicator */}
      <motion.div
        className="flex items-center gap-2 text-xs text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        {t('updating-live')}
      </motion.div>

      {/* Leaderboard */}
      <div className="rounded-xl border border-border overflow-hidden">
        {/* Header row with round labels */}
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between gap-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('cubers')}</span>
          <div className="flex gap-4 shrink-0">
            {visibleRounds.map((r) => (
              <span key={r} className="text-xs font-medium text-muted-foreground w-14 text-right">
                R{r}
              </span>
            ))}
          </div>
        </div>

        <ul className="divide-y divide-border">
          {usersData.map((p, i) => {
            return (
              <motion.li
                key={p.userId}
                className="px-4 py-3"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.05 * i }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.userImage || undefined}
                      alt={p.userName}
                      className="h-8 w-8 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{p.userName}</div>
                      <div className="text-xs text-muted-foreground">
                        {t('best')} {p.best != null ? formatTime(p.best) : '-'} · {t('average')}{' '}
                        {p.avg != null ? formatTime(p.avg) : '-'}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm font-mono shrink-0">
                    {visibleRounds.map((r) => {
                      const { text, missed, dnf } = formatSolve(p.solveByRound[r])
                      return (
                        <span
                          key={r}
                          className={`w-14 text-right ${missed ? 'text-muted-foreground/40' : dnf ? 'text-destructive' : ''}`}
                        >
                          {text}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
