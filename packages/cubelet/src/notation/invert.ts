import type { Alg, AlgNode } from './ast'

const invertNode = (node: AlgNode): AlgNode => {
  switch (node.kind) {
    case 'move':
      return { ...node, amount: -node.amount }
    case 'group':
      return { ...node, nodes: invertAlg(node.nodes) }
    case 'tuple':
      return { kind: 'tuple', first: -node.first, second: -node.second }
    case 'slash':
      return node
  }
}

export const invertAlg = (alg: Alg): Alg => alg.map(invertNode).reverse()
