'use client'

import { useTranslations } from 'next-intl'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { cn } from '@/shared/lib/utils'
import { useActiveChatStore } from '@/features/chat/model/active-chat-store'
import { InboxList } from '@/widgets/chat/ui/InboxList'

/** Inbox and conversation scroll on their own: side by side on desktop, one at a time on mobile. */
export function MessagesShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Index.ChatPage')
  const activeChatId = useActiveChatStore((state) => state.activeChatId)

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0">
        <CoreHeader breadcrumbs={[{ label: t('title'), href: '/messages' }]} />
      </div>

      <div className="flex min-h-0 flex-1">
        <aside
          className={cn(
            'min-h-0 w-full flex-col bg-card/40 md:flex md:w-80 md:shrink-0 md:border-r md:border-border/60 xl:w-96',
            activeChatId ? 'hidden' : 'flex'
          )}
        >
          <InboxList activeChatId={activeChatId} />
        </aside>

        <section className={cn('min-h-0 min-w-0 flex-1 flex-col md:flex', activeChatId ? 'flex' : 'hidden')}>
          {children}
        </section>
      </div>
    </div>
  )
}
