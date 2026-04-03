export interface TimerState {
  timeMs: number
  running: boolean
  leftHand: boolean
  rightHand: boolean
  greenLight: boolean
  connected: boolean
  signalHeader: string
  noise: number
}

export interface HardwareAdapter<TOptions = unknown> {
  connect(options?: TOptions): Promise<void>
  disconnect(): void
  onState(callback: (state: TimerState) => void): void
}

export const DEFAULT_TIMER_STATE: TimerState = {
  timeMs: 0,
  running: false,
  leftHand: false,
  rightHand: false,
  greenLight: false,
  connected: false,
  signalHeader: 'I',
  noise: 1
}
