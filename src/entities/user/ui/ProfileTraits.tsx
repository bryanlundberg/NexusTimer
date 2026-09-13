import { Layers } from '@/shared/types/enums'
import { FACE_COLORS, sortFaceColors } from '@/shared/const/face-colors'
import { isCubingMethod } from '@/shared/const/cubing-methods'
import { FaceGlyph } from '@/shared/ui/face-glyph/FaceGlyph'
import { MethodGlyph } from '@/shared/ui/method-glyph/MethodGlyph'
import { useMainColorsLabel, useMethodLabel } from '@/entities/user/model/useProfileTraitLabels'
import { cn } from '@/shared/lib/utils'

interface ProfileTraitsProps {
  method?: string
  mainColors?: Layers[]
  className?: string
}

export function ProfileTraits({ method, mainColors, className }: ProfileTraitsProps) {
  const methodLabel = useMethodLabel()
  const colors = sortFaceColors(mainColors)
  const colorsLabel = useMainColorsLabel(colors)
  const knownMethod = isCubingMethod(method) ? method : null

  if (!knownMethod && !colors.length) return null

  const isNeutral = colors.length === FACE_COLORS.length

  return (
    <div className={cn('flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap', className)}>
      {knownMethod && (
        <span className="flex items-center gap-2 shrink-0" title={methodLabel(knownMethod).steps}>
          <MethodGlyph method={knownMethod} />
          <span className="font-medium text-foreground/80">{methodLabel(knownMethod).name}</span>
        </span>
      )}
      {knownMethod && colors.length > 0 && <span className="opacity-50">·</span>}
      {colors.length > 0 && (
        <span className="flex items-center gap-1.5 min-w-0">
          <span className="flex items-center gap-1 shrink-0">
            {isNeutral ? <FaceGlyph color={colors} /> : colors.map((color) => <FaceGlyph key={color} color={color} />)}
          </span>
          <span className="truncate">{colorsLabel}</span>
        </span>
      )}
    </div>
  )
}
