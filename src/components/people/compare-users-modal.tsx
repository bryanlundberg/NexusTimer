import Image from 'next/image';
import { XIcon } from 'lucide-react';
import { useCompareUsersStore } from '@/store/CompareUsers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Categories } from '@/interfaces/Categories';
import { Cube } from '@/interfaces/Cube';
import { formatDistance } from 'date-fns';
import CompareTableRow from '@/components/people/CompareTableRow';
import CompareCategoryBlock from '@/components/people/CompareCategoryBlock';
import { useUserBackups } from '@/hooks/useUserBackups';
import { useCompareUsersStats } from '@/hooks/useCompareUsersStats';
import { CompareUser } from '@/types/compare';

export default function CompareUsersModal() {
  const closeOverlay = useCompareUsersStore(state => state.closeOverlay);
  const users = useCompareUsersStore(state => state.users);
  const userCubes = useUserBackups(users);

  const usersStats: CompareUser[] = useCompareUsersStats(users, userCubes);

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

        <CompareTableRow title={''} className={'sticky top-0 bg-background z-50 border-b border-b-white/10'}>
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
        </CompareTableRow>

        <CompareTableRow title={'Time Zone'}>
          {users.map((user) => {
            const value = user.timezone || '—'
            return (
              <div key={user._id} className={'w-52 text-center shrink-0 px-2 py-2'}>
                <Badge variant={value !== '—' ? 'secondary' : 'outline'} className={'mx-auto'}>{value}</Badge>
              </div>
            )
          })}
        </CompareTableRow>

        <CompareTableRow title={'First solve'}>
          {users.map((user) => {
            const value = formatDistance(new Date(user.createdAt), new Date(), { addSuffix: true })
            return (
              <div key={user._id} className={'w-52 text-center shrink-0 px-2 py-2'}>
                <Badge variant={'outline'} className={'mx-auto'}>{value}</Badge>
              </div>
            )
          })}
        </CompareTableRow>

        <CompareTableRow title={'Total solves'}>
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
        </CompareTableRow>

        <CompareTableRow title={'Total Cubes'}>
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
        </CompareTableRow>

        {CATEGORIES.map((category) => (
          <div key={category}>
            <CompareCategoryBlock category={category} users={usersStats}/>
          </div>
        ))}

        <div className={'py-3'}></div>
      </div>
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

