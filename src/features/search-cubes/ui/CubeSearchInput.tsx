import { useRef } from 'react'
import { Input } from '@/components/ui/input'
import { useTypeToSearch } from '@/features/search-cubes/model/useTypeToSearch'
import { X } from 'lucide-react'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useTranslations } from 'next-intl'

interface CubeSearchInputProps {
  value: string
  onChange: (value: string) => void
}

export default function CubeSearchInput({ value, onChange }: CubeSearchInputProps) {
  const t = useTranslations('Index.Inputs')
  const inputRef = useRef<HTMLInputElement>(null)
  useTypeToSearch(inputRef)

  return (
    <div className="relative group flex-1 min-w-0">
      <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 z-[2] -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
      <Input
        ref={inputRef}
        type="search"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        aria-label={t('search')}
        placeholder={t('search')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur()
          if (e.key === 'Escape' && value) {
            e.preventDefault()
            onChange('')
          }
        }}
        className="h-9 w-full appearance-none pr-10 pl-9 pointer-coarse:h-10 [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          aria-label={t('clear')}
          onClick={() => onChange('')}
          className="absolute right-1 top-1/2 z-[2] grid size-8 -translate-y-1/2 place-items-center text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}
