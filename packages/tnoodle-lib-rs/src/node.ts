import { initSync, scramble } from '../pkg/tnoodle_lib_rs.js'
import wasm from '../pkg/tnoodle_lib_rs_wasm.js'
import type { ScrambleEngine } from './index'

export * from './index'

let engine: ScrambleEngine | undefined

export function loadEngine(): ScrambleEngine {
  if (!engine) {
    initSync({ module: Uint8Array.from(atob(wasm), (char) => char.charCodeAt(0)) })
    engine = { scramble }
  }
  return engine
}
