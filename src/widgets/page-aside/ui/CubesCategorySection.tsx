'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/shared/lib/utils'
import { cubeColorClass } from '@/shared/const/cube-colors'
import { PageAsideSection } from '@/shared/ui/page-aside/PageAsideSection'
import { CubeColorDot } from '@/shared/ui/category-badge/CubeColorDot'
import { useCubeCategoryQuery } from '@/features/filter-cube-category/model/useCubeCategoryQuery'
import { CategoryShare } from '@/widgets/page-aside/lib/asideStats'

const PLACEHOLDER_WIDTHS = ['3rem', '4.5rem', '2.5rem']

interface CubesCategorySectionProps {
  shares: CategoryShare[]
}

export default function CubesCategorySection({ shares }: CubesCategorySectionProps) {
  const t = useTranslations('Index.PageAside')
  const [category, setCategory] = useCubeCategoryQuery()
  const total = shares.reduce((sum, share) => sum + share.count, 0)
  const percent = (count: number) => (total > 0 ? Math.round((count / total) * 100) : 0)

  return (
    <PageAsideSection
      title={t('by-category')}
      aside={
        category !== 'all' && (
          <button
            type="button"
            onClick={() => setCategory('all')}
            className="cursor-pointer text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('all-categories')}
          </button>
        )
      }
    >
      <div className="flex h-2 w-full gap-px overflow-hidden bg-muted">
        {shares.map((share) => (
          <button
            key={share.category}
            type="button"
            aria-label={share.category}
            onClick={() => setCategory(share.category as typeof category)}
            className={cn(
              'h-full cursor-pointer transition-opacity',
              cubeColorClass(share.category),
              category !== 'all' && category !== share.category && 'opacity-25'
            )}
            style={{ width: `${total > 0 ? (share.count / total) * 100 : 100 / shares.length}%` }}
          />
        ))}
      </div>

      <div className="-mx-2 mt-3 flex flex-col">
        {shares.length === 0 &&
          PLACEHOLDER_WIDTHS.map((width) => (
            <div key={width} className="flex items-center gap-2.5 px-2 py-1.5">
              <span aria-hidden className="size-2 bg-muted" />
              <span aria-hidden className="h-2.5 bg-muted" style={{ width }} />
              <span className="ml-auto font-mono text-xs tabular-nums text-muted-foreground/60">--</span>
            </div>
          ))}
        {shares.map((share) => {
          const active = category === share.category
          return (
            <button
              key={share.category}
              type="button"
              aria-pressed={active}
              onClick={() => setCategory(active ? 'all' : (share.category as typeof category))}
              className={cn(
                'relative flex cursor-pointer items-center gap-2.5 px-2 py-1.5 text-left transition-colors hover:bg-accent/50',
                active && 'bg-foreground/[0.04]'
              )}
            >
              {active && <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 bg-primary" />}
              <CubeColorDot category={share.category} className="size-2" />
              <span className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">{share.category}</span>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">{share.count}</span>
              <span className="w-9 text-right font-mono text-xs font-semibold tabular-nums text-foreground">
                {percent(share.count)}%
              </span>
            </button>
          )
        })}
      </div>
    </PageAsideSection>
  )
}
