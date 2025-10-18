'use client'

import formatTime from '@/lib/formatTime'

export default function ResultsTab() {
  const players = [
    {
      id: '3',
      name: 'Charlie',
      image:
        'https://cdn.jsdelivr.net/gh/itspi3141/discord-fake-avatar-decorations@main/public/avatars/trick_or_treat.png',
      status: 'online',
      solves: [{ time: 15000, at: '2024-10-01T12:00:00Z' }]
    }
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Latest" value={formatTime(12432)} />
        <StatCard label="Best" value={formatTime(8571)} />
        <StatCard label="Worst" value={formatTime(15487)} />
        <StatCard label="Ao5" value={formatTime(10548)} />
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        Updating live
      </div>

      {/* Players list cards */}
      <div className="rounded-lg border">
        <div className="px-4 py-2 border-b text-sm font-medium text-muted-foreground">Cubers</div>
        <ul className="divide-y">
          {players.map((p) => {
            return (
              <li key={p.id} className="px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 mr-auto">
                  <img src={p.image} alt={p.name} className="h-8 w-8 rounded-full object-cover" />
                  <div className="truncate">
                    <div className="font-medium truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      Best {formatTime(23573)} | Average: {formatTime(43223)}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-right min-w-0 ml-auto">
                  <div className="font-medium grid grid-cols-5 gap-5">
                    <span>{formatTime(12432)}</span>
                    <span>{formatTime(15000)}</span>
                    <span>{formatTime(16789)}</span>
                    <span>{formatTime(14234)}</span>
                    <span>{formatTime(13045)}</span>
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
