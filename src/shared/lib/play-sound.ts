import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'

const SOUNDS = {
  messageReceived: '/sounds/message-receipt.mp3',
  messageSent: '/sounds/message-sent.mp3',
  newFriend: '/sounds/new-friend.mp3'
} as const

export type SoundName = keyof typeof SOUNDS

const SOUND_VOLUME = 0.25

export function playSound(name: SoundName) {
  if (typeof window === 'undefined') return
  if (!useSettingsStore.getState().settings.sounds[name]) return

  const audio = new Audio(SOUNDS[name])
  audio.volume = SOUND_VOLUME
  void audio.play().catch(() => {})
}
