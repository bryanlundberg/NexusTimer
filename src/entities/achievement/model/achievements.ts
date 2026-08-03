import { CUBE_CATEGORIES } from '@/shared/const/cube-categories'
import { Achievement, SolveStats } from './types'
import dayjs from '@/shared/lib/dayjs'
import { Cube } from '@/entities/cube/model/types'

export function computeSolveStats(cubes: Cube[]): SolveStats {
  const solvesByDate = new Map<string, number>()
  const categoriesWithValidSolves = new Set<string>()

  let totalValid = 0
  let best3x3Single = Infinity
  let best3x3OHSingle = Infinity
  let bldSuccessCount = 0
  let newYearSolveCount = 0
  let max3x3SolvesPerCube = 0
  let currentCleanStreak = 0
  let longestCleanStreak = 0
  let bookmarkCount = 0
  let commentCount = 0
  let replayCount = 0

  for (const cube of cubes) {
    let cube3x3Count = 0

    // Order matters for the clean streak — match a [...all, ...session] traversal.
    const combined = cube.solves.all.concat(cube.solves.session)

    for (let i = 0; i < combined.length; i++) {
      const solve = combined[i]
      if (solve.isDeleted) {
        currentCleanStreak = 0
        continue
      }

      if (solve.bookmark) bookmarkCount++
      if (solve.comment && solve.comment.trim().length > 0) commentCount++
      if (solve.replay) replayCount++

      if (!solve.dnf) {
        totalValid++
        categoriesWithValidSolves.add(cube.category)
        if (cube.category === '3x3') {
          cube3x3Count++
          // Raw time a +2 penalty is deliberately not folded in here.
          if (solve.time < best3x3Single) best3x3Single = solve.time
        }
        if (cube.category === '3x3 OH' && solve.time < best3x3OHSingle) best3x3OHSingle = solve.time
        if (cube.category === '3x3 BLD') bldSuccessCount++
        const date = dayjs(solve.startTime).format('YYYY-MM-DD')
        if (date.endsWith('-01-01')) newYearSolveCount++
        solvesByDate.set(date, (solvesByDate.get(date) ?? 0) + 1)
      }

      if (!solve.dnf && !solve.plus2) {
        currentCleanStreak++
        if (currentCleanStreak > longestCleanStreak) longestCleanStreak = currentCleanStreak
      } else {
        currentCleanStreak = 0
      }
    }

    if (cube3x3Count > max3x3SolvesPerCube) max3x3SolvesPerCube = cube3x3Count
  }

  let longestDateStreak = solvesByDate.size > 0 ? 1 : 0
  if (solvesByDate.size > 1) {
    const sortedDates = Array.from(solvesByDate.keys()).sort()
    let current = 1
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = dayjs(sortedDates[i - 1])
      const curr = dayjs(sortedDates[i])
      if (curr.diff(prev, 'day') === 1) {
        current++
        if (current > longestDateStreak) longestDateStreak = current
      } else {
        current = 1
      }
    }
  }

  let maxSolvesInOneDay = 0
  solvesByDate.forEach((count) => {
    if (count > maxSolvesInOneDay) maxSolvesInOneDay = count
  })

  return {
    totalValid,
    best3x3Single,
    best3x3OHSingle,
    bldSuccessCount,
    newYearSolveCount,
    replayCount,
    max3x3SolvesPerCube,
    categoriesWithValidSolves,
    maxSolvesInOneDay,
    longestDateStreak,
    longestCleanStreak,
    bookmarkCount,
    commentCount
  }
}

const seconds = (ms: number) => (Number.isFinite(ms) ? `${(ms / 1000).toFixed(2)}s` : '--')

