import { useTranslations } from 'next-intl'
import type { CrossHint } from '@nexustimer/cube-solver-rs'
import { FACE_COLORS } from '@/shared/const/face-colors'
import { FaceGlyph } from '@/shared/ui/face-glyph/FaceGlyph'
import { Layers } from '@/shared/types/enums'
import { cn } from '@/shared/lib/utils'
import { CROSS_FACE_COLOR } from '@/features/timer/model/const'

interface CrossHintColorPickerProps {
  faces: CrossHint[] | null
  value: Layers
  onChange: (color: Layers) => void
}

export function CrossHintColorPicker({ faces, value, onChange }: CrossHintColorPickerProps) {
  const t = useTranslations('Index')

  return (
    <div
      role="group"
      aria-label={t('CrossHints.color')}
      className="grid grid-cols-6 gap-[3px] bg-muted p-[3px] dark:bg-muted/50"
    >
      {FACE_COLORS.map((color) => {
        const face = faces?.find((hint) => CROSS_FACE_COLOR[hint.face] === color)
        const count = face ? (face.cross ? face.cross.split(' ').length : 0) : null
        const selected = color === value

        return (
          <button
            key={color}
            type="button"
            aria-pressed={selected}
            aria-label={t(`MainColors.colors.${color}`)}
            onClick={() => onChange(color)}
            className={cn(
              'group flex cursor-pointer flex-col items-center gap-1 py-2 text-xs tabular-nums outline-none transition-colors focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring',
              selected
                ? 'menu-item bg-background font-medium text-foreground dark:bg-muted'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <FaceGlyph
              color={color}
              className={cn(
                'size-6 transition-opacity',
                selected ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
              )}
            />
            <span aria-hidden>{count ?? '·'}</span>
          </button>
        )
      })}
    </div>
  )
}
