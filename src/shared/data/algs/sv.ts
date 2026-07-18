import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'SV_ALGS'
const puzzle = '333'

export const SV_ALGS: AlgorithmCollection[] = [
  {
    name: 'SV 1',
    id: '762eefc9-cacc-4551-95be-f07c5d63d214',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "R U R' U2' L U' R U R' L'",
    algs: [
      { moves: "U2 R' D' r U2 r' D R", id: '7da4199a-7d9d-4775-8c0b-be1a73aacf65' },
      { moves: "L R U' R' U L' U2 R U' R'", id: 'd9cce750-917d-493a-827f-bbf5afb2c226' },
      { moves: "U2 R U R' U2 L U' R U R' L'", id: '6a7007cc-94b6-4d64-ac96-d5b9c9d5506a' },
      { moves: "R U R D R' U2 R D' R' U2 R'", id: 'e7c6b018-ee24-42af-a58e-2eaa57f6fa2e' }
    ]
  },
  {
    name: 'SV 2',
    id: '7667810b-f2cc-4028-9bac-739dd31948e4',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "R' U' R U' R' U2' R U' R U' R'",
    algs: [
      { moves: "U2 R' D' R U R' D R U R U R'", id: '1bcb2bab-2519-42e1-aba5-72f007176599' },
      { moves: "L' R U R' U L U R U2 L' U' L U2 R'", id: '61c61184-f29f-4bf0-9f18-9be72f63c067' },
      { moves: "R U R' U2 R U R' U R U2 R'", id: 'ff4d0849-0007-4435-901b-931730ea48bd' },
      { moves: "R U R' U R' U2 R U R' U R", id: '8ba6065b-1c93-4cfa-9a51-9df111d6b25d' }
    ]
  },
  {
    name: 'SV 3',
    id: 'b2fee506-7b1e-4721-a5f0-b6dbf5dfc236',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "R U R D R' U' R D' R' U' R'",
    algs: [
      { moves: "R U R D R' U R D' R' U' R'", id: '2f2cd081-fab8-45db-87ed-fbb53d6ce0cb' },
      { moves: "U2 R L U' R' U' L' U' L U' L'", id: '79c1a524-1c30-4a21-b940-62f90d9b4200' },
      { moves: "R U' R' U' R2 D R' U' R D' R2", id: '2cf05487-b849-412f-9eab-869196acdc61' },
      { moves: "M x D L U L' D' L R'", id: '004f23a6-594b-4b17-b141-6fadf727e37b' }
    ]
  },
  {
    name: 'SV 4',
    id: 'faeb45d7-5f0a-46fa-a71a-c8e1da273324',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "L U' R U R' L' U2'",
    algs: [
      { moves: "U2 L R U' R' U L'", id: '9b0e7f18-15d2-40de-9ab5-cf7be78366ea' },
      { moves: "R' D' r U2 r' D R2 U R'", id: '881e883a-3d0c-4d02-8d3b-3c632b57c3bb' }
    ]
  },
  {
    name: 'SV 5',
    id: 'a857c02c-4e85-4639-a232-c1b0c07a4957',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "L' U' L R U2' L' U' L U R'",
    algs: [
      { moves: "R U2 R' U' R' F R U R U' R' F'", id: 'e9378a60-10c8-462b-836b-17aaa506a972' },
      { moves: "L' U2 L U L' U L R U2 R'", id: 'ede7c371-dbc1-47fb-9878-6c5da4e8a9b5' },
      { moves: "R U' L' U L U2 R' L' U L", id: 'd9a38583-44c1-4136-9b8d-1c7bf24fb43a' },
      { moves: "U2 L U F2 r U2 r' U' L'", id: '4df08d95-85a5-48ae-8d74-40c45b30ac45' }
    ]
  },
  {
    name: 'SV 6',
    id: '44270f34-ee0d-4dc2-b64c-4fcce0d9f5aa',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "R U R' U R U R'",
    algs: [{ moves: "R U' R' U' R U' R'", id: 'b36507aa-e817-4995-aad6-cc7bf9edf0a2' }]
  },
  {
    name: 'SV 7',
    id: '6c1e002d-e984-4543-9f39-d6983aa6b601',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "R U' R'",
    algs: [
      { moves: "R U R'", id: '44acfbd9-8261-4e4c-8f6f-b072a6d8ee84' },
      {
        moves: "R U2 R' U R U' R' U R U' R' U R U' R' U R U' R' U R U' R' U R U' R' U R U' R' U R U' R' U R U' R' U",
        id: 'cdcddbd4-4d95-48af-8e69-60715b7aae09'
      },
      { moves: "R U' U' U' R'", id: 'ed06fb17-a048-471d-8192-423e74480dbb' },
      { moves: "B' D' B2 R' U' B U B2 R D R U R'", id: '121b56ba-9710-448a-a495-556bb3594400' }
    ]
  },
  {
    name: 'SV 8',
    id: 'd999e091-64a7-49d5-99f2-cb8543be72d4',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "L' R U R' U' L U R U2' R'",
    algs: [
      { moves: "R U M' U R' U' r' F R F'", id: '114abc0b-52d0-46d4-a552-fb955a02c399' },
      { moves: "U2 M' F' U2 F M", id: 'b0224075-dee8-4dae-97a1-aac688cd8aa7' },
      { moves: "R U2 R' U' L' U R U' R' L", id: '64e3eeee-8b63-48dc-bcef-af422782eb80' },
      { moves: "R U2 R' U' r' F R F' M'", id: '19090e0c-8f3d-44fd-8b00-f7489632bd67' }
    ]
  },
  {
    name: 'SV 9',
    id: '11c282a9-cee3-47ca-b12f-9c0c52d0fd85',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "R U R' U L' R U R' U' L R U R'",
    algs: [
      { moves: "R U' R' L' U R U' R' L U' R U' R'", id: '7ad51fa1-f38e-4554-9cd9-edcd28001b85' },
      { moves: "R U' R2 F R F' U' S' R U' R' S", id: '354e5dba-09e6-4a4e-87d4-6ee22418a0f9' }
    ]
  },
  {
    name: 'SV 10',
    id: '50e0c802-4588-47b1-aa44-10281ddcfad4',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "R U2' R' U' R U' R' U R U' R'",
    algs: [
      { moves: "R U R' U' R U R' U R U2 R'", id: '2e98a79d-da08-4908-90f6-c3f8ec431172' },
      { moves: "U2 R' D' R U' R' D R U' R U R'", id: '030e901f-afe0-46f7-b510-787ebcbfdf03' }
    ]
  },
  {
    name: 'SV 11',
    id: '485d89b7-0174-43fa-b238-cd177c351f47',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "R U2' R' U' R U2' R'",
    algs: [
      { moves: "M F R' F' r", id: 'ad3da97e-dddc-4612-9103-fee6298ac81b' },
      { moves: "L' R U R' U' L", id: '0c4f731c-211b-4849-8910-e852cccc7b9b' },
      { moves: "R U2 R' U R U2 R'", id: 'bd7e430e-3026-41a3-bdf5-05e605234e63' }
    ]
  },
  {
    name: 'SV 12',
    id: 'fdd6439b-43dc-4721-a0ac-8bfd7d2f3854',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "R2' U R' U R U' R2' U R U' R U' R2'",
    algs: [
      { moves: "R U2 R' U F' R U2 R' U2 R' F R", id: '8441f603-4e14-4dd9-98f7-8789c544b58e' },
      { moves: "R2 U R' U R' U' R2 U R' U' R U' R2", id: '28b289d9-47df-4e90-9910-f201b1657577' },
      { moves: "R U R' U R U2 R2 U' R2 U' R2 U2 R", id: 'f538ed35-c0f6-440a-b653-96741a945800' }
    ]
  },
  {
    name: 'SV 13',
    id: 'a30b6d8a-7ea8-4d19-9ca9-aa0b9e22e994',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "L' U2' R U R' U' R U' R' L U'",
    algs: [
      { moves: "U L' R U R' U R U' R' U2 L", id: 'e1793328-b413-4a59-a619-0e7d77beef43' },
      { moves: "R U2 R2 D' R U R' D R2 U2 R'", id: '75ae994a-db3d-49a3-b744-d7028b9e9aa0' },
      { moves: "R U' R' U' R U' R' U' R U R' U R U2 R'", id: 'f34d9a52-59e9-477f-9592-b6746a3080a5' }
    ]
  },
  {
    name: 'SV 14',
    id: '87f3eaa9-9c61-4518-bbf2-dab570e409a5',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "R' U L U' R2' U R' L' U2'",
    algs: [
      { moves: "U2 L R U' R2 U L' U' R", id: '2525ed07-900d-4cec-a2dd-6a0c0158400d' },
      { moves: "U2 L' R U R' U' L U2 R U R'", id: 'b1e2df48-d3ba-4d0a-9217-3623f240264e' }
    ]
  },
  {
    name: 'SV 15',
    id: '8e04b995-d937-41a3-b8dd-b10559e0d20d',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "R U2' R' U' R U R' U' R U2' R'",
    algs: [{ moves: "R U2 R' U R U' R' U R U2 R'", id: '704abaf6-edce-4560-b189-8b95f4990cb3' }]
  },
  {
    name: 'SV 16',
    id: '6202be5a-8e68-4e17-b1cc-72c011f69434',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "R2' D R' U2' R D' R' U R'",
    algs: [{ moves: "R U' R D R' U2 R D' R2", id: 'a5ca546e-a536-4216-b7f6-424f24989ded' }]
  },
  {
    name: 'SV 17',
    id: 'febec353-443c-442b-a7ab-cd6e3dc608e0',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "R' U' R U' R' U2' R2' U' R'",
    algs: [{ moves: "R U R2 U2 R U R' U R", id: '8f253857-3635-438a-8e66-8bb36ae673fc' }]
  },
  {
    name: 'SV 18',
    id: '20d463c0-75a8-43c2-8bc4-be8bf7ba4869',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "R2' D R' U R D' R' U2' R'",
    algs: [
      { moves: "R U2 R D R' U' R D' R2", id: 'e03f7887-8944-44de-93c4-777a4c0ef0e8' },
      { moves: "R U2 R' U R' D' R U' R' D R2 U' R'", id: 'b7a12624-fa89-44f8-81ed-e130e6ef36b6' }
    ]
  },
  {
    name: 'SV 19',
    id: '8f9ae5f1-d644-48e9-96db-8c03295877ef',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "L' U' L' U R U' L U L U' R'",
    algs: [
      { moves: "R U R2 F' r U R U' r' F", id: '28f98d59-4774-4f6e-86ab-60b1b37f0f48' },
      { moves: "R U L' U' L' U R' U' L U L", id: '4e33995a-addb-4cbb-a105-610d6ca128fb' },
      { moves: "R U' R' F' R U2 R' U2 R' F R", id: '61e32c10-09fd-43d6-9e11-6d3addc309f5' },
      { moves: "R U2 R' U' R' F' R U2 R U2 R' F", id: '0faf9f52-c28f-4503-a1ce-927439afe2bc' }
    ]
  },
  {
    name: 'SV 20',
    id: '90f3f5a5-dc46-488e-aa20-f8bd7cfa3bb7',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "R U R' U R U' R' U R U R'",
    algs: [{ moves: "R U' R' U' R U R' U' R U' R'", id: '157688fa-1aaf-42f8-a211-5a81096ffeb9' }]
  },
  {
    name: 'SV 21',
    id: 'ad888922-d54b-4e94-aa4b-d246f2afb429',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "R' U2' R2' U R2' U R2' U R'",
    algs: [{ moves: "R U' R2 U' R2 U' R2 U2 R", id: '35dafb87-bb87-43de-95dc-a0771b320733' }]
  },
  {
    name: 'SV 22',
    id: '07fdb9a9-9012-4cef-819b-d36399d00e61',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "R' U2' R U R' U R2' U' R'",
    algs: [{ moves: "R U R2 U' R U' R' U2 R", id: '393d67bd-7cbe-4fdd-b401-5eec66a599bc' }]
  },
  {
    name: 'SV 23',
    id: '58ac1f35-2e15-465d-a7c9-e6c7f77f9c73',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "R' U2' R U R' U R2' U R' U R U R'",
    algs: [
      { moves: "R U' R' U' R U' R2 U' R U' R' U2 R", id: '63dd3200-d5e2-4889-9be3-de258b0ef717' },
      { moves: "R U2 R' U R U2 R2 U2 R U R' U R", id: 'db5c576a-3211-46f8-89ed-0e153eac056b' }
    ]
  },
  {
    name: 'SV 24',
    id: 'b2023af6-d8ec-4886-b440-88654e555563',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "R' U2' R U R' U R U' R U' R'",
    algs: [{ moves: "R U R' U R' U' R U' R' U2 R", id: '137da321-7655-4412-ac6e-9fa1d9be0a90' }]
  },
  {
    name: 'SV 25',
    id: '4fb5b3dd-f859-482c-ba9e-648b68bf7ba4',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "R' U' R' D' R U R' D R' U' R'",
    algs: [
      { moves: "R U R D' R U' R' D R U R", id: '8e8c368a-892a-45f4-9b7f-c5e3a5fc2118' },
      { moves: "R U2 R' U R U' R' U R U' R' U R U2 R'", id: '96dd3b62-c040-436c-930e-5f49518d19c5' },
      { moves: "R U' R' U' R U R' U' R U R' U' R U' R'", id: '5d428d0f-3e50-4541-9434-4e2ad78a3481' },
      { moves: "U' r' F R2 F' r U R' U R'", id: 'cb3c543e-e4ec-4d0a-b8e0-6891632651cb' }
    ]
  },
  {
    name: 'SV 26',
    id: 'ec07696e-f400-4a9c-b88a-70b303440943',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "R2' D R' U' R D' R' U' R' U",
    algs: [{ moves: "U' R U R D R' U R D' R2", id: '604d530b-cb6d-4d8f-bcfe-169598b514cb' }]
  },
  {
    name: 'SV 27',
    id: 'c43bb86a-a1bf-4706-b741-1c9c96d6e235',
    idMethod,
    puzzle,
    group: 'SV',
    setup: "L R U' R2' U L' U' R",
    algs: [
      { moves: "R' U L U' R2 U R' L'", id: '29907d3e-6b25-4855-87e9-4d8ce8deb54b' },
      { moves: "R U R' U' R U2 R' U' R U' R'", id: '0c085ba6-38a5-499b-91a6-88c7f4da3493' },
      { moves: "R U R' U2 R' U' R U' R' U2 R", id: '8d17e97a-4c7c-4fe6-803b-c12fb23e20ca' }
    ]
  }
]
