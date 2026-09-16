'use client'

import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { TimerStatus } from '@/features/timer/model/enums'
import { useFocusModeStore } from '@/features/focus-mode/model/useFocusModeStore'
import { useChatDockStore } from '@/features/chat/model/chat-dock-store'
import { isMessagesRoute } from '@/features/chat/model/useOpenChat'
import { useDockCapacity } from '@/features/chat/model/dock-capacity'
import { ChatWindow } from '@/widgets/chat-dock/ui/ChatWindow'

/** Windows opened from the header messages menu, desktop only. */
export function ChatDock() {
  const capacity = useDockCapacity()
  const { data: session } = useSession()
  const pathname = usePathname()
  const windows = useChatDockStore((state) => state.windows)
  const isFocusMode = useFocusModeStore((store) => store.isFocusMode)
  const isSolving = useTimerStore((store) => store.isSolving)
  const timerStatus = useTimerStore((store) => store.timerStatus)

  const hidden =
    windows.length === 0 ||
    capacity === 0 ||
    !session?.user?.id ||
    isMessagesRoute(pathname) ||
    isFocusMode ||
    isSolving ||
    timerStatus !== TimerStatus.IDLE

  if (hidden) return null

  return (
    <div className="pointer-events-none fixed right-4 bottom-0 z-40 flex items-end gap-2">
      {windows
        .slice(0, capacity)
        .toReversed()
        .map((dockWindow) => (
          <ChatWindow key={dockWindow.chatId} {...dockWindow} />
        ))}
    </div>
  )
}
