import webp from '@jsquash/webp/codec/enc/webp_enc_simd.wasm'
import resvg from '@resvg/resvg-wasm/index_bg.wasm'

export const loadResvgWasm = async () => resvg
export const loadWebpWasm = async () => webp
