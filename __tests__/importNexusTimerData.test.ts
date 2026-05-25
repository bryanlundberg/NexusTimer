import { importNexusTimerData } from '@/features/manage-backup/lib/importDataFromFile'

function validSolve(overrides: Record<string, unknown> = {}) {
  return {
    id: 's1',
    startTime: 1,
    endTime: 2,
    scramble: 'R U',
    bookmark: false,
    time: 1000,
    plus2: false,
    rating: 0,
    cubeId: 'c1',
    ...overrides
  }
}

function validCube(overrides: Record<string, unknown> = {}) {
  return {
    id: 'c1',
    name: 'My Cube',
    category: '3x3',
    solves: { session: [validSolve()], all: [] },
    createdAt: 1,
    favorite: false,
    ...overrides
  }
}

describe('importNexusTimerData', () => {
  it('parses a valid backup and returns the cubes', () => {
    const json = JSON.stringify([validCube()])
    const result = importNexusTimerData(json)
    expect(Array.isArray(result)).toBe(true)
    expect(result[0].id).toBe('c1')
  })

  it('accepts an empty array of cubes', () => {
    expect(importNexusTimerData('[]')).toEqual([])
  })

  it('throws on malformed JSON', () => {
    expect(() => importNexusTimerData('{not json')).toThrow()
  })

  it('throws when the payload is not an array', () => {
    const json = JSON.stringify(validCube())
    expect(() => importNexusTimerData(json)).toThrow(/Invalid Nexus Timer data/)
  })

  it('throws when a top-level cube field is missing', () => {
    const { name, ...withoutName } = validCube()
    const json = JSON.stringify([withoutName])
    expect(() => importNexusTimerData(json)).toThrow(/Invalid Nexus Timer data/)
  })

  it('throws when a required solve field is missing', () => {
    const cube = validCube({ solves: { session: [{ id: 's1' }], all: [] } })
    const json = JSON.stringify([cube])
    expect(() => importNexusTimerData(json)).toThrow(/Invalid Nexus Timer data/)
  })

  it('accepts solves with the optional fields present', () => {
    const cube = validCube({
      solves: {
        session: [validSolve({ dnf: true, comment: 'lucky', updatedAt: 99, isDeleted: false })],
        all: []
      }
    })
    expect(() => importNexusTimerData(JSON.stringify([cube]))).not.toThrow()
  })

  it('accepts cubes with optional updatedAt and isDeleted', () => {
    const cube = validCube({ updatedAt: 50, isDeleted: false })
    expect(() => importNexusTimerData(JSON.stringify([cube]))).not.toThrow()
  })
})
