import { describe, expect, it } from 'vitest'
import { cubeMesh, SPEEDCUBE_CUBIE_STYLE, speedcubeCubie } from '@nexustimer/cubelet/webgl'

describe('speedcubeCubie', () => {
  const shape = { halfSize: 1, tileRadius: 0.5, seamRadius: 0.1, outerRadius: 0.1, blend: 0.05, segments: 8 }
  const center = speedcubeCubie(shape, (axis, sign) => axis === 1 && sign === 1)

  it('builds six faces of the same grid', () => {
    expect(center.faces).toHaveLength(6)
    expect(center.positions.length / 3).toBe(6 * center.verticesPerFace)
  })

  it('stays inside the half-size', () => {
    for (const value of center.positions) expect(Math.abs(value)).toBeLessThanOrEqual(1 + 1e-6)
  })

  it('rounds the tile corners that face the middle of the cube', () => {
    const face = center.faces.find((item) => item.axis === 1 && item.sign === 1)!
    let reach = 0
    for (let vertex = face.vertexStart; vertex < face.vertexStart + center.verticesPerFace; vertex++) {
      const x = center.positions[vertex * 3]!
      const z = center.positions[vertex * 3 + 2]!
      reach = Math.max(reach, Math.min(Math.abs(x), Math.abs(z)))
    }
    expect(reach).toBeLessThan(0.9)
  })

  it('rejects radii that do not fit', () => {
    expect(() => speedcubeCubie({ ...shape, tileRadius: 2 }, () => true)).toThrow(RangeError)
  })
})

describe('speedcube mesh', () => {
  const mesh = cubeMesh(3, SPEEDCUBE_CUBIE_STYLE)

  it('ties every hidden vertex to a sticker of its own piece', () => {
    const stickerOf = mesh.body.stickerOf!
    expect(stickerOf).toHaveLength(mesh.body.vertexCount)
    for (let vertex = 0; vertex < mesh.body.vertexCount; vertex++) {
      const sticker = stickerOf[vertex]!
      expect(sticker).toBeGreaterThanOrEqual(0)
      for (let axis = 0; axis < 3; axis++) {
        expect(mesh.body.slots[vertex * 3 + axis]).toBe(
          mesh.stickers.slots[sticker * mesh.verticesPerSticker * 3 + axis]
        )
      }
    }
  })

  it('records how deep the colored caps go', () => {
    expect(mesh.capDepth).toBeGreaterThan(0)
    expect(mesh.capDepth).toBeLessThan(mesh.pieceHalfSize)
    expect(cubeMesh(3).capDepth).toBe(0)
  })
})
