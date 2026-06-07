import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useTranslations } from 'next-intl'
import { useQueryState } from 'nuqs'
import { STATES } from '@/shared/const/states'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { SearchIcon, XIcon } from 'lucide-react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export default function SearchSolvesDialog() {
  const t = useTranslations('Index')
  const [query, setQuery] = useQueryState(STATES.SOLVES_PAGE.QUERY.KEY, {
    defaultValue: STATES.SOLVES_PAGE.QUERY.DEFAULT_VALUE
  })
  const [value, setValue] = useState(query)
  const debouncedSetQuery = useDebouncedCallback((next: string) => setQuery(next), 300)

  const handleChange = (next: string) => {
    setValue(next)
    debouncedSetQuery(next)
  }

  const handleClear = () => {
    setValue('')
    setQuery('')
  }

  return (
    <DialogContent className="max-w-96 rounded-md">
      <VisuallyHidden>
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>Search</DialogDescription>
        </DialogHeader>
      </VisuallyHidden>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          autoFocus
          value={value}
          placeholder={t('SolvesPage.filter-by-time')}
          onChange={(e) => handleChange(e.target.value)}
          className="bg-background pl-9 pr-9"
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 size-7"
            onClick={handleClear}
          >
            <XIcon className="size-4" />
          </Button>
        )}
      </div>
    </DialogContent>
  )
}
