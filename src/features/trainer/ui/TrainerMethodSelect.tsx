'use client'

import _ from 'lodash'
import { useTranslations } from 'next-intl'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'

interface TrainerMethodSelectProps {
  value: string
  onChange: (slug: string) => void
}

export default function TrainerMethodSelect({ value, onChange }: TrainerMethodSelectProps) {
  const t = useTranslations('Index.TrainerPage')
  const grouped = _.groupBy(ALGORITHM_SETS, 'puzzle')

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-full sm:w-48 text-xs">
        <SelectValue placeholder={t('chooseMethod')} />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(grouped).map(([puzzle, sets]) => (
          <SelectGroup key={puzzle}>
            <SelectLabel>{puzzle}</SelectLabel>
            {sets.map((set) => (
              <SelectItem key={set.slug} value={set.slug}>
                <span className="font-medium">{set.title}</span>
                <span className="text-muted-foreground text-xs ml-2">
                  {t('algsSuffix', { count: set.algorithms.length })}
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}
