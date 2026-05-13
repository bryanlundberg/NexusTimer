'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Dumbbell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTrainerStore } from '@/features/trainer/model/useTrainerStore'

interface TrainerCTAProps {
  methodSlug: string
  className?: string
}

export default function TrainerCTA({ methodSlug, className }: TrainerCTAProps) {
  const t = useTranslations('Index.TrainerPage.cta')
  const router = useRouter()
  const setMethod = useTrainerStore((s) => s.setMethod)

  const handleStart = () => {
    setMethod(methodSlug)
    router.push('/algorithms/trainer')
  }

  return (
    <Button size="sm" variant="default" onClick={handleStart} className={className}>
      <Dumbbell className="size-3.5" />
      {t('practiceNow')}
    </Button>
  )
}
