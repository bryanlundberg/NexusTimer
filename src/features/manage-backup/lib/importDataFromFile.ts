import { parse } from 'papaparse'
import { z } from 'zod/v4'
import _ from 'lodash'
import { Cube } from '@/entities/cube/model/types'
import { Solve } from '@/entities/solve/model/types'

const nxTimerSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    solves: z.object({
      session: z.array(
        z.object({
          id: z.string(),
          startTime: z.number(),
          endTime: z.number(),
          scramble: z.string(),
          bookmark: z.boolean(),
          time: z.number(),
          dnf: z.boolean().optional(),
          plus2: z.boolean(),
          rating: z.number(),
          cubeId: z.string(),
          comment: z.string().optional(),
          updatedAt: z.number().optional(),
          isDeleted: z.boolean().optional()
        })
      ),
      all: z.array(
        z.object({
          id: z.string(),
          startTime: z.number(),
          endTime: z.number(),
          scramble: z.string(),
          bookmark: z.boolean(),
          time: z.number(),
          dnf: z.boolean().optional(),
          plus2: z.boolean(),
          rating: z.number(),
          cubeId: z.string(),
          comment: z.string().optional(),
          updatedAt: z.number().optional(),
          isDeleted: z.boolean().optional()
        })
      )
    }),
    createdAt: z.number(),
    favorite: z.boolean(),
    isDeleted: z.boolean().optional(),
    updatedAt: z.number().optional()
  })
)

const csTimerSchema = z.object({
  properties: z.looseObject({
    sessionN: z.number()
  })
})

const cubeDeskSchema = z.object({
  sessions: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      created_at: z.string(),
      order: z.number()
    })
  ),
  solves: z.array(
    z.object({
      scramble: z.string(),
      started_at: z.number(),
      ended_at: z.number(),
      time: z.number(),
      raw_time: z.number(),
      cube_type: z.string(),
      id: z.string(),
      dnf: z.boolean(),
      plus_two: z.boolean(),
      session_id: z.string(),
      from_timer: z.boolean(),
      inspection_time: z.number().optional(),
      is_smart_cube: z.boolean().optional(),
      smart_put_down_time: z.number().optional()
    })
  )
})

export default async function importDataFromFile(file: File): Promise<Cube[] | false> {
  try {
    if (!file) return false
    const fileContent = await file.text()

    let cubes

    try {
      cubes = importNexusTimerData(fileContent)
    } catch {
      try {
        cubes = importCsTimerData(fileContent)
      } catch {
        try {
          cubes = importCubeDeskData(fileContent)
        } catch {
          cubes = importTwistyTimerData(fileContent)
        }
      }
    }

    cubes = uniqueData(cubes)
    return cubes
  } catch (error) {
    console.error('Error reading file:', error)
    return false
  }
}

export const importNexusTimerData = (fileContent: string) => {
  const parsedData = JSON.parse(fileContent)
  const result = nxTimerSchema.safeParse(parsedData)
  if (!result.success) {
    throw new Error(`Invalid Nexus Timer data: ${result.error.message}`)
  }

  return parsedData as Cube[]
}

const importCsTimerData = (fileContent: string) => {
  const parsedData = JSON.parse(fileContent)
  const result = csTimerSchema.safeParse(parsedData)
  if (!result.success) {
    throw new Error(`Invalid csTimer data: ${result.error.message}`)
  }

  const resultData = Object.values(parsedData).slice(0, -1) // Exclude the last property which is "properties"

  let newCubeList = resultData
    .map((session: any, index) => {
      if (session.length === 0) return

      const newCube: Cube = {
        id: `cs-${Math.min(...session.map((solve: any) => solve[3] * 1000))}`,
        name: 'CSTimer Session ' + (index + 1),
        category: '3x3', // Not specified in CSTimer backup - Require manual fix by user later...
        solves: {
          session: [],
          all: []
        },
        createdAt: Date.now(),
        favorite: false
      }

      session.forEach((solve: any) => {
        const newSolve: Solve = {
          id: `${newCube.id}-${solve[3] * 1000}`,
          startTime: solve[3] * 1000 - solve[0][1],
          endTime: solve[3] * 1000,
          scramble: solve[1],
          bookmark: false,
          time: solve[0][1] + (solve[0][0] === 2000 ? 2000 : 0),
          dnf: solve[0][0] === -1,
          plus2: solve[0][0] === 2000,
          rating: Math.floor(Math.random() * 20) + solve[1].length,
          cubeId: newCube.id,
          comment: ''
        }
        newCube.solves.session.push(newSolve)
      })

      return newCube
    })
    .filter((cube) => cube !== undefined) as Cube[]

  newCubeList = formatCubesDatesAndOrder(newCubeList)
  newCubeList = parseNXTimerSchema(newCubeList)

  return newCubeList as Cube[]
}

