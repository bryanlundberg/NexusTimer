import { useTranslations } from 'next-intl'
import { Lightbulb } from 'lucide-react'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { CROSS_FACE_COLOR, XCROSS_SLOTS } from '@/features/timer/model/const'
import { useCrossHintStore } from '@/features/timer/model/useCrossHintStore'
import { CrossHintColorPicker } from '@/features/timer/ui/CrossHintColorPicker'
import { CrossHintRow } from '@/features/timer/ui/CrossHintRow'

export default function DrawerHintPanel() {
  const t = useTranslations('Index.CrossHints')
  const hint = useTimerStore((state) => state.hint)
  const scramble = useTimerStore((state) => state.scramble)
  const color = useCrossHintStore((state) => state.color)
  const setColor = useCrossHintStore((state) => state.setColor)

  const faces = hint && hint.scramble === scramble ? hint.faces : null
  const selected = faces?.find((face) => CROSS_FACE_COLOR[face.face] === color) ?? null

  return (
    <DialogContent className="sm:max-w-[560px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Lightbulb className="size-4" />
          {t('title')}
        </DialogTitle>
        <DialogDescription className="text-start">{t('orientation')}</DialogDescription>
      </DialogHeader>

      <CrossHintColorPicker faces={faces} value={color} onChange={setColor} />

      {selected ? (
        <div className="grid gap-0.5">
          <CrossHintRow icon="cross" label={t('cross')} rotation={selected.rotation} moves={selected.cross} />
          {XCROSS_SLOTS.map((slot, index) => (
            <CrossHintRow
              key={slot.label}
              icon="xcross"
              iconClassName={slot.iconClassName}
              label={slot.label}
              rotation={selected.rotation}
              moves={selected.xcross[index]}
            />
          ))}
        </div>
      ) : (
        <p role="status" className="py-6 text-center text-sm text-muted-foreground motion-safe:animate-pulse">
          {t('calculating')}
        </p>
      )}
    </DialogContent>
  )
}
