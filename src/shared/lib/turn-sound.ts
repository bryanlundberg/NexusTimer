import type { TurnLanding } from '@nexustimer/cubelet/webgl'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'

const SPRITE_URL = '/sounds/cube-turns.m4a'
const VOLUME = 0.35
const MIN_GAP_SECONDS = 0.008
const PITCH_JITTER = 0.04
const VOLUME_JITTER = 0.2

const CLIP_COUNT = 36
const FIRST_CLIP = 0.3
const CLIP_STRIDE = 0.28
const CLIP_LENGTH = 0.2

let context: AudioContext | null = null
let output: AudioNode | null = null
let sprite: Promise<AudioBuffer | null> | null = null
let lastClip = -1
let lastStart = 0

const audioContext = (): AudioContext | null => {
  if (typeof window === 'undefined' || typeof AudioContext === 'undefined') return null
  context ??= new AudioContext()
  return context
}

const limitedOutput = (audio: AudioContext): AudioNode => {
  if (output) return output
  const limiter = audio.createDynamicsCompressor()
  limiter.threshold.value = -12
  limiter.knee.value = 6
  limiter.ratio.value = 12
  limiter.attack.value = 0.002
  limiter.release.value = 0.12
  limiter.connect(audio.destination)
  output = limiter
  return limiter
}

const loadSprite = (audio: AudioContext): Promise<AudioBuffer | null> => {
  sprite ??= fetch(SPRITE_URL)
    .then((response) => (response.ok ? response.arrayBuffer() : Promise.reject(new Error(response.statusText))))
    .then((bytes) => audio.decodeAudioData(bytes))
    .catch(() => {
      sprite = null
      return null
    })
  return sprite
}

const enabled = () => useSettingsStore.getState().settings.sounds.cubeTurns

const jitter = (amount: number) => 1 + (Math.random() * 2 - 1) * amount

const pickClip = (): number => {
  let clip = Math.floor(Math.random() * CLIP_COUNT)
  if (clip === lastClip) clip = (clip + 1) % CLIP_COUNT
  lastClip = clip
  return clip
}

export function preloadTurnSound(): void {
  if (!enabled()) return
  const audio = audioContext()
  if (audio) void loadSprite(audio)
}

const DOUBLE_GAP_SECONDS = 0.06
const DOUBLE_FIRST_GAIN = 0.55
const BRISK_TURN_MS = 200
const SLOW_TURN_MS = 450
const SLOW_TURN_LEVEL = 0.4

const levelFor = (duration: number): number => {
  const slowness = Math.min(Math.max((duration - BRISK_TURN_MS) / (SLOW_TURN_MS - BRISK_TURN_MS), 0), 1)
  return 1 - (1 - SLOW_TURN_LEVEL) * slowness
}

const playClip = (audio: AudioContext, buffer: AudioBuffer, when: number, level: number): void => {
  const source = audio.createBufferSource()
  source.buffer = buffer
  source.playbackRate.value = jitter(PITCH_JITTER)
  const gain = audio.createGain()
  gain.gain.value = VOLUME * level * jitter(VOLUME_JITTER)
  source.connect(gain).connect(limitedOutput(audio))
  source.start(when, FIRST_CLIP + pickClip() * CLIP_STRIDE, CLIP_LENGTH)
}

export function playTurnSound({ double, duration }: TurnLanding): void {
  if (!enabled()) return
  const audio = audioContext()
  if (!audio) return
  if (audio.state === 'suspended') void audio.resume().catch(() => {})
  void loadSprite(audio).then((buffer) => {
    if (!buffer || audio.state !== 'running') return
    const now = audio.currentTime
    if (now - lastStart < MIN_GAP_SECONDS) return
    lastStart = now
    const level = levelFor(duration)
    if (!double) {
      playClip(audio, buffer, now, level)
      return
    }
    playClip(audio, buffer, now, level * DOUBLE_FIRST_GAIN)
    playClip(audio, buffer, now + DOUBLE_GAP_SECONDS, level)
  })
}
