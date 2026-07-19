'use client'

import { Lightbulb } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import SuggestAlgorithmModal from './SuggestAlgorithmModal'
import type { SuggestMethodOption } from '../model/types'

type Props = {
  methods: SuggestMethodOption[]
  initialSlug?: string
}

export default function SuggestAlgorithmButton({ methods, initialSlug }: Props) {
  const { open } = useOverlayStore()
  const t = useTranslations('Index.AlgorithmsPage.suggest')

  return (
    <button
      type="button"
      onClick={() =>
        open({
          id: 'suggest-algorithm',
          component: <SuggestAlgorithmModal methods={methods} initialSlug={initialSlug} />
        })
      }
      className="leading-7 text-background-foreground hover:underline flex items-center justify-center gap-2 text-sm w-fit cursor-pointer"
    >
      <Lightbulb size={16} />
      {t('button')}
    </button>
  )
}
