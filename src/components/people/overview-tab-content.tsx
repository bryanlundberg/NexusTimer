import SolveCard from '@/components/people/solve-card';
import { Cube } from '@/interfaces/Cube';
import { useMemo } from 'react';
import _ from 'lodash';
import moment from 'moment';
import formatTime from '@/lib/formatTime';
import { Categories } from '@/interfaces/Categories';
import EmptyTabContent from '@/components/people/empty-tab-content';

export default function OverviewTabContent({ cubes }: { cubes: Cube[] }) {
  const solvesByCategory = useMemo(() => {
    return _.mapValues(
      _.groupBy(
        [...cubes.flatMap(cube => cube.solves.session.map(solve => ({ ...solve, category: cube.category }))),
          ...cubes.flatMap(cube => cube.solves.all.map(solve => ({ ...solve, category: cube.category })))],
        'category'
      ),
      solves => _.orderBy(solves, ['time'], ['asc'])
    );
  }, [cubes]);

  if (_.isEmpty(solvesByCategory)) {
    return <EmptyTabContent/>
  }

  return (
    <div className={'grid grid-cols-1 xl:grid-cols-2 gap-4'}>
      {Object.entries(solvesByCategory).map(([category, solves]) => (
        <SolveCard
          key={solves[0].id}
          scramble={solves[0].scramble}
          event={category as Categories}
          time={formatTime(solves[0].time)}
          date={moment(solves[0].endTime).format('DD-MM-YYYY')}
        />
      ))}
    </div>
  )
}
