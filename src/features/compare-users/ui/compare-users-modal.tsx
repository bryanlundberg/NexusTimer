import { useEffect, useMemo, useRef } from 'react'
import { XIcon, PlusIcon } from 'lucide-react'
import { Link, useRouter } from '@/shared/config/i18n/navigation'
import { useCompareUsersStore } from '@/features/compare-users/model/useCompareUsersStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useManyUserStats } from '@/entities/user-stats/model/useUserStats'
import CompareTableRow from '@/features/compare-users/ui/CompareTableRow'
import CompareCategoryBlock from '@/features/compare-users/ui/CompareCategoryBlock'
import { useCompareUsersStats } from '@/features/compare-users/model/useCompareUsersStats'
import { CompareUser } from '@/features/compare-users/model/compare'
import { EMPTY_VALUE, VALUE_COLUMN } from '@/features/compare-users/model/columns'
import { CUBE_CATEGORIES } from '@/shared/const/cube-categories'
import { useLocale, useTranslations } from 'next-intl'
import dayjs from '@/shared/lib/dayjs'
import { cn } from '@/shared/lib/utils'
import { Nexi } from '@/shared/ui/nexi'
import { Spinner } from '@/components/ui/spinner'
import { CountryFlag } from '@/shared/ui/country-flag/CountryFlag'
import { getCountryName } from '@/shared/lib/getCountryName'

