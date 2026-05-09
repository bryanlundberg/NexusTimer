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
import { Layers3 } from 'lucide-react'

interface TrainerMethodSelectProps {
  value: string
  onChange: (slug: string) => void
}

export default function TrainerMethodSelect({ value, onChange }: TrainerMethodSelectProps) {
  const grouped = _.groupBy(ALGORITHM_SETS, 'puzzle')

  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
        <Layers3 className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-medium uppercase tracking-wider">Method</span>
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full sm:w-64">
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
    </div>
  )
}
