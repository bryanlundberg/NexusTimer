import { BoundedCache } from '../shared/bounded-cache'
import { AlgParseError } from './alg-parse-error'
import type { Alg, AlgNode, GroupNode, MoveNode, TupleNode } from './ast'

const WHITESPACE_CHAR = /\s/
const SLASH_NODE = Object.freeze({ kind: 'slash' as const })

const cache = new BoundedCache<string, Alg>(512)

type CharTest = (char: string | undefined) => boolean

const isDigit: CharTest = (char) => char !== undefined && char >= '0' && char <= '9'
const isLetter: CharTest = (char) =>
  char !== undefined && ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z') || char === '_')
const isWhitespace: CharTest = (char) => char !== undefined && WHITESPACE_CHAR.test(char)

const toAmount = (digits: string | undefined, prime: boolean): number => {
  const magnitude = digits === undefined ? 1 : Number(digits)
  return prime ? -magnitude : magnitude
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
      this.#position = this.#skip(this.#position, isWhitespace)
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
    const firstStart = this.#skip(this.#position + 1, isWhitespace)
    const firstEnd = this.#integerEnd(firstStart)
    if (firstEnd === null) return null
    const comma = this.#skip(firstEnd, isWhitespace)
    if (this.text[comma] !== ',') return null
    const secondStart = this.#skip(comma + 1, isWhitespace)
    const secondEnd = this.#integerEnd(secondStart)
    if (secondEnd === null) return null
    const close = this.#skip(secondEnd, isWhitespace)
    if (this.text[close] !== ')') return null
    this.#position = close + 1
    return {
      kind: 'tuple',
      first: Number(this.text.slice(firstStart, firstEnd)),
      second: Number(this.text.slice(secondStart, secondEnd))
    }
  }

  #group(): GroupNode {
    this.#position++
    const nodes = this.#sequence()
    if (this.text[this.#position] !== ')') this.#fail('Missing ")"')
    this.#position++
    return { kind: 'group', nodes, amount: this.#amount() }
  }

  #move(): MoveNode {
    const start = this.#position
    const familyEnd = this.#skip(start, isLetter)
    if (familyEnd > start) {
      const family = this.text.slice(start, familyEnd)
      const doubleSign = this.text.slice(familyEnd, familyEnd + 2)
      if (doubleSign === '++' || doubleSign === '--') {
        this.#position = familyEnd + 2
        return { kind: 'move', family: `${family}++`, amount: doubleSign === '++' ? 1 : -1 }
      }
      const digitsEnd = this.#skip(familyEnd, isDigit)
      const sign = this.text[digitsEnd]
      if (digitsEnd > familyEnd && (sign === '+' || sign === '-')) {
        this.#position = digitsEnd + 1
        const magnitude = Number(this.text.slice(familyEnd, digitsEnd))
        return { kind: 'move', family: `${family}+`, amount: sign === '+' ? magnitude : -magnitude }
      }
    }
    return this.#layeredMove()
  }

  #layeredMove(): MoveNode {
    const start = this.#position
    const leadEnd = this.#skip(start, isDigit)
    let outer: string | undefined
    let inner = leadEnd > start ? this.text.slice(start, leadEnd) : undefined
    let familyStart = leadEnd
    if (inner !== undefined && this.text[leadEnd] === '-') {
      const innerEnd = this.#skip(leadEnd + 1, isDigit)
      if (isLetter(this.text[innerEnd])) {
        outer = inner
        inner = innerEnd > leadEnd + 1 ? this.text.slice(leadEnd + 1, innerEnd) : undefined
        familyStart = innerEnd
      }
    }
    const familyEnd = this.#skip(familyStart, isLetter)
    if (familyEnd === familyStart) return this.#fail('Expected a move')
    this.#position = familyEnd
    const amount = this.#amount()
    if (outer !== undefined && inner === undefined) this.#fail('Layer range without an inner layer')
    return {
      kind: 'move',
      family: this.text.slice(familyStart, familyEnd),
      amount,
      ...(inner === undefined ? {} : { innerLayer: Number(inner) }),
      ...(outer === undefined ? {} : { outerLayer: Number(outer) })
    }
  }

  #amount(): number {
    const digitsEnd = this.#skip(this.#position, isDigit)
    const digits = digitsEnd > this.#position ? this.text.slice(this.#position, digitsEnd) : undefined
    const prime = this.text[digitsEnd] === "'"
    this.#position = prime ? digitsEnd + 1 : digitsEnd
    return toAmount(digits, prime)
  }

  #integerEnd(from: number): number | null {
    const digitsStart = this.text[from] === '-' ? from + 1 : from
    const end = this.#skip(digitsStart, isDigit)
    return end > digitsStart ? end : null
  }

  #skip(from: number, test: CharTest): number {
    let index = from
    while (test(this.text[index])) index++
    return index
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
