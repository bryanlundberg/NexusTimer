'use client'

import _ from 'lodash'
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
  const grouped = _.groupBy(ALGORITHM_SETS, 'puzzle')

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-full sm:w-56 text-xs">
        <SelectValue placeholder="Choose a method" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(grouped).map(([puzzle, sets]) => (
          <SelectGroup key={puzzle}>
            <SelectLabel>{puzzle}</SelectLabel>
            {sets.map((set) => (
              <SelectItem key={set.slug} value={set.slug}>
                <span className="font-medium">{set.title}</span>
                <span className="text-muted-foreground text-xs ml-2">{set.algorithms.length} algs</span>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}
