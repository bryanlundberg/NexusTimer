import { locales } from '@/shared/config/i18n/locales'

export const REPO_URL = 'https://github.com/bryanlundberg/NexusTimer'
export const DISCORD_URL = 'https://discord.gg/eCgTKcavec'

export const ABOUT = {
  metaTitle: 'About us - Nexus Timer',
  metaDescription:
    'How Nexus Timer started, the philosophy behind it, the team that builds it, and the technology and open source libraries that power it.',
  back: 'Back to home',
  label: 'About us',
  title: 'About Nexus Timer',
  intro:
    'Nexus Timer is a free, open source speedcubing timer. It has been in development since January 2023, is maintained by Bryan Lundberg and has received contributions from more than 25 developers.'
} as const

export const ORIGIN = {
  label: 'Origin',
  title: 'How the project started',
  paragraphs: [
    'Development started in January 2023 under the name CubeStats, an Express and MongoDB app for recording solve times and statistics. It required an account to save any data and every page was rendered from server templates, which made new features slow to build. Work stopped in March 2023.',
    'In September 2023 the project was restarted to take part in Hacktoberfest, the annual event where open source projects receive contributions from new developers during October. The codebase was rewritten in Next.js and TypeScript, solves moved to local storage so accounts were no longer required, and the project was renamed Nexus Timer.',
    'During October 2023 ten developers contributed fixes and new features. Since then the project has been developed in the open, with external contributions reviewed and merged alongside the core work.'
  ],
  image: { src: '/landing/ho2023.webp', alt: 'Hacktoberfest 2023 banner', width: 2560, height: 1309 }
} as const

export const MOTIVATION = {
  label: 'Philosophy',
  title: 'Our philosophy',
  intro: 'Four principles guide every decision we make about Nexus Timer.',
  items: [
    {
      icon: 'code',
      title: 'Open source',
      text: 'The full codebase is public under the GPL-3.0 license. Anyone can use, modify and redistribute it, provided that every distributed version remains open source under the same license.'
    },
    {
      icon: 'gift',
      title: 'Free access to all features',
      text: 'Every feature is available to every user at no cost. Any future paid option will be voluntary, never a requirement to access a feature.'
    },
    {
      icon: 'shield',
      title: 'No data sales',
      text: 'Your data is never sold, shared with third parties or commercialized in any form.'
    },
    {
      icon: 'quality',
      title: 'Exceptional quality',
      text: 'Quality is our axiom. Every design, feature and interaction is derived from it.'
    }
  ]
} as const

export const TEAM = {
  label: 'Team',
  title: 'The people behind Nexus Timer',
  maintainer: {
    name: 'Bryan Lundberg',
    role: 'Creator and maintainer, México',
    handle: 'bryanlundberg',
    github: 'https://github.com/bryanlundberg',
    avatar: 'https://github.com/bryanlundberg.png?size=320',
    paragraphs: [
      'I’m Bryan, a software developer from México and the creator of Nexus Timer. I have written most of the codebase since the first commit, and today I lead development, review contributions and run the infrastructure.',
      'My goal goes beyond building a good timer. I’m building the all-in-one ecosystem for speedcubing. Today that means a timer, training tools, algorithms, social features, leaderboards, achievements and user comparisons in one place. Next come PvP, online minigames, threads, tournaments and much more.'
    ]
  },
  contributorsLabel: 'Contributors',
  contributorsText:
    'Bug fixes, features, translations and algorithm sets have been contributed by developers through GitHub pull requests, starting with Hacktoberfest 2023.',
  contributorsLink: 'View all contributors on GitHub',
  contributorsUrl: `${REPO_URL}/graphs/contributors`,
  contributors: [
    'abishek0057',
    'syrok94',
    'Adimaniac31',
    'diwash007',
    'zluipaiva',
    'KriteshTimsina',
    'idrak888',
    'CarlosCRG19',
    'Infinimus01',
    'MatusPe',
    'arashveysi3',
    'avelytchko',
    'Ganesh107',
    'Juudini',
    'Josem1801',
    'lucasfirmo62',
    'myheadisempty',
    'alagappan17',
    'AnuMessi10',
    'davideperez',
    'HpatricioH',
    'NUMS-half',
    'Nokx1z',
    'PrashantDhuri08',
    'sarvesh-official',
    'shaurya5',
    'joserg1801'
  ]
} as const

