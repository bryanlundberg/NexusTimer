import { Grid2x2Icon, Grid2x2Plus, Grid3x3, TriangleIcon } from 'lucide-react';
import { PBL_ALGS } from '@/algs/pbl';
import { OCLL_ALGS } from '@/algs/ocll';
import { OLL_ALGS } from '@/algs/oll';
import { PLL_ALGS } from '@/algs/pll';
import { COLL_ALGS } from '@/algs/coll';
import { BLE_ALGS } from '@/algs/ble';
import { VLS_ALGS } from '@/algs/vls';
import { CLS_ALGS } from '@/algs/cls';
import { WV_ALGS } from '@/algs/vw';
import { PARITY_444_ALGS } from '@/algs/parity-444';
import { PARITY_555_ALGS } from '@/algs/parity-555';
import { CLL_ALGS } from '@/algs/cll';
import { EG_1_ALGS } from '@/algs/eg-1';
import { EG_2_ALGS } from '@/algs/eg-2';
import { L4E_ALGS } from '@/algs/l4e';
import { ZBLL_AS_ALGS } from '@/algs/zbll-as';
import { ZBLL_S_ALGS } from '@/algs/zbll-s';
import { ZBLL_H_ALGS } from '@/algs/zbll-h';
import { ZBLL_L_ALGS } from '@/algs/zbll-l';
import { ZBLL_PI_ALGS } from '@/algs/zbll-pi';
import { ZBLL_U_ALGS } from '@/algs/zbll-u';
import { ZBLL_T_ALGS } from '@/algs/zbll-t';

