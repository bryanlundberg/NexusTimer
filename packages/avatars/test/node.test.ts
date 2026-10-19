import { describe, expect, it } from 'vitest'
import { DEFAULT_NEXI_RECIPE, NEXI_IMAGE_SIZE, randomNexiRecipe, renderNexiWebp } from '../src/node'

const ascii = (bytes: Uint8Array, start: number, length: number) =>
  String.fromCharCode(...bytes.subarray(start, start + length))

function lossySize(bytes: Uint8Array) {
  expect(ascii(bytes, 12, 4)).toBe('VP8 ')
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  return { width: view.getUint16(26, true) & 0x3fff, height: view.getUint16(28, true) & 0x3fff }
}

describe('renderNexiWebp', () => {
  it('encodes a square WebP of the avatar size', async () => {
    const bytes = await renderNexiWebp(DEFAULT_NEXI_RECIPE)
    expect(ascii(bytes, 0, 4)).toBe('RIFF')
    expect(ascii(bytes, 8, 4)).toBe('WEBP')
    expect(lossySize(bytes)).toEqual({ width: NEXI_IMAGE_SIZE, height: NEXI_IMAGE_SIZE })
  })

  it('honors a custom size', async () => {
    expect(lossySize(await renderNexiWebp(DEFAULT_NEXI_RECIPE, 64))).toEqual({ width: 64, height: 64 })
  })

  it('is deterministic and stays small', async () => {
    for (const seed of ['a', 'b', 'c', 'd']) {
      const recipe = randomNexiRecipe(seed)
      const [first, second] = await Promise.all([renderNexiWebp(recipe), renderNexiWebp(recipe)])
      expect(first).toEqual(second)
      expect(first.byteLength).toBeLessThan(20_000)
    }
  })
})
