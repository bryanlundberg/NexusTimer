import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'ZBLL_L_ALGS'
const puzzle = '333'

export const ZBLL_L_ALGS: AlgorithmCollection[] = [
  {
    name: 'ZBLL L 1',
    id: '06d2c6d7-3b20-46b5-ab16-db972d74bfd1',
    idMethod,
    puzzle,
    group: 'L1',
    setup: "R U R' U R U2' R2' U2' R' D' R U2' R' D R2' y'",
    algs: [
      { moves: "y' R' U' R U' R' U2 R' D' R U2 R' D R U2 R", id: 'd3c6bd84-2ec6-4832-aa42-e88b772a2ef7' },
      { moves: "S R' U' R U f R2 f' U' R' U' R S'", id: 'ac12d58a-a9c0-435d-991a-6d225d40171b' },
      { moves: "y F' R U R' U' R' F R2 U' R' U' R U' R' U R U R'", id: '1156f556-b49f-4d0e-b8d3-38db46906a16' },
      { moves: "y r' F' r U' r' F2 r' U' r F2 r' U r F2 r", id: '86f21e25-bd01-482e-972b-0f379bc11c07' }
    ]
  },
  {
    name: 'ZBLL L 2',
    id: 'c86dc1c0-e361-44d4-a985-ca36ba89ee7e',
    idMethod,
    puzzle,
    group: 'L1',
    setup: "R' U R U R' U2' R U R D R' U2' R D' R' y'",
    algs: [
      { moves: "y R D R' U2 R D' R' U' R' U2 R U' R' U' R", id: 'e2532b71-0c53-4de4-9eb8-430575807dfc' },
      { moves: "y' L U' R' U L' U' R2 U2 R' U' R U' R'", id: 'c2493032-3aac-4f1c-91fa-55c63f4c5653' },
      { moves: "y2 L' U' L U' L' U2 L U R U' L' U R' U' L", id: 'f365b496-650b-47e3-bbd3-55a197cb55e8' },
      { moves: "U R2 D' R U2 R' D R U2 R U' R' U' R U' R' U2 R", id: '73b445fc-4412-4648-a84b-2b8b875dde64' }
    ]
  },
  {
    name: 'ZBLL L 3',
    id: '77a69cc2-4537-4b0c-91d4-987a0f1c72b5',
    idMethod,
    puzzle,
    group: 'L1',
    setup: "R' U' R2' D R' U' R D' R2' U2' R y",
    algs: [
      { moves: "y' R' U2 R U R2 D' R U R' D R2", id: 'ae4a2018-2e4a-46c6-a2ec-d7edfdded89a' },
      { moves: "y R D r' U2 r D' R' U2 R' U' R", id: '6870316f-3ca6-48ae-892b-df0c55599be1' },
      { moves: "R U2 R' U' R U' R' U' R2 D' R U2 R' D R U2 R", id: '8e88b7b6-36d0-407e-9544-163885cb6b99' },
      { moves: "y' R' U2 R2 D R' U R D' R2 U R", id: 'e53db58e-89d9-4683-8622-322e76085825' }
    ]
  },
  {
    name: 'ZBLL L 4',
    id: '0f81bb35-e71d-4792-8c24-4e1e206e2df4',
    idMethod,
    puzzle,
    group: 'L1',
    setup: "R2' D' r U2' r' D R U2' R",
    algs: [
      { moves: "R' U2 R' D' r U2 r' D R2", id: 'bb83ed6f-f5ff-4fd9-b1af-4d6e192bee58' },
      { moves: "y2 R U' R' F' U F R U R2 F R2 U R' U' F'", id: 'd1d923a9-505b-4625-9096-941aae59d7f1' },
      { moves: "R U R' U2 L U' R U L' U R'", id: '55dac9ba-6faf-49b1-9d57-b815ec5ec192' },
      { moves: "y2 R U R' U' z' y' R U R' F' R U R' U' R' F R2 U' R' U' F", id: '6585c597-88a5-4b43-829a-998daef9b4f2' }
    ]
  },
  {
    name: 'ZBLL L 5',
    id: '00a64fcb-742c-4992-810e-86f248d86a44',
    idMethod,
    puzzle,
    group: 'L1',
    setup: "R' U2' R2' D R' U2' R D' R2' U R U2' R' U2' R",
    algs: [
      { moves: "R' U2 R U2 R' U' R2 D R' U2 R D' R2 U2 R", id: '4441f892-2ec4-485a-88a6-725c3115b9f8' },
      { moves: "y2 F' r U R2 D R U R' D' R U2 r' F R", id: '678de68d-8d6f-4d9d-b1df-5a9f74eaf9f1' },
      { moves: "R U2 R2 U2 R D' R U2 R' D S R2 S'", id: '7dac5d14-03c6-4473-b25c-b0ce9d44849a' },
      { moves: "y' R' D' L U' D R' D R U R' D2 L' D R2", id: '1324e057-bd07-4721-8ee3-fc52c7c64d9d' }
    ]
  },
  {
    name: 'ZBLL L 6',
    id: '70fe5a0e-6bd7-4995-9c16-18a09243e28b',
    idMethod,
    puzzle,
    group: 'L1',
    setup: "R2' D' R U2' R' D R U2' R",
    algs: [
      { moves: "R' U2 R' D' R U2 R' D R2", id: 'c1ee8ccd-3520-4e19-a4d1-97cead00ec01' },
      { moves: "y2 z U' R2 U' L' U R2 U' L U2", id: '3103cb66-8c28-4441-a5d3-9a021656d1db' }
    ]
  },
  {
    name: 'ZBLL L 7',
    id: '5347e464-61d1-46e9-b85c-378f3844950c',
    idMethod,
    puzzle,
    group: 'L1',
    setup: "R' U R U R' U2' R y U2' R U' R' U2' R U' R'",
    algs: [
      { moves: "y' R' U' R U' R' U' R U2 R D r' U2 r D' R'", id: '3666e716-31a9-48f6-8a9d-967b63a1f058' },
      { moves: "R U R' U2 R U R' U2 F' U2 y' R U' R' U' R", id: '54890a13-1d19-4eb8-aa98-dd444b1e5085' },
      { moves: "R U R' U2 R U R' U D R' U2 R U' R' U' R D'", id: '1a6b5289-7e3e-4e8a-b5fd-8bb4641bff07' },
      { moves: "y' R' U' R U' R' U R2 D R' U R D' R2 U R U' R' U R", id: '016c0423-ebc3-4194-b0dd-d17e92364e4b' }
    ]
  },
  {
    name: 'ZBLL L 8',
    id: '42920312-5d7f-4449-b1bb-8696992b982e',
    idMethod,
    puzzle,
    group: 'L1',
    setup: "R U2' F U F' R' U F U2' F' R U2' R' y'",
    algs: [
      { moves: "y' F R U' R' U R U R2 D' R U R' D R2 U' R' F'", id: 'ae2dd1a0-7bdf-4564-afab-79eb05695145' },
      { moves: "y' F R U' R' U R2 D R' U R D' R2 U R U' R' F'", id: '38cb1571-4087-4cbb-8124-510792cf4d4e' },
      { moves: "y R U2 R U R U' R2 D R' U R D' R U R'", id: '8097dd00-34f5-4966-99ba-0486772498b3' },
      { moves: "y R U2 R' F U2 F' U' R F U' F' U2 R'", id: 'b1e1f1ef-a9a0-42b3-9681-d878fe579943' }
    ]
  },
  {
    name: 'ZBLL L 9',
    id: '3971e369-c49c-4f27-93d5-f9c6c0245760',
    idMethod,
    puzzle,
    group: 'L1',
    setup: "R U' R U D R' U R U2' R' U R D' R' U R'",
    algs: [
      { moves: "y' R' U' R2 D r' U2 r D' R2 U R U R' U2 R", id: '86e576d0-2dfa-4c2c-8313-b60a7cf572b2' },
      { moves: "R' U2 R' D' R' F2 R2 U2 R2 F2 R D R2", id: 'a327afe8-1760-4be1-bc36-e157de179142' },
      { moves: "R2 U' R' U' R2 U R U D' R U2 R' D R2", id: '150a84e0-1e3a-478e-b787-6abbc6a2ebf0' },
      { moves: "R U' R D R' U' R U2 R' U' R D' U' R' U R'", id: 'c350fd29-9054-425d-b2d1-f77ed9d2aca5' }
    ]
  },
  {
    name: 'ZBLL L 10',
    id: '41d9e167-d68b-4ef7-847d-3a29eb60758d',
    idMethod,
    puzzle,
    group: 'L1',
    setup: "R U L' U R' U' L U' R U R' U R U' R'",
    algs: [
      { moves: "R' U R U' R' U F' R U2 R' U2 R' F R2", id: '2f185e84-6711-4ec5-a9d7-7a0a4fbdae53' },
      { moves: "y' R' U2 R U R2 D' R U' R' r U2 r' D R2", id: 'b888f087-788d-446e-9760-b36af201bc49' },
      { moves: "R U R' U' R U' R' U L' U R U' L U' R'", id: '95d2e34e-fae3-4a6d-83e3-1f592e71e11d' },
      { moves: "y' L2 D' R' B2 R' D2 L' D R2 D2 L'", id: '59e2f965-ccfc-4e54-9da7-14eb8749ab63' }
    ]
  },
  {
    name: 'ZBLL L 11',
    id: '5a4b49f6-dc29-4059-b266-5a44fd968a14',
    idMethod,
    puzzle,
    group: 'L1',
    setup: "R' U R U' R' U' R U2' R D R' U' R D' R2' U' R",
    algs: [
      { moves: "R' U R2 D R' U R D' R' U2 R' U R U R' U' R", id: '203dc3a5-43d4-4086-a22b-630c7d844a90' },
      { moves: "R' U R U' R' U R U R' U' R U' R D R' U2 R D' R'", id: 'eefcad3d-0e64-4f91-be54-4ae8bdc3d534' },
      { moves: "y2 f U' R2 U' R' F R' F' U' R U' R' U' f'", id: '197d693c-f55d-45f7-ae2e-0c0247fd887d' },
      { moves: "y' R' U2 R F U' R' U R U F' R' U' R U R' U R", id: '243a260b-2374-4f09-b5a7-606837e8924d' }
    ]
  },
  {
    name: 'ZBLL L 12',
    id: '40fb2d73-d352-47d8-a75c-212dd4af5b73',
    idMethod,
    puzzle,
    group: 'L1',
    setup: "R U R' U2' F2' R U2' R' U2' R' F2' R2' U R' y",
    algs: [
      { moves: "y' F R U' R' U' R2 D R' U R D' R' U R' U' F'", id: '182f3074-5674-428a-820a-7fddf0853961' },
      { moves: "y' R U' R2 F2 R U2 R U2 R' F2 U2 R U' R'", id: '5cd91de1-1eea-4ce6-a396-98e37cad0a80' },
      { moves: "y2 F U R' U' R F' R' U' R U R' U' R U R' U R", id: 'b893a1d2-beff-446f-b9ea-5ad37a0d708c' },
      { moves: "y' F U R U' R' F' R B' R' U' R B R' f' L f", id: 'af956b5f-2716-4f1b-a4cd-98d0bc74f4aa' }
    ]
  },
  {
    name: 'ZBLL L 13',
    id: 'cc55a17a-12f8-4999-8a52-ee2c58c96a5b',
    idMethod,
    puzzle,
    group: 'L2',
    setup: "R2' B2' R' U2' R' U2' R B2' R' U R U' R' y2'",
    algs: [
      { moves: "R2 D' R U2 R' D R2 U R2 F' R U R U' R' F R", id: '814fad30-939b-4ea4-807f-9c7bb9f55d37' },
      { moves: "y2 R2 D r' U2 r R' U' R D' R' U' R'", id: '48a5aeb0-47dd-41ee-b139-51aae502ec49' },
      { moves: "R2 U R' U' R' U R' D U' R' U R D'", id: 'b1d94be7-bd4f-4255-b227-acaef4b11e58' },
      { moves: "R' F2 R U2 R U2 R' F2 R U' R' U R U2 R'", id: 'c6449ca2-b2e8-4244-b3e6-ab18bceb7a34' }
    ]
  },
  {
    name: 'ZBLL L 14',
    id: '13dfdc81-7234-4982-9917-88a85682b10a',
    idMethod,
    puzzle,
    group: 'L2',
    setup: "R' D' R U R' D R2' U' R' U R U R' U' R U R' y'",
    algs: [
      { moves: "y R U' R' U R U' R' U' R U R2 D' R U' R' D R", id: '5a2f1215-a309-4259-83b4-098d8ea97883' },
      { moves: "S' R U R' F' U f U' R' U' R' U R", id: '3b2d9854-9628-4bca-95a7-0f6b296f1c84' },
      { moves: "y R' D R2 U' R' U R U' R' U' R U R2 D' R", id: 'd75226f1-e84d-4d00-96c0-0852ea6e524f' },
      { moves: "y' R' D' R U2 R' D R2 U' R' U R U' R' U' R U R'", id: '90427f45-f163-4ce0-96c4-868d9dd76592' }
    ]
  },
  {
    name: 'ZBLL L 15',
    id: '8aff5dea-7d45-4fef-85d1-cf3732105930',
    idMethod,
    puzzle,
    group: 'L2',
    setup: "R U R' U R U R' U2' L R U' R' U L'",
    algs: [
      { moves: "L U' R U R' L' U2 R U' R' U' R U' R'", id: 'b21a8dc9-4c07-4aa5-93d5-9db803873555' },
      { moves: "R' U2 R F U' R' U2 R U F' U' R' U R", id: '234f44ee-0429-4b2c-b665-e6c71a4b3c35' },
      { moves: "y R2 U R U R D' R U' R' D U' R' U2 R'", id: 'a5e2d906-1760-432c-8465-28653d66d313' },
      {
        moves: "y R U R' U' R U R2 D' R U R' D R2 U R' U' R U R' U' R U' R'",
        id: '3ea3f3cc-5bdd-4309-8b98-3f2439dab7a6'
      }
    ]
  },
  {
    name: 'ZBLL L 16',
    id: 'a728de6a-0a2d-4213-aa1a-8eb7b6e8b480',
    idMethod,
    puzzle,
    group: 'L2',
    setup: "F R U R' U' R' F' U2' R U R U' R2' U2' R",
    algs: [
      { moves: "R' U2 R2 U R' U' R' U2 F R U R U' R' F'", id: '3330d22e-fd08-4a91-9913-a0dfdfbaa5f5' },
      { moves: "R' U' R' D' R U' R' U' D R' U' R2 U R U R2", id: '5b4b3317-45ed-48e9-9c2a-7106af419cdd' },
      { moves: "L U' R U L' U R U2 R U' R U R' U2 R2", id: '7287f395-6910-4a79-9b5c-3d92295d95d9' },
      { moves: "y2 M U' M' F R' F' R U R U' r' U M'", id: '0856e8a3-3f1f-44f8-8c13-36e395763502' }
    ]
  },
  {
    name: 'ZBLL L 17',
    id: '019c6aea-f7ea-48ba-b4f7-5468f422223a',
    idMethod,
    puzzle,
    group: 'L2',
    setup: "R L U2' L' U' R' U2' R' L U L' U' R2' U2' R' y",
    algs: [
      { moves: "R' U' R U' R' U R U' R' U R U' R2 D' R U2 R' D R2", id: '15abcdc6-23c0-4160-88a5-37459ebb8083' },
      { moves: "R' U2 R U R' U' F' R U R' U' R' F R2 U R' U R", id: 'c1be3ba2-5da7-4c1e-9cb1-7abdbda4ea50' },
      { moves: "R' F R U R' U' F' R' F R F' R' F R F' U R", id: '5ceec8ab-7b86-4238-922e-930a376758c9' },
      { moves: "y S R F R2 F' R U2 S U' R2 S2 U' R2", id: '4dd15142-4e78-4472-b9a6-fc0c133f4d53' }
    ]
  },
  {
    name: 'ZBLL L 18',
    id: '17d1e47c-d72c-4d8a-bc2e-b8f72a434110',
    idMethod,
    puzzle,
    group: 'L2',
    setup: "x' D R U' R' D' R U R' x",
    algs: [
      { moves: "y F R' F' r U R U' r'", id: 'acb8e6e8-2965-4c39-b082-a0709aed1a3c' },
      { moves: "x' R U' R' D R U R' D' x", id: '2fce9415-1312-4130-b475-19621b718031' },
      { moves: "y2 R2 D R' U R D' R' U' R'", id: '15fa1359-f846-4ad3-9b47-69e78b8e9f12' },
      { moves: "y2 x' U' R' D' R U R' D R x", id: 'a29fb2dd-5829-4403-9503-01fe3504b1ab' }
    ]
  },
  {
    name: 'ZBLL L 19',
    id: '3f76718b-baf1-4b91-bd55-73fbcf4352e8',
    idMethod,
    puzzle,
    group: 'L2',
    setup: "D' R2' U R' U' R' U R' D U2' R' U2' R y",
    algs: [
      { moves: "y' R' U2 R U2 D' R U' R U R U' R2 D", id: 'd6d9bde5-09fc-42b1-bfc4-1118526b0202' },
      { moves: "R U R' U R U R' U' R U R D R' U2 R D' R' U' R'", id: 'd73f7a42-bd2f-4b7d-883d-e2d547093d25' },
      { moves: "y2 x' r U r' D' F r U r' F' D r U2 L'", id: '1bc3a9a6-8e98-450f-be6b-8c898fb12655' },
      { moves: "R U R' B' U R U R' U' f D R2 D' z'", id: 'c327069f-3ea4-4535-af9e-fbffc168f30d' }
    ]
  },
  {
    name: 'ZBLL L 20',
    id: '65a04959-de4e-4235-bdf7-5e72e0a04c47',
    idMethod,
    puzzle,
    group: 'L2',
    setup: "R F U R' U' R U' R' U' R U F' R'",
    algs: [
      { moves: "L R U' R' U L' R U R' U R U' R'", id: 'f2830e9d-0547-4e2d-a0c1-18a9efd68bb2' },
      { moves: "R F U' R' U R U R' U R U' F' R'", id: '325f00bb-a4c0-4698-8929-ba7d7ce358e5' },
      { moves: "L R U' R' U R L' U R' U R U' R'", id: '80513d73-eb03-49c2-b41b-3a3dafbe3792' },
      { moves: "y R' U R S' R' U' R f R' F' R U R U' R'", id: '00239762-44d1-4fcf-800a-133b46187ae9' }
    ]
  },
  {
    name: 'ZBLL L 21',
    id: '992ee6fb-8f3c-444f-8224-96d8c42e96b1',
    idMethod,
    puzzle,
    group: 'L2',
    setup: "R U' R' U' R U R D R' U2' R D' R' U' R' y'",
    algs: [
      { moves: "y R U R D R' U2 R D' R' U' R' U R U R'", id: '065511fc-02d3-47c4-88cb-db611e1c88c1' },
      { moves: "y S U2 R' U2 R U2 F R f'", id: '504b5404-c844-49e4-9882-571ce44a174d' },
      { moves: "y' U M' U2 y R' U2 R U2 F l U' z'", id: '4adf3f4e-dffa-40ac-add3-ccfefdefb27b' }
    ]
  },
  {
    name: 'ZBLL L 22',
    id: '8d4bfe5f-a7e0-4b10-81ab-4e896df0b150',
    idMethod,
    puzzle,
    group: 'L2',
    setup: "x M U R' U' L U R U R' U' R U' R'",
    algs: [
      { moves: "R U R' U R U' R' U' L' U R U' R' L", id: 'd061e310-e23b-4909-8378-f987869d198c' },
      { moves: "y R U' R' U' R' D' r U2 r' D R U' R U R'", id: 'ab0a5689-565f-48ee-b233-330f2e090e0e' },
      { moves: "R' U' R U' R D R' U2 R D' R2 U R U' R' U R", id: '5ccecbe8-c40a-4973-93d3-b073872eb40e' },
      { moves: "R U R' U R U' R' U' L' U R U' M' x'", id: '983a1c91-0edb-405e-9e06-c6ada7ace4a0' }
    ]
  },
  {
    name: 'ZBLL L 23',
    id: '6b9dc189-b688-4a05-a652-b2102b214dbc',
    idMethod,
    puzzle,
    group: 'L2',
    setup: "R U2' R' U2' R' F R U R U' R' F' y'",
    algs: [
      { moves: "y F R U R' U' R' F' R U2 R U2 R'", id: 'fd913d6a-da7a-4e54-b3f7-7cc67c5af3cf' },
      { moves: "y' x' M' U L' U2 R U2 L U' L' U' R' U R", id: 'fbe80d84-c6c4-403f-8f04-8df0f6d6db28' },
      { moves: "y F R' F' r U2 R' U' R2 U' r' U R' U R", id: 'ef87afef-2e25-4270-b628-ff208c9bddbb' },
      { moves: "R U' R' U2 R U' R' F' U F U2 F' U F", id: '57d06b61-4e95-479d-b7d0-0ce96311482c' }
    ]
  },
  {
    name: 'ZBLL L 24',
    id: 'a1c71a39-e8c1-4fb5-94b7-699db381a18b',
    idMethod,
    puzzle,
    group: 'L2',
    setup: "F' U' r' F2' r U' r' F' r F",
    algs: [
      { moves: "y2 R U R' F' U' r' F2 r U F", id: '77cec7b2-8a92-4bd8-a855-7bade526ae9d' },
      { moves: "y' R' F' R U R' U' R' F R U' R U R' U R", id: '5f15cb95-c423-4da1-8fa9-0bd02d07f856' },
      { moves: "U2 R U R' U' R' F R F' l' U2 L U L' U l", id: '553d124f-8306-4908-9ccd-315af286f204' },
      { moves: "F' r' F r U r' F2 r U F", id: '015a3e92-629d-4f38-94ac-b75b32b1d07a' }
    ]
  },
  {
    name: 'ZBLL L 25',
    id: 'b98a4bc9-8e01-4ab3-a25c-321b03f4f50d',
    idMethod,
    puzzle,
    group: 'L3',
    setup: "R2' F2' R U2' R U2' R' F2' R U' R' U R y",
    algs: [
      { moves: "y' R2 D' r U2 r' R U R' D R U R", id: '29047ee1-f008-407b-8b85-4fb57966b37f' },
      { moves: "y' r U2 r' U2 r' F2 r F2 L' U L U' L' U2 L", id: '1849ac8c-1251-4167-ae6e-69cbfc8dd909' },
      { moves: "y' R2 D' r U2 M U R' D R U R", id: '2c5f4edb-8c95-404f-8813-b804659df3b6' },
      { moves: "y' R' U' R U R' F2 R U2 R' U2 R' F2 R2", id: '17a1bb45-30c6-4b00-8d74-d9ddc59ab996' }
    ]
  },
  {
    name: 'ZBLL L 26',
    id: 'db5e982d-49f2-402b-abd3-cb31c189d751',
    idMethod,
    puzzle,
    group: 'L3',
    setup: "L' U' L U' L' U' L U2' R' L' U L U' R y",
    algs: [
      { moves: "y' R' U R U2 R' L' U R U L U r' F r", id: 'ee58a20a-7dd1-4149-a9b9-2f2b51a63f0a' },
      { moves: "y' S R B' U' R2 U B U' R2 U R' S'", id: 'b5383c83-609a-488f-ad95-f9e11c561db8' },
      { moves: "y L' U R' U' L R U2 R' U R U R' U R", id: 'e8ce12a9-508b-499f-9738-9c4faa3f1845' },
      { moves: "R' F' R U2 R U2 R' F R' U' R2 U' R2 U2 R", id: 'dffe85dd-925c-4bbd-a25c-a4fb57a14531' }
    ]
  },
  {
    name: 'ZBLL L 27',
    id: 'bfc765fc-97dd-4b9c-bbe7-8a8ac5f089ed',
    idMethod,
    puzzle,
    group: 'L3',
    setup: "R D R' U' R D' R2' U R U' R' U' R U R' U' R",
    algs: [
      { moves: "R' D R' U R D' R' U R2 U' R2 U' R2", id: 'e5163c17-9464-4bd0-a84d-70901946ae10' },
      { moves: "y R U R' U R' D' r U2 r' D R2 U' R' U R U' R'", id: 'a7e1c5b5-d529-4bf1-8b7d-4ca277cfae0e' },
      { moves: "y S' R' U' R f R' F' U R U R U' R'", id: '7c509e2f-b009-45ce-8744-2004693f1810' },
      { moves: "R D' R2 U R U' R' U R U R' U' R2 D R'", id: '860b59d4-203e-4d35-9c67-928a427372a7' }
    ]
  },
  {
    name: 'ZBLL L 28',
    id: 'f1e77d0f-d084-48ab-8ba6-5c2bf35306b5',
    idMethod,
    puzzle,
    group: 'L3',
    setup: "R' U2' R2' U R' U' R' U2' F' R U2' R U2' R' F y2'",
    algs: [
      { moves: "y2 F' R U2 R' U2 R' F U2 R U R U' R2 U2 R", id: 'a2bc99bf-58f4-41eb-b194-bcfaf6c35042' },
      { moves: "y M U M' F' L F L' U' L' U l U' M'", id: '5a392142-e7b3-49ed-8cd3-5c9dcf3c2dd3' },
      { moves: "y R' D U R' U2 R U' R' U' R D' R U R' U2 R", id: '7f51a396-1844-4e15-af1c-4bd203cc555f' },
      { moves: "y2 F R U2 R' F' S R' F R S' U2 R' F' R", id: '2c055ba1-5e0c-4ba5-9d2b-fa31b794fe6f' }
    ]
  },
  {
    name: 'ZBLL L 29',
    id: '0bf48e7c-b750-4783-82a1-bd977fe74576',
    idMethod,
    puzzle,
    group: 'L3',
    setup: "R' F' r U R U' r' F y2'",
    algs: [
      { moves: "y2 F' r U R' U' r' F R", id: '6f014186-c5ad-463b-8c3c-173bd8d6e160' },
      { moves: "y' R2 D' R U' R' D R U R", id: '37f4c1c3-732c-4d5a-8961-c1f51e12b45c' },
      { moves: "x' U' R U L' U' R' U r", id: '15671d6c-dc37-4c00-a9aa-dbd484401142' },
      { moves: "r U R U' L' U R' U' x'", id: '7fbd264a-6b56-4766-bf66-e6dbdd4e8b84' }
    ]
  },
  {
    name: 'ZBLL L 30',
    id: '3ef11979-31c4-43a0-bf25-caee9f9597ea',
    idMethod,
    puzzle,
    group: 'L3',
    setup: "R U2' R' U2' R U' R' U L' U R U' L U' R' y",
    algs: [
      { moves: "y R U R' U R U' R' U R U' R' U R2 D R' U2 R D' R2", id: 'df7fa4d4-c9b5-4ca2-a636-011cdf9c4411' },
      { moves: "F R' F' R U R U' R' F U R U' R' U R U' R' F'", id: 'ee77a1cc-e2e3-4dc5-8fcf-579c5a832633' },
      { moves: "y' R U r' F R' F' r U' R U R' U2 R U2 R'", id: '45d98b8a-935a-43f0-b33f-e4d9e1cce140' },
      { moves: "y' R U L' U R' U' L U' R U R' U2 R U2 R'", id: 'b729d253-30dc-4781-a26d-df41bda95351' }
    ]
  },
  {
    name: 'ZBLL L 31',
    id: 'cd894afe-7e9a-4118-b28f-3502bdbc3387',
    idMethod,
    puzzle,
    group: 'L3',
    setup: "R' U' R U R' U L' R U R' U' L R y'",
    algs: [
      { moves: "y' R' F R U R U' R' F' U R U R' U R U' R'", id: '2e9ef420-d55e-433b-9a4e-2343b3b32488' },
      { moves: "y R' L' U R U' L R' U' R U' R' U R", id: '912f530e-3297-4ae6-b9fd-79c0a33f50bd' },
      { moves: "y R' L' U R U' R' L U' R U' R' U R", id: '7b56699d-086f-447a-8fad-b58fc7f33250' }
    ]
  },
  {
    name: 'ZBLL L 32',
    id: '4d74511e-6426-4604-8d0a-c025321dd059',
    idMethod,
    puzzle,
    group: 'L3',
    setup: "R' U2' R F U' R' U R U F' R' U R y'",
    algs: [
      { moves: "y R' U' R U2 R' F' R U R' U' R' F R2 U R' U2 R", id: '628d0ac2-b3b1-4d37-b257-9abcf1c6097e' },
      { moves: "y R' U' R F U' R' U' R U F' R' U2 R", id: '8687987d-f986-4631-8e6b-2f7f8a60d25a' },
      { moves: "y2 R U2 R' U2 D R' U R' U' R' U R2 D'", id: 'f1cd5100-d7bb-4c46-815b-87431bb2d0f2' },
      { moves: "y2 D' R U2 R' U2 D R' U R' U' R' U R2", id: '44f03360-d8ad-4020-9812-e4295e26a16a' }
    ]
  },
  {
    name: 'ZBLL L 33',
    id: 'cf77ccde-4b5c-48ac-b2a5-87156db3529b',
    idMethod,
    puzzle,
    group: 'L3',
    setup: "R U R' U' R' F' R U2' R U2' R' F y2'",
    algs: [
      { moves: "y2 F' R U2 R' U2 R' F R U R U' R'", id: '60fadaaa-1129-404d-a92a-8d666d106afd' },
      { moves: "y2 F' L' U' L U L F L' U2 L' U2 L", id: '43f40683-f31b-4ef9-852c-48384f53e987' },
      { moves: "y2 F' r U R' U' r' F U R' U' R' U' R3 U R U R2", id: '1e39b039-3360-4aee-a04b-4a5695b4bba0' },
      { moves: "y2 R U2 R' U' R U R D R' U' R D' R' U' R'", id: '18f7f46d-a66a-4124-a5c1-362794cca8b6' }
    ]
  },
  {
    name: 'ZBLL L 34',
    id: '799e0651-ed10-431d-9096-2e6c6f2be060',
    idMethod,
    puzzle,
    group: 'L3',
    setup: "R U R' U' R U R2' D' R U2' R' D R U' R U' R' y'",
    algs: [
      { moves: "y R U R' U R' D' R U2 R' D R2 U' R' U R U' R'", id: '23b5f3ad-6a8b-4c55-99de-4aad712aa0f0' },
      { moves: "y R' U' R U' R' U R F R' U R U' F'", id: '0264b902-471d-455a-b8c7-b93112070c98' },
      { moves: "y R' U' R U' R' U R U L U' R' U M x", id: '3e599624-48a6-4d2e-a716-fce724704551' },
      { moves: "y' L' U' L U' L' U L U R U' L' U M' x'", id: '49bd3b63-6f57-42eb-8d50-67d75d7dd9eb' }
    ]
  },
  {
    name: 'ZBLL L 35',
    id: '899b41b5-efef-4a58-9a14-fc362efbdb53',
    idMethod,
    puzzle,
    group: 'L3',
    setup: "R' U R U R' U' R' D' R U2' R' D R U R",
    algs: [
      { moves: "R' U' R' D' R U2 R' D R U R U' R' U' R", id: '510f7454-5805-48c6-9320-51140de32d43' },
      { moves: "y2 F B' R2 U R2 U' R2 F' U' B", id: 'd5620945-d7fe-444e-a231-6b574cbf0e67' },
      { moves: "y2 S' R U2 R' S U2 F' U' F", id: '7f9560d0-1434-43aa-9ff2-be385ea47549' },
      { moves: "S U2 R U2 R' U2 f' U' F", id: '68bd6d6b-44d6-4ddd-adc7-2f6361d48721' }
    ]
  },
  {
    name: 'ZBLL L 36',
    id: '688f5db7-0460-4168-a86f-c66d17ba2958',
    idMethod,
    puzzle,
    group: 'L3',
    setup: "F U R U2' R' U R U R' F' y",
    algs: [
      { moves: "y' F R U' R' U' R U2 R' U' F'", id: '744472be-d4c0-4463-a048-c93c22780bc1' },
      { moves: "y L' U' L F U R U2 R' U' F'", id: '6233bd07-8094-4e62-9052-e81ca5b21a28' },
      { moves: "y' R' U' R F U' R' U2 R U F'", id: '712bb916-ffdf-454e-a667-052397f1aa01' },
      { moves: "y L' U' L U R U2 R' F2 L F2 L'", id: 'deb7bd25-4645-4e56-9c2a-7d8ac2f9e3c8' }
    ]
  },
  {
    name: 'ZBLL L 37',
    id: 'dc3b0768-6f48-4b0d-b5c5-2b7fae63b3f9',
    idMethod,
    puzzle,
    group: 'L4',
    setup: "R U2' R D R' U2' R D' R' U2' R' U' R U' R' y2'",
    algs: [
      { moves: "y2 R U R' U R U2 R D R' U2 R D' R' U2 R'", id: '60e4cfbe-33f7-47d5-b3ce-5b85e2b7768b' },
      { moves: "R2 D R' U2 R D' R' U2 R2 U2 R U R' U R", id: '05c989ee-1554-4612-8438-294010ee09ff' },
      { moves: "U S R U R' U' F' U2 F U R U R' S'", id: '2d5c0d9f-e9d3-45e5-824a-ff298edd7231' },
      { moves: "x' M' U L' U L U2 L' U' L U' R U L'", id: '627af71e-b230-4a81-818a-841bcd4035d9' }
    ]
  },
  {
    name: 'ZBLL L 38',
    id: 'e2c665b6-03ef-44b9-89ad-83a24fde3bfa',
    idMethod,
    puzzle,
    group: 'L4',
    setup: "R2' D R' U R D' R2' U R U2' R' y2'",
    algs: [
      { moves: "y2 R U2 R' U' R2 D R' U' R D' R2", id: '104c33e3-3007-4140-b4be-4b53f34ad639' },
      { moves: "U2 R U2 R2 D' R U' R' D R2 U' R'", id: 'ce783514-c343-431c-9a48-e7f720253c84' },
      { moves: "y2 F R U R' U' R' F' R U R U R' U' R U' R'", id: '13b9cb95-de96-422d-beb2-6ce1ce942f54' },
      { moves: "y2 R U R' U' R U R2 D' R U R' D R2 U' R'", id: '709dd142-eee3-4ac2-a962-5e20b5237d37' }
    ]
  },
  {
    name: 'ZBLL L 39',
    id: 'b0fac269-c59a-4645-8769-8426b2d000ff',
    idMethod,
    puzzle,
    group: 'L4',
    setup: "R U' R' U' R U2' R' U' R' D' R U2' R' D R",
    algs: [
      { moves: "R' D' R U2 R' D R U R U2 R' U R U R'", id: 'ea346e18-3a8c-461e-afe7-21907cf523f3' },
      { moves: "y2 L' U R U' L U R2 U2 R U R' U R", id: 'b045cf2d-16d8-4a46-b026-1ee609ac477e' },
      { moves: "f R U R2 U' S' R' F' U F R F'", id: 'b2abd818-7b84-4f3a-8d10-8b82cce62b39' },
      { moves: "y' R U' R' F2 U2 F2 D R' U R U' R D'", id: 'e713b135-95df-4b76-8a21-726c746e50bb' }
    ]
  },
  {
    name: 'ZBLL L 40',
    id: '0969f3be-373b-4409-90a2-276f5d9ed01f',
    idMethod,
    puzzle,
    group: 'L4',
    setup: "R2' D r' U2' r D' R' U2' R' y'",
    algs: [
      { moves: "R' F' R U R' U' R' F R2 U' R' U2 R", id: '42b58bd3-1ae3-42fe-a538-2f0a8b38b32c' },
      { moves: "y R U2 R D r' U2 r D' R2", id: 'a170e293-2d16-4929-8c86-32802c93bf7a' },
      { moves: "y2 R' U M' U' R U' R' U' R U2 r' F R' F' R U' R", id: 'f7645fef-dec2-4924-a64f-22703a92546b' }
    ]
  },
  {
    name: 'ZBLL L 41',
    id: '71e39a3f-3106-4622-8abd-e0c164809a63',
    idMethod,
    puzzle,
    group: 'L4',
    setup: "R2' D R' U2' R D' R' U2' R' y'",
    algs: [
      { moves: "y R U2 R D R' U2 R D' R2", id: 'bb4df9c0-ee19-4770-be3b-4dda34ac973d' },
      { moves: "y' L U2 L D L' U2 L D' L2", id: 'a1b03c97-a258-4a9c-ab3b-50135f729e7c' },
      { moves: "F' r U' L D2 L' U L D2 r2 D", id: '76f5740c-9034-44a1-8568-5491b48009db' }
    ]
  },
  {
    name: 'ZBLL L 42',
    id: '2cd39618-6142-4d08-a3ba-03a6b7e372bd',
    idMethod,
    puzzle,
    group: 'L4',
    setup: "R U2' R2' D' R U2' R' D R2' U' R' U2' R U2' R' y'",
    algs: [
      { moves: "y R U2 R' U2 R U R2 D' R U2 R' D R2 U2 R'", id: 'f5eb6452-ef38-4cdb-a4e1-6e9116b3df76' },
      { moves: "y2 l x' U L' U' z' R U L' U' R' U L2 z L U' l2", id: '24052269-c3b7-41fa-bfa3-d255dba61285' },
      { moves: "y F R' F' r U' R' D' R U' R' D R U' R U' r'", id: '480dda3d-6533-4378-969e-2624f257f6b5' },
      { moves: "y2 S' r U2 R2 U' R2 U' r' S U2 f R f'", id: 'eaaae1a2-b65b-4c19-90ff-0fdb240dc825' }
    ]
  },
  {
    name: 'ZBLL L 43',
    id: '65c04887-7474-4b21-aa70-deb325dacf15',
    idMethod,
    puzzle,
    group: 'L4',
    setup: "R' U' R U R U R' U' R' U F R U R U' R' F' y2'",
    algs: [
      { moves: "y2 F R U R' U' R' F' U' R U R U' R' U' R' U R", id: '38a52a15-9efc-48b9-b63e-f39cbe4a9c42' },
      { moves: "R' U2 R' U' R' U R2 D' R U' R' D R' U' R", id: '7a405ec5-abaa-45a6-9079-4229e4d8945c' },
      { moves: "y2 R U R' U2 R U R2 D' r U2 r' D R2 U' R'", id: 'c2143990-1442-4901-ac29-212b9e220016' },
      { moves: "y R u2 R' F' R u2 R2 F' R U2 R' F R", id: '06978ea2-ed4b-4325-b229-cb9b13462a28' }
    ]
  },
  {
    name: 'ZBLL L 44',
    id: '5aa45c94-da8a-4eb0-a193-b7b774749d07',
    idMethod,
    puzzle,
    group: 'L4',
    setup: "R U2' R2' U' R F' U' R' U2' R U F R U' R' y",
    algs: [
      { moves: "y2 R U R' U R U R' U2 R' D' r U2 r' D R", id: 'd75fa9fe-7280-49f1-8deb-bd5d27afc598' },
      { moves: "y2 R U R' U R U' R2 D' R U' R' D R2 U' R' U R U' R'", id: '5d419761-aab2-40cf-a173-ac00b0f48c58' },
      { moves: "y R' U' R U2 R' U' R D' U' R U2 R' U R U R' D", id: 'bef00c95-83dc-47c3-bf02-fa4b993ac055' },
      { moves: "y R u R' U R U' R u' R2 U R f R' f'", id: '8d89c843-a353-4d40-92cd-e26892e0e8f1' }
    ]
  },
  {
    name: 'ZBLL L 45',
    id: '7a87478e-0c28-4ce9-8d67-7dd58e9e8f73',
    idMethod,
    puzzle,
    group: 'L4',
    setup: "R U' R' U R U R' U2' R' D' R U R' D R2' U R' y'",
    algs: [
      { moves: "y R U' R2 D' R U' R' D R U2 R U' R' U' R U R'", id: '7f8a67b5-7891-48ff-8ea5-6c8f66457197' },
      { moves: "y2 S R' U' F R' F' R2 U F R F' U2 S'", id: 'af82add9-2ce7-47dc-adaa-fbc2601fbe28' },
      { moves: "y L U' R U L' U' R' U R U' R' U R U' R' U' R U R'", id: 'b9be1c94-df5f-4532-a2e4-a21d9e469180' },
      { moves: "L U D' L U2 L' U2 D L2 U2 L U L2 U L", id: '05d6b57f-3772-4e3c-92d6-c0fdf3ec0e38' }
    ]
  },
  {
    name: 'ZBLL L 46',
    id: '963d276d-9521-48ee-8981-e059cece3517',
    idMethod,
    puzzle,
    group: 'L4',
    setup: "R' U' L U' R U L' U R' U' R U' R' U R y'",
    algs: [
      { moves: "y2 R' F' R U2 R U2 R' F U' R U R' U' R U' R'", id: '1aa8e713-ee2b-4485-9962-3ab89ee716ca' },
      { moves: "y R' U' R U R' U R U2 F R' U R U' F' U R' U R", id: 'c829160c-a414-4df4-960e-415e2dcc43ef' },
      { moves: "R2 D' R2 U R' D R2 U' D r2 D2 r2 D' R'", id: '7c46efc7-8d28-4ec6-bc8d-94fd66dde286' },
      { moves: "y R' U' R U R' U R U' L U' R' U L' U R", id: 'c458c7ef-507c-415a-8712-d025e13b6c6d' }
    ]
  },
  {
    name: 'ZBLL L 47',
    id: '77e8d3e2-40b4-412b-a38b-fadb103d0833',
    idMethod,
    puzzle,
    group: 'L4',
    setup: "R' U R' D' U' R U' R' U2' R U' R' D R U' R y'",
    algs: [
      { moves: "y R' U R U2 R' U' R U2 R' U' R U' R2 D' R U R' D R2", id: '85c8a209-0139-4235-9344-87bc421301b9' },
      { moves: "y R' U R' D' R U R' U2 R U R' U D R U' R", id: '33830af7-6250-4a21-baf3-11c6706f1f5f' },
      { moves: "y2 R U R2 D' r U2 r' D R2 U' R' U' R U2 R'", id: '755f2eb7-cf5c-4c41-bce0-333c1ae250ec' },
      { moves: "F2 U' F R2 u R' U R U' R u' R2 F", id: '0f8410f9-2549-44d3-9601-ef13a897ec0d' }
    ]
  },
  {
    name: 'ZBLL L 48',
    id: 'b6f64fef-6bce-4706-8e28-89ae16fbeb62',
    idMethod,
    puzzle,
    group: 'L4',
    setup: "L' U' L U2' F2' L' U2' L U2' L F2' L2' U' L",
    algs: [
      { moves: "y' R' F' R U R' U' R' F D' R U' R' D R2 U R' U R", id: '4935a073-a02b-4d74-9315-24d8987ab835' },
      { moves: "y' F U' R U R' U R' U2 R U R' U R2 U' R' U F'", id: '76cb809a-c364-4f0d-89ed-0e020c5582b0' },
      { moves: "y2 L' R U R' U' L U R U R' U' R U R' U' R U' R'", id: 'cb42a7b3-bff8-4a9d-bf4d-28cd4593f2eb' },
      { moves: "y2 M F R' F' r U R U R' U' R U R' U' R U' R'", id: '96741fe2-b752-4206-8cec-0ef6bc71a2a0' }
    ]
  },
  {
    name: 'ZBLL L 49',
    id: '5a591680-754e-458c-bba5-401141b6a026',
    idMethod,
    puzzle,
    group: 'L5',
    setup: "r U2' R r2' F R' F' r2' U2' r' y'",
    algs: [
      { moves: "y r U2 r2 F R F' r2 R' U2 r'", id: '104f9500-dc6d-427f-baad-b1e62951cda0' },
      { moves: "y2 R' F2 R2 U' r' F R' M' F2 R", id: '7ff7ae21-3526-4b9b-a5d0-fffe48121d4d' },
      { moves: "y r U2 r2 F R F' R' r2 U2 r'", id: 'f8b2b733-13f3-49ab-977a-8db8c84bcfa1' },
      { moves: "y2 R' F2 R2 U' L' U R2 r U2 R x'", id: 'ed1e1732-c82a-44b6-a27e-a2730854f375' }
    ]
  },
  {
    name: 'ZBLL L 50',
    id: '92d6ff49-6985-4556-af57-31177faeb71e',
    idMethod,
    puzzle,
    group: 'L5',
    setup: "L' U' L U' x M U' R' U2' L U R U2' R'",
    algs: [
      { moves: "y R U' R' U R U' R' U' R U R' U2 R' D' R U R' D R", id: '63d97c70-7cbe-4970-9cf6-9960335c0ad6' },
      { moves: "R U2 R' U' L' U2 R U M' x' U L' U L", id: '4f37e7c0-798e-4cbc-a6fb-0efb1f261513' },
      { moves: "U2 R U R' U R U' R' F2 R U2 R' U2 R' F2 R2 U' R' U2", id: '251c7567-97a7-4e89-bb77-9046c056556a' },
      { moves: "y F R U R' M' S R' F R f' R U' r' F'", id: '05023345-4f48-4027-ad94-1689141dfc38' }
    ]
  },
  {
    name: 'ZBLL L 51',
    id: '8640c1e1-8aa9-4133-8a17-d31e39701ef6',
    idMethod,
    puzzle,
    group: 'L5',
    setup: "R U R' U x M U L U2' R' U' L' U2' L y",
    algs: [
      { moves: "R' U R U' R' U R U R' U' R U2 R D R' U' R D' R'", id: '2a7aa569-718e-4d16-8dec-26ece69b29ea' },
      { moves: "R' D' R U' R' D R U2 R U' R' U R U R' U' R U R'", id: '89652180-7a0c-43fb-9b70-b0c830d7d478' },
      { moves: "y' L' U2 L U R U2 L' U' M' x' U' R U' R'", id: 'dc548c5c-e7cb-4f89-9485-0f268441410e' },
      { moves: "y' R U R2 F2 R U2 R U2 R' F2 R U R' U' R U' R'", id: 'cf0c3f1d-f141-498f-a158-7818e3be19df' }
    ]
  },
  {
    name: 'ZBLL L 52',
    id: '73834699-c8eb-4be6-b43a-4e0fa614ebd6',
    idMethod,
    puzzle,
    group: 'L5',
    setup: "r U2' r2' F R F' r2' R' U2' r'",
    algs: [
      { moves: "r U2 R r2 F R' F' r2 U2 r'", id: '92b6657f-d42b-490d-a262-af90be559433' },
      { moves: "r U2 r2 R F R' F' r2 U2 r'", id: '7146bcbf-ee57-441e-9ff4-4e37d4b693bb' },
      { moves: "y2 R' U2 R U R2 F R F' R' F R F' R' F R F' U R", id: 'bf468396-1d73-420e-a12a-ee6532786eb1' },
      { moves: "y' R' F2 R2 r' F' r U R2 F2 R", id: 'c4963f09-22e3-46fd-8e14-1d68629035ec' }
    ]
  },
  {
    name: 'ZBLL L 53',
    id: 'c1e597da-1a24-4672-9780-a725f8cccb20',
    idMethod,
    puzzle,
    group: 'L5',
    setup: "F R U R' U' F' r U r' U R U' M' U' r'",
    algs: [
      { moves: "y2 F' r U R' U R' D R U' R' D' R U' r' F R", id: '1d139570-d444-4895-a260-304fdb717488' },
      { moves: "y R U2 R2 F R F2 r' U' F2 U r F", id: '794550d9-7308-4ac7-baae-9300d813be34' },
      { moves: "r U r' R U R' U' r U' r' F U R U' R' F'", id: '64dbeba9-f49e-4e0f-abd7-79742e15aae0' },
      { moves: "y R U2 R2 x U R U2 r' B' U2 B r U x'", id: '27f3db14-a98b-404f-b084-62b02fe6ff1d' }
    ]
  },
  {
    name: 'ZBLL L 54',
    id: '53e152d6-235d-4d78-b59a-2ae819360f7b',
    idMethod,
    puzzle,
    group: 'L5',
    setup: "r U M U R' U' r U' r' F U R U' R' F' y'",
    algs: [
      { moves: "r U R2 D' R U2 R' D R U r' F R F'", id: '096edd78-800c-4634-bb61-e1ffb9be7994' },
      { moves: "y F R U R' U' F' r U r' U R U' R' r U' r'", id: 'a1b97dde-c31a-4576-8852-bd4d362d3c7c' },
      { moves: "y L' U R2 D' R' U2 R D R' U L U R'", id: '21682964-5e79-403b-872d-8b4b8d0dfcbb' },
      { moves: "y' Lw' U' Lw L' U' L U Lw' U Lw F' U' L' U L F", id: 'e004dd74-697f-4b5a-bc21-c782af8f5a4e' }
    ]
  },
  {
    name: 'ZBLL L 55',
    id: 'c282a53a-7de0-46f1-91f1-53a79ca365a8',
    idMethod,
    puzzle,
    group: 'L5',
    setup: "F2' R U' R' U R U R2' F' R U R U' R' F' y",
    algs: [
      { moves: "y2 x' r2 U' r U2 R' F R U2 r2 F L'", id: '41d33e2e-2067-4889-8389-96ef5e6dcd7e' },
      { moves: "y R' U R U' R' U' R U' R' U2 R' D' R U' R' D R2", id: 'b0ec94c4-cfe3-474f-9e5d-b21750e43dac' },
      { moves: "R D R' U R D' R2 U' R U R' U R U R' U' R", id: 'cef57003-7ad0-4d7e-b7eb-3f718b58bcf9' },
      { moves: "y R U2 R' U' F' R U R' U R U2 R' F R U' R'", id: 'e4ce1740-03dc-457b-8f66-f6d371370417' }
    ]
  },
  {
    name: 'ZBLL L 56',
    id: '9f67a1c3-bd62-4b59-8f4f-216b2c2ce4c8',
    idMethod,
    puzzle,
    group: 'L5',
    setup: "R' U' F R U' R' U R U R2' F' R U R U' R' U R y",
    algs: [
      { moves: "y2 B' R U R' U' R' F R2 U' R' U' R U R' S z'", id: '242b62e0-091d-4547-aaec-9d6f4a38d1b9' },
      { moves: "y M' U' r U2 R' F R U2 r2 F R", id: 'da3a52f5-85d5-4193-9fde-c53b47c0ef22' },
      { moves: "R U' R' U R U R' U R U' R2 D' R U R' D R", id: 'd93feb84-8af8-4c4f-a535-08b24e2ccd17' },
      { moves: "y R' F' r2 U2 R' F' R U2 r' U M", id: '6f99ca94-792c-4aee-9b06-2edc69a6a555' }
    ]
  },
  {
    name: 'ZBLL L 57',
    id: 'bf6015ac-01d5-4c9d-acb0-f7844212f80d',
    idMethod,
    puzzle,
    group: 'L5',
    setup: "R2' F' R U R U' R' F R U' R' U R y",
    algs: [
      { moves: "y' R' U' R U R' F' R U R' U' R' F R2", id: 'bc67dd65-0fdd-48e0-994a-fecdec9b8c83' },
      { moves: "y r U2 R2 F R F' R U2 r'", id: '176efcae-06e5-4b52-8865-d7e477f00619' },
      { moves: "R U2 L' U R' U' L R U2 R'", id: 'a6fe766d-3baf-4744-95d2-02b4b808bdeb' },
      { moves: "y2 B' R U R' F' R U R' U' R' F R2 U' R' U' B", id: '03ca1ea9-675e-49ee-8c1e-3cf9794bdd6b' }
    ]
  },
  {
    name: 'ZBLL L 58',
    id: 'e71b8947-76ec-438c-b72e-b268e5607b1f',
    idMethod,
    puzzle,
    group: 'L5',
    setup: "F U R U2' R' U2' R U R' U R U' R' F'",
    algs: [
      { moves: "y F R U R2 F R F' R U' R' F'", id: 'd031bedb-dd6c-404d-be56-a2d4046a3839' },
      { moves: "F R U R' U' R2 x' U' R' U R' D' x", id: '248f8961-8704-4b27-9433-a0d5bc06494b' },
      { moves: "F R U R' U' R U' R' U2 R U2 R' U' F'", id: '2752deb5-7650-4879-8f5b-a78ec669e0aa' },
      { moves: "F R U R' F R' F' R2 U' R' F'", id: 'ea29bab2-3379-4603-a679-d2387bb6e33e' }
    ]
  },
  {
    name: 'ZBLL L 59',
    id: '01a3f345-37da-4a7b-a610-1b45c0ab4762',
    idMethod,
    puzzle,
    group: 'L5',
    setup: "R U R' L' U2' R U R' U2' L y",
    algs: [
      { moves: "y' L' U2 R U' R' U2 L R U' R'", id: '176df994-0b50-47b7-922c-2c99c5964dca' },
      { moves: "r' U2 R2 B' R' B R' U2 r", id: 'f32fdbe7-b303-4052-af97-202f40d50ed6' },
      { moves: "y F R U R' U' F' r U R' U R U2 r'", id: 'aa0fa99d-4809-45a9-8401-f8b30526a67e' },
      { moves: "L U L' U' L F L' U' L U L F' L2", id: '854534f2-d9f9-40e1-9e23-2ab898acfb40' }
    ]
  },
  {
    name: 'ZBLL L 60',
    id: '4b02c3ad-132f-4326-98d1-8a3313b57d04',
    idMethod,
    puzzle,
    group: 'L5',
    setup: "F U R U2' R D R' U R D' R' U' R' U R U R' F' y",
    algs: [
      { moves: "y2 R U R' U F' R U2 R' U' R' U' R' F R U R", id: '1e12e5c5-004f-4a74-b9a3-d4217fc10611' },
      { moves: "y F U' R' U R D R' U R U D' F' R' U R", id: 'a7bf5c77-bad9-451f-ada1-338eb19c946c' },
      { moves: "R' U2 R2 U R' F' R U R' U' R' F R2 U' R' U' R' U2 R", id: 'a083c6db-8c41-4498-af09-a6ab6e58d512' },
      { moves: "y' F R U' R' U' R U R' U R' D' R U' R' D R2 U R' U' F'", id: '38576176-dcde-4c35-86d8-e09b03c8e6de' }
    ]
  },
  {
    name: 'ZBLL L 61',
    id: 'c05d6bf1-b083-4085-862e-82d338f49c96',
    idMethod,
    puzzle,
    group: 'L6',
    setup: "R U2' R2' U2' R' U R' U' R U2' R U2' R U2' R' y",
    algs: [
      { moves: "y' R2 U R' U R' U' R U' R' U' R U R U' R2", id: 'e8ab5aab-402c-4743-af7c-41b2fe8f04ab' },
      { moves: "y' R' U' R U' R' U R U' R' U2 R2 U R' U R U2 R'", id: '78e1cb94-eeba-43b0-8aff-b35da599ef9d' },
      { moves: "R U R' U R U' R' U R U2 R' L' U' L U' L' U2 L", id: '189ea239-3bdb-48d8-9fbc-3d6605316f34' },
      { moves: "y' R U R' U R U2 R' U R' U2 R U R' U' R U R' U R", id: 'bda466b8-8724-47fd-ac22-90bc01e09786' }
    ]
  },
  {
    name: 'ZBLL L 62',
    id: 'a44f4e7d-0ffb-47e1-9758-270e6de26ddf',
    idMethod,
    puzzle,
    group: 'L6',
    setup: "R' U' R U' R' U2' R U' R U R' U R U2' R' y'",
    algs: [
      { moves: "y R U2 R' U' R U' R' U R' U2 R U R' U R", id: 'a145b898-15a2-4714-bcf1-a34f70f6606f' },
      { moves: "y R U2 R' U' R U' R' y R' U2 R U R' U R", id: 'aa0b60ec-c541-4a3d-8ffb-2aaded3f0906' }
    ]
  },
  {
    name: 'ZBLL L 63',
    id: 'a724c47a-405a-4939-a9de-2e09d5be5957',
    idMethod,
    puzzle,
    group: 'L6',
    setup: "R' U2' R U R' U R U' R U2' R' U' R U' R' y'",
    algs: [{ moves: "y R U R' U R U2 R' U R' U' R U' R' U2 R", id: '3e969de7-fa9e-44d8-b745-526da26224c1' }]
  },
  {
    name: 'ZBLL L 64',
    id: 'a02be4ab-ed6e-429f-a4ce-f7f71f98ba97',
    idMethod,
    puzzle,
    group: 'L6',
    setup: "R2' U' R U' R U R' U R U R' U' R' U R2' y'",
    algs: [
      { moves: "y R2 U' R U R U' R' U' R U' R' U R' U R2", id: 'f7fb5538-3c13-4af6-9052-e246d63d1692' },
      { moves: "y2 R' U2 R U R' U R2 U2 R' U' R U R' U' R U' R'", id: 'a4e2c885-ba1a-4f6e-9a28-d298dae8b841' },
      { moves: "y' R' U2 R2 U2 R U' R U R' U2 R' U2 R' U2 R", id: '83920175-4c98-44a6-84ee-f2ad4230434d' }
    ]
  },
  {
    name: 'ZBLL L 65',
    id: '1083e5c7-b1af-490e-8297-b7a5db976f60',
    idMethod,
    puzzle,
    group: 'L6',
    setup: "R U R' U R U2' R' U R' U' R U' R' U2' R",
    algs: [
      { moves: "R' U2 R U R' U R U' R U2 R' U' R U' R'", id: '9faa3c64-31dd-4d35-a741-a6bcaa7872a0' },
      { moves: "y2 L' U2 L U L' U L U' L U2 L' U' L U' L'", id: '44295cac-18ce-4266-857d-0f01f785bc2b' }
    ]
  },
  {
    name: 'ZBLL L 66',
    id: 'cd7bdde7-bc82-4a80-8e31-50293f574855',
    idMethod,
    puzzle,
    group: 'L6',
    setup: "R2' U' R U R U' R' U' R U' R' U R' U R2' y2'",
    algs: [
      { moves: "y2 R2 U' R U' R U R' U R U R' U' R' U R2", id: '6e372e8b-6151-4276-adb8-f56086eefa9b' },
      { moves: "y2 R U R' U R U' R' U R U2 R2 U' R U' R' U2 R", id: 'c6f60ead-4cc0-4b0c-ad98-d7f12974d771' },
      { moves: "y' F' R U2 R' U2 R' F2 R2 U R' U' R U R' U' F'", id: '0879b296-aefa-4e77-968b-69e26b212188' },
      { moves: "y2 R' U' R U' R' U2 R U' R U2 R' U' R U R' U' R U' R'", id: '4976cf8a-fae0-4e0f-9520-f86f21ccec77' }
    ]
  },
  {
    name: 'ZBLL L 67',
    id: '10565cfd-173d-4ec5-8c41-acdf0a8376a8',
    idMethod,
    puzzle,
    group: 'L6',
    setup: "R U2' R' U' R U' R' U R' U2' R U R' U R",
    algs: [
      { moves: "R' U' R U' R' U2 R U' R U R' U R U2 R'", id: '8f9ed80b-9a61-469f-8d82-105b981cf5a2' },
      { moves: "y2 L' U' L U' L' U2 L U R U R' U R U2 R'", id: 'cd79b7ee-2b75-445a-ae99-d177023dc1b2' }
    ]
  },
  {
    name: 'ZBLL L 68',
    id: 'eba5daed-5d71-4c75-a5bb-e5d998e75305',
    idMethod,
    puzzle,
    group: 'L6',
    setup: "R2' U R' U R' U' R U' R' U' R U R U' R2'",
    algs: [
      { moves: "R2 U R' U' R' U R U R' U R U' R U' R2", id: 'd46bba42-26d0-4ca4-9c58-e4c1c04d7234' },
      { moves: "y' R U2 R' U' R U' R2 U2 R U R' U' R U R' U R", id: '6c84aa7e-d3dc-4897-a634-daf8a2da668b' },
      { moves: "U2 R' U2 R' U' R2 U' R U R' U' R U2 R U' R", id: '25c5d86c-acd0-4cd3-8d3e-de30f7ee6f74' },
      { moves: "y2 R U2 R2 U2 R' U R' U' R U2 R U2 R U2 R'", id: '3394b955-ad11-4f19-9d37-1d593ef3c766' }
    ]
  },
  {
    name: 'ZBLL L 69',
    id: 'aee13ecb-c5a1-4593-bed8-ff9b9ef69afd',
    idMethod,
    puzzle,
    group: 'L6',
    setup: "R' U2' R U R' U R U2' R' U' R U' R' U2' R",
    algs: [
      { moves: "y R U2 R' U' R U' R' U2 R U R' U R U2 R'", id: '26bcba29-5676-4f50-ae6e-5929f7cb179b' },
      { moves: "R' U2 R U R' U R L' U' L U' L' U2 L", id: '8a8976f7-8681-4830-a474-bb9788234284' },
      { moves: "y R U2 R' U' R U' R' L U L' U L U2 L'", id: '9ba11724-4071-4490-9e5d-0192c62912d8' },
      { moves: "R' U2 R U R' U R U2 R' U' R U' R' U2 R", id: '1a3c337c-83b1-41ea-8a3a-03a0fcb55d7b' }
    ]
  },
  {
    name: 'ZBLL L 70',
    id: '55a78153-cb82-45ec-b98a-4577c06a99b1',
    idMethod,
    puzzle,
    group: 'L6',
    setup: "R' U' R U' R' U2' R U2' R' U2' R U R' U R",
    algs: [
      { moves: "y R U R' U R U2 R' U2 R U2 R' U' R U' R'", id: '467087f2-445f-4409-99e3-47ca53938a09' },
      { moves: "R' U' R U' R' U2 R U2 R' U2 R U R' U R", id: '07a0e43a-0c1f-4a72-810c-7a8b23c02f1c' },
      { moves: "y R U R' U R U2 R' L U2 L' U' L U' L'", id: 'da7ea102-7fab-4060-b1e8-a921343a05a0' },
      { moves: "R' U' R U' R' U2 R L' U2 L U L' U L", id: '9dea875f-dc37-4481-98cf-afceb9c6324f' }
    ]
  },
  {
    name: 'ZBLL L 71',
    id: '11e17e49-3891-4e66-aff0-d3bd14ef9182',
    idMethod,
    puzzle,
    group: 'L6',
    setup: "R U2' R' U' R U R' U' R U R' U' R U' R' y",
    algs: [
      { moves: "y' R U R' U R U' R' U R U' R' U R U2 R'", id: 'a3da2235-54dd-46df-8b3e-90d1870937ba' },
      { moves: "y2 R' U' R U' R' U R U' R' U R U' R' U2 R", id: '915d97ca-ac7b-4b9c-9b96-cb42017c2e72' },
      { moves: "y2 R' U2 R U R' U' R U R' U' R U R' U R", id: 'd814dab6-a25c-47ab-9f63-484b89575906' },
      { moves: "y' r U r' U R U' R' U R U' R' U R U' R' r U' r'", id: 'f63b7b50-8a1b-4833-ba68-4377bf1a84c6' }
    ]
  },
  {
    name: 'ZBLL L 72',
    id: '2b5d2d8d-808b-4193-95b8-a4cbfe8f492c',
    idMethod,
    puzzle,
    group: 'L6',
    setup: "R U2' R' L' U' L U' L' U2' L R U R'",
    algs: [
      { moves: "R U R' U R U' R' U R U2 R' U' R U2 R' U' R U' R'", id: '30e59f4a-58ef-4c79-ba22-c1f012c5c3a5' },
      { moves: "R U' R' L' U2 L U L' U L R U2 R'", id: '2f896ec9-2c85-4212-b4e5-0541a25c63a7' },
      { moves: "y' R U2 R' U2 R' U' R U R U' R' U2 R' U2 R", id: '35d26af0-518b-48a6-99c6-3f3bada59d87' },
      { moves: "R' U' R' F D' R U R' D R2 U' R' F' R", id: 'c34c5b6b-96ec-458b-9e3f-afe8cdecb514' }
    ]
  }
]
