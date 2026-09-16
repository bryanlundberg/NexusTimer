'use client'

import { useLocale, useTranslations } from 'next-intl'
import { EmojiPicker as Frimousse, type Locale } from 'frimousse'
import { cn } from '@/shared/lib/utils'

const EMOJI_LOCALES = new Set<string>([
  'bn',
  'da',
  'de',
  'en',
  'en-gb',
  'es',
  'es-mx',
  'et',
  'fi',
  'fr',
  'hi',
  'hu',
  'it',
  'ja',
  'ko',
  'lt',
  'ms',
  'nb',
  'nl',
  'pl',
  'pt',
  'ru',
  'sv',
  'th',
  'uk',
  'vi',
  'zh',
  'zh-hant'
])

/** Locales the emoji catalogue does not ship (`fil`, `id`) fall back to English labels. */
const toEmojiLocale = (locale: string): Locale => (EMOJI_LOCALES.has(locale) ? (locale as Locale) : 'en')

interface Props {
  onSelect: (emoji: string) => void
  className?: string
}

/**
 * The emoji catalogue is fetched on demand the first time this mounts, so it never
 * weighs on the initial bundle.
 */
export function EmojiPicker({ onSelect, className }: Props) {
  const t = useTranslations('Index.ChatPage')
  const locale = useLocale()

  return (
    <Frimousse.Root
      locale={toEmojiLocale(locale)}
      columns={8}
      onEmojiSelect={({ emoji }) => onSelect(emoji)}
      className={cn('isolate flex h-72 w-full flex-col', className)}
    >
      <Frimousse.Search
        placeholder={t('emoji-search')}
        aria-label={t('emoji-search')}
        className="mx-1.5 mt-1.5 h-8 shrink-0 rounded-md border border-border/60 bg-muted/40 px-2.5 text-sm outline-hidden focus-visible:border-[color-mix(in_oklab,var(--primary)_45%,var(--border))]"
      />

      <Frimousse.Viewport className="relative flex-1 outline-hidden">
        <Frimousse.Loading className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          {t('emoji-loading')}
        </Frimousse.Loading>
        <Frimousse.Empty className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          {t('emoji-empty')}
        </Frimousse.Empty>

        <Frimousse.List
          className="pb-1.5 select-none"
          components={{
            CategoryHeader: ({ category, ...props }) => (
              <div
                {...props}
                className="bg-popover px-2.5 pt-2.5 pb-1 font-display text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase"
              >
                {category.label}
              </div>
            ),
            Row: ({ children, ...props }) => (
              <div {...props} className="scroll-my-1.5 px-1.5">
                {children}
              </div>
            ),
            Emoji: ({ emoji, ...props }) => (
              <button
                {...props}
                className="flex size-8 items-center justify-center rounded-md text-xl data-[active]:bg-muted"
              >
                {emoji.emoji}
              </button>
            )
          }}
        />
      </Frimousse.Viewport>
    </Frimousse.Root>
  )
}
