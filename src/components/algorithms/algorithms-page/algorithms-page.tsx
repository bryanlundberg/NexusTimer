"use client";

import { useMemo, useState } from 'react';
import _ from 'lodash';
import BreadcrumbNav from '@/components/algorithms/breadcrumb-nav/breadcrumb-nav';
import Information from '@/components/algorithms/information/information';
import { Badge } from '@/components/ui/badge';
import AlgorithmCard from '@/components/algorithms/algorithm-card/algorithm-card';
import { AlgorithmCollection } from '@/interfaces/AlgorithmCollection';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TwistyPlayer } from 'cubing/twisty';

interface AlgorithmsPageProps {
  algorithms: AlgorithmCollection[],
  title: string
  virtualization?: TwistyPlayer
}

export const AlgorithmsPage = ({ algorithms, title, virtualization }: AlgorithmsPageProps) => {
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
      <Information title={title}/>

      {Object.keys(groups).map((group) => (
        <Badge
          key={group}
          variant={activeGroups.includes(group) ? 'default' : 'secondary'}
          onClick={() => handleChooseGroup(group)} className={'mr-2 mb-2'}
        >{group} ({groups[group].length})</Badge>
      ))}

      <div className={'mt-5'}>
        <div className="grid md:grid-cols-2 gap-3">
          <div className={'columns-1 gap-3 sm:col-span-2 sm:columns-2'}>
            {displayedAlgs.map((item) => (
              <AlgorithmCard
                algorithm={item}
                onAlgorithmClick={() => console.log('click')}
                key={`OLL-${item.group}-${item.name}`}
                virtualization={virtualization}
              />
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
