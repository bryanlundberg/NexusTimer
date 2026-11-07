import type { Rgb } from './cube-frame'

export interface GlCubePalette {
  readonly colors: readonly Rgb[]
  readonly dimColors: readonly Rgb[]
  readonly ignored: Rgb
  readonly body: Rgb
}

export interface CssCubePalette {
  readonly colors: readonly string[]
  readonly dimColors: readonly string[]
  readonly ignored: string
  readonly body: string
}

const FALLBACK: Rgb = [0.5, 0.5, 0.5]

export function createCssColorResolver(host: HTMLElement): (css: string) => Rgb {
  const probe = document.createElement('span')
  probe.style.display = 'none'
  host.appendChild(probe)
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const context = canvas.getContext('2d', { willReadFrequently: true })

  return (css) => {
    probe.style.color = ''
    probe.style.color = css
    const computed = getComputedStyle(probe).color
    if (!context) return FALLBACK
    context.clearRect(0, 0, 1, 1)
    context.fillStyle = computed
    context.fillRect(0, 0, 1, 1)
    const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data
    if (!a) return FALLBACK
    return [r! / 255, g! / 255, b! / 255]
  }
}

export function resolveGlPalette(host: HTMLElement, palette: CssCubePalette): GlCubePalette {
  const resolve = createCssColorResolver(host)
  return {
    colors: palette.colors.map(resolve),
    dimColors: palette.dimColors.map(resolve),
    ignored: resolve(palette.ignored),
    body: resolve(palette.body)
  }
}
