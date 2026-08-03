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
    icon: 'icons8-lightning-48.png',
    type: 'tiered',
    metric: ({ stats }) => stats.best3x3Single,
    compare: 'lt',
    tiers: [
      {
        id: 'speed-demon',
        level: 1,
        title: 'Speed Demon',
        description: 'Registered a sub-10 second solve.',
        threshold: 10000,
        icon: 'icons8-lightning-48.png'
      },
      {
        id: 'sub-8-3x3',
        level: 2,
        title: 'World Class',
        description: 'Registered a sub-8 second solve on 3x3.',
        threshold: 8000,
        icon: 'icons8-crown-50.png'
      }
    ]
  },
  {
    id: 'oh-sub-30',
    title: 'One Hand Wonder',
    description: 'Registered a sub-30 second solve on 3x3 One-Handed.',
    icon: 'icons8-knight-shield-50.png',
    type: 'computed',
    condition: ({ stats }) => stats.best3x3OHSingle < 30000
  },
  {
    id: 'bld-success',
    title: 'Blindfolded',
    description: 'Completed a successful 3x3 Blindfolded solve.',
    icon: 'icons8-brain-50.png',
    type: 'computed',
    condition: ({ stats }) => stats.bldSuccessCount > 0
  },
  {
    id: 'over-9999-3x3',
    title: "It's over 9000!",
    description: 'Completed over 9,999 solves on 3x3 cubes.',
    icon: 'icons8-mana-50.png',
    type: 'computed',
    condition: ({ stats }) => stats.max3x3SolvesPerCube >= 9999
  },
  {
    id: 'career-solves',
    icon: 'icons8-trophy-50.png',
    type: 'tiered',
    metric: ({ stats }) => stats.totalValid,
    compare: 'gte',
    tiers: [
      {
        id: 'career-100k',
        level: 1,
        title: 'Cube Legend',
        description: 'Reached 100,000 career solves.',
        threshold: 100000,
        icon: 'icons8-trophy-50.png'
      }
    ]
  },
  {
    id: 'cube-collection',
    icon: 'icons8-shield-50.png',
    type: 'tiered',
    metric: ({ cubes }) => cubes.length,
    compare: 'gte',
    tiers: [
      {
        id: 'collector-5',
        level: 1,
        title: 'Starter Pack',
        description: 'Own at least 5 different cubes.',
        threshold: 5,
        icon: 'icons8-shield-50.png'
      },
      {
        id: 'collector',
        level: 2,
        title: 'Puzzle Collector',
        description: 'Own at least 25 different cubes.',
        threshold: 25,
        icon: 'icons8-money-box-50.png'
      },
      {
        id: 'collector-50',
        level: 3,
        title: 'Cube Hoarder',
        description: 'Own at least 50 different cubes.',
        threshold: 50,
        icon: 'icons8-monster-face-50.png'
      }
    ]
  },
  {
    id: 'eventglot',
    title: 'Eventglot',
    description: 'Solved at least one cube in every available category.',
    icon: 'icons8-diversity-50.png',
    type: 'computed',
    condition: ({ stats }) => CUBE_CATEGORIES.every((c) => stats.categoriesWithValidSolves.has(c))
  },
  {
    id: 'marathonist',
    title: 'Marathonist',
    description: 'Completed more than 500 solves in a single day.',
    icon: 'icons8-finish-flag-50.png',
    type: 'computed',
    condition: ({ stats }) => stats.maxSolvesInOneDay > 500
  },
  {
    id: 'daily-streak',
    icon: 'icons8-combo-chart-50.png',
    type: 'tiered',
    metric: ({ stats }) => stats.longestDateStreak,
    compare: 'gte',
    tiers: [
      {
        id: 'streak-30',
        level: 1,
        title: 'Habit Formed',
        description: 'Maintained a solve streak for 30 consecutive days.',
        threshold: 30,
        icon: 'icons8-combo-chart-50.png'
      },
      {
        id: 'consistency-is-key',
        level: 2,
        title: 'Consistency is Key',
        description: 'Maintained a solve streak for 365 consecutive days.',
        threshold: 365,
        icon: 'icons8-workflow-50.png'
      }
    ]
  },
  {
    id: 'zen-master',
    title: 'Zen Master',
    description: 'Performed 1,000 consecutive solves without any penalties (+2/DNF).',
    icon: 'icons8-wizard-50.png',
    type: 'computed',
    condition: ({ stats }) => stats.longestCleanStreak >= 1000
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
    id: 'bookmarker',
    title: 'Curator',
    description: 'Bookmarked 25 solves.',
    icon: 'icons8-mind-map-50.png',
    type: 'computed',
    condition: ({ stats }) => stats.bookmarkCount >= 25
  },
  {
    id: 'commentator',
    title: 'Storyteller',
    description: 'Left comments on 10 solves.',
    icon: 'icons8-strategy-news-50.png',
    type: 'computed',
    condition: ({ stats }) => stats.commentCount >= 10
  },
  {
    id: 'smart-mover',
    title: 'Smart Mover',
    description: 'Recorded a solve replay with a smart cube.',
    icon: 'icons8-usb-connector-50.png',
    type: 'computed',
    condition: ({ stats }) => stats.replayCount > 0
  }
]
