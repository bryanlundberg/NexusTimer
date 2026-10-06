export const ALGORITHM_SET_CATALOG = [
  {
    slug: 'pbl',
    goal: 'full',
    title: 'PBL',
    subtitle: 'Permute Both Layers',
    puzzle: '2x2x2',
    difficulty: 1,
    virtualization: {
      experimentalStickering: 'full',
      puzzle: '2x2x2',
      visualization: '3D',
      experimentalDragInput: 'none'
    },
    file: 'pbl.ts'
  },
  {
    slug: 'ocll',
    goal: 'oll',
    title: 'OCLL',
    subtitle: 'Orient Corners of the Last Layer',
    difficulty: 1,
    virtualization: {
      experimentalStickering: 'OLL',
      puzzle: '2x2x2'
    },
    file: 'ocll.ts',
    puzzle: '2x2x2'
  },
  {
    slug: 'cll',
    goal: 'full',
    title: 'CLL',
    subtitle: 'Corners of the Last Layer',
    puzzle: '2x2x2',
    difficulty: 2,
    virtualization: {
      experimentalStickering: 'full',
      puzzle: '2x2x2'
    },
    file: 'cll.ts'
  },
  {
    slug: 'eg-1',
    goal: 'full',
    title: 'EG-1',
    subtitle: 'EG-1 Algorithms',
    puzzle: '2x2x2',
    difficulty: 2,
    virtualization: {
      experimentalStickering: 'full',
      puzzle: '2x2x2',
      visualization: '3D'
    },
    file: 'eg-1.ts'
  },
  {
    slug: 'eg-2',
    goal: 'full',
    title: 'EG-2',
    subtitle: 'EG-2 Algorithms',
    puzzle: '2x2x2',
    difficulty: 2,
    virtualization: {
      experimentalStickering: 'full',
      puzzle: '2x2x2',
      visualization: '3D'
    },
    file: 'eg-2.ts'
  },
  {
    slug: 'f2l',
    goal: 'f2l',
    title: 'F2L',
    subtitle: 'First Two Layers',
    puzzle: '3x3x3',
    difficulty: 2,
    virtualization: {
      experimentalStickering: 'F2L',
      visualization: '3D'
    },
    file: 'f2l.ts'
  },
  {
    slug: 'advanced-f2l',
    goal: 'f2l',
    title: 'Advanced F2L',
    subtitle: 'Advanced First Two Layers',
    puzzle: '3x3x3',
    difficulty: 3,
    virtualization: {
      experimentalStickering: 'F2L',
      visualization: '3D'
    },
    file: 'advanced-f2l.ts'
  },
  {
    slug: 'oll',
    goal: 'oll',
    title: 'OLL',
    subtitle: 'Orientation of the Last Layer',
    puzzle: '3x3x3',
    difficulty: 1,
    virtualization: {
      experimentalStickering: 'OLL'
    },
    file: 'oll.ts'
  },
  {
    slug: 'pll',
    goal: 'full',
    title: 'PLL',
    subtitle: 'Permutation of the Last Layer',
    puzzle: '3x3x3',
    difficulty: 1,
    virtualization: {
      experimentalStickering: 'PLL'
    },
    file: 'pll.ts'
  },
  {
    slug: 'coll',
    goal: 'oll+cp',
    title: 'COLL',
    subtitle: 'Corners of the Last Layer',
    puzzle: '3x3x3',
    difficulty: 2,
    virtualization: {
      experimentalStickering: 'PLL'
    },
    file: 'coll.ts'
  },
  {
    slug: 'ble',
    goal: 'oll',
    title: 'BLE',
    subtitle: "Brooks' Last Edge",
    puzzle: '3x3x3',
    difficulty: 2,
    file: 'ble.ts',
    virtualization: {
      experimentalStickering: 'OLL'
    }
  },
  {
    slug: 'vls',
    goal: 'oll',
    title: 'VLS',
    subtitle: 'Valk Last Slot',
    puzzle: '3x3x3',
    difficulty: 2,
    virtualization: {
      experimentalStickering: 'OLL',
      visualization: '3D',
      experimentalDragInput: 'none'
    },
    file: 'vls.ts'
  },
  {
    slug: 'cls',
    goal: 'oll',
    title: 'CLS',
    subtitle: 'Corners and Last Slot',
    puzzle: '3x3x3',
    difficulty: 2,
    virtualization: {
      experimentalStickering: 'OLL',
      visualization: '3D',
      experimentalDragInput: 'none'
    },
    file: 'cls.ts'
  },
  {
    slug: 'sv',
    goal: 'oll',
    title: 'SV',
    subtitle: 'Summer Variation',
    puzzle: '3x3x3',
    difficulty: 2,
    virtualization: {
      experimentalStickering: 'OLL',
      visualization: '3D',
      experimentalDragInput: 'none'
    },
    file: 'sv.ts'
  },
  {
    slug: 'wv',
    goal: 'oll',
    title: 'WV',
    subtitle: 'Winter Variation',
    puzzle: '3x3x3',
    difficulty: 2,
    virtualization: {
      experimentalStickering: 'full',
      visualization: 'experimental-2D-LL',
      experimentalDragInput: 'none'
    },
    file: 'wv.ts'
  },
  {
    slug: 'zbll-s',
    goal: 'full',
    title: 'ZBLL-S',
    subtitle: 'ZBLL Sune',
    puzzle: '3x3x3',
    difficulty: 3,
    virtualization: {
      experimentalStickering: 'PLL'
    },
    file: 'zbll-s.ts'
  },
  {
    slug: 'zbll-as',
    goal: 'full',
    title: 'ZBLL-AS',
    subtitle: 'ZBLL Antisune',
    puzzle: '3x3x3',
    difficulty: 3,
    virtualization: {
      experimentalStickering: 'PLL'
    },
    file: 'zbll-as.ts'
  },
  {
    slug: 'zbll-u',
    goal: 'full',
    title: 'ZBLL-U',
    subtitle: 'ZBLL U',
    puzzle: '3x3x3',
    difficulty: 3,
    virtualization: {
      experimentalStickering: 'PLL'
    },
    file: 'zbll-u.ts'
  },
  {
    slug: 'zbll-t',
    goal: 'full',
    title: 'ZBLL-T',
    subtitle: 'ZBLL T',
    puzzle: '3x3x3',
    difficulty: 3,
    virtualization: {
      experimentalStickering: 'PLL'
    },
    file: 'zbll-t.ts'
  },
  {
    slug: 'zbll-pi',
    goal: 'full',
    title: 'ZBLL-PI',
    subtitle: 'ZBLL PI',
    puzzle: '3x3x3',
    difficulty: 3,
    virtualization: {
      experimentalStickering: 'PLL'
    },
    file: 'zbll-pi.ts'
  },
  {
    slug: 'zbll-l',
    goal: 'full',
    title: 'ZBLL-L',
    subtitle: 'ZBLL L',
    puzzle: '3x3x3',
    difficulty: 3,
    virtualization: {
      experimentalStickering: 'PLL'
    },
    file: 'zbll-l.ts'
  },
  {
    slug: 'zbll-h',
    goal: 'full',
    title: 'ZBLL-H',
    subtitle: 'ZBLL H',
    puzzle: '3x3x3',
    difficulty: 3,
    virtualization: {
      experimentalStickering: 'PLL'
    },
    file: 'zbll-h.ts'
  },
  {
    slug: 'parity-4x4',
    goal: 'full',
    title: 'Parity-4x4',
    subtitle: '4x4 Parity Algorithms',
    puzzle: '4x4x4',
    difficulty: 1,
    virtualization: {
      experimentalStickering: 'full',
      puzzle: '4x4x4',
      visualization: '3D',
      experimentalDragInput: 'none'
    },
    file: 'parity-4x4.ts'
  },
  {
    slug: 'parity-5x5',
    goal: 'full',
    title: 'Parity-5x5',
    subtitle: '5x5 Parity Algorithms',
    puzzle: '5x5x5',
    difficulty: 1,
    virtualization: {
      experimentalStickering: 'full',
      puzzle: '5x5x5',
      visualization: '3D',
      experimentalDragInput: 'none'
    },
    file: 'parity-5x5.ts'
  },
  {
    slug: 'l2c-5x5',
    goal: 'full',
    title: 'L2C',
    subtitle: 'Last Two Centers (5x5)',
    puzzle: '5x5x5',
    difficulty: 2,
    virtualization: {
      experimentalStickering: 'centers-only',
      puzzle: '5x5x5',
      visualization: '3D',
      experimentalDragInput: 'none'
    },
    file: 'l2c-555.ts'
  },
  {
    slug: 'l2e-5x5',
    goal: 'full',
    title: 'L2E',
    subtitle: 'Last Two Edges (5x5)',
    puzzle: '5x5x5',
    difficulty: 2,
    virtualization: {
      experimentalStickering: 'L2E',
      puzzle: '5x5x5',
      visualization: 'experimental-2D-LL',
      experimentalDragInput: 'none'
    },
    file: 'l2e-555.ts'
  },
  {
    slug: 'l4e',
    goal: 'full',
    title: 'L4E',
    subtitle: 'Last 4 Edges (Pyraminx)',
    puzzle: 'pyraminx',
    difficulty: 2,
    virtualization: {
      experimentalStickering: 'full',
      puzzle: 'pyraminx',
      visualization: '3D',
      experimentalDragInput: 'none',
      cameraLongitude: 45
    },
    file: 'l4e.ts'
  },
  {
    slug: 'sq1-cs',
    goal: 'full',
    title: 'CS',
    subtitle: 'Cube Shape',
    puzzle: 'square1',
    difficulty: 2,
    virtualization: {
      experimentalStickering: 'full',
      puzzle: 'square1',
      visualization: '2D',
      experimentalDragInput: 'none'
    },
    file: 'sq1cs.ts'
  },
  {
    slug: 'sq1-co',
    goal: 'full',
    title: 'CO',
    subtitle: 'Corner Orientation',
    puzzle: 'square1',
    difficulty: 2,
    virtualization: {
      experimentalStickering: 'full',
      puzzle: 'square1',
      visualization: '2D',
      experimentalDragInput: 'none'
    },
    file: 'sq1co.ts'
  },
  {
    slug: 'sq1-eo',
    goal: 'full',
    title: 'EO',
    subtitle: 'Edge Orientation',
    puzzle: 'square1',
    difficulty: 2,
    virtualization: {
      experimentalStickering: 'full',
      puzzle: 'square1',
      visualization: '2D',
      experimentalDragInput: 'none'
    },
    file: 'sq1eo.ts'
  },
  {
    slug: 'sq1-cp',
    goal: 'full',
    title: 'CP',
    subtitle: 'Corner Permutation',
    puzzle: 'square1',
    difficulty: 3,
    virtualization: {
      experimentalStickering: 'full',
      puzzle: 'square1',
      visualization: '2D',
      experimentalDragInput: 'none'
    },
    file: 'sq1cp.ts'
  },
  {
    slug: 'sq1-ep',
    goal: 'full',
    title: 'EP',
    subtitle: 'Edge Permutation',
    puzzle: 'square1',
    difficulty: 3,
    virtualization: {
      experimentalStickering: 'full',
      puzzle: 'square1',
      visualization: '2D',
      experimentalDragInput: 'none'
    },
    file: 'sq1ep.ts'
  },
  {
    slug: 'sq1-parity',
    goal: 'full',
    title: 'Parity-SQ1',
    subtitle: 'Parity',
    puzzle: 'square1',
    difficulty: 3,
    virtualization: {
      experimentalStickering: 'full',
      puzzle: 'square1',
      visualization: 'experimental-2D-LL',
      experimentalDragInput: 'none'
    },
    file: 'sq1parity.ts'
  },
  {
    slug: 'megaminx-eo',
    goal: 'full',
    title: 'EO',
    subtitle: 'Edge Orientation',
    puzzle: 'megaminx',
    difficulty: 1,
    virtualization: {
      experimentalStickering: 'OLL-EO',
      puzzle: 'megaminx',
      visualization: 'experimental-2D-LL',
      experimentalDragInput: 'none'
    },
    file: 'megaminx-eo.ts'
  },
  {
    slug: 'megaminx-ep',
    goal: 'full',
    title: 'EP',
    subtitle: 'Edge Permutation',
    puzzle: 'megaminx',
    difficulty: 2,
    virtualization: {
      experimentalStickering: 'PLL-EO',
      puzzle: 'megaminx',
      visualization: 'experimental-2D-LL',
      experimentalDragInput: 'none'
    },
    file: 'megaminx-ep.ts'
  },
  {
    slug: 'megaminx-co',
    goal: 'full',
    title: 'CO',
    subtitle: 'Corner Orientation',
    puzzle: 'megaminx',
    difficulty: 2,
    virtualization: {
      experimentalStickering: 'OLL-CO',
      puzzle: 'megaminx',
      visualization: 'experimental-2D-LL',
      experimentalDragInput: 'none'
    },
    file: 'megaminx-co.ts'
  },
  {
    slug: 'megaminx-cp',
    goal: 'full',
    title: 'CP',
    subtitle: 'Corner Permutation',
    puzzle: 'megaminx',
    difficulty: 3,
    virtualization: {
      experimentalStickering: 'PLL-CP', // TODO: Update cubing.js package with case PLL-CP, now shows default
      puzzle: 'megaminx',
      visualization: 'experimental-2D-LL',
      experimentalDragInput: 'none'
    },
    file: 'megaminx-cp.ts'
  }
] as const

export type AlgorithmSetSlug = (typeof ALGORITHM_SET_CATALOG)[number]['slug']
