import type { TwistyPlayer } from 'cubing/twisty'

function collectCanvases(root: Element | ShadowRoot): HTMLCanvasElement[] {
  const out: HTMLCanvasElement[] = []
  const visit = (node: Element | ShadowRoot) => {
    node.querySelectorAll('*').forEach((el) => {
      if (el instanceof HTMLCanvasElement) out.push(el)
      const sr = (el as Element).shadowRoot
      if (sr) visit(sr)
    })
  }
  if (root instanceof Element && root instanceof HTMLCanvasElement) out.push(root)
  const rootShadow = root instanceof Element ? root.shadowRoot : null
  if (rootShadow) visit(rootShadow)
  visit(root)
  return out
}

export function disposeTwistyPlayer(player: TwistyPlayer | null | undefined): void {
  if (!player) return

  try {
    const canvases = collectCanvases(player as unknown as Element)
    for (const canvas of canvases) {
      const gl =
        (canvas.getContext('webgl2') as WebGL2RenderingContext | null) ??
        (canvas.getContext('webgl') as WebGLRenderingContext | null)
      gl?.getExtension('WEBGL_lose_context')?.loseContext()
      // Shrink the backing store so the GPU/CPU buffers are freed immediately.
      canvas.width = 0
      canvas.height = 0
    }
  } catch {
    // Disposal is best-effort; ignore any DOM/WebGL access errors.
  }

  try {
    ;(player as unknown as Element).remove()
  } catch {
    // ignore
  }
}
