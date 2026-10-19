import type { NexiRecipe } from '@nexustimer/contracts'
import { luminance, tone } from './color'
import { createContext } from './context'
import { drawBackground } from './parts/backgrounds'
import { EXTRAS } from './parts/extras'
import { FACES } from './parts/faces'
import { HEADS } from './parts/heads'
import { drawHeld, HELD } from './parts/held'
import { drawBody, FACE_ANCHORS, SHAPES, type Palette } from './parts/shapes'
import { normalizeNexiRecipe } from './recipe'

export type RenderNexiOptions = { uid?: string }

function palette(base: string, bg: string): Palette {
  const light = tone(base, 0.14)
  const d1 = tone(base, -0.1)
  return { light, l1: tone(base, 0.03), base, d1, dark: tone(base, -0.2), fx: luminance(bg) > 0.5 ? d1 : light }
}

export function renderNexiSvg(input: NexiRecipe, { uid = 'nx' }: RenderNexiOptions = {}) {
  const recipe = normalizeNexiRecipe(input)
  const ctx = createContext(uid.replace(/[^\w-]/g, '') || 'nx')
  const face = FACES[recipe.state]
  const head = HEADS[recipe.head]
  const extra = EXTRAS[recipe.extra]
  const shape = SHAPES[recipe.shape]
  const a = shape.anchors
  const p = palette(recipe.color, recipe.bg)

  ctx.defs.push(
    `<radialGradient id="${ctx.id('gs')}"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset=".75" stop-color="#000" stop-opacity="0"/></radialGradient>`
  )
  const features = face.draw() + (extra.face?.(FACE_ANCHORS) ?? '')
  const character =
    (head.back?.(a, recipe.color) ?? '') +
    drawBody(ctx, p, shape) +
    (shape.faceTransform ? `<g transform="${shape.faceTransform}">${features}</g>` : features) +
    drawHeld(HELD[recipe.hand]) +
    (head.front?.(a, recipe.color) ?? '')
  const tilted = face.tilt ? `<g transform="rotate(${face.tilt} 64 104)">${character}</g>` : character
  ctx.defs.push(
    `<radialGradient id="${ctx.id('vig')}" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>`
  )

  const parts =
    drawBackground(ctx, recipe.bg, recipe.pattern) +
    `<rect width="128" height="128" fill="url(#${ctx.id('vig')})"/>` +
    `<ellipse cx="64" cy="112" rx="29" ry="4.5" fill="url(#${ctx.id('gs')})"/>` +
    (extra.back?.(a) ?? '') +
    tilted +
    (extra.front?.(a) ?? '') +
    (face.fx?.(p) ?? '')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><defs>${ctx.defs.join('')}</defs>${parts}</svg>`
}