function importCubeDeskData(fileContent: string) {
  const parsedData = JSON.parse(fileContent)
  const result = cubeDeskSchema.safeParse(parsedData)
  if (!result.success) {
    throw new Error(`Invalid CubeDesk data: ${result.error.message}`)
  }

  let newCubeList: Cube[] = []

  result.data.sessions.forEach((session) => {
    const newCube: Cube = {
      id: session.id,
      name: 'CubeDesk ' + session.name,
      category: '3x3', // Category not specified in Cubedesk backup -> Manual fix later by user...
      solves: {
        session: [],
        all: []
      },
      createdAt: Date.parse(session.created_at),
      favorite: false
    }

    result.data.solves.forEach((solve) => {
      if (solve.session_id === session.id) {
        const newSolve: Solve = {
          id: solve.id,
          startTime: solve.started_at,
          endTime: solve.ended_at,
          scramble: solve.scramble,
          bookmark: false,
          time: solve.time * 1000,
          dnf: solve.dnf,
          plus2: solve.plus_two,
          rating: Math.floor(Math.random() * 20) + solve.scramble.length,
          cubeId: session.id,
          comment: ''
        }
        newCube.solves.session.push(newSolve)
      }
    })
    newCubeList.push(newCube)
  })

  newCubeList = formatCubesDatesAndOrder(newCubeList)
  newCubeList = parseNXTimerSchema(newCubeList)

  return newCubeList
}

function importTwistyTimerData(fileContent: string) {
  const parsedData = parse(fileContent, { dynamicTyping: true }).data.slice(1)

  let newCubeList: Cube[] = []

  // Twisty Timer backup: Row structure
  // Puzzle: 222, Category: Normal, Time: 0, Date: 1657657016937, Scramble: R2 F2, Penalty: 0, Comment:

  // Penalty:
  // [1] - +2
  // [0] - Nothing
  // [2] - DNF

  parsedData.forEach((row: any) => {
    const [puzzle, category, time, date, scramble, penalty, comment] = row

    if (time === 0 || puzzle == null || category == null || date == null || scramble == null || penalty == null) return

    let cube = newCubeList.find((c) => c.name === `${puzzle}-${category}`)

    if (!cube) {
      cube = {
        id: `tw-${Math.min(...parsedData.filter((row: any) => row[0] === puzzle && row[1] === category).map((row: any) => row[3]))}`,
        name: `${puzzle}-${category}`,
        category: '3x3',
        solves: { session: [], all: [] },
        createdAt: Number(date),
        favorite: false
      }
      newCubeList.push(cube)
    }

    const newSolve: Solve = {
      id: `${cube.id}-${date}`,
      startTime: Number(date) - Number(time),
      endTime: Number(date),
      scramble: scramble.toString(),
      bookmark: false,
      time: Number(time),
      dnf: penalty === 2,
      plus2: penalty === 1,
      rating: scramble ? Math.floor(Math.random() * 20) + scramble.toString().length : 10,
      cubeId: cube.id,
      comment: comment ? comment.toString() : ''
    }
    cube.solves.session.push(newSolve)
  })

  newCubeList = formatCubesDatesAndOrder(newCubeList)
  newCubeList = parseNXTimerSchema(newCubeList)

  return newCubeList
}

