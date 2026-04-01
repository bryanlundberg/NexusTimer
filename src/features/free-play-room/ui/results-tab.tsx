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
  const { data: session } = useSession()
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

    const participatedSolves = allSolves.filter((s) => !s.dnf)
    const times = participatedSolves.map((s) => s.time + (s.plus2 ? 2000 : 0))
    const best = times.length ? Math.min(...times) : null
    const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null

    return { userId, userName, userImage, solveByRound, best, avg }
  })

  // Current user stats
  const currentUserData = usersData.find((u) => u.userId === session?.user?.id)
  const currentUserSolvesRaw =
    session?.user?.id && solves[session.user.id] ? (Object.values(solves[session.user.id]) as any[]) : []

  const toEffectiveTime = (s: { time: number; plus2: boolean; dnf: boolean }) =>
    s.dnf ? null : s.time + (s.plus2 ? 2000 : 0)

  const getLast = () => {
    if (!currentUserSolvesRaw.length) return '-'
    const sorted = [...currentUserSolvesRaw].sort((a, b) => a.createdAt - b.createdAt)
    const last = sorted[sorted.length - 1]
    const time = toEffectiveTime(last)
    return time === null ? 'DNF' : `${formatTime(time)}${last.plus2 ? '+' : ''}`
  }

  const stats = [
    {
      label: t('latest'),
      value: getLast(),
      icon: Timer
    },
    {
      label: t('best'),
      value: currentUserData?.best != null ? formatTime(currentUserData.best) : '-',
      icon: Trophy
    },
    {
      label: t('worst'),
      value: (() => {
        const times = currentUserSolvesRaw.map(toEffectiveTime).filter((v): v is number => v !== null)
        return times.length ? formatTime(Math.max(...times)) : '-'
      })(),
      icon: TrendingDown
    },
    {
      label: t('average'),
      value: currentUserData?.avg != null ? formatTime(currentUserData.avg) : '-',
      icon: TrendingUp
    }
  ]

  const formatSolve = (s: any): { text: string; missed: boolean; dnf: boolean } => {
    if (!s) return { text: '-', missed: true, dnf: false }
    if (s.dnf) return { text: 'DNF', missed: false, dnf: true }
    const time = formatTime(s.time + (s.plus2 ? 2000 : 0))
    return { text: s.plus2 ? `${time}+` : time, missed: false, dnf: false }
  }

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              className="rounded-xl border border-border bg-muted/30 p-3.5 md:p-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <Icon className="size-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <div className="text-xl md:text-2xl font-semibold font-mono">{stat.value}</div>
            </motion.div>
          )
        })}
      </div>

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
