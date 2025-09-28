'use client';

import { useMemo, useState } from 'react';
import _ from 'lodash';
import BreadcrumbNav from '@/components/algorithms/breadcrumb-nav/breadcrumb-nav';
import Information from '@/components/algorithms/information/information';
import { Badge } from '@/components/ui/badge';
import AlgorithmCard from '@/components/algorithms/algorithm-card/algorithm-card';
import { AlgorithmCollection } from '@/interfaces/AlgorithmCollection';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PuzzleID, TwistyPlayer } from 'cubing/twisty';
import Suggestions from '@/components/algorithms/suggestions/suggestions';
import { ALGORITHMS_GITHUB_URL } from '@/constants/algorithms-github-url';
import AlgorithmModal from '@/components/algorithms/algorithm-modal/algorithm-modal';

interface AlgorithmsPageProps {
  algorithms: AlgorithmCollection[],
  title: string
  description?: string
  virtualization?: TwistyPlayer
  fileCollectionName?: string
  puzzle: PuzzleID
}

export const AlgorithmsPage = ({ algorithms, title, virtualization, description, fileCollectionName, puzzle }: AlgorithmsPageProps) => {
  const groups = useMemo(() => _.groupBy(algorithms, 'group'), [algorithms]);
  const [activeGroups, setActiveGroups] = useState<string[]>([]);

  const handleChooseGroup = (group: string) => {
    if (activeGroups.includes(group)) return;
    setActiveGroups([group])
  }

  const displayedAlgs = useMemo(() => {
    if (activeGroups.length === 0) {
      return algorithms || [];
    }
    return (algorithms || []).filter((item) => activeGroups.includes(item.group));
  }, [activeGroups, algorithms]);

  return (
    <ScrollArea className="max-h-dvh overflow-auto p-4">
      <BreadcrumbNav/>
      <Information title={title} description={description}/>

      {Object.keys(groups).map((group) => (
        <Badge
          key={group}
          variant={activeGroups.includes(group) ? 'default' : 'secondary'}
          onClick={() => handleChooseGroup(group)} className={'mr-2 mb-2'}
        >{group} ({groups[group].length})</Badge>
      ))}

      <div className={'mt-5'}>
        <div className="grid md:grid-cols-2 gap-3">
          <div className={'columns-1 gap-3 sm:col-span-2 sm:columns-2 mb-3'}>
            {displayedAlgs.map((item) => (
              <AlgorithmCard
                algorithm={item}
                onAlgorithmClick={() => console.log('click')}
                key={`${item.group}-${item.name}`}
                virtualization={virtualization}
                puzzle={puzzle}
              />
            ))}
          </div>
        </div>
      </div>

      <AlgorithmModal/>

      {fileCollectionName && <Suggestions link={ALGORITHMS_GITHUB_URL + `/${fileCollectionName.toLowerCase()}`} message={'Edit this algorithms on Github'}/>}
    </ScrollArea>
  );
}
