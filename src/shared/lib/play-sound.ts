import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'

/** Keyed by its own `settings.sounds` toggle, so the name is both the cue and the switch. */
const SOUNDS = {
  messageReceived: '/sounds/message-receipt.mp3',
  messageSent: '/sounds/message-sent.mp3',
  newFriend: '/sounds/new-friend.mp3'
} as const

export type SoundName = keyof typeof SOUNDS

// Matches the level `useAudioTrigger` loads its cues at
const SOUND_VOLUME = 0.25

/**
 * One-shot playback for something that happened, rather than for a state that turned true.
 * Best-effort: browsers reject it until the page has been interacted with, and that is fine.
 */
export function playSound(name: SoundName) {
  if (typeof window === 'undefined') return
  if (!useSettingsStore.getState().settings.sounds[name]) return

  const audio = new Audio(SOUNDS[name])
  audio.volume = SOUND_VOLUME
  void audio.play().catch(() => {})
}
