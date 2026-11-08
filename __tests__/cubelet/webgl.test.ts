import { cube } from '@nexustimer/cubelet/nxn'
import {
  beveledCubie,
  CubeCamera,
  CubeView,
  cubeMesh,
  hintColors,
  STICKERLESS_CUBIE_STYLE,
  stickerColors,
  VERTICES_PER_HINT,
  WebGlCubeRenderer,
  type CubeFrame,
  type CubeFrameRenderer,
  type FrameScheduler,
  type GlCubePalette
} from '@nexustimer/cubelet/webgl'

const PALETTE: GlCubePalette = {
  colors: [
    [1, 1, 1],
    [1, 0, 0],
    [0, 1, 0],
    [1, 1, 0],
    [1, 0.5, 0],
    [0, 0, 1]
  ],
  dimColors: Array.from({ length: 6 }, () => [0.2, 0.2, 0.2] as const),
  ignored: [0.3, 0.3, 0.3],
  body: [0, 0, 0]
}

class ManualScheduler implements FrameScheduler {
  #callbacks = new Map<number, (now: number) => void>()
  #next = 1

  request(callback: (now: number) => void): number {
    const handle = this.#next++
    this.#callbacks.set(handle, callback)
    return handle
  }

  cancel(handle: number): void {
    this.#callbacks.delete(handle)
  }

  get pending(): number {
    return this.#callbacks.size
  }

  run(now: number): void {
    const callbacks = [...this.#callbacks.values()]
    this.#callbacks.clear()
    for (const callback of callbacks) callback(now)
  }
}

class RecordingRenderer implements CubeFrameRenderer {
  frames: CubeFrame[] = []

  render(_target: HTMLCanvasElement, frame: CubeFrame): void {
    this.frames.push(frame)
  }

