import { describe, expect, it } from 'vitest'
import { cubeMesh, STUDIO_CUBIE_STYLE } from '@nexustimer/cubelet/webgl'

describe('studio cube mesh', () => {
  const mesh = cubeMesh(3, STUDIO_CUBIE_STYLE)

  it('stores one occlusion value per vertex', () => {
    expect(mesh.stickers.occlusion).toHaveLength(mesh.stickers.vertexCount)
    expect(mesh.body.occlusion).toHaveLength(mesh.body.vertexCount)
    expect(mesh.hints.occlusion.every((value) => value === 1)).toBe(true)
  })

  it('keeps every value between fully hidden and fully visible', () => {
    for (const value of [...mesh.stickers.occlusion, ...mesh.body.occlusion]) {
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThanOrEqual(1)
    }
  })

  it('darkens the hidden faces more than the stickers', () => {
    const mean = (values: Float32Array) => values.reduce((sum, value) => sum + value, 0) / values.length
    expect(mean(mesh.body.occlusion)).toBeLessThan(mean(mesh.stickers.occlusion))
  })

  it('leaves the middle of a center sticker unoccluded', () => {
    const perSticker = mesh.verticesPerSticker
    let brightest = 0
    for (let sticker = 0; sticker < mesh.stickers.vertexCount / perSticker; sticker++) {
      const values = mesh.stickers.occlusion.subarray(sticker * perSticker, (sticker + 1) * perSticker)
      brightest = Math.max(brightest, ...values)
    }
    expect(brightest).toBeCloseTo(1, 2)
  })
})
