import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table'
import { Cube } from '@/interfaces/Cube';
import { useMemo } from 'react';
import _ from 'lodash';
import formatTime from '@/lib/formatTime';
import { ScrambleDisplay } from '@/components/scramble-display';
import { Card } from '@/components/ui/card';
import EmptyTabContent from '@/components/people/empty-tab-content';

interface LastActivityTabContentProps {
  cubes: Cube[];
}

export default function LastActivityTabContent({ cubes }: LastActivityTabContentProps) {
  const solves = useMemo(() => {
    return _.orderBy(
      [...cubes.flatMap(cube => cube.solves.session.map(solve => ({
        ...solve,
        category: cube.category,
        cubeName: cube.name
      }))),
        ...cubes.flatMap(cube => cube.solves.all.map(solve => ({
          ...solve,
          category: cube.category,
          cubeName: cube.name
        })))],
      'endTime',
      'asc'
    );
  }, [cubes]);

  const solvesLength = useMemo(() => solves.length, [solves]);

  if (_.isEmpty(solves)) {
    return <EmptyTabContent/>;
  }

  return (
    <Card className="backdrop-blur-lg h-auto py-0">
      <div className="w-full [&>div]:!overflow-x-visible">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead className="w-full md:w-auto">Cube</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Scramble</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="hidden sm:table-cell">Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {solves.slice(0, 25).map((solve, index) => (
              <TableRow key={solve.id}>
                <TableCell className="font-medium">{solvesLength - index}</TableCell>
                <TableCell className="font-medium overflow-hidden max-w-20 sm:max-w-32 md:max-w-40 lg:max-w-96 whitespace-normal">{solve.cubeName}</TableCell>
                <TableCell className="font-medium hidden sm:table-cell">{solve.category}</TableCell>
                <TableCell className="font-medium hidden md:table-cell overflow-hidden max-w-20 sm:max-w-32 md:max-w-40 lg:max-w-96 whitespace-normal">{solve.scramble}</TableCell>
                <TableCell>{formatTime(solve.time)}</TableCell>
                <TableCell className="hidden sm:table-cell text-right">
                  <ScrambleDisplay className={'size-20'} show scramble={solve.scramble} event={solve.category}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
