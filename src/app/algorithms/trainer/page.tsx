import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { ScrollArea } from '@/components/ui/scroll-area'
import TrainerSessionHeader from '@/features/trainer/ui/TrainerSessionHeader'
import TrainerCurrentCase from '@/features/trainer/ui/TrainerCurrentCase'
import TrainerStatsPanel from '@/features/trainer/ui/TrainerStatsPanel'
import TrainerStatRow from '@/features/trainer/ui/TrainerStatRow'
import { Activity, BarChart3, AlertTriangle } from 'lucide-react'

export default function TrainerPage() {
  return (
    <ScrollArea className="max-h-dvh overflow-auto">
      <CoreHeader
        breadcrumbPath={'/algorithms'}
        breadcrumb={'Algorithms'}
        secondaryBreadcrumbPath={`#`}
        secondaryBreadcrumb={'Trainer'}
      />

      <div className="p-4 flex flex-col lg:flex-row gap-4">
        {/* Main column */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          <TrainerSessionHeader targetTime={'>2:00'} progressValue={33} sessionCurrent={12} sessionTotal={30} />

          <TrainerCurrentCase
            caseGroup={'OLL 24'}
            caseName={'T-Shape'}
            lastDrilled={'5 days ago'}
            totalSolves={34}
            setup={`y2 R U R' U R U2 R'`}
            currentTime={'0.00'}
          />
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-3 w-full lg:w-80 shrink-0">
          <TrainerStatsPanel title={'This case'} icon={<Activity />}>
            <TrainerStatRow label={'Best'} value={'2.89'} />
            <TrainerStatRow label={'ao5 / ao12'} value={'3.05 / 4.53'} />
            <TrainerStatRow label={'Solves'} value={'123'} />
            <TrainerStatRow label={'Last drilled'} value={'2024-01-01'} />
          </TrainerStatsPanel>

          <TrainerStatsPanel title={'This session'} icon={<BarChart3 />}>
            <TrainerStatRow label={'Cases done'} value={'12 / 57'} />
            <TrainerStatRow label={'Set ao12'} value={'1.98'} />
            <TrainerStatRow label={'Mistakes'} value={'0'} />
            <TrainerStatRow label={'Time elapsed'} value={'04:45'} />
          </TrainerStatsPanel>

          <TrainerStatsPanel title={'Weakest 5 (by ao5)'} icon={<AlertTriangle />}>
            <TrainerStatRow label={'OLL 28'} value={'3.47'} />
            <TrainerStatRow label={'OLL 23'} value={'2.76'} />
            <TrainerStatRow label={'OLL 1'} value={'4.90'} />
            <TrainerStatRow label={'OLL 54'} value={'1.87'} />
            <TrainerStatRow label={'OLL 47'} value={'3.69'} />
          </TrainerStatsPanel>
        </aside>
      </div>
    </ScrollArea>
  )
}
