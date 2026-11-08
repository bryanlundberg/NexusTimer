import type { Alg, AlgNode, MoveNode } from './ast'

export const formatAmount = (amount: number): string => {
  if (amount === 1) return ''
  if (amount === -1) return "'"
  return amount < 0 ? `${-amount}'` : `${amount}`
}

export const formatMove = ({ family, amount, innerLayer, outerLayer }: MoveNode): string => {
  if (family.endsWith('++') && amount === -1) return `${family.slice(0, -2)}--`
  if (family.endsWith('+') && !family.endsWith('++')) {
    return `${family.slice(0, -1)}${Math.abs(amount)}${amount < 0 ? '-' : '+'}`
  }
  return `${outerLayer === undefined ? '' : `${outerLayer}-`}${innerLayer ?? ''}${family}${formatAmount(amount)}`
}

const formatNode = (node: AlgNode): string => {
  switch (node.kind) {
    case 'move':
      return formatMove(node)
    case 'group':
      return `(${formatAlg(node.nodes)})${formatAmount(node.amount)}`
    case 'tuple':
      return `(${node.first}, ${node.second})`
    case 'slash':
      return '/'
  }
}

export const formatAlg = (alg: Alg): string => alg.map(formatNode).join(' ')
