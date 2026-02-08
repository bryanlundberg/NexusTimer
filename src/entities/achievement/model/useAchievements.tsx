import { CUBE_CATEGORIES } from '@/shared/const/cube-categories'
import { Achievement } from './types'
import moment from 'moment'
import { Cube } from '@/entities/cube/model/types'

export default function useAchievements() {
  const ACHIEVEMENTS_CONFIG: Achievement[] = [
    {
      id: 'public-sponsor',
      title: 'Project Patron',
      description: 'A sponsor helping keep the engine running.',
      icon: 'icons8-favorite-50.png',
      color: 'rgba(255,105,180,0.8)',
      condition: (data) => false
    },
    {
      id: 'first-year',
      title: 'Beta Tester',
      description: 'Became a user during the first year after launch.',
      icon: 'icons8-metal-music-50.png',
      color: 'rgba(0,191,255,0.8)',
      condition: (data) => {
        const createdAt = moment(data.user.createdAt)
        const launchDate = moment('2024-07-11')
        return createdAt.isBefore(launchDate.add(1, 'year'))
      }
    },
    {
      id: 'speed-demon',
      title: 'Speed Demon',
      description: 'Fast as lightning! You registered your first sub-10 solve.',
      icon: 'icons8-lightning-48.png',
      condition: (data) => {
        return data.cubes.some(
          (cube) =>
            cube.category === '3x3' &&
            (cube.solves.all.some((solve) => solve.time < 10000 && !solve.isDeleted && !solve.dnf) ||
              cube.solves.session.some((solve) => solve.time < 10000 && !solve.isDeleted && !solve.dnf))
        )
      }
    },
    {
      id: 'over-9999-3x3',
      title: "It's over 9000!",
      description: 'You have completed over 9,999 solves on 3x3 cubes.',
      icon: 'icons8-mana-50.png',
      condition: (data) => {
        const threeByThreeCubes = data.cubes.filter((cube) => cube.category === '3x3')

        const someCubeHasOver9999Solves = (cube: Cube) => {
          const totalSolves =
            cube.solves.all.filter((solve) => !solve.isDeleted && !solve.dnf).length +
            cube.solves.session.filter((solve) => !solve.isDeleted && !solve.dnf).length
          return totalSolves >= 9999
        }

        return threeByThreeCubes.some(someCubeHasOver9999Solves)
      }
    },
    {
      id: 'career-100k',
      title: 'Cube Legend',
      description: 'A journey of a thousand miles begins with a single solve... you already have 100,000.',
      icon: 'icons8-trophy-50.png',
      condition: (data) => {
        const totalSolves = data.cubes.reduce((sum, cube) => {
          const validAllSolves = cube.solves.all.filter((solve) => !solve.isDeleted && !solve.dnf).length
          const validSessionSolves = cube.solves.session.filter((solve) => !solve.isDeleted && !solve.dnf).length
          return sum + validAllSolves + validSessionSolves
        }, 0)
        return totalSolves >= 100000
      }
    },
    {
      id: 'collector',
      title: 'Puzzle Collector',
      description: 'Own at least 25 cubes.',
      icon: 'icons8-money-box-50.png',
      condition: (data) => {
        return data.cubes.length >= 25
      }
    },
    {
      id: 'eventglot',
      title: 'Eventglot',
      description: 'You own and have solved all available categories.',
      icon: 'icons8-diversity-50.png',
      condition: (data) => {
        const categories = new Set(data.cubes.map((cube) => cube.category))

        const hasAtLeastOneSolveInCategory = (category: string) => {
          return data.cubes.some(
            (cube) =>
              cube.category === category &&
              (cube.solves.all.some((solve) => !solve.isDeleted && !solve.dnf) ||
                cube.solves.session.some((solve) => !solve.isDeleted && !solve.dnf))
          )
        }

        return CUBE_CATEGORIES.every((category) => categories.has(category) && hasAtLeastOneSolveInCategory(category))
      }
    },
    {
      id: 'bug-hunter',
      title: 'Bug Hunter',
      description: 'You found a glitch in the Matrix.',
      icon: 'icons8-bug-50.png',
      condition: (data) => false
    },
    {
      id: 'marathonist',
      title: 'Marathonist',
      description: 'Performed more than 500 solves in a single day.',
      icon: 'icons8-finish-flag-50.png',
      condition: (data) => {
        const solvesByDate: { [date: string]: number } = {}

        data.cubes.forEach((cube) => {
          cube.solves.all.forEach((solve) => {
            if (!solve.isDeleted) {
              const date = moment(solve.startTime).format('YYYY-MM-DD')
              solvesByDate[date] = (solvesByDate[date] || 0) + 1
            }
          })
          cube.solves.session.forEach((solve) => {
            if (!solve.isDeleted && !solve.dnf) {
              const date = moment(solve.startTime).format('YYYY-MM-DD')
              solvesByDate[date] = (solvesByDate[date] || 0) + 1
            }
          })
        })

        return Object.values(solvesByDate).some((count) => count > 500)
      }
    },
    {
      id: 'consistency-is-key',
      title: 'Consistency is Key',
      description: 'You have maintained a solve streak for 365 consecutive days.',
      icon: 'icons8-workflow-50.png',
      condition: (data) => {
        const solveDates = new Set<string>()

        data.cubes.forEach((cube) => {
          cube.solves.all.forEach((solve) => {
            if (!solve.isDeleted) {
              const date = moment(solve.startTime).format('YYYY-MM-DD')
              solveDates.add(date)
            }
          })
          cube.solves.session.forEach((solve) => {
            if (!solve.isDeleted) {
              const date = moment(solve.startTime).format('YYYY-MM-DD')
              solveDates.add(date)
            }
          })
        })

        const sortedDates = Array.from(solveDates).sort()
        let currentStreak = 1

        for (let i = 1; i < sortedDates.length; i++) {
          const previousDate = moment(sortedDates[i - 1])
          const currentDate = moment(sortedDates[i])
          if (currentDate.diff(previousDate, 'days') === 1) {
            currentStreak++
            if (currentStreak >= 365) {
              return true
            }
          } else {
            currentStreak = 1
          }
        }

        return false
      }
    },
    {
      id: 'zen-master',
      title: 'Zen Master',
      description: 'You performed 1,000 solves without a single penalty (+2/DNF).',
      icon: 'icons8-wizard-50.png',
      condition: (data) => {
        let consecutiveCleanSolves = 0

        for (const cube of data.cubes) {
          for (const solve of [...cube.solves.all, ...cube.solves.session]) {
            if (!solve.isDeleted && !solve.dnf && !solve.plus2) {
              consecutiveCleanSolves++
              if (consecutiveCleanSolves >= 1000) {
                return true
              }
            } else {
              consecutiveCleanSolves = 0
            }
          }
        }

        return false
      }
    }
  ]

  return {
    ACHIEVEMENTS_CONFIG
  }
}
