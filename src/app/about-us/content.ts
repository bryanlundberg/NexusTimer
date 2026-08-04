export const ABOUT = {
  metaTitle: 'About us - Nexus Timer',
  metaDescription:
    'What changed in Nexus Timer each year, from the first Express version in January 2023 to the Android app and smart cube support.',
  back: 'Back to home',
  label: 'About us',
  title: 'How Nexus Timer got here',
  intro:
    'Nexus Timer started in January 2023 and has been rewritten twice since. This page goes through what changed each year, with screenshots of how it looked at the time.',
  timelineLabel: 'The story so far'
} as const

export interface Era {
  year: string
  date: string
  title: string
  text: string
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
    title: 'The first version',
    text: 'An Express app with Pug templates: It handled one thing, storing solves per user, and everything later was built on top of that.',
    images: [],
    ratio: 1.6,
    accent: 'var(--cube-blue)'
  },
  {
    year: '2023',
    date: 'September 2023',
    title: 'Rewritten on Next.js',
    text: 'Every change to the Pug version meant editing a template, a route and a separate script by hand, which did not scale. In September it was rewritten on Next.js 13 with React, TypeScript and Tailwind, moving rendering server side and putting the whole app under a type checker for the first time. Statistics went from a plain list to calculated averages, ao5 through ao100, deviation and personal bests. October we got the first pull requests from people wanting to contribute.',
    images: shots('v1', 4),
    ratio: 1.18,
    accent: 'var(--cube-green)'
  },
  {
    year: '2024',
    date: '2024',
    title: 'Groundwork',
    text: 'Most of 2024 went into work that does not show on screen. How solves are stored was changed so large sessions load quickly, the translation setup was replaced with one that could handle more than a few languages, end to end tests were added, and the average calculations were corrected to follow WCA rules. Clock was added as a category. Fewer features than any other year, and the reason the next one could move quickly.',
    images: shots('v2', 5),
    ratio: 1.05,
    accent: 'var(--cube-orange)'
  },
  {
    year: '2025',
    date: '2025',
    title: 'Multiplayer, trainer, leaderboards',
    text: 'Development picked up in May and stayed there. Multiplayer rooms shipped in August. The algorithm trainer arrived in September, measuring execution time per case across methods. Leaderboards followed in October for keyboard solves.',
    images: shots('v4', 4),
    ratio: 1.5,
    accent: 'var(--cube-yellow)'
  },
  {
    year: '2025',
    date: 'Late 2025',
    title: 'New navigation and layout',
    text: 'The navigation had been designed when the app was much smaller and no longer fit what it did. The tabs were replaced with a permanent sidebar, sections were grouped by purpose (timer, training, community, multiplayer), and the statistics screens were rebuilt to fit more per page.',
    images: shots('v6', 6),
    ratio: 1.6,
    accent: 'var(--primary)'
  },
  {
    year: '2026',
    date: '2026',
    title: 'Android and smart cubes',
    text: 'The Android app was published on Google Play in May. Smart cube support was extended to the trainer, so cases can be drilled with a Bluetooth cube instead of the keyboard. A statistics tab was added to regular solves.',
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
      text: 'The whole codebase is public. Anyone can read it, fork it, question it, or send a pull request. Several of the features you use came in that way.'
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
