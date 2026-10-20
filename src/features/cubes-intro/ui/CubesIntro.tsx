'use client'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { useCubesIntroStore } from '@/features/cubes-intro/model/useCubesIntroStore'

export default function CubesIntro() {
  const t = useTranslations('Index.CubesIntro')
  const seen = useCubesIntroStore((state) => state.seen)
  const markSeen = useCubesIntroStore((state) => state.markSeen)

  if (seen) return null

  return (
    <div className="surface surface-panel flex flex-col items-start gap-2.5 p-3" role="note">
      <p className="text-sm leading-relaxed text-pretty">{t('content')}</p>
      <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs" onClick={markSeen}>
        {t('cta')}
      </Button>
    </div>
  )
}
