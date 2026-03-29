'use client'

import formatTime from '@/shared/lib/formatTime'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import useFreeMode from '@/features/free-play-room/model/useFreeMode'
import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { Trophy, TrendingDown, TrendingUp, Timer } from 'lucide-react'

export default function ResultsTab() {
  const t = useTranslations('Multiplayer.results-tab')
  const tMultiplayer = useTranslations('Multiplayer')
  const { roomId } = useParams<{ roomId: string }>() ?? { roomId: '' }
  const { data: session } = useSession()
  const { useUsersPresence, useRoomSolves } = useFreeMode()
  const onlineUsers = useUsersPresence(roomId?.toString() || '')
  const solves = useRoomSolves(roomId?.toString() || '')

  const solvesFromOnlineUsers = Object.entries(solves)
    .filter(([userId]) => onlineUsers.some((u) => u.id === userId))
    .map(([userId, userSolves]) => ({
      userId,
      solves: Object.values(userSolves).sort((a, b) => a.createdAt - b.createdAt),
      userImage: onlineUsers.find((u) => u.id === userId)?.image || null,
      userName: onlineUsers.find((u) => u.id === userId)?.name || tMultiplayer('anonymous')
    }))

  const currentUserSolves = session?.user?.id
    ? solves[session.user.id]
      ? Object.values(solves[session.user.id]).sort((a, b) => a.createdAt - b.createdAt)
      : []
    : []

  const toEffectiveTime = (s: { time: number; plus2: boolean; dnf: boolean }) =>
    s.dnf ? null : s.time + (s.plus2 ? 2000 : 0)

  const getLast = () => {
    if (!currentUserSolves.length) return '-'
    const last = currentUserSolves[currentUserSolves.length - 1]
    const time = toEffectiveTime(last)
    return time === null ? 'DNF' : `${formatTime(time)}${last.plus2 ? '+' : ''}`
  }

  const getBest = () => {
    const times = currentUserSolves.map(toEffectiveTime).filter((time): time is number => time !== null)
    if (!times.length) return '-'
    return formatTime(Math.min(...times))
  }

  const getWorst = () => {
    const times = currentUserSolves.map(toEffectiveTime).filter((time): time is number => time !== null)
    if (!times.length) return '-'
    return formatTime(Math.max(...times))
  }

  const getAverage = () => {
    const times = currentUserSolves.map(toEffectiveTime).filter((time): time is number => time !== null)
    if (!times.length) return '-'
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length)
    return formatTime(avg)
  }

  const stats = [
    { label: t('latest'), value: getLast(), icon: Timer },
    { label: t('best'), value: getBest(), icon: Trophy },
    { label: t('worst'), value: getWorst(), icon: TrendingDown },
    { label: t('average'), value: getAverage(), icon: TrendingUp }
  ]

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
        <div className="px-4 py-2.5 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {t('cubers')}
        </div>
        <ul className="divide-y divide-border">
          {solvesFromOnlineUsers.map((p, i) => {
            const pTimes = p.solves
              .map((s) => (s.dnf ? null : s.time + (s.plus2 ? 2000 : 0)))
              .filter((time): time is number => time !== null)
            const pBest = pTimes.length ? formatTime(Math.min(...pTimes)) : '-'
            const pAvg = pTimes.length ? formatTime(Math.round(pTimes.reduce((a, b) => a + b, 0) / pTimes.length)) : '-'

            return (
              <motion.li
                key={p.userId}
                className="px-4 py-3"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.05 * i }}
              >
                {/* Mobile: stacked layout */}
                <div className="flex flex-col gap-2 md:hidden">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.userImage || undefined}
                      alt={p.userName}
                      className="h-8 w-8 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{p.userName}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {t('best')} {pBest} · {t('average')} {pAvg}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pl-11 text-xs font-mono">
                    {p.solves.slice(-5).map((solve, index) => (
                      <span key={index} className={solve.dnf ? 'text-destructive' : 'text-muted-foreground'}>
                        {solve.dnf
                          ? 'DNF'
                          : `${formatTime(solve.time + (solve.plus2 ? 2000 : 0))}${solve.plus2 ? '+' : ''}`}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Desktop: row layout */}
                <div className="hidden md:flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.userImage || undefined}
                      alt={p.userName}
                      className="h-8 w-8 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{p.userName}</div>
                      <div className="text-xs text-muted-foreground">
                        {t('best')} {pBest} · {t('average')} {pAvg}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm font-mono shrink-0">
                    {p.solves.slice(-5).map((solve, index) => (
                      <span key={index} className={solve.dnf ? 'text-destructive' : ''}>
                        {solve.dnf
                          ? 'DNF'
                          : `${formatTime(solve.time + (solve.plus2 ? 2000 : 0))}${solve.plus2 ? '+' : ''}`}
                      </span>
                    ))}
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
