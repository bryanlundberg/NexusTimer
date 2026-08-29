import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'SQ1_PARITY_ALGS'
const puzzle = 'sq1'
const group = 'Parity'

export const SQ1_PARITY_ALGS: AlgorithmCollection[] = [
  {
    name: 'Adj Parity',
    id: '20be447a-0c07-4226-bdc4-71a5f125b7fa',
    idMethod,
    puzzle,
    group,
    setup:
      '(0,-3) / (0,3) / (1,-4) / (0,-2) / (0,2) / (-4,0) / (2,0) / (0,-2) / (-2,0) / (0,-3) / (0,3) / (0,-3) / (3,0) /',
    algs: [
      {
        moves:
          '/ (-3,0) / (0,3) / (0,-3) / (0,3) / (2,0) / (0,2) / (-2,0) / (4,0) / (0,-2) / (0,2) / (-1,4) / (0,-3) / (0,3)',
        id: '77eeb6bc-26d5-433c-ae2a-1ebb4eca5858'
      }
    ]
  },
  {
    name: 'Opp Parity',
    id: 'b675b0b9-205f-4d18-9394-91fb018c19c4',
    idMethod,
    puzzle,
    group,
    setup: '(-3,0) / (-3,-3) / (-3,0) / (-1,5) / (4,-2) / (0,2) / (-4,2) / (-2,4) / (1,0) / (-3,-3) /',
    algs: [
      {
        moves: '/ (3,3) / (-1,0) / (2,-4) / (4,-2) / (0,-2) / (-4,2) / (1,-5) / (3,0) / (3,3) / (3,0)',
        id: 'a7683137-2951-4177-a62f-62e41c5bed82'
      }
    ]
  },
  {
    name: 'O+ Parity',
    id: '32933de0-e862-4c2b-8ab9-f08eb405a634',
    idMethod,
    puzzle,
    group,
    setup: '(-3,-3) / (-3,-3) / (0,1) / (-2,-2) / (0,2) / (2,2) / (0,-1) / (3,3) / (-2,0) / (2,2) / (0,1)',
    algs: [
      {
        moves: '(0,-1) / (-2,-2) / (2,0) / (-3,-3) / (0,1) / (-2,-2) / (0,-2) / (2,2) / (0,-1) / (3,3) / (3,3)',
        id: '35321618-6dde-4c87-bb0e-5cc83007e641'
      }
    ]
  },
  {
    name: 'O- Parity',
    id: 'd98f7251-5ab8-4cb6-bc40-0157f7a0c162',
    idMethod,
    puzzle,
    group,
    setup: '(3,2) / (-2,-2) / (2,0) / (-3,-3) / (0,1) / (-2,-2) / (0,-2) / (2,2) / (0,-1) / (3,3) /',
    algs: [
      {
        moves: '/ (-3,-3) / (0,1) / (-2,-2) / (0,2) / (2,2) / (0,-1) / (3,3) / (-2,0) / (2,2) / (-3,-2)',
        id: '787f1234-3967-4e4c-a516-914cf6a0f0e5'
      }
    ]
  },
  {
    name: 'W Parity',
    id: '937153a7-f611-423e-af1e-440cd1f4d37c',
    idMethod,
    puzzle,
    group,
    setup: '(3,0) / (0,3) / (1,0) / (2,-2) / (4,0) / (4,0) / (-3,2) / (-1,0) / (0,-3) / (4,0) / (-1,2) / (0,1)',
    algs: [
      {
        moves:
          '(0,-1) / (1,-2) / (-4,0) / (0,3) / (1,0) / (3,-2) / (-4,0) / (-4,0) / (-2,2) / (-1,0) / (0,-3) / (-3,0)',
        id: '004560ce-8006-4dc2-aaa0-dbdb1b0019fc'
      }
    ]
  }
]