export default function CompareUsersModal() {
  const t = useTranslations('Index.LeaderboardsPage.comparative')
  const locale = useLocale()
  const router = useRouter()
  const closeOverlay = useCompareUsersStore((state) => state.closeOverlay)
  const removeUser = useCompareUsersStore((state) => state.removeUser)
  const users = useCompareUsersStore((state) => state.users)
  const closeRef = useRef<HTMLButtonElement>(null)

  const { statsByUser, isLoading } = useManyUserStats(users.map((user) => user._id))
  const usersStats: CompareUser[] = useCompareUsersStats(users, statsByUser)

  const categories = useMemo(
    () =>
      CUBE_CATEGORIES.filter((category) =>
        usersStats.some((user) => user[category]?.count > 0 || user[category]?.single > 0)
      ),
    [usersStats]
  )

  useEffect(() => {
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeOverlay()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [closeOverlay])

  useEffect(() => {
    if (users.length === 0) closeOverlay()
  }, [users.length, closeOverlay])

  const handleAddMore = () => {
    closeOverlay()
    router.push('/people')
  }

  const number = (value?: number) => (value ? value.toLocaleString(locale) : EMPTY_VALUE)
  const valueClass = (value: string) =>
    value === EMPTY_VALUE ? 'text-muted-foreground/40' : 'font-semibold text-foreground'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-users-title"
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background selection:bg-primary/30"
    >
      <header className="sticky top-0 z-[70] grid grid-cols-[1fr_auto_1fr] items-center border-b bg-background/85 px-3 py-2 backdrop-blur-md sm:px-4">
        <Nexi state="idle" size={34} className="justify-self-start" />
        <h2 id="compare-users-title" className="text-base font-bold tracking-tight sm:text-lg">
          {t('title')}
        </h2>
        <button
          ref={closeRef}
          type="button"
          onClick={closeOverlay}
          aria-label={t('close')}
          title={t('close')}
          className="grid size-10 place-items-center justify-self-end text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring pointer-coarse:size-11"
        >
          <XIcon className="size-5" />
        </button>
      </header>

      <div className="relative overflow-x-auto pb-10">
        <CompareTableRow isHeader className="z-[60]">
          {users.map((user) => (
            <div key={user._id} className={cn(VALUE_COLUMN, 'py-5 sm:py-6')}>
              <div className="group flex flex-col items-center gap-3">
                <div className="relative">
                  <Avatar className="size-16 shadow-xl ring-4 ring-muted transition-all duration-300 group-hover:ring-primary/50 sm:size-24">
                    <AvatarImage className="object-cover" src={user.image} />
                    <AvatarFallback className="bg-muted-foreground/10 text-lg font-bold sm:text-xl">
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={() => removeUser(user._id)}
                    aria-label={t('remove', { name: user.name })}
                    title={t('remove', { name: user.name })}
                    className="absolute -top-1 -right-1 grid size-7 place-items-center rounded-full border bg-background text-muted-foreground shadow-sm transition-colors hover:text-destructive pointer-coarse:size-9"
                  >
                    <XIcon className="size-3.5" />
                  </button>
                </div>
                <Link
                  href={`/people/${user._id}`}
                  onClick={closeOverlay}
                  className="max-w-full truncate px-2 text-sm font-bold tracking-tight transition-colors hover:text-primary sm:text-base"
                >
                  {user.name}
                </Link>
              </div>
            </div>
          ))}
          <div className={cn(VALUE_COLUMN, 'flex justify-center py-5 sm:py-6')}>
            <button
              type="button"
              onClick={handleAddMore}
              className="group flex cursor-pointer flex-col items-center gap-3 outline-none"
            >
              <div className="notch-bl-tr flex size-16 items-center justify-center border-4 border-dashed border-muted-foreground/30 transition-all duration-300 [--nblt:14px] group-hover:border-primary/50 group-hover:bg-primary/5 group-focus-visible:border-primary sm:size-24 sm:[--nblt:18px]">
                <PlusIcon
                  className="size-8 text-muted-foreground/50 transition-colors group-hover:text-primary sm:size-10"
                  strokeWidth={1.5}
                />
              </div>
              <span className="text-sm font-bold tracking-tight text-muted-foreground transition-colors group-hover:text-primary sm:text-base">
                {t('add-more')}
              </span>
            </button>
          </div>
        </CompareTableRow>

        <CompareTableRow title={t('country')}>
          {users.map((user) => (
            <div
              key={user._id}
              className={cn(VALUE_COLUMN, 'flex items-center justify-center gap-1.5 px-2 py-3 text-sm')}
            >
              {user.country ? (
                <>
                  <CountryFlag code={user.country} className="w-3.5 shrink-0" />
                  <span className="truncate font-medium">{getCountryName(user.country, locale)}</span>
                </>
              ) : (
                <span className="text-muted-foreground/40">{EMPTY_VALUE}</span>
              )}
            </div>
          ))}
        </CompareTableRow>

        <CompareTableRow title={t('first-solve')}>
          {users.map((user) => {
            const created = dayjs(user.createdAt)
            const value = created.isValid() ? created.locale(locale).fromNow() : EMPTY_VALUE
            return (
              <div
                key={user._id}
                title={created.isValid() ? created.locale(locale).format('LL') : undefined}
                className={cn(VALUE_COLUMN, 'px-2 py-3 text-center text-sm')}
              >
                <span className={value === EMPTY_VALUE ? 'text-muted-foreground/40' : 'font-medium text-foreground'}>
                  {value}
                </span>
              </div>
            )
          })}
        </CompareTableRow>

        <CompareTableRow title={t('total-solves')}>
          {users.map((user) => {
            const value = number(statsByUser[user._id]?.totalSolves)
            return (
              <div key={user._id} className={cn(VALUE_COLUMN, 'px-2 py-3 text-center text-sm tabular-nums')}>
                <span className={valueClass(value)}>{value}</span>
              </div>
            )
          })}
        </CompareTableRow>

        <CompareTableRow title={t('total-cubes')}>
          {users.map((user) => {
            const value = number(statsByUser[user._id]?.cubes.length)
            return (
              <div key={user._id} className={cn(VALUE_COLUMN, 'px-2 py-3 text-center text-sm tabular-nums')}>
                <span className={valueClass(value)}>{value}</span>
              </div>
            )
          })}
        </CompareTableRow>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
            <Spinner />
          </div>
        ) : categories.length === 0 ? (
          <p className="px-4 py-12 text-center text-[15px] text-muted-foreground sm:text-sm">{t('no-stats')}</p>
        ) : (
          categories.map((category) => <CompareCategoryBlock key={category} category={category} users={usersStats} />)
        )}
      </div>
    </div>
  )
}