  get last(): CubeFrame {
    return this.frames[this.frames.length - 1]!
  }
}

const sizedCanvas = () => {
  const canvas = document.createElement('canvas')
  Object.defineProperty(canvas, 'clientWidth', { value: 100 })
  Object.defineProperty(canvas, 'clientHeight', { value: 100 })
  return canvas
}

const createView = (size = 3) => {
  const scheduler = new ManualScheduler()
  const renderer = new RecordingRenderer()
  const view = new CubeView({ size, canvas: sizedCanvas(), renderer, palette: PALETTE, scheduler })
  return { view, scheduler, renderer }
}

describe('beveledCubie', () => {
  const shape = {
    halfSize: 1,
    outerAxisRadius: 0.01,
    innerEdgeRadius: 0.14,
    innerCornerRadius: 0.6,
    cornerSharpness: 1.3,
    segments: 3
  }
  const corner = beveledCubie(shape, (_, sign) => sign === 1)

  it('builds six faces of the same grid', () => {
    expect(corner.faces).toHaveLength(6)
    expect(corner.positions.length / 3).toBe(6 * corner.verticesPerFace)
    expect(corner.faceIndexPattern.length).toBe((Math.sqrt(corner.verticesPerFace) - 1) ** 2 * 6)
  })

  it('stays inside the half-size', () => {
    for (const value of corner.positions) expect(Math.abs(value)).toBeLessThanOrEqual(1 + 1e-6)
  })

  it('keeps the middle of an outward face flat against it', () => {
    const face = corner.faces.find((item) => item.axis === 1 && item.sign === 1)!
    const grid = Math.sqrt(corner.verticesPerFace)
    const middle = face.vertexStart + Math.floor(grid / 2) * grid + Math.floor(grid / 2)
    expect(corner.positions[middle * 3 + 1]).toBeCloseTo(1, 2)
    expect(corner.normals[middle * 3 + 1]).toBeCloseTo(1, 2)
  })

  it('rejects radii that do not fit', () => {
    expect(() => beveledCubie({ ...shape, innerCornerRadius: 2 }, () => true)).toThrow(RangeError)
  })
})

describe('cubeMesh', () => {
  it.each([2, 3, 7])('builds one face per sticker and the hidden faces of a %i-layer cube', (size) => {
    const mesh = cubeMesh(size)
    const outerCubies = size ** 3 - Math.max(0, size - 2) ** 3
    const stickers = 6 * size * size
    expect(mesh.stickers.vertexCount).toBe(stickers * mesh.verticesPerSticker)
    expect(mesh.body.vertexCount).toBe((outerCubies * 6 - stickers) * mesh.verticesPerSticker)
    expect(Math.max(...mesh.stickers.indices)).toBeLessThan(mesh.stickers.vertexCount)
  })

  it('keeps every sticker on its slot', () => {
    const mesh = cubeMesh(3)
    for (let vertex = 0; vertex < mesh.stickers.vertexCount; vertex++) {
      for (let axis = 0; axis < 3; axis++) {
        const offset = mesh.stickers.positions[vertex * 3 + axis]! - mesh.stickers.slots[vertex * 3 + axis]!
        expect(Math.abs(offset)).toBeLessThanOrEqual(1.03)
      }
    }
  })

  it('reuses the mesh for the same size and style', () => {
    expect(cubeMesh(3)).toBe(cubeMesh(3, STICKERLESS_CUBIE_STYLE))
  })
})

describe('hint facelets', () => {
  it('floats one quad per sticker outside the cube, facing out', () => {
    const mesh = cubeMesh(3)
    expect(mesh.hints.vertexCount).toBe(54 * VERTICES_PER_HINT)
    for (let quad = 0; quad < 54; quad++) {
      const base = quad * VERTICES_PER_HINT * 3
      const corner = (i: number) => [0, 1, 2].map((k) => mesh.hints.positions[base + i * 3 + k]!)
      const normal = [0, 1, 2].map((k) => mesh.hints.normals[base + k]!)
      const [a, b, c] = [corner(0), corner(1), corner(2)]
      const ab = [0, 1, 2].map((k) => b[k]! - a[k]!)
      const ac = [0, 1, 2].map((k) => c[k]! - a[k]!)
      const winding = [
        ab[1]! * ac[2]! - ab[2]! * ac[1]!,
        ab[2]! * ac[0]! - ab[0]! * ac[2]!,
        ab[0]! * ac[1]! - ab[1]! * ac[0]!
      ]
      expect(winding.reduce((sum, value, k) => sum + value * normal[k]!, 0)).toBeGreaterThan(0)
      expect(Math.max(...a.map(Math.abs))).toBeGreaterThan(3.9)
    }
  })

  it('fades each hint by its face and keeps ignored ones visible', () => {
    const { colors, alphas } = hintColors(cube(3).solved(), PALETTE, null, VERTICES_PER_HINT)
    expect(colors).toHaveLength(54 * VERTICES_PER_HINT * 3)
    expect(alphas[0]).toBeCloseTo(0.625)
    expect(alphas[9 * VERTICES_PER_HINT]).toBeCloseTo(0.5)
    expect(alphas[45 * VERTICES_PER_HINT]).toBeCloseTo(0.375)
  })
})

describe('WebGlCubeRenderer', () => {
  it('reports when WebGL2 is not available instead of throwing', () => {
    const canvas = { getContext: () => null } as unknown as HTMLCanvasElement
    const renderer = new WebGlCubeRenderer(() => canvas)
    expect(renderer.prepare()).toBe(false)
    expect(() => renderer.dispose()).not.toThrow()
  })
})

describe('CubeCamera', () => {
  it('keeps the cube centered in front of the camera', () => {
    const view = new CubeCamera({ distance: 5 }).view()
    expect(view[12]).toBeCloseTo(0)
    expect(view[13]).toBeCloseTo(0)
    expect(view[14]).toBeCloseTo(-5)
  })

  it('clamps the latitude short of the poles', () => {
    const camera = new CubeCamera()
    camera.rotate(0, 10)
    expect(camera.latitude).toBeLessThan(Math.PI / 2)
  })
})

describe('stickerColors', () => {
  it('paints every vertex of a sticker with its color', () => {
    const colors = stickerColors(cube(3).solved(), PALETTE, null, 4)
    expect(colors).toHaveLength(54 * 4 * 3)
    expect([...colors.slice(9 * 12, 9 * 12 + 3)]).toEqual([1, 0, 0])
  })
})

describe('CubeView', () => {
  it('shows the state after an alg without animating', () => {
    const { view, scheduler, renderer } = createView()
    view.show("R U R'")
    scheduler.run(0)
    expect(renderer.frames).toHaveLength(1)
    expect(renderer.last.turn).toBeNull()
    expect(view.state.equals(cube(3).solved().apply(cube(3).compile("R U R'")))).toBe(true)
    expect(scheduler.pending).toBe(0)
  })

  it('animates a move and applies it when the turn ends', () => {
    const { view, scheduler, renderer } = createView()
    view.play('R')
    scheduler.run(0)
    scheduler.run(250)
    expect(renderer.last.turn).toMatchObject({ axis: 0, from: 2, to: 2 })
    expect(renderer.last.turn!.angle).toBeCloseTo(-Math.PI / 4)
    expect(view.state.isSolved()).toBe(true)

    scheduler.run(500)
    expect(renderer.last.turn).toBeNull()
    expect(view.state.equals(cube(3).solved().apply(cube(3).compile('R')))).toBe(true)
    expect(scheduler.pending).toBe(0)
  })

  it('snaps the running turn into place when a new move arrives', () => {
    const { view, scheduler, renderer } = createView()
    view.play('R')
    scheduler.run(0)
    scheduler.run(100)
    view.play('U')
    expect(view.state.equals(cube(3).solved().apply(cube(3).compile('R')))).toBe(true)
    scheduler.run(120)
    expect(renderer.last.turn).toMatchObject({ axis: 1 })
    scheduler.run(620)
    expect(view.state.equals(cube(3).solved().apply(cube(3).compile('R U')))).toBe(true)
  })

  it('plays the moves of one alg one after another', () => {
    const { view, scheduler } = createView()
    view.play('R U')
    scheduler.run(0)
    scheduler.run(500)
    expect(view.state.equals(cube(3).solved().apply(cube(3).compile('R')))).toBe(true)
    scheduler.run(1000)
    expect(view.state.equals(cube(3).solved().apply(cube(3).compile('R U')))).toBe(true)
  })

  it('finishes every pending move at once', () => {
    const { view, scheduler } = createView()
    view.play("R U R' U'")
    scheduler.run(0)
    view.finish()
    expect(view.state.equals(cube(3).solved().apply(cube(3).compile("R U R' U'")))).toBe(true)
    expect(view.animating).toBe(false)
  })

  it('stops scheduling frames once disposed', () => {
    const { view, scheduler, renderer } = createView()
    view.play('R')
    view.dispose()
    scheduler.run(0)
    expect(renderer.frames).toHaveLength(0)
    expect(scheduler.pending).toBe(0)
  })

  it('reuses the color buffer until the state changes', () => {
    const { view, scheduler, renderer } = createView()
    view.show('R')
    scheduler.run(0)
    view.rotateCamera(0.1, 0)
    scheduler.run(16)
    expect(renderer.frames[1]!.stickerColors).toBe(renderer.frames[0]!.stickerColors)
    expect(renderer.frames[1]!.view).not.toEqual(renderer.frames[0]!.view)
  })
})
