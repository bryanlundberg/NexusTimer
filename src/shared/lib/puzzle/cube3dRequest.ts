export interface Cube3dRequest {
  readonly size: number
  readonly alg: string
  readonly stickering: string
  readonly lastLayer: 'U' | 'D'
}

export type Cube3dStickering = Pick<Cube3dRequest, 'stickering' | 'lastLayer'>

export const FULL_COLOR_STICKERING: Cube3dStickering = { stickering: 'full', lastLayer: 'U' }