export const ALGORITHM_SETS = [
  {
    slug: 'pbl',
    title: 'PBL',
    subtitle: 'Permute Both Layers',
    puzzle: '2x2x2',
    algorithms: PBL_ALGS,
    Icon: Grid2x2Icon,
    difficulty: 1,
    description: 'These algorithms are used to permute both the top and bottom layers of a 2x2 cube simultaneously, allowing for efficient solving of the puzzle.',
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
      puzzle: '2x2x2',
    },
    description: 'COLL (Orient Corners of the Last Layer) - This step focuses on orienting all the corners of the last layer to prepare for the final steps of solving the puzzle.',
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
      puzzle: '2x2x2',
    },
    description: 'CLL is a subset of OLL for 2x2x2 cubes that solves the last layer in one algorithm after orienting the first layer.',
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
      visualization: '3D',
    },
    description: 'EG-1 is a set of algorithms used to solve the last layer of a 2x2 cube after the first layer is completed, specifically when there is an adjacent swap on the bottom layer.',
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
      visualization: '3D',
    },
    description: 'EG-2 is a set of algorithms used to solve the last layer of a 2x2 cube after the first layer is completed, specifically when there is a diagonal swap on the bottom layer.',
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
      experimentalStickering: 'OLL',
    },
    description: 'The OLL (Orientation of Last Layer) algorithms for solving the Rubik\'s cube with the CFOP method. These algorithms are used to orient all of the pieces on the last layer, once the F2L is complete.',
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
      experimentalStickering: 'PLL',
    },
    description: 'The PLL (Permutation of Last Layer) algorithms for solving the Rubik\'s cube with the CFOP method. These algorithms are used for the final step of the CFOP method, to permute the edges and corners of the last layer, once all pieces are oriented.',
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
      experimentalStickering: 'PLL',
    },
    description: 'COLL (Corners and Orientation of Last Layer) algorithms are used to orient and permute the corners of your last layer at the same time, presuming that all of your last layer edges are already oriented.',
    file: 'coll.ts'
  },
  {
    slug: 'ble',
    title: 'BLE',
    subtitle: 'Brooks\' Last Edge',
    puzzle: '3x3x3',
    algorithms: BLE_ALGS,
    Icon: Grid3x3,
    difficulty: 2,
    description: 'Brooks\' Last Edge (BLE) is a method used to solve the last edge of the Rubik\'s Cube efficiently, often as part of advanced solving techniques.',
    file: 'ble.ts',
    virtualization: {
      experimentalStickering: 'OLL',
    },
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
    description: 'VLS (Valk Last Slot) algorithms solve the final F2L slot and OLL at the same time, in the cases where you have a connected F2L pair. This selection of algorithms serves as an introduction to the full VLS algorithm set, and aims to highlight the most useful cases to know.',
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
      hintFacelets: 'none',
    },
    description: 'CLS (Corner Last Slot) algorithms solve the last F2L corner and orient your last layer at the same time. They are used when the edge of your final F2L pair is already solved, and the last layer edges are oriented. This selection of algorithms serves as an introduction to the full CLS algorithm set, and aims to highlight the most useful cases to know.',
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
      experimentalDragInput: 'none',
    },
    description: 'WV (Winter Variation) algorithms are used to orient the corners of your last layer whilst you insert your final F2L pair, in the case where the pair is connected and where all of the last layer edges are already oriented.',
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
      experimentalStickering: 'PLL',
    },
    description: 'ZBLL Sune (ZBLL-S) is a subset of the ZBLL method for solving the last layer of a Rubik\'s Cube. It focuses on cases where the corners are in a sune configuration, allowing for efficient algorithms to solve the entire last layer in one move sequence.',
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
      experimentalStickering: 'PLL',
    },
    description: 'ZBLL Antisune (ZBLL-AS) is a subset of the ZBLL method for solving the last layer of a Rubik\'s Cube. It focuses on cases where the corners are in an antisune configuration, allowing for efficient algorithms to solve the entire last layer in one move sequence.',
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
      experimentalStickering: 'PLL',
    },
    description: 'ZBLL U (ZBLL-U) is a subset of the ZBLL method for solving the last layer of a Rubik\'s Cube. It focuses on cases where the corners are in a U configuration, allowing for efficient algorithms to solve the entire last layer in one move sequence.',
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
      experimentalStickering: 'PLL',
    },
    description: 'ZBLL T (ZBLL-T) is a subset of the ZBLL method for solving the last layer of a Rubik\'s Cube. It focuses on cases where the corners are in a T configuration, allowing for efficient algorithms to solve the entire last layer in one move sequence.',
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
      experimentalStickering: 'PLL',
    },
    description: 'ZBLL PI (ZBLL-PI) is a subset of the ZBLL method for solving the last layer of a Rubik\'s Cube. It focuses on cases where the corners are in a PI configuration, allowing for efficient algorithms to solve the entire last layer in one move sequence.',
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
      experimentalStickering: 'PLL',
    },
    description: 'ZBLL L (ZBLL-L) is a subset of the ZBLL method for solving the last layer of a Rubik\'s Cube. It focuses on cases where the corners are in an L configuration, allowing for efficient algorithms to solve the entire last layer in one move sequence.',
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
      experimentalStickering: 'PLL',
    },
    description: 'ZBLL H (ZBLL-H) is a subset of the ZBLL method for solving the last layer of a Rubik\'s Cube. It focuses on cases where the corners are in an H configuration, allowing for efficient algorithms to solve the entire last layer in one move sequence.',
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
    description: 'These algorithms address the unique parity errors that can occur when solving a 4x4 Rubik\'s Cube, which do not happen on a standard 3x3 cube. They are essential for completing the solve after reducing the 4x4 to a 3x3 state.',
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
    description: 'These algorithms address the unique parity errors that can occur when solving a 5x5 Rubik\'s Cube, which do not happen on a standard 3x3 cube. They are essential for completing the solve after reducing the 5x5 to a 3x3 state.',
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
      cameraLongitude: 45,
    },
    description: 'Last 4 slots (Pyraminx) - These algorithms are used to solve the last four edge pieces of a Pyraminx puzzle. The goal is to position and orient these pieces correctly to complete the puzzle.',
    file: 'l4e.ts'
  }
] as const;

export type ALGORITHM_SET = (typeof ALGORITHM_SETS)[number];
