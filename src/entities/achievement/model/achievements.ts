import { CUBE_CATEGORIES } from '@/shared/const/cube-categories'
import { Achievement, SolveStats } from './types'
import dayjs from '@/shared/lib/dayjs'
import { Cube } from '@/entities/cube/model/types'

export function computeSolveStats(cubes: Cube[]): SolveStats {
  const solvesByDate = new Map<string, number>()
  const categoriesWithValidSolves = new Set<string>()

  let totalValid = 0
  let has3x3Sub10 = false
  let has3x3Sub8 = false
  let hasOHSub30 = false
  let hasBLDSuccess = false
  let hasNewYearSolve = false
  let max3x3SolvesPerCube = 0
  let currentCleanStreak = 0
  let longestCleanStreak = 0
  let bookmarkCount = 0
  let commentCount = 0
  let hasReplay = false

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
      if (solve.replay) hasReplay = true

      if (!solve.dnf) {
        totalValid++
        categoriesWithValidSolves.add(cube.category)
        if (cube.category === '3x3') {
          cube3x3Count++
          if (solve.time < 10000) has3x3Sub10 = true
          if (solve.time < 8000) has3x3Sub8 = true
        }
        if (cube.category === '3x3 OH' && solve.time < 30000) hasOHSub30 = true
        if (cube.category === '3x3 BLD') hasBLDSuccess = true
        const date = dayjs(solve.startTime).format('YYYY-MM-DD')
        if (date.endsWith('-01-01')) hasNewYearSolve = true
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
    has3x3Sub10,
    has3x3Sub8,
    hasOHSub30,
    hasBLDSuccess,
    hasNewYearSolve,
    max3x3SolvesPerCube,
    categoriesWithValidSolves,
    maxSolvesInOneDay,
    longestDateStreak,
    longestCleanStreak,
    bookmarkCount,
    commentCount,
    hasReplay
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
    icon: 'icons8-diversity-50.png',
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
    icon: 'icons8-metal-music-50.png',
    color: 'rgba(0,191,255,0.8)',
    type: 'computed',
    condition: ({ user }) => dayjs(user.createdAt).isBefore(dayjs('2024-07-11').add(1, 'year'))
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Registered a sub-10 second solve.',
    icon: 'icons8-lightning-48.png',
    type: 'computed',
    condition: ({ stats }) => stats.has3x3Sub10
  },
  {
    id: 'sub-8-3x3',
    title: 'World Class',
    description: 'Registered a sub-8 second solve on 3x3.',
    icon: 'icons8-crown-50.png',
    type: 'computed',
    condition: ({ stats }) => stats.has3x3Sub8
  },
  {
    id: 'oh-sub-30',
    title: 'One Hand Wonder',
    description: 'Registered a sub-30 second solve on 3x3 One-Handed.',
    icon: 'icons8-pet-commands-summon-50.png',
    type: 'computed',
    condition: ({ stats }) => stats.hasOHSub30
  },
  {
    id: 'bld-success',
    title: 'Blindfolded',
    description: 'Completed a successful 3x3 Blindfolded solve.',
    icon: 'icons8-brain-50.png',
    type: 'computed',
    condition: ({ stats }) => stats.hasBLDSuccess
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
    id: 'career-100k',
    title: 'Cube Legend',
    description: 'Reached 100,000 career solves.',
    icon: 'icons8-trophy-50.png',
    type: 'computed',
    condition: ({ stats }) => stats.totalValid >= 100000
  },
  {
    id: 'collector-5',
    title: 'Starter Pack',
    description: 'Own at least 5 different cubes.',
    icon: 'icons8-shield-50.png',
    type: 'computed',
    condition: ({ cubes }) => cubes.length >= 5
  },
  {
    id: 'collector',
    title: 'Puzzle Collector',
    description: 'Own at least 25 different cubes.',
    icon: 'icons8-money-box-50.png',
    type: 'computed',
    condition: ({ cubes }) => cubes.length >= 25
  },
  {
    id: 'collector-50',
    title: 'Cube Hoarder',
    description: 'Own at least 50 different cubes.',
    icon: 'icons8-monster-face-50.png',
    type: 'computed',
    condition: ({ cubes }) => cubes.length >= 50
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
    id: 'streak-30',
    title: 'Habit Formed',
    description: 'Maintained a solve streak for 30 consecutive days.',
    icon: 'icons8-combo-chart-50.png',
    type: 'computed',
    condition: ({ stats }) => stats.longestDateStreak >= 30
  },
  {
    id: 'consistency-is-key',
    title: 'Consistency is Key',
    description: 'Maintained a solve streak for 365 consecutive days.',
    icon: 'icons8-workflow-50.png',
    type: 'computed',
    condition: ({ stats }) => stats.longestDateStreak >= 365
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
    condition: ({ stats }) => stats.hasNewYearSolve
  },
  {
    id: 'bookmarker',
    title: 'Curator',
    description: 'Bookmarked 25 solves.',
    icon: 'icons8-clover-50.png',
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
    condition: ({ stats }) => stats.hasReplay
  }
]
