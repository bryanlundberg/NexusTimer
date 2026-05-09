import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { ScrollArea } from '@/components/ui/scroll-area'
import TrainerExperience from '@/features/trainer/ui/TrainerExperience'

export default function TrainerPage() {
  return (
    <ScrollArea className="max-h-dvh overflow-auto">
      <CoreHeader
        breadcrumbPath={'/algorithms'}
        breadcrumb={'Algorithms'}
        secondaryBreadcrumbPath={`#`}
        secondaryBreadcrumb={'Trainer'}
      />

      <TrainerExperience />
    </ScrollArea>
  )
}
