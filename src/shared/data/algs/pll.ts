import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'PLL_ALGS'
const puzzle = '333'

export const PLL_ALGS: AlgorithmCollection[] = [
  {
    name: 'Aa',
    id: 'ad8a5ce2-3421-4d10-b4bb-7855f5f6fa75',
    idMethod,
    puzzle,
    group: 'Adj Swap',
    setup: "x R2' D2' R U R' D2' R U' R x'",
    algs: [
      { moves: "x R' U R' D2 R U' R' D2 R2 x'", id: '3306666f-6bfb-4f17-9796-abcd5ab2e0e3' },
      { moves: "y' x L2 D2 L' U' L D2 L' U L'", id: '93662d3c-4d3f-4a44-830c-53bd62565d3b' },
      { moves: "l' U R' D2 R U' R' D2 R2 x'", id: '0272bb90-45e4-4516-9623-b2e1f7a7b242' },
      { moves: "y x' R2 D2 R' U' R D2 R' U R' x", id: '57d27c18-cd91-4164-bc93-0a95f85ab045' }
    ]
  },
  {
    name: 'Ab',
    id: '45a604e6-e02c-4ea4-8bdb-4f80e9ff0418',
    idMethod,
    puzzle,
    group: 'Adj Swap',
    setup: "x R' U R' D2' R U' R' D2' R2' x'",
    algs: [
      { moves: "x R2 D2 R U R' D2 R U' R x'", id: '7d36716e-a456-4a93-8909-aba41171e273' },
      { moves: "y' x L U' L D2 L' U L D2 L2", id: '536e72be-022c-4528-9355-4878a8589e3e' },
      { moves: "y x' R U' R D2 R' U R D2 R2 x", id: 'fe623548-4be1-4a2c-b23b-28cf6ee03de2' },
      { moves: "R' B' R U' R D R' U R D' R2 B R", id: '08991c90-b06e-43b3-aa10-28ab5360c9e0' }
    ]
  },
  {
    name: 'E',
    id: '817b1422-3492-4bc0-9e2c-89f612e368f8',
    idMethod,
    puzzle,
    group: 'Opp Swap',
    setup: "x' D R U R' D' R U' R' D R U' R' D' R U R' x y'",
    algs: [
      { moves: "y x' R U' R' D R U R' D' R U R' D R U' R' D' x", id: '8e07fd71-198b-4178-af94-e0485b97c13c' },
      { moves: "y R' U' R' D' R U' R' D R U R' D' R U R' D R2", id: 'b2c3e823-b4dd-4881-9695-4865bfb51808' },
      { moves: "R2 U F' R' U R U' R' U R U' R' U R U' F U' R2", id: '2e0b4ccd-1d92-4865-a352-c9f591b4605b' },
      { moves: "y x' L' U L D' L' U' L D L' U' L D' L' U L D", id: '2e1ea8fc-90aa-4031-87a9-a7152004545d' }
    ]
  },
  {
    name: 'F',
    id: '6ed5a0d5-33d9-4871-9c77-7d00ef710d60',
    idMethod,
    puzzle,
    group: 'Adj Swap',
    setup: "R' U' R U' R' U R U R2' F' R U R U' R' F U R y'",
    algs: [
      { moves: "y R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R", id: 'c7fb77c6-e3c8-4a05-a019-9cbf69923077' },
      { moves: "R' U R U' R2 F' U' F U R F R' F' R2", id: '1de6fbae-b13b-47f2-b811-0b18b5ec3791' },
      { moves: "y R' F R f' R' F R2 U R' U' R' F' R2 U R' S", id: 'a94e4639-16c1-47a3-a57a-886cb5e8b742' },
      { moves: "y R2 F R F' R' U' F' U F R2 U R' U' R", id: 'dad9ac41-7fbd-4a4d-bb41-502fc7669db4' }
    ]
  },
  {
    name: 'Ga',
    id: '2047580d-940c-4cf4-a22b-7b276d60ce20',
    idMethod,
    puzzle,
    group: 'Adj Swap',
    setup: "R' U' R D' U R2' U R' U R U' R U' R2' D",
    algs: [
      { moves: "R2 U R' U R' U' R U' R2 D U' R' U R D'", id: '3a56e15e-72af-46fe-bfc9-60936b850fda' },
      { moves: "R2 u R' U R' U' R u' R2 F' U F", id: '92c73c66-1717-490a-b90e-fc1cf5f33739' },
      {
        moves: "y R U R' F' R U R' U' R' F R U' R' F R2 U' R' U' R U R' F'",
        id: 'e8fd9ed4-121d-4894-828b-743f7a18ad75'
      },
      { moves: "R2 u R' U R' U' R u' R2 y' R' U R", id: 'b469d3c2-6b5d-4567-8997-99dee5defd39' }
    ]
  },
  {
    name: 'Gb',
    id: 'a5bb6680-48ec-4767-a43a-cb4344cb08fe',
    idMethod,
    puzzle,
    group: 'Adj Swap',
    setup: "R2' U R' U R' U' R U' R2' D U' R' U R D'",
    algs: [
      { moves: "D R' U' R U D' R2 U R' U R U' R U' R2", id: '1735d82c-0cf2-487b-9d01-d593a4321c00' },
      { moves: "R' U' R U D' R2 U R' U R U' R U' R2 D", id: '4367b6e4-38bf-4636-b552-bb6dc4857255' },
      { moves: "y F' U' F R2 u R' U R U' R u' R2", id: 'de1bef8c-5be5-44f4-8296-a90c198cb486' },
      { moves: "R' d' F R2 u R' U R U' R u' R2", id: '9e3e0144-01f0-4bb2-9cef-a51c93e458d8' }
    ]
  },
  {
    name: 'Gc',
    id: 'd9c980a9-e6d2-4ab7-9f2f-be90b4e34c2a',
    idMethod,
    puzzle,
    group: 'Adj Swap',
    setup: "D' R U R' U' D R2' U' R U' R' U R' U R2'",
    algs: [
      { moves: "D R2 U' R U' R U R' U R2 D' U R U' R'", id: 'b2310dc0-7dfd-4596-82b9-f2fb2b98543b' },
      { moves: "R2 U' R U' R U R' U R2 D' U R U' R' D", id: '32f962bb-a061-4c74-b4e7-802a9b9121ea' },
      { moves: "y2 R2 F2 R U2 R U2 R' F R U R' U' R' F R2", id: '2fb7f718-1d0a-43ba-9955-e9867997532f' },
      { moves: "R2 u' R U' R U R' u R2 f R' f'", id: 'ba87951a-b914-49eb-8393-a020f170fb00' }
    ]
  },
  {
    name: 'Gd',
    id: '7c77fb5d-9830-4269-973f-73c35d5ab40b',
    idMethod,
    puzzle,
    group: 'Adj Swap',
    setup: "R2' U' R U' R U R' U R2' D' U R U' R' D",
    algs: [
      { moves: "R U R' U' D R2 U' R U' R' U R' U R2 D'", id: '15a41a50-a19a-432a-a105-79972d499b5c' },
      { moves: "D' R U R' U' D R2 U' R U' R' U R' U R2", id: '2225e2ef-e63e-4d30-b851-a6bf18735466' },
      { moves: "R U R' y' R2 u' R U' R' U R' u R2", id: 'a02d1858-8ee1-4dd2-bcb6-1095865bade0' },
      { moves: "y R2 F' R U R U' R' F' R U2 R' U2 R' F2 R2", id: '63795c9a-c347-4ce3-aaa3-4c6c04101c1d' }
    ]
  },
  {
    name: 'H',
    id: 'fd5ce168-664d-41f4-b9dd-994c7559cd8d',
    idMethod,
    puzzle,
    group: 'EPLL',
    setup: "M2' U' M2' U2' M2' U' M2'",
    algs: [
      { moves: "M2 U' M2 U2 M2 U' M2", id: '1e8833db-b02a-49e6-8996-6e9f400eece0' },
      { moves: 'M2 U M2 U2 M2 U M2', id: '7e48d3be-a962-4424-8b20-41b6037590c3' },
      { moves: "R2 S2 R2 U' R2 S2 R2", id: 'a18c08cf-2be5-4cee-9f17-2a12b589904a' },
      { moves: 'M2 U2 M2 U M2 U2 M2', id: 'f7f2004e-cbe7-4b3a-95a1-37d89a72a9c0' }
    ]
  },
  {
    name: 'Ja',
    id: '9d0894dc-e71e-4911-a44b-62a1ab612bae',
    idMethod,
    puzzle,
    group: 'Adj Swap',
    setup: "L' R' U2' R U R' U2' L U' R y'",
    algs: [
      { moves: "y2 x R2 F R F' R U2 r' U r U2 x'", id: '38b9aa24-c493-4083-8c0e-9fd57527dff7' },
      { moves: "y R' U L' U2 R U' R' U2 R L", id: '717d9181-be80-4056-b3c1-3fa0146ca68b' },
      { moves: "L' U' L F L' U' L U L F' L2 U L", id: '01f5be4d-ec69-425e-b1bf-6e6d6afe09de' },
      { moves: "R U' L' U R' U2 L U' L' U2 L", id: 'e8e5904a-5a39-421e-8e12-a042fbd28908' }
    ]
  },
  {
    name: 'Jb',
    id: 'd55116d1-3019-4036-863f-c7bdd40d4f46',
    idMethod,
    puzzle,
    group: 'Adj Swap',
    setup: "R U R2' F' R U R U' R' F R U' R'",
    algs: [
      { moves: "R U R' F' R U R' U' R' F R2 U' R'", id: 'b98cd3aa-a86a-4ec5-8c3f-cb597c91f878' },
      { moves: "R U2 R' U' R U2 L' U R' U' L", id: '6e9c51bf-11c0-4abb-a084-c9b4ca57b403' },
      { moves: "r' F R F' r U2 R' U R U2 R'", id: 'e0c29bc6-0ed0-40c7-b884-3541051c254f' },
      { moves: "L' U R U' L U2 R' U R U2 R'", id: 'e6c54f6a-492b-4323-8fc6-c14bee3d429f' }
    ]
  },
  {
    name: 'Na',
    id: '760a383a-8de6-429e-9944-abcfc3f613fa',
    idMethod,
    puzzle,
    group: 'Opp Swap',
    setup: "R U R' U2' R U R2' F' R U R U' R' F R U' R' U' R U' R'",
    algs: [
      { moves: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'", id: '588a2b55-6601-4aa3-a038-35d34d8861c4' },
      { moves: "F' R U R' U' R' F R2 F U' R' U' R U F' R'", id: 'e4b3a7d7-5b61-4f4d-b102-31a6613cf5dc' },
      { moves: "R F U' R' U R U F' R2 F' R U R U' R' F", id: '12598c2d-336f-49ca-87f6-bb0f9366f15d' },
      { moves: "r' D r U2 r' D r U2 r' D r U2 r' D r U2 r' D r", id: 'ae5ef594-e7cc-42e7-8376-79304da0d877' }
    ]
  },
  {
    name: 'Nb',
    id: 'a23db787-2627-419a-be82-8e01add95f8d',
    idMethod,
    puzzle,
    group: 'Opp Swap',
    setup: "F r' F' r U r U' r2' D' F r U r' F' D r",
    algs: [
      { moves: "R' U R U' R' F' U' F R U R' F R' F' R U' R", id: '043f7368-9e1b-4c2a-95d6-b3c7511902ae' },
      { moves: "r' D' F r U' r' F' D r2 U r' U' r' F r F'", id: '6e386d96-3250-462a-9813-ef6deb49ad5d' },
      { moves: "R' U L' U2 R U' L R' U L' U2 R U' L", id: 'e42a3d72-9c80-45b5-a34a-c8e159478fc7' },
      { moves: "L' U' L U' L' U' L F L' U' L U L F' L2 U L U2 L' U L", id: 'e87b8f54-79d7-4311-ad13-ec4bea630969' }
    ]
  },
  {
    name: 'Ra',
    id: '722dbe8c-df45-401a-8c67-5f1fc4b42195',
    idMethod,
    puzzle,
    group: 'Adj Swap',
    setup: "R U2' R D R' U R D' R' U' R' U R U R' y'",
    algs: [
      { moves: "y R U' R' U' R U R D R' U' R D' R' U2 R'", id: '8796f672-782c-48a7-ade0-8f942ba7ea10' },
      { moves: "y R U R' F' R U2 R' U2 R' F R U R U2 R'", id: '19ed63e7-62ed-46c3-adb0-5e3c4fd67a2c' },
      { moves: "L U2 L' U2 L F' L' U' L U L F L2", id: '98743207-28c3-4c2c-bf90-630b436ba461' },
      { moves: "y R U' R' U' R U R' U R' D' R U' R' D R2 U R'", id: '40b34eaa-58d5-4de4-99a7-81070be74c6d' }
    ]
  },
  {
    name: 'Rb',
    id: '4d841928-2feb-4bcd-b7c3-9a77575852ed',
    idMethod,
    puzzle,
    group: 'Adj Swap',
    setup: "R' U R U R' U' R' D' R U R' D R U2' R",
    algs: [
      { moves: "R' U2 R U2 R' F R U R' U' R' F' R2", id: 'cada3676-2bb1-4c10-b4ca-79106b8412ce' },
      { moves: "y R2 F R U R U' R' F' R U2 R' U2 R", id: '187af30b-9f87-4194-942a-5c35c8d25930' },
      { moves: "R' U2 R' D' R U' R' D R U R U' R' U' R", id: '27132a51-062f-4360-a6ed-4a1221bf094b' },
      { moves: "y R' U R U R' U' R' D' R U R' D R U2 R", id: '46d21089-e808-448a-8949-fbe5a14b7749' }
    ]
  },
  {
    name: 'T',
    id: '0c560d48-b9ff-40a1-855c-138de02a51c0',
    idMethod,
    puzzle,
    group: 'Adj Swap',
    setup: "F R U' R' U R U R2' F' R U R U' R'",
    algs: [
      { moves: "R U R' U' R' F R2 U' R' U' R U R' F'", id: '83fa046a-74ba-4a8e-84db-e8109c71d227' },
      { moves: "l b d' L' U' F U2 L' U' L' U L U' f' S M r u E U' R'", id: '333b0808-5227-423f-b208-fe6d6a05f22b' },
      { moves: "R U R' U' R' F R2 U' R' U F' L' U L", id: 'a95a9459-e7b8-4d99-a7ea-05c58771d650' },
      { moves: "R2 u R2 u' R2 F2 u' F2 u F2", id: 'a5071d68-0241-439d-b564-c64f9f512d7d' }
    ]
  },
  {
    name: 'Ua',
    id: '6ae1d63d-882c-428c-8f17-7e43f7d548db',
    idMethod,
    puzzle,
    group: 'EPLL',
    setup: "M2' U' M' U2' M U' M2'",
    algs: [
      { moves: "y2 M2 U M U2 M' U M2", id: 'c2c72009-f91f-474e-9eeb-1171dd537fe0' },
      { moves: "R U R' U R' U' R2 U' R' U R' U R", id: 'cade032c-574f-46b9-ad15-f92eedd5016d' },
      { moves: "y R2 U' S' U2 S U' R2", id: '10e40b79-549a-4d57-a7c8-e1b7fbd463ea' },
      { moves: "y2 R U' R U R U R U' R' U' R2", id: 'b699e43f-f543-4a1f-8255-46c7a9656c92' }
    ]
  },
  {
    name: 'Ub',
    id: '7e1ea243-2d14-4425-8e06-582bad18798b',
    idMethod,
    puzzle,
    group: 'EPLL',
    setup: "M2' U M' U2' M U M2'",
    algs: [
      { moves: "y2 M2 U' M U2 M' U' M2", id: 'd0338ca2-a1f1-4758-b488-f75224a431db' },
      { moves: "R' U R' U' R' U' R' U R U R2", id: '8d412ee5-9cb7-4983-a999-77728eea5880' },
      { moves: "R2' U R U R' U' R3 U' R' U R'", id: '4995d44a-5315-4652-a986-c90e9e3aae9f' },
      { moves: "y2 R2 U R U R' U' R' U' R' U R'", id: '72074c22-672b-417c-8697-1de6c7c889b4' }
    ]
  },
  {
    name: 'V',
    id: 'ffbfad95-32f3-46a3-ba43-b2ce6585724d',
    idMethod,
    puzzle,
    group: 'Opp Swap',
    setup: "D2' R' U R D' R2' U' R' U R' U R' D' R U2' R'",
    algs: [
      { moves: "R' U R' U' R D' R' D R' U D' R2 U' R2 D R2", id: 'c7c8a5b2-f2f6-4a3c-a0bb-d93460c82a4b' },
      { moves: "R' U R U' R' f' U' R U2 R' U' R U' R' f R", id: '23ea98ef-4918-4afe-a1a7-3326625c8e8c' },
      { moves: "y R U' R U R' D R D' R U' D R2 U R2 D' R2", id: '0a8b7d74-0021-44a8-8eca-0af188e1777d' },
      { moves: "R' U R' U' y R' F' R2 U' R' U R' F R F", id: '398c7cd5-b855-4b4e-b134-346f51be5654' }
    ]
  },
  {
    name: 'Y',
    id: 'ebc579d7-91ee-4933-bd8c-2c2de745e345',
    idMethod,
    puzzle,
    group: 'Opp Swap',
    setup: "F R' F' R U R U' R' F R U' R' U R U R' F'",
    algs: [
      { moves: "F R U' R' U' R U R' F' R U R' U' R' F R F'", id: '094cb9f1-5024-49ea-b7d7-9ead28e07520' },
      { moves: "F R' F R2 U' R' U' R U R' F' R U R' U' F'", id: '78a18067-e1cf-416f-b021-d55624af8648' },
      { moves: "R2 U' R2 U' R2 U F U F' R2 F U' F'", id: '143b697f-9b8a-410b-8fe0-3d3683cc4493' },
      { moves: "F R' F' R U R U' R2 U' R U R f' U' f", id: '4e5a856f-8e8c-4e99-b9e6-46649ccf4e41' }
    ]
  },
  {
    name: 'Z',
    id: '5555d7ba-db1b-4d9a-9e3f-08616c1c37ec',
    idMethod,
    puzzle,
    group: 'EPLL',
    setup: "M U2' M2' U2' M U' M2' U' M2'",
    algs: [
      { moves: "M' U' M2 U' M2 U' M' U2 M2", id: '73e9d2ef-b8fd-4b83-b45a-186becfd1081' },
      { moves: "M2 U M2 U M' U2 M2 U2 M'", id: 'a0443497-24be-4f68-b94e-b739ebcf08b1' },
      { moves: "y M2 U' M2 U' M' U2 M2 U2 M'", id: '86bb1b5b-c17d-4da2-abd4-d1ff2cccbf35' },
      { moves: "y M' U M2 U M2 U M' U2 M2", id: '041c58c4-7f53-46f3-9a43-a3ba4b89f8de' }
    ]
  }
]
