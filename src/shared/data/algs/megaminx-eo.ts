import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'MEGAMINX_EO_ALGS'
const puzzle = 'mega'
const group = 'Edge Orientation'

export const MEGAMINX_EO_ALGS: AlgorithmCollection[] = [
  {
    name: 'EO 1',
    id: 'f065708e-68c0-4f04-90f1-a7cb726b0ad7',
    idMethod,
    puzzle,
    group,
    setup: '',
    algs: [{ moves: "F R U R' U' F'", id: '2a0da391-1d66-4c75-ad43-71dc2b74a3c2' }]
  },
  {
    name: 'EO 2',
    id: 'f4c1fde2-c981-472e-a343-e31f1e0d1313',
    idMethod,
    puzzle,
    group,
    setup: '',
    algs: [{ moves: "F U R U' R' F'", id: 'a8788300-2e13-4f1e-955d-f2d34c5caded' }]
  },
  {
    name: 'EO 3',
    id: '5f56a328-6d28-407b-a1de-3f893ce8d670',
    idMethod,
    puzzle,
    group,
    setup: '',
    algs: [{ moves: "F R U2 R2' F R F' U2' F'", id: '12cecc32-ca4f-4cc6-aea0-f230f3b1b876' }]
  }
]
