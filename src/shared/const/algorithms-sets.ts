import { Grid2x2Icon, Grid2x2Plus, Grid3x3, TriangleIcon } from 'lucide-react'
import { PBL_ALGS } from '@/shared/data/algs/pbl'
import { OCLL_ALGS } from '@/shared/data/algs/ocll'
import { OLL_ALGS } from '@/shared/data/algs/oll'
import { PLL_ALGS } from '@/shared/data/algs/pll'
import { COLL_ALGS } from '@/shared/data/algs/coll'
import { BLE_ALGS } from '@/shared/data/algs/ble'
import { VLS_ALGS } from '@/shared/data/algs/vls'
import { CLS_ALGS } from '@/shared/data/algs/cls'
import { WV_ALGS } from '@/shared/data/algs/vw'
import { PARITY_444_ALGS } from '@/shared/data/algs/parity-444'
import { PARITY_555_ALGS } from '@/shared/data/algs/parity-555'
import { CLL_ALGS } from '@/shared/data/algs/cll'
import { EG_1_ALGS } from '@/shared/data/algs/eg-1'
import { EG_2_ALGS } from '@/shared/data/algs/eg-2'
import { L4E_ALGS } from '@/shared/data/algs/l4e'
import { ZBLL_AS_ALGS } from '@/shared/data/algs/zbll-as'
import { ZBLL_S_ALGS } from '@/shared/data/algs/zbll-s'
import { ZBLL_H_ALGS } from '@/shared/data/algs/zbll-h'
import { ZBLL_L_ALGS } from '@/shared/data/algs/zbll-l'
import { ZBLL_PI_ALGS } from '@/shared/data/algs/zbll-pi'
import { ZBLL_U_ALGS } from '@/shared/data/algs/zbll-u'
import { ZBLL_T_ALGS } from '@/shared/data/algs/zbll-t'

