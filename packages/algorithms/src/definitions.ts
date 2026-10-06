import type { AlgorithmCollection } from './types'
import { ALGORITHM_SET_CATALOG, type AlgorithmSetSlug } from './sets'
import { PBL_ALGS } from './data/pbl'
import { OCLL_ALGS } from './data/ocll'
import { OLL_ALGS } from './data/oll'
import { PLL_ALGS } from './data/pll'
import { COLL_ALGS } from './data/coll'
import { BLE_ALGS } from './data/ble'
import { VLS_ALGS } from './data/vls'
import { CLS_ALGS } from './data/cls'
import { WV_ALGS } from './data/vw'
import { PARITY_444_ALGS } from './data/parity-444'
import { PARITY_555_ALGS } from './data/parity-555'
import { L2C_555_ALGS } from './data/l2c-555'
import { L2E_555_ALGS } from './data/l2e-555'
import { CLL_ALGS } from './data/cll'
import { EG_1_ALGS } from './data/eg-1'
import { EG_2_ALGS } from './data/eg-2'
import { F2L_ALGS } from './data/f2l'
import { ADVANCED_F2L_ALGS } from './data/advanced-f2l'
import { L4E_ALGS } from './data/l4e'
import { ZBLL_AS_ALGS } from './data/zbll-as'
import { ZBLL_S_ALGS } from './data/zbll-s'
import { ZBLL_H_ALGS } from './data/zbll-h'
import { ZBLL_L_ALGS } from './data/zbll-l'
import { ZBLL_PI_ALGS } from './data/zbll-pi'
import { ZBLL_U_ALGS } from './data/zbll-u'
import { ZBLL_T_ALGS } from './data/zbll-t'
import { SV_ALGS } from './data/sv'
import { SQ1CS_ALGS } from './data/sq1cs'
import { SQ1CO_ALGS } from './data/sq1co'
import { SQ1EO_ALGS } from './data/sq1eo'
import { SQ1CP_ALGS } from './data/sq1cp'
import { SQ1EP_ALGS } from './data/sq1ep'
import { SQ1_PARITY_ALGS } from './data/sq1parity'
import { MEGAMINX_EO_ALGS } from './data/megaminx-eo'
import { MEGAMINX_EP_ALGS } from './data/megaminx-ep'
import { MEGAMINX_CO_ALGS } from './data/megaminx-co'
import { MEGAMINX_CP_ALGS } from './data/megaminx-cp'

const ALGORITHMS_BY_SET: Record<AlgorithmSetSlug, AlgorithmCollection[]> = {
  pbl: PBL_ALGS,
  ocll: OCLL_ALGS,
  cll: CLL_ALGS,
  'eg-1': EG_1_ALGS,
  'eg-2': EG_2_ALGS,
  f2l: F2L_ALGS,
  'advanced-f2l': ADVANCED_F2L_ALGS,
  oll: OLL_ALGS,
  pll: PLL_ALGS,
  coll: COLL_ALGS,
  ble: BLE_ALGS,
  vls: VLS_ALGS,
  cls: CLS_ALGS,
  sv: SV_ALGS,
  wv: WV_ALGS,
  'zbll-s': ZBLL_S_ALGS,
  'zbll-as': ZBLL_AS_ALGS,
  'zbll-u': ZBLL_U_ALGS,
  'zbll-t': ZBLL_T_ALGS,
  'zbll-pi': ZBLL_PI_ALGS,
  'zbll-l': ZBLL_L_ALGS,
  'zbll-h': ZBLL_H_ALGS,
  'parity-4x4': PARITY_444_ALGS,
  'parity-5x5': PARITY_555_ALGS,
  'l2c-5x5': L2C_555_ALGS,
  'l2e-5x5': L2E_555_ALGS,
  l4e: L4E_ALGS,
  'sq1-cs': SQ1CS_ALGS,
  'sq1-co': SQ1CO_ALGS,
  'sq1-eo': SQ1EO_ALGS,
  'sq1-cp': SQ1CP_ALGS,
  'sq1-ep': SQ1EP_ALGS,
  'sq1-parity': SQ1_PARITY_ALGS,
  'megaminx-eo': MEGAMINX_EO_ALGS,
  'megaminx-ep': MEGAMINX_EP_ALGS,
  'megaminx-co': MEGAMINX_CO_ALGS,
  'megaminx-cp': MEGAMINX_CP_ALGS
}

export const ALGORITHM_SET_DEFINITIONS = ALGORITHM_SET_CATALOG.map((set) => ({
  ...set,
  algorithms: ALGORITHMS_BY_SET[set.slug]
}))

export type AlgorithmSetDefinition = (typeof ALGORITHM_SET_DEFINITIONS)[number]
