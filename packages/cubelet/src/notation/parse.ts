import { BoundedCache } from '../shared/bounded-cache'
import { AlgParseError } from './alg-parse-error'
import type { Alg, AlgNode, GroupNode, MoveNode, TupleNode } from './ast'

const MOVE = /(?:(\d+)-)?(\d+)?([A-Za-z_]+)(\d+)?(')?/y
const DOUBLE_SIGN_MOVE = /([A-Za-z_]+)(\+\+|--)/y
const SIGNED_AMOUNT_MOVE = /([A-Za-z_]+)(\d+)([+-])/y
const TUPLE = /\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/y
const AMOUNT = /(\d+)?(')?/y
const WHITESPACE = /\s*/y
const SLASH_NODE = Object.freeze({ kind: 'slash' as const })

const cache = new BoundedCache<string, Alg>(512)

const toAmount = (digits: string | undefined, prime: string | undefined): number => {
  const magnitude = digits === undefined ? 1 : Number(digits)
  return prime === undefined ? magnitude : -magnitude
}

class AlgParser {
  #position = 0

  constructor(private readonly text: string) {}

  parse(): Alg {
    const nodes = this.#sequence()
    if (this.#position < this.text.length) this.#fail(`Unexpected "${this.text[this.#position]}"`)
    return nodes
  }

  #sequence(): Alg {
    const nodes: AlgNode[] = []
    for (;;) {
      this.#skipWhitespace()
      if (this.#position >= this.text.length || this.text[this.#position] === ')') return nodes
      nodes.push(this.#unit())
    }
  }

  #unit(): AlgNode {
    const char = this.text[this.#position]
    if (char === '/') {
      this.#position++
      return SLASH_NODE
    }
    if (char === '(') return this.#tuple() ?? this.#group()
    return this.#move()
  }

  #tuple(): TupleNode | null {
    const match = this.#match(TUPLE)
    if (!match) return null
    return { kind: 'tuple', first: Number(match[1]), second: Number(match[2]) }
  }

  #group(): GroupNode {
    this.#position++
    const nodes = this.#sequence()
    if (this.text[this.#position] !== ')') this.#fail('Missing ")"')
    this.#position++
    const match = this.#match(AMOUNT)
    return { kind: 'group', nodes, amount: toAmount(match?.[1], match?.[2]) }
  }

  #move(): MoveNode {
    const doubleSign = this.#match(DOUBLE_SIGN_MOVE)
    if (doubleSign) return { kind: 'move', family: `${doubleSign[1]}++`, amount: doubleSign[2] === '++' ? 1 : -1 }
    const signed = this.#match(SIGNED_AMOUNT_MOVE)
    if (signed) {
      const magnitude = Number(signed[2])
      return { kind: 'move', family: `${signed[1]}+`, amount: signed[3] === '+' ? magnitude : -magnitude }
    }
    const match = this.#match(MOVE)
    if (!match) return this.#fail('Expected a move')
    const [, outer, inner, family, digits, prime] = match
    if (outer !== undefined && inner === undefined) this.#fail('Layer range without an inner layer')
    return {
      kind: 'move',
      family: family!,
      amount: toAmount(digits, prime),
      ...(inner === undefined ? {} : { innerLayer: Number(inner) }),
      ...(outer === undefined ? {} : { outerLayer: Number(outer) })
    }
  }

  #skipWhitespace(): void {
    this.#match(WHITESPACE)
  }

  #match(pattern: RegExp): RegExpExecArray | null {
    pattern.lastIndex = this.#position
    const match = pattern.exec(this.text)
    if (!match || match[0].length === 0) return null
    this.#position += match[0].length
    return match
  }

  #fail(reason: string): never {
    throw new AlgParseError(this.text, this.#position, reason)
  }
}

export function parseAlg(text: string): Alg {
  const cached = cache.get(text)
  if (cached) return cached
  const alg = new AlgParser(text).parse()
  cache.set(text, alg)
  return alg
}
