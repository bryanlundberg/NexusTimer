import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

const idMethod = 'L4E_ALGS'
const puzzle = '222'

export const L4E_ALGS: AlgorithmCollection[] = [
  {
    name: 'Sune',
    id: '78c3bb7a-52be-4c9c-b928-0e4d189669e9',
    idMethod,
    puzzle,
    group: 'Last Layer',
    setup: "L' U' L U' L' U' L",
    algs: [
      { moves: "R U R' U R U R'", id: '81715ab5-ae50-4a38-9280-fca35f7033be' },
      { moves: "L U L' U L U L'", id: '4e083bb6-66c0-464d-8545-7ed1585a4a68' },
      { moves: "R' U R U R' U R", id: 'e520d7d2-03d3-46e4-9772-60453f955706' },
      { moves: "L' U L U L' U L", id: '06a8353b-e8b0-47db-bfbd-e0134da54182' }
    ]
  },
  {
    name: 'AntiSune',
    id: '01c4bc3e-c387-44a8-8a01-1a29adb91522',
    idMethod,
    puzzle,
    group: 'Last Layer',
    setup: "R U R' U R U R'",
    algs: [
      { moves: "R U' R' U' R U' R'", id: '6164720c-fc9a-4020-a1e9-5fdc0fc4dd95' },
      { moves: "L' U' L U' L' U' L", id: '4c7fd11f-90df-439a-8469-158cceed1662' },
      { moves: "R' U' R U' R' U' R", id: '012456d2-60b9-46f5-9f0c-c711f60e3b33' },
      { moves: "L U' L' U' L U' L'", id: 'b4d17b15-ef53-4749-8ba6-13489f0e8316' }
    ]
  },
  {
    name: 'Lefty Bars',
    id: 'b2ebce04-9b87-451a-8e29-543492b315d1',
    idMethod,
    puzzle,
    group: 'Last Layer',
    setup: "R' L' U' L U R",
    algs: [
      { moves: "R' U' L' U L R", id: 'ad6a1979-a8a7-490f-baa9-e11212234655' },
      { moves: "U L R U R' U' L'", id: 'b97ac63b-5a8d-4dbc-96b1-77988a3619b7' }
    ]
  },
  {
    name: 'Righty Bars',
    id: '9b4e5819-924e-416f-956c-e47574fe8a18',
    idMethod,
    puzzle,
    group: 'Last Layer',
    setup: "L R U R' U' L'",
    algs: [
      { moves: "L U R U' R' L'", id: 'edb79238-9d56-4e02-97f1-d95a53546460' },
      { moves: "U' R' L' U' L U R", id: '682b9939-5561-42ca-a102-7291b0f44b53' }
    ]
  },
  {
    name: 'Sledge',
    id: 'a234e84d-6798-40c3-8372-cd89b561d620',
    idMethod,
    puzzle,
    group: 'L3E',
    setup: "L R' L' R",
    algs: [
      { moves: "R' L R L'", id: '2d7a97ca-b758-4394-9cc2-3b0a5bfddb3f' },
      { moves: "L U' R' L R L2'", id: 'e885538d-576a-4b6b-ab16-6c7dd18d0263' },
      { moves: "U' L R U' R' U L'", id: 'ffafaa7a-3d4e-4378-8740-e47e6bbcdbed' },
      { moves: "U R' U L' U' L R", id: '7be07940-6534-49b7-ae48-fd7196536913' },
      { moves: "U R2' L R L' U' R", id: '65e1faf0-08e8-4da7-81e9-6082d4200200' }
    ]
  },
  {
    name: 'Hedge',
    id: '8ff2d852-d1df-4e8e-bb10-e683ea1e545b',
    idMethod,
    puzzle,
    group: 'L3E',
    setup: "R' L R L'",
    algs: [
      { moves: "L R' L' R", id: '7407804b-1884-430f-9b21-2eda32a152ef' },
      { moves: "U' L U' R U R' L'", id: '9605b4f5-dc2c-49da-a083-7e322ec2f44d' },
      { moves: "U' L2 R' L' R U L'", id: 'ade65723-8ba1-4436-94bb-0b0aa00444bd' },
      { moves: "R' U L R' L' R2", id: '0d01a097-3574-4d61-9815-cd62478543fa' },
      { moves: "U R' L' U L U' R", id: '68069c9c-38f9-42c5-9d02-670d1028f8cf' }
    ]
  },
  {
    name: 'Clockwise',
    id: 'f9e82737-5891-4f3c-8069-fb8eb78ce170',
    idMethod,
    puzzle,
    group: 'L3E',
    setup: "L' U L U R U R'",
    algs: [
      { moves: "L R' L' R2 U' R'", id: '9b58e874-277f-41af-970b-89f14f233442' },
      { moves: "R U' R' U' L' U' L", id: 'ddd2bc5a-240a-4073-a1a0-9a25464c73a2' },
      { moves: "U' R U' R' L R' L' R", id: '41e73c48-1736-4dad-a7fb-3637425d8d13' },
      { moves: "U L' U' L2 R' L' R", id: '5a24fac5-de5f-42ec-8254-52543305670c' },
      { moves: "U' L2 R' L' R L'", id: '370cf04d-1601-4d93-8c78-3952e237193d' },
      { moves: "L U' R U' R' U' L'", id: 'aa02bbf6-7a5b-4a16-8ff8-80281b9eba7e' },
      { moves: "U R' L R' L' R2", id: 'b18230d2-4817-4fe6-9367-6c00e9128412' },
      { moves: "R' U' L' U' L U' R", id: '8972ac19-10ff-4b0f-b701-ceee1dfa65ec' }
    ]
  },
  {
    name: 'Counterclockwise',
    id: '04f1ab30-dfb5-4ffa-bed9-d3a6838c5c3c',
    idMethod,
    puzzle,
    group: 'L3E',
    setup: "R U' R' U' L' U' L",
    algs: [
      { moves: "R' L R L2' U L", id: '18b32939-468e-45f5-9a7b-37d0da9833fd' },
      { moves: "U L' U L R' L R L'", id: 'fdcefa8b-8580-4a29-a27d-38f87cdf2b9d' },
      { moves: "U' R U R' L R' L' R", id: 'ddd85646-146d-4ba2-badb-ff8572e4208f' },
      { moves: "U R' L R L' R U R'", id: '6416b1cf-f1b7-4380-8633-78397777d812' },
      { moves: "U' L R' L R L2'", id: 'f391620f-3c02-4fcd-91e9-0cbba9f7010e' },
      { moves: "L U R U R' U L'", id: '03643ccd-feb4-43e2-9fce-c81c6d7a5633' },
      { moves: "U R2' L R L' R", id: '89197624-6bde-442f-a1ce-470aaafb76e9' },
      { moves: "R' U L' U L U R", id: '9dc27ff6-a8fd-4055-9779-9ea66cb179a4' },
      { moves: "R' U L' U L U R", id: 'acc6e799-84a6-4747-af76-b43e97173454' }
    ]
  },
  {
    name: 'Righty',
    id: '8fbf2955-fe78-42c0-aa9d-0c3d0de27203',
    idMethod,
    puzzle,
    group: 'L3E',
    setup: "U' R U R'",
    algs: [
      { moves: "R U' R'", id: '22ebbb82-a1f8-45ec-9ce8-0a7919f12cb8' },
      { moves: "L U' L'", id: '46aaa249-469d-42f4-bd82-fa46e19aa799' }
    ]
  },
  {
    name: 'Lefty',
    id: '18580dcf-b81a-4800-a74b-bdc9f7a6cf73',
    idMethod,
    puzzle,
    group: 'L3E',
    setup: "U L' U' L",
    algs: [
      { moves: "L' U L", id: '320a2d80-d39a-455f-a9c8-05aa0019ff41' },
      { moves: "R' U R", id: '6cfb08e8-1afe-4fc2-8545-1b97c873d9c5' }
    ]
  },
  {
    name: 'Sexy',
    id: '96274b96-b7a3-4271-9f4c-2d076be8f1ab',
    idMethod,
    puzzle,
    group: 'L3E',
    setup: "R U' R' U",
    algs: [
      { moves: "U' R U R'", id: '112c9354-9206-441c-a3c1-a47b7d145a72' },
      { moves: "U' L U L'", id: 'e0414d58-298c-4eef-8b93-4a036db05afc' }
    ]
  },
  {
    name: 'Left Sexy',
    id: 'c9cbee4f-13d8-48da-aadf-2ed150ddbe62',
    idMethod,
    puzzle,
    group: 'L3E',
    setup: "L' U L U'",
    algs: [
      { moves: "U L' U' L", id: '6977f02d-65aa-4481-9a56-dba4686d8cb1' },
      { moves: "U R' U' R", id: '305b6f9c-368b-4ae6-b28f-64720be9f39a' }
    ]
  },
  {
    name: '2 Flip',
    id: 'dd39ae90-f386-4170-9fe9-b2a0d4fe76a7',
    idMethod,
    puzzle,
    group: 'Flipped Edges',
    setup: "U' R' U L' U L U' R",
    algs: [
      { moves: "L R' L' R U' R U R'", id: 'd68acbab-0175-45f8-8c6c-8e68fa37966e' },
      { moves: "R' L R L' U L' U' L", id: 'e600fcab-cc21-40d1-87be-659301abafbc' },
      { moves: "R' U L' U' L U' R", id: '98ec805b-34a7-4384-bf4a-568d6944f03a' },
      { moves: "L U' R U R' U L'", id: '491022a8-24a1-497f-abde-d25a82c89636' }
    ]
  },
  {
    name: 'DR Flip',
    id: 'd082cfba-4541-474e-937f-f603e8b5b4a0',
    idMethod,
    puzzle,
    group: 'Flipped Edges',
    setup: "U' R U R' U L' U' L",
    algs: [
      { moves: "L R' L' R L' U L", id: '806c840d-6a68-476d-aa89-8e2819dd8959' },
      { moves: "L' U L U' R U' R'", id: '59b94349-e915-4527-8e20-26b9ba0ce615' },
      { moves: "R U R' L R' L' R", id: '8708057d-01d2-413f-8a01-58669a59d1e6' },
      { moves: "L U' L R' L' R L'", id: '8f1d1193-3176-4d21-8abc-dd6cd037410d' },
      { moves: "L2 R' L' R2 U' R' U' L'", id: '79d35d2f-15ce-4909-a1a2-1a12d74b5699' },
      { moves: "R' U' L' U' L2 R' L' R2", id: '8dac605f-0782-4e2a-b4d9-f3b3e02b24b8' }
    ]
  },
  {
    name: 'DL Flip',
    id: '83ed35d2-5e1c-4df2-bbd7-d39c56c19877',
    idMethod,
    puzzle,
    group: 'Flipped Edges',
    setup: "U L' U' L U' R U R'",
    algs: [
      { moves: "R' L R L' R U' R'", id: 'c9442deb-a7ab-4367-9f00-7cf9354c73fb' },
      { moves: "R U' R' U L' U L", id: '69861a64-12ec-4930-96cc-758183ba74bd' },
      { moves: "L' U' L R' L R L'", id: '625ff4f1-6d9d-46cb-9258-092b7dab54d0' },
      { moves: "L U R U R2' L R L2'", id: 'e4d7e9b0-cac9-4e83-adec-893c35803ef0' },
      { moves: "R' U R' L R L' R", id: 'c93a7645-2e89-4166-ac2b-bea6eaa52d05' },
      { moves: "R2' L R L2' U L U R", id: '6268dcae-3d69-45f2-9c34-65a6b2391c65' }
    ]
  },
  {
    name: 'DB Flip',
    id: 'e886f380-3781-4f7e-97bf-272872387880',
    idMethod,
    puzzle,
    group: 'Flipped Edges',
    setup: "U L' U L U' R U' R'",
    algs: [
      { moves: "R U R' U L' U' L", id: 'ec9e7d0a-26da-4840-8efe-5cba25403d9e' },
      { moves: "L' U' L U' R U R'", id: 'aa062ff1-adc3-40eb-b7c7-69dabe0263b5' },
      { moves: "L R' L R L' U L'", id: '144df831-d35b-4982-b0b1-7e6962694ff9' },
      { moves: "R' L R' L' R U' R", id: '2684f4d9-2662-40ae-9b92-413faaaa1a7f' }
    ]
  },
  {
    name: '4 Flip',
    id: '03d455bb-1f6e-47ad-a751-ac81e70f7ea2',
    idMethod,
    puzzle,
    group: 'Flipped Edges',
    setup: "L' U' L R U R' L' U' L R U R'",
    algs: [
      { moves: "R U' R' L' U L R U' R' L' U L", id: '3c69bb0f-3275-4c99-8304-0fad41594a0f' },
      { moves: "L' U L R U' R' L' U L R U' R'", id: '400d8bb2-f5d5-4589-b872-d329c6b5c208' },
      { moves: "L R U' R' L' U L R U' R' L'", id: 'c55a110b-557d-4ddd-b366-49435499798c' },
      { moves: "R' L' U L R U' R' L' U L R", id: 'c6f011ad-1265-4856-bc3a-96379215d20f' }
    ]
  },
  {
    name: 'Right Polish Flip',
    id: '8a6c9fe6-e460-48e1-b0a9-d55351aca6a1',
    idMethod,
    puzzle,
    group: 'Polish Flip',
    setup: "U L' U L R U R'",
    algs: [
      { moves: "R U' R' L' U' L", id: 'c035f40e-d72d-4306-b317-3e53b3059db4' },
      { moves: "U L' U' L U R U' R'", id: '8f4f8570-7e37-4d6c-b3b2-8fdfc005e6e8' },
      { moves: "U R U' R' U' L R' L' R", id: '2ef273cb-b15e-4b2b-9b32-42929dd73997' },
      { moves: "U' L R' L' R U' L' U' L", id: '1a6757b3-15de-4342-bfdb-689aa2efbf4a' },
      { moves: "U' L R U' R' L' U' L U L'", id: 'ec35b24a-293a-473f-b700-e5cf1646e5ab' },
      { moves: "R' L' U L R U' R' U R", id: '2f0f4dba-2ab3-4d1d-aadb-548610efd6f8' }
    ]
  },
  {
    name: 'Left Polish Flip',
    id: '9b90b961-6ad4-4261-ba21-bfaa26f11410',
    idMethod,
    puzzle,
    group: 'Polish Flip',
    setup: "U' R U' R' L' U' L",
    algs: [
      { moves: "L' U L R U R'", id: 'beb3cbf9-0f05-4a3a-8bc3-005bb7c2fba0' },
      { moves: "U' R U R' U' L' U L", id: '6e6fe3a2-46a2-4784-b8cf-6c7db936b7d0' },
      { moves: "U' L' U L U R' L R L'", id: '641e26e0-a7c2-404e-8b36-27c4d9e71a2c' },
      { moves: "U R' L R L' U R U R'", id: '670ef476-75f6-447e-993c-dcc4b83d22a6' },
      { moves: "L R U' R' L' U L U' L'", id: '0ca72001-5bc5-4933-8af2-debb25a13537' },
      { moves: "U R' L' U L R U R' U' R", id: 'ef81c45b-b548-4909-a1ec-d6382ce732ae' }
    ]
  },
  {
    name: 'SUS',
    id: '23dd705d-32cf-41e9-a944-62c7d0486575',
    idMethod,
    puzzle,
    group: 'Polish Flip',
    setup: "U' L R' L' R U L R' L' R",
    algs: [
      { moves: "R' L R L' U' R' L R L'", id: '924da25c-51c0-4a12-b772-a2996879e9f7' },
      { moves: "R U' R2' L R L2' U' L", id: '3f726b80-5a74-408f-ac25-94a02fbd17d9' },
      { moves: "L' U' L R U' R2' L R L'", id: '2720c4b2-aa2e-4808-8b89-9c7f1d4ba130' },
      { moves: "L R U' R2' L R L2'", id: 'c2f74613-2916-4713-a127-f8d39cba828d' },
      { moves: "R2' L R L2' U' L R", id: 'bb2d3bc3-9c7d-46bb-9901-f022d7146bdc' }
    ]
  },
  {
    name: 'Anti SUS',
    id: '4d13083e-8792-4458-9f44-cf5bd4091781',
    idMethod,
    puzzle,
    group: 'Polish Flip',
    setup: "U R' L R L' U' R' L R L'",
    algs: [
      { moves: "L R' L' R U L R' L' R", id: 'e2338727-4e42-4e3c-b4dd-f4f6018cd94f' },
      { moves: "L' U L2 R' L' R2 U R'", id: 'efe23980-6103-49cc-ae74-d00b6975f7a1' },
      { moves: "R U R' L' U L2 R' L' R", id: '1640dcc5-7efc-46aa-9872-c7b4098bffe1' },
      { moves: "L2 R' L' R2 U R' L'", id: 'cf8cb83b-af51-458c-a4f9-5cd7cea166db' },
      { moves: "R' L' U L2 R' L' R2", id: '5238a80f-2e01-4eed-9943-42ad8af9e141' }
    ]
  },
  {
    name: 'Good Niky',
    id: 'bd5214ee-8cc2-475d-933a-33d9a634defd',
    idMethod,
    puzzle,
    group: 'Separated Bar',
    setup: "L' U' L R U R'",
    algs: [
      { moves: "R U' R' L' U L", id: 'a7702645-7191-4314-bd54-5c692c95a813' },
      { moves: "U R U R' L' U' L", id: 'c55c0abe-1287-40af-a624-eaf3dd9c2907' },
      { moves: "L' B' U B L", id: 'd76518b4-a73d-46b2-83f2-702e3924ad36' },
      { moves: "R B U B' R'", id: 'c3741434-b601-463d-a830-6446bb1cfcad' },
      { moves: "L R U R' L'", id: '0ee083a2-7306-43a1-8717-55c553fb2fb3' },
      { moves: "R' L' U L R", id: 'cb9e4972-7ecc-48af-ba77-bc6205e4ea85' }
    ]
  },
  {
    name: 'Good Sochi',
    id: '46cb8e45-567f-4e49-8572-d9347296f36e',
    idMethod,
    puzzle,
    group: 'Separated Bar',
    setup: "R U R' L' U' L",
    algs: [
      { moves: "L' U L R U' R'", id: '23ff066f-37ee-4616-9342-0df98682217b' },
      { moves: "U' L' U' L R U R'", id: 'bc1406dd-71dd-46bf-b8ec-5e718fe810d0' },
      { moves: "L' B' U' B L", id: 'dd474080-3600-4cfa-840a-ccb74a8c0616' },
      { moves: "R B U' B' R'", id: 'd7b6273f-46ab-4e3b-ba28-5270ae9fc00f' },
      { moves: "L R U' R' L'", id: 'ca63766c-6d27-4d2d-828c-e42b9bd38897' },
      { moves: "R' L' U' L R", id: '3869e003-e15b-4094-a1af-175b2ae0da4d' }
    ]
  },
  {
    name: 'Super Sledge',
    id: '794b9541-b6e8-4929-a386-828e0129a75a',
    idMethod,
    puzzle,
    group: 'Separated Bar',
    setup: "U' L R' L' R2 U R'",
    algs: [
      { moves: "R U' R2' L R L'", id: 'bc7a2489-991f-4ea4-a5c1-e339d44da56a' },
      { moves: "U' L R' L' R2 U R'", id: '415dc98c-b661-4a73-a75d-615153ea4cd1' },
      { moves: "R' L R2 U R' U' L'", id: '872c88ac-1346-4462-ab25-715eb4a3ae85' },
      { moves: "L U R U' R2' L' R", id: '87affc02-1d41-465e-aab7-3f3b40de31f2' },
      { moves: "L U R' L R L2'", id: 'ea10dcaf-927f-494b-ba0c-5966f486b0a5' },
      { moves: "U L2 R' L' R U' L'", id: '76359d68-8529-4d73-930b-0ddd0ce81ec4' },
      { moves: "R' L' U L2 R' L' R U' R", id: '6844e5f1-82f2-403e-ac3b-ea0d5e7dab3a' }
    ]
  },
  {
    name: 'Super Hedge',
    id: 'dd255111-0b82-4c88-9283-45c1bae386bb',
    idMethod,
    puzzle,
    group: 'Separated Bar',
    setup: "R' U' L' U L2 R L'",
    algs: [
      { moves: "L' U L2' R' L' R", id: '895dfccb-fc01-4c1e-8586-9ae749c419d8' },
      { moves: "U R' L R L2' U' L", id: 'a20a8149-ba13-4ecb-8929-dcdbeced0f25' },
      { moves: "R' U' L' U L2 R L'", id: 'ab4f730c-7215-4c7c-a4c8-a4e736f8c14d' },
      { moves: "L R' L2' U' L U R", id: '9aa25562-7af9-4a34-b450-aaed097e76f4' },
      { moves: "L R U R2' L R L' U L'", id: '30f4c4dc-6d82-45b8-a058-b311f620cded' },
      { moves: "R' U' L R' L' R2", id: 'd6ceb7d9-afef-4f7c-8986-b5a45556b4e0' }
    ]
  },
  {
    name: 'Bad Niky',
    id: '0b22f93b-a16a-4261-9895-9a63c5be49cd',
    idMethod,
    puzzle,
    group: 'Separated Bar',
    setup: "U' L' U' L U R U R'",
    algs: [
      { moves: "R U' R' U' L' U L", id: '722f38dd-4597-4128-bb75-8ed711449309' },
      { moves: "U R U R' U' L' U' L", id: 'f8ac2a78-495e-4062-9dd8-4841acc37670' },
      { moves: "U L U R U' R' U' L'", id: 'a8adcb50-fdf4-417a-9bae-24169811818c' },
      { moves: "R' U' L' U' L U R", id: 'a0d1f12a-327a-4675-8fb1-5d5ed0395ac1' }
    ]
  },
  {
    name: 'Bad Sochi',
    id: 'cce20543-f5ef-4e56-a956-4a4bd27d82cc',
    idMethod,
    puzzle,
    group: 'Separated Bar',
    setup: "U R U R' U' L' U' L",
    algs: [
      { moves: "L' U L U R U' R'", id: 'f9218d34-9ec9-4784-8221-3996796f2692' },
      { moves: "U' L' U' L U R U R'", id: '43cec68d-2853-41a4-8e55-55acb46798ed' },
      { moves: "L U R U R' U' L'", id: '096d2dbb-b7d2-4417-98ef-6915eea06d93' },
      { moves: "U' R' U' L' U L U R", id: '08e9aab0-4e03-430f-9eb4-940986addc47' }
    ]
  },
  {
    name: 'Right Spam',
    id: 'a3e67fa1-3cae-4e27-addb-611552dc5a43',
    idMethod,
    puzzle,
    group: 'Connected Bar',
    setup: "R U R' L' U' L R U R' U'",
    algs: [
      { moves: "R U R' U R' L R L'", id: '1e51e58a-8b0d-4a4a-b488-2c9ccb34f42e' },
      { moves: "U R U' R' L' U L R U' R'", id: 'c707d7ec-7fde-4b53-866b-04b75f2f3406' },
      { moves: "U' L' U' L2 R' L' R2 U R'", id: '850e8594-48fa-4b02-a898-b3c51b130884' },
      { moves: "U' L R' L' R2 U R' L' U' L", id: '7350c698-6f07-4952-a12c-29f8c40a2826' },
      { moves: "L U R U' R' U L'", id: 'b675f702-136d-478a-b4fc-a5a91b07c598' },
      { moves: "U L U' R U' R' L'", id: 'fbce4cab-a991-4743-92a1-8a882dfe1258' },
      { moves: "R' L' U L2 R' L' R U R", id: 'b99edf18-1710-4510-8305-7d6ebeb1c29e' }
    ]
  },
  {
    name: 'Left Spam',
    id: 'c212aeff-4eb3-48e2-983e-dc4ad7e004cb',
    idMethod,
    puzzle,
    group: 'Connected Bar',
    setup: "L' U' L R U R' L' U' L U",
    algs: [
      { moves: "L' U' L U' L R' L' R", id: '617dec50-09f6-43ad-80c0-3bbebd482b66' },
      { moves: "U' L' U L R U' R' L' U L", id: 'e4753adc-627f-46d3-aa36-b74ae2649b65' },
      { moves: "U R U R2' L R L2' U' L", id: '9d6055a8-c8d4-4852-8176-29195e78325b' },
      { moves: "U R' L R L2' U' L R U R'", id: 'abfb6c04-7b17-494d-bff0-b18ea65deb42' },
      { moves: "L R U' R2' L R L' U' L'", id: 'f15082cf-5506-4556-9c46-984ec5772e4b' },
      { moves: "R' U' L' U L U' R", id: '02b5b529-7257-490c-98ac-67a1de71eb69' },
      { moves: "U' R' U L' U L R", id: '881d3461-74bf-4772-8d3d-909183130c04' },
      { moves: "U' R' U' L R L' U' L' U L", id: '694169bc-51c6-496e-901c-4b420ea030f9' }
    ]
  },
  {
    name: 'Bad Sledge',
    id: 'f46c937c-ab5c-4eca-9cd5-485449d4fd8c',
    idMethod,
    puzzle,
    group: 'Connected Bar',
    setup: "U R U R' U R' L R L'",
    algs: [
      { moves: "L R' L' R U' R U' R'", id: '3d0eb946-3ed3-42e7-b300-800695fe2098' },
      { moves: "U R U R' L' U' L R U R'", id: 'c19ad7ac-6e71-4441-800b-b8b995e59857' },
      { moves: "R U' R2' L R L2' U L", id: '59cbcee8-adf9-4f94-82a4-d8dc6586a3d9' },
      { moves: "U' L R' L' R2 U R' U' L' U L", id: '65b90d70-6dec-49f6-865a-ab583b07eaf2' },
      { moves: "L R U R' U L'", id: '3b8df15d-0cd3-4b4d-a975-e414ca0f299e' },
      { moves: "U' L U' R U R' U' L'", id: 'd09e85db-ad19-4343-80fb-f0d2f8b76da2' },
      { moves: "R' U' R' L R L2' U' L R", id: '2f2d25a4-37a3-455c-92fa-1812db7dbac0' },
      { moves: "U' R2' L R L2' U' L U' R", id: 'e17514e5-6daf-4b99-b4f9-b53325f0eefc' }
    ]
  },
  {
    name: 'Bad Hedge',
    id: '756f3ee7-fb61-4fb2-9734-65766249a8d1',
    idMethod,
    puzzle,
    group: 'Connected Bar',
    setup: "U' L' U L R U R' L' U L U",
    algs: [
      { moves: "R' L R L' U L' U L", id: 'b181121a-6364-4354-a8a4-b88360fc7902' },
      { moves: "U' L' U' L R U' R' L' U' L", id: '2963ad4c-9f3b-4182-9334-54f8413b8ea7' },
      { moves: "L' U L2 R' L' R2 U' R'", id: 'fa88c5dc-911f-4012-9f28-e3ff893fa0fb' },
      { moves: "U R' L R L2' U' L U R U' R'", id: 'e5f70a00-5daf-4e58-a348-a25b802524e6' },
      { moves: "L U L R' L' R2 U R' L'", id: 'c7bde471-cd33-41a1-86d2-e0713a6635b5' },
      { moves: "U L2 R' L' R2 U R' U L'", id: '0780b748-b7db-4cd6-ae4b-4afc5673c74a' },
      { moves: "R' L' U' L U' R", id: 'c527b400-a429-4d6d-a54b-04511374f743' },
      { moves: "U R' U L' U' L U R", id: '5fc34def-34f0-495f-9cf7-db32b434ffa1' }
    ]
  },
  {
    name: 'Bad Sexy',
    id: 'a4e94c8a-a253-480f-8a9a-49fed5c8eb18',
    idMethod,
    puzzle,
    group: 'No Bar',
    setup: "R U R' U L' U L",
    algs: [
      { moves: "L' U' L U' R U' R'", id: '47dad3f1-5fcf-42ed-bf67-5c015e516f08' },
      { moves: "U L2 R' L' R2 U' R' L'", id: 'f0ad49b2-4c93-413d-9f88-b1418db602ed' },
      { moves: "R' L' U' L2 R' L' R2", id: '63166776-35a5-4116-acda-7fb4d9b96880' }
    ]
  },
  {
    name: 'Bad Ugly',
    id: '3723e092-4dfa-46e4-b091-5fc2be4e887b',
    idMethod,
    puzzle,
    group: 'No Bar',
    setup: "L' U' L U' R U' R'",
    algs: [
      { moves: "R U R' U L' U L", id: '8984838d-820d-4910-9ef9-cffafd565dcc' },
      { moves: "L R U R2' L R L2'", id: '9022affb-5dfc-4668-a9ce-8f090fd00aab' },
      { moves: "U' R2' L R L2' U L R", id: '537679e3-2130-4e2b-9749-df0dbedf2350' }
    ]
  },
  {
    name: 'Bad Righty',
    id: 'c99eb39e-81c0-4f24-96e9-9ffd058af852',
    idMethod,
    puzzle,
    group: 'No Bar',
    setup: "U R U' R' U L' U' L",
    algs: [
      { moves: "L' U L U' R U R'", id: '3c9591b9-af13-40a4-904b-6db7bfd3f530' },
      { moves: "R' L R L' U R' L R L'", id: '5b22ac9e-be7c-4825-87c7-ce281ffc234d' },
      { moves: "L U' L R' L' R U' L'", id: '362f70af-4e5c-4481-b35a-b09cf935b2ed' },
      { moves: "U L U' L' U L R U' R' L'", id: 'ade04a4b-5cab-4b79-9dec-78dcfb2a32cb' },
      { moves: "R' U' L R' L' R U' R", id: 'e5ab0080-ab9b-42fe-b885-5b6f6e6b1fae' }
    ]
  },
  {
    name: 'Bad Lefty',
    id: 'a9967695-d0d1-413e-b4c3-a007781f0337',
    idMethod,
    puzzle,
    group: 'No Bar',
    setup: "U' L' U L U' R U R'",
    algs: [
      { moves: "R U' R' U L' U' L", id: '474e7af4-c6b0-4d31-bec6-0841b6d3f0aa' },
      { moves: "L R' L' R U' L R' L' R", id: '299facb5-5825-4108-816a-a239fbdc2ca3' },
      { moves: "L U R' L R L' U L'", id: '7d7a74ab-261e-4e52-bfba-d44db7c0d12b' },
      { moves: "R' U R' L R L' U R", id: '1683cfa0-72f1-4f12-8e27-5000ca4ff641' },
      { moves: "U' R' U R U' R' L' U L R", id: '0743673c-d167-4aa6-bebf-b6c7de0b45d9' }
    ]
  },
  {
    name: 'Double Sexy',
    id: '8a492f45-b72b-415a-9bd1-cb93d3f2d25b',
    idMethod,
    puzzle,
    group: 'No Bar',
    setup: "U' R U' R' U R U R'",
    algs: [
      { moves: "R U' R' U' R U R'", id: 'fd6b185e-eac0-44a8-ac5e-14764859ae1a' },
      { moves: "L' U' L U R' L R L'", id: 'a032f343-6303-4dee-a4d7-a8d8f2fea619' },
      { moves: "U' R U' R' U R U R'", id: '20e7193c-0535-4553-a76f-ab48e0371a23' },
      { moves: "U R U R' U' R U' R'", id: 'bf7c441b-a166-4978-9d78-b7d3b90d2ed2' },
      { moves: "L U' L' U' L U L'", id: '96719d24-5fc5-40ab-9639-d0d216dbc08e' },
      { moves: "U L U L' U' L U' L'", id: '81d112b9-5dfa-49a0-b271-976fd6d49c6b' },
      { moves: "U' L U' L' U L U L'", id: 'c6d2feb3-27af-4808-a3ee-d1b95ad2a559' }
    ]
  },
  {
    name: 'Double Ugly',
    id: '72a1f168-2238-4345-bfe7-dcf01be5af4c',
    idMethod,
    puzzle,
    group: 'No Bar',
    setup: "U L' U L U' L' U' L",
    algs: [
      { moves: "L' U L U L' U' L", id: '86ef53d0-6b3d-4ae2-8289-6e2916255926' },
      { moves: "R U R' U' L R' L' R", id: '98d72c25-075f-42a3-92b9-7925dc163397' },
      { moves: "U L' U L U' L' U' L", id: '31a5509c-a988-46c9-91ce-999fac890ebd' },
      { moves: "U' L' U' L U L' U L", id: '5c35d120-fd90-4bd2-9e6f-ac4aecbe70b6' },
      { moves: "R' U R U R' U' R", id: '7b6c0e8c-c98d-43fb-9a72-a4d0e471d6c8' },
      { moves: "U R' U R U' R' U' R", id: '0329a324-59e8-4b65-aa93-5eed2910adc9' },
      { moves: "U' R' U' R U R' U R", id: '996c777a-629d-4808-9d9a-383bb00356a5' }
    ]
  }
]