export function formatCubesDatesAndOrder(cubes: Cube[]): Cube[] {
  return cubes.map((cube) => {
    const sortedSessionSolves = cube.solves.session.sort((a, b) => a.startTime - b.startTime)
    const sortedAllSolves = cube.solves.all.sort((a, b) => a.startTime - b.startTime)

    return {
      ...cube,
      createdAt: sortedSessionSolves.length > 0 ? sortedSessionSolves[0].startTime : cube.createdAt,
      solves: {
        session: sortedSessionSolves,
        all: sortedAllSolves
      }
    }
  })
}

export function parseNXTimerSchema(cubes: Cube[]): Cube[] {
  const result = nxTimerSchema.safeParse(cubes)
  if (!result.success) {
    throw new Error(`Invalid Nexus Timer data: ${result.error.message}`)
  }
  return result.data as Cube[]
}

export function uniqueData(cubes: Cube[]) {
  return _.uniqBy(cubes, 'id').map((cube) => ensureConsistency(cube))
}

export function mergeSolves(solves: Solve[]) {
  const map = new Map<string, Solve>()
  solves.forEach((solve) => {
    const existing = map.get(solve.id)
    if (!existing) {
      map.set(solve.id, solve)
      return
    }

    const existingWeight = existing.updatedAt || existing.endTime || 0
    const currentWeight = solve.updatedAt || solve.endTime || 0

    if (currentWeight > existingWeight) {
      map.set(solve.id, solve)
    }
  })
  return Array.from(map.values())
}

export function ensureConsistency(cube: Cube): Cube {
  const mergedSession = mergeSolves(cube.solves.session)
  const mergedAll = mergeSolves(cube.solves.all)

  const allSolvesMap = new Map<string, Solve>()

  mergedAll.forEach((solve) => {
    const existing = allSolvesMap.get(solve.id)
    if (!existing) {
      allSolvesMap.set(solve.id, { ...solve })
      return
    }

    const existingWeight = existing.updatedAt || existing.endTime || 0
    const currentWeight = solve.updatedAt || solve.endTime || 0

    if (currentWeight > existingWeight) {
      allSolvesMap.set(solve.id, { ...solve })
    }
  })

  const sessionSolvesMap = new Map<string, Solve>()
  mergedSession.forEach((solve) => {
    const historySolve = allSolvesMap.get(solve.id)
    const currentSolve = { ...solve }

    if (historySolve) {
      const historyWeight = historySolve.updatedAt || historySolve.endTime || 0
      const sessionWeight = currentSolve.updatedAt || currentSolve.endTime || 0

      if (sessionWeight > historyWeight) {
        allSolvesMap.set(currentSolve.id, { ...currentSolve })
      } else {
        currentSolve.isDeleted = true
      }
    } else {
      allSolvesMap.set(currentSolve.id, { ...currentSolve })
    }
    sessionSolvesMap.set(currentSolve.id, currentSolve)
  })

  const syncList = (list: Solve[], sourceMap: Map<string, Solve>) =>
    list.map((s) => {
      const unified = allSolvesMap.get(s.id)
      const inSource = sourceMap.get(s.id)

      if (inSource && inSource.isDeleted) {
        return { ...unified, isDeleted: true } as Solve
      }

      return unified ? { ...unified } : s
    })

  return {
    ...cube,
    solves: {
      session: syncList(mergedSession, sessionSolvesMap),
      all: Array.from(allSolvesMap.values())
    }
  }
}

export function normalizeOldData(cubes: Cube[]): Cube[] {
  return cubes.map((cube) => {
    return {
      ...cube,
      isDeleted: cube.isDeleted ?? false,
      updatedAt: cube.updatedAt ? cube.updatedAt : cube.createdAt,
      solves: {
        session: cube.solves.session.map((solve: Solve) => ({
          ...solve,
          isDeleted: solve.isDeleted ?? false,
          updatedAt: solve.updatedAt ?? solve.startTime
        })),
        all: cube.solves.all.map((solve: Solve) => ({
          ...solve,
          isDeleted: solve.isDeleted ?? false,
          updatedAt: solve.updatedAt ?? solve.startTime
        }))
      }
    }
  })
}
