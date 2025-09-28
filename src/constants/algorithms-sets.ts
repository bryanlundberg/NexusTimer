import { Grid2x2Icon, Grid3x3 } from 'lucide-react';

export const ALGORITHM_SETS = [
  {
    slug: '/algorithms/pbl',
    title: 'PBL',
    description: 'Permute Both Layers',
    cube: '2x2',
    total: 8,
    Icon: Grid2x2Icon,
    difficulty: 1,
  },
  {
    slug: '/algorithms/ocll',
    title: 'OCLL',
    description: 'Orient Corners of the Last Layer',
    cube: '2x2',
    total: 7,
    Icon: Grid2x2Icon,
    difficulty: 1,
  },
  {
    slug: '/algorithms/oll',
    title: 'OLL',
    description: 'Orientation of the Last Layer',
    cube: '3x3',
    total: 57,
    Icon: Grid3x3,
    difficulty: 1,
  },
  {
    slug: '/algorithms/pll',
    title: 'PLL',
    description: 'Permutation of the Last Layer',
    cube: '3x3',
    total: 21,
    Icon: Grid3x3,
    difficulty: 1,
  },
  {
    slug: '/algorithms/coll',
    title: 'COLL',
    description: 'Corners of the Last Layer',
    cube: '3x3',
    total: 9,
    Icon: Grid3x3,
    difficulty: 2,
  },
  {
    slug: '/algorithms/ble',
    title: 'BLE',
    description: "Brooks' Last Edge",
    cube: '3x3',
    total: 11,
    Icon: Grid3x3,
    difficulty: 2,
  }
] as const;

export type ALGORITHM_SET = (typeof ALGORITHM_SETS)[number];
