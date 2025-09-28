import MoreCategories from '@/components/algorithms/more-categories/more-categories';
import { ALGORITHM_SETS } from '@/constants/algorithms-sets';
import AlgorithmsCollection from '@/components/algorithms/algorithms-collection/algorithms-collection';
import BreadcrumbNav from '@/components/algorithms/breadcrumb-nav/breadcrumb-nav';

export default function Page() {
  return (
    <div className="p-4">
      <BreadcrumbNav hideCollectionsSegment/>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALGORITHM_SETS.map((set) => (
          <AlgorithmsCollection key={set.slug} set={set}/>
        ))}

        <MoreCategories/>
      </div>
    </div>
  )
}
