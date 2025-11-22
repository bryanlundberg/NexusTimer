'use client'

import formatTime from '@/shared/lib/formatTime'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import useFreeMode from '@/features/free-play-room/model/useFreeMode'

export default function ResultsTab() {
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
      userName: onlineUsers.find((u) => u.id === userId)?.name || 'Anonymous'
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
    const t = toEffectiveTime(last)
    return t === null ? 'DNF' : formatTime(t)
  }

  const getBest = () => {
    const times = currentUserSolves.map(toEffectiveTime).filter((t): t is number => t !== null)
    if (!times.length) return '-'
    return formatTime(Math.min(...times))
  }

  const getWorst = () => {
    const times = currentUserSolves.map(toEffectiveTime).filter((t): t is number => t !== null)
    if (!times.length) return '-'
    return formatTime(Math.max(...times))
  }

  const getAverage = () => {
    const times = currentUserSolves.map(toEffectiveTime).filter((t): t is number => t !== null)
    if (!times.length) return '-'
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length)
    return formatTime(avg)
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Latest" value={getLast()} />
        <StatCard label="Best" value={getBest()} />
        <StatCard label="Worst" value={getWorst()} />
        <StatCard label="Average" value={getAverage()} />
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        Updating live
      </div>

      <div className="rounded-lg border">
        <div className="px-4 py-2 border-b text-sm font-medium text-muted-foreground">Cubers</div>
        <ul className="divide-y">
          {solvesFromOnlineUsers.map((p) => {
            const pTimes = p.solves
              .map((s) => (s.dnf ? null : s.time + (s.plus2 ? 2000 : 0)))
              .filter((t): t is number => t !== null)
            const pBest = pTimes.length ? formatTime(Math.min(...pTimes)) : '-'
            const pAvg = pTimes.length ? formatTime(Math.round(pTimes.reduce((a, b) => a + b, 0) / pTimes.length)) : '-'

            return (
              <li key={p.userId} className="px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 mr-auto">
                  <img src={p.userImage || undefined} alt={p.userName} className="h-8 w-8 rounded-full object-cover" />
                  <div className="truncate">
                    <div className="font-medium truncate">{p.userName}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      Best {pBest} | Average: {pAvg}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-right min-w-0 ml-auto">
                  <div className="font-medium grid grid-cols-5 gap-5">
                    {p.solves.slice(-5).map((solve, index) => {
                      return (
                        <div key={index} className={solve.dnf ? 'text-red-500' : ''}>
                          {solve.dnf ? 'DNF' : formatTime(solve.time + (solve.plus2 ? 2000 : 0))}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {sub ? <div className="text-xs text-muted-foreground mt-1">{sub}</div> : null}
    </div>
  )
}
