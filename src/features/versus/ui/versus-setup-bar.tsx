'use client'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { ChevronDown, RotateCcw, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CubeCategoryIcon } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { cn } from '@/shared/lib/utils'
import { VERSUS_PLAYER_COUNTS } from '@/features/versus/model/types'
import { useVersusStore } from '@/features/versus/model/useVersusStore'

const CategoryPickerModal = dynamic(() => import('@/features/versus/ui/category-picker-modal'))

export default function VersusSetupBar() {
  const t = useTranslations('VersusPage')
  const category = useVersusStore((state) => state.category)
  const playerCount = useVersusStore((state) => state.playerCount)
  const round = useVersusStore((state) => state.round)
  const setPlayerCount = useVersusStore((state) => state.setPlayerCount)
  const resetMatch = useVersusStore((state) => state.resetMatch)
  const open = useOverlayStore((state) => state.open)

  const handleOpenCategories = () => {
    open({ id: 'versus-category-picker', component: <CategoryPickerModal /> })
  }

  return (
    <div className="flex shrink-0 items-center gap-2 border-b bg-background/80 px-3 py-2 backdrop-blur">
      <Button
        variant="outline"
        size="sm"
        data-testid="versus-select-category"
        onClick={handleOpenCategories}
        className="gap-2"
      >
        <span className="size-4 text-muted-foreground">
          <CubeCategoryIcon category={category} title={category} />
        </span>
        <span className="font-medium">{category}</span>
        <ChevronDown className="size-3.5 opacity-60" />
      </Button>

      <div
        className="flex items-center gap-1 rounded-md border bg-muted/40 p-0.5"
        role="group"
        aria-label={t('players')}
      >
        <Users className="mx-1 size-3.5 shrink-0 text-muted-foreground" />
        {VERSUS_PLAYER_COUNTS.map((count) => (
          <button
            key={count}
            type="button"
            data-testid={`versus-players-${count}`}
            aria-pressed={playerCount === count}
            onClick={() => setPlayerCount(count)}
            className={cn(
              'size-7 rounded text-sm font-medium transition-colors cursor-pointer',
              playerCount === count
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-accent'
            )}
          >
            {count}
          </button>
        ))}
      </div>

      <span className="ml-auto text-xs font-medium text-muted-foreground tabular-nums">{t('round', { round })}</span>

      <Button variant="ghost" size="icon" data-testid="versus-reset" onClick={resetMatch} aria-label={t('reset')}>
        <RotateCcw className="size-4" />
      </Button>
    </div>
  )
}
