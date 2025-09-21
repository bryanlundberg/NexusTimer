import Image from 'next/image';
import { XIcon } from 'lucide-react';
import { useCompareUsersStore } from '@/store/CompareUsers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Categories } from '@/interfaces/Categories';
import { Cube } from '@/interfaces/Cube';
import { decompressSync, strFromU8 } from 'fflate';
import { useEffect, useMemo, useState } from 'react';
import calcBestTime from '@/lib/calcBestTime';
import calcAverageStatistics from '@/lib/calcAverageStatistics';
import calcTotalSolvesStatistics from '@/lib/calcTotalSolvesStatistics';
import _ from 'lodash';
import formatTime from '@/lib/formatTime';
import { formatDistance } from 'date-fns';

export default function CompareUsersModal() {
  const closeOverlay = useCompareUsersStore(state => state.closeOverlay);
  const users = useCompareUsersStore(state => state.users);
  const [userCubes, setUserCubes] = useState<any>({});

  useEffect(() => {
    let isMounted = true;

    async function loadBackups() {
      const entries = await Promise.all(users.map(async (user) => {
        try {
          if (user.backup?.url) {
            const response = await fetch(user.backup.url);
            if (!response.ok) throw new Error('Network response was not ok');
            const compressed = new Uint8Array(await response.arrayBuffer());
            const decompressed = decompressSync(compressed);
            const data = strFromU8(decompressed);
            const cubeData = (JSON.parse(data) as Cube[]);
            const merged = _.groupBy(cubeData, 'category');

            return [user._id, merged] as const;
          }
        } catch (e) {
          console.error('Error loading backup for user', user._id, e);
        }
        return [user._id, null] as const;
      }));
      if (!isMounted) return;

      setUserCubes(Object.fromEntries(entries));
    }

    if (users.length) loadBackups();
    return () => {
      isMounted = false;
    };
  }, [users]);

  const usersStats: CompareUser[] = useMemo(() => {
    return users.map(user => {
      const cubesDB = userCubes[user._id] || {};
      const byCategory = Object.create(null) as CompareUser;
      (CATEGORIES as Categories[]).forEach((category) => {
        const cubeData = cubesDB[category] ?? [];
        const cubeName = '';

        const single = calcBestTime({ cubesDB: cubeData, category, cubeName }).global;
        const average = calcAverageStatistics({ cubesDB: cubeData, category, cubeName }).global;
        const count = calcTotalSolvesStatistics({ cubesDB: cubeData, category, cubeName }).global;

        (byCategory as any)[category] = { single, average, count };
      });
      return { _id: user._id, ...(byCategory as any) } as CompareUser;
    });
  }, [users, userCubes]);

  return (
    <div className={'bg-background w-full h-full flex flex-col fixed top-0 left-0 z-50 overflow-y-auto'}>
      <header className={'flex items-center justify-between p-4'}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-primary border border-primary/15 flex items-center justify-center">
            <Image src={'/logo.png'} alt={'logo'} width={20} height={20} className={'invert'}/>
          </div>
          <span className="text-sm font-semibold tracking-wide text-background-foreground/90 hidden sm:block">NexusTimer</span>
        </div>
        <h2 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0 text-background-foreground">Comparative</h2>
        <XIcon onClick={closeOverlay}/>
      </header>

      <div id={'table'} className={'relative overflow-x-auto'}>

        <TableRow title={''} className={'sticky top-0 right-0 bg-background z-50 border-b border-b-white/10 w-full'}>
          {users.map((user) => {
            return (
              <div key={user._id} className={'w-52 py-3 z-50'}>
                <div className={'flex flex-col items-center gap-2'}>
                  <Avatar className={'size-24'}>
                    <AvatarImage className={'object-cover'} src={user.image}/>
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span className={'font-semibold'}>{user.name}</span>
                </div>
              </div>
            )
          })}
        </TableRow>

        <TableRow title={'Time Zone'}>
          {users.map((user) => {
            const value = user.timezone || '—'
            return (
              <div key={user._id} className={'w-52 text-center shrink-0 px-2 py-2'}>
                <Badge variant={value !== '—' ? 'secondary' : 'outline'} className={'mx-auto'}>{value}</Badge>
              </div>
            )
          })}
        </TableRow>

        <TableRow title={'First solve'}>
          {users.map((user) => {
            const value = formatDistance(new Date(user.createdAt), new Date(), { addSuffix: true })
            return (
              <div key={user._id} className={'w-52 text-center shrink-0 px-2 py-2'}>
                <Badge variant={'outline'} className={'mx-auto'}>{value}</Badge>
              </div>
            )
          })}
        </TableRow>

        <TableRow title={'Total solves'}>
          {users.map((user) => {
            const cubesDB = userCubes[user._id] || {};
            const allCubes = Object.values(cubesDB).flat() as Cube[];
            const totalSolves = allCubes.reduce((sum, cube) => sum + (cube?.solves?.all?.length || 0) + (cube?.solves?.session?.length || 0), 0);
            const hasValue = totalSolves && !isNaN(totalSolves) && totalSolves !== 0;
            const value = hasValue ? totalSolves.toLocaleString() : '—'
            return (
              <div key={user._id} className={'w-52 text-center shrink-0 px-2 py-2'}>
                <Badge variant={value !== '—' ? 'secondary' : 'outline'} className={'mx-auto'}>{value}</Badge>
              </div>
            )
          })}
        </TableRow>

        <TableRow title={'Total Cubes'}>
          {users.map((user) => {
            const cubesDB = userCubes[user._id] || {};
            const totalCubes = (Object.values(cubesDB).flat() as Cube[]).length;
            const hasValue = totalCubes && !isNaN(totalCubes) && totalCubes !== 0;
            const value = hasValue ? totalCubes.toLocaleString() : '—'
            return (
              <div key={user._id} className={'w-52 text-center shrink-0 px-2 py-2'}>
                <Badge variant={value !== '—' ? 'secondary' : 'outline'} className={'mx-auto'}>{value}</Badge>
              </div>
            )
          })}
        </TableRow>

        {CATEGORIES.map((category) => (
          <div key={category}>
            <CategoryBlock category={category} users={usersStats}/>
          </div>
        ))}

        <div className={"py-3"}></div>
      </div>
    </div>
  )
}

