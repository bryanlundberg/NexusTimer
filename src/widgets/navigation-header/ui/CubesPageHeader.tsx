import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import ButtonCreateCollection from '@/features/navigation/ui/button-create-collection'
import MainCubeSelector from '@/features/select-cube/ui/MainCubeSelector'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'

export default function CubesPageHeader() {
  const t = useTranslations('Index.CubesPage')
  const cubes = useTimerStore((store) => store.cubes)

  const summary = useMemo(() => {
    const list = cubes ?? []
    const total = list.length
    const active = list.filter((c) => c.solves.session.length > 0).length
    const solves = list.reduce((acc, c) => {
      const ids = new Set<string>()
      c.solves.all.forEach((s) => ids.add(s.id))
      c.solves.session.forEach((s) => ids.add(s.id))
      return acc + ids.size
    }, 0)
    return { total, active, solves }
  }, [cubes])

  return (
    <div className="flex flex-col gap-3 w-full mb-4">
      <div className="flex items-center gap-2 w-full">
        <MainCubeSelector />
        <ButtonCreateCollection />
      </div>

      {summary.total > 0 && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{t('collections-count', { count: summary.total })}</span>
          <span className="text-muted-foreground/50">·</span>
          <span>{t('active-count', { count: summary.active })}</span>
          <span className="text-muted-foreground/50">·</span>
          <span>{t('total-solves-count', { count: summary.solves })}</span>
        </div>
      )}
    </div>
  )
}
