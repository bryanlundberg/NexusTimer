import { useTranslations } from 'next-intl'
import { Layers } from '@/shared/types/enums'
import { FACE_COLORS } from '@/shared/const/face-colors'
import { type CubingMethod, METHOD_SPECS } from '@/shared/const/cubing-methods'

export function useMainColorsLabel(colors: readonly Layers[]) {
  const t = useTranslations('Index.MainColors')
  if (!colors.length) return null
  if (colors.length === FACE_COLORS.length) return t('neutral')
  return colors.map((color) => t(`colors.${color}`)).join(' / ')
}

export function useMethodLabel() {
  const t = useTranslations('Index.CubingMethod')
  return (method: CubingMethod) => {
    const { name, steps } = METHOD_SPECS[method]
    return {
      name: name ?? t(method),
      steps: steps ? steps.join(' · ') : t(`${method}-steps`)
    }
  }
}