const TableRow = ({ title, children, className }: { title?: string, children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn('flex gap-3 w-max items-center', className)}>
      <div className={'w-40 pl-4 text-sm sticky left-0 z-20 bg-background'}>
        {title && <Badge variant={'outline'} className={'rounded-md'}>{title}</Badge>}
      </div>
      {children}
    </div>
  )
}

const CATEGORIES: Categories[] = [
  '2x2',
  '3x3',
  '3x3 OH',
  '4x4',
  '5x5',
  '6x6',
  '7x7',
  'SQ1',
  'Skewb',
  'Pyraminx',
  'Megaminx',
  'Clock',
];

type CompareUser = {
  [key in Categories]: { single: number; average: number; count: number; };
} & {
  _id: string;
};

const CategoryBlock = ({ category, users }: { category: Categories, users: CompareUser[] }) => {
  // compute bests: for single/average min is best; for count max is best
  const singles = users.map(u => u[category]?.single).filter(v => typeof v === 'number' && !isNaN(v) && v > 0) as number[];
  const avgs = users.map(u => u[category]?.average).filter(v => typeof v === 'number' && !isNaN(v) && v > 0) as number[];
  const counts = users.map(u => u[category]?.count).filter(v => typeof v === 'number' && !isNaN(v) && v > 0) as number[];
  const bestSingle = singles.length ? Math.min(...singles) : undefined;
  const bestAverage = avgs.length ? Math.min(...avgs) : undefined;
  const bestCount = counts.length ? Math.max(...counts) : undefined;

  return (
    <>
      <TableRow className={'mt-5'} title={`${category} Single`}>
        {users.map((user) => {
          const val = user[category]?.single;
          const hasValue = typeof val === 'number' && !isNaN(val) && val > 0;
          const isBest = hasValue && bestSingle !== undefined && val === bestSingle;
          return (
            <div key={user._id} className={'w-52 text-center shrink-0 px-2 py-2'}>
              <Badge variant={isBest ? 'default' : hasValue ? 'outline' : 'outline'} className={'mx-auto'}>
                {isBest && '🏆'} {hasValue ? formatTime(val) : '—'}
              </Badge>
            </div>
          )
        })}
      </TableRow>

      <TableRow title={`${category} Average`}>
        {users.map((user) => {
            const val = user[category]?.average;
            const hasValue = typeof val === 'number' && !isNaN(val) && val > 0;
            const isBest = hasValue && bestAverage !== undefined && val === bestAverage;
            return (
              <div key={user._id} className={'w-52 text-center shrink-0 px-2 py-2'}>
                <Badge variant={isBest ? 'default' : hasValue ? 'outline' : 'outline'} className={'mx-auto'}>
                  {isBest && '🏆'} {hasValue ? formatTime(val) : '—'}
                </Badge>
              </div>
            )
          }
        )}
      </TableRow>

      <TableRow title={`${category} Count`}>
        {users.map((user) => {
          const val = user[category]?.count;
          const hasValue = val !== undefined && val !== null && !isNaN(val) && val !== 0;
          const isBest = hasValue && bestCount !== undefined && val === bestCount;
          return (
            <div key={user._id} className={'w-52 text-center shrink-0 px-2 py-2'}>
              <Badge variant={isBest ? 'default' : hasValue ? 'outline' : 'outline'} className={'mx-auto'}>
                {isBest && '🏆'} {hasValue ? val.toLocaleString() : '—'}
              </Badge>
            </div>
          )
        })}
      </TableRow>
    </>
  )
}
