const RADIANS_PER_PIXEL = 0.012

export interface CameraRotator {
  rotateCamera(deltaLongitude: number, deltaLatitude: number): void
}

export class CubeDragControl {
  #pointer: { id: number; x: number; y: number } | null = null

  constructor(
    private readonly element: HTMLElement,
    private readonly target: CameraRotator
  ) {
    element.style.touchAction = 'none'
    element.addEventListener('pointerdown', this.#onDown)
    element.addEventListener('pointermove', this.#onMove)
    element.addEventListener('pointerup', this.#onUp)
    element.addEventListener('pointercancel', this.#onUp)
  }

  dispose(): void {
    this.element.removeEventListener('pointerdown', this.#onDown)
    this.element.removeEventListener('pointermove', this.#onMove)
    this.element.removeEventListener('pointerup', this.#onUp)
    this.element.removeEventListener('pointercancel', this.#onUp)
  }

  readonly #onDown = (event: PointerEvent): void => {
    this.#pointer = { id: event.pointerId, x: event.clientX, y: event.clientY }
    this.element.setPointerCapture(event.pointerId)
  }

  readonly #onMove = (event: PointerEvent): void => {
    const pointer = this.#pointer
    if (!pointer || pointer.id !== event.pointerId) return
    this.target.rotateCamera(
      (event.clientX - pointer.x) * RADIANS_PER_PIXEL,
      (event.clientY - pointer.y) * RADIANS_PER_PIXEL
    )
    this.#pointer = { id: pointer.id, x: event.clientX, y: event.clientY }
  }

  readonly #onUp = (event: PointerEvent): void => {
    if (this.#pointer?.id === event.pointerId) this.#pointer = null
  }
}
