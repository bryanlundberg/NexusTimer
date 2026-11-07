import EmptyTabContent from '@/widgets/people/ui/empty-tab-content'
import type { RecentSolve } from '@/entities/user-stats/model/types'
import { TimelineSolveList } from '@/widgets/people/ui/timeline-solve-list'

interface TimelineTabContentProps {
  solves: RecentSolve[]
  totalSolves: number
}

export default function TimelineTabContent({ solves, totalSolves }: TimelineTabContentProps) {
  if (solves.length === 0) return <EmptyTabContent />

  return <TimelineSolveList solves={solves} totalSolves={totalSolves} />
}
