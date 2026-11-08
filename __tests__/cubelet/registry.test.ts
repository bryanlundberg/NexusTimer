import { createPuzzleRegistry } from '@nexustimer/cubelet'
import { cube } from '@nexustimer/cubelet/nxn'

describe('createPuzzleRegistry', () => {
  it('finds definitions by id', () => {
    const registry = createPuzzleRegistry([cube(2), cube(3)])
    expect(registry.get('3x3x3')).toBe(cube(3))
    expect(registry.get('4x4x4')).toBeUndefined()
    expect(registry.ids()).toEqual(['2x2x2', '3x3x3'])
  })

  it('rejects the same id twice', () => {
    expect(() => createPuzzleRegistry([cube(3), cube(3)])).toThrow('registered twice')
  })
})
