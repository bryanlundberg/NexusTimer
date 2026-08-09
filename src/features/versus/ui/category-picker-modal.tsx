'use client'
import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CubeCategoryIcon } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { cn } from '@/shared/lib/utils'
import { VERSUS_CATEGORIES, VersusCategory } from '@/features/versus/model/types'
import { useVersusStore } from '@/features/versus/model/useVersusStore'

export default function CategoryPickerModal() {
  const t = useTranslations('VersusPage')
  const category = useVersusStore((state) => state.category)
  const setCategory = useVersusStore((state) => state.setCategory)
  const close = useOverlayStore((state) => state.close)

  const handleSelect = (name: VersusCategory) => {
    setCategory(name)
    close()
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{t('category-modal.title')}</DialogTitle>
        <DialogDescription>{t('category-modal.description')}</DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-3 gap-3">
        {VERSUS_CATEGORIES.map((name) => {
          const isActive = name === category

          return (
            <button
              key={name}
              type="button"
              data-testid={`versus-category-${name}`}
              onClick={() => handleSelect(name)}
              className={cn(
                'group relative flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors cursor-pointer',
                isActive ? 'border-primary bg-primary/10' : 'border-border bg-muted/30 hover:bg-accent'
              )}
            >
              {isActive && <Check className="absolute right-2 top-2 size-4 text-primary" />}
              <span
                className={cn(
                  'size-12 transition-[transform,color] duration-150 motion-reduce:transform-none',
                  isActive
                    ? 'text-primary scale-105'
                    : 'text-muted-foreground group-hover:text-foreground group-hover:scale-105'
                )}
              >
                <CubeCategoryIcon category={name} title={name} />
              </span>
              <span className="w-full truncate text-center text-sm font-medium">{name}</span>
            </button>
          )
        })}
      </div>
    </DialogContent>
  )
}
