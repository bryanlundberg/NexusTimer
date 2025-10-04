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
    slug: '/algorithms/pbl',
    title: 'PBL',
    description: 'Permute Both Layers',
    cube: '2x2',
    total: PBL_ALGS.length,
    Icon: Grid2x2Icon,
    difficulty: 1,
  },
  {
    slug: '/algorithms/ocll',
    title: 'OCLL',
    description: 'Orient Corners of the Last Layer',
    cube: '2x2',
    total: OCLL_ALGS.length,
    Icon: Grid2x2Icon,
    difficulty: 1,
  },
  {
    slug: '/algorithms/cll',
    title: 'CLL',
    description: 'Corners of the Last Layer',
    cube: '2x2',
    total: CLL_ALGS.length,
    Icon: Grid2x2Icon,
    difficulty: 2,
  },
  {
    slug: '/algorithms/eg-1',
    title: 'EG-1',
    description: 'EG-1 Algorithms',
    cube: '2x2',
    total: EG_1_ALGS.length,
    Icon: Grid2x2Icon,
    difficulty: 2,
  },
  {
    slug: '/algorithms/eg-2',
    title: 'EG-2',
    description: 'EG-2 Algorithms',
    cube: '2x2',
    total: EG_2_ALGS.length,
    Icon: Grid2x2Icon,
    difficulty: 2,
  },
  {
    slug: '/algorithms/oll',
    title: 'OLL',
    description: 'Orientation of the Last Layer',
    cube: '3x3',
    total: OLL_ALGS.length,
    Icon: Grid3x3,
    difficulty: 1,
  },
  {
    slug: '/algorithms/pll',
    title: 'PLL',
    description: 'Permutation of the Last Layer',
    cube: '3x3',
    total: PLL_ALGS.length,
    Icon: Grid3x3,
    difficulty: 1,
  },
  {
    slug: '/algorithms/coll',
    title: 'COLL',
    description: 'Corners of the Last Layer',
    cube: '3x3',
    total: COLL_ALGS.length,
    Icon: Grid3x3,
    difficulty: 2,
  },
  {
    slug: '/algorithms/ble',
    title: 'BLE',
    description: 'Brooks\' Last Edge',
    cube: '3x3',
    total: BLE_ALGS.length,
    Icon: Grid3x3,
    difficulty: 2,
  },
  {
    slug: '/algorithms/vls',
    title: 'VLS',
    description: 'Valk Last Slot',
    cube: '3x3',
    total: VLS_ALGS.length,
    Icon: Grid3x3,
    difficulty: 2,
  },
  {
    slug: '/algorithms/cls',
    title: 'CLS',
    description: 'Corners and Last Slot',
    cube: '3x3',
    total: CLS_ALGS.length,
    Icon: Grid3x3,
    difficulty: 2,
  },
  {
    slug: '/algorithms/wv',
    title: 'WV',
    description: 'Winter Variation',
    cube: '3x3',
    total: WV_ALGS.length,
    Icon: Grid3x3,
    difficulty: 2,
  },
  {
    slug: '/algorithms/zbll-s',
    title: 'ZBLL-S',
    description: 'ZBLL Sune',
    cube: '3x3',
    total: ZBLL_S_ALGS.length,
    Icon: Grid3x3,
    difficulty: 3,
  },
  {
    slug: '/algorithms/zbll-as',
    title: 'ZBLL-AS',
    description: 'ZBLL Antisune',
    cube: '3x3',
    total: ZBLL_AS_ALGS.length,
    Icon: Grid3x3,
    difficulty: 3,
  },
  {
    slug: '/algorithms/zbll-u',
    title: 'ZBLL-U',
    description: 'ZBLL U',
    cube: '3x3',
    total: ZBLL_U_ALGS.length,
    Icon: Grid3x3,
    difficulty: 3,
  },
  {
    slug: '/algorithms/zbll-t',
    title: 'ZBLL-T',
    description: 'ZBLL T',
    cube: '3x3',
    total: ZBLL_T_ALGS.length,
    Icon: Grid3x3,
    difficulty: 3,
  },
  {
    slug: '/algorithms/zbll-pi',
    title: 'ZBLL-PI',
    description: 'ZBLL PI',
    cube: '3x3',
    total: ZBLL_PI_ALGS.length,
    Icon: Grid3x3,
    difficulty: 3,
  },
  {
    slug: '/algorithms/zbll-l',
    title: 'ZBLL-L',
    description: 'ZBLL L',
    cube: '3x3',
    total: ZBLL_L_ALGS.length,
    Icon: Grid3x3,
    difficulty: 3,
  },
  {
    slug: '/algorithms/zbll-h',
    title: 'ZBLL-H',
    description: 'ZBLL H',
    cube: '3x3',
    total: ZBLL_H_ALGS.length,
    Icon: Grid3x3,
    difficulty: 3,
  },
  {
    slug: '/algorithms/parity-4x4',
    title: 'Parity-4x4',
    description: '4x4 Parity Algorithms',
    cube: '4x4',
    total: PARITY_444_ALGS.length,
    Icon: Grid2x2Plus,
    difficulty: 1,
  },
  {
    slug: '/algorithms/parity-5x5',
    title: 'Parity-5x5',
    description: '5x5 Parity Algorithms',
    cube: '5x5',
    total: PARITY_555_ALGS.length,
    Icon: Grid2x2Plus,
    difficulty: 1,
  },
  {
    slug: '/algorithms/l4e',
    title: 'L4E',
    description: 'Last 4 slots (Pyraminx)',
    cube: 'pyraminx',
    total: L4E_ALGS.length,
    Icon: TriangleIcon,
    difficulty: 2,
  }
] as const;

export type ALGORITHM_SET = (typeof ALGORITHM_SETS)[number];
