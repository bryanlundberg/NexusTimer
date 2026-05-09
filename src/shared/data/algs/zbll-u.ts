import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'ZBLL_U_ALGS'
const puzzle = '333'

export const ZBLL_U_ALGS: AlgorithmCollection[] = [
  {
    name: 'ZBLL U 1',
    id: '01dafecc-9fcb-46fe-aca4-6ee841ff80a3',
    idMethod,
    puzzle,
    group: 'U1',
    setup: "L' U R U' L U R2' U2' R U R' U R",
    algs: [
      { moves: "R U' R' U' R U2 R' U' R' D' R U2 R' D R", id: '6b06271a-36c4-4f21-83ba-e213b26f7278' },
      { moves: "R' U' R U' R' U2 R2 U' L' U R' U' L", id: '48d6ad70-b2f8-44aa-b81e-5a9dadb1f86b' },
      { moves: "y F R' F' U' F R S U R2 U' R' f'", id: 'f948ec92-fc7a-41af-9ce0-1c7b37653c67' },
      { moves: "R' U' R U' R' U2 R2 U' r' F R' F' r", id: 'cd52aec6-324e-4131-94bc-8dc994e84a75' }
    ]
  },
  {
    name: 'ZBLL U 2',
    id: '928dc5cd-c6e8-4f0d-a624-ac45ed10ed25',
    idMethod,
    puzzle,
    group: 'U1',
    setup: "R U R' U R U2' R D R' U2' R D' R' U2' R' y",
    algs: [
      { moves: "y' R U2 R D R' U2 R D' R' U2 R' U' R U' R'", id: '3a183140-8bee-4034-8538-e6f29b9da9ce' },
      { moves: "z U R' D' R U' R' D U' R' U R' U' R2 U z'", id: '4a75064c-b2ba-4850-9bea-cd97912ecd01' },
      { moves: "y2 R U' L' U R' U' L R' U' R U' R' U2 R", id: '5e8254bc-2fe3-4be9-8bb0-57deff92a335' },
      { moves: "y2 S R U' R' U' F' U2 F U R U' R' S'", id: '4017c2ba-56a1-442f-af8c-999c201d0001' }
    ]
  },
  {
    name: 'ZBLL U 3',
    id: 'fe6be0e7-cfe5-463f-8c01-225128352c18',
    idMethod,
    puzzle,
    group: 'U1',
    setup: "R U2' R D r' U2' r D' R2' y2'",
    algs: [
      { moves: "y2 R2 D r' U2 r D' R' U2 R'", id: '0eb909f9-ed35-41b5-9f33-da5c77b046ad' },
      { moves: "R' U r' F R F' r U2 R' U R", id: 'a9a572a2-e5fe-404d-9aaa-bfc936503640' },
      { moves: "R' U2 R U R2 F' R U R U' R' F R", id: '0581c1df-6089-4fd4-baa6-105249d7fbd3' },
      { moves: "L2 D l' U2 l D' L' U2 L'", id: '4b7c899c-b371-4ce9-88e3-7e0a1f1fa3a9' }
    ]
  },
  {
    name: 'ZBLL U 4',
    id: '3eb81a1b-2efd-4a28-8152-534f361920e4',
    idMethod,
    puzzle,
    group: 'U1',
    setup: "R U2' R' U' R2' D R' U' R D' R2' y'",
    algs: [
      { moves: "y R U R2 D' R U R' D R2 U2 R'", id: '4b8331d4-a04f-46d9-8a72-a5db0d58937d' },
      { moves: "y R U R' U R U' R' U' R' F R U R U' R' F'", id: '5d09890c-0e57-42b0-8d21-92efcc2b0e5e' },
      { moves: "y R2 D R' U R D' R2 U R U2 R'", id: '44c3b96d-d82e-4df4-af27-72a8572abec8' },
      { moves: "U R U R2 D' R U R' D R2 U2 R'", id: 'cdf3b15a-f40f-4ace-b480-657a2312fe91' }
    ]
  },
  {
    name: 'ZBLL U 5',
    id: '236da166-c3fa-4cd6-b78c-afa3831475b7',
    idMethod,
    puzzle,
    group: 'U1',
    setup: "R U2' R' U2' R U R2' D' R U2' R' D R2' U2' R' y",
    algs: [
      { moves: "y' R U2 R2 D' R U2 R' D R2 U' R' U2 R U2 R'", id: 'f8f05bfb-43ed-4c23-a094-37279bfe78ea' },
      { moves: "r U R' U R' D' R U R' D R U r' F R F'", id: '6ad619d9-b4f0-4279-b43c-f79226cb898a' },
      { moves: "y2 S R2 S' D R' U2 R D' R U2 R2 U2 R", id: 'd8c5291f-b231-49fd-abb3-efd819497d2d' },
      { moves: "y2 x' R U L' U2 R D' R' U R D R2 U L U' x", id: 'e1593fb4-51f8-49fc-806a-da4b28b83aa1' }
    ]
  },
  {
    name: 'ZBLL U 6',
    id: 'e5007a52-eda4-4601-8395-cc04141f99c8',
    idMethod,
    puzzle,
    group: 'U1',
    setup: "R U2' R D R' U2' R D' R2' y2'",
    algs: [
      { moves: "y2 R2 D R' U2 R D' R' U2 R'", id: '1c95020a-02fc-4af7-b747-0c09b1278373' },
      { moves: "L2 D L' U2 L D' L' U2 L'", id: '39987960-17ec-44ef-b5da-47c3b8f9cbad' },
      { moves: "U2 R2 D R' U2 R D' R' U2 R' U2", id: '613b1615-1791-4797-a28b-b6a9118391ef' },
      { moves: "x' R U' R' D R U2 R' D' R U' R' x", id: 'b4131c47-3bf6-43eb-b84c-469fe05a9a05' }
    ]
  },
  {
    name: 'ZBLL U 7',
    id: '6c93b90b-ee74-420c-9709-b47a6aad29f8',
    idMethod,
    puzzle,
    group: 'U1',
    setup: "D R' U' R U2' R' U' R D' U' R U2' R' U R U R' y",
    algs: [
      { moves: "y2 R' D' r U2 r' D R U2 R U' R' U' R U' R'", id: '3ef165d1-8c87-459c-8e73-5718c050bad4' },
      { moves: "R U R' U' R U R2 D' R U R' D R2 U R' U' R U' R'", id: 'ddc63898-8526-4a68-a8c3-05fd2329d605' },
      { moves: "R U R' F' U' F2 D R' U R' U' R D' F'", id: '9ca96e17-e101-4c7f-9ede-fc8a545bec83' },
      { moves: "y' R U' R' U' R U2 R' U D R' U R U2 R' U R D'", id: 'a667218f-bef8-4033-a6a9-cac56499a067' }
    ]
  },
  {
    name: 'ZBLL U 8',
    id: 'a243eb85-97b6-45a4-b35a-908b938e668f',
    idMethod,
    puzzle,
    group: 'U1',
    setup: "F R U R' U' R' F' U' R U R U' R' U' R' U R",
    algs: [
      { moves: "R' U' R U R U R' U' R' U F R U R U' R' F'", id: '63a35a76-0ee6-4826-b777-e9dd49b19e49' },
      { moves: "U R' F' R U2 R' F R2 D2 r' U r D2 R'", id: '5c961b12-8519-4b8f-b8b8-740ffb4ae888' },
      { moves: "y2 R' U R D' R U R' D R2 U' R U R U2 R", id: '3d20c755-2266-4f33-8062-c54616f11159' },
      { moves: "y R' F' R U2 R' F R2 u2 R' F R u2 R'", id: '7ad16e1b-2c41-40f4-b5bd-59ac6ac7b85f' }
    ]
  },
  {
    name: 'ZBLL U 9',
    id: 'b76e6926-df2d-42df-9e91-edd64e2fd636',
    idMethod,
    puzzle,
    group: 'U1',
    setup: "R' U' R U R' U R U' L U' R' U L' U R y'",
    algs: [
      { moves: "y' R U R' U R U' R' U F' R U2 R' U2 R' F R", id: '37605720-2c15-4d73-baee-37644026a142' },
      { moves: "y2 R2 F2 R2 U R U2 R' U' R U R F2 R' U2 R'", id: '9d86eeba-335a-4ff6-99d3-519f2e003d77' },
      { moves: "R D' R' U R2 D' r' D2 r' U' r2 D' R2", id: '4deb03c2-cd30-42f3-af8a-dab05c848d89' },
      { moves: "y R U R2 D' R U' M' U2 r' D R2 U2 R'", id: '56202e87-cb64-44c1-b2c0-18705120b5e6' }
    ]
  },
  {
    name: 'ZBLL U 10',
    id: '980f5c2b-1d01-460e-9a02-8456b91ebc9e',
    idMethod,
    puzzle,
    group: 'U1',
    setup: "R' U R' D' R U R' U2' R U R' D U R U' R y'",
    algs: [
      { moves: "y' R2 D' R U' R' D R2 U R' U R U2 R' U R U2 R' U' R", id: '0897e4ec-e6ce-4d98-9b29-c5f34f7ca99a' },
      { moves: "y R2 U F' R2 U' R2 U' R2 U2 R2 U' F U' R2", id: '86e01035-1f61-4364-bb72-b50442e1ed63' },
      { moves: "y R' U R' U' D' R U' R' U2 R U' R' D R U' R", id: 'bd9ebfdf-bac0-4606-846c-8e58879d78db' },
      { moves: "y2 R U2 R' U R U R2 D' r U2 r' D R2 U' R'", id: '6a0069a8-efc2-4a92-94c3-1c99859aeaed' }
    ]
  },
  {
    name: 'ZBLL U 11',
    id: 'd5fe75f3-ea29-4c1a-a9eb-cb92da47a6c4',
    idMethod,
    puzzle,
    group: 'U1',
    setup: "L U2' L' U R' U2' L U2' R U L' U R' U R y",
    algs: [
      { moves: "y R U R' U R U' R' U R U' R' U' L' U R U' R' L", id: '5d4ee450-5fa1-4aed-9dfa-f3b17afee7cc' },
      { moves: "y R U R' U R U' R' U R U2 R' r U R' U' r' F R F'", id: 'c47d0c29-413e-435a-bdba-a14b1999195c' },
      { moves: "y R U R' U R U' R' U R U' R' U' r' F R F' M'", id: '4c8f9580-bcff-453a-a21d-13819357ea50' },
      { moves: "y R' F R F' U R' D' r U' r' D U' F' U F R", id: 'ef4ca527-76ee-47ec-8112-4cfe6267aa6d' }
    ]
  },
  {
    name: 'ZBLL U 12',
    id: '30415288-14fa-4312-b4f1-43a8e07b423f',
    idMethod,
    puzzle,
    group: 'U1',
    setup: "R U' R2' D' R U' R' D R U2' R U' R' U' R U R' y",
    algs: [
      { moves: "y' R U' R' U R U R' U2 R' D' R U R' D R2 U R'", id: 'bbba9f10-285a-4155-a557-6cbee932ab38' },
      { moves: "R' U2 R U F' R' D U' R U R' D' U R F", id: 'e4a8d3fb-289f-47f6-969f-8f6fbfa081d3' },
      { moves: "R F2 U' R2 U' R U2 R' U' R U' R U F2 R'", id: 'aded6601-b43d-4684-8bd5-4fc0fb0c8a4f' },
      { moves: "y2 F U R F R' F R D R' D' F2 U' R' F'", id: '7897b532-6a83-4f66-905c-b883020b8b87' }
    ]
  },
  {
    name: 'ZBLL U 13',
    id: '6e216f47-5405-4bfa-bceb-d728d88cd8bc',
    idMethod,
    puzzle,
    group: 'U2',
    setup: "R' U2' R' D' r U2' r' D R2'",
    algs: [
      { moves: "R2 D' r U2 r' D R U2 R", id: '5fe1e21d-3876-4782-80d2-970d9fa26813' },
      { moves: "y F U R U' R2 F' R2 U' R' F' U' F R U R'", id: '4122177c-751a-4d29-b88e-1bf0c6206c8e' },
      { moves: "R2 D' L F2 L' D R U2 R", id: '50bf33cb-e52b-4c91-b3f5-6225e773759b' },
      { moves: "R U R' U2 F U' F' U' R U' R' F U' F'", id: '3897c01b-6b2a-4a96-980c-9fafd5f276f5' }
    ]
  },
  {
    name: 'ZBLL U 14',
    id: '2fc87350-fec4-4993-8e2f-44f3bbf2d434',
    idMethod,
    puzzle,
    group: 'U2',
    setup: "R' U2' R U R2' D' R U R' D R2' y'",
    algs: [
      { moves: "y R2 D' R U' R' D R2 U' R' U2 R", id: '0c400088-90b4-41d4-8b2e-e0ee0f88c0f4' },
      { moves: "R' U R U2 R D r' U2 r D' R'", id: 'a69d949c-fdc8-4aa1-975c-74a57e366308' },
      { moves: "y R' U' R2 D R' U' R D' R2 U2 R", id: 'e9f535be-714d-4ea3-b94a-3267f03eb69d' },
      { moves: "R2 F' R U R' U' R' F R2 U' R' U2 R U2 R", id: '18ba9bc1-29de-4ea5-aab0-7b9071589ba8' }
    ]
  },
  {
    name: 'ZBLL U 15',
    id: 'cf774601-fef6-4bfd-b345-233dc531e428',
    idMethod,
    puzzle,
    group: 'U2',
    setup: "R D R' U2' R D' R' U' R' U2' R U' R' U' R y2'",
    algs: [
      { moves: "y2 R' U R U R' U2 R U R D R' U2 R D' R'", id: 'a40e9637-a9ad-4a49-83d3-335e83a1a440' },
      { moves: "L U L' U L U2 L2 U R U' L U R'", id: '8207e4ad-1730-41a4-b255-84ae559de9db' },
      { moves: "y2 R U R' U R U2 R2 U L U' R U L'", id: '37c7fb3f-b88e-42d3-b923-56d49a21dabd' },
      { moves: "y2 R' F R U R' F' M U' F2 U F r", id: '865670e6-95c1-4ead-a338-ea42d023404f' }
    ]
  },
  {
    name: 'ZBLL U 16',
    id: '03340faa-ce83-4f9e-bf1e-8a5615c54ad1',
    idMethod,
    puzzle,
    group: 'U2',
    setup: "R' U' R U' R' U2' R' D' R U2' R' D R U2' R y",
    algs: [
      { moves: "y' R' U2 R' D' R U2 R' D R U2 R U R' U R", id: 'a9ef9514-0d91-4c42-87dd-18bd08a4fdff' },
      { moves: "R U' R' U' R U R' U R U R2 F' R U R U' R' F", id: '2fee0bf0-d78a-4369-83bd-a391b52ea9f4' },
      { moves: "y2 L' U R U' L U R' L U L' U L U2 L'", id: '2b3ed746-c35a-4433-bb59-a52d601da680' },
      { moves: "R' U L U' R U L' R U R' U R U2 R'", id: '613506d4-aa79-4155-a96f-471dcd7e5b5c' }
    ]
  },
  {
    name: 'ZBLL U 17',
    id: '787903c7-b8f8-4b12-893b-1f3ee2bb14f7',
    idMethod,
    puzzle,
    group: 'U2',
    setup: "R' U2' R' D' R U2' R' D R2'",
    algs: [
      { moves: "R2 D' R U2 R' D R U2 R", id: 'c7c92e0f-af0e-4d39-8d4b-f23198e3ab8d' },
      { moves: "y' F x R2 D2 R U R' D2 R U' R x' F'", id: 'eea27044-4dcb-4bbd-ada7-3b3156f79892' },
      { moves: "y2 L2 D' L U2 L' D L U2 L", id: '7e08fbd0-71c2-4281-b517-e16d87129751' }
    ]
  },
  {
    name: 'ZBLL U 18',
    id: '48830b9e-4511-4898-ab9e-a9b5e98d25ed',
    idMethod,
    puzzle,
    group: 'U2',
    setup: "R' U2' R U2' R' U' R2' D R' U2' R D' R2' U2' R y",
    algs: [
      { moves: "y' R' U2 R2 D R' U2 R D' R2 U R U2 R' U2 R", id: '60f42aea-418a-432b-a02c-a301d5b2ee62' },
      { moves: "R' F' r U2 R' D R U' R' D' R2 U' r' F", id: '59907a82-1556-45f7-9e1d-a5f03ea4158c' },
      { moves: "S R2 S' D' R U2 R' D R' U2 R2 U2 R'", id: 'b5cb2be6-ceb7-496a-92c1-87c041e59cb1' },
      { moves: "y F U R U2 R' U R U2 R2 F R F' R U' R' F'", id: 'ce5b99e5-51f2-4f9b-ab6c-6b39de7a3b14' }
    ]
  },
  {
    name: 'ZBLL U 19',
    id: 'c43eab20-5600-4a73-91f5-9eb43c6b351b',
    idMethod,
    puzzle,
    group: 'U2',
    setup: "D' R U R' U2' R U R' D U R' U2' R U' R' U' R y",
    algs: [
      { moves: "y' R' U R U R' U2 R y U2 R U' R' U2 R U' R'", id: 'f94bf76f-cd67-42de-b97f-96806fd68127' },
      { moves: "R D r' U2 r D' R' U2 R' U R U R' U R", id: '93c55491-b030-4384-b4c5-fd3ca7572165' },
      { moves: "y' R' U R U R' U2 R U' D' R U' R' U2 R U' R' D", id: 'c74e2476-ba87-4fee-9de3-ddfcf0076993' },
      { moves: "R2 F2 r U' R U R' U M F R' F R2", id: '8bce8e32-c68d-4422-abd0-6e95c8479e2e' }
    ]
  },
  {
    name: 'ZBLL U 20',
    id: '1444aec1-507f-4c43-bc2f-4ddd29356f84',
    idMethod,
    puzzle,
    group: 'U2',
    setup: "R U2' R U R U' R2' D R' U R D' R U R'",
    algs: [
      { moves: "y2 F R U R' U' R2 D R' U' R D' R2 U' R U R' F'", id: 'c7ba7d0f-aa29-4bf8-a82b-e142bbe6c13b' },
      { moves: "y R B R' U2 R B' R2 D2 r U' r' D2 R", id: '132532a8-6a1b-44a9-9d5f-d9dc2b3aaaf8' },
      { moves: "y2 F R U R2 D' R U' R' D R2 U' R' U' R U R' F'", id: 'fb3cba53-f317-40e6-afec-33278e507469' },
      { moves: "R U' R2 U' R2 F' R U R' U' R' F U2 R'", id: 'a12999c2-400e-4de3-b470-53be24c66b63' }
    ]
  },
  {
    name: 'ZBLL U 21',
    id: 'ed6846d2-fa07-4cac-9f97-d13b9a2602a6',
    idMethod,
    puzzle,
    group: 'U2',
    setup: "R2' U R U R2' U2' R2' D R' U R D' R U R'",
    algs: [
      { moves: "R2 D' R U2 R' U' D R' U' R2 U R U R2", id: 'e549ef20-5877-4a2c-87b6-07d1c46822a1' },
      { moves: "y' R2 D R' U R D' R2 U' R U' R' U2 R U' R' U2 R U R'", id: '1e14b727-fb1c-47a9-b30e-ac28281074db' },
      { moves: "R' U2 F U F' R F U2 R' U' R U F'", id: '11090587-c8ca-48f1-b44c-29e6ab7e723a' },
      { moves: "R' U2 R U' R' U' R2 D r' U2 r D' R2 U R", id: 'c8f6d414-bf34-418e-802f-2e2f4b4d10bc' }
    ]
  },
  {
    name: 'ZBLL U 22',
    id: '89cc15e6-19aa-4e92-addc-04e6f2b69724',
    idMethod,
    puzzle,
    group: 'U2',
    setup: "L U L' U' L U' L' U R' U L U' R U' L' y",
    algs: [
      { moves: "y' R2 F' R U2 R U2 R' F U' R U R' U' R", id: 'fb63738c-9ff9-41ee-b125-d3dff64ee532' },
      { moves: "y R U L' U R' U' L U' R U R' U R U' R'", id: '523fd0e0-3d3f-41b7-8236-43582ee631c7' },
      { moves: "R2 D' R U2 R' D R U' R' U' R' U' R' U R U R2", id: 'b18767f8-8251-4f40-8dff-1c2ebe995bf5' },
      { moves: "r' B r U' r2 U R B2 R U R2 U r2", id: 'fdf0e09e-2e3a-4197-9f9c-9039817ae270' }
    ]
  },
  {
    name: 'ZBLL U 23',
    id: '1b176be3-31ae-4e64-a344-47dd4a644ab8',
    idMethod,
    puzzle,
    group: 'U2',
    setup: "R' U R2' D R' U R D' R' U2' R' U R U R' U' R y",
    algs: [
      { moves: "y' R' U R U' R' U' R U2 R D R' U' R D' R2 U' R", id: 'ef8c6728-6ef5-40bd-a805-750a0e154e01' },
      { moves: "y R' U' R U' R' U R F U' R' U' R U F' R' U2 R", id: '6e3fc5e0-509d-4bd6-9902-6191ef8e9638' },
      { moves: "R D R' U2 R D' R' U R' U R U' R' U' R U R' U' R", id: '07f59f3a-1635-49e2-98a6-73159523f2d9' },
      { moves: "y2 f U2 r F' R U R' U' R' F M U2 f'", id: '8e2581eb-6459-4175-a338-4c26e816729a' }
    ]
  },
  {
    name: 'ZBLL U 24',
    id: '3ed90ffb-cc29-44ce-a362-b7fafa1d6b22',
    idMethod,
    puzzle,
    group: 'U2',
    setup: "R U' R2' F2' R U2' R U2' R' F2' U2' R U' R' y",
    algs: [
      { moves: "F U R U' R D R' U' R D' R2 U R U R' F'", id: '5f5013a0-4597-480a-b900-330894a5df1a' },
      { moves: "y R2 U' R2 U' R U2 D' R U' R' U' D R U R2", id: '54079384-3535-4c2f-b2bb-20aa66989815' },
      { moves: "y' R U R' U2 F2 R U2 R' U2 R' F2 R2 U R'", id: 'e9fec25a-db59-42f2-ba53-8ad80f3a91a6' },
      { moves: "y R' U' R U' R' U R U' R' U R U L U' R' U R L'", id: '49919d5a-d956-4d1d-ba97-d1f0174d997b' }
    ]
  },
  {
    name: 'ZBLL U 25',
    id: '46de7427-59f7-4f27-bebf-3be62851e5bc',
    idMethod,
    puzzle,
    group: 'U3',
    setup: "R' F R' F' R U R U' R' F R U' R' U R U R' F' R",
    algs: [
      { moves: "R' F R U' R' U' R U R' F' R U R' U' R' F R F' R", id: 'bcc9ea47-a39a-4a63-93d4-d18e14a1447c' },
      { moves: "R U' R2 U' R2 U R2 D' R2 U R2 U' R2 D R'", id: '2ff01fc2-d637-40cb-bbef-df1a0496ec76' },
      { moves: "R U' R2 U' R2 U R' F' R U R2 U' R' F R2", id: '9f761352-03f5-449a-b053-3f34aa3bfcf4' },
      { moves: "R U' R' U F' r U' r' F2 R' F R F'", id: '2f79bb35-4ae7-4db9-a9c5-8d96612436ec' }
    ]
  },
  {
    name: 'ZBLL U 26',
    id: 'e486a0dc-840e-4659-9227-ec5560cd0cc1',
    idMethod,
    puzzle,
    group: 'U3',
    setup: "R U2' R D r' U2' r D' R2' U R' U2' R U R' U R y2'",
    algs: [
      { moves: "r2 F2 r U2 r U' L' U R' U R U' L", id: '62dbce9c-002c-459a-8c6c-ecd9ad8ed1d5' },
      { moves: "y2 R' U' R U' R' U2 R U' R2 D r' U2 r D' R' U2 R'", id: 'b2f78962-f870-4a42-8ead-5098f8e85500' },
      { moves: "R2 D' R U2 R' D R U2 R' F R U R U' R' F' R U2 R' U2 R", id: '9401c653-6369-42fe-a745-b1d8d877e42d' },
      { moves: "R' L' U2 L U2 R U' L' U R' U R U' L", id: 'ddfef102-9553-4c49-9dd5-35d312c31abe' }
    ]
  },
  {
    name: 'ZBLL U 27',
    id: '59028b9c-3e9d-4875-a952-0309c5b49bfa',
    idMethod,
    puzzle,
    group: 'U3',
    setup: "F2' R' F' R U R U' R' F R U' R' U R U R' F2' y",
    algs: [
      { moves: "y' F2 R U' R' U' R U R' F' R U R' U' R' F R F2", id: 'b01c4006-81c2-41fc-bd0c-008278155800' },
      { moves: "y R U R' U R U2 R2 F' R U R' U' R' F R2 U' R' U2 R", id: 'deb49a33-bf6a-4b81-bfd4-e2f4e5eb7672' },
      { moves: "y2 R' U R U' x' U L' U L U2 R U' R' U x", id: 'bf67300f-9bba-436c-8d90-6a4d2e60a2bb' },
      { moves: "y' F2 R U r U2 R2 F R F' R U2 r' R' F2", id: 'ef77b126-8125-4165-b4e0-1a3018b2e9d0' }
    ]
  },
  {
    name: 'ZBLL U 28',
    id: '6240c5bb-82f6-4eab-8d94-197501a5a55c',
    idMethod,
    puzzle,
    group: 'U3',
    setup: "x' R2' U2' R' U2' l' U R U' L U' L' U R' y'",
    algs: [
      { moves: "R2 B2 R' B2 R' U R U' L U' L' U R'", id: '0cb6aa98-285b-4d15-85f3-5070dbfc8d91' },
      { moves: "Lw2 F2 Lw' U2 Lw' U R U' L U' L' U R'", id: '2be1a9f1-6b45-4b68-bf97-b6c8727b44f8' },
      { moves: "R U R' U R U2 R' U R2 D' r U2 r' D R U2 R", id: '88772c22-b621-4541-8a93-59f35067ba0f' },
      { moves: "R2 D' R U2 R' D R U2 R2 U R' F' R U R' U' R' F R2 U' R'", id: '1b3c9671-ce6f-4fea-9e3f-d732991066ef' }
    ]
  },
  {
    name: 'ZBLL U 29',
    id: '2b31c1a1-cc90-4c18-94f2-784ab55d9725',
    idMethod,
    puzzle,
    group: 'U3',
    setup: "R' U' R F R2' D' R U R' D R2' U' F' y",
    algs: [
      { moves: "y' F U R2 D' R U' R' D R2 F' R' U R", id: '7622ef39-fce8-4d3b-81a0-792258b50fd9' },
      { moves: "y' R U R' B' R2 D R' U' R D' R2 U B", id: 'f334142f-fd08-4961-8199-e41aaecb7724' },
      { moves: "R U R D R' U' R D' R2 U' R2 D' R U' R' D R U R", id: '465d9485-8bb7-4f5d-97d4-259aa41c185c' },
      { moves: "R U R' U R U2 R' U2 R' U' R2 D R' U' R D' R2 U2 R", id: 'f431a334-4756-4b30-8417-8baabe570a8d' }
    ]
  },
  {
    name: 'ZBLL U 30',
    id: '1f2b3221-375e-4218-9441-cc042eda0cf6',
    idMethod,
    puzzle,
    group: 'U3',
    setup: "F U R2' D' R U' R' D R2' F' R' U R y",
    algs: [
      { moves: "y' R' U' R F R2 D' R U R' D R2 U' F'", id: '13cf194d-a106-4eb6-8b15-03f9bcf69396' },
      { moves: "y' B' U' R2 D R' U R D' R2 B R U' R'", id: '4e3757f8-c717-4c3b-8a05-c553db687003' },
      { moves: "y l' U' L U l F' L' F R U R' U' R' F R U R U' R' F'", id: '770cad93-f160-4300-9961-b33c3c5f7899' },
      { moves: "y' R' U' R F R' U R U' R' F' r U R U' r'", id: '169494f3-ffec-467b-94d4-d41496045256' }
    ]
  },
  {
    name: 'ZBLL U 31',
    id: '656a8d5c-f675-4f0c-ba44-5882f6d76c28',
    idMethod,
    puzzle,
    group: 'U3',
    setup: "R' U2' R U R' U2' R U R2' F' R U R U' R' F R U' R' U' R y'",
    algs: [
      { moves: "y R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R' U2 R", id: 'f17c1fd7-f6f0-4635-b1ca-6de2926ecd71' },
      { moves: "F U R U' R' S U f' R' f R U' R' f' R", id: 'afce17a0-28f3-4597-8534-67156887e885' },
      { moves: "R' U2 F' R U R' U' R' F R2 F U' R' U' R U F'", id: '69f58830-64bc-4561-bfc3-0619b3b45e00' },
      { moves: "r2 U' r U r2 F2 R U R' F2 r F' U r2", id: '92891388-4dd0-4aae-a275-695d0985668e' }
    ]
  },
  {
    name: 'ZBLL U 32',
    id: 'af9f4a60-8ed8-49d2-96b3-6ab6ebb9eef6',
    idMethod,
    puzzle,
    group: 'U3',
    setup: "R' U' R U' R2' U2' R U R2' F' R U R U' R' F R2' y",
    algs: [
      { moves: "y' R2 F' R U R' U' R' F R2 U' R' U2 R2 U R' U R", id: '180aaae6-f7bc-45e7-a6a0-b4183e2a3aa5' },
      { moves: "R U' R' U R U' L U L' U x' U2 R U2 R2 x", id: 'ea779882-a277-40c2-9685-b1d28dda9d53' },
      {
        moves: "R2 D' R U2 R' D R U2 R2 U R' U' R' F R2 U' R' U' R U R' F'",
        id: '4f5c26e4-3378-4f30-b203-9131d077cfd0'
      },
      { moves: "f R' F2 R S' R' U' F U r U2 R U' r'", id: 'dd384d85-2d94-48d9-8ee0-74cc3be207d8' }
    ]
  },
  {
    name: 'ZBLL U 33',
    id: 'fb0407ab-f34a-472d-8c66-2faecb86e4a5',
    idMethod,
    puzzle,
    group: 'U3',
    setup: "R2' D' R U2' R' D R U2' R U R' U2' R U R' U R y'",
    algs: [
      { moves: "y F U R U2 R' U R U R2 F' r U R U' r'", id: 'f601bf8e-5c10-4f47-8749-c70353db9fec' },
      { moves: "y R' U' R U' R' U2 R U' R' U2 R' D' R U2 R' D R2", id: 'a49b7b0c-a26c-4909-ab1d-04283ae73698' },
      { moves: "y' R' U2 R2 L U2 L' U' L U2 R2 U L' R", id: '95a9a8b5-9dfb-4507-87c1-e0df0562f08b' },
      { moves: "y' R' U2 R' U' F' U F R2 U' R' F R' F' R2", id: '91bb0520-1a90-4c40-8b4b-c58104ec4070' }
    ]
  },
  {
    name: 'ZBLL U 34',
    id: '28c08deb-57a5-433a-8cf5-7d16ad8f156d',
    idMethod,
    puzzle,
    group: 'U3',
    setup: "R2' D R' U2' R D' R' U2' R' U' R U2' R' U' R U' R' y'",
    algs: [
      { moves: "y' R U2 R' U2 R' F R U R U2 R' U' R U2 R' U' F'", id: '49277264-a1ff-44da-8797-5d26d70e1e8f' },
      { moves: "y R U R' U R U2 R' U R U2 R D R' U2 R D' R2", id: 'd07dfb67-3822-4f70-b121-af778da9a1e1' },
      { moves: "y2 F R2 U R' D R2 D' R U' R2 F' R U' R'", id: '387a9d2e-58b3-40c8-b9dd-73e9c12afdd2' },
      { moves: "y R2 D' R U' R' D R2 U R' F R U R' U' R' F' R2", id: 'ead6f142-9316-4689-93e3-a616c37f2445' }
    ]
  },
  {
    name: 'ZBLL U 35',
    id: '462ded1b-d1db-421f-9aba-95b0dbb8195f',
    idMethod,
    puzzle,
    group: 'U3',
    setup: "F U R U2' R' U R U R2' F' r U R U' r' y",
    algs: [
      { moves: "y' r U R' U' r' F R2 U' R' U' R U2 R' U' F'", id: '2a98dfed-7334-4772-8214-e01d6a52b662' },
      { moves: "L U L' F U' R U2 L U2 L' U2 R' U F'", id: '732ebbf1-e8dd-41dd-82d2-05e192d674ea' },
      { moves: "y' R2 F R F' R U R2 F' U' F U R U2 R", id: '238e36e8-f8e9-444c-98ad-242800c3ae52' },
      { moves: "y' R2 D' R U2 R' D R U2 R U R' U2 R U R' U R", id: '17c51b69-0fc2-44bf-80e7-7c15526cd666' }
    ]
  },
  {
    name: 'ZBLL U 36',
    id: '8db70eb8-c5df-4dbe-8ede-a84c27846754',
    idMethod,
    puzzle,
    group: 'U3',
    setup: "R U R' U R U2' R' U R U2' R D R' U2' R D' R2' y",
    algs: [
      { moves: "R2 F R U R U' R' F' R U' R2 D' R U R' D R2", id: '328fb946-9ae2-4324-83bc-db6c0f3e6b8c' },
      { moves: "y F U R U2 R' U R U2 R' U' R' F' R U2 R U2 R'", id: '4d1f362a-525d-4f96-a9d6-04ca46db73c3' },
      { moves: "y' R2 D R' U2 R D' R' U2 R' U' R U2 R' U' R U' R'", id: '8cf84b17-705a-4236-ae12-2a1f4c5929fb' },
      { moves: "U' S' U F R' F' R2 U' R' U2 R B U2 B' R' S", id: '625166fa-467e-441b-8a33-1a7056439fc9' }
    ]
  },
  {
    name: 'ZBLL U 37',
    id: 'a0dffe00-86d4-45e9-87ee-c81419d51ee0',
    idMethod,
    puzzle,
    group: 'U4',
    setup: "R U R' L' U2' R U' R' U2' L U R U' R' y2'",
    algs: [
      { moves: "y2 R U R' U R U R' U2 R U' R2 D' R U' R' D R", id: 'b6997843-2e3b-4516-b220-2f9672549c21' },
      { moves: "y2 R U R' U' L' U2 R U R' U2 L R U' R'", id: 'c6f763a9-4311-4421-8d2f-ec2d09587fe9' },
      { moves: "L U L' F' U L U L' U' F U' L U' L'", id: '66add517-466f-4b03-9341-fd964e2e23c3' },
      { moves: "y2 F U R U' R' S' R U' R' S U R U2 R' U' F'", id: '5cd2cebc-f2d1-440c-ac49-25accfe6c857' }
    ]
  },
  {
    name: 'ZBLL U 38',
    id: '9b88d1cc-a5a7-40f8-ae22-6949a03eb360',
    idMethod,
    puzzle,
    group: 'U4',
    setup: "R' U2' R' D' R U2' R' D R' U R' U R U2' R' y",
    algs: [
      { moves: "R U R' U R U' R' U2 R' D' R U2 R' D R2 U' R'", id: '0061507e-3da8-42a6-8ac2-c494783c137d' },
      { moves: "y' R U2 R' U' R U' R D' R U2 R' D R U2 R", id: 'aacb5bc8-37d2-4b24-9b8c-f5a63c4314b7' },
      { moves: "y f R' f' R' f' R U R' S U' R' F R2", id: '1a860a9d-c532-4baa-8bba-72880de2b4c8' },
      { moves: "R2 B2 R' U2 R' U' R2 B2 R2 U' R B2 R'", id: '1c72d3b6-032f-40bd-b5ac-976364fba5b6' }
    ]
  },
  {
    name: 'ZBLL U 39',
    id: '238729ee-0e48-4048-b3d7-78f7940a08c0',
    idMethod,
    puzzle,
    group: 'U4',
    setup: "R' U' R U' F U' R' U R U F' R' U R",
    algs: [
      { moves: "R' U' R U2 R' F' R U R' U' R' F R2 U2 R' U R", id: 'b2d03e3a-d924-4e5d-a79a-ec7ffe342843' },
      { moves: "R' U' R F U' R' U' R U F' U R' U R", id: '99002c1f-4a8b-4f0a-b0a4-48ba1bc03fb8' },
      { moves: "R' U' R U' R' U' R U2 R' U R2 D R' U R D' R'", id: 'a7681e65-8af7-449b-bd6e-80aa7f87c769' },
      { moves: "R' U' R U L U2 R' U' L' U' L R U2 L'", id: 'ccba856d-4896-460d-86f3-b95d61b32ae1' }
    ]
  },
  {
    name: 'ZBLL U 40',
    id: '5b637ca6-ed59-453c-b965-05482dc7fbda',
    idMethod,
    puzzle,
    group: 'U4',
    setup: "R U2' R D R' U2' R D' R U' R U' R' U2' R y",
    algs: [
      { moves: "y R2 D' R U2 R' D R U2 R U R' U' R U' R' U2 R", id: '6f0738b8-240d-4b44-b989-c75234b173f8' },
      { moves: "y' R' U2 R U R' U R' D R' U2 R D' R' U2 R'", id: '3750dc8a-8e89-453e-9ae0-3247a43c9741' },
      { moves: "y2 R' U' R U' R' U R U2 R D R' U2 R D' R2 U R", id: '077137e0-52d3-4896-b2a2-0b264ba222b7' },
      { moves: "y2 R U R' U' R' U' F U R2 U' R2 F' R U R U' R'", id: '8d0abb7e-ea60-4a1f-a66e-74f0689a9d1a' }
    ]
  },
  {
    name: 'ZBLL U 41',
    id: 'e9ab0633-1456-4e17-93e5-7bd5d63e14eb',
    idMethod,
    puzzle,
    group: 'U4',
    setup: "x' R U2' R D2' R' U2' R D2' R2' x",
    algs: [
      { moves: "x' R2 D2 R' U2 R D2 R' U2 R' x", id: 'f5b798b0-8062-4a99-b3cc-358e9d47b4e3' },
      { moves: "y2 R U' D' R' D' R U2 R' D R U' D R'", id: 'b32ed164-5da0-4938-a1d5-ce7b5c47f1a4' },
      { moves: "y2 x L2 D2 L' U2 L D2 L' U2 L'", id: 'd7e73dc2-578b-4b5e-96c2-91ccbd639139' },
      { moves: "y' F U2 R' D' R U2 R' D R F'", id: '83c3c68c-bedb-400b-aaa9-4e845d6d7a5f' }
    ]
  },
  {
    name: 'ZBLL U 42',
    id: '211404b9-0ed1-409c-aad3-5db57b328646',
    idMethod,
    puzzle,
    group: 'U4',
    setup: "x R' U2' R' D2' R U2' R' D2' R2' x' y2'",
    algs: [
      { moves: "y2 x R2 D2 R U2 R' D2 R U2 R x'", id: 'e629bfcf-9f70-4d19-a5d1-6d3669d65426' },
      { moves: "y2 R' F2 R U2 R U2 R' F2 R U2 R'", id: 'fa854579-b7f8-402f-8042-07e543a75c54' },
      { moves: "R' U D R D R' U2 R D' R' U D' R", id: '3645a196-e22a-4d27-8550-4009f3cad2a4' },
      { moves: "U R U R2 U' R' F R U R2 U' R' F'", id: '8e28fa62-494d-4aff-b75b-4326dbba713f' }
    ]
  },
  {
    name: 'ZBLL U 43',
    id: 'd067a663-86ad-4976-b8d6-8b57d5c0cb3b',
    idMethod,
    puzzle,
    group: 'U4',
    setup: "F R U R' U' R U' R' U' R U R' F'",
    algs: [
      { moves: "F R U' R' U R U R' U R U' R' F'", id: '8a6d36c0-5992-4fb3-9710-619085f152ea' },
      { moves: "R U R' U' R' F2 R2 U' R' U' R U R' F2", id: '6122160b-b33b-4c64-aeed-ef5d6a350dc7' },
      { moves: "R' U' R f R' U R U' R U R' U' f'", id: '575bccca-d5b1-4a4b-a4bf-c3b23a4534e3' },
      { moves: "y2 R U R' U' R' F R F' R' U' F' U F R", id: 'a1dcdc53-79f7-40f5-b20b-cee9ffb7b333' }
    ]
  },
  {
    name: 'ZBLL U 44',
    id: '8db716d7-e962-4af7-ae87-7298f50de64c',
    idMethod,
    puzzle,
    group: 'U4',
    setup: "F' U' F U R' F R2' U R' U' R' F' R2' U R' y2'",
    algs: [
      { moves: "y2 R U' R2 F R U R U' R2 F' R U' F' U F", id: 'eb2bab00-6d35-42b1-8c11-5ea313a71955' },
      { moves: "y F' R U R' U' R' F R2 U R' U2 R U R' U2 R U' R'", id: '5e78d474-d45c-4da1-9f98-e102c6da2067' },
      { moves: "y R U2 F R U R U' R U R2 U' F' U2 R'", id: '610a082f-ccb2-47ac-878f-19548dc07883' },
      { moves: "y' R U' R' U R' D' R U' R' D F R f' R U R' S", id: 'e7dcbc48-b873-41b2-baa3-5e128d6420c3' }
    ]
  },
  {
    name: 'ZBLL U 45',
    id: 'ccb7d721-ba3c-4e65-94a7-27b56b150ca0',
    idMethod,
    puzzle,
    group: 'U4',
    setup: "R' U R2' D R' U R D' R' U R' U' R U' R' U' R y",
    algs: [
      { moves: "R U R' U R' D' R U2 R' D R2 U' R' U2 R U2 R'", id: '0f3e6fc2-a2c3-4b39-9583-36b5b7a4e065' },
      { moves: "y' R' U2 R U R' U R' D r' U2 r D' R' U2 R'", id: 'becf555f-1fe9-4517-b525-365846e86dfb' },
      { moves: "y' R' U R U R' U R U' R D R' U' R D' R2 U' R", id: 'b0466578-e6e3-49e6-8117-f917511aa627' },
      { moves: "y R' U' R U' R' U2 R F l' U' L U R U' r'", id: 'c606ec9e-a328-4b4e-9560-b7439050f8ab' }
    ]
  },
  {
    name: 'ZBLL U 46',
    id: '356e2f8a-2252-4b78-ae09-04e319a3d85b',
    idMethod,
    puzzle,
    group: 'U4',
    setup: "R U' R2' D' R U' R' D R U' R U R' U R U R' y",
    algs: [
      { moves: "y' R U' R' U' R U' R' U R' D' R U R' D R2 U R'", id: 'b415e21f-6262-456a-aa9d-43ad6e40421f' },
      { moves: "y F' r U R' U' r' F R2 U R' U R U2 R'", id: 'cb62fb34-3587-463c-adb7-63dcb121dff7' },
      { moves: "y R U R' U R U2 R' U' R2 D' R U' R' D R U R", id: '5a95c083-12ea-449a-92c7-8ec6db980719' },
      { moves: "y' R U2 R' U' R U' R D' r U2 r' D R U2 R", id: 'ef9a21a0-4d19-4be8-b085-b4195f5a1ac8' }
    ]
  },
  {
    name: 'ZBLL U 47',
    id: 'f69a4331-b39d-4f0e-8a31-1bd84f3f41ac',
    idMethod,
    puzzle,
    group: 'U4',
    setup: "R' U' R' D' R U R' D R U' R U' R' U2' R",
    algs: [
      { moves: "R' U2 R U R' U R' D' R U' R' D R U R", id: '5cf9fe65-b315-48fe-9f38-256eb5c49dd7' },
      { moves: "R' U2 R U R D R' U' R D' R' U R' U R", id: '88be03a7-be1f-4c08-952b-9504847fa8b9' },
      { moves: "R' U2 R U R' U R U' F' r U R' U' r' F R", id: 'a039e4bf-94ef-43ca-b760-302bd057a409' },
      { moves: "y2 R U2 r' F R' F' r U2 r' F R F' M'", id: '2acae47c-9997-4990-bce3-9e91c6166d7b' }
    ]
  },
  {
    name: 'ZBLL U 48',
    id: 'f7faa394-667f-4035-a69b-d4c922ffb349',
    idMethod,
    puzzle,
    group: 'U4',
    setup: "R F R' U R U2' R' U R U F' R'",
    algs: [
      { moves: "y2 R U2 R' U' R U' R D R' U R D' R' U' R'", id: '8af45a28-2780-4b8f-b155-548748b0d2be' },
      { moves: "R F U' R' U' R U2 R' U' R F' R'", id: '5c01876b-3e4a-4d65-ac85-8cd32da7feef' },
      { moves: "L U2 L' U' L U' L' R U R' U' R' F R U R U' R' F'", id: '1116aa1f-1555-434d-b0ab-2b414f022bef' },
      { moves: "y2 R U2 R' U' R U' R' U' F R' F' r U R U' r'", id: 'c0fbc166-84f2-4241-a12f-e312f3d38aa4' }
    ]
  },
  {
    name: 'ZBLL U 49',
    id: '8a8fcb16-5021-47ad-8a6a-fb0a520033ec',
    idMethod,
    puzzle,
    group: 'U5',
    setup: "R2' D R' U' R D' R' U' R' U R U R'",
    algs: [
      { moves: "R U' R' U' R U R D R' U R D' R2", id: '7a09eb7c-0975-4619-8196-c5e6a93a98e5' },
      { moves: "y F' U L U' L' U' F L U2 L'", id: 'd084e51f-8f41-4804-bc84-86566004cc34' },
      { moves: "R U' R' U' R U2 R2 D' R U R' D R", id: 'f6abd01c-b8e0-489e-aa3a-556e10e4f611' },
      { moves: "R' D R2 U' R' U' R U2 R2 D' R", id: '2a6ff7f0-87b8-4444-90e8-3ffccce073b3' }
    ]
  },
  {
    name: 'ZBLL U 50',
    id: '3f30af3f-3e6f-4f5c-b547-c873ff068252',
    idMethod,
    puzzle,
    group: 'U5',
    setup: "R' U' F' U F R U F U R U' R' U R U' R' F' y",
    algs: [
      { moves: "y' F R U R' U' R U R' U' F' U' R' F' U' F U R", id: '21d89087-7186-42c0-9768-2b69036120ab' },
      { moves: "y' R U2 R2 D' R U' R' D R U' R' F R U R U' R' F'", id: '9e9ee7e9-e2d9-44e5-820a-a207aa5e161e' },
      { moves: "y S' R' U R S R' U2 R' F R F' U R", id: '0fc99525-d92d-4a6d-8040-671efa4efa4e' },
      { moves: "y2 M U' M' F U R U' R' F' M U M'", id: '6f632d52-3585-499b-924d-e6ddb449d28a' }
    ]
  },
  {
    name: 'ZBLL U 51',
    id: 'efb54b40-d6f3-4ba1-9855-3623427034a7',
    idMethod,
    puzzle,
    group: 'U5',
    setup: "L' R U R' U R U R' U2' L R U' R'",
    algs: [
      { moves: "R U R' L' U2 R U' R' U' R U' R' L", id: '7b353303-e7fe-4d59-92d3-b8348648db9d' },
      { moves: "R U R' U L' U R U' R' L U' R U' R'", id: '6d08d1a3-ae03-4a88-8d4c-e3cc21ecd6f3' },
      { moves: "S' R' U' R S R' U F' U' F U R", id: 'bca47bdd-c1c6-4dfb-b127-5367d67db3f9' },
      { moves: "R U R' U R' F R F' U' S' R U' R' S", id: '8108db59-c3f6-4462-a95b-2dcf4083aeca' }
    ]
  },
  {
    name: 'ZBLL U 52',
    id: '601c7ca0-3787-428f-a106-9bf9e3575796',
    idMethod,
    puzzle,
    group: 'U5',
    setup: "F U' R' U R U F' R' U2' R",
    algs: [
      { moves: "R2 D' R U R' D R U R U' R' U' R", id: '7d57a2bb-664a-44c2-83ed-a302828936f2' },
      { moves: "R' U2 R F U' R' U' R U F'", id: '904629bd-fed8-4565-b1f9-01609cc45a9d' },
      { moves: "R' U2 R U2 R' F' R U R' U' R' F R2", id: '92376275-f5b2-4c60-bd97-2f92a816aae8' },
      { moves: "R D' R2 U2 R U' R' U' R2 D R' U", id: 'e30ea6cf-0f1a-49a2-adac-230c28f4e1bf' }
    ]
  },
  {
    name: 'ZBLL U 53',
    id: 'bed8f426-b491-4d18-a210-6f6acfe0628f',
    idMethod,
    puzzle,
    group: 'U5',
    setup: "F U R U2' R' U R U R' U R U2' R' U R U R' F'",
    algs: [
      { moves: "F U R U2 R' U R U R' U R U2 R' U R U R' F'", id: '633bbda2-d025-45a9-be18-3362bc84d15c' },
      { moves: "F R U' R' U' R U2 R' U' R U' R' U' R U2 R' U' F'", id: '5a017da4-6894-451f-ab35-f82c3fff8bde' },
      { moves: "y2 f U2 R2 U2 R2 U' S R2 S' U' R2 f'", id: '3bcfc99e-4149-48f6-8f4d-68068590603f' },
      { moves: "y2 F U2 R2 U2 R2 U' S R2 S' U' R2 F'", id: 'ce9cab3c-7233-475b-a527-59864ee5bb69' }
    ]
  },
  {
    name: 'ZBLL U 54',
    id: 'b1f9347a-1de0-4e8a-8026-4eb0544d04d9',
    idMethod,
    puzzle,
    group: 'U5',
    setup: "F U R U' R' F' R U R' U' M' U R U' r' y",
    algs: [
      { moves: "y' r U R' U' M U R U' R' F R U R' U' F'", id: '7227ca16-4604-4e82-be88-a631cd88b6fc' },
      { moves: "R' F' M U' M' F M U r", id: '3e38e83e-e17c-4596-af77-3c6ca6222a18' },
      { moves: "R' F' U' F U F R S R' F' R S'", id: '8988f011-76ca-486d-ae8a-974239daad44' },
      { moves: "S' R U R' S R U' R2 F' U' F U R", id: 'fc2eff68-9803-4416-83e7-1c3f36990281' }
    ]
  },
  {
    name: 'ZBLL U 55',
    id: '078619b1-05f8-4c63-9b56-d9560f68cf9d',
    idMethod,
    puzzle,
    group: 'U5',
    setup: "M' U' R U R' U M F R' F' R2' U2' R' y",
    algs: [
      { moves: "y' r U2 R2 F R F' U2 r' R U R U' R'", id: 'b6a05cfe-b99f-4dc1-82c2-5c7ba1294131' },
      { moves: "y R U R' U' M' U R2 B' R' B U' r'", id: 'e7a06ef3-21f5-4b0c-ab4c-9f025c7282ba' },
      { moves: "y' R U2 R2 F R F' M' U' R U' R' U M", id: 'df3050f9-e537-4695-9dc1-816315036277' },
      { moves: "y' F R U R' U' f' R U R' S R U' R'", id: '73c194ea-f14b-47b5-acd7-4ff012873814' }
    ]
  },
  {
    name: 'ZBLL U 56',
    id: '3fd5940c-a49d-46d4-8ae9-d3f0676d0c20',
    idMethod,
    puzzle,
    group: 'U5',
    setup: "L' U' L U' L' R U' R' U2' L R U' R' y'",
    algs: [
      { moves: "y' R' U2 R F U' R' U R U R' U R U' F'", id: 'dd1883db-319b-43ff-a6e7-f48e7428eb43' },
      { moves: "y R' D R2 U' R' U R U2 R' U' R U R2 D' R", id: 'dffa5470-a987-49d2-85ae-45e4162035d9' },
      { moves: "y R' U' R U' R' L U' R U R' L' U2 R", id: '69f51366-d61d-405d-9d9f-c5f570347267' },
      { moves: "y' R' U' F R' F' R2 S' R' U R S", id: '4db3f5ad-8fbf-4fef-92c6-1040774e5d85' }
    ]
  },
  {
    name: 'ZBLL U 57',
    id: 'ca6a64f2-b7e8-4ebf-b1a0-ce6345c5930e',
    idMethod,
    puzzle,
    group: 'U5',
    setup: "F' U L U' L' U' F L U2' L'",
    algs: [
      { moves: "y' R' D' R U' R' D R2 U2 R' U R U R'", id: '76f7cee9-5668-4b81-88e3-0791d30a86c5' },
      { moves: "y2 R2 D R' U' R D' R' U' R' U R U R'", id: '3418774d-17b4-45da-9c84-102287c133de' },
      { moves: "y2 R' D R2 U2 R' U R U R2 D' R", id: '6504a739-65d6-44d5-84a3-86dbbdf5e325' },
      { moves: "L U2 L' F' U L U L' U' F", id: 'cca17220-a3c2-4318-86c3-e96ebd1fdae0' }
    ]
  },
  {
    name: 'ZBLL U 58',
    id: 'f698abdd-8e99-4c8c-88a8-8867c38f6d58',
    idMethod,
    puzzle,
    group: 'U5',
    setup: "R B' R2' F R2' B R2' F' R F U R U' R' F' y'",
    algs: [
      { moves: "M' U R' U' F' U F R2 U R' U R U2 r'", id: '28c881ee-ee61-40b3-8bba-0ce6aa6204e7' },
      { moves: "F U R U2 R2 U2 R U R' U R U2 R U R' F'", id: '79a19b02-7b31-447b-9d3a-27b00d412fdc' },
      { moves: "M U' M' F R U R' U' F' M U M'", id: 'fe09a5ac-d13b-44c9-a651-c97958f8111c' },
      { moves: "y F' U' L' U L F2 U R U' R' U R U' R' F'", id: '6a9a1f4a-c0f1-4240-8da4-4bd555ab1242' }
    ]
  },
  {
    name: 'ZBLL U 59',
    id: 'd2947b42-6d8a-4e8d-bfd5-76da74003ee4',
    idMethod,
    puzzle,
    group: 'U5',
    setup: "R' U2' R U L U2' R' U' R U2' L'",
    algs: [
      { moves: "y2 R' U R U R' U' R' D' R U' R' D R2", id: 'b89bddf9-50f9-4a63-a0dd-1c5036b2902a' },
      { moves: "y' F U' R' U R U F' R' U2 R", id: '003ecf14-a22a-4c0d-9637-c62700ec0b25' },
      { moves: "y2 R' U R U R' U2 R2 D R' U' R D' R'", id: 'd0f6fa03-80ee-486a-bb7c-fdcf3f1bf03d' },
      { moves: "L' U L U L' U2 L2 D L' U' L D' L'", id: '73fcfaee-62a3-4bfe-8b23-aa3911f1d4ca' }
    ]
  },
  {
    name: 'ZBLL U 60',
    id: 'b5dc5639-b189-455e-b3c7-81a14f3c6951',
    idMethod,
    puzzle,
    group: 'U5',
    setup: "R U R' U L' U R U' R' L U' R U' R' y2'",
    algs: [
      { moves: "y2 R' U' F' U F U' R S' R' U R S", id: '07032c82-eb51-42f2-b5f0-907a8d393d55' },
      { moves: "y2 L' R U R' U R U R' U2 R L U' R'", id: 'd8ab317c-094f-4b8d-ac5d-db403023d0c3' },
      { moves: "y2 R' U' R U' F U' R' U R U R' U R U' F'", id: 'b3ffe7bc-fb2a-4a06-a018-07124463fe18' },
      { moves: "L' U' L R U2 L' U L U L' U L R'", id: '35b15cc7-5361-48a4-b1ca-e1d716e8c8d6' }
    ]
  },
  {
    name: 'ZBLL U 61',
    id: '5f3c0937-5e20-4551-84a1-edf284444e8f',
    idMethod,
    puzzle,
    group: 'U6',
    setup: "R U R' U R U2' R' U' R U2' R' U' R U' R' y2'",
    algs: [
      { moves: "y' R' U' R U R' U R U2 R' U R U2 R' U' R", id: 'f6a5f7eb-4a0f-4027-a22f-71df8795e73e' },
      { moves: "y2 R U R' U R U2 R' U R U2 R' U' R U' R'", id: '2c5b2d79-3602-4945-8d11-b965d67c9c1b' },
      { moves: "L U L' U L U2 L' U L U2 L' U' L U' L'", id: 'fcafb64d-76ed-458a-acd8-20a7b3ef374a' },
      { moves: "U2 R U R' U R U2 R' U R U2 R' U' R U' R'", id: 'd1c1efee-0909-4c75-8165-77c68673f88c' }
    ]
  },
  {
    name: 'ZBLL U 62',
    id: '78197500-ce26-42a8-8651-5117d42a75c0',
    idMethod,
    puzzle,
    group: 'U6',
    setup: "R U' R' U2' R U R' U2' R U R' U R U' R' y",
    algs: [
      { moves: "y' R U R' U' R U' R' U2 R U' R' U2 R U R'", id: 'f3946b7a-1197-4486-9b52-20a126ac25ff' },
      { moves: "R' U' R U' R' U2 R U' R' U2 R U R' U R", id: 'dc8609d8-90c2-43df-8607-f980a391f766' },
      { moves: "y2 L' U' L U' L' U2 L U' L' U2 L U L' U L", id: '181b5852-fa50-4c5c-a04b-69deaced7f6e' },
      { moves: "y L U L' U' L U' L' U2 L U' L' U2 L U L'", id: '9d3670db-d7e3-42f6-8e77-5355358bab53' }
    ]
  },
  {
    name: 'ZBLL U 63',
    id: '26b36e55-68de-45a8-a04b-e5dc0d48c0fd',
    idMethod,
    puzzle,
    group: 'U6',
    setup: "R U2' R' U' R U' R' U R U R' U R U2' R' y'",
    algs: [{ moves: "y R U2 R' U' R U' R' U' R U R' U R U2 R'", id: 'ac43ca82-d3c3-4d66-8aa1-6a80a6922e8c' }]
  },
  {
    name: 'ZBLL U 64',
    id: 'df1439fc-8b1c-4314-bfd0-5f5f76876ba4',
    idMethod,
    puzzle,
    group: 'U6',
    setup: "R U R' U R U' R' U R' U' R2' U' R2' U2' R y'",
    algs: [
      { moves: "y R' U2 R2 U R2 U R U' R U R' U' R U' R'", id: 'ebfcad4f-650a-410a-a664-9fcdde77d512' },
      { moves: "y' r' F2 r2 U' r' F r' F U' F U r", id: '4ad1fcb1-3dac-4a7b-8e03-1958c20f55b2' },
      { moves: "U R' U2 R2 U R2 U R U' R U R' U' R U' R'", id: 'd5526c39-237e-403d-985e-81d0f20280fb' },
      { moves: "y2 R' U' R U R U' R' U' R U' R' U R' U R2 U R'", id: '928f1c14-9cc3-4f27-8614-799380abc031' }
    ]
  },
  {
    name: 'ZBLL U 65',
    id: '26df910f-cff4-46a4-9fec-a68cd5b3a6a4',
    idMethod,
    puzzle,
    group: 'U6',
    setup: "R' U2' R U R' U R U' R' U' R U' R' U2' R y'",
    algs: [
      { moves: "y R' U2 R U R' U R U R' U' R U' R' U2 R", id: '551ba4e4-55da-4bc8-810f-b721a1238a1f' },
      { moves: "y' L' U2 L U L' U L U' R' U' R U' R' U2 R", id: '07a668c8-60d5-4a30-9e46-cd8239616d4c' },
      { moves: "y' L' U2 L U L' U L U L' U' L U' L' U2 L", id: '56b1a823-7ac4-473f-9160-671d2888bcad' }
    ]
  },
  {
    name: 'ZBLL U 66',
    id: 'f476cbba-0af2-46b3-9b3e-02ebab39121e',
    idMethod,
    puzzle,
    group: 'U6',
    setup: "R' U' R U' R' U R U' R U R2' U R2' U2' R' y'",
    algs: [
      { moves: "y R U2 R2 U' R2 U' R' U R' U' R U R' U R", id: 'df9054bf-c273-4e0c-b788-23408471c7ef' },
      { moves: "U' L U2 L2 U' L2 U' L' U L' U' L U L' U L", id: '206f47de-1fc0-4799-befd-ccb99480dfeb' },
      { moves: "y R U2 R2 F R F' R U' B U' B' R'", id: 'e8240371-732e-4275-82f5-e6c8fb097568' },
      { moves: "y R' U R U' R' U R U' R' U R' U' R2 U' R2 U2 R2", id: '7e74ec04-ce7c-4bd2-bdf0-0fc1ff2bbf1d' }
    ]
  },
  {
    name: 'ZBLL U 67',
    id: '96d0b454-a7f1-4cbe-bcd3-27cc5ce195cb',
    idMethod,
    puzzle,
    group: 'U6',
    setup: "R U R2' U' R2' U' R2' U2' R U' R U' R' y2'",
    algs: [
      { moves: "y2 R U R' U R' U2 R2 U R2 U R2 U' R'", id: '1ffca0db-ba74-4e80-920c-afe59cac1966' },
      { moves: "y2 R U R' U R' U' R U' R' U2 R U2 R U2 R'", id: '7b79d3e8-32b3-4e43-a0c2-d5195f49abc5' },
      { moves: "y2 R U R' U R' U' R U R U2 R' U2 R' U2 R", id: '8f8892d5-6411-4634-a9eb-4dd8387b12c6' },
      { moves: "y2 R U R' U' L' U' L U' R U2 R' L' U2 L", id: '9f6a1f98-d322-4cc4-8f80-50c58aa3db0b' }
    ]
  },
  {
    name: 'ZBLL U 68',
    id: 'e4e8f946-c745-473c-993d-fa8167da9cca',
    idMethod,
    puzzle,
    group: 'U6',
    setup: "R' U' R2' U R2' U R2' U2' R' U R' U R",
    algs: [
      { moves: "R' U' R U' R U2 R2 U' R2 U' R2 U R", id: '925324d1-4c1d-4763-9362-09414bf1b96f' },
      { moves: "R' U' R U' R U R' U' R' U2 R U2 R U2 R'", id: 'af1206ba-df63-4a87-99f0-48d7aafce547' },
      { moves: "R' U' R U' R U R' U R U2 R' U2 R' U2 R", id: 'ca5ed00a-b43f-4ba3-a004-ef626539281d' },
      { moves: "R' U' R U' R U R2 U' R2 U R2 U R2 U' R'", id: '36d13c05-8558-4690-abcd-650ecf1a76dd' }
    ]
  },
  {
    name: 'ZBLL U 69',
    id: 'e8490c0b-7724-430b-ae12-41ca1c82731a',
    idMethod,
    puzzle,
    group: 'U6',
    setup: "R U2' R' U' R U' R2' U2' R U R' U R",
    algs: [
      { moves: "R' U' R U' R' U2 R2 U R' U R U2 R'", id: 'a4d79bc1-3f1e-4d05-9a29-3852b5209675' },
      { moves: "y2 L' U' L U' L' U2 L U2 R U R' U R U2 R'", id: '3ac4b7e6-cb77-4f5d-a90f-785f32bea5cd' },
      { moves: "y2 L' U' L U' L' U2 L2 U L' U L U2 L'", id: 'ed6bf826-31c8-467e-9b5a-fb3d964fcbf9' }
    ]
  },
  {
    name: 'ZBLL U 70',
    id: 'd70b5429-6fb5-4861-8a28-509aee3afce5',
    idMethod,
    puzzle,
    group: 'U6',
    setup: "R' U2' R U R' U R2' U2' R' U' R U' R' y2'",
    algs: [
      { moves: "y2 R U R' U R U2 R2 U' R U' R' U2 R", id: '52965bce-45fa-466c-ad2d-98243271f932' },
      { moves: "L U L' U L U2 L2 U' L U' L' U2 L", id: '7ebd1ce7-4528-4c12-99b9-74c8a39baada' },
      { moves: "R U R' U' R U' R' U2 R U' R' U2 R U' R' U' R U' R'", id: '395a6e41-3683-4144-90a6-0fd74f719bce' }
    ]
  },
  {
    name: 'ZBLL U 71',
    id: '22c8efe6-da0c-4edc-a8e1-993a7d67df7f',
    idMethod,
    puzzle,
    group: 'U6',
    setup: "R2' U R2' U R U' R' U R2' U2' R' U R' U R U' R'",
    algs: [
      { moves: "R U R' U' R U' R U2 R2 U' R U R' U' R2 U' R2", id: 'dde95adf-ad8c-4a88-a7e9-670fa71d9d10' },
      { moves: "x' R2 D2 R' U' R D2 R2 D R U R' D' x", id: 'b468f975-bf80-4a06-ae92-1b5c87521411' },
      { moves: "y2 R' U2 R U R' U R U2 R U2 R2 U' R2 U' R2 U2 R", id: '126b0e51-3d49-4546-a4fc-8de289585008' },
      { moves: "y2 R' U' R U R U' R' U' R' U R U' R U' R' U2 R U R'", id: 'd6a59241-168d-4f02-a384-376162afd2d5' }
    ]
  },
  {
    name: 'ZBLL U 72',
    id: '768f0e0f-3e23-4f11-8a39-2fd696c6bd49',
    idMethod,
    puzzle,
    group: 'U6',
    setup: "R' U' R U' R' U2' R U2' R U R' U R U2' R' y'",
    algs: [
      { moves: "y R U2 R' U' R U' R' L' U2 L U L' U L", id: '513aa1a3-53b5-4f11-bc2c-c454f8f6e96d' },
      { moves: "y R U2 R' U' R U' R' U2 R' U2 R U R' U R", id: 'd1fd6174-c324-48d9-bd62-153fab755858' },
      { moves: "y R' F' R U R' U' R' F D' R U R' D R2", id: '14eaa7e1-36bb-4254-885e-c137a07fff17' },
      { moves: "F R' F' r U R U' R' U R U' r' F R' F' R", id: '652eed02-d0a5-41b2-8dc0-d1bf4c990948' }
    ]
  }
]
