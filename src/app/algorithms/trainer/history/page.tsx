import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { ScrollArea } from '@/components/ui/scroll-area'
import TrainerHistoryView from '@/features/trainer/ui/TrainerHistoryView'

export default function TrainerHistoryPage() {
  return (
    <ScrollArea className="max-h-dvh overflow-auto">
      <CoreHeader
        breadcrumbPath={'/algorithms/trainer'}
        breadcrumb={'Trainer'}
        secondaryBreadcrumbPath={`#`}
        secondaryBreadcrumb={'History'}
      />

      <TrainerHistoryView />
    </ScrollArea>
  )
}
