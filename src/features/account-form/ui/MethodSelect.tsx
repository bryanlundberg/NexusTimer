import { useTranslations } from 'next-intl'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CUBING_METHODS, type CubingMethod, isCubingMethod } from '@/shared/const/cubing-methods'
import { MethodGlyph } from '@/shared/ui/method-glyph/MethodGlyph'
import { useMethodLabel } from '@/entities/user/model/useProfileTraitLabels'
import { FieldClearButton } from '@/features/account-form/ui/FieldClearButton'
import { FieldClearSlot } from '@/features/account-form/ui/FieldClearSlot'

interface MethodSelectProps {
  id?: string
  value?: string
  onChange: (method: CubingMethod | '') => void
  clearLabel: string
}

export function MethodSelect({ id, value, onChange, clearLabel }: MethodSelectProps) {
  const t = useTranslations('Index.CubingMethod')
  const methodLabel = useMethodLabel()
  const selected = isCubingMethod(value) ? value : null

  return (
    <div className="relative">
      <Select value={selected ?? ''} onValueChange={(next) => isCubingMethod(next) && onChange(next)}>
        <SelectTrigger id={id} className="w-full h-10">
          <span className="flex flex-1 items-center gap-2.5 min-w-0">
            <MethodGlyph method={selected} />
            <SelectValue placeholder={t('placeholder')} className="flex min-w-0 items-baseline gap-2">
              {selected && (
                <>
                  <span className="shrink-0">{methodLabel(selected).name}</span>
                  <span className="truncate text-xs text-muted-foreground">{methodLabel(selected).steps}</span>
                </>
              )}
            </SelectValue>
          </span>
          {selected && <FieldClearSlot />}
        </SelectTrigger>
        <SelectContent>
          {CUBING_METHODS.map((method) => {
            const { name, steps } = methodLabel(method)
            return (
              <SelectItem key={method} value={method}>
                <span className="flex min-w-0 items-center gap-2.5">
                  <MethodGlyph method={method} />
                  <span className="font-medium">{name}</span>
                  <span className="truncate text-xs text-muted-foreground">{steps}</span>
                </span>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
      {selected && <FieldClearButton label={clearLabel} onClear={() => onChange('')} />}
    </div>
  )
}
