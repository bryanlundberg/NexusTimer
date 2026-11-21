import { ALGORITHM_SET_CATALOG, type CaseViz } from '@nexustimer/algorithms'
import { CUBE_STICKERING_PRESETS } from '@nexustimer/cubelet/nxn'
import { MEGAMINX_STICKERING_PRESETS } from '@nexustimer/cubelet/megaminx'
import { caseCube3d, caseImage, yellowOrientationSetupAlg, type CaseRender } from '@/shared/lib/puzzle/caseRender'
import { renderCubeImage } from '@/shared/lib/puzzle/renderCubeImage'
import { renderPuzzleImage } from '@/shared/lib/puzzle/puzzleImages'

const shapeCount = (svg: string | null) => (svg?.match(/Z/g) ?? []).length

const render = (puzzle: string, viz: CaseViz, alg = "R U R' U'"): CaseRender => ({ puzzle, viz, alg })

describe('yellowOrientationSetupAlg', () => {
  it('turns yellow up on 2x2 through 4x4 only', () => {
    for (const puzzle of ['2x2x2', '3x3x3', '4x4x4', '3x3']) expect(yellowOrientationSetupAlg(puzzle)).toBe('z2')
    for (const puzzle of ['5x5x5', 'pyraminx', 'sq1']) expect(yellowOrientationSetupAlg(puzzle)).toBe('')
  })
})

describe('caseImage', () => {
  it('draws the inverted case with yellow on top as the last layer', () => {
    expect(caseImage(render('3x3x3', { view: 'last-layer', stickering: 'OLL' }))).toBe(
      renderCubeImage({ size: 3, alg: "z2 U R U' R'", view: 'last-layer', stickering: 'OLL', lastLayer: 'D' })
    )
  })

  it('keeps the U layer on cubes that are not reoriented', () => {
    expect(caseImage(render('5x5x5', { view: 'last-layer', stickering: 'L2E' }))).toBe(
      renderCubeImage({ size: 5, alg: "U R U' R'", view: 'last-layer', stickering: 'L2E', lastLayer: 'U' })
    )
  })

  it('leaves 3D cube cases to the 3D view', () => {
    expect(caseImage(render('3x3x3', { view: '3d', stickering: 'F2L' }))).toBeNull()
  })

  it('draws megaminx cases as a last-layer view', () => {
    const viz: CaseViz = { view: 'last-layer', stickering: 'OLL-EO' }
    expect(shapeCount(caseImage(render('megaminx', viz, "F R U R' U' F'")))).toBe(26)
    expect(caseImage(render('kilominx', viz))).toBeNull()
  })

  it('draws 3D cases of puzzles without a 3D view as their net', () => {
    expect(caseImage(render('pyraminx', { view: '3d', stickering: 'full' }, "U R U' R'"))).toBe(
      renderPuzzleImage('pyraminx', "R U R' U'", 'net')
    )
  })

  it('inverts Square-1 tuples without losing their parentheses', () => {
    const viz: CaseViz = { view: 'net', stickering: 'full' }
    expect(caseImage(render('square1', viz, '/ (3,0) / (-1,1)'))).toBe(
      renderPuzzleImage('square1', '(1, -1) / (-3, 0) /', 'net')
    )
    expect(shapeCount(caseImage(render('sq1', { view: 'last-layer', stickering: 'full' }, '(1,0) / (-1,0)')))).toBe(20)
  })

  it('returns null for a case it cannot parse', () => {
    expect(caseImage(render('square1', { view: 'net', stickering: 'full' }, '1,0 / -1,0'))).toBeNull()
  })
})

describe('caseCube3d', () => {
  it('builds a yellow-oriented 3D case', () => {
    expect(caseCube3d(render('3x3x3', { view: '3d', stickering: 'F2L', dragInput: true }, "U R U' R'"))).toEqual({
      request: { size: 3, alg: "z2 R U R' U'", stickering: 'F2L', lastLayer: 'D' },
      dragInput: true
    })
  })

  it('turns drag off unless the case asks for it', () => {
    expect(caseCube3d(render('3x3x3', { view: '3d', stickering: 'CLS' }))?.dragInput).toBe(false)
  })

  it('handles bigger cubes', () => {
    expect(caseCube3d(render('5x5x5', { view: '3d', stickering: 'centers-only' }))?.request).toMatchObject({
      size: 5,
      stickering: 'centers-only',
      lastLayer: 'U'
    })
  })

  it.each([
    ['a net view', '3x3x3', 'net'],
    ['a last-layer view', '3x3x3', 'last-layer'],
    ['a puzzle that is not a cube', 'pyraminx', '3d']
  ] as const)('leaves %s alone', (_, puzzle, view) => {
    expect(caseCube3d(render(puzzle, { view, stickering: 'full' }))).toBeNull()
  })
})

describe('the set catalog', () => {
  const known = new Set<string>([...CUBE_STICKERING_PRESETS, ...MEGAMINX_STICKERING_PRESETS])

  it.each(ALGORITHM_SET_CATALOG.map((set) => [set.slug, set.viz.stickering] as const))(
    '%s uses a stickering cubelet can draw',
    (_, stickering) => {
      expect(known.has(stickering)).toBe(true)
    }
  )
})
