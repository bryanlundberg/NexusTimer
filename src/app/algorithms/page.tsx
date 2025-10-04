import MoreCategories from '@/components/algorithms/more-categories/more-categories';
import { ALGORITHM_SETS } from '@/constants/algorithms-sets';
import AlgorithmsCollection from '@/components/algorithms/algorithms-collection/algorithms-collection';
import BreadcrumbNav from '@/components/algorithms/breadcrumb-nav/breadcrumb-nav';
import { ScrollArea } from '@/components/ui/scroll-area';
import Suggestions from '@/components/algorithms/suggestions/suggestions';
import _ from 'lodash';

export default function Page() {
  const groupedSets = _.groupBy(ALGORITHM_SETS, 'cube');

  return (
    <ScrollArea className="p-4 max-h-dvh overflow-auto">
      <BreadcrumbNav hideCollectionsSegment/>

      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        Master Your Cubing Journey with Algorithm Training
      </h1>

      {Object.keys(groupedSets).length > 1 && (
        Object.entries(groupedSets).map(([cube, sets]) => (
          <section key={cube} className="py-8">
            <h2 className="px-2 mb-4 text-xl font-bold tracking-tight">{cube}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
              {sets.map((set) => (
                <AlgorithmsCollection key={set.slug} set={set}/>
              ))}
              {(cube === 'pyraminx') && <MoreCategories />}
            </div>
          </section>
        ))
      )}

      <Suggestions message={'If you find any errors or want to extend with more algorithms, please submit it on our GitHub.'}/>
    </ScrollArea>
  )
}
