import MoreCategories from '@/components/algorithms/more-categories/more-categories';
import { ALGORITHM_SETS } from '@/constants/algorithms-sets';
import AlgorithmsCollection from '@/components/algorithms/algorithms-collection/algorithms-collection';
import BreadcrumbNav from '@/components/algorithms/breadcrumb-nav/breadcrumb-nav';
import { ScrollArea } from '@/components/ui/scroll-area';
import Suggestions from '@/components/algorithms/suggestions/suggestions';

export default function Page() {
  return (
    <ScrollArea className="p-4 max-h-dvh overflow-auto">
      <BreadcrumbNav hideCollectionsSegment/>

      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        Master Your Cubing Journey with Algorithm Training
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-10">
        {ALGORITHM_SETS.map((set) => (
          <AlgorithmsCollection key={set.slug} set={set}/>
        ))}

        <MoreCategories/>
      </div>

      <Suggestions/>
    </ScrollArea>
  )
}
