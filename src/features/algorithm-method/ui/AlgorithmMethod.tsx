import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import * as React from 'react'
import { Progress } from '@/components/ui/progress'
import { ALGORITHM_SET } from '@/shared/const/algorithms-sets'
import { useTranslations } from 'next-intl'

export default function AlgorithmMethod({ set }: { set: ALGORITHM_SET }) {
  const t = useTranslations('Index.AlgorithmsPage')
  const { slug, title, subtitle, puzzle, Icon, difficulty } = set
  return (
    <Link href={`/algorithms/${slug}`} className="focus:outline-none focus:ring-2 focus:ring-primary rounded-md">
      <Card className="h-full transition-all hover:bg-muted/50 hover:shadow-sm bg-card/50">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10 text-primary">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription>{subtitle}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge>{puzzle}</Badge>
          </div>
        </CardHeader>
        <div className={'flex flex-col gap-2'}>
          <div className={'flex flex-row justify-between items-center font-semibold text-xs px-6 '}>
            <div>{t('skill')}</div>
            <div className={'flex flex-row items-center gap-1'}>
              {difficulty === 1
                ? t('casual-enthusiast')
                : difficulty === 2
                  ? t('dedicated-learner')
                  : t('algorithm-master')}
            </div>
          </div>
          <CardContent className="flex flex-row gap-3">
            <Progress className={'grow'} value={difficulty >= 1 ? 100 : 0} />
            <Progress className={'grow'} value={difficulty >= 2 ? 100 : 0} />
            <Progress className={'grow'} value={difficulty >= 3 ? 100 : 0} />
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}
