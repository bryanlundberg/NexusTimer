import type { ClipboardEvent, KeyboardEvent } from 'react'
import { Control, useController } from 'react-hook-form'
import { Reorder, useDragControls } from 'motion/react'
import { useTranslations } from 'next-intl'
import { GripVertical, Link2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AccountInfoForm } from '@/features/account-form/model/types'
import { normalizeProfileLink, parseProfileLink } from '@/shared/lib/profile-links'
import { splitPastedTokens } from '@/shared/lib/find-move'
import { platformTextColor } from '@/shared/const/platform-brand'
import { PlatformIcon } from '@/shared/ui/brand-icons/PlatformIcon'
import { cn } from '@/shared/lib/utils'

const iconClass = 'pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2'

interface ProfileLinkRowProps {
  id: string
  control: Control<AccountInfoForm>
  index: number
  count: number
  onRemove: () => void
  onMove: (from: number, to: number) => void
  onPasteLinks: (index: number, links: string[], replaceCurrent: boolean) => void
}

export function ProfileLinkRow({ id, control, index, count, onRemove, onMove, onPasteLinks }: ProfileLinkRowProps) {
  const t = useTranslations('Index.ProfileLinks')
  const dragControls = useDragControls()
  const { field, fieldState } = useController({ control, name: `links.${index}.url` })
  const info = field.value ? parseProfileLink(field.value) : null
  const invalid = !!fieldState.error && fieldState.isTouched

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const links = splitPastedTokens(event.clipboardData.getData('text')).filter((token) => normalizeProfileLink(token))
    const isEmpty = !(field.value ?? '').trim()
    if (!links.length || (links.length === 1 && !isEmpty)) return
    event.preventDefault()
    onPasteLinks(index, links, isEmpty)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const to = event.key === 'ArrowUp' ? index - 1 : event.key === 'ArrowDown' ? index + 1 : null
    if (to === null || to < 0 || to >= count) return
    event.preventDefault()
    onMove(index, to)
  }

  return (
    <Reorder.Item
      value={id}
      dragListener={false}
      dragControls={dragControls}
      whileDrag={{ scale: 1.015 }}
      className="relative list-none"
    >
      <div className="flex items-center gap-1">
        {count > 1 && (
          <button
            type="button"
            aria-label={t('reorder')}
            title={t('reorder')}
            onPointerDown={(event) => dragControls.start(event)}
            onKeyDown={handleKeyDown}
            className="grid h-10 w-7 shrink-0 cursor-grab touch-none place-items-center text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 active:cursor-grabbing"
          >
            <GripVertical className="size-4" />
          </button>
        )}

        <div className="relative flex-1 min-w-0">
          <Input
            {...field}
            value={field.value ?? ''}
            onPaste={handlePaste}
            placeholder={t('placeholder')}
            aria-label={t('label')}
            aria-invalid={invalid}
            inputMode="url"
            autoComplete="url"
            autoCapitalize="none"
            spellCheck={false}
            className={cn('peer h-10 pl-9', info?.handle && 'pr-32')}
          />
          {info ? (
            <PlatformIcon
              key={info.platform ?? 'web'}
              platform={info.platform}
              branded
              className={cn(iconClass, 'text-foreground animate-in fade-in zoom-in-50 duration-200')}
            />
          ) : (
            <Link2 aria-hidden className={cn(iconClass, 'text-muted-foreground')} />
          )}
          {info?.platform && info.handle && (
            <span
              key={info.handle}
              className="pointer-events-none absolute right-3 top-1/2 z-[2] max-w-28 -translate-y-1/2 truncate text-xs font-medium animate-in fade-in slide-in-from-right-1 duration-200"
              style={{ color: platformTextColor(info.platform) }}
            >
              {info.handle}
            </span>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t('remove')}
          onClick={onRemove}
          className="size-10 shrink-0 text-muted-foreground hover:text-destructive"
        >
          <X className="size-4" />
        </Button>
      </div>
      {invalid && (
        <p className={cn('mt-1 text-destructive text-xs font-medium', count > 1 && 'pl-8')}>{t('invalid')}</p>
      )}
    </Reorder.Item>
  )
}
