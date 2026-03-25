import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import * as React from 'react'
import { ALGORITHM_SET } from '@/shared/const/algorithms-sets'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'

export default function AlgorithmMethod({ set }: { set: ALGORITHM_SET }) {
  const t = useTranslations('Index.AlgorithmsPage')
  const { slug, title, subtitle, puzzle, Icon, difficulty, algorithms } = set

  const difficultyLabel =
    difficulty === 1 ? t('casual-enthusiast') : difficulty === 2 ? t('dedicated-learner') : t('algorithm-master')

  const difficultyColor =
    difficulty === 1
      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
      : difficulty === 2
        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
        : 'bg-red-500/15 text-red-600 dark:text-red-400'

  return (
    <Link href={`/algorithms/${slug}`} className="group focus:outline-none focus:ring-2 focus:ring-primary rounded-xl">
      <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/30 bg-card/50 group-hover:bg-muted/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
                <CardDescription className="text-xs mt-0.5">{subtitle}</CardDescription>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[11px] font-medium">
                {puzzle}
              </Badge>
              <span className="text-xs text-muted-foreground">{algorithms.length} algs</span>
            </div>
            <Badge variant="secondary" className={`text-[11px] font-medium border-0 ${difficultyColor}`}>
              {difficultyLabel}
            </Badge>
          </div>

          {/* Difficulty dots */}
          <div className="flex items-center gap-1.5 mt-3">
            {[1, 2, 3].map((level) => (
              <div
                key={level}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  level <= difficulty
                    ? difficulty === 1
                      ? 'bg-emerald-500'
                      : difficulty === 2
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
