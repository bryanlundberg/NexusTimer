import { parseNotation } from '@/shared/lib/parseNotation'

const moves = (...list: string[]) => list.map((move) => ({ type: 'move', move }))
const group = (...list: string[]) => ({ type: 'group', moves: list })

describe('parseNotation', () => {
  it('groups known triggers in plain algorithms', () => {
    expect(parseNotation("R U R' U' M' U R U' r'")).toEqual([
      group('R', 'U', "R'", "U'"),
      ...moves("M'"),
      group('U', 'R', "U'", "r'")
    ])
  })

  it('leaves moves outside triggers ungrouped', () => {
    expect(parseNotation("R U R' U' R' F R2 U' R' U' R U R' F'")).toEqual([
      group('R', 'U', "R'", "U'"),
      ...moves("R'", 'F', 'R2', "U'", "R'", "U'", 'R', 'U', "R'", "F'")
    ])
  })

  it('finds sledgehammer and back-to-back triggers', () => {
    expect(parseNotation("F R U R' U' F' R' F R F'")).toEqual([
      ...moves('F'),
      group('R', 'U', "R'", "U'"),
      ...moves("F'"),
      group("R'", 'F', 'R', "F'")
    ])
  })

  it('uses the parentheses already in the data instead of trigger detection', () => {
    expect(parseNotation("y (R' D R) U' (R' D' R)")).toEqual([
      ...moves('y'),
      group("R'", 'D', 'R'),
      ...moves("U'"),
      group("R'", "D'", 'R')
    ])
    expect(parseNotation("(R U R' U') (R)")).toEqual([group('R', 'U', "R'", "U'"), group('R')])
  })

  it('treats square-1 turns as moves, not groups', () => {
    expect(parseNotation('(1,0) / (3,0) / (-1,0)')).toEqual(moves('(1,0)', '/', '(3,0)', '/', '(-1,0)'))
  })

  it('flattens a group that never closes', () => {
    expect(parseNotation("U (R U R'")).toEqual(moves('U', 'R', 'U', "R'"))
  })

  it('keeps megaminx and wide moves intact', () => {
    expect(parseNotation("R++ D-- U' Rw2 3Rw'")).toEqual(moves('R++', 'D--', "U'", 'Rw2', "3Rw'"))
  })

  it('skips trigger detection when disabled', () => {
    expect(parseNotation("R U R' U'", { triggers: false })).toEqual(moves('R', 'U', "R'", "U'"))
  })

  it('ignores extra whitespace and empty input', () => {
    expect(parseNotation('  R   U2 ')).toEqual(moves('R', 'U2'))
    expect(parseNotation('')).toEqual([])
  })
})
