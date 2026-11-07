import { useMemo } from 'react'
import type { RoomChatMessage } from '@nexustimer/contracts'
import { useBlocks } from '@/entities/block/model/useBlocks'
import { useRoomStore } from '@/features/free-play-room/model/useRoomStore'

const EMPTY: RoomChatMessage[] = []

export function useRoomChatMessages(selfId: string | undefined) {
  const chat = useRoomStore((state) => state.room?.chat ?? EMPTY)
  const chatReadId = useRoomStore((state) => state.chatReadId)
  const { data: blocks } = useBlocks()

  const messages = useMemo(() => {
    const blocked = new Set(blocks?.blocked.map((entry) => entry.user._id))
    return blocked.size ? chat.filter((message) => !blocked.has(message.userId)) : chat
  }, [chat, blocks])

  const unread = useMemo(
    () => messages.filter((message) => message.id > chatReadId && message.userId !== selfId).length,
    [messages, chatReadId, selfId]
  )

  return { messages, unread }
}
