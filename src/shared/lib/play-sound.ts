export const SOUNDS = {
  messageReceived: '/sounds/message-receipt.mp3',
  messageSent: '/sounds/message-sent.mp3',
  newFriend: '/sounds/new-friend.mp3'
} as const

const SOUND_VOLUME = 0.25

export function playSound(src: string) {
  if (typeof window === 'undefined') return

  const audio = new Audio(src)
  audio.volume = SOUND_VOLUME
  void audio.play().catch(() => {})
}
