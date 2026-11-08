export interface MoveNode {
  readonly kind: 'move'
  readonly family: string
  readonly amount: number
  readonly innerLayer?: number
  readonly outerLayer?: number
}

export interface GroupNode {
  readonly kind: 'group'
  readonly nodes: Alg
  readonly amount: number
}

export interface TupleNode {
  readonly kind: 'tuple'
  readonly first: number
  readonly second: number
}

export interface SlashNode {
  readonly kind: 'slash'
}

export type AlgNode = MoveNode | GroupNode | TupleNode | SlashNode

export type LeafNode = MoveNode | TupleNode | SlashNode

export type Alg = readonly AlgNode[]
