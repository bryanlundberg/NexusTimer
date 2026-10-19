import createWebpEncoder from '@jsquash/webp/codec/enc/webp_enc_simd.js'
import { defaultOptions, type EncodeOptions } from '@jsquash/webp/meta.js'
import { initWasm, Resvg } from '@resvg/resvg-wasm'
import type { NexiRecipe } from '@nexustimer/contracts'
import { renderNexiSvg } from './render-nexi'

export * from './index'

export const NEXI_IMAGE_SIZE = 256
export const NEXI_IMAGE_TYPE = 'image/webp'

type WebpEncoder = {
  encode(data: Uint8Array, width: number, height: number, options: EncodeOptions): Uint8Array | null
}
type WebpEncoderFactory = (options: { noInitialRun: boolean; wasmBinary: Uint8Array }) => Promise<WebpEncoder>

const WEBP_OPTIONS: EncodeOptions = { ...defaultOptions, quality: 85, method: 6, use_sharp_yuv: 1 }

function once<T>(load: () => Promise<T>) {
  let pending: Promise<T> | undefined
  return () =>
    (pending ??= load().catch((error: unknown) => {
      pending = undefined
      throw error
    }))
}

const rasterizer = once(async () => {
  const { loadResvgWasm } = await import('#wasm')
  await initWasm(await loadResvgWasm())
})

const encoder = once(async () => {
  const { loadWebpWasm } = await import('#wasm')
  return (createWebpEncoder as unknown as WebpEncoderFactory)({ noInitialRun: true, wasmBinary: await loadWebpWasm() })
})

export async function renderNexiWebp(recipe: NexiRecipe, size = NEXI_IMAGE_SIZE): Promise<Uint8Array> {
  const [, webp] = await Promise.all([rasterizer(), encoder()])
  const resvg = new Resvg(renderNexiSvg(recipe), { fitTo: { mode: 'width', value: size } })
  const image = resvg.render()
  try {
    const encoded = webp.encode(image.pixels, image.width, image.height, WEBP_OPTIONS)
    if (!encoded) throw new Error('WebP encoding failed')
    return encoded
  } finally {
    image.free()
    resvg.free()
  }
}
