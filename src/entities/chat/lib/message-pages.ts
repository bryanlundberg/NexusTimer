import { NO_RECEIPTS, type ChatMessage, type MessagesPage } from '@/entities/chat/model/types'

/** Pages as stored by useSWRInfinite: index 0 is the newest page, each page is oldest to newest. */
type Pages = MessagesPage[] | undefined

const hasMessage = (pages: MessagesPage[], id: string) =>
  pages.some((page) => page.messages.some((message) => message._id === id))

const updateNewestPage = (pages: Pages, update: (messages: ChatMessage[]) => ChatMessage[]): MessagesPage[] => {
  const [newest = { messages: [], hasMore: false, receipts: NO_RECEIPTS }, ...older] = pages ?? []
  return [{ ...newest, messages: update(newest.messages) }, ...older]
}

export function flattenPages(pages: Pages): ChatMessage[] {
  return (pages ?? []).toReversed().flatMap((page) => page.messages)
}

/** Appends a message unless it is already there (realtime echoes of our own sends). */
export function appendMessage(pages: Pages, message: ChatMessage): MessagesPage[] {
  if (pages && hasMessage(pages, message._id)) return pages
  return updateNewestPage(pages, (messages) => [...messages, message])
}

/** If the realtime event already delivered the saved message, the optimistic copy is dropped. */
export function confirmMessage(pages: Pages, tempId: string, saved: ChatMessage): MessagesPage[] {
  // A revalidation may have replaced the pages while the request was in flight
  if (!pages || !hasMessage(pages, tempId)) return appendMessage(pages, saved)

  const alreadyDelivered = hasMessage(pages, saved._id)
  return pages.map((page) => ({
    ...page,
    messages: alreadyDelivered
      ? page.messages.filter((message) => message._id !== tempId)
      : page.messages.map((message) => (message._id === tempId ? saved : message))
  }))
}

export function failMessage(pages: Pages, tempId: string): MessagesPage[] {
  return (pages ?? []).map((page) => ({
    ...page,
    messages: page.messages.map((message) =>
      message._id === tempId ? { ...message, pending: false, failed: true } : message
    )
  }))
}

export function removeMessage(pages: Pages, id: string): MessagesPage[] {
  return (pages ?? []).map((page) => ({ ...page, messages: page.messages.filter((message) => message._id !== id) }))
}
