import init, { scramble } from '../pkg/tnoodle_lib_rs.js'
import type { ScrambleEngine } from './index'

export * from './index'

const engine: ScrambleEngine = { scramble }

let loading: Promise<ScrambleEngine> | undefined

export function loadEngine(): Promise<ScrambleEngine> {
  loading ??= init({ module_or_path: new URL('../pkg/tnoodle_lib_rs_bg.wasm', import.meta.url) }).then(
    () => engine,
    (error: unknown) => {
      loading = undefined
      throw error
    }
  )
  return loading
}