export const ACHIEVEMENTS_CONFIG: Achievement[] = [
  {
    id: 'public-sponsor',
    title: 'Project Patron',
    description: 'Sponsored the project to help keep the engine running.',
    icon: 'icons8-favorite-50.png',
    color: 'rgba(255,105,180,0.8)',
    type: 'granted'
  },
  {
    id: 'contributor',
    title: 'Contributor',
    description: 'Contributed code, translations or assets to the project.',
    icon: 'icons8-decentralized-network-50.png',
    color: 'rgba(34,197,94,0.8)',
    type: 'granted'
  },
  {
    id: 'bug-hunter',
    title: 'Bug Hunter',
    description: 'Found and reported a glitch in the Matrix.',
    icon: 'icons8-bug-50.png',
    color: 'rgba(239,68,68,0.8)',
    type: 'granted'
  },
  {
    id: 'playstore-beta',
    title: 'Play Store Pioneer',
    description: 'Joined the official Play Store beta testing program.',
    icon: 'icons8-google-play-50.png',
    color: 'rgb(220 204 61 / 0.8)',
    type: 'granted'
  },
  {
    id: 'first-year',
    title: 'Early User',
    description: 'Joined during the first year after launch.',
    icon: 'icons8-rook-50.png',
    color: 'rgba(0,191,255,0.8)',
    type: 'computed',
    condition: ({ user }) => dayjs(user.createdAt).isBefore(dayjs('2024-07-11').add(1, 'year'))
  },
  {
    id: 'speed-3x3',
    icon: 'icons8-last-24-hours-50.png',
    type: 'tiered',
    metric: ({ stats }) => stats.best3x3Single,
    compare: 'lt',
    formatValue: seconds,
    tiers: [
      {
        id: 'speed-sub-120',
        level: 1,
        title: 'Cracking the Cube',
        description: 'Solved a 3x3 in under two minutes.',
        threshold: 120000
      },
      {
        id: 'speed-sub-60',
        level: 2,
        title: 'Minute Breaker',
        description: 'Solved a 3x3 in under a minute.',
        threshold: 60000
      },
      {
        id: 'speed-sub-40',
        level: 3,
        title: 'Finger Trickster',
        description: 'Registered a sub-40 second solve on 3x3.',
        threshold: 40000
      },
      {
        id: 'speed-sub-30',
        level: 4,
        title: 'Half Minute Hero',
        description: 'Registered a sub-30 second solve on 3x3.',
        threshold: 30000
      },
      {
        id: 'speed-sub-20',
        level: 5,
        title: 'Twenty Down',
        description: 'Registered a sub-20 second solve on 3x3.',
        threshold: 20000
      },
      {
        id: 'speed-sub-15',
        level: 6,
        title: 'Fifteen Club',
        description: 'Registered a sub-15 second solve on 3x3.',
        threshold: 15000
      },
      {
        id: 'speed-sub-12',
        level: 7,
        title: 'Lookahead Learner',
        description: 'Registered a sub-12 second solve on 3x3.',
        threshold: 12000
      },
      {
        id: 'speed-sub-10',
        level: 8,
        title: 'Speed Demon',
        description: 'Registered a sub-10 second solve.',
        threshold: 10000,
        icon: 'icons8-lightning-48.png'
      },
      {
        id: 'speed-sub-8',
        level: 9,
        title: 'World Class',
        description: 'Registered a sub-8 second solve on 3x3.',
        threshold: 8000,
        icon: 'icons8-crown-50.png'
      },
      {
        id: 'speed-sub-6',
        level: 10,
        title: 'Podium Pace',
        description: 'Registered a sub-6 second solve on 3x3.',
        threshold: 6000,
        icon: 'icons8-winner-50.png'
      }
    ]
  },
  {
    id: 'oh-speed',
    icon: 'icons8-pet-commands-follow-50.png',
    type: 'tiered',
    metric: ({ stats }) => stats.best3x3OHSingle,
    compare: 'lt',
    formatValue: seconds,
    tiers: [
      {
        id: 'oh-sub-120',
        level: 1,
        title: 'Off Hand Awakens',
        description: 'Solved a 3x3 one-handed in under two minutes.',
        threshold: 120000
      },
      {
        id: 'oh-sub-90',
        level: 2,
        title: 'Wobbly Fingers',
        description: 'Registered a sub-90 second solve on 3x3 One-Handed.',
        threshold: 90000
      },
      {
        id: 'oh-sub-60',
        level: 3,
        title: 'Single Minute, Single Hand',
        description: 'Registered a sub-60 second solve on 3x3 One-Handed.',
        threshold: 60000
      },
      {
        id: 'oh-sub-45',
        level: 4,
        title: 'Dexterous',
        description: 'Registered a sub-45 second solve on 3x3 One-Handed.',
        threshold: 45000
      },
      {
        id: 'oh-sub-30',
        level: 5,
        title: 'One Hand Wonder',
        description: 'Registered a sub-30 second solve on 3x3 One-Handed.',
        threshold: 30000,
        icon: 'icons8-knight-shield-50.png'
      },
      {
        id: 'oh-sub-20',
        level: 6,
        title: 'Ambidextrous',
        description: 'Registered a sub-20 second solve on 3x3 One-Handed.',
        threshold: 20000
      },
      {
        id: 'oh-sub-15',
        level: 7,
        title: 'One Hand Master',
        description: 'Registered a sub-15 second solve on 3x3 One-Handed.',
        threshold: 15000,
        icon: 'icons8-physics-50.png'
      }
    ]
  },
  {
    id: 'bld',
    icon: 'icons8-brain-50.png',
    type: 'tiered',
    metric: ({ stats }) => stats.bldSuccessCount,
    compare: 'gte',
    unit: 'BLD solves',
    tiers: [
      {
        id: 'bld-1',
        level: 1,
        title: 'Blindfolded',
        description: 'Completed a successful 3x3 Blindfolded solve.',
        threshold: 1
      },
      {
        id: 'bld-10',
        level: 2,
        title: 'Memory Palace',
        description: 'Completed 10 successful 3x3 Blindfolded solves.',
        threshold: 10
      },
      {
        id: 'bld-50',
        level: 3,
        title: 'Sightless Solver',
        description: 'Completed 50 successful 3x3 Blindfolded solves.',
        threshold: 50
      },
      {
        id: 'bld-250',
        level: 4,
        title: "Mind's Eye",
        description: 'Completed 250 successful 3x3 Blindfolded solves.',
        threshold: 250,
        icon: 'icons8-ghost-50.png'
      }
    ]
  },
  {
    id: 'solves-per-cube',
    icon: 'icons8-pixel-cat-50.png',
    type: 'tiered',
    metric: ({ stats }) => stats.max3x3SolvesPerCube,
    compare: 'gte',
    unit: 'solves on one cube',
    tiers: [
      {
        id: 'cube-100',
        level: 1,
        title: 'Broken In',
        description: 'Logged 100 solves on a single 3x3.',
        threshold: 100
      },
      {
        id: 'cube-500',
        level: 2,
        title: 'Favourite Cube',
        description: 'Logged 500 solves on a single 3x3.',
        threshold: 500
      },
      {
        id: 'cube-1000',
        level: 3,
        title: 'Well Worn',
        description: 'Logged 1,000 solves on a single 3x3.',
        threshold: 1000
      },
      {
        id: 'cube-2500',
        level: 4,
        title: 'Loyal Companion',
        description: 'Logged 2,500 solves on a single 3x3.',
        threshold: 2500
      },
      {
        id: 'cube-5000',
        level: 5,
        title: 'Faithful Puzzle',
        description: 'Logged 5,000 solves on a single 3x3.',
        threshold: 5000
      },
      {
        id: 'cube-9999',
        level: 6,
        title: "It's over 9000!",
        description: 'Completed over 9,999 solves on 3x3 cubes.',
        threshold: 9999,
        icon: 'icons8-mana-50.png'
      },
      {
        id: 'cube-25000',
        level: 7,
        title: 'One Cube to Rule Them All',
        description: 'Logged 25,000 solves on a single 3x3.',
        threshold: 25000,
        icon: 'icons8-metal-music-50.png'
      }
    ]
  },
  {
    id: 'career-solves',
    icon: 'icons8-three-leaf-clover-50.png',
    type: 'tiered',
    metric: ({ stats }) => stats.totalValid,
    compare: 'gte',
    unit: 'solves',
    tiers: [
      {
        id: 'career-10',
        level: 1,
        title: 'First Ten',
        description: 'Completed 10 solves.',
        threshold: 10
      },
      {
        id: 'career-100',
        level: 2,
        title: 'Getting Warm',
        description: 'Completed 100 solves.',
        threshold: 100
      },
      {
        id: 'career-500',
        level: 3,
        title: 'Hooked',
        description: 'Completed 500 solves.',
        threshold: 500
      },
      {
        id: 'career-1000',
        level: 4,
        title: 'Four Digits',
        description: 'Completed 1,000 solves.',
        threshold: 1000
      },
      {
        id: 'career-5000',
        level: 5,
        title: 'Serious Business',
        description: 'Completed 5,000 solves.',
        threshold: 5000
      },
      {
        id: 'career-10000',
        level: 6,
        title: 'Five Figures',
        description: 'Completed 10,000 solves.',
        threshold: 10000
      },
      {
        id: 'career-25000',
        level: 7,
        title: 'The Grinder',
        description: 'Completed 25,000 solves.',
        threshold: 25000
      },
      {
        id: 'career-50000',
        level: 8,
        title: 'Halfway to Legend',
        description: 'Completed 50,000 solves.',
        threshold: 50000
      },
      {
        id: 'career-100000',
        level: 9,
        title: 'Cube Legend',
        description: 'Reached 100,000 career solves.',
        threshold: 100000,
        icon: 'icons8-trophy-50.png'
      },
      {
        id: 'career-250000',
        level: 10,
        title: 'Quarter Million Club',
        description: 'Reached 250,000 career solves.',
        threshold: 250000,
        icon: 'icons8-animated-50.png'
      }
    ]
  },
  {
    id: 'cube-collection',
    icon: 'icons8-shield-50.png',
    type: 'tiered',
    metric: ({ cubes }) => cubes.length,
    compare: 'gte',
    unit: 'cubes',
    tiers: [
      {
        id: 'collector-1',
        level: 1,
        title: 'First Cube',
        description: 'Added your first cube.',
        threshold: 1
      },
      {
        id: 'collector-3',
        level: 2,
        title: 'A Small Shelf',
        description: 'Own at least 3 different cubes.',
        threshold: 3
      },
      {
        id: 'collector-5',
        level: 3,
        title: 'Starter Pack',
        description: 'Own at least 5 different cubes.',
        threshold: 5
      },
      {
        id: 'collector-10',
        level: 4,
        title: 'Growing Collection',
        description: 'Own at least 10 different cubes.',
        threshold: 10
      },
      {
        id: 'collector-25',
        level: 5,
        title: 'Puzzle Collector',
        description: 'Own at least 25 different cubes.',
        threshold: 25,
        icon: 'icons8-money-box-50.png'
      },
      {
        id: 'collector-50',
        level: 6,
        title: 'Cube Hoarder',
        description: 'Own at least 50 different cubes.',
        threshold: 50,
        icon: 'icons8-monster-face-50.png'
      },
      {
        id: 'collector-100',
        level: 7,
        title: 'Museum Curator',
        description: 'Own at least 100 different cubes.',
        threshold: 100,
        icon: 'icons8-scary-tree-50.png'
      }
    ]
  },
  {
    id: 'categories',
    icon: 'icons8-clover-50.png',
    type: 'tiered',
    metric: ({ stats }) => CUBE_CATEGORIES.filter((c) => stats.categoriesWithValidSolves.has(c)).length,
    compare: 'gte',
    unit: 'categories',
    tiers: [
      {
        id: 'categories-2',
        level: 1,
        title: 'Branching Out',
        description: 'Solved in 2 different categories.',
        threshold: 2
      },
      {
        id: 'categories-5',
        level: 2,
        title: 'Multi-Puzzler',
        description: 'Solved in 5 different categories.',
        threshold: 5
      },
      {
        id: 'categories-9',
        level: 3,
        title: 'Well Rounded',
        description: 'Solved in 9 different categories.',
        threshold: 9
      },
      {
        id: 'categories-13',
        level: 4,
        title: 'Polyglot',
        description: 'Solved in 13 different categories.',
        threshold: 13
      },
      {
        id: 'categories-17',
        level: 5,
        title: 'Eventglot',
        description: 'Solved at least one cube in every available category.',
        threshold: 17,
        icon: 'icons8-diversity-50.png'
      }
    ]
  },
  {
    id: 'marathon',
    icon: 'icons8-pet-commands-summon-50.png',
    type: 'tiered',
    metric: ({ stats }) => stats.maxSolvesInOneDay,
    compare: 'gt',
    unit: 'solves in a day',
    tiers: [
      {
        id: 'marathon-25',
        level: 1,
        title: 'Warm Up',
        description: 'Completed more than 25 solves in a single day.',
        threshold: 25
      },
      {
        id: 'marathon-50',
        level: 2,
        title: 'Solid Session',
        description: 'Completed more than 50 solves in a single day.',
        threshold: 50
      },
      {
        id: 'marathon-100',
        level: 3,
        title: 'Century Day',
        description: 'Completed more than 100 solves in a single day.',
        threshold: 100
      },
      {
        id: 'marathon-250',
        level: 4,
        title: 'All Afternoon',
        description: 'Completed more than 250 solves in a single day.',
        threshold: 250
      },
      {
        id: 'marathon-500',
        level: 5,
        title: 'Marathonist',
        description: 'Completed more than 500 solves in a single day.',
        threshold: 500,
        icon: 'icons8-finish-flag-50.png'
      },
      {
        id: 'marathon-1000',
        level: 6,
        title: 'Where Did the Day Go',
        description: 'Completed more than 1,000 solves in a single day.',
        threshold: 1000,
        icon: 'icons8-metal-music-50.png'
      }
    ]
  },
  {
    id: 'daily-streak',
    icon: 'icons8-last-24-hours-50.png',
    type: 'tiered',
    metric: ({ stats }) => stats.longestDateStreak,
    compare: 'gte',
    unit: 'days',
    tiers: [
      {
        id: 'streak-3',
        level: 1,
        title: 'Three in a Row',
        description: 'Solved on 3 consecutive days.',
        threshold: 3
      },
      {
        id: 'streak-7',
        level: 2,
        title: 'One Week Strong',
        description: 'Solved on 7 consecutive days.',
        threshold: 7
      },
      {
        id: 'streak-14',
        level: 3,
        title: 'Fortnight',
        description: 'Solved on 14 consecutive days.',
        threshold: 14
      },
      {
        id: 'streak-30',
        level: 4,
        title: 'Habit Formed',
        description: 'Maintained a solve streak for 30 consecutive days.',
        threshold: 30,
        icon: 'icons8-combo-chart-50.png'
      },
      {
        id: 'streak-60',
        level: 5,
        title: 'Two Month Grind',
        description: 'Maintained a solve streak for 60 consecutive days.',
        threshold: 60
      },
      {
        id: 'streak-100',
        level: 6,
        title: 'Century Streak',
        description: 'Maintained a solve streak for 100 consecutive days.',
        threshold: 100
      },
      {
        id: 'streak-200',
        level: 7,
        title: 'Unbroken',
        description: 'Maintained a solve streak for 200 consecutive days.',
        threshold: 200
      },
      {
        id: 'streak-365',
        level: 8,
        title: 'Consistency is Key',
        description: 'Maintained a solve streak for 365 consecutive days.',
        threshold: 365,
        icon: 'icons8-workflow-50.png'
      },
      {
        id: 'streak-730',
        level: 9,
        title: 'Two Year Vigil',
        description: 'Maintained a solve streak for 730 consecutive days.',
        threshold: 730
      },
      {
        id: 'streak-1000',
        level: 10,
        title: 'Thousand Day Run',
        description: 'Maintained a solve streak for 1,000 consecutive days.',
        threshold: 1000,
        icon: 'icons8-winner-50.png'
      }
    ]
  },
  {
    id: 'clean-streak',
    icon: 'icons8-clover-50.png',
    type: 'tiered',
    metric: ({ stats }) => stats.longestCleanStreak,
    compare: 'gte',
    unit: 'clean solves',
    tiers: [
      {
        id: 'clean-10',
        level: 1,
        title: 'Steady Hands',
        description: 'Performed 10 consecutive solves without any penalties.',
        threshold: 10
      },
      {
        id: 'clean-25',
        level: 2,
        title: 'Composed',
        description: 'Performed 25 consecutive solves without any penalties.',
        threshold: 25
      },
      {
        id: 'clean-50',
        level: 3,
        title: 'In the Zone',
        description: 'Performed 50 consecutive solves without any penalties.',
        threshold: 50
      },
      {
        id: 'clean-100',
        level: 4,
        title: 'Unshaken',
        description: 'Performed 100 consecutive solves without any penalties.',
        threshold: 100
      },
      {
        id: 'clean-250',
        level: 5,
        title: 'Flawless Run',
        description: 'Performed 250 consecutive solves without any penalties.',
        threshold: 250
      },
      {
        id: 'clean-500',
        level: 6,
        title: 'Ice Cold',
        description: 'Performed 500 consecutive solves without any penalties.',
        threshold: 500
      },
      {
        id: 'clean-1000',
        level: 7,
        title: 'Zen Master',
        description: 'Performed 1,000 consecutive solves without any penalties (+2/DNF).',
        threshold: 1000,
        icon: 'icons8-wizard-50.png'
      }
    ]
  },
  {
    id: 'new-year-solve',
    title: 'New Year, New PB',
    description: 'Completed a solve on January 1st.',
    icon: 'icons8-golden-opportunity-50.png',
    type: 'computed',
    condition: ({ stats }) => stats.newYearSolveCount > 0
  },
  {
    id: 'bookmarks',
    icon: 'icons8-mind-map-50.png',
    type: 'tiered',
    metric: ({ stats }) => stats.bookmarkCount,
    compare: 'gte',
    unit: 'bookmarks',
    tiers: [
      {
        id: 'bookmarks-1',
        level: 1,
        title: 'First Save',
        description: 'Bookmarked a solve.',
        threshold: 1
      },
      {
        id: 'bookmarks-5',
        level: 2,
        title: 'Keeping Notes',
        description: 'Bookmarked 5 solves.',
        threshold: 5
      },
      {
        id: 'bookmarks-25',
        level: 3,
        title: 'Curator',
        description: 'Bookmarked 25 solves.',
        threshold: 25
      },
      {
        id: 'bookmarks-100',
        level: 4,
        title: 'Archivist',
        description: 'Bookmarked 100 solves.',
        threshold: 100
      },
      {
        id: 'bookmarks-500',
        level: 5,
        title: 'Librarian',
        description: 'Bookmarked 500 solves.',
        threshold: 500,
        icon: 'icons8-animated-50.png'
      }
    ]
  },
  {
    id: 'comments',
    icon: 'icons8-strategy-news-50.png',
    type: 'tiered',
    metric: ({ stats }) => stats.commentCount,
    compare: 'gte',
    unit: 'comments',
    tiers: [
      {
        id: 'comments-1',
        level: 1,
        title: 'First Word',
        description: 'Left a comment on a solve.',
        threshold: 1
      },
      {
        id: 'comments-10',
        level: 2,
        title: 'Storyteller',
        description: 'Left comments on 10 solves.',
        threshold: 10
      },
      {
        id: 'comments-50',
        level: 3,
        title: 'Chronicler',
        description: 'Left comments on 50 solves.',
        threshold: 50
      },
      {
        id: 'comments-200',
        level: 4,
        title: 'Diarist',
        description: 'Left comments on 200 solves.',
        threshold: 200,
        icon: 'icons8-question-mark-50.png'
      }
    ]
  },
  {
    id: 'smart-cube',
    icon: 'icons8-usb-connector-50.png',
    type: 'tiered',
    metric: ({ stats }) => stats.replayCount,
    compare: 'gte',
    unit: 'replays',
    tiers: [
      {
        id: 'smart-1',
        level: 1,
        title: 'Smart Mover',
        description: 'Recorded a solve replay with a smart cube.',
        threshold: 1
      },
      {
        id: 'smart-25',
        level: 2,
        title: 'Data Driven',
        description: 'Recorded 25 solve replays with a smart cube.',
        threshold: 25
      },
      {
        id: 'smart-100',
        level: 3,
        title: 'Fully Wired',
        description: 'Recorded 100 solve replays with a smart cube.',
        threshold: 100,
        icon: 'icons8-virtual-reality-50.png'
      },
      {
        id: 'smart-500',
        level: 4,
        title: 'Telemetry Addict',
        description: 'Recorded 500 solve replays with a smart cube.',
        threshold: 500
      }
    ]
  }
]
