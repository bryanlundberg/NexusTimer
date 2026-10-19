import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const read = async (specifier: string) => new Uint8Array(await readFile(require.resolve(specifier)))

export const loadResvgWasm = () => read('@resvg/resvg-wasm/index_bg.wasm')
export const loadWebpWasm = () => read('@jsquash/webp/codec/enc/webp_enc_simd.wasm')
