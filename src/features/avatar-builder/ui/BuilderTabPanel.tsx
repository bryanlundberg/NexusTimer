import { useTranslations } from 'next-intl'
import type { NexiRecipe } from '@nexustimer/contracts'
import {
  BACKGROUND_COLORS,
  BODY_COLORS,
  SHAPE_LABELS,
  SLOT_MESSAGES,
  SLOT_OPTIONS,
  type BuilderTab
} from '../model/nexiOptions'
import { ColorSwatches } from './ColorSwatches'
import { CustomColorInput } from './CustomColorInput'
import { OptionGrid } from './OptionGrid'

interface BuilderTabPanelProps {
  tab: BuilderTab
  recipe: NexiRecipe
  onChange: <K extends keyof NexiRecipe>(slot: K, value: NexiRecipe[K]) => void
}

export function BuilderTabPanel({ tab, recipe, onChange }: BuilderTabPanelProps) {
  const t = useTranslations('Index.AvatarBuilder')

  if (tab === 'shape') {
    const options = SLOT_OPTIONS.shape.map((value) => ({ value, label: SHAPE_LABELS[value] }))
    return <OptionGrid slot="shape" recipe={recipe} options={options} onChange={onChange} />
  }

  if (tab === 'color') {
    const options = BODY_COLORS.map(({ id, hex }) => ({ value: hex, label: t(`colors.${id}`) }))
    return (
      <div className="flex flex-col gap-3">
        <OptionGrid slot="color" recipe={recipe} options={options} onChange={onChange} />
        <CustomColorInput
          label={t('custom-color')}
          value={recipe.color}
          selected={!BODY_COLORS.some(({ hex }) => hex === recipe.color)}
          onChange={(hex) => onChange('color', hex)}
        />
      </div>
    )
  }

  if (tab === 'background') {
    const swatches = BACKGROUND_COLORS.map(({ id, hex }) => ({ hex, label: t(`backgrounds.${id}`) }))
    const patterns = SLOT_OPTIONS.pattern.map((value) => ({ value, label: t(`patterns.${value}`) }))
    return (
      <div className="flex flex-col gap-4">
        <section className="flex flex-col gap-2">
          <h3 className="text-xs font-medium text-muted-foreground">{t('background-color')}</h3>
          <ColorSwatches swatches={swatches} value={recipe.bg} onChange={(hex) => onChange('bg', hex)} />
          <CustomColorInput
            label={t('custom-color')}
            value={recipe.bg}
            selected={!BACKGROUND_COLORS.some(({ hex }) => hex === recipe.bg)}
            onChange={(hex) => onChange('bg', hex)}
          />
        </section>
        <section className="flex flex-col gap-2">
          <h3 className="text-xs font-medium text-muted-foreground">{t('background-pattern')}</h3>
          <OptionGrid slot="pattern" recipe={recipe} options={patterns} onChange={onChange} />
        </section>
      </div>
    )
  }

  const options = SLOT_OPTIONS[tab].map((value) => ({ value, label: t(`${SLOT_MESSAGES[tab]}.${value}`) }))
  return <OptionGrid slot={tab} recipe={recipe} options={options} onChange={onChange} />
}
