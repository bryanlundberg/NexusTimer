'use client'

import { useTranslations } from 'next-intl'

export function TypingIndicator() {
  const t = useTranslations('Index.ChatPage')

  return (
    <div role="status" className="flex items-center gap-1 border border-border/60 bg-muted/50 px-3 py-2.5">
      <span className="sr-only">{t('typing')}</span>
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          aria-hidden
          className="size-1.5 rounded-full bg-muted-foreground motion-safe:animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  )
}
