import { buildWasm } from '../../../crates/build-wasm.mjs'

buildWasm({ crate: 'tnoodle-lib-rs', pkg: new URL('../pkg/', import.meta.url), base64: true })
