export type ViewBox = readonly [x: number, y: number, width: number, height: number]

export interface FaceletLayout {
  readonly id: string
  readonly viewBox: ViewBox
  readonly outlineWidth: number
  readonly shapes: ReadonlyArray<readonly number[] | null>
}
