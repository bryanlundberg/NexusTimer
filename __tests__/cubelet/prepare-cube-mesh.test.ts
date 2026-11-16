import { describe, expect, it } from 'vitest'
import { cubeMesh, prepareCubeMesh, SPEEDCUBE_2X2_CUBIE_STYLE, SPEEDCUBE_CUBIE_STYLE } from '@nexustimer/cubelet/webgl'

describe('prepareCubeMesh', () => {
  it('leaves the finished mesh cached for cubeMesh', async () => {
    await prepareCubeMesh(3, SPEEDCUBE_CUBIE_STYLE)
    const mesh = cubeMesh(3, SPEEDCUBE_CUBIE_STYLE)
    expect(mesh.size).toBe(3)
    expect(mesh.stickers.vertexCount).toBe(54 * mesh.verticesPerSticker)
    expect(cubeMesh(3, SPEEDCUBE_CUBIE_STYLE)).toBe(mesh)
  })

  it('still lets cubeMesh build after an aborted prepare', async () => {
    const controller = new AbortController()
    controller.abort()
    await prepareCubeMesh(2, SPEEDCUBE_2X2_CUBIE_STYLE, controller.signal)
    const mesh = cubeMesh(2, SPEEDCUBE_2X2_CUBIE_STYLE)
    expect(mesh.stickers.vertexCount).toBe(24 * mesh.verticesPerSticker)
  })
})
