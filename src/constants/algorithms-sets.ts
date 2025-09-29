import { Grid2x2Icon, Grid2x2Plus, Grid3x3 } from 'lucide-react';
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
    description: "Brooks' Last Edge",
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
  }
] as const;

export type ALGORITHM_SET = (typeof ALGORITHM_SETS)[number];
