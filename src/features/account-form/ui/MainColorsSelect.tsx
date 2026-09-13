import { useTranslations } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { FACE_COLORS, sortFaceColors } from '@/shared/const/face-colors'
import { FaceGlyph } from '@/shared/ui/face-glyph/FaceGlyph'
import { Layers } from '@/shared/types/enums'
import { useMainColorsLabel } from '@/entities/user/model/useProfileTraitLabels'
import { cn } from '@/shared/lib/utils'
import { FieldClearButton } from '@/features/account-form/ui/FieldClearButton'
import { FieldClearSlot } from '@/features/account-form/ui/FieldClearSlot'

interface MainColorsSelectProps {
  id?: string
  value?: Layers[]
  onChange: (colors: Layers[]) => void
  clearLabel: string
}

const stayOpen = (event: Event) => event.preventDefault()

export function MainColorsSelect({ id, value, onChange, clearLabel }: MainColorsSelectProps) {
  const t = useTranslations('Index.MainColors')
  const selected = sortFaceColors(value)
  const isNeutral = selected.length === FACE_COLORS.length
  const label = useMainColorsLabel(selected)

  const toggle = (color: Layers, checked: boolean) =>
    onChange(sortFaceColors(checked ? [...selected, color] : selected.filter((c) => c !== color)))

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            id={id}
            type="button"
            className="field-notch field-notch-hover flex h-10 w-full items-center justify-between gap-2 px-3 text-sm outline-none"
          >
            <span className="flex min-w-0 flex-1 items-center gap-2">
              {isNeutral || !selected.length ? (
                <FaceGlyph color={selected} />
              ) : (
                <span className="flex shrink-0 items-center gap-1">
                  {selected.map((color) => (
                    <FaceGlyph key={color} color={color} className="animate-in fade-in zoom-in-50 duration-200" />
                  ))}
                </span>
              )}
              <span className={cn('truncate', !label && 'text-muted-foreground')}>{label ?? t('placeholder')}</span>
            </span>
            {selected.length > 0 && <FieldClearSlot />}
            <ChevronDown className="size-4 shrink-0 opacity-50" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width)">
          <DropdownMenuCheckboxItem
            checked={isNeutral}
            onCheckedChange={(checked) => onChange(checked ? [...FACE_COLORS] : [])}
            onSelect={stayOpen}
            className="group"
          >
            <FaceGlyph
              color={FACE_COLORS}
              className="transition-transform duration-150 group-data-[highlighted]:scale-125 motion-reduce:transition-none"
            />
            {t('neutral')}
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />

          {FACE_COLORS.map((color) => (
            <DropdownMenuCheckboxItem
              key={color}
              checked={selected.includes(color)}
              onCheckedChange={(checked) => toggle(color, checked)}
              onSelect={stayOpen}
              className="group"
            >
              <FaceGlyph
                color={color}
                className="transition-transform duration-150 group-data-[highlighted]:scale-125 motion-reduce:transition-none"
              />
              {t(`colors.${color}`)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {selected.length > 0 && <FieldClearButton label={clearLabel} onClear={() => onChange([])} />}
    </div>
  )
}
