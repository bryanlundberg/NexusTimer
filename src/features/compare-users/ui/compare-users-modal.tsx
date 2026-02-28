import Image from 'next/image'
import { XIcon } from 'lucide-react'
import { useCompareUsersStore } from '@/features/compare-users/model/useCompareUsersStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatDistance } from 'date-fns'
import { useUserBackups } from '@/features/compare-users/model/useUserBackups'
import CompareTableRow from '@/features/compare-users/ui/CompareTableRow'
import CompareCategoryBlock from '@/features/compare-users/ui/CompareCategoryBlock'
import { useCompareUsersStats } from '@/features/compare-users/model/useCompareUsersStats'
import { CompareUser } from '@/features/compare-users/model/compare'
import { Cube } from '@/entities/cube/model/types'
import { CUBE_CATEGORIES } from '@/shared/const/cube-categories'
import { useLocale, useTranslations } from 'next-intl'
import moment from 'moment'

export default function CompareUsersModal() {
  const t = useTranslations('Index.LeaderboardsPage.comparative')
  const locale = useLocale()
  const closeOverlay = useCompareUsersStore((state) => state.closeOverlay)
  const users = useCompareUsersStore((state) => state.users)
  const userCubes = useUserBackups(users)

  const usersStats: CompareUser[] = useCompareUsersStats(users, userCubes)

  return (
    <div
      className={
        'bg-background w-full h-full flex flex-col fixed top-0 left-0 z-50 overflow-y-auto selection:bg-primary/30'
      }
    >
      <header
        className={'flex items-center justify-between p-4 border-b bg-muted/20 sticky top-0 z-50 backdrop-blur-md'}
      >
        <div className="flex items-center gap-3">
          <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Image src={'/logo.png'} alt={'logo'} width={32} height={32} className={`p-1.5 invert size-8`} />
          </div>
          <span className="text-sm font-bold tracking-tight text-foreground hidden sm:block">NexusTimer</span>
        </div>
        <h2 className="text-lg font-bold tracking-tight text-foreground">{t('title')}</h2>
        <button onClick={closeOverlay} className="p-2 hover:bg-muted rounded-full transition-colors group">
          <XIcon className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
        </button>
      </header>

      <div id={'table'} className={'relative overflow-x-auto pb-10'}>
        <CompareTableRow title={''} isHeader className={'z-[60]'}>
          {users.map((user) => {
            return (
              <div key={user._id} className={'w-52 py-6 z-50'}>
                <div className={'flex flex-col items-center gap-4 group'}>
                  <div className="relative">
                    <Avatar
                      className={
                        'size-24 ring-4 ring-muted group-hover:ring-primary/50 transition-all duration-300 shadow-xl'
                      }
                    >
                      <AvatarImage className={'object-cover'} src={user.image} />
                      <AvatarFallback className="text-xl font-bold bg-muted-foreground/10">
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <span className={'font-bold text-base tracking-tight group-hover:text-primary transition-colors'}>
                    {user.name}
                  </span>
                </div>
              </div>
            )
          })}
        </CompareTableRow>

        <CompareTableRow title={t('timezone')}>
          {users.map((user) => {
            const value = user.timezone || '—'
            return (
              <div key={user._id} className={'w-52 text-center shrink-0 px-2 py-3'}>
                <Badge variant={value !== '—' ? 'secondary' : 'outline'} className={'mx-auto px-3 font-medium'}>
                  {value}
                </Badge>
              </div>
            )
          })}
        </CompareTableRow>

        <CompareTableRow title={t('first-solve')}>
          {users.map((user) => {
            const value = moment(user.createdAt).isValid() ? moment(user.createdAt).locale(locale).fromNow() : '—'
            return (
              <div key={user._id} className={'w-52 text-center shrink-0 px-2 py-3'}>
                <Badge variant={'outline'} className={'mx-auto px-3 font-medium bg-muted/30'}>
                  {value}
                </Badge>
              </div>
            )
          })}
        </CompareTableRow>

        <CompareTableRow title={t('total-solves')}>
          {users.map((user) => {
            const cubesDB = userCubes[user._id] || {}
            const allCubes = Object.values(cubesDB).flat() as Cube[]
            const totalSolves = allCubes.reduce(
              (sum, cube) => sum + (cube?.solves?.all?.length || 0) + (cube?.solves?.session?.length || 0),
              0
            )
            const hasValue = totalSolves && !isNaN(totalSolves) && totalSolves !== 0
            const value = hasValue ? totalSolves.toLocaleString() : '—'
            return (
              <div key={user._id} className={'w-52 text-center shrink-0 px-2 py-3'}>
                <Badge variant={value !== '—' ? 'secondary' : 'outline'} className={'mx-auto px-3 font-medium'}>
                  {value}
                </Badge>
              </div>
            )
          })}
        </CompareTableRow>

        <CompareTableRow title={t('total-cubes')}>
          {users.map((user) => {
            const cubesDB = userCubes[user._id] || {}
            const totalCubes = (Object.values(cubesDB).flat() as Cube[]).length
            const hasValue = totalCubes && !isNaN(totalCubes) && totalCubes !== 0
            const value = hasValue ? totalCubes.toLocaleString() : '—'
            return (
              <div key={user._id} className={'w-52 text-center shrink-0 px-2 py-3'}>
                <Badge variant={value !== '—' ? 'secondary' : 'outline'} className={'mx-auto px-3 font-medium'}>
                  {value}
                </Badge>
              </div>
            )
          })}
        </CompareTableRow>

        {CUBE_CATEGORIES.map((category) => (
          <div key={category}>
            <CompareCategoryBlock category={category} users={usersStats} />
          </div>
        ))}

        <div className={'py-3'}></div>
      </div>
    </div>
  )
}
