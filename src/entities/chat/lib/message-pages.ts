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

export function appendMessage(pages: Pages, message: ChatMessage): MessagesPage[] {
  if (pages && hasMessage(pages, message._id)) return pages
  return updateNewestPage(pages, (messages) => [...messages, message])
}

export function receiveMessage(pages: Pages, message: ChatMessage, myId?: string): MessagesPage[] {
  if (pages && hasMessage(pages, message._id)) return pages

  const temp =
    message.senderId === myId
      ? flattenPages(pages).find((candidate) => candidate.pending && candidate.text === message.text)
      : undefined
  if (!temp) return appendMessage(pages, message)

  return (pages ?? []).map((page) => ({
    ...page,
    messages: page.messages.map((candidate) =>
      candidate._id === temp._id ? { ...message, clientKey: temp.clientKey ?? temp._id } : candidate
    )
  }))
}

export function confirmMessage(pages: Pages, tempId: string, saved: ChatMessage): MessagesPage[] {
  if (!pages || !hasMessage(pages, tempId)) return appendMessage(pages, saved)

  const alreadyDelivered = hasMessage(pages, saved._id)
  return pages.map((page) => ({
    ...page,
    messages: alreadyDelivered
      ? page.messages.filter((message) => message._id !== tempId)
      : page.messages.map((message) => (message._id === tempId ? { ...saved, clientKey: tempId } : message))
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

export function patchMessage(pages: Pages, id: string, patch: Partial<ChatMessage>): MessagesPage[] {
  return (pages ?? []).map((page) => ({
    ...page,
    messages: page.messages.map((message) => (message._id === id ? { ...message, ...patch } : message))
  }))
}

export function clearMessages(pages: Pages): MessagesPage[] {
  const [newest] = pages ?? []
  return [{ messages: [], hasMore: false, receipts: newest?.receipts ?? NO_RECEIPTS }]
}

export function removeMessage(pages: Pages, id: string): MessagesPage[] {
  return (pages ?? []).map((page) => ({ ...page, messages: page.messages.filter((message) => message._id !== id) }))
}
