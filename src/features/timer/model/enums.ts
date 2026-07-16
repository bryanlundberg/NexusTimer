export enum TimerMode {
  NORMAL = 'normal',
  MANUAL = 'manual',
  STACKMAT = 'stackmat',
  STACKMAT_BLUETOOTH = 'stackmat-bluetooth',
  VIRTUAL = 'virtual',
  SMART_CUBE = 'smart-cube',
  NEXUS_CONNECT = 'nexus-connect',
  KEYBOARD_STACKMAT = 'keyboard-stackmat'
}

export enum TimerStatus {
  IDLE = 'IDLE',
  HOLDING = 'HOLDING',
  SOLVING = 'SOLVING',
  READY = 'READY',
  INSPECTING = 'INSPECTING',
  WAITING_NEXT_ROUND = 'WAITING_NEXT_ROUND'
}
