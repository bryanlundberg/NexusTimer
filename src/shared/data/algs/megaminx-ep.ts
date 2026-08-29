import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'MEGAMINX_EP_ALGS'
const puzzle = 'mega'
const group = 'Edge Permutation'

export const MEGAMINX_EP_ALGS: AlgorithmCollection[] = [
  {
    name: 'EP 1',
    id: '47978c39-939b-4f72-8c54-d8a1d15faac8',
    idMethod,
    puzzle,
    group,
    setup: '',
    algs: [{ moves: "R2 U2' R2' U' R2 U2' R2'", id: 'c2944271-435f-485b-9475-2ce0d44a89b0' }]
  },
  {
    name: 'EP 2',
    id: 'fd35058f-7f0a-471b-a983-786755ac6bae',
    idMethod,
    puzzle,
    group,
    setup: '',
    algs: [{ moves: "R2 U2 R2' U R2 U2 R2'", id: 'aa255322-be7d-48b5-9e9d-d32f42981f20' }]
  },
  {
    name: 'EP 3',
    id: 'e493db47-eab1-4a72-8ebd-8a8a2f52c37e',
    idMethod,
    puzzle,
    group,
    setup: '',
    algs: [{ moves: "R U R' F' R U R' U' R' F R2 U' R'", id: 'd988aeab-b9ca-44b9-bec8-1c6e43836302' }]
  },
  {
    name: 'EP 4',
    id: '8d5abeea-91e1-43fe-b965-7463b861476d',
    idMethod,
    puzzle,
    group,
    setup: '',
    algs: [{ moves: "R U R' U R' U' R2 U' R' U R' U R U2'", id: '92b2c0fd-312d-4d49-b489-0d429321081e' }]
  },
  {
    name: 'EP 5',
    id: '3c8b5248-2863-4d33-8d9c-6439bebaee15',
    idMethod,
    puzzle,
    group,
    setup: '',
    algs: [{ moves: "L R U2 L' U R' L U' R U2 L' U2 R'", id: 'b86dcf92-3771-4995-b496-1740cd807e97' }]
  }
]