export const ALGORITHM_SETS = [
  {
    slug: 'pbl',
    title: 'PBL',
    subtitle: 'Permute Both Layers',
    puzzle: '2x2x2',
    algorithms: PBL_ALGS,
    Icon: Grid2x2Icon,
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
    title: 'OCLL',
    subtitle: 'Orient Corners of the Last Layer',
    algorithms: OCLL_ALGS,
    Icon: Grid2x2Icon,
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
    title: 'CLL',
    subtitle: 'Corners of the Last Layer',
    puzzle: '2x2x2',
    algorithms: CLL_ALGS,
    Icon: Grid2x2Icon,
    difficulty: 2,
    virtualization: {
      experimentalStickering: 'full',
      puzzle: '2x2x2'
    },
    file: 'cll.ts'
  },
  {
    slug: 'eg-1',
    title: 'EG-1',
    subtitle: 'EG-1 Algorithms',
    puzzle: '2x2x2',
    algorithms: EG_1_ALGS,
    Icon: Grid2x2Icon,
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
    title: 'EG-2',
    subtitle: 'EG-2 Algorithms',
    puzzle: '2x2x2',
    algorithms: EG_2_ALGS,
    Icon: Grid2x2Icon,
    difficulty: 2,
    virtualization: {
      experimentalStickering: 'full',
      puzzle: '2x2x2',
      visualization: '3D'
    },
    file: 'eg-2.ts'
  },
  {
    slug: 'oll',
    title: 'OLL',
    subtitle: 'Orientation of the Last Layer',
    puzzle: '3x3x3',
    algorithms: OLL_ALGS,
    Icon: Grid3x3,
    difficulty: 1,
    virtualization: {
      experimentalStickering: 'OLL'
    },
    file: 'oll.ts'
  },
  {
    slug: 'pll',
    title: 'PLL',
    subtitle: 'Permutation of the Last Layer',
    puzzle: '3x3x3',
    algorithms: PLL_ALGS,
    Icon: Grid3x3,
    difficulty: 1,
    virtualization: {
      experimentalStickering: 'PLL'
    },
    file: 'pll.ts'
  },
  {
    slug: 'coll',
    title: 'COLL',
    subtitle: 'Corners of the Last Layer',
    puzzle: '3x3x3',
    algorithms: COLL_ALGS,
    Icon: Grid3x3,
    difficulty: 2,
    virtualization: {
      experimentalStickering: 'PLL'
    },
    file: 'coll.ts'
  },
  {
    slug: 'ble',
    title: 'BLE',
    subtitle: "Brooks' Last Edge",
    puzzle: '3x3x3',
    algorithms: BLE_ALGS,
    Icon: Grid3x3,
    difficulty: 2,
    file: 'ble.ts',
    virtualization: {
      experimentalStickering: 'OLL'
    }
  },
  {
    slug: 'vls',
    title: 'VLS',
    subtitle: 'Valk Last Slot',
    puzzle: '3x3x3',
    algorithms: VLS_ALGS,
    Icon: Grid3x3,
    difficulty: 2,
    virtualization: {
      experimentalStickering: 'OLL',
      visualization: '3D',
      experimentalDragInput: 'none',
      hintFacelets: 'none'
    },
    file: 'vls.ts'
  },
  {
    slug: 'cls',
    title: 'CLS',
    subtitle: 'Corners and Last Slot',
    puzzle: '3x3x3',
    algorithms: CLS_ALGS,
    Icon: Grid3x3,
    difficulty: 2,
    virtualization: {
      experimentalStickering: 'OLL',
      visualization: '3D',
      experimentalDragInput: 'none',
      hintFacelets: 'none'
    },
    file: 'cls.ts'
  },
  {
    slug: 'wv',
    title: 'WV',
    subtitle: 'Winter Variation',
    puzzle: '3x3x3',
    algorithms: WV_ALGS,
    Icon: Grid3x3,
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
    title: 'ZBLL-S',
    subtitle: 'ZBLL Sune',
    puzzle: '3x3x3',
    algorithms: ZBLL_S_ALGS,
    Icon: Grid3x3,
    difficulty: 3,
    virtualization: {
      experimentalStickering: 'PLL'
    },
    file: 'zbll-s.ts'
  },
  {
    slug: 'zbll-as',
    title: 'ZBLL-AS',
    subtitle: 'ZBLL Antisune',
    puzzle: '3x3x3',
    algorithms: ZBLL_AS_ALGS,
    Icon: Grid3x3,
    difficulty: 3,
    virtualization: {
      experimentalStickering: 'PLL'
    },
    file: 'zbll-as.ts'
  },
  {
    slug: 'zbll-u',
    title: 'ZBLL-U',
    subtitle: 'ZBLL U',
    puzzle: '3x3x3',
    algorithms: ZBLL_U_ALGS,
    Icon: Grid3x3,
    difficulty: 3,
    virtualization: {
      experimentalStickering: 'PLL'
    },
    file: 'zbll-u.ts'
  },
  {
    slug: 'zbll-t',
    title: 'ZBLL-T',
    subtitle: 'ZBLL T',
    puzzle: '3x3x3',
    algorithms: ZBLL_T_ALGS,
    Icon: Grid3x3,
    difficulty: 3,
    virtualization: {
      experimentalStickering: 'PLL'
    },
    file: 'zbll-t.ts'
  },
  {
    slug: 'zbll-pi',
    title: 'ZBLL-PI',
    subtitle: 'ZBLL PI',
    puzzle: '3x3x3',
    algorithms: ZBLL_PI_ALGS,
    Icon: Grid3x3,
    difficulty: 3,
    virtualization: {
      experimentalStickering: 'PLL'
    },
    file: 'zbll-pi.ts'
  },
  {
    slug: 'zbll-l',
    title: 'ZBLL-L',
    subtitle: 'ZBLL L',
    puzzle: '3x3x3',
    algorithms: ZBLL_L_ALGS,
    Icon: Grid3x3,
    difficulty: 3,
    virtualization: {
      experimentalStickering: 'PLL'
    },
    file: 'zbll-l.ts'
  },
  {
    slug: 'zbll-h',
    title: 'ZBLL-H',
    subtitle: 'ZBLL H',
    puzzle: '3x3x3',
    algorithms: ZBLL_H_ALGS,
    Icon: Grid3x3,
    difficulty: 3,
    virtualization: {
      experimentalStickering: 'PLL'
    },
    file: 'zbll-h.ts'
  },
  {
    slug: 'parity-4x4',
    title: 'Parity-4x4',
    subtitle: '4x4 Parity Algorithms',
    puzzle: '4x4x4',
    algorithms: PARITY_444_ALGS,
    Icon: Grid2x2Plus,
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
    title: 'Parity-5x5',
    subtitle: '5x5 Parity Algorithms',
    puzzle: '5x5x5',
    algorithms: PARITY_555_ALGS,
    Icon: Grid2x2Plus,
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
    slug: 'l4e',
    title: 'L4E',
    subtitle: 'Last 4 slots (Pyraminx)',
    puzzle: 'pyraminx',
    algorithms: L4E_ALGS,
    Icon: TriangleIcon,
    difficulty: 2,
    virtualization: {
      experimentalStickering: 'full',
      puzzle: 'pyraminx',
      visualization: '3D',
      experimentalDragInput: 'none',
      cameraLongitude: 45
    },
    file: 'l4e.ts'
  }
] as const

export type ALGORITHM_SET = (typeof ALGORITHM_SETS)[number]
