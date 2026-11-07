import type { AnyPuzzleDefinition } from './puzzle-definition'

export interface PuzzleRegistry {
  get(id: string): AnyPuzzleDefinition | undefined
  ids(): readonly string[]
}

export function createPuzzleRegistry(definitions: readonly AnyPuzzleDefinition[]): PuzzleRegistry {
  const byId = new Map<string, AnyPuzzleDefinition>()
  for (const definition of definitions) {
    if (byId.has(definition.id)) throw new Error(`Puzzle "${definition.id}" is registered twice`)
    byId.set(definition.id, definition)
  }
  const ids = Object.freeze([...byId.keys()])
  return {
    get: (id) => byId.get(id),
    ids: () => ids
  }
}
