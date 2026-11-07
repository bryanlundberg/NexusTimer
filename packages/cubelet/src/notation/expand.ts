import type { Alg, LeafNode } from './ast'
import { invertAlg } from './invert'

const expandInto = (alg: Alg, out: LeafNode[]): void => {
  for (const node of alg) {
    if (node.kind !== 'group') {
      out.push(node)
      continue
    }
    const body = node.amount < 0 ? invertAlg(node.nodes) : node.nodes
    for (let i = Math.abs(node.amount); i > 0; i--) expandInto(body, out)
  }
}

export const expandAlg = (alg: Alg): readonly LeafNode[] => {
  const out: LeafNode[] = []
  expandInto(alg, out)
  return out
}
