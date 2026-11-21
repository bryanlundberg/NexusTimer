export type CaseView = 'last-layer' | 'net' | '3d'

export interface CaseViz {
  readonly view: CaseView
  readonly stickering: string
  readonly dragInput?: boolean
}
