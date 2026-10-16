import type { AlgorithmCollection } from '../types'

const idMethod = 'OLL_OH_ALGS'
const puzzle = '333'

export const OLL_OH_ALGS: AlgorithmCollection[] = [
  {
    name: 'OLL 1',
    id: '4c89ad97-03d2-4aa0-93f9-5d86cd87b8ad',
    idMethod,
    puzzle,
    group: 'Dot Case',
    algs: [
      { moves: "y (R U' R2' D') (r U' r' D) (R2 U R')", id: 'a2630fe2-8bae-404f-88a5-592097d98aa1' },
      { moves: "(r' U' R U' R' U2' r) U (r U2' R' U' R U' r')", id: '31268401-be99-4670-ab47-a51f16e1fcba' },
      { moves: "R U2 R2 F R F' U2 R' F R F'", id: '3dcb29da-5497-4c3c-819b-e47baf73a91d' },
      { moves: "y R' U R2 z' R u' z U r z' R' U2 z U' R", id: '6f20d2f4-c87f-4674-b556-e0adae99ae53' }
    ]
  },
  {
    name: 'OLL 2',
    id: 'f9fe70e4-2661-4f83-8ff1-af61d345d7f9',
    idMethod,
    puzzle,
    group: 'Dot Case',
    algs: [
      { moves: "y (r U r') U2' R U2' R' U2' (r U' r')", id: 'd7759a7c-99e3-41ab-80eb-8e14ca49d7ea' },
      { moves: "F R U R' U' F' f R U R' U' f'", id: '6603ac93-c3dc-4181-893f-21123c6622b6' },
      { moves: "U2 y2 r' U' r R' U' R U' R' U R U2 r' U r", id: '3fca8add-c2ca-4029-8602-4d23b26124ad' }
    ]
  },
  {
    name: 'OLL 3',
    id: '53d2f781-97a2-4cc9-b1f0-7f91efe3680b',
    idMethod,
    puzzle,
    group: 'Dot Case',
    algs: [
      { moves: "y r' (R2 U R' U) (r U2' r' U) r R'", id: '8ab4b940-e574-4f69-a997-e4c9df43c89a' },
      { moves: "y' r U2 R' U' R U' r' U r' U' R U' R' U2 r", id: '4d76b9f2-c7e0-4763-a57b-b357b4e5b58c' }
    ]
  },
  {
    name: 'OLL 4',
    id: 'cffd33d5-eae7-4f0a-a921-8620b407ab4e',
    idMethod,
    puzzle,
    group: 'Dot Case',
    algs: [
      { moves: "y r' R U' (r U2' r' U') (R U' R2' r)", id: 'b560d982-b493-4e3e-a9ab-835f28ebf2cc' },
      { moves: "U2 F U R U' R' F' U' F R U R' U' F'", id: 'b7dbd370-c33c-4d14-bafc-34f79f880d68' }
    ]
  },
  {
    name: 'OLL 5',
    id: '0ff0eaa1-76ee-4b8f-a6ec-0aec8ff3acb1',
    idMethod,
    puzzle,
    group: 'Square Shapes',
    algs: [
      { moves: "r' U2 (R U R' U) r", id: 'd01d1b9c-5e2a-4367-9daf-462afbeea8a9' },
      { moves: "y2 l' U2 L U L' U l", id: '2cb4a02d-a3c4-4893-987c-5e4556f1cc0f' }
    ]
  },
  {
    name: 'OLL 6',
    id: '150e230c-f115-469e-a2ea-682e88bfc2e8',
    idMethod,
    puzzle,
    group: 'Square Shapes',
    algs: [{ moves: "r U2 R' U' R U' r'", id: '16a02ae6-cca8-497c-9eef-2c0d83bf8aee' }]
  },
  {
    name: 'OLL 7',
    id: 'f6436d41-b3d7-4d2f-b50a-b20d88d45d42',
    idMethod,
    puzzle,
    group: 'Lightning Shapes',
    algs: [{ moves: "(r U R' U) R U2 r'", id: 'c3bfbc93-ba51-4004-b039-a3caf84da7fa' }]
  },
  {
    name: 'OLL 8',
    id: '9cb61e45-b234-497b-a231-6877f07eaeb5',
    idMethod,
    puzzle,
    group: 'Lightning Shapes',
    algs: [
      { moves: "r' U' R U' R' U2 r", id: 'd505c988-8db6-4599-9cb1-eadfa61b78c1' },
      { moves: "y2 l' U' L U' L' U2 l", id: 'd5e31695-6f2a-4ffa-a8e4-6b5d46682f5f' }
    ]
  },
  {
    name: 'OLL 9',
    id: '61aee10b-8c25-4b97-9905-e59476d4c2dd',
    idMethod,
    puzzle,
    group: 'Fish Shapes',
    algs: [
      { moves: "(R U R' U') R' F (R2 U R' U') F'", id: 'ef39e3f4-13c6-4cfb-aba9-533d03dd5420' },
      { moves: "y' r' R2 U2' (R' U' R U') (R' U' r R')", id: 'f7da054c-eafb-46a4-a4ef-bd92b1909ee2' },
      { moves: "U' r' R2 U2 R' U' R U' R' U' r R'", id: 'c598f7be-6e67-41c3-ab99-c1a77f34725d' }
    ]
  },
  {
    name: 'OLL 10',
    id: '17937cf8-a25a-4a00-950a-004a615d0826',
    idMethod,
    puzzle,
    group: 'Fish Shapes',
    algs: [
      { moves: "y r R2 U2' (R U R' U) (R U r' R)", id: 'e212dd09-1520-462a-8ee1-f84e8bddfcd6' },
      { moves: "(R U R' U) (R' F R F') (R U2' R')", id: '72e5a4c0-3e34-4e62-8e6f-09e45bd8da77' }
    ]
  },
  {
    name: 'OLL 11',
    id: 'cf4026c2-8e9b-4359-a893-6d2715387ff7',
    idMethod,
    puzzle,
    group: 'Lightning Shapes',
    algs: [
      { moves: "r' (R2 U R' U R U2' R') U r R'", id: '1d2eedb9-250c-4054-874c-ae3401f10895' },
      { moves: "y2 r U R' U R' x U R U' R x' U2 r'", id: '69c8793c-bc1d-4e87-a5c3-9fd1918e8d70' }
    ]
  },
  {
    name: 'OLL 12',
    id: '522a17ff-c9af-49d0-b25d-28ae79827979',
    idMethod,
    puzzle,
    group: 'Lightning Shapes',
    algs: [
      { moves: "r (R2 U' R U' R' U2' R) U' r' R", id: 'd4d742ba-0606-4b93-b109-a4c7bccae482' },
      { moves: "y2 r' U' R U' R x' U' R' U x R' U2 r", id: '471eae81-09cb-48d3-9033-3f23d484f61f' },
      { moves: "y F R U R' U' F' U F R U R' U' F'", id: 'e05f054d-4cf5-4106-9e4c-70726dd5fe17' }
    ]
  },
  {
    name: 'OLL 13',
    id: 'cca77aa1-84ed-42ed-a8cb-5fc7e352ce04',
    idMethod,
    puzzle,
    group: 'Knight Move Shapes',
    algs: [
      { moves: "F (U R U2' R') (U' R U R') F'", id: 'f987a92d-4b4f-4727-8a63-b9245a29c1e7' },
      { moves: "(r U' r') (U' r U r') z x (U' R U)", id: 'e97f4698-5161-45e9-86dc-709d6c320258' },
      { moves: "r U' r' U' r U r' y' R' U R", id: 'e5a18093-753b-4239-bc66-3584f0dd87e2' }
    ]
  },
  {
    name: 'OLL 14',
    id: 'e896115c-605d-4e0b-b5a0-a8656b1d4769',
    idMethod,
    puzzle,
    group: 'Knight Move Shapes',
    algs: [{ moves: "(r' U r) (U r' U' r) y R U' R'", id: '67c0c75c-be05-480a-a0ff-29ede17d6283' }]
  },
  {
    name: 'OLL 15',
    id: 'dc987d85-63d9-49c0-a3c5-0bbb7701f28b',
    idMethod,
    puzzle,
    group: 'Knight Move Shapes',
    algs: [{ moves: "(r' U' r) (R' U' R U) (r' U r)", id: '002cdc0a-f62b-4800-af13-b004fb5787a6' }]
  },
  {
    name: 'OLL 16',
    id: 'e3f5aef8-0ae3-45b2-aeb3-eed38286a433',
    idMethod,
    puzzle,
    group: 'Knight Move Shapes',
    algs: [{ moves: "(r U r') (R U R' U') (r U' r')", id: 'e88ef107-0a0d-4515-aeda-9f39f099c883' }]
  },
  {
    name: 'OLL 17',
    id: '7a92d48d-27fb-4783-8157-2a4538491a9c',
    idMethod,
    puzzle,
    group: 'Dot Case',
    algs: [
      { moves: "y (F R' F' R) U2' R U' y (R U' R' F')", id: '0c46744b-c721-4b86-bd2a-ae894186a603' },
      { moves: "(R U R' U) (R' F R F') U2' (R' F R F')", id: '93185e8f-9d78-44fb-9d68-0e8b592ba76d' },
      { moves: "R U R' U x R' U R U' x' U2 x R' U R U'", id: '26f9fe86-1e53-4b4c-8224-8fd791349577' },
      { moves: "y2 r U' z U' R x' U2 R U' y R U' R' F'", id: '0943c52b-6dd5-42ed-8930-9e04cbb08054' }
    ]
  },
  {
    name: 'OLL 18',
    id: '7659702f-f009-40f0-8278-18ad80727b54',
    idMethod,
    puzzle,
    group: 'Dot Case',
    algs: [{ moves: "(r U R' U R U2 (r2') U' R U' R' U2 r)", id: 'd435ba8f-54e9-438b-8d2e-0f004b4eeb8f' }]
  },
  {
    name: 'OLL 19',
    id: '59131217-9e1e-4762-86ff-fe13b6264e72',
    idMethod,
    puzzle,
    group: 'Dot Case',
    algs: [
      { moves: "(r' U2' R U R' U) (r2 U2' R' U' R U' r')", id: 'a763cbda-5041-4ad3-b186-59168eae2c4b' },
      { moves: "r' R U (R U R' U') r x (R2 U R U')", id: 'a63adb27-827b-48ad-a71f-3446f95622b8' }
    ]
  },
  {
    name: 'OLL 20',
    id: '87642e26-ebec-448b-a72c-8b879d8f2ccd',
    idMethod,
    puzzle,
    group: 'Dot Case',
    algs: [
      { moves: "(r' R) U (R U R' U') (r2 R2') (U R U' r')", id: 'f06abca3-ec98-438c-9a35-e0dbf033f475' },
      { moves: "(r U R' U') r2 R2 (U R U' R') U' r R'", id: '33bb2c4f-4e4d-46be-86eb-30fe6ef3acc5' }
    ]
  },
  {
    name: 'OLL 21',
    id: '8478065e-7349-4554-a333-6caa493036f7',
    idMethod,
    puzzle,
    group: 'OCLL',
    algs: [
      { moves: "R U2 R' U' R U R' U' R U' R'", id: 'f63f7c28-eaa9-4b43-bb94-e0d3a2c3afa7' },
      { moves: "F R U R' U' R U R' U' R U R' U' F'", id: 'aa372730-a6dc-4229-9bcd-371638945594' },
      { moves: "y R' U' R U' R' U R U' R' U2 R", id: 'a1824f77-97c9-4be4-9a68-6c87a4e46aa9' },
      { moves: "y F R U' R' U R U2 R' U' R U R' U' F'", id: '35fd0480-0c6d-417d-a8fd-c7bbbd594e70' }
    ]
  },
  {
    name: 'OLL 22',
    id: 'c1445d95-b727-4e25-a096-bf5366b132ac',
    idMethod,
    puzzle,
    group: 'OCLL',
    algs: [
      { moves: "R U2 R2 U' R2 U' R2 U2' R", id: '1de28b2a-45ef-46e0-b960-546542b7ed3a' },
      { moves: "y2 z U' R2 U2 R U2 R U2 R2 U'", id: '0be12c80-e6ef-47e2-a62f-2d1e87810e6c' }
    ]
  },
  {
    name: 'OLL 23',
    id: 'b3185627-d69c-4f96-87be-15b6d5b6a6a8',
    idMethod,
    puzzle,
    group: 'OCLL',
    algs: [
      { moves: "(R U R' U R U2') (R2' U' R U' R' U2' R)", id: '60b305d4-12cf-4cfd-8e9f-f571a51de772' },
      { moves: "y (R U R' U') (R U' R' U2') (R U' R' U2') (R U R')", id: '93e8fbd6-b0b5-488c-b247-581f5a70caa9' },
      { moves: "y2 R2' D' (R U2' R') D (R U2' R)", id: '3dd79155-004e-4265-825c-49ca74056e52' },
      { moves: "R2 D R' U2 R D' R' U2 R'", id: '98a6ddf8-e520-4bad-84b2-4019e9b67e0d' },
      { moves: "R2 z' R U' z U2 R z' R' U' z U2 R'", id: '8f18e0bc-f073-4e19-ab35-8e66328174b7' }
    ]
  },
  {
    name: 'OLL 24',
    id: '45a8540f-a8fc-413d-b00c-b695be84fa41',
    idMethod,
    puzzle,
    group: 'OCLL',
    algs: [
      { moves: "y' (R U' R' U2') (R U R' U2') (R U R' U R U' R')", id: '132ff3f9-d802-4fcf-af9d-6d0547a05d00' },
      { moves: "(R U R' U') L' (U R U' R') L", id: '9359e9bf-f92f-43ff-81bc-7faa1e884200' },
      { moves: "R U R' U' z U' R z' R U' R' L", id: '01d689c1-e6b2-483f-8b7d-03ff2cd8fea9' },
      { moves: "r U R' U' r' F R F'", id: 'fcd57cc8-c9f4-4c0a-8f09-9775ac2cbdde' },
      { moves: "U2 L' U' L2 U L2 U L2 U2 L' U L' U L", id: 'de603040-e548-4c78-acc9-316567ceff4f' }
    ]
  },
  {
    name: 'OLL 25',
    id: 'cba3a275-f9fa-4ea1-bda7-06d3f161224e',
    idMethod,
    puzzle,
    group: 'OCLL',
    algs: [
      { moves: "y2 F (R U' R' U') (R U2' R' U') F'", id: 'dd5ed36a-ae3c-4217-b0e4-5c0cc5e052f9' },
      { moves: "y2 (R U2' R' U') (R U R' U') (R U R' U') (R U' R')", id: 'b339b022-0bf9-433c-8367-821ec3716e4e' },
      { moves: "x (U R' U' L) (U R U' r')", id: '318c0776-19a7-47aa-81c1-7442fb2159a9' },
      { moves: "L' R U R' U' z U R z' R U' R'", id: 'b317c55f-ad2d-4634-a3aa-06bdbf4e287b' }
    ]
  },
  {
    name: 'OLL 26',
    id: 'd0c292c1-8c9a-445c-8ae1-a6e28f0d0df9',
    idMethod,
    puzzle,
    group: 'OCLL',
    algs: [
      { moves: "R' U' R U' R' U2 R", id: 'd5429f12-dbd9-4d4c-aacb-f0d62dcc80f4' },
      { moves: "y R U2 R' U' R U' R'", id: 'ee00dfa0-c873-47dc-b91d-47c61aed9adf' },
      { moves: "R' U L U' R z R U'", id: '3b4fb3ca-cbd5-4dde-abb2-1076c924920d' },
      { moves: "y2 z U' R' U R' U' R2 U", id: '9962ae24-7c29-4fbe-98a3-cba0479358fe' }
    ]
  },
  {
    name: 'OLL 27',
    id: '5885b2a3-3464-4a7c-9e94-adfbd652792b',
    idMethod,
    puzzle,
    group: 'OCLL',
    algs: [
      { moves: "R U R' U R U2 R'", id: '15d38b81-2999-4a13-b0b2-53f0c0f776bb' },
      { moves: "y' R' U2 R U R' U R", id: '87afb9b1-9a5d-4ac7-9478-9d800a060c91' },
      { moves: "y2 L U L' U L U2 L'", id: 'bb8f1618-4b31-4e02-9e15-b846a6d61342' },
      { moves: "R U' z U' R z' R' U' L", id: '358f0fe7-7486-441d-a3a2-9ec031fee0d3' }
    ]
  },
  {
    name: 'OLL 28',
    id: 'dc14f80d-347c-4180-9569-63fde0b490ba',
    idMethod,
    puzzle,
    group: 'All Corners Oriented',
    algs: [{ moves: "(r U R' U') r' R (U R U' R')", id: 'f4692728-ff86-4ed7-a60a-65c4ff10d4b6' }]
  },
  {
    name: 'OLL 29',
    id: '8559ea4c-93cd-4725-953f-7b28887c9253',
    idMethod,
    puzzle,
    group: 'Awkward Shapes',
    algs: [{ moves: "(R U R' U') (R U' R') (F' U' F) (R U R')", id: '64b85158-6428-49b8-9efd-839cf7adbdaa' }]
  },
  {
    name: 'OLL 30',
    id: '4b3ca882-76b0-4d79-ac25-38f3c693d80e',
    idMethod,
    puzzle,
    group: 'Awkward Shapes',
    algs: [
      { moves: "(F R' F) (R2 U' R' U') (R U R') F2", id: '78361417-321c-4651-a727-1fa48463ccd9' },
      { moves: "F U (R U2' R' U') (R U2' R' U') F'", id: 'd09150be-5fdb-4f82-b13e-09f96ee28040' },
      { moves: "U2 y x' R U R' D R U2 R U R2 D'", id: '77297656-5ba5-44fb-b1bd-48c156fe348d' }
    ]
  },
  {
    name: 'OLL 31',
    id: '61383f6f-1be9-4adb-a515-1f30e53ff8e4',
    idMethod,
    puzzle,
    group: 'P Shapes',
    algs: [
      { moves: "(R' U' F) (U R U' R') F' R", id: '28067278-6536-4ba5-ae29-0edafc3e5444' },
      { moves: "(r U' r') y' R U (R U R' U') (R U' R')", id: '45e9b3ae-83dd-4eb0-8af7-47cb55a4cb78' },
      { moves: "(r U2' R' U') (R2 U' L' U) R' U'", id: 'cc20621f-2991-4994-ab4e-4b8c8d111d23' }
    ]
  },
  {
    name: 'OLL 32',
    id: '61445414-d1e3-4e79-a278-01d14af9d4f8',
    idMethod,
    puzzle,
    group: 'P Shapes',
    algs: [
      { moves: "y x' (U' R U R') x (U' R' U' R) (U R' U R)", id: 'c755146c-04e1-4a1b-9032-8ac2ef6883a7' },
      { moves: "(r' U2' R U) (R2 U L U') R U", id: '8936608a-6f85-428d-a33a-0b64d5000202' }
    ]
  },
  {
    name: 'OLL 33',
    id: '321a8e36-2e9a-425e-ab77-47f04ab40932',
    idMethod,
    puzzle,
    group: 'T Shapes',
    algs: [
      { moves: "(R U R' U') (R' F R F')", id: '5f46d906-4f9d-43d6-97bb-6929937291e1' },
      { moves: "y2 z U' R' U R U F' U' F", id: '423d0133-76af-416a-9b07-f20c3f49aada' }
    ]
  },
  {
    name: 'OLL 34',
    id: '2b09b79d-1969-4c3d-8348-ed9b94def155',
    idMethod,
    puzzle,
    group: 'C Shapes',
    algs: [
      { moves: "(R U R2' U') (R' F R U) R U' F'", id: '7396b8a8-0a72-4f40-ac0f-d444400921ed' },
      { moves: "(R U R' U') y' (r' U' R U r R')", id: 'a484124f-7144-4b97-b2f9-fabf68f8b869' },
      { moves: "R U R' U' x D' R' U R U' D", id: '724e0451-14a7-4656-89ec-6f97ffcf9031' }
    ]
  },
  {
    name: 'OLL 35',
    id: '42cb4eb8-16f9-47ac-9cab-b7383609d3eb',
    idMethod,
    puzzle,
    group: 'Fish Shapes',
    algs: [
      { moves: "(R U2') (R2' F R F') (R U2' R')", id: 'bae6a3ca-61bd-45b7-ae44-009305f03a5a' },
      { moves: "R U2 R2 x U R U' R x' U2 R'", id: 'e6252e6b-0b5b-4168-bd3e-cfc2e353d531' },
      { moves: "R U2 R' U' y' r' U r U' r' U' r", id: '56e6656f-9420-414a-9442-727bbe4f1e04' }
    ]
  },
  {
    name: 'OLL 36',
    id: 'ae3af96a-7cc5-43c5-8a09-a15a63eeb3f7',
    idMethod,
    puzzle,
    group: 'W Shapes',
    algs: [
      { moves: "(R' U' R U') (R' U R U) x' (R U' R' U) x", id: 'bb49456a-9a0b-4d0f-85e8-6a82e425cd7e' },
      { moves: "U2 z U' R' U R' U' R U R U y' R' U' R", id: 'a0a536d3-1117-4327-b3cf-256c11012c63' }
    ]
  },
  {
    name: 'OLL 37',
    id: '33eac44b-108a-45af-afe9-5ed12d079c2a',
    idMethod,
    puzzle,
    group: 'Fish Shapes',
    algs: [{ moves: "F (R U') (R' U' R U) R' F'", id: '81fd43e9-bcad-4128-8966-3f59f90d88e6' }]
  },
  {
    name: 'OLL 38',
    id: '87506767-43ee-4e25-9744-e28f429b32d0',
    idMethod,
    puzzle,
    group: 'W Shapes',
    algs: [
      { moves: "(R U R' U) (R U' R' U') (R' F R F')", id: '8cd23102-5743-4d36-acb1-403f5576a45c' },
      { moves: "R U R' U R U' R' U' R' x U R U' x'", id: 'd364f1d8-e2db-48e4-8457-ec03081df807' }
    ]
  },
  {
    name: 'OLL 39',
    id: '70f736fb-bbfa-4fdf-9015-ce96695a94c0',
    idMethod,
    puzzle,
    group: 'Lightning Shapes',
    algs: [
      { moves: "(R U R') (F' U' F) (U R U2' R')", id: '7efc7107-86a3-4cce-99d6-445e5bf590d0' },
      { moves: "y2 F (R U R' U') F' (R' U' R U' R' U2' R)", id: 'ab517896-2a14-4702-a718-70d6527c38c3' }
    ]
  },
  {
    name: 'OLL 40',
    id: 'e3d70350-8566-42f2-b097-f05aed9ee557',
    idMethod,
    puzzle,
    group: 'Lightning Shapes',
    algs: [{ moves: "R' (F (R U R' U') F') U R", id: 'f5d3e0f3-d7de-4c79-8ca2-31d9259ba9fe' }]
  },
  {
    name: 'OLL 41',
    id: 'e619b3a6-92af-462a-b7d1-39caa01045e8',
    idMethod,
    puzzle,
    group: 'Awkward Shapes',
    algs: [
      { moves: "(R U R' U R U2' R') F (R U R' U') F'", id: 'a73347de-319f-40fb-b99c-82bf6957ee11' },
      { moves: "r R2 y' R' U' R U y R U' r' R", id: '58367119-f9c2-4ad6-b15a-1641ea7000c0' }
    ]
  },
  {
    name: 'OLL 42',
    id: '3e73ca7f-9d78-47a1-a655-a03f19be815a',
    idMethod,
    puzzle,
    group: 'Awkward Shapes',
    algs: [
      { moves: "(R' U' R U' R' U2' R) F (R U R' U') F'", id: '1be86584-e7f1-47e1-91a3-58d0932df458' },
      { moves: "x' (U' R U R') (U' R U R') x y (R U R' U') (R U R')", id: '678cb00f-c7d2-4f10-9a45-d13a2893cd4e' }
    ]
  },
  {
    name: 'OLL 43',
    id: 'a18784ea-2127-4ff1-94df-efb2804529e1',
    idMethod,
    puzzle,
    group: 'P Shapes',
    algs: [
      { moves: "y R' U' F' U F R", id: '33799a11-8281-4681-a91e-66cd72ae2535' },
      { moves: "y2 z F' R' U' R U F z'", id: '6622b4e0-9aeb-4b07-8a47-dc41b164f88f' }
    ]
  },
  {
    name: 'OLL 44',
    id: '9037b0fb-b9bd-48c1-82e7-1fe7449c9964',
    idMethod,
    puzzle,
    group: 'P Shapes',
    algs: [
      { moves: "f (R U R' U') f'", id: 'd1bbd0f9-2b53-4fb9-985e-ce316633ce61' },
      { moves: "y2 F U R U' R' F'", id: '7b11913a-c462-4ecb-bae4-0e9dada280f0' }
    ]
  },
  {
    name: 'OLL 45',
    id: 'b2e7872e-a725-4d15-b66c-9529ecfa8246',
    idMethod,
    puzzle,
    group: 'T Shapes',
    algs: [
      { moves: "F (R U R' U') F'", id: '8df25f59-f2ea-415e-b91a-9f51362a9681' },
      { moves: "y2 z F' U' R' U R F z'", id: 'e10be1cb-ef28-4fe0-8d51-3d6bd2e12ccd' }
    ]
  },
  {
    name: 'OLL 46',
    id: '995ccb83-82f2-40fc-8b68-24b01000f3dc',
    idMethod,
    puzzle,
    group: 'C Shapes',
    algs: [
      { moves: "R' U' (R' F R F') U R", id: 'dd11dcd1-2870-443d-bd9c-451f8b570dee' },
      { moves: "R' U' R' x U R U' x' U R", id: 'c71bc208-4cdf-4ae0-8908-41e980da85f2' }
    ]
  },
  {
    name: 'OLL 47',
    id: 'b0061a3f-93e0-4fd0-b777-7b406deded05',
    idMethod,
    puzzle,
    group: 'L Shapes',
    algs: [
      { moves: "R' U' x (R' U R U') (R' U R U') x' U R", id: '8b7e983f-37c4-47da-92ab-f7d455637cc2' },
      { moves: "y' R' z x (U' R' U R) (U' R' U R) F", id: 'ca1fedf6-74ea-4e9d-8a2a-65c0b419093a' },
      { moves: "y' x (U R' U' R) x' U2' (R U' R' U) (R U2' R')", id: '29bfac84-e806-4713-ae21-6961eaa2a2f9' },
      { moves: "z F' U' R' U R U' R' U R F z'", id: '982641a8-237a-4029-958d-9c0bf1cedef7' }
    ]
  },
  {
    name: 'OLL 48',
    id: 'f219d9c2-da1b-477a-b9f9-9a3648bbd6f6',
    idMethod,
    puzzle,
    group: 'L Shapes',
    algs: [{ moves: "F (R U R' U') (R U R' U') F'", id: 'e5c50b8a-6956-4c29-9c4a-1403be326dd4' }]
  },
  {
    name: 'OLL 49',
    id: 'd86660ed-d7a8-4c7a-bfd7-c453909bc0fd',
    idMethod,
    puzzle,
    group: 'L Shapes',
    algs: [
      { moves: "(R' F R' F') R2 U2 y (R' F R F')", id: '3a1d3d9b-2e2d-46bf-89bb-76571689b705' },
      { moves: "y2 (R B') (R2' F) R2 (B R2) (F' R)", id: 'd06b9e14-1118-4bb4-9c25-288f0164796b' }
    ]
  },
  {
    name: 'OLL 50',
    id: 'acd66e4a-ab2e-48a5-979b-ff182f686238',
    idMethod,
    puzzle,
    group: 'L Shapes',
    algs: [{ moves: "(R' F) (R2 B') R2' (F' R2) (B R')", id: '87b11301-5db1-4631-9a1d-dc557da6f745' }]
  },
  {
    name: 'OLL 51',
    id: '8159a31a-b15e-4af8-b324-466a48f6cbc0',
    idMethod,
    puzzle,
    group: 'Line Shapes',
    algs: [
      { moves: "f (R U R' U') (R U R' U') f'", id: '364ccb2d-d2aa-4dca-ac78-80bf0ee7f2f7' },
      { moves: "y2 F (U R U' R') (U R U' R') F'", id: '67d25710-95ad-4eb9-97ea-d0b0b55a4f79' },
      { moves: "y2 f' L' U' L U L' U' L U f", id: '53b847c5-766f-4482-b7fc-56e481451907' }
    ]
  },
  {
    name: 'OLL 52',
    id: '84d251a8-a766-41b2-a083-088f3f38b75f',
    idMethod,
    puzzle,
    group: 'Line Shapes',
    algs: [
      { moves: "(R U R' U R U') y (R U' R') F'", id: '60ad7eec-6341-4c1a-bac0-996b6fc0cd4a' },
      { moves: "y2 R' U2 R2 u R' U R U' R u' R'", id: 'e144c898-47e5-43f5-8de5-d6252c9ed04f' }
    ]
  },
  {
    name: 'OLL 53',
    id: '6bca0a79-5ef9-4bbc-82ac-2247b657f171',
    idMethod,
    puzzle,
    group: 'L Shapes',
    algs: [
      { moves: "(r' U' R U') (R' U R U') R' U2' r", id: 'e7a3abba-9c7f-4a9c-9a77-8179f1003fd2' },
      { moves: "y r' U2' R (U R' U' R) (U R' U r)", id: 'fd95febc-6cbd-44b8-a50a-324df51fc556' }
    ]
  },
  {
    name: 'OLL 54',
    id: 'b6698496-5156-4885-9f82-bbc11fe6e66b',
    idMethod,
    puzzle,
    group: 'L Shapes',
    algs: [
      { moves: "(r U R' U) R U' R' U R U2' r'", id: 'dd6bf705-fd6f-455f-bfce-fcd6f20d6226' },
      { moves: "y' r U2 (R' U' R U) R' U' R U' r'", id: 'f8f16fbb-019a-45b4-acf4-eb09edff6a82' }
    ]
  },
  {
    name: 'OLL 55',
    id: '2112a4a6-2eba-4b50-be25-73ed21c62ee3',
    idMethod,
    puzzle,
    group: 'Line Shapes',
    algs: [
      { moves: "(r U2' R' U') R2 (r' U R' U') (r U' r')", id: '5d754ac0-cfd0-45bc-9457-bee058c97d02' },
      { moves: "U y (R' F R U) (R U' R2' F') R2 U' R' (U R U R')", id: '7375d4aa-b11b-44f2-8b89-f90a2901b0d3' },
      { moves: "U y R U2 R' U' R U' R' U' r' U' R U' R' U2 r", id: '7bde8119-f9a1-4878-9886-fb17be7b4130' },
      { moves: "U R U2 R2 U' R U' R' U2 x U R U' x'", id: '5c3c1500-0396-4183-91d1-467f8e29581a' }
    ]
  },
  {
    name: 'OLL 56',
    id: '7d714db7-600f-4dad-b5b1-57f1030d4fe3',
    idMethod,
    puzzle,
    group: 'Line Shapes',
    algs: [
      { moves: "r' U' r (U' R' U R) (U' R' U R) r' U r", id: '47dc20b9-8537-4413-869c-4c13ada3466a' },
      { moves: "r U r' (U R U' R') (U R U' R') r U' r'", id: '2b4bc952-7d9e-41c9-befb-af47281eabc5' }
    ]
  },
  {
    name: 'OLL 57',
    id: 'b4eaa163-c6ee-40d0-8a16-f133c9090966',
    idMethod,
    puzzle,
    group: 'All Corners Oriented',
    algs: [{ moves: "(R U R' U') r R' (U R U' r')", id: '2c02b980-49c2-4090-ad05-7df0cc12556d' }]
  }
]
