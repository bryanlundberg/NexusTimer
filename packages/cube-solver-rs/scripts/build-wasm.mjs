import { buildWasm } from '../../../crates/build-wasm.mjs'

buildWasm({ crate: 'cube-solver-rs', pkg: new URL('../pkg/', import.meta.url) })
