import type { HardwareAdapter, TimerState } from '../types'
import { initCstimerRuntime, loadVendorScript, type CstimerRuntimeOptions } from '../runtime/cstimerRuntime'

// ─── cstimer internal types (mirrors stackmat.js return value) ────────────────

interface CstimerStackmatState {
  time_milli: number
  unit: number
  on: boolean
  greenLight: boolean
  leftHand: boolean
  rightHand: boolean
  running: boolean
  unknownRunning: boolean
  signalHeader: string
  noise: number
  power: number
}

interface CstimerStackmat {
  init(timer: string, deviceId?: string, force?: boolean): Promise<void>
  stop(): void
  updateInputDevices(): Promise<Array<[string, string]>>
  getSample(duration: number, callback: (data: unknown) => void): void
  setCallBack(fn: (state: CstimerStackmatState) => void): void
}

// ─── Public options ───────────────────────────────────────────────────────────

export interface StackmatConnectOptions extends CstimerRuntimeOptions {
  /** Specific microphone device id from enumerateDevices */
  deviceId?: string
  /** Use MoYu timer protocol (8000 baud) instead of standard stackmat (1200 baud) */
  moyuMode?: boolean
}

// ─── Adapter ─────────────────────────────────────────────────────────────────

export class StackmatAdapter implements HardwareAdapter<StackmatConnectOptions> {
  private module: CstimerStackmat | null = null
  private stateCallback: (state: TimerState) => void = () => {}

  onState(callback: (state: TimerState) => void): void {
    this.stateCallback = callback
  }

  async connect(options: StackmatConnectOptions = {}): Promise<void> {
    initCstimerRuntime({ debug: options.debug, stkHead: options.stkHead })
    await loadVendorScript('/vendors/cstimer/hardware/stackmat.js')

    const mod = (window as unknown as Record<string, unknown>)['stackmat'] as CstimerStackmat | undefined
    if (!mod) {
      throw new Error('cstimer stackmat module not found after script load')
    }

    this.module = mod
    this.module.setCallBack((raw) => this.stateCallback(StackmatAdapter.mapState(raw)))

    // cstimer uses 'm' for MoYu timer mode, any other string for standard stackmat
    const timerType = options.moyuMode ? 'm' : 's'
    await this.module.init(timerType, options.deviceId)
  }

  disconnect(): void {
    this.module?.stop()
    this.module = null
  }

  /** Returns available audio input devices as [deviceId, label] pairs */
  async getInputDevices(): Promise<Array<[string, string]>> {
    if (!this.module) return []
    return this.module.updateInputDevices()
  }

  private static mapState(raw: CstimerStackmatState): TimerState {
    return {
      timeMs: raw.time_milli,
      running: raw.running,
      leftHand: raw.leftHand,
      rightHand: raw.rightHand,
      greenLight: raw.greenLight,
      connected: raw.on,
      signalHeader: raw.signalHeader,
      noise: raw.noise
    }
  }
}
