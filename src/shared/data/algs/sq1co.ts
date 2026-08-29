import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'SQ1CO_ALGS'
const puzzle = 'sq1'
const group = 'Corner Orientation'

export const SQ1CO_ALGS: AlgorithmCollection[] = [
  {
    name: '2-2',
    id: '50895e57-6e87-465b-bc2c-b11f877fe6f3',
    idMethod,
    puzzle,
    group,
    setup: '(1,0) / (-1,0)',
    algs: [{ moves: '(1,0) / (-1,0)', id: 'b1d09875-4845-4cd8-9d34-fd8c495b52e6' }]
  },
  {
    name: '3-1',
    id: 'f7dbf9b0-9267-45de-9501-764a0b0c28d9',
    idMethod,
    puzzle,
    group,
    setup: '(1,0) / (-3,0) / (-1,0)',
    algs: [
      { moves: '(1,0) / (3,0) / (-1,0)', id: '3460dfda-eee6-4909-bd09-595e0e541d32' },
      { moves: '(1,0) / (-3,0) / (-1,0)', id: '07f3537b-7005-4541-9309-868609107e3d' },
      { moves: '(1,0) / (0,3) / (-1,0)', id: '576a3c0e-a96b-485a-9900-3da0ac91af6a' },
      { moves: '(1,0) / (0,-3) / (-1,0)', id: '855f7ca5-b19a-4b0d-8357-e6dc1000b179' }
    ]
  },
  {
    name: 'Opp / Opp',
    id: '260f315e-c581-4a28-8dee-4536997da17a',
    idMethod,
    puzzle,
    group,
    setup: '(1,0) / (-3,-3) / (-1,0)',
    algs: [
      { moves: '(1,0) / (3,3) / (-1,0)', id: '263bd35f-6ad4-42d9-8549-f7888b5f7c5e' },
      { moves: '(1,0) / (-3,-3) / (-1,0)', id: '9c9eb0fc-a7c6-40e4-9a5d-056d16c95a69' }
    ]
  },
  {
    name: 'Adj / Opp',
    id: '02c44000-0bb2-4100-9b73-2874dcb6f7a3',
    idMethod,
    puzzle,
    group,
    setup: '(1,0) / (0,-3) / (0,-3) / (-1,0)',
    algs: [
      { moves: '(1,0) / (0,3) / (0,3) / (-1,0)', id: '3b714aee-9f1a-4425-bac1-a3850a1c0ae0' },
      { moves: '(1,0) / (0,-3) / (0,-3) / (1,0)', id: '51b993ca-c846-4a32-8ea2-87e24cfb0163' }
    ]
  },
  {
    name: 'Opp / Adj',
    id: '47138e0e-e093-4aeb-946c-df334b833bfd',
    idMethod,
    puzzle,
    group,
    setup: '(1,0) / (-3,0) / (-3,0) / (-1,0)',
    algs: [
      { moves: '(1,0) / (-3,0) / (-3,0) / (-1,0)', id: '737fa9a9-9813-442f-ac1d-8bac3ed2557b' },
      { moves: '(1,0) / (3,0) / (3,0) / (-1,0)', id: '5f35bf08-00ba-4309-bea4-c6bd13344f4a' }
    ]
  },
  {
    name: '1-3',
    id: '096f32e3-255a-4455-9777-834d868da2a3',
    idMethod,
    puzzle,
    group,
    setup: '(1,0) / (-3,-6) / (-1,0)',
    algs: [
      { moves: '(1,0) / (3,6) / (-1,0)', id: '3d2b6ae0-f5fd-45c3-8242-88e02072d47f' },
      { moves: '(1,0) / (-3,6) / (-1,0)', id: 'bf03cb7a-3a95-4885-8b6c-fdd91759ab7d' }
    ]
  },
  {
    name: '0-4',
    id: 'e77d438b-6664-4e56-8e78-f4670990e819',
    idMethod,
    puzzle,
    group,
    setup: '(1,-1) / (-6,-6) /',
    algs: [{ moves: '/ (6,6) / (-1,1)', id: '46cd3f70-7b17-45c1-95d4-6742644c491f' }]
  }
]