export const LIBRARIES_SECTION = {
  label: 'Open source',
  title: 'Ecosystem libraries',
  text: 'Core components of Nexus Timer, maintained as standalone libraries that other projects can use.'
} as const

export const STATS = [
  { value: 'Jan 2023', label: 'First commit' },
  { value: '7,500+', label: 'Commits' },
  { value: '5,000+', label: 'Algorithms' },
  { value: String(locales.length), label: 'Languages' }
] as const

export interface GrowthPoint {
  month: string
  total: number
}

export const GROWTH = {
  label: 'Growth',
  title: 'Registered accounts',
  text: 'Accounts were introduced in late 2024 and are optional, so this chart only counts users who created one. Registered accounts grew from 129 at the end of 2025 to 671 in October 2026.',
  seriesLabel: 'Registered accounts',
  monthLabel: 'Month',
  tableLabel: 'Show the data',
  months: [
    { month: '2024-10', total: 3 },
    { month: '2024-11', total: 14 },
    { month: '2024-12', total: 18 },
    { month: '2025-01', total: 21 },
    { month: '2025-02', total: 23 },
    { month: '2025-03', total: 23 },
    { month: '2025-04', total: 24 },
    { month: '2025-05', total: 25 },
    { month: '2025-06', total: 26 },
    { month: '2025-07', total: 28 },
    { month: '2025-08', total: 34 },
    { month: '2025-09', total: 61 },
    { month: '2025-10', total: 95 },
    { month: '2025-11', total: 113 },
    { month: '2025-12', total: 129 },
    { month: '2026-01', total: 147 },
    { month: '2026-02', total: 154 },
    { month: '2026-03', total: 175 },
    { month: '2026-04', total: 209 },
    { month: '2026-05', total: 291 },
    { month: '2026-06', total: 360 },
    { month: '2026-07', total: 414 },
    { month: '2026-08', total: 493 },
    { month: '2026-09', total: 581 },
    { month: '2026-10', total: 671 }
  ] as GrowthPoint[]
}

export const LIBRARIES = [
  {
    name: 'tnoodle-lib-rs',
    text: 'A Rust port of the WCA’s official TNoodle scrambler. It generates every scramble in the app for 14 puzzles, both in the browser and on the server.',
    tags: ['Rust', 'WebAssembly'],
    href: `${REPO_URL}/tree/main/crates/tnoodle-lib-rs`
  },
  {
    name: 'cube-solver-rs',
    text: 'The solver behind cross and xcross hints for all six colors and the transitions between trainer cases. It shares its cube model with tnoodle-lib-rs.',
    tags: ['Rust', 'WebAssembly'],
    href: `${REPO_URL}/tree/main/crates/cube-solver-rs`
  },
  {
    name: 'cube-state-engine',
    text: 'A compact in-memory 3x3 model that tracks cube state move by move. It powers the virtual cube, smart cube sessions, solve replays and phase splits.',
    tags: ['TypeScript', 'npm'],
    href: 'https://github.com/bryanlundberg/cube-state-engine'
  },
  {
    name: 'cubing.js, slim fork',
    text: 'A fork of cubing.js with a reduced puzzle set and smaller on-demand chunks. It renders every 3D cube in the app, from scramble previews to replays.',
    tags: ['Fork', 'npm'],
    href: 'https://github.com/bryanlundberg/cubing.js'
  },
  {
    name: 'smartcube-web-bluetooth',
    text: 'A fork of the Web Bluetooth library for smart cubes and timers from multiple vendors, maintained for the app’s smart cube integration.',
    tags: ['Fork', 'Web Bluetooth'],
    href: 'https://github.com/bryanlundberg/smartcube-web-bluetooth'
  }
] as const

export const CTA = {
  title: 'Get involved',
  text: 'Most new features start as a request on Discord or an issue on GitHub. Feedback, bug reports and pull requests are welcome.',
  app: 'Open the timer',
  discord: 'Join the Discord',
  github: 'View on GitHub'
} as const
