import { locales } from '@/shared/config/i18n/locales'

export const ABOUT = {
  metaTitle: 'About us - Nexus Timer',
  metaDescription:
    'How Nexus Timer grew from a small Express app called CubeStats in January 2023 into a timer with multiplayer, an Android app and smart cube support.',
  back: 'Back to home',
  label: 'About us',
  title: 'How a solve log became Nexus Timer',
  intro:
    'Nexus Timer started in January 2023 under another name, as a small app for saving solve times. Since then it has been thrown out and rebuilt, gone quiet for months at a time, and kept coming back with more in it. This is how that happened, year by year, with screenshots from each stage.',
  timelineLabel: 'The story so far'
} as const

export const STATS = [
  { value: 'Jan 2023', label: 'First commit' },
  { value: '6,000+', label: 'Commits' },
  { value: '25+', label: 'Contributors' },
  { value: String(locales.length), label: 'Languages' }
] as const

export interface Era {
  year: string
  date: string
  title: string
  paragraphs: string[]
  highlights: string[]
  images: string[]
  ratio: number
  accent: string
}

function shots(dir: string, count: number) {
  return Array.from({ length: count }, (_, i) => `/about/${dir}/${i + 1}.webp`)
}

export const ERAS: Era[] = [
  {
    year: '2023',
    date: 'January 2023',
    title: 'It started as CubeStats',
    paragraphs: [
      'The first version had a different name, a different stack, and none of the code that runs today. CubeStats was an Express server rendering Pug templates on top of MongoDB, and you needed an account before you could save a single time. That is where the first days went: registration, login, hashed passwords and sessions.',
      'The timer showed up about two weeks later, along with a scramble generator and pages for OLL and PLL with a progress bar for each set. By March there were also profiles with statistics, COLL, and a dark theme.',
      'It was also getting hard to change. Every new screen meant a template, a route and a separate script, all kept in sync by hand. The last commit went in on March 13, and after that the repository sat untouched for six months.'
    ],
    highlights: ['Accounts and sessions', 'Scramble generator', 'OLL, PLL and COLL', 'Profile statistics'],
    images: [],
    ratio: 1.6,
    accent: 'var(--cube-blue)'
  },
  {
    year: '2023',
    date: 'September 2023',
    title: 'Starting over',
    paragraphs: [
      'On September 10 the old code was deleted and a Next.js app took its place, written in TypeScript with React and Tailwind. The bigger change was what it left out. There was no database and no sign up. Solves lived in the browser, so the timer was ready the moment the page loaded. Nine days in, CubeStats was renamed Nexus Timer.',
      'The timer screen got a full set of averages, ao5 through ao100, next to deviation and the current best. In October the first pull requests from other people came in, and it became the busiest month the project had seen. The option to hide the time while you solve, still in settings today, arrived that way.',
      'By the end of the year it had confetti for a new personal best, an alert for a new best average, and a fullscreen mode.'
    ],
    highlights: ['No sign up', 'ao5 to ao100', 'First pull requests', 'PB confetti'],
    images: shots('v1', 4),
    ratio: 1.18,
    accent: 'var(--cube-green)'
  },
  {
    year: '2024',
    date: '2024',
    title: 'Groundwork',
    paragraphs: [
      'The year opened with the change that mattered most to anyone with a lot of solves. Storage moved from localStorage to IndexedDB, and large sessions stopped dragging the app down. The same update added imports from csTimer, CubeDesk and Twisty Timer, so switching from another timer no longer meant starting from zero. Clock was added as a category a week later.',
      'After that the pace dropped, and most of what happened is invisible from the outside. Averages were corrected, end to end tests were written, and the translation setup was replaced with one that could handle many more languages. The visible part came in the fall: a 3D preview for scrambles, a move to nexustimer.com, and accounts again, this time optional, through Google sign in. A first version of Stackmat support closed out the year.',
      'Fewer features than any other year, and the reason the next one could move as fast as it did.'
    ],
    highlights: ['IndexedDB storage', 'Imports from other timers', 'Clock', 'Stackmat'],
    images: shots('v2', 5),
    ratio: 1.05,
    accent: 'var(--cube-orange)'
  },
  {
    year: '2025',
    date: '2025',
    title: 'Multiplayer, algorithms, leaderboards',
    paragraphs: [
      'The first months were quiet. In May development picked up, and this time it did not slow back down. The timer core was rewritten for better accuracy, DNF penalties were added, signed in users got cloud backups, and profiles made it possible to see how other people were doing.',
      'Multiplayer rooms shipped at the end of August, so people could race each other in real time. September was the busiest month so far: the sidebar in these screenshots, a virtual cube you can solve with the keyboard, and an algorithm section that started with OLL, PLL and COLL and kept growing. Leaderboards opened in October, starting with keyboard solves.',
      'By December the screen stayed awake while the timer was running, which sounds minor until your phone locks halfway through a solve.'
    ],
    highlights: ['Cloud backups', 'Multiplayer rooms', 'Virtual cube', 'Leaderboards'],
    images: shots('v4', 4),
    ratio: 1.5,
    accent: 'var(--cube-yellow)'
  },
  {
    year: '2026',
    date: '2026',
    title: 'Android and smart cubes',
    paragraphs: [
      'The Android app went up on Google Play in May, the same month the algorithm trainer got a page of its own. In June the timer learned to talk to smart cubes, so a Bluetooth cube could be used for regular solves.',
      'In July those two came together, and trainer cases can now be drilled on a smart cube instead of the keyboard. The statistics page was rebuilt the same month.',
      'The rest of the summer went into smaller things that add up: tiers for achievements, F2L and 5x5 algorithm sets, an editor for virtual cube key bindings, and a Ukrainian translation sent in as a pull request.'
    ],
    highlights: ['Android app', 'Smart cubes', 'Algorithm trainer', 'New statistics'],
    images: shots('v7', 5),
    ratio: 1.6,
    accent: 'var(--cube-red)'
  }
]

export const MISSION = {
  label: 'Why it works this way',
  title: 'Free, open, and free of ads',
  items: [
    {
      icon: 'gift',
      title: 'Free, and staying that way',
      text: 'Cubing already costs enough in hardware. Timing your solves should not be behind a subscription, so every feature is available to everyone.'
    },
    {
      icon: 'code',
      title: 'Open source',
      text: 'The whole codebase is public. Anyone can read it, fork it, question it, or send a pull request. Hiding the time while solving and the Ukrainian translation both came in that way.'
    },
    {
      icon: 'shield',
      title: 'No ads, no tracking for sale',
      text: 'There are no ads and no data sold to third parties. You can export or delete your solves at any time.'
    }
  ]
} as const

export const CTA = {
  title: 'What comes next',
  text: 'Most of what shipped this year started as someone complaining in Discord or opening an issue. If something bothers you, tell us.',
  app: 'Open the timer',
  discord: 'Join the Discord',
  github: 'Browse the code'
} as const

export const REPO_URL = 'https://github.com/bryanlundberg/NexusTimer'
export const DISCORD_URL = 'https://discord.gg/eCgTKcavec'
