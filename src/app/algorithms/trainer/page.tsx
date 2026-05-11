import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { ScrollArea } from '@/components/ui/scroll-area'
import TrainerExperience from '@/features/trainer/ui/TrainerExperience'

export default function TrainerPage() {
  return (
    <div className="min-h-dvh flex flex-col">
      <CoreHeader
        breadcrumbPath={'/algorithms'}
        breadcrumb={'Algorithms'}
        secondaryBreadcrumbPath={`#`}
        secondaryBreadcrumb={'Trainer'}
      />

      <TrainerExperience />
    </div>
  )
}
