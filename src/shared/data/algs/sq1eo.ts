import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'SQ1EO_ALGS'
const puzzle = 'sq1'
const group = 'Edge Orientation'

export const SQ1EO_ALGS: AlgorithmCollection[] = [
  {
    name: '1-1',
    id: '13ee9daf-ec39-4480-9240-40415b439625',
    idMethod,
    puzzle,
    group,
    setup: '(1,0) / (3,0) / (2,-1) / (1,1) / (-3,0) / (-3,0) / (-1,0)',
    algs: [
      {
        moves: '(1,0) / (3,0) / (3,0) / (-1,-1) / (-2,1) / (-3,0) / (-1,0)',
        id: '413d78c4-1334-4cdc-998c-a90680718605'
      }
    ]
  },
  {
    name: 'I-I',
    id: 'a9fdb926-5984-4894-a4de-f2cffb26b5e0',
    idMethod,
    puzzle,
    group,
    setup: '(0,-1) / (1,1) / (-1,0)',
    algs: [
      { moves: '(1,0) / (-1,-1) / (0,1)', id: 'b1a3a80b-a332-4bab-bf61-1cd4f9346c36' },
      { moves: '(0,-1) / (1,1) / (-1,0)', id: '984a9749-9002-421e-9b3f-2be07d2ac37a' }
    ]
  },
  {
    name: 'L-L',
    id: '535fe80a-eb59-4c62-8fe0-2a9f9961c815',
    idMethod,
    puzzle,
    group,
    setup: '(1,0) / (-4,-1) / (1,1) / (3,0) / (-1,0)',
    algs: [{ moves: '(1,0) / (-4,-1) / (1,1) / (3,0) / (-1,0)', id: '295acd6f-d7e0-4cc9-bcba-8c60f90234d0' }]
  },
  {
    name: 'L-I',
    id: 'dd2253b1-c9c3-41c5-a409-2d86e536ff9e',
    idMethod,
    puzzle,
    group,
    setup: '(0,-1) / (4,1) / (2,-1) / (1,1) / (-3,0) / (-3,0) / (-1,0)',
    algs: [
      {
        moves: '(1,0) / (3,0) / (3,0) / (-1,-1) / (-2,1) / (-4,-1) / (0,1)',
        id: '02658a40-b0cd-4b4f-a4fa-15041ddc6d28'
      }
    ]
  },
  {
    name: '3-3',
    id: 'ebc5a6a6-9f86-47b6-a432-7663392f328a',
    idMethod,
    puzzle,
    group,
    setup: '(0,-1) / (3,0) / (3,0) / (1,1) / (-3,0) / (-3,0) / (-1,0)',
    algs: [
      {
        moves: '(1,0) / (3,0) / (3,0) / (-1,-1) / (-3,0) / (-3,0) / (0,1)',
        id: '6fe998fb-63ea-44a3-9440-7e3300b4c5b4'
      },
      { moves: '(0,-1) / (3,0) / (3,0) / (1,1) / (-3,0) / (-3,0) / (-1,0)', id: '680e939b-beaa-4dd8-906a-b5931ade4db3' }
    ]
  },
  {
    name: '4-4',
    id: '62a2ae48-707a-4444-bdc8-33ee6be69f4b',
    idMethod,
    puzzle,
    group,
    setup: '(1,0) / (-1,-1) / (-3,-3) / (1,1) / (-1,0)',
    algs: [
      { moves: '(1,0) / (-1,-1) / (-2,4) / (-1,-1) / (1,0)', id: 'e1b5ed15-fa6f-467b-81ec-5185d27ceced' },
      { moves: '(1,0) / (-1,-1) / (3,3) / (1,1) / (-1,0)', id: '15c2d7a6-7dd4-423d-836d-2c9732ef3a7b' }
    ]
  },
  {
    name: 'I-L',
    id: 'cf966a97-943c-4d48-b40a-9d7be7bfc835',
    idMethod,
    puzzle,
    group,
    setup: '(0,-1) / (-3,0) / (3,0) / (1,1) / (-3,0) / (3,0) / (-1,0)',
    algs: [
      { moves: '(1,0) / (-3,0) / (3,0) / (-1,-1) / (-3,0) / (3,0) / (0,1)', id: '36a5b322-e7bd-4bba-bc63-6ae688e657b0' }
    ]
  }
]
