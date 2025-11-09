import React from 'react'
import { Card } from '@/components/ui/card'
import { GaugeIcon, PercentIcon, TimerIcon, TrophyIcon } from 'lucide-react'
import formatTime from '@/shared/lib/formatTime'
import { DeepStatistics } from '@/shared/types/statistics'

interface StatsSummaryProps {
  statistics: DeepStatistics
}

export default function StatisticsSummary({ statistics }: StatsSummaryProps) {
  const bestStr = statistics.best.cubeAll > 0 ? formatTime(statistics.best.cubeAll) : '--'
  const overallAvgStr = statistics.average.cubeAll === 0 ? '--' : formatTime(statistics.average.cubeAll)
  const ao5CurrentStr = statistics.stats.cubeSession.ao5 === 0 ? '--' : formatTime(statistics.stats.cubeSession.ao5)
  const successRateStr = statistics.successRate.cubeAll === '' ? '--' : statistics.successRate.cubeAll + '%'

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatItem icon={<TrophyIcon className={'size-5'} />} label="Best Time" value={bestStr} />
      <StatItem icon={<GaugeIcon className={'size-5'} />} label="Overall Average" value={overallAvgStr} />
      <StatItem icon={<TimerIcon className={'size-5'} />} label="Ao5 (Current)" value={ao5CurrentStr} />
      <StatItem icon={<PercentIcon className={'size-5'} />} label="Success Rate" value={successRateStr} />
    </div>
  )
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="flex flex-row items-center gap-3 p-3 border rounded-md bg-card backdrop-blur-lg">
      <div className="inline-flex items-center justify-center rounded-md bg-primary/10 text-primary p-2">{icon}</div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-lg font-bold leading-none">{value}</span>
      </div>
    </Card>
  )
}
