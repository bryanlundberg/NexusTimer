import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'ZBLL_PI_ALGS'
const puzzle = '333'

export const ZBLL_PI_ALGS: AlgorithmCollection[] = [
  {
    name: 'ZBLL Pi 1',
    id: 'fcfe7f8c-5b2f-4457-8e2e-4cdf6d003fb1',
    idMethod,
    puzzle,
    group: 'Pi 1',
    setup: "L R' U' R U' R' U R U2' L' U R' U2' R",
    algs: [
      { moves: "y' R U R' U R U2 R2 F' r U R U' r' F", id: 'd0a26fca-5fc0-4f90-88e9-0096bb329442' },
      { moves: "y' R U R' U R U2 R2 U' R' F R U R U' R' F' R", id: '9e4ae85f-f7d9-4879-a802-89efec546ea6' },
      { moves: "R' U2 R U' L U2 R' U' R U R' U R L'", id: '44c7fc8e-5924-4e34-9f70-b75f9b6cb3bf' },
      { moves: "y F U R U2 R' U R U R' F' R U R' U R U2 R'", id: '75d96a84-6b4e-4a77-bc28-af203e1d4f50' }
    ]
  },
  {
    name: 'ZBLL Pi 2',
    id: 'ad8f8777-f89a-4fa7-92e3-90e7036234ff',
    idMethod,
    puzzle,
    group: 'Pi 1',
    setup: "L' R U R' U R U' R' U2' L U' R U2' R'",
    algs: [
      { moves: "y' r' F' r U' r' F2 r2 U R' U' r' F R F'", id: '71bb4124-0569-4e76-a525-9bb476b602d4' },
      { moves: "y R' U' R U' R' U2 R U' R U R D R' U' R D' R2", id: '30116c80-aab9-4c42-9758-44bb5b7774af' },
      { moves: "y' L' U' L U' L' U2 L r U R' U' r' F R F'", id: 'f4a21e78-db0a-429b-b26f-6d405aee74ba' },
      { moves: "R U2 R' U' R U' r' F' r U R' U2 r' F2 r", id: '3e0a3559-e393-4f95-a37d-2927ceaeb5b3' }
    ]
  },
  {
    name: 'ZBLL Pi 3',
    id: '85771e69-6e5a-4f9e-8e1d-66d2b4007a81',
    idMethod,
    puzzle,
    group: 'Pi 1',
    setup: "R U2' R' U' R U' R D' R U' R' D R U R y2'",
    algs: [
      { moves: "y2 R' U' R' D' R U R' D R3 U R' U R U2 R'", id: '1bc2491b-bf09-48fe-b58b-e60a7909a829' },
      { moves: "F R U' R' U R U R2 F' R U2 R U' R' U R U2 R' U'", id: '8d33d4f5-fab5-4701-abdc-cb0c3d36c77b' },
      { moves: "y2 R' U' R' D' R U R' D R' U R' U R U2 R'", id: '4ca080eb-fb33-4c3f-b346-b5884ee8598b' },
      { moves: "S R U R U' R' F U R' U' R U R' U' f'", id: '18e89421-1ac9-4774-a867-12711119a678' }
    ]
  },
  {
    name: 'ZBLL Pi 4',
    id: 'efcfe616-b5ff-46fb-8dae-9e68e4f9f634',
    idMethod,
    puzzle,
    group: 'Pi 1',
    setup: "R' U2' R U R' U R' D R' U R D' R' U' R' y2'",
    algs: [
      { moves: "y2 R U R D R' U' R D' R U' R U' R' U2 R", id: '60b61c90-8a2a-44d8-bcbc-460ac85f5281' },
      { moves: "y' R' U' F U' R2 U R2 U F' R2 U2 R'", id: 'f67be441-40a0-4861-afa5-222698b72d21' },
      { moves: "y' R' D R2 U2 R2 D' R U R' D R2 U R2 D' R", id: '33c738e4-e8fe-472d-9dba-c0b94d6b9158' },
      { moves: "y2 R U R D R' U' R D' R3' U' R U' R' U2 R", id: 'c8a4cee0-550a-41c9-b8dd-1076bc18024b' }
    ]
  },
  {
    name: 'ZBLL Pi 5',
    id: '43650461-fb9d-4132-b62a-05f9562b1979',
    idMethod,
    puzzle,
    group: 'Pi 1',
    setup: "R U R2' F' U2' R U R' U R2' U2' R' U F R U' R'",
    algs: [
      { moves: "F R' F' R U2 R U2 R' U' r U R' U R U2 r'", id: '9ea055a7-7bb2-4f5f-95ff-890bf736f012' },
      { moves: "R U R' U R' F R F' R' U' F' U F R2 U' R'", id: 'a3984c0d-2849-4209-9b52-ea3f7075bcf4' },
      { moves: "y R U R2 F' R U R U' R' F U R U' R' U R U2 R'", id: '185eee80-7719-4878-b89a-bb9c36c6df12' },
      { moves: "y R U R2 D' R U R' D R2 U2 R' U R U R' U R U2 R'", id: 'b80a1b0a-e917-4f3f-91ce-75080c1b4070' }
    ]
  },
  {
    name: 'ZBLL Pi 6',
    id: '3f140fd5-00f4-4ade-b477-654caf1ab1f5',
    idMethod,
    puzzle,
    group: 'Pi 1',
    setup: "R' U2' R2' U R2' U R U2' R' F R U R U' R' F'",
    algs: [
      { moves: "F R U R' U' R' F' R U2 R' U' R2 U' R2 U2 R", id: 'c9a98ffa-65d3-48ac-81d5-ee7ba383e843' },
      { moves: "y R' U2 R' D' R U R' D F' R U R U' R' F R U'", id: '781da207-f167-4f4b-9c67-18520bdc127d' },
      { moves: "y R2 F2 r U r' F R2 U2 x' U' R U l'", id: 'c459cc4c-1def-400f-849b-4b6609fd8888' },
      { moves: "y' R U L' R' U2 R U2 R' U2 L U' R U2 R'", id: '9aa5faca-e7d6-4598-96aa-8164f94a0809' }
    ]
  },
  {
    name: 'ZBLL Pi 7',
    id: '6a0bd117-1fba-4b4c-8d1d-c11473a82677',
    idMethod,
    puzzle,
    group: 'Pi 1',
    setup: "R' U' R U' R' U R U R' F R U R' U' R' F' R2'",
    algs: [
      { moves: "R2 F R U R U' R' F' R U' R' U' R U R' U R", id: '529eea9c-a37f-401c-a23d-7fcd18ac0ef2' },
      { moves: "y R U2 R2 U' R U' R' U2 F R U R U' R' F'", id: '94c02a0c-5ef2-4463-b23a-c3eb3d24f2a3' },
      { moves: "y' R U R' U R U2 R' F U R U2 R' U R U R' F'", id: '461c4d91-594d-4ac7-8c26-942a9519becb' },
      { moves: "R U2 R2 U' R' D R' U' R D2 L F2 L' D R2", id: 'cd22e190-1e36-4f7f-a81c-4cf3a5693219' }
    ]
  },
  {
    name: 'ZBLL Pi 8',
    id: '3188cecb-95b0-4065-ad3e-8270eb8e9318',
    idMethod,
    puzzle,
    group: 'Pi 1',
    setup: "F R U' R' U R U2' R' U' R U R' U' F' y'",
    algs: [
      { moves: "y F U R U' R' U R U2 R' U' R U R' F'", id: '9272e74a-959d-4f19-ae64-de95059406e6' },
      { moves: "R' U R U R' U R U' R2 D' R U' R' D R U' R", id: '6fdb5ffc-80a2-474c-823a-f5ceec27daf5' },
      { moves: "R U y R U' R' U R U2 R' U' R U R' F'", id: 'e5300652-b3e6-40a1-bbf5-f4645336b61b' },
      { moves: "U R' U2 R2 F' R2 F R2 U2 R' U2 F' R F U2 R2 U'", id: '6c1eff7a-d903-41e3-8ec7-d1902976fca5' }
    ]
  },
  {
    name: 'ZBLL Pi 9',
    id: '727a199a-9a78-4a0d-9da6-305fd6787180',
    idMethod,
    puzzle,
    group: 'Pi 1',
    setup: "F' R U2' R' U2' R' F R U R U R' U' R U' R' y",
    algs: [
      { moves: "y' R U R' U R U' R' U' R' F' R U2 R U2 R' F", id: '28a9bf6c-0cf9-4f1f-ad19-e46ad8292836' },
      { moves: "y F R2 U' R2 U R2 U S R2 f'", id: 'b3824358-20de-49d6-945a-2ac5e2f2917a' },
      { moves: "y F R2 U' R2 U R2 U F' B U2 B'", id: '56cedeaf-0809-425f-9485-20c5a558b89c' },
      { moves: "R U R' U L' U2 R U R' U2 L R U2 R'", id: 'b09988e3-5aaa-485e-acdb-97a4338e732b' }
    ]
  },
  {
    name: 'ZBLL Pi 10',
    id: 'a4e22032-ab5f-4c84-b072-0f1044bcd3d8',
    idMethod,
    puzzle,
    group: 'Pi 1',
    setup: "F U' R U2' R' U2' R U' R' U' R U R' U F' y",
    algs: [
      { moves: "y' F U' R U' R' U R U R' U2 R U2 R' U F'", id: '22212324-8ae2-48a1-9b56-5d0edf1619ae' },
      { moves: "y R' B' U' R2 U2 R2 U' R2 U' R2 B R", id: '4fb5d52d-a72d-4f40-b88e-04b4e61fade7' },
      { moves: "y R' F' R U R U' R' F U R2 U R2 U R U' R U' R2", id: 'a8d3c0f2-626c-4517-94a8-923f53444885' },
      { moves: "R U' L U' R' U L' U' R' U' R2 U' R2 U2 R", id: '8236cfd9-41a0-40aa-97cf-13e1f5e8e2d8' }
    ]
  },
  {
    name: 'ZBLL Pi 11',
    id: '11bd969f-9625-4962-a0fa-1c43d5bfd23a',
    idMethod,
    puzzle,
    group: 'Pi 1',
    setup: "R' U R U R' U' R' D' R U' R' D R U' R' D' R U R' D R2' y'",
    algs: [
      { moves: "y' R F U R2 U2 R2 U R2 U R2 F' R'", id: '16086fbb-4359-4acd-8b3c-4103e4c46f40' },
      { moves: "y R2 D' R U' R' D R U R' D' R U R' D R U R U' R' U' R", id: 'd175c123-7e2c-4aa1-bf12-61b626efc954' },
      { moves: "y2 R' U R U' D' R U' R' U2 R U' R' D R' U' R", id: '7f4037ba-dc5c-4867-8d8f-3fd1df213cb5' },
      { moves: "y L U L2 R U2 L2 U L2 U L2 U R' U' L'", id: '73a0021f-bdc7-4ad9-a30b-d8e5e717d8a6' }
    ]
  },
  {
    name: 'ZBLL Pi 12',
    id: '60a9b4b4-51d9-4f71-8d82-68283345b639',
    idMethod,
    puzzle,
    group: 'Pi 1',
    setup: "R' U2' R U2' R2' F' R U R U' R' F U R",
    algs: [
      { moves: "R' U' F' R U R' U' R' F R2 U2 R' U2 R", id: '60417047-600b-4086-8370-4ad29c938dcf' },
      { moves: "R' U' R U' L U2 R' U' L' U2 L R U2 L'", id: '6a646171-5b1b-44fe-aa10-d3db0d692739' },
      { moves: "y' B' R2 U R2 U' R2 U' S R2 F z'", id: 'ee55cc0b-4d41-4019-a8f8-d0bae0419704' }
    ]
  },
  {
    name: 'ZBLL Pi 13',
    id: '4953fbbd-f214-47d2-9ea7-765a7d3641c6',
    idMethod,
    puzzle,
    group: 'Pi 2',
    setup: "R2' D' R U' R' D R2' U' R2' D' R U2' R' D R2' y'",
    algs: [
      { moves: "y R2 D' R U2 R' D R2 U R2 D' R U R' D R2", id: '564f8737-e2ed-40a0-ad20-b963e42af724' },
      { moves: "y R2 U' R2 F U R2 U' R2 F' U' R2 U R2", id: '2f3cbbb1-ff1f-409c-b49b-6d9c59155f79' },
      { moves: "y2 R' U R U' R' U R U R' U2 L' U R U' L", id: '28e88bd9-e6c8-42eb-bc59-059c82accf13' },
      { moves: "L' U L U' L' U L U L' U2 R' U L U' R", id: '5fd33e80-2d2f-41d4-81e4-dab3cff9ca5d' }
    ]
  },
  {
    name: 'ZBLL Pi 14',
    id: '3bd38bb9-53dd-4605-b696-d0be55e18030',
    idMethod,
    puzzle,
    group: 'Pi 2',
    setup: "R2' D R' U R D' R2' U R2' D R' U2' R D' R2' y",
    algs: [
      { moves: "y' R2 D R' U2 R D' R2 U' R2 D R' U' R D' R2", id: 'f877e34b-d3ac-447d-ac1a-679299ce8202' },
      { moves: "y' R2 U R2 B' U' R2 U R2 B U R2 U' R2", id: '7ffcead4-2ae6-47d8-ae74-2a0c30d76c0c' },
      { moves: "R' U2 R2 U R2 U R2 U' R' U' R' F R2 U' R' U' R U R' F'", id: '3913fb2f-09e2-4571-b89a-c46fe1237f16' },
      { moves: "L U2 R' U L' U L U' L' U' L U' R U2 L'", id: '526e0e37-ca1e-4829-8cd9-74b2540c87d5' }
    ]
  },
  {
    name: 'ZBLL Pi 15',
    id: 'a0be97a5-976b-44df-a167-4c366b13d3d8',
    idMethod,
    puzzle,
    group: 'Pi 2',
    setup: "R' U2' R U R2' D' R U' R' D R2' U R' U R",
    algs: [
      { moves: "R' U' R U' R2 D' R U R' D R2 U' R' U2 R", id: 'e2b7aa84-5a8a-43ea-950f-f29eaab6f219' },
      { moves: "R' U2 R' D R' U R D' R U R2 U2 R'", id: 'e82bb47c-648a-4cf5-a432-6b3fe21c6b15' },
      { moves: "y2 L' U2 L' D L' U L D' L U L2 U2 L' U2", id: 'eb2cf8ab-1d8d-4ff9-921d-d67083cc6e76' }
    ]
  },
  {
    name: 'ZBLL Pi 16',
    id: '6f85e969-6f5f-47e0-8df8-06e80d74dd2b',
    idMethod,
    puzzle,
    group: 'Pi 2',
    setup: "R U2' R' U' R2' D R' U R D' R2' U' R U' R'",
    algs: [
      { moves: "R U R' U R2 D R' U' R D' R2 U R U2 R'", id: 'f1797b41-967d-4f6f-80f0-d6043511892f' },
      { moves: "R U2 R D' R U' R' D R' U' R2 U2 R", id: '725264b2-a2bb-4641-828d-ad3864dbf966' },
      { moves: "y2 L U L' U L2 D L' U' L D' L2 U L U2 L'", id: '075697f5-a0d4-4c06-b04f-8f746ca07485' }
    ]
  },
  {
    name: 'ZBLL Pi 17',
    id: '49a8f122-8c8f-4904-a136-b678612f4cb8',
    idMethod,
    puzzle,
    group: 'Pi 2',
    setup: "R2' D' R U2' R' D R2' U R' U R U R' U2' R U R' U R",
    algs: [
      { moves: "R' U' R U R2 F' R U R U' R' F U' R U R' U R", id: '3ee3a59d-b90b-4012-b1c9-ef13eedb41bc' },
      { moves: "R' U' R U' R' U2 R U' R' U' R U' R2 D' R U2 R' D R2", id: '0992a308-ae98-45e3-bb59-799b369a2975' },
      { moves: "R U2 R2 U' R2 U' R' U R' U2 L U' R U L'", id: '9022f1ba-36dc-4d04-9c0f-830f29e4aeaf' },
      { moves: "y' R' U2 R U R' U2 R U2 R' U R2 D R' U R D' R'", id: '8afdb7a4-6024-4acf-8d2c-79704ef1e7e1' }
    ]
  },
  {
    name: 'ZBLL Pi 18',
    id: '4de122b9-2df5-460f-aa60-1ece05179eab',
    idMethod,
    puzzle,
    group: 'Pi 2',
    setup: "R' F' R U2' R U2' R' F R' U' R2' U' R' U R' U R y'",
    algs: [
      { moves: "y R U2 R' U' R U2 R' U2 R U' R2 D' R U' R' D R", id: '2485a4a4-4542-41f9-9f21-4309422e01f6' },
      { moves: "y' R' U' F' R U2 R' U' R U' R' F U R U R' U2 R", id: 'df4325a3-34cb-4b2d-b02b-815c16ea3161' },
      { moves: "R' U2 R2 U R2 U R U' R U2 L' U R' U' L", id: '9c256788-8c8d-4d46-98ac-7dee6f437dfa' },
      { moves: "y R' U' R U' R U R2 U R F' R U2 R' U2 R' F R", id: 'ac1a550f-8fdd-4c78-87b9-b6fd48802f99' }
    ]
  },
  {
    name: 'ZBLL Pi 19',
    id: 'abb39517-1678-41b3-a93d-0da4682371a0',
    idMethod,
    puzzle,
    group: 'Pi 2',
    setup: "R U R' U R U2' R' F R U' R' U' R U2' R' U' F' y",
    algs: [
      { moves: "y' F U R U2 R' U R U R' F' R U2 R' U' R U' R'", id: '7c46db12-763d-4005-a42b-d64be0785960' },
      { moves: "y' R2 D R' U R D' R2 U R U2 R2 U' R U' R' U2 R", id: 'c9aa81bd-21b8-49df-b915-968bcb23a849' },
      { moves: "y R U2 R2 U' R2 U' R D' r U2 r' D R2", id: 'c44f43a0-9d27-4e84-ab3b-0d88a8fb8cbd' },
      { moves: "y R' U' R U' R' U2 R2 U R' U' R' F' R U2 R U2 R' F", id: 'cc0aa180-7f8e-4677-995f-6ea306d97af8' }
    ]
  },
  {
    name: 'ZBLL Pi 20',
    id: '75f1a44e-4f8e-4a6c-91f9-a2fe9a01610a',
    idMethod,
    puzzle,
    group: 'Pi 2',
    setup: "r' F' r U R U2' r' F2' r U' R' U R U2' R' y2'",
    algs: [
      { moves: "y2 R U2 R' U' R U r' F2 r U2 R' U' r' F r", id: '43715330-114e-42d4-9dbe-a680411a4346' },
      { moves: "y2 R U2 R' U' R U' R' U' F U R U2 R' U R U R' F'", id: '7a060159-559b-4396-8444-3e7fe662114f' },
      { moves: "L' U2 L U L' U' R U2 R' U2 L U R U' R'", id: 'b83259da-208a-4a79-8b36-1bed1f3aa5b5' },
      { moves: "R2 U R' U' R' U2 R' U2 R U R' D R' U R D'", id: '1206f4bd-0aa1-455c-abb2-c0d4b273fe17' }
    ]
  },
  {
    name: 'ZBLL Pi 21',
    id: '06167d8f-0a72-4988-8551-949c5531d87c',
    idMethod,
    puzzle,
    group: 'Pi 2',
    setup: "R U R' U R U L' U R' U' L y2'",
    algs: [
      { moves: "y2 L' U R U' L U' R' U' R U' R'", id: 'd0839c9e-606e-4830-b30b-5b409b885236' },
      { moves: "y' R U2 R' U R' D' R U2 R' D R2 U' R'", id: '628677df-ac01-4235-ab7c-d7209edf0ae0' },
      { moves: "y R' U' R U' R' U R' F R U R U' R' F' R", id: '85b3984a-986d-4935-8e2e-93e75222f654' },
      { moves: "R' U L U' R U' L' U' L U' L'", id: '15ae80c3-6080-4474-9d45-b255c2149a39' }
    ]
  },
  {
    name: 'ZBLL Pi 22',
    id: '74bc1506-a466-4da6-a506-7637137efb8e',
    idMethod,
    puzzle,
    group: 'Pi 2',
    setup: "R U R' U R U2' R D' R U' R' D R U R",
    algs: [
      { moves: "r' U r U r' U' r U R2 F R F' R", id: '146d444e-46ee-4f52-95a2-4a157192989f' },
      { moves: "r' U r U r' U' r U l' R' U R U' R", id: '80354dcb-7fcb-4a9b-859a-460c7bc63310' },
      { moves: "R' U' R' D' R U R' D R' U2 R' U' R U' R'", id: '0419af93-8268-4037-81dd-350db1fb9e29' },
      { moves: "y2 L' U R U' L U R' U' R' U' R U' R' U2 R", id: '3758245e-95c8-478e-bcac-ef68af2809ec' }
    ]
  },
  {
    name: 'ZBLL Pi 23',
    id: 'd5e6c262-ce6c-44b9-af36-b6b8edfd4f25',
    idMethod,
    puzzle,
    group: 'Pi 2',
    setup: "R' U' R U' R' U2' R' D R' U R D' R' U' R'",
    algs: [
      { moves: "r U' r' U' r U r' U' R2 B' R' B R' U", id: 'ebba853f-3f2e-48b8-97ea-f6547fc6dbd5' },
      { moves: "r U' r' U' r U r' U' l R U' R' U l'", id: 'bc63035b-aca0-4439-9e43-447dedb3f2a7' },
      { moves: "r U' r' U' r U r' F R' F' R2 U' R'", id: 'df7d2be6-2575-4b02-91ed-419e3ae297f9' },
      { moves: "R U R D R' U' R D' R U2 R U R' U R", id: '1599aabd-1632-45ae-8407-548fb60b9421' }
    ]
  },
  {
    name: 'ZBLL Pi 24',
    id: 'cc9e35a4-13a3-4f77-b194-28c04be81651',
    idMethod,
    puzzle,
    group: 'Pi 2',
    setup: "L' U' L U' L' U' R U' L U R'",
    algs: [
      { moves: "y' R U R' U F' R U2 R' U2 R' F R", id: '2bdcb93c-71d4-42a6-a59e-ca7c201a872b' },
      { moves: "R U' L' U R' U L U L' U L", id: '0a2746ac-9d6b-4308-a7a9-a124ffdab01a' },
      { moves: "l F' r' x F l' U L U L' U L", id: '43795c0d-5baf-4790-bf3d-3d97d7e103b3' },
      { moves: "R U' r' F R' F r U r' F r", id: '0066c4ee-a002-4d48-b49a-65d9b7b6255f' }
    ]
  },
  {
    name: 'ZBLL Pi 25',
    id: 'f87e2c9d-c080-4968-a2a4-2e218c2e9ec7',
    idMethod,
    puzzle,
    group: 'Pi 3',
    setup: "R' U' R U' R' U R U' R2' D' R U R' D R U R",
    algs: [
      { moves: "R' U' R' D' R U' R' D R2 U R' U' R U R' U R", id: 'b84cec67-2aa3-4889-88ed-0379f77f7aad' },
      { moves: "R' U2 R U R' U' R U2 L U' R' U R L'", id: '87506e13-f64b-4b28-96a7-2428afee2ea4' },
      { moves: "R' U2 R U R' U' R U F R' U R U' F'", id: 'e8ab187c-5c73-4d34-98fe-f393f9e80fd3' },
      { moves: "y2 L' U2 L U L' U' L U2 R U' L' U M' x'", id: 'c1fa9e7e-7349-4eb3-aac1-416b051bf3ed' }
    ]
  },
  {
    name: 'ZBLL Pi 26',
    id: '46b4a189-95b8-44f3-bfac-b6e862dcda49',
    idMethod,
    puzzle,
    group: 'Pi 3',
    setup: "F' R U R' U' R' F R U' R U' R' U' R U R' U R U R'",
    algs: [
      { moves: "R U' R' U' R U' R' U R U R' U R' F' R U R U' R' F", id: 'f923a437-6a2a-464e-9b79-0382bad98b3c' },
      { moves: "y R2 F R U R U' R' F' R U2 R U R2 U R2 U2 R'", id: 'b06b40a2-7f4c-451f-9bab-923599fb7c06' },
      { moves: "y' R U2 R' U L U' R' U' R2 U' R2 U2 R L'", id: '3580cae2-eb5f-4f3b-ab08-d3605c6b008f' },
      { moves: "y' R U2 R F2 R2 U' R U' R' U R2 F2 R2", id: 'bbd0b304-7948-4879-94ae-c5a834e33291' }
    ]
  },
  {
    name: 'ZBLL Pi 27',
    id: '2dea7d3b-f2e5-49ba-9905-ae99d014b358',
    idMethod,
    puzzle,
    group: 'Pi 3',
    setup: "R U2' R' U' R U R' U2' L' U R U' R' L y'",
    algs: [
      { moves: "y R U R' U R U' R' U R2 D R' U' R D' R' U' R'", id: 'b92565b3-3ec7-4094-a157-c7cef52d9904' },
      { moves: "y L' R U R' U' L U2 R U' R' U R U2 R'", id: '5e6abf00-c5a7-4ea7-804e-88e298c4d535' },
      { moves: "y M F R' F' r U2 R U' R' U R U2 R'", id: '8cdbadb4-b693-4034-9857-63f3daa5b4f0' },
      { moves: "F' U' L U L' F U L U' L' U L U2 L' U", id: '63e76db0-6688-437c-babc-69e791a99159' }
    ]
  },
  {
    name: 'ZBLL Pi 28',
    id: '133a165e-8649-4b78-bbf4-53bb78bc12d3',
    idMethod,
    puzzle,
    group: 'Pi 3',
    setup: "R' F R U R' U' R' F' R2' U' R' U R U' R' U2' R y2'",
    algs: [
      { moves: "y2 R' U2 R U R' U' R U R2 F R U R U' R' F' R", id: 'aaee7cac-09b7-4b05-8c66-24962c3e6b3e' },
      { moves: "L' R U2 R2 U' R2 U' R' U' L U R' U2 R", id: 'cc8d4cd2-ce39-4b82-b97d-4b32ad4fb44b' },
      { moves: "y R2 B2 R2 U R' U' R U' R2 B2 R U2 R", id: '148c6020-305c-4dcd-92d8-b1cb0a44b2cb' },
      { moves: "y F' U R' F U' R' F' R2 F2 R' F' U R", id: 'e9209f69-35ec-44ff-a774-6014c6a5721c' }
    ]
  },
  {
    name: 'ZBLL Pi 29',
    id: '09a60f67-fef6-4fb4-b817-31a38de51e88',
    idMethod,
    puzzle,
    group: 'Pi 3',
    setup: "R U2' R' U2' R' F R2' U' R' U2' R U2' R' U' F' y'",
    algs: [
      { moves: "R U' L' U R' U' L U' R U' L' U R' U' L", id: '37929534-91b8-4ffe-9b5c-85ca104cb020' },
      { moves: "y F U R U2 R' U2 R U R2 F' R U2 R U2 R'", id: '33bc581a-0c2e-4514-8af3-e8cdfb621d65' },
      { moves: "L U' R U R' L' U2 R U2 R' U R U2 R'", id: '54c399ed-c57e-430a-b8a0-83115bda39d8' },
      { moves: "L' U2 R U' L U' R' U' R U2 L' U M' x'", id: '125245e3-8280-4e3a-88ba-02a349b9009f' }
    ]
  },
  {
    name: 'ZBLL Pi 30',
    id: '75bf3c2a-b2bd-4fe2-bc73-98a1ad35f7cb',
    idMethod,
    puzzle,
    group: 'Pi 3',
    setup: "R U R' U' R' F R2' U R' U' R U R' U' F' y'",
    algs: [
      { moves: "y F U R U' R' U R U' R2 F' R U R U' R'", id: '960f3fe7-90fc-4454-b917-1ac576e1a321' },
      { moves: "y' R U' R U2 R U2 R2 U R' F2 R' U R' U' R2 F2", id: 'b76f90d5-8379-431f-b946-a20029f9cae9' },
      { moves: "R U R' U R' F R2 U' R' U' R U R' F' U R U' R'", id: '5ce8474a-2181-4187-ae58-7c95983a9da9' },
      { moves: "y2 L' U' L U L F' L2 U' L U L' U' L U F", id: 'c5808ad9-8e4d-4d91-a5de-d5565ca1c81e' }
    ]
  },
  {
    name: 'ZBLL Pi 31',
    id: 'dae8853f-1020-4bdc-be57-31339926b190',
    idMethod,
    puzzle,
    group: 'Pi 3',
    setup: "x U R' U' R U2' L U L' U x' U' R U' R' U' R U' R' y2'",
    algs: [
      { moves: "F U R U' R2 F' R2 U R' F' U' F U2 R U' R'", id: '48ed58ad-54e9-4ff8-b19b-a5d24ce90e12' },
      { moves: "y R U R' U' R U R2 D' R U R' D R U R U' R' U R U2 R'", id: '36df233b-d9fc-42a0-90d8-ff50f877548b' },
      { moves: "F U' R2 U R U' R' U R2 U2 R' U' R' U R U' R F'", id: 'b1e6cc73-da5a-4e9e-a39e-a8d4e8b0de41' },
      { moves: "y R U R' U R U2 R' U' R U R' U R2 D R' U2 R D' R2", id: 'a9d46791-0074-4535-9af3-85a964e3bbf8' }
    ]
  },
  {
    name: 'ZBLL Pi 32',
    id: 'b17027a0-d433-4153-89e8-92de898c5cd8',
    idMethod,
    puzzle,
    group: 'Pi 3',
    setup: "r' F' r U r U2' r' F2' U' R U R' U' R U' R' y",
    algs: [
      { moves: "y' R U R' U R U' R2 F R F' R U' R' F' U F", id: '7e2e9972-8e65-4f64-9d3d-ca7eec3c98d1' },
      { moves: "f R U R2 D' R U' R' D R S' R U R' U' F'", id: '23b93f54-1f5f-467c-9742-ef1bbf9276a2' },
      { moves: "y' F' U' L' U L S' L D L' U' L D' L2 U L f U2", id: '64a414b0-a464-4442-abf5-35baf7b38e6e' },
      { moves: "y2 R' D' R U R' D R U2 R U2 R' U R U' R' U' R U' R'", id: 'b0935171-02dd-44d7-b140-c087a9d2eed3' }
    ]
  },
  {
    name: 'ZBLL Pi 33',
    id: '4dfb5c6c-83f2-4895-981f-3c4c6f49a4ab',
    idMethod,
    puzzle,
    group: 'Pi 3',
    setup: "l U2' l' U2' R' U2' R B2' U R' U R y'",
    algs: [
      { moves: "y R' U' R U' B2 R' U2 R U2 l U2 l'", id: '89d2c4b4-c760-406c-992c-fbb3aea27bcd' },
      { moves: "y r' F R F' r U R' U R U2 R' U' R U' R'", id: '01ae20a4-2dee-4334-aebe-88f66773bcc7' },
      { moves: "y R' F R F' r U R' U R U2 r' U' R U' R'", id: '4bb56971-b91a-41e6-a8f0-d7c9d714f870' },
      { moves: "y' L' U' L U' F2 L' U2 L U2 L F2 L'", id: '3c695d3b-6a33-4e22-8de7-87c25dc8915f' }
    ]
  },
  {
    name: 'ZBLL Pi 34',
    id: '0c277b4b-63fc-46c7-a5bd-7ed3f111e117',
    idMethod,
    puzzle,
    group: 'Pi 3',
    setup: "R2' D' R U' R' D R U' R U R' U' R U R' U R y",
    algs: [
      { moves: "y' R' U' R U' R' U R U' R' U R' D' R U R' D R2", id: 'ef87ee12-45a8-4aab-98b4-8391da62730d' },
      { moves: "y L' U R U' L U R2 U' R U' R' U2 R", id: '02f0a0dd-31d5-4db2-be9e-1564e8a937cb' },
      { moves: "y R B2 R' U R2 B2 R' U' R' U' R2 B2 R2", id: '7765dab5-4397-4c88-ac28-2fc3ea127e1f' }
    ]
  },
  {
    name: 'ZBLL Pi 35',
    id: '8dcbe838-a515-4ca6-8e6c-ab80bc8eaf41',
    idMethod,
    puzzle,
    group: 'Pi 3',
    setup: "R' F2' R U' R2' F2' R U R U R2' F2' R2' y'",
    algs: [
      { moves: "y2 R2 D R' U R D' R' U R' U' R U R' U' R U' R'", id: 'cc53b39f-8e96-4f74-92dd-89621a70eb12' },
      { moves: "y R U2 R' U' R U' R2 U r f' U f r'", id: '06222d1d-5f8f-40f1-b4a1-f68b4e347300' },
      { moves: "y' L U2 L' U' L U' L2 U l F' L F l'", id: '80fe664a-ff5e-4b74-a548-a601674ee725' },
      { moves: "y R U2 R' U' R U' R' U2 r' F R F' r U R'", id: 'a9f2508a-3145-45e6-bd94-93292b64f8df' }
    ]
  },
  {
    name: 'ZBLL Pi 36',
    id: 'add0bdcf-1310-48e7-95be-b21248b8dffb',
    idMethod,
    puzzle,
    group: 'Pi 3',
    setup: "R U R' U F2' R U2' R' U2' R' F2' R",
    algs: [
      { moves: "R' U' R U' R' U2 R U' L' U R U' L U R'", id: '6861fac6-05d4-4cf1-9f70-d1073a396977' },
      { moves: "R' F2 R U2 R U2 R' F2 U' R U' R'", id: '1b5b8f7e-5cd3-4d9e-bc77-e0e1e84da77c' },
      { moves: "y2 L' U' L U' L' U2 L U L' U R U' L U R'", id: '385d7d00-9981-4bf4-97df-ed81c5da3b31' }
    ]
  },
  {
    name: 'ZBLL Pi 37',
    id: '3e667351-c498-4406-8135-9d726ee7b8da',
    idMethod,
    puzzle,
    group: 'Pi 4',
    setup: "R' U2' R U R' U' R U R2' F R U R U' R' F' R",
    algs: [
      { moves: "R' F R U R' U' R' F' R2 U' R' U R U' R' U2 R", id: '74c377fb-c00f-40a1-b484-a04c6ee99da8' },
      { moves: "y' R U R' U R2 F2 R' U2 R' U2 R2 F2 R2", id: 'c4adaeb9-64f5-428f-897b-17964e570c27' },
      { moves: "y F' R U R' U R U' R' U' R' F R U' R U' R' U R U R'", id: '4147cbd5-f057-47dd-80b7-e7a155d3d23a' },
      { moves: "y R' U' F R F2 R2 F R U F' R U' F", id: 'e253c8bd-e0dc-43f9-93f6-f8205bc65e27' }
    ]
  },
  {
    name: 'ZBLL Pi 38',
    id: '220193c4-4cf6-49d3-b3db-06ece429cfba',
    idMethod,
    puzzle,
    group: 'Pi 4',
    setup: "R U R' U R U' R' U R2' D R' U' R D' R' U' R'",
    algs: [
      { moves: "R U R D R' U R D' R2 U' R U R' U' R U' R'", id: '8b700785-906f-4b08-97c6-bc1ab8c20c85' },
      { moves: "R U2 R' U' R U R' U2 r' F R F' M'", id: 'a7f81f6d-9d0b-49fc-9204-90923bba055a' },
      { moves: "R U2 R' U' R U R' U2 L' U R U' M' x'", id: 'b221c8f8-0af5-4e9d-94ee-0b662e7f0162' }
    ]
  },
  {
    name: 'ZBLL Pi 39',
    id: '368caf9a-34a5-49f5-bdfd-fb683fb37f24',
    idMethod,
    puzzle,
    group: 'Pi 4',
    setup: "R U2' R' U L U' R' U' R2' U' R2' U2' R L'",
    algs: [
      { moves: "y' R2 F2 R2 U' R U R' U R2 F2 R' U2 R'", id: '19d9c557-952c-446e-9c89-370c31b7149c' },
      { moves: "R U2 R2 U' R2 U' R' U2 R' F R U R' U' R' F' R2", id: '84c43e17-9120-4beb-a7a1-5ac6aa79c666' },
      { moves: "y F' R U R' U' R' F R U' R U' R' U' R U R' U R U R'", id: 'e4c8a6fb-e090-4e0d-b327-c8aedbb1dbea' },
      { moves: "R' U2 R U R U2 R' U2 R' F' R U2 R U2 R' F R' U R", id: 'cb75c812-f16d-47ca-9ca5-88b785ba2f12' }
    ]
  },
  {
    name: 'ZBLL Pi 40',
    id: '44e05a3f-c65e-4c20-b18a-702eeb042a2b',
    idMethod,
    puzzle,
    group: 'Pi 4',
    setup: "R' U' R' D' R U' R' D R2' U R' U' R U R' U R y",
    algs: [
      { moves: "y' R' U' R U' R' U R U' R2 D' R U R' D R U R", id: '63886184-9afd-4a2e-9472-1c07f2713ef9' },
      { moves: "y2 F U R' U' R F' U' R' U R U' R' U2 R", id: '12da1ad1-1edb-4f14-801c-0130ac9c1132' },
      { moves: "y' R' U R' F R2 U R' U' R U R' U' F' R U2 R' U R", id: 'f212168c-fe75-46e1-b2a8-fe554cf81e9e' },
      { moves: "y' R' U' R U' R' U R U2 R D R' U R D' R2 U2 R", id: '9fc0fc34-a7b9-49f9-a9aa-add9cfa6530c' }
    ]
  },
  {
    name: 'ZBLL Pi 41',
    id: 'e898f50a-c2bb-4f8d-85f5-9ab174861784',
    idMethod,
    puzzle,
    group: 'Pi 4',
    setup: "F U R U' R' U R U' R2' F' R U R U' R'",
    algs: [
      { moves: "R U R' U' R' F R2 U R' U' R U R' U' F'", id: '6fc78b70-8daa-4b16-9c53-0e4d223e87f5' },
      { moves: "R U R' U' l' U R2 x' U R' U' R U R' U' F'", id: '50950a56-b3d0-4fe4-847e-bf828bf319a5' }
    ]
  },
  {
    name: 'ZBLL Pi 42',
    id: 'e67e6a28-6c28-48f4-a66f-c15e21b59a7d',
    idMethod,
    puzzle,
    group: 'Pi 4',
    setup: "L U' R U R' L' U2' R U2' R' U R U2' R' y2'",
    algs: [
      { moves: "y2 R U2 R' U2 R' F R2 U' R' U2 R U2 R' U' F'", id: '0ad8c771-d3ca-4ca2-9bca-c68fe1f8a36b' },
      { moves: "y2 R' U' R' D' R U' D R' D' R U2 R' D R D' R' D R2", id: 'e144b611-af32-4f08-9715-f906b9365917' },
      { moves: "y2 R U2 R' U2 l' U R' z' R' U' R U' r'", id: 'd2b426aa-65f8-486d-adc8-19e3492ba5ea' },
      { moves: "y2 R U2 R' U2 R' F R2 l U' R' U R' D' x", id: '48ac1f2c-c66f-44d2-9099-9a72c14020cf' }
    ]
  },
  {
    name: 'ZBLL Pi 43',
    id: 'b30d1bd3-1b33-42b8-a898-0c33e9522be7',
    idMethod,
    puzzle,
    group: 'Pi 4',
    setup: "R2' F2' U R U R2' U' R' U' F2' R2' U' R U' R' y",
    algs: [
      {
        moves: "y R U2 R' U' R U R' U' R' D' R U' R' D R2 U' R' U R U' R'",
        id: 'aefd27cc-8682-4067-96c2-e5160d659bcb'
      },
      { moves: "R U2 R' U R2 D R' U2 R D' R2 U' R U2 R' U' R U R'", id: '968a0098-3d00-4ade-8dae-9506e898153e' },
      { moves: "y R' U2 R U' D' R2 D R2 U' R' D' R D R' U R2", id: '21623a3a-b1f9-4fee-bca2-84cfab805ead' },
      { moves: "y' R U R' U R2 F2 U R U R2 U' R' U' F2 R2", id: '643f4192-43a6-44a9-a87a-6416f90c5bf5' }
    ]
  },
  {
    name: 'ZBLL Pi 44',
    id: '83fcf103-f0dc-4b8c-8b3d-6f0710e671cc',
    idMethod,
    puzzle,
    group: 'Pi 4',
    setup: "R U R' U R U' R' U F2' r U2' r' U' r' F r",
    algs: [
      { moves: "r' F' r U r U2 r' F2 U' R U R' U' R U' R'", id: 'f25e3a82-2bf5-472d-9b6e-e241a90cf741' },
      { moves: "y' F U R U' R' S R' D' R U R' D R2 U' R' f'", id: 'e9ed05a5-58fb-444a-b008-9115a467d174' },
      { moves: "y2 R U R' U R U R' U' R U2 R' U2 R' D' R U' R' D R", id: '513b83ad-908e-457e-8808-4736f0fb1224' },
      { moves: "U' F' U' F R U R' F R' F' R2 U R' U' R U' R'", id: 'f821181f-d0de-4655-838f-ca9c9746be80' }
    ]
  },
  {
    name: 'ZBLL Pi 45',
    id: '373fb32f-f863-45e1-9f15-96d0e5a86807',
    idMethod,
    puzzle,
    group: 'Pi 4',
    setup: "R' U' R U' B2' R' U2' R U2' l U2' l'",
    algs: [
      { moves: "R U R' U R U2 R' U' R U' L' U R' U' L", id: '8af53b26-8886-4053-8ad1-078ffbec8896' },
      { moves: "R B2 R' U2 R' U2 R B2 U R' U R", id: '209b92dc-e50e-40fb-ade4-b9549943789d' },
      { moves: "y2 R U2 R' U2 R' F2 R F2 U L' U L", id: '9ad57962-b6d2-4534-b03a-e87ac3e7b655' },
      { moves: "l U2 l' U2 R' U2 R B2 U R' U R", id: '8fe60a29-57d7-4075-ae08-69d89d800c65' }
    ]
  },
  {
    name: 'ZBLL Pi 46',
    id: 'fedb2e53-d14d-4c31-bea6-bbf34dfcc7f6',
    idMethod,
    puzzle,
    group: 'Pi 4',
    setup: "R' U' R U' R' U R U' R' U R' D' R U R' D R2' y2'",
    algs: [
      { moves: "y' R' U2 R U R' U R2 U' r' F R' F' r", id: '3eb84645-d64c-4038-b0a6-616dae4c2abb' },
      { moves: "y' R' U2 R U R' U R2 U' L' U R' U' L", id: '0af9fdd6-797f-4a43-83bc-c3f74cb3fdb2' },
      { moves: "y2 R2 D' R U' R' D R U' R U R' U' R U R' U R", id: '85ef409a-a4c3-4f20-9baf-02d0d92d1aaf' },
      { moves: "y' R2 B2 R2 U R U R B2 R2 U' R B2 R'", id: '84a0eda8-b058-4355-825d-c57406b56ade' }
    ]
  },
  {
    name: 'ZBLL Pi 47',
    id: 'b1aaf59f-680f-4a37-9c76-de4fa37f4aec',
    idMethod,
    puzzle,
    group: 'Pi 4',
    setup: "R2' D R' U R D' R' U R' U' R U R' U' R U' R' y'",
    algs: [
      { moves: "y R U R' U R U' R' U R U' R D R' U' R D' R2", id: '6f8c7a62-2829-45b8-a422-69a5d5e6a65f' },
      { moves: "y' L U' R' U L' U' R2 U R' U R U2 R'", id: '13dccb1a-66c1-4faf-834d-8aa72711b297' },
      { moves: "y' R' F2 R U' R2 F2 R U R U R2 F2 R2", id: '41770b56-468a-45a7-a974-f9055529b3c7' },
      { moves: "y R U' L' U R' U' L U2 R U R' U R U2 R'", id: '393b737a-1a0d-46fa-a9d4-03323de2d42b' }
    ]
  },
  {
    name: 'ZBLL Pi 48',
    id: '1f8cb404-e8c3-4dde-af7b-dcaef5cfd75e',
    idMethod,
    puzzle,
    group: 'Pi 4',
    setup: "R' F2' R U2' R U2' R' F2' U' R U' R' y",
    algs: [
      { moves: "y' R U R' U F2 R U2 R' U2 R' F2 R", id: 'e9796ade-6b07-47c9-b23f-213519f19ffb' },
      {
        moves: "y2 R U R' U R U' R' U R' D' R U2 R' D R2 U' R' U2 R U2 R'",
        id: '6287b773-3bb6-4dd0-8d22-8f305bc24a3e'
      },
      { moves: "U' R U R' F' R U' r' F R' F r U F", id: '966c62eb-4874-4725-b6aa-7f7e60d90555' },
      { moves: "y R U' L' U R' U' L U R' U2 R U R' U R", id: 'fc6a59fd-829e-4a32-a0e8-751bcfbee998' }
    ]
  },
  {
    name: 'ZBLL Pi 49',
    id: '2afc0707-4e07-4c86-9079-e6156b6f23a2',
    idMethod,
    puzzle,
    group: 'Pi 5',
    setup: "R' U2' R2' U R U R2' D' R U' R' D U' R'",
    algs: [
      { moves: "y R U2 R' U2 R' U' F U R2 U' R' U R U' R' F'", id: '565287fa-0a14-483a-8f6e-5c7ba3a5a8fa' },
      { moves: "R U D' R U R' D R2 U' R' U' R2 U2 R", id: 'd4e97dc1-9df5-4da7-a484-7f68067d7e13' },
      { moves: "y2 R' U2 R U' R D R' U' R D' R2 U R U' R' U R", id: '587178f3-00cf-4c48-8518-f1aa44ed808d' },
      { moves: "y2 R F' U' R2 U' F U F' R2 U F R'", id: '060f6421-c9ae-4262-b095-5805be4f4759' }
    ]
  },
  {
    name: 'ZBLL Pi 50',
    id: '87cb5e35-80e3-4a80-8072-d07951b77005',
    idMethod,
    puzzle,
    group: 'Pi 5',
    setup: "R U2' R' U' F' R U2' R' U' R U' R' F R U' R' y",
    algs: [
      { moves: "R' F' U' F U' R U S' R' U R S", id: '8b29579a-e3fd-4194-8c18-c11a9f509334' },
      { moves: "y' R U R' F' R U R' U R U2 R' F U R U2 R'", id: 'a521c1d0-7862-4fbe-bcd6-db1636bee487' },
      { moves: "r' U' R U' R' U R U' R' U R' F R F' U r", id: '81b998d5-1fd3-4a13-a21d-cbe603834fdc' },
      { moves: "y2 S' R U R' S U R U' B U' B' R'", id: '4d5f6834-ece6-4105-9214-699296690c94' }
    ]
  },
  {
    name: 'ZBLL Pi 51',
    id: 'ace84407-bbd9-4abf-ae22-0f7a3eefe64e',
    idMethod,
    puzzle,
    group: 'Pi 5',
    setup: "F R2' U' R U' R U' R' U2' R' U R2' F' y2'",
    algs: [
      { moves: "y2 R F U' R2 U2 R U R' U R2 U F' R'", id: 'a1aba157-8a6a-41d0-9353-2d1e40395c2a' },
      { moves: "y2 R2 D R' U2 R D' R' U' R' U R2 D R' U2 R D' R2", id: 'f7f4a90b-00aa-4739-92c1-80a7f11c5a25' },
      { moves: "S' R U R' S R U' R2 F' U' F U' R U R' U R", id: 'dd3a49fe-3220-4f14-b3e1-48fafff74ed6' },
      { moves: "B' R2 U R' U R' U R U2 R U' R2 f z'", id: 'b917977a-f4ae-422f-9b84-0ab05a4341ec' }
    ]
  },
  {
    name: 'ZBLL Pi 52',
    id: '72a9580b-6aae-4e16-9fb0-154d59386462',
    idMethod,
    puzzle,
    group: 'Pi 5',
    setup: "R U2' R' U R' D' R U R' D R2' U' R' U R U' R' y'",
    algs: [
      { moves: "y R U R' U' R U R2 D' R U' R' D R U' R U2 R'", id: '264cb61d-b153-4ff4-aa3c-d30f711b661f' },
      { moves: "R' U R U F R' U R U' F' U' R' U' R", id: 'dd0593f4-5069-4f67-8743-bfe0c27b0d68' },
      { moves: "F' L' U' L U L' U' L2 U F U' L' U2 L' U2 L", id: '6d5e8a94-7e3b-4d8f-8d3a-3a383009b509' },
      { moves: "y' R U2 R2 U' R' U' R2 D R' U R U D' R", id: '11434193-e9b8-444c-baba-751009ddc029' }
    ]
  },
  {
    name: 'ZBLL Pi 53',
    id: '92ef0808-39f7-447c-b6cb-76c5d2379ebb',
    idMethod,
    puzzle,
    group: 'Pi 5',
    setup: "F R U' R' U2' R' U2' R2' U R2' U R U' F'",
    algs: [
      { moves: "F U R' U' R2 U' R2 U2 R U2 R U R' F'", id: '906abfaa-88f5-42c8-a484-4e5ba3e0332a' },
      { moves: "y2 R U' R2 D' R U2 R' D U2 R2 U R2 U R", id: '63e34d64-966e-4c8f-bd84-1897d0139316' },
      { moves: "F U R' U' R2 U' R2 U2 R F' L' U L", id: '0f81851f-b69f-4804-8235-931e5412f87a' },
      {
        moves: "y' R' U' R' F R F' R U' R' U2 R S R' F' R S' R' F R U' M' U2 M",
        id: '52575f02-a860-45e2-8f56-c002a8987d00'
      }
    ]
  },
  {
    name: 'ZBLL Pi 54',
    id: '9d529eb5-a0a3-4dd3-87b7-6211bbe9226e',
    idMethod,
    puzzle,
    group: 'Pi 5',
    setup: "R2' D' R U2' R' D R U2' R' D' R U' R' D R U R y'",
    algs: [
      { moves: "y R' U' R' D' R U R' D R U2 R' D' R U2 R' D R2", id: '62f1a1ef-34f6-491b-bf83-2c53687b8316' },
      { moves: "R U2 R2 F R F' R' F R F' R' F R F' R U2 R'", id: 'f9e06f68-f87b-4ef8-a3c1-54c3b413d22f' },
      { moves: "y R2 D' R U2 R' D R U2 R' D' R U' R' D R U R", id: '0595442a-2aec-46f5-a10a-6c68c15f4084' },
      { moves: "y' R' F2 D R U2 R' D' R2 U2 R' F2 R U2 R'", id: '4194fcfd-c579-4657-8da8-3cf3d63a2bab' }
    ]
  },
  {
    name: 'ZBLL Pi 55',
    id: 'f29ec652-a979-4c4d-8717-456eeeb2bc38',
    idMethod,
    puzzle,
    group: 'Pi 5',
    setup: "R U R' U R U R' U' R U R D R' U R D' R2'",
    algs: [
      { moves: "R2 D R' U' R D' R' U' R' U R U' R' U' R U' R'", id: 'b63d19b4-6240-41db-a899-0b491d6be4dc' },
      { moves: "R U R' U L' U2 R U2 R' U2 L U' R U' R'", id: 'ee8faa6a-bc5a-4c29-b401-6d8e80c13f2d' },
      { moves: "R U R' U2 B' U R U2 R' U' B U2 R U' R'", id: '720431d9-7c3d-48ee-a577-b964c294a53a' },
      { moves: "y2 R U R' U R U R' U' R U R D R' U R D' R2", id: 'f11c8337-34b6-4610-bd95-3ac885e4d484' }
    ]
  },
  {
    name: 'ZBLL Pi 56',
    id: '3d9e632e-a13e-4016-894c-dae182b90e24',
    idMethod,
    puzzle,
    group: 'Pi 5',
    setup: "R' U' R U' R' U' R U R' U' R' D' R U' R' D R2'",
    algs: [
      { moves: "R2 D' R U R' D R U R U' R' U R U R' U R", id: 'dc9e9aca-21b8-4807-b0e8-4f339bf7ce72' },
      { moves: "R' U' R U2 F U' R' U2 R U F' U2 R' U R", id: '7a38fca1-a670-40b1-b81b-786379ed7794' },
      { moves: "U2 L' U' L U' R U2 L' U2 L U2 R' U L' U L", id: '55343f05-efe9-4f10-bc7c-635f6c75f541' },
      { moves: "L U L' U R' U L U R U R' U M x", id: '665b97c1-e30d-4aea-a35e-a87219597fe1' }
    ]
  },
  {
    name: 'ZBLL Pi 57',
    id: '26528c59-bf01-4ee0-9219-60a67df621d3',
    idMethod,
    puzzle,
    group: 'Pi 5',
    setup: "R U R' U' R U R2' D' R U' R' D R U' R U2' R' y2'",
    algs: [
      { moves: "y2 R U2 R' U R' D' R U R' D R2 U' R' U R U' R'", id: '06c98b03-32a4-48d3-ba69-f306c39e845d' },
      { moves: "y2 R' U R U F U R' U' R F' U' R' U' R", id: '45904c42-8c75-4da9-811e-070976b0c082' },
      { moves: "y L' U2 L U2 L U F' U' L2 U L U' L' U L F", id: 'fc9e16d9-c68d-4c17-8640-438ba9e6dcc7' },
      { moves: "y' F' R U F2 U R' U' R F2 U' R' F", id: '68a4ba73-6b3e-4b9a-9e76-ce5badc05f79' }
    ]
  },
  {
    name: 'ZBLL Pi 58',
    id: '57b397ba-fd75-48fc-a5cc-eeda29b4ba4a',
    idMethod,
    puzzle,
    group: 'Pi 5',
    setup: "F R2' U' R U2' R U R' U R' U R2' F'",
    algs: [
      { moves: "R2 D R' U2 R D' R2 U' R U R D R' U2 R D' R2", id: 'a16cd4e8-3be6-4510-9ccf-bcff03684e48' },
      { moves: "R F U' R2 U' R U' R' U2 R2 U F' R'", id: '109d7fe8-a3a8-4526-8345-2cbf8e699d96' },
      { moves: "F R2 U' R U' R U' R' U2 R' U R2 F'", id: 'b43ada83-c9cc-412e-b527-698cebf4e2cc' },
      { moves: "y2 R2 U R' U2 R' U' R U R D R' U R D' R' U R U' R2", id: '3b25ae00-b461-490c-bbd6-e9b218f11fc9' }
    ]
  },
  {
    name: 'ZBLL Pi 59',
    id: 'bd0e64a6-c448-4d3e-b0c3-db5cbe477a7e',
    idMethod,
    puzzle,
    group: 'Pi 5',
    setup: "R' U2' R U' R D R' U' R D' R2' U R U' R' U R y",
    algs: [
      { moves: "y' r U R' U R' F R F' R U' R' U R U2 r'", id: '49b3a1c4-8d5e-4ef7-81d6-95c2ec893491' },
      { moves: "R F' U' R2 F U' F' U R2 U F R'", id: '1bab071b-c9c8-42f7-8bb3-30c5b01e006c' },
      { moves: "y' R' U' R U R' U' R2 D R' U R D' R' U R' U2 R", id: '6700401c-7fc1-485a-8267-0cd8ad484560' },
      { moves: "y2 F R U R' U' R U R2 U' F' U R U2 R U2 R'", id: '41751c8c-606c-4fcf-90a2-a0a1de2215c4' }
    ]
  },
  {
    name: 'ZBLL Pi 60',
    id: 'd9a98235-f491-43e0-8f90-115a1a83ba18',
    idMethod,
    puzzle,
    group: 'Pi 5',
    setup: "R U R' F' R U R' U R U2' R' F U R U2' R' y'",
    algs: [
      { moves: "y R U2 R' U' F' R U2 R' U' R U' R' F R U' R'", id: '17a4b933-8114-44b4-91f7-47c34fc5bb28' },
      { moves: "y2 S' R' U' R S U' R' U F' U F R", id: '72cebc8e-deb1-45bd-8c71-4fa8e73d8d3a' },
      { moves: "r U R' U R U' R' U x' R F' R U' R' U F' L'", id: '088bb5a4-168d-4a1a-837d-61311fadd197' },
      { moves: "y R U2 R2 U' R2 U' M' x' U' R' U L' U2 R", id: 'd83ae376-c008-4cca-8185-c68c476c9c62' }
    ]
  },
  {
    name: 'ZBLL Pi 61',
    id: 'd513549b-1981-4856-8d45-08476006b3bd',
    idMethod,
    puzzle,
    group: 'Pi 6',
    setup: "R' U2' R2' U R2' U R2' U2' R'",
    algs: [{ moves: "R U2 R2 U' R2 U' R2 U2 R", id: 'b7bd4b11-ac9f-47bd-9192-56c321ab7a01' }]
  },
  {
    name: 'ZBLL Pi 62',
    id: 'a2393457-ce8c-470c-84c8-fba163011919',
    idMethod,
    puzzle,
    group: 'Pi 6',
    setup: "R' U' R U' R' U2' R2' U2' R' U' R U' R' y'",
    algs: [
      { moves: "y' R' U2 R U R' U R2 U R' U R U2 R'", id: '9ec919d1-2ffc-4cc1-9fcb-5c28b630dd18' },
      { moves: "S' r' U r2 U' r2 U' r2 U r' S", id: 'd6d18678-8a7f-4be1-9e0a-52b0f53cf89b' },
      { moves: "y R U R' U R U2 R2 U2 R U R' U R", id: 'eb60e302-4761-4b89-a3d3-2e4b081fdc04' },
      { moves: "R U2 R' U' R U' R' U2 R' U' R U' R' U2 R", id: '32648682-d54b-4722-86cb-e05802b8fd0a' }
    ]
  },
  {
    name: 'ZBLL Pi 63',
    id: 'bea0a88b-b8be-466b-887e-a6e25f0bd7cf',
    idMethod,
    puzzle,
    group: 'Pi 6',
    setup: "R U' R' U2' R U R' U2' R U R' U2' R U2' R' y",
    algs: [
      { moves: "y' R U2 R' U2 R U' R' U2 R U' R' U2 R U R'", id: '726f6eeb-6126-423c-af44-374e829f3f42' },
      { moves: "y2 R U R' U' R2 U R' U R' U' R U R U2 R2", id: '169c569b-64ee-49b1-afe9-cc3fe8ef8980' },
      { moves: "y R U2 L' U R' U' R U R' U' R L U2 R'", id: 'efd48d44-de37-410f-8a13-776782d050ec' },
      { moves: "S R2 S' R U2 R2 U R2 U' R2 U2 R", id: '9d893f79-cdff-4f54-99e8-82dae5fba550' }
    ]
  },
  {
    name: 'ZBLL Pi 64',
    id: '010081a7-ca94-46e3-a2c1-9fa4b64ec604',
    idMethod,
    puzzle,
    group: 'Pi 6',
    setup: "R' U R U2' R' U' R U2' R' U' R U2' R' U2' R y'",
    algs: [
      { moves: "y R' U2 R U2 R' U R U2 R' U R U2 R' U' R", id: '9cddd52a-0d1f-4e99-b093-5cf043e2c054' },
      { moves: "y2 R U R' U' R2 U R' U R U2 R2 U' R U R'", id: '4d86071e-5499-46df-a815-d01547d59016' },
      { moves: "y2 S' U2 S R U2 R2 U' R2 U R2 U2 R'", id: '575c7e7e-c4c4-427c-9d5d-ff1bb1cf1005' },
      { moves: "y L' U2 R U' L U L' U' L U L' R' U2 L", id: 'f5f04195-04f4-48d2-85de-cea24fe22885' }
    ]
  },
  {
    name: 'ZBLL Pi 65',
    id: '7f293956-d811-43a3-b324-8cb6060c91d5',
    idMethod,
    puzzle,
    group: 'Pi 6',
    setup: "R U2' R' U2' R U' R' U2' R U' R' U2' R U R' y2'",
    algs: [
      { moves: "y2 R' U R U' R2 U2 R U R' U R2 U' R' U R", id: 'baed3a3f-14a9-4b59-b934-b0b68cb3d1e8' },
      { moves: "y' r U2 R2 F R F' R' F R F' R U2 r'", id: '855b74d0-b53e-456c-ba33-6da596a393ba' },
      { moves: "R' U2 R2 U R2 U' R2 U2 R' S R2 S'", id: 'bff0d9cb-4a59-4b4b-8d7c-738a1cbf2ee9' },
      { moves: "y2 R U' R' U2 R U R' U2 R U R' U2 R U2 R'", id: '6070833e-dc69-4ca0-97e6-e6cc24f61ac4' }
    ]
  },
  {
    name: 'ZBLL Pi 66',
    id: 'f93c1723-7196-4f4e-af97-ede3b06ee7a6',
    idMethod,
    puzzle,
    group: 'Pi 6',
    setup: "R' U2' R U2' R' U R U2' R' U R U2' R' U' R y2'",
    algs: [
      { moves: "y2 R U' R' U R2 U2 R' U' R U' R2 U R U' R'", id: 'c02fe3d2-1ddb-48fd-9170-e05ee40e8297' },
      { moves: "R U2 R2 U' R2 U R2 U2 R S R2 S'", id: '4f663728-ba84-49b6-b293-0733f42fadca' },
      { moves: "y2 R2 U2 R U R U' R' U R' U R2 U' R' U R", id: '70dbc8eb-3da8-4bc4-ad60-939a1df018cc' },
      { moves: "y2 R' U R U2 R' U' R U2 R' U' R U2 R' U2 R", id: '02407ff8-6c43-4443-b544-a17b8978c091' }
    ]
  },
  {
    name: 'ZBLL Pi 67',
    id: '3880f781-f7a3-4287-a8ba-cc7c0ad33e8b',
    idMethod,
    puzzle,
    group: 'Pi 6',
    setup: "R' U2' R U R' U R2' U R' U R U2' R' y'",
    algs: [
      { moves: "y R U2 R' U' R U' R2 U' R U' R' U2 R", id: '94d3f9d7-aa98-4ff4-bf2e-eb56aef727ab' },
      { moves: "S' r U' r2 U r2 U r2 U' r S", id: '6cc6ccfb-09fb-44b5-a2d9-4649cc0c0338' },
      { moves: "y' R' U' R U' R' U2 R2 U2 R' U' R U' R'", id: '715a8bcc-8b7e-4d23-a6c5-291adbac1d34' },
      { moves: "R' U2 R U R' U R U2 R U R' U R U2 R'", id: '5e2df89a-e70f-42ab-9fca-7bf1dda6d452' }
    ]
  },
  {
    name: 'ZBLL Pi 68',
    id: '9fdbf466-9b25-48da-8486-a165c2e220fa',
    idMethod,
    puzzle,
    group: 'Pi 6',
    setup: "R U2' R2' U' R2' U' R2' U2' R",
    algs: [
      { moves: "R' U2 R2 U R2 U R2 U2 R'", id: '242079ff-3b95-40fd-a5bb-c53edf63affb' },
      { moves: "y2 L' U2 L2 U L2 U L2 U2 L'", id: 'd5125599-572e-4370-818a-6e2239e9ec33' }
    ]
  },
  {
    name: 'ZBLL Pi 69',
    id: '5f986dbe-dbf1-4716-a2c1-49484bfcb2ed',
    idMethod,
    puzzle,
    group: 'Pi 6',
    setup: "R' U2' R2' U R' U R U2' R' U' R' U R",
    algs: [
      { moves: "R U R' U R U2 R' U' R U R' U R U2 R'", id: 'b481b536-2df4-41f3-ba84-d911436c0dca' },
      { moves: "R' U' R U R U2 R' U' R U' R2 U2 R", id: '34e1ee17-60cf-45c4-bc0d-c6a8721eac5f' },
      { moves: "F' U' L' U L S' U' L' U L f", id: 'd8c21c48-8887-4987-9d09-936426b9c7cb' },
      { moves: "y2 f' L' U' L U f F' L' U' L U F", id: '44f8ccbc-2139-4459-b323-c44010703e6e' }
    ]
  },
  {
    name: 'ZBLL Pi 70',
    id: '626885b7-6311-4379-b768-c31517e3c2ac',
    idMethod,
    puzzle,
    group: 'Pi 6',
    setup: "R U2' R2' U' R U' R' U2' R U R U' R'",
    algs: [
      { moves: "R' U' R U' R' U2 R U R' U' R U' R' U2 R", id: '53b33d84-0549-4f04-9462-9f7611386c27' },
      { moves: "R U R' U' R' U2 R U R' U R2 U2 R'", id: '1eb3404f-69d5-42f0-921e-e585a2030688' },
      { moves: "y2 F U R U' R' S U R U' R' f'", id: '30232e59-7494-4911-abf3-50051df5ef62' },
      { moves: "R U2 R2 U' R U' R' U2 R U R U' R'", id: 'e727fc19-f9a6-4b9d-ba45-b84d648f2ade' }
    ]
  },
  {
    name: 'ZBLL Pi 71',
    id: 'a324d590-f002-43df-bb02-ca3d26e7dc9c',
    idMethod,
    puzzle,
    group: 'Pi 6',
    setup: "R U2' R' U' R U' R' U' R U2' R' U' R U' R' y'",
    algs: [
      { moves: "y R U R' U R U2 R' U R U R' U R U2 R'", id: 'e65cfa82-02ad-42eb-8261-7a90814a1053' },
      { moves: "R' U2 R U R' U R U R' U2 R U R' U R", id: '8d98482f-93d5-4a5b-b77f-502e0c86ebdc' },
      { moves: "y' R' U' R U' R' U2 R U' R' U' R U' R' U2 R", id: '4b64f522-3bf5-4610-86d8-517bedc553d9' },
      { moves: "y R2 D' R U' R' D R U R' D' R U2 R' D R U2 R", id: '0b984bda-120c-4597-94e8-a57400a38c11' }
    ]
  },
  {
    name: 'ZBLL Pi 72',
    id: '94bd8a89-8d5d-4617-82dd-6c49a3959d24',
    idMethod,
    puzzle,
    group: 'Pi 6',
    setup: "R U2' R' U' R U R2' U2' R2' U R2' U R2' U' R'",
    algs: [
      { moves: "R U R2 U' R2 U' R2 U2 R2 U' R' U R U2 R'", id: '425cda14-65d4-4010-b780-abbfae4b1738' },
      { moves: "R U R' U' R' U' R U R U R' U' R' U R U' R U' R'", id: '47fc7431-9edd-4861-8e10-d4638d69741f' },
      { moves: "F R U R' U' R U R' U' F' R U R' U' M' U R U' r'", id: 'a387c3be-08cf-4f6a-b720-3a5c859d6235' },
      { moves: "y' R' U2 R U R' U' R2 U2 R2 U' R2 U' R2 U R", id: 'dafba888-16ac-481e-bc66-9ff19478ae1a' }
    ]
  }
]
