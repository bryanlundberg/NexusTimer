export type RenderContext = {
  defs: string[]
  id: (name: string) => string
}

export function createContext(uid: string): RenderContext {
  return { defs: [], id: (name) => `${uid}-${name}` }
}
