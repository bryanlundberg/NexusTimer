export interface Cube3dRequest {
  readonly size: number
  readonly alg: string
  readonly stickering: string
  readonly lastLayer: 'U' | 'D'
}
