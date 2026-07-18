import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

export { BLE_ALGS } from './ble'
export { CLL_ALGS } from './cll'
export { CLS_ALGS } from './cls'
export { COLL_ALGS } from './coll'
export { EG_1_ALGS } from './eg-1'
export { EG_2_ALGS } from './eg-2'
export { L4E_ALGS } from './l4e'
export { OCLL_ALGS } from './ocll'
export { OLL_ALGS } from './oll'
export { PARITY_444_ALGS } from './parity-444'
export { PARITY_555_ALGS } from './parity-555'
export { PBL_ALGS } from './pbl'
export { PLL_ALGS } from './pll'
export { SARAH_ALGS } from './sarah'
export { SV_ALGS } from './sv'
export { VLS_ALGS } from './vls'
export { WV_ALGS } from './vw'
export { ZBLL_AS_ALGS } from './zbll-as'
export { ZBLL_H_ALGS } from './zbll-h'
export { ZBLL_L_ALGS } from './zbll-l'
export { ZBLL_PI_ALGS } from './zbll-pi'
export { ZBLL_S_ALGS } from './zbll-s'
export { ZBLL_T_ALGS } from './zbll-t'
export { ZBLL_U_ALGS } from './zbll-u'

import { BLE_ALGS } from './ble'
import { CLL_ALGS } from './cll'
import { CLS_ALGS } from './cls'
import { COLL_ALGS } from './coll'
import { EG_1_ALGS } from './eg-1'
import { EG_2_ALGS } from './eg-2'
import { L4E_ALGS } from './l4e'
import { OCLL_ALGS } from './ocll'
import { OLL_ALGS } from './oll'
import { PARITY_444_ALGS } from './parity-444'
import { PARITY_555_ALGS } from './parity-555'
import { PBL_ALGS } from './pbl'
import { PLL_ALGS } from './pll'
import { SARAH_ALGS } from './sarah'
import { SV_ALGS } from './sv'
import { VLS_ALGS } from './vls'
import { WV_ALGS } from './vw'
import { ZBLL_AS_ALGS } from './zbll-as'
import { ZBLL_H_ALGS } from './zbll-h'
import { ZBLL_L_ALGS } from './zbll-l'
import { ZBLL_PI_ALGS } from './zbll-pi'
import { ZBLL_S_ALGS } from './zbll-s'
import { ZBLL_T_ALGS } from './zbll-t'
import { ZBLL_U_ALGS } from './zbll-u'

export const ALL_ALGS: AlgorithmCollection[] = [
  ...BLE_ALGS,
  ...CLL_ALGS,
  ...CLS_ALGS,
  ...COLL_ALGS,
  ...EG_1_ALGS,
  ...EG_2_ALGS,
  ...L4E_ALGS,
  ...OCLL_ALGS,
  ...OLL_ALGS,
  ...PARITY_444_ALGS,
  ...PARITY_555_ALGS,
  ...PBL_ALGS,
  ...PLL_ALGS,
  ...SARAH_ALGS,
  ...SV_ALGS,
  ...VLS_ALGS,
  ...WV_ALGS,
  ...ZBLL_AS_ALGS,
  ...ZBLL_H_ALGS,
  ...ZBLL_L_ALGS,
  ...ZBLL_PI_ALGS,
  ...ZBLL_S_ALGS,
  ...ZBLL_T_ALGS,
  ...ZBLL_U_ALGS
]

// O(1) lookup indices — built once at module load
export const ALG_BY_ID = new Map(ALL_ALGS.flatMap((c) => c.algs.map((a) => [a.id, { alg: a, collection: c }])))

export const COLLECTION_BY_ID = new Map(ALL_ALGS.map((c) => [c.id, c]))

export const COLLECTIONS_BY_METHOD: Record<string, AlgorithmCollection[]> = ALL_ALGS.reduce(
  (acc, c) => {
    if (!acc[c.idMethod]) acc[c.idMethod] = []
    acc[c.idMethod].push(c)
    return acc
  },
  {} as Record<string, AlgorithmCollection[]>
)
