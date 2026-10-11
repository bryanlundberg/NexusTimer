import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'
import { Nexi } from '@/shared/ui/nexi'
import { Button } from '@/components/ui/button'
import { CubeCategory } from '@/shared/const/cube-categories'
import { CubeCategoryIcon } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import CreateCollectionForm from '@/features/manage-cubes/ui/CreateCollectionForm'
import { QUICK_START_CATEGORIES, quickStartCollection } from '@/features/manage-cubes/model/quickStartCollection'

export default function TimerQuickStart() {
  const t = useTranslations('Index.HomePage')
  const open = useOverlayStore((state) => state.open)
  const [pending, setPending] = useState(false)

  const start = (category: CubeCategory) => {
    if (pending) return
    setPending(true)
    quickStartCollection(category).catch((error) => {
      console.error(error)
      setPending(false)
    })
  }

  return (
    <div className="flex grow flex-col items-center justify-center gap-6" data-testid="timer-quick-start">
      <Nexi state="hello" size={96} aria-hidden />
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {QUICK_START_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            disabled={pending}
            onClick={() => start(category)}
            data-testid={`quick-start-${category}`}
            className="category-notch group flex w-24 flex-col items-center gap-2 p-3 disabled:opacity-60 sm:w-28 sm:p-4"
          >
            <span className="size-12 text-muted-foreground transition-colors group-hover:text-foreground sm:size-14">
              <CubeCategoryIcon category={category} />
            </span>
            <span className="text-xs font-medium sm:text-sm">{category}</span>
          </button>
        ))}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground"
        onClick={() => open({ id: 'create-cube', component: <CreateCollectionForm /> })}
      >
        <Plus />
        {t('quick-start-other')}
      </Button>
    </div>
  )
}
