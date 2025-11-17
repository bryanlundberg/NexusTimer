export enum TimerMode {
  NORMAL = 'normal',
  MANUAL = 'manual',
  STACKMAT = 'stackmat',
  VIRTUAL = 'virtual',
  SMART_CUBE = 'smart-cube'
}

export enum TimerStatus {
  IDLE = 'IDLE',
  HOLDING = 'HOLDING',
  SOLVING = 'SOLVING',
  READY = 'READY',
  INSPECTING = 'INSPECTING',
  WAITING_NEXT_ROUND = 'WAITING_NEXT_ROUND'
}
