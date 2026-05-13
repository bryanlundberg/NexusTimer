import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'COLL_ALGS'
const puzzle = '333'

export const COLL_ALGS: AlgorithmCollection[] = [
  {
    name: 'AS 1',
    id: '5a36fbb4-6526-4c90-bf95-c20608c099a0',
    idMethod,
    puzzle,
    group: 'Anti Sune',
    setup: "R' U2' R U R' U R",
    algs: [
      { moves: "y R U2 R' U' R U' R'", id: 'a6404c18-1d88-4af5-8070-c23f3c27b0a5' },
      { moves: "R' U' R U' R' U2 R", id: '1cf927d6-58e8-4de2-9b2d-83812e8946ed' },
      { moves: "y2 L' U' L U' L' U2 L", id: '5309858e-390b-4a32-b838-13dcf0741f8a' },
      { moves: "y' L U2 L' U' L U' L'", id: 'fe340740-1db4-4ed6-bccb-3d649dfaf1ef' }
    ]
  },
  {
    name: 'AS 2',
    id: 'fb8ff2cb-124e-4a9a-af19-610f89d3f02b',
    idMethod,
    puzzle,
    group: 'Anti Sune',
    setup: "R2' D' R U' R' D R U' R U R' U R y'",
    algs: [
      { moves: "y2 R2 D R' U R D' R' U R' U' R U' R'", id: 'e8955e56-78df-41d0-b499-05221449c90a' },
      { moves: "y R' U' R U' R' U R' D' R U R' D R2", id: '1db6f47d-747c-46ce-b339-c93142397f91' },
      { moves: "U2 R2 D R' U R D' R' U R' U' R U' R'", id: '0ea9ecb1-31de-434a-94f4-2adabf47600f' },
      { moves: "R U R' f' U' R U2 R' U' R U' R' f R U' R'", id: 'f1e5a3bd-b022-4bd7-ad2a-6fa80b3d2594' }
    ]
  },
  {
    name: 'AS 3',
    id: 'cba32227-fba8-43a0-9b19-dd3725239860',
    idMethod,
    puzzle,
    group: 'Anti Sune',
    setup: "R' U2' R U2' L U' R' U R L'",
    algs: [
      { moves: "y2 R2 D R' U2 R D' R2 U' R U' R'", id: '62e98caf-0c5d-4541-b154-2b3d73785de5' },
      { moves: "R' U' F' R U R' U' R' F R2 U' R' U R", id: '5531f43d-a29c-4143-9c17-57ea35ce86d6' },
      { moves: "y2 M F' r U R' U2 r' F2 r", id: '371e4e33-4ea4-4ad3-a645-23d32ba9c35f' },
      { moves: "U2 f' L F L' U2 L' U2 L U2 S", id: '45e99b96-e3d8-4db3-8458-c5ab400b56f6' }
    ]
  },
  {
    name: 'AS 4',
    id: 'd1e324f9-cab8-4935-ae16-d1a49c48864d',
    idMethod,
    puzzle,
    group: 'Anti Sune',
    setup: "R2' F R U R U' R' F' R U' R' U R",
    algs: [
      { moves: "y2 R' U' R U' R2 D' R U2 R' D R2", id: '51891c59-cc77-459a-beb7-d805596b3908' },
      { moves: "y2 R U2 R' U2 r' F R F' M'", id: '747a14b2-effb-4ebc-80d1-69963694ebc9' },
      { moves: "y2 R U2 R' U2 L' U R U' R' L", id: 'e4dc13f1-aab0-4bd6-80a7-340e3e2ce088' },
      { moves: "R' U' R U R' F R U R' U' R' F' R2", id: '4f986fc0-572d-47d4-95e3-cac7bebc37c4' }
    ]
  },
  {
    name: 'AS 5',
    id: 'b6fad483-7439-44d7-b6f7-427d23102b14',
    idMethod,
    puzzle,
    group: 'Anti Sune',
    setup: "L U' R' U L' U' R",
    algs: [
      { moves: "y2 r' F R F' r U R'", id: '47684670-635c-42da-9d1f-3deff2bd469d' },
      { moves: "R' U L U' R U L'", id: '82525ef1-bb51-4fb8-b48b-3b2dd5ea56d3' },
      { moves: "y2 L' U R U' L U R'", id: 'e4998adc-7f6d-40e7-b128-fe288946a1cd' },
      { moves: "U2 R' F R F' r U R' U' M", id: 'a1e88ed7-4ffa-4afe-b4f1-29ea19005e4c' }
    ]
  },
  {
    name: 'AS 6',
    id: '69e05afb-e483-4ed0-b22a-a07092ae46ee',
    idMethod,
    puzzle,
    group: 'Anti Sune',
    setup: "R' D' R U' R' D R U2' R U R' U2' R U R'",
    algs: [
      { moves: "R U' R' U2 R U' R' U2 R' D' R U R' D R", id: 'd70366ea-3631-4f5a-ab24-e0674864ef57' },
      { moves: "R U2 r' F R' F' r U' R U' R'", id: '3758a452-8f28-4473-81ba-181852d2228c' },
      { moves: "R U R' F' R U2 R' U' R U' R' F R U' R'", id: 'f2cc8196-ec83-4e6c-a8ad-9f5263ee66c2' },
      { moves: "y2 L U2 R' U L' U' R U' L U' L'", id: '4658ff0f-3767-43b2-a9a7-2e221ee30b42' }
    ]
  },
  {
    name: 'S 1',
    id: 'd50fe10a-d459-48bc-aa74-694db21ece42',
    idMethod,
    puzzle,
    group: 'Sune',
    setup: "R U2' R' U' R U' R'",
    algs: [
      { moves: "R U R' U R U2 R'", id: '7d452b8f-069e-492f-94a6-82607b616188' },
      { moves: "y' R' U2 R U R' U R", id: '5dd91882-c56f-46dd-8945-051c20b93247' },
      { moves: "y L' U2 L U L' U L", id: 'bd83abfa-a76a-406d-aa5d-3fd22684789a' },
      { moves: "y2 L U L' U L U2 L'", id: '3e2be6bb-84cf-41c3-a455-c1dca6e57daf' }
    ]
  },
  {
    name: 'S 2',
    id: 'b3d4cc01-d3c8-4735-b720-d802a9f6845c',
    idMethod,
    puzzle,
    group: 'Sune',
    setup: "R L' U' L U R' U2' L' U2' L",
    algs: [
      { moves: "y2 R U R' U R2 D R' U2 R D' R2", id: 'ff3118a2-4410-4c40-87c0-b56539d51ee2' },
      { moves: "r' F2 r U2 R U' r' F M'", id: 'e7a81a0b-c9d6-49e5-91b4-8e989db5340f' },
      { moves: "L' U2 L U2 R U' L' U L R'", id: 'a8093fcb-e3a4-4ee9-9829-857a789ccc43' },
      { moves: "L' U2 L U2 l F' L' F M'", id: 'ca057412-1b06-4c5d-9224-04106fb140e4' }
    ]
  },
  {
    name: 'S 3',
    id: 'ac6e0f23-de1c-4b4d-93e1-bcd7d83ebdc0',
    idMethod,
    puzzle,
    group: 'Sune',
    setup: "R U2' R' U2' L' U R U' R' L",
    algs: [
      { moves: "L' R U R' U' L U2 R U2 R'", id: 'af698b8c-fe4d-40bf-b3f1-75418fe69298' },
      { moves: "y2 R2 D' R U2 R' D R2 U R' U R", id: 'ed3a47bb-6e9f-4293-8a84-69cbfbbac9c4' },
      { moves: "f R' F' R U2 R U2 R' U2 S'", id: '92be2fb3-270d-4abf-ba96-700f55d8af64' },
      { moves: "M F R' F' r U2 R U2 R'", id: '4609bab6-56d8-425f-97d9-da15de323d1c' }
    ]
  },
  {
    name: 'S 4',
    id: '0a15fda5-bea5-4aa3-a2fc-cba94e3bd897',
    idMethod,
    puzzle,
    group: 'Sune',
    setup: "R2' D R' U R D' R' U R' U' R U' R' y",
    algs: [
      { moves: "y' R U R' U R U' R D R' U' R D' R2", id: '6db8dc6e-3c9f-4a4d-b84c-b5199169a1b3' },
      { moves: "y' F R' U2 R F' R' F U2 F' R", id: '6c730519-2d86-41ad-8b54-e36ca553b2fb' },
      { moves: "R U R' U' R' F R F' r U R' U R U2 r'", id: '0e6f7880-7cce-4c22-9a95-74b50abf9206' },
      { moves: "r U R' U' r' F R F' R U R' U R U2 R'", id: '2aa48a01-5c07-4bb2-82bf-96c1930d8281' }
    ]
  },
  {
    name: 'S 5',
    id: 'e22e6e34-8fdf-4414-8ff3-e6d05e5ce80d',
    idMethod,
    puzzle,
    group: 'Sune',
    setup: "L' U R U' L U R'",
    algs: [
      { moves: "R U' L' U R' U' L", id: '5d08f059-8853-49ce-b5e0-48a8dd1e29c1' },
      { moves: "R U' r' F R' F' r", id: '56c31189-adc4-48f0-93ce-245399693022' },
      { moves: "r U' r' F R' F' r U M", id: 'efc5f5d9-ec0e-4891-8187-63acf0ad7da0' },
      { moves: "y2 L U' R' U L' U' R", id: '067a0b8a-6ff1-49d0-ad88-d7ba23eefece' }
    ]
  },
  {
    name: 'S 6',
    id: 'ea2366a8-68fc-4712-b957-4d4c96b0e499',
    idMethod,
    puzzle,
    group: 'Sune',
    setup: "F R U R' U' R' F2' R U2' R U2' R' F",
    algs: [
      { moves: "y2 R U R' F' R U R' U R U2 R' F R U' R'", id: 'f570c070-9b52-46f8-a66c-718c21a3dd94' },
      { moves: "y2 R U R' U r' F R F' r U2 R'", id: '8985e454-e2b6-4916-997d-b5e7a2bba50a' },
      { moves: "y2 R U R' U L' U R U' L U2 R'", id: 'bb8e11b4-b597-4b91-b8de-c69a14de67d9' },
      { moves: "F' R U2 R' U2 R' F2 R U R U' R' F'", id: '1ac5ed8f-2969-4701-b46e-7cfcabafeb89' }
    ]
  },
  {
    name: 'L 1',
    id: '1f73536f-4b0d-41ef-90ce-601c8edee459',
    idMethod,
    puzzle,
    group: 'L',
    setup: "R U R' U R U' R' U R U' R' U R U2' R' y",
    algs: [
      { moves: "y' R U R' U R U' R' U R U' R' U R U2 R'", id: '00f32840-9a5f-4b90-82e3-a1a97a03b111' },
      { moves: "y' R U2 R' U' R U R' U' R U R' U' R U' R'", id: 'ce8e9f90-f083-466d-8ffd-6654250d3477' },
      { moves: "y2 R' U2 R U R' U' R U R' U' R U R' U R", id: '0690fe53-3fe7-429b-96ce-9153dc43169e' },
      { moves: "R' U' R U' R' U2 R U' R U R' U R U2 R'", id: '627bf0ab-bfa7-4192-9ebd-8476dfcfc188' }
    ]
  },
  {
    name: 'L 2',
    id: 'e4e2324c-f5ad-4e6c-8f23-aae0ced43ebf',
    idMethod,
    puzzle,
    group: 'L',
    setup: "R2' D' R U2' R' D R U2' R",
    algs: [
      { moves: "R' U2 R' D' R U2 R' D R2", id: '981ddcb7-8a2e-4b04-9b33-940fb54c825d' },
      { moves: "R U R' U2 L U' R U L' U R'", id: '98eba146-7a79-448b-a8f3-5d50694ae03c' },
      { moves: "y2 L' U2 L' D' L U2 L' D L2", id: '730f7563-1782-4e4a-9fbc-1b8fca131348' },
      { moves: "y' R' U2 R U R2 D' R U R' D R2", id: '31986fc4-fa34-4efe-bc02-a3871366cd49' }
    ]
  },
  {
    name: 'L 3',
    id: '4cece57d-3632-4d32-9215-977e251ae961',
    idMethod,
    puzzle,
    group: 'L',
    setup: "R2' D R' U2' R D' R' U2' R' y'",
    algs: [
      { moves: "y R U2 R D R' U2 R D' R2", id: 'dcd78be9-378a-4f65-88e8-d97ca2fffee5' },
      { moves: "R' F' R U R' U' R' F R2 U' R' U2 R", id: '948b52b5-8ba3-48d8-b33d-c172137f8afd' },
      { moves: "U2 R U2 R2 D' R U' R' D R2 U' R'", id: 'ac547e2b-f457-4f8e-8dba-ea5122dd72bd' },
      { moves: "y R' U' R U2 L' U R' U' L U' R", id: 'd7344343-d23d-45c9-ab42-b1faac4d2169' }
    ]
  },
  {
    name: 'L 4',
    id: '7cf36dbf-7be1-4651-80f6-1d7add702332',
    idMethod,
    puzzle,
    group: 'L',
    setup: "R U R D R' U' R D' R2' y2'",
    algs: [
      { moves: "y F R' F' r U R U' r'", id: 'fea1866e-0550-43f9-8540-abea82ada66a' },
      { moves: "y2 R2 D R' U R D' R' U' R'", id: '57347655-f3ae-4193-8256-9bbd6cdb2d8d' },
      { moves: "R U R' U' R' F R U R U' R' F'", id: 'a27ab20f-c035-4dd5-af9d-9087d82443a8' },
      { moves: "y F l' U' L U R U' r'", id: 'ac8a14e7-5669-4c25-8acf-fa54c718a016' }
    ]
  },
  {
    name: 'L 5',
    id: 'f3e586fc-19ea-4190-9414-8d4f1eadb0b2',
    idMethod,
    puzzle,
    group: 'L',
    setup: "R' F' r U R U' r' F y2'",
    algs: [
      { moves: "y2 F' r U R' U' r' F R", id: 'cc2d982b-5b40-444a-9507-b5a46abb5eec' },
      { moves: "y x R' U R D' R' U' R D x'", id: '661b29d2-2d41-4b4e-a45a-409cd44d81d6' },
      { moves: "y' R2 D' R U' R' D R U R", id: '8ca477e8-c8a6-4ae8-824c-2c7032363fa8' },
      { moves: "r U R U' r' F R' F'", id: '5d6e3ba0-b57f-456a-bf06-ed27e04b8230' }
    ]
  },
  {
    name: 'L 6',
    id: 'e5ab98d7-964b-4293-8809-3d52eaad4121',
    idMethod,
    puzzle,
    group: 'L',
    setup: "R2' F' R U R U' R' F R U' R' U R y",
    algs: [
      { moves: "y r U2 R2 F R F' R U2 r'", id: '9084c315-0f32-4fdf-971e-b8a723c94fb0' },
      { moves: "y' R' U' R U R' F' R U R' U' R' F R2", id: 'b5292f55-e815-46d5-becd-67fbf2c12a66' },
      { moves: "y F R U R2 F R F' R U' R' F'", id: '04b64530-7b97-47e0-b358-a14281611ff3' },
      { moves: "y' R' U' R U' F U' R' U' R U F'", id: '5425ce0e-96af-4a49-a585-555cb285ffc7' }
    ]
  },
  {
    name: 'U 1',
    id: 'f6ec5f27-60ac-4cdf-a94c-7db37f995298',
    idMethod,
    puzzle,
    group: 'U',
    setup: "R U2' R' U' R U' R2' U2' R U R' U R",
    algs: [
      { moves: "R' U' R U' R' U2 R2 U R' U R U2 R'", id: 'bc90c20f-f032-4689-9849-b416018e6ccd' },
      { moves: "y2 R U R' U R U2 R2 U' R U' R' U2 R", id: '16a4f25e-69c0-4530-89b4-563cb5558200' },
      { moves: "y' R U R' U' R U' R' U2 R U' R' U2 R U R'", id: '6603c71a-20b6-497d-b80e-950e76cc4b44' },
      { moves: "y2 R U R' U R U2 R' U R U2 R' U' R U' R'", id: '886deaf9-4d96-4e5b-979a-f2a14910fdb3' }
    ]
  },
  {
    name: 'U 2',
    id: 'f0ae01aa-47f4-49a5-8ab4-8ac0ce4c818b',
    idMethod,
    puzzle,
    group: 'U',
    setup: "R' F R' F' R U R U' R' F R U' R' U R U R' F' R",
    algs: [
      { moves: "R' F R U' R' U' R U R' F' R U R' U' R' F R F' R", id: 'cda8cb48-a770-4b7d-92e5-863b81d18df8' },
      { moves: "y' R' U' R F R2 D' R U R' D R2 U' F'", id: '7b04ec63-508b-4143-96cd-ac71c7da1801' },
      { moves: "y F U R U2 R' U R U R2 F' r U R U' r'", id: 'a1e58b41-9ce1-476a-a08f-b65ccab5f0df' },
      { moves: "y' r U R' U' r' F R2 U' R' U' R U2 R' U' F'", id: 'dd591082-c199-4032-965d-249f4d73510a' }
    ]
  },
  {
    name: 'U 3',
    id: '61939697-c9db-417f-b8fc-b3a1d7abc976',
    idMethod,
    puzzle,
    group: 'U',
    setup: "R U2' R D R' U2' R D' R2' y2'",
    algs: [
      { moves: "y2 R2 D R' U2 R D' R' U2 R'", id: '492aab4d-1f99-4fc4-8cba-6a94e239197d' },
      { moves: "R' U R U R' F' R U R' U' R' F R2 U' R' U' R", id: 'c55485c5-8f0e-46d4-b092-29f52d57e367' },
      { moves: "L2 D L' U2 L D' L' U2 L'", id: 'f42d1434-709a-47f2-afe4-e419547f9c0d' },
      { moves: "R U' R' U' R U2 R' U' R' D' R U2 R' D R", id: '628142f9-f70e-4e47-824f-23e6c77e4d99' }
    ]
  },
  {
    name: 'U 4',
    id: '0e2c37e7-cbf8-425c-98ca-d447a8da66fb',
    idMethod,
    puzzle,
    group: 'U',
    setup: "F R U R' U' R U' R' U' R U R' F'",
    algs: [
      { moves: "F R U' R' U R U R' U R U' R' F'", id: '993023cd-88c0-42ed-b43f-ebed2b38053f' },
      { moves: "y2 R' F2 R U2 R U2 R' F2 R U2 R'", id: '380b04bf-7043-4207-a9dc-05d56a978f41' },
      { moves: "y' F U2 R' D' R U2 R' D R F'", id: '637e8c6b-81ef-4f46-a365-759284b5ba11' },
      { moves: "y2 R U2 R' U2 L' U2 R U2 R' U2 L", id: '950c435e-ed82-4f6d-bdde-2a27365a92e0' }
    ]
  },
  {
    name: 'U 5',
    id: 'de6e5800-5b34-4385-9f01-f3506fec6950',
    idMethod,
    puzzle,
    group: 'U',
    setup: "R' U2' R' D' R U2' R' D R2'",
    algs: [
      { moves: "R2 D' R U2 R' D R U2 R", id: 'f68a22ff-1701-4557-9580-cf5896387533' },
      { moves: "y2 L2 D' L U2 L' D L U2 L", id: '2fc8a0c4-0c53-42dd-a157-ecf493a856ca' },
      { moves: "R2 F' R U R' U' R' F R' U' R2 U2 R2 U R' U R", id: '9bdbe83b-b9e2-4145-98a6-15a0552b624d' },
      { moves: "L U' R U' L' U R' U2 L U' L'", id: '4cc2d453-6b17-4776-8486-d28a30638692' }
    ]
  },
  {
    name: 'U 6',
    id: '4082128c-da25-4f26-a266-654ca05de18e',
    idMethod,
    puzzle,
    group: 'U',
    setup: "F U' R' U R U F' R' U2' R",
    algs: [
      { moves: "R2 D' R U R' D R U R U' R' U' R", id: 'bfa429a0-c44b-4dc8-bfda-cd37519b8d9e' },
      { moves: "R' U2 R F U' R' U' R U F'", id: '7ff740e0-3b6f-4bb7-aafc-9e1bb3840955' },
      { moves: "R U' R' U' R U R D R' U R D' R2", id: '309f179a-b2ee-4653-a9b2-46392409bcfa' },
      { moves: "R' U2 R U2 R' F' R U R' U' R' F R2", id: '0e40a4bf-d056-4002-9b8f-2a3a22cd9139' }
    ]
  },
  {
    name: 'T 1',
    id: '502240db-3212-4712-afec-d242d4c58e56',
    idMethod,
    puzzle,
    group: 'T',
    setup: "R' U' R U' R' U2' R2' U R' U R U2' R'",
    algs: [
      { moves: "R U2 R' U' R U' R2 U2 R U R' U R", id: 'ee4b2d99-b8da-4714-a8ef-b8b52bcc57f6' },
      { moves: "y' R U R2 U' R2 U' R2 U2 R U' R U' R'", id: '79671004-15d0-438e-907b-fa462d4c7a42' },
      { moves: "R U2 R' r' F2 r U' R U' R' U' r' F r", id: '8e89bc86-c119-4cba-9b2d-e2853fe1f86b' },
      { moves: "y' R U R' U R U2 R' L' U' L U' L' U2 L", id: 'c80fa326-5207-4ca6-be9c-0bbb3b72884d' }
    ]
  },
  {
    name: 'T 2',
    id: '3bd1bab5-0880-4ae9-9757-ee118a1c8c02',
    idMethod,
    puzzle,
    group: 'T',
    setup: "L' U R' U' L R U2' R' U' R",
    algs: [
      { moves: "R' U R U2 R' L' U R U' L", id: 'd9a3218b-49df-4399-b497-69326d06fd22' },
      { moves: "R' U R U2 r' R' F R F' r", id: '3a00b42a-5fa8-476c-93d9-8f9ccf82dd4d' },
      { moves: "y2 R' F R U R' U' R' F' R2 U' R' U2 R", id: '52013055-3df0-4caf-9d10-e1ed718084a5' },
      { moves: "y2 R U' R' U2 L R U' R' U L'", id: 'bdc5489c-7faa-46f5-a32d-a9c923cdcdec' }
    ]
  },
  {
    name: 'T 3',
    id: '61fa3288-8279-48c4-8971-dd129b8ae594',
    idMethod,
    puzzle,
    group: 'T',
    setup: "F' r U R' U' L' U l y'",
    algs: [
      { moves: "y R' F' r U R U' r' F", id: 'aeb22076-e1ef-4633-b56f-af61382475b0' },
      { moves: "y l' U' L U R U' r' F", id: 'd60f6f2e-abab-4442-9d7c-2d71b2196a3f' },
      { moves: "y2 R' U' R' D' R U R' D R2", id: 'aa811030-8d81-4c11-b185-cf269cba1041' },
      { moves: "y l' U' L U l F' L' F", id: 'e5c81f83-5bff-4b8a-a420-a71bdb07dfde' }
    ]
  },
  {
    name: 'T 4',
    id: 'f6bbf70b-a4c8-4c25-9a01-9905b4b4dafb',
    idMethod,
    puzzle,
    group: 'T',
    setup: "F R U' R' U R U R' U R U' R' F' y2'",
    algs: [
      { moves: "y2 F R U R' U' R U' R' U' R U R' F'", id: '7488b491-3ff4-4b24-bb8b-bc5c3d759e73' },
      { moves: "y2 F R' D' R U2 R' D R U2 F'", id: 'f9d032d0-de52-43f2-b75c-8b98783fe72c' },
      { moves: "y2 R F R' U R U2 R' U R U F' R'", id: 'd9225e75-72ed-49d7-b55f-c913d17b57f2' },
      { moves: "y R U2 R' F2 R U2 R' U2 R' F2 R", id: '55e44977-d2aa-4bc6-9bdd-aba68b7f2e92' }
    ]
  },
  {
    name: 'T 5',
    id: 'e020be38-fcfa-406c-a4f2-933d6506100e',
    idMethod,
    puzzle,
    group: 'T',
    setup: "F R' F' r U R U' r' y",
    algs: [
      { moves: "y' r U R' U' r' F R F'", id: 'f5334996-3862-411f-813b-73054f0491ab' },
      { moves: "R U R D R' U' R D' R2", id: '3a1d5be7-6b23-4f7f-bc8c-fc6b4de73289' },
      { moves: "y2 x' D R U' R' D' R U R' x", id: '1c163de5-f9ef-4c13-964a-6df03f160085' },
      { moves: "y' R U R' U' L' U R U' R' L", id: '8a16a75c-417c-4b22-9754-dda22aef63c5' }
    ]
  },
  {
    name: 'T 6',
    id: 'ee2c3fb3-5884-40c2-aada-b3c107ef2c1f',
    idMethod,
    puzzle,
    group: 'T',
    setup: "R' U R2' D r' U2' r D' R2' U' R",
    algs: [
      { moves: "R' U R2 D r' U2 r D' R2 U' R", id: 'a5339ebc-799a-4f27-bad3-98b4a0fe4cc2' },
      { moves: "y2 R U' R2 D' r U2 r' D R2 U R'", id: '7f1faa61-0899-48d7-a5c8-78b2c5a18a15' },
      { moves: "y R' U' R U R2 D' R U2 R' D R2 U' R' U R", id: '7e422866-3ecd-475b-b5aa-8e20d980e1fc' },
      { moves: "y R U R' U' R2 D R' U2 R D' R2 U R U' R'", id: '0fc990e7-0280-435e-9aeb-51294a13fe50' }
    ]
  },
  {
    name: 'Pi 1',
    id: '2eb87efb-4c38-4795-957a-c67af0d60306',
    idMethod,
    puzzle,
    group: 'Pi',
    setup: "R' U2' R2' U R2' U R2' U2' R'",
    algs: [
      { moves: "R U2 R2 U' R2 U' R2 U2 R", id: '277a37cd-ed72-4b0d-93cd-94cf023263e6' },
      { moves: "R' U2 R2 U R2 U R2 U2 R'", id: '5efc1214-f9e8-4b60-8f7c-2b41768200cb' },
      { moves: "y2 L' U2 L2 U L2 U L2 U2 L'", id: '0d8ececb-f37c-461b-aa93-c3834e0375e4' },
      { moves: "R U R' U R U2 R' U' R U R' U R U2 R'", id: 'b436dc49-e101-49b8-a43b-5ff748479b8e' }
    ]
  },
  {
    name: 'Pi 2',
    id: '312a6fdb-4e05-4764-baae-a267d37cadf7',
    idMethod,
    puzzle,
    group: 'Pi',
    setup: "R U R' U F2' R U2' R' U2' R' F2' R",
    algs: [
      { moves: "y F U R U' R' U R U' R2 F' R U R U' R'", id: '2893fe69-aa66-47ae-8f45-a710e5df1a68' },
      { moves: "R' F2 R U2 R U2 R' F2 U' R U' R'", id: '456751a2-9ed6-4fd2-8580-fa698ab687ff' },
      { moves: "y2 L' U' L U L F' L2 U' L U L' U' L U F", id: '19838e20-cb9e-4546-b3a9-13ecc0d0b574' },
      { moves: "y M F R' F' r U2 R U' R' U R U2 R'", id: '3cb89cf0-56a9-4b43-9d4d-37b13bf23b30' }
    ]
  },
  {
    name: 'Pi 3',
    id: '55afdd3a-09bf-479c-b6dd-5548bc04ba18',
    idMethod,
    puzzle,
    group: 'Pi',
    setup: "R' U2' R U2' R2' F' R U R U' R' F U R",
    algs: [
      { moves: "R' U' F' R U R' U' R' F R2 U2 R' U2 R", id: '4d17d934-2030-4c66-8b72-60dde5bfc2da' },
      { moves: "y F U R U' R' U R U2 R' U' R U R' F'", id: '65b879e1-7aff-4be1-b32f-24e71bb7f626' },
      { moves: "y F R2 U' R2 U R2 U S R2 f'", id: '0dd8ca4c-1c07-4a25-b532-0e729fa24e7b' },
      { moves: "y' R U R' U R U2 R2 F' r U R U' r' F", id: 'c6cb321c-6eca-4c0e-b676-893d967288a9' }
    ]
  },
  {
    name: 'Pi 4',
    id: '44aa3406-903c-4850-896c-d93856a4366b',
    idMethod,
    puzzle,
    group: 'Pi',
    setup: "F U R U' R' U R U' R2' F' R U R U' R'",
    algs: [
      { moves: "R U R' U' R' F R2 U R' U' R U R' U' F'", id: '2fca1477-2a10-4f43-9974-44beaeb55987' },
      { moves: "R U2 R' U' R U R' U2 r' F R F' M'", id: '511d9167-6fcf-4b8e-87e1-5e89090b2796' },
      { moves: "y' R' U2 R U R' U R2 U' L' U R' U' L", id: 'c25cae5f-179c-4017-a6cc-8b78aff1d923' },
      { moves: "R B2 R' U2 R' U2 R B2 U R' U R", id: '03e37795-568f-480d-9868-481bcd97fc92' }
    ]
  },
  {
    name: 'Pi 5',
    id: '467541d3-1b8a-429b-ba44-0a31d1413747',
    idMethod,
    puzzle,
    group: 'Pi',
    setup: "L' U' L U' L' U' R U' L U R'",
    algs: [
      { moves: "R U' L' U R' U L U L' U L", id: 'eb9c06f1-2a3d-4269-b74f-f8ea11c2511a' },
      { moves: "y' R U2 R' U R' D' R U2 R' D R2 U' R'", id: '400c0146-fe26-452f-83d3-ad3542e05b14' },
      { moves: "y' R U R' U F' R U2 R' U2 R' F R", id: 'd9d65dd8-461d-47dc-9162-dc565a4b3d44' },
      { moves: "y2 L' U R U' L U' R' U' R U' R'", id: 'cd9d4689-f052-463b-9c0b-50d376b81257' }
    ]
  },
  {
    name: 'Pi 6',
    id: 'b5064a61-e3b6-4fe8-8e72-1a69636899be',
    idMethod,
    puzzle,
    group: 'Pi',
    setup: "R' U2' R2' U R U R2' D' R U' R' D U' R'",
    algs: [
      { moves: "R' F' U' F U' R U S' R' U R S", id: '291fcc2c-cb8e-46c2-956d-ce311889a08b' },
      { moves: "y' r U R' U R' F R F' R U' R' U R U2 r'", id: '48a3b21f-ccc6-4fa0-b33b-463e6b907784' },
      { moves: "R U D' R U R' D R2 U' R' U' R2 U2 R", id: 'b789a538-c45b-4e8a-8f6b-fa0b8e10b88d' },
      { moves: "R2 D' R U R' D R U R U' R' U R U R' U R", id: '90631cb1-425f-431f-9768-396f3afd9918' }
    ]
  },
  {
    name: 'H 1',
    id: '572195a0-715d-4969-b90c-6aa2f0822935',
    idMethod,
    puzzle,
    group: 'H',
    setup: "R U2' R' U' R U R' U' R U' R'",
    algs: [
      { moves: "R U R' U R U' R' U R U2 R'", id: 'cb9ed9b0-30c3-498d-94f3-957d2b34a64a' },
      { moves: "y' R U2 R' U' R U R' U' R U' R'", id: '7006a946-b799-4f7a-b88d-fdfb52c5e730' },
      { moves: "y R U2 R' U' R U R' U' R U' R'", id: '659b0112-cfc0-4627-a834-36c7605cc282' },
      { moves: "y' R' U2 R U R' U' R U R' U R", id: 'f258e62d-f902-45cc-9ac4-52cd7122ff3e' }
    ]
  },
  {
    name: 'H 2',
    id: '75accf1e-9491-4d7f-8ed3-c66404a3321c',
    idMethod,
    puzzle,
    group: 'H',
    setup: "F U R U' R' U R U2' R' U' R U R' F'",
    algs: [
      { moves: "F R U' R' U R U2 R' U' R U R' U' F'", id: '3bf9e9e1-6fde-4faa-ab0b-5435ccfd5f3c' },
      { moves: "f R2 S' U' R2 U' R2 U R2 F'", id: '9a746971-41a3-44b4-96d7-3441efe13cc7' },
      { moves: "y2 f R U R' U' R F' R U R' U' R' S'", id: '769020d3-ff25-4f77-a7d0-3f8c7b504a5a' },
      { moves: "f R U R' U' f' R U R' U' R' F R F'", id: 'cc808d48-c4b5-421b-88bc-ef03232bc2b2' }
    ]
  },
  {
    name: 'H 3',
    id: '6a4ace85-8cf7-40dc-9722-2ae785aef540',
    idMethod,
    puzzle,
    group: 'H',
    setup: "L' U R U' L U' R' U' R U' R'",
    algs: [
      { moves: "R U R' U R U L' U R' U' L", id: 'c0907c03-d70f-42ce-a33b-bdf05d71bff1' },
      { moves: "R U R' U R U r' F R' F' r", id: '6e8c4f2c-f13a-4868-9b64-b7408430cc78' },
      { moves: "R' F' R U2 R U2 R' F U' R U' R'", id: '2dbcb9f3-d57c-4aae-96ab-88a28ac3cc0b' },
      { moves: "R U R2 D' R U2 R' D R U' R U2 R'", id: '204e2750-478c-46a1-89b0-04aee91b7c53' }
    ]
  },
  {
    name: 'H 4',
    id: '0969e721-7b29-4623-954f-96ed568ecc61',
    idMethod,
    puzzle,
    group: 'H',
    setup: "F U R U' R' U R U' R' U R U' R' F' y'",
    algs: [
      { moves: "y F R U R' U' R U R' U' R U R' U' F'", id: '50ba3776-4bf2-46ea-b0d4-c5ea53330a39' },
      { moves: "y F U R U' R' U R U' R' U R U' R' F'", id: '2ac0602b-7a00-4b33-973c-80beea641c04' },
      { moves: "U F R U R' U' R U R' U' R U R' U' F'", id: 'b1eb36e7-768c-4443-9754-cb4258972bfa' },
      { moves: "y' F R U R' U' R U R' U' R U R' U' F'", id: 'f4c6fa31-0272-425f-855c-78548024c02e' }
    ]
  }
]
