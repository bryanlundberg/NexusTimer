import { Appearance, type FaceletSource, type FaceletStickering } from '../puzzle/facelet-source'
import { BoundedCache } from '../shared/bounded-cache'
import type { FaceletPalette } from './facelet-palette'
import type { FaceletLayout } from './facelet-layout'

interface LayoutPaths {
  readonly opening: string
  readonly strokeWidth: number
  readonly shapes: ReadonlyArray<string | null>
}

const round = (value: number): number => Math.round(value * 1000) / 1000

const shapePath = (points: readonly number[]): string => {
  let d = `M${round(points[0]!)} ${round(points[1]!)}`
  for (let i = 2; i < points.length; i += 2) d += `L${round(points[i]!)} ${round(points[i + 1]!)}`
  return `${d}Z`
}

const layoutPaths = new WeakMap<FaceletLayout, LayoutPaths>()

const pathsOf = (layout: FaceletLayout): LayoutPaths => {
  let paths = layoutPaths.get(layout)
  if (!paths) {
    const [x, y, width, height] = layout.viewBox.map(round)
    paths = {
      opening: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${width} ${height}">`,
      strokeWidth: round(layout.outlineWidth),
      shapes: layout.shapes.map((shape) => (shape ? shapePath(shape) : null))
    }
    layoutPaths.set(layout, paths)
  }
  return paths
}

const fillPath = (fill: string, d: string): string => `<path style="fill:${fill}" d="${d}"/>`

export class FaceletSvgRenderer {
  readonly #cache: BoundedCache<string, string>

  constructor(
    private readonly palette: FaceletPalette,
    cacheSize = 256
  ) {
    this.#cache = new BoundedCache(cacheSize)
  }

  render(source: FaceletSource, layout: FaceletLayout, stickering: FaceletStickering | null = null): string {
    const key = `${layout.id}|${stickering?.id ?? ''}|${source.key()}`
    const cached = this.#cache.get(key)
    if (cached !== undefined) return cached
    const svg = this.#build(source, layout, stickering)
    this.#cache.set(key, svg)
    return svg
  }

  #fill(source: FaceletSource, position: number, stickering: FaceletStickering | null): string {
    const appearance = stickering?.appearanceOf(source.stickerAt(position)) ?? Appearance.Regular
    if (appearance === Appearance.Ignored) return this.palette.ignored
    const color = source.colorAt(position)
    return (appearance === Appearance.Dim ? this.palette.dimColors : this.palette.colors)[color]!
  }

  #build(source: FaceletSource, layout: FaceletLayout, stickering: FaceletStickering | null): string {
    const { opening, strokeWidth, shapes } = pathsOf(layout)
    const pathsByFill = new Map<string, string>()
    for (let position = 0; position < shapes.length; position++) {
      const shape = shapes[position]
      if (!shape) continue
      const fill = this.#fill(source, position, stickering)
      pathsByFill.set(fill, (pathsByFill.get(fill) ?? '') + shape)
    }

    let svg = `${opening}<g stroke="${this.palette.outline}" stroke-width="${strokeWidth}" stroke-linejoin="round">`
    for (const [fill, d] of pathsByFill) svg += fillPath(fill, d)
    return `${svg}</g></svg>`
  }
}
