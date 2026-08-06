import { parse } from 'papaparse'
import { z } from 'zod'
import _ from 'lodash'
import { Cube } from '@/entities/cube/model/types'
import { Solve } from '@/entities/solve/model/types'
import { PLUS_2_PENALTY_MS, withPlus2 } from '@/entities/solve/lib/penalty'

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
  properties: z.object({}).passthrough()
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

    return ensureUniqueCubeNames(formatCubesDatesAndOrder(normalizeOldData(cubes)))
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

      session.forEach((solve: any, solveIndex: number) => {
        // csTimer stores the raw time plus a penalty marker (2000 = +2, -1 = DNF).
        const isPlus2 = solve[0][0] === PLUS_2_PENALTY_MS
        const startTime = solve[3] * 1000
        const newSolve: Solve = {
          id: `${newCube.id}-${solve[3] * 1000}-${solveIndex}`,
          startTime,
          endTime: startTime + solve[0][1],
          scramble: solve[1],
          bookmark: false,
          time: withPlus2(solve[0][1], isPlus2),
          dnf: solve[0][0] === -1,
          plus2: isPlus2,
          rating: Math.floor(Math.random() * 20) + solve[1].length,
          cubeId: newCube.id,
          comment: ''
        }
        newCube.solves.all.push(newSolve)
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

  // A CubeDesk session mixes puzzles: its UI filters by the selected cube, so one
  // session can hold 7x7, clock and 3x3 at once. Ours is one puzzle per cube, the
  // whole point of per-cube stats, so a session becomes one cube per puzzle.
  const grouped = new Map<string, { sessionId: string; cubeType: string; solves: typeof result.data.solves }>()

  for (const solve of result.data.solves) {
    const key = `${solve.session_id}-${solve.cube_type}`
    const bucket = grouped.get(key)
    if (bucket) bucket.solves.push(solve)
    else grouped.set(key, { sessionId: solve.session_id, cubeType: solve.cube_type, solves: [solve] })
  }

  const sessionsById = new Map(result.data.sessions.map((session) => [session.id, session]))

  for (const [key, group] of grouped) {
    const session = sessionsById.get(group.sessionId)
    if (!session) continue

    const newCube: Cube = {
      id: key,
      name: `CubeDesk ${session.name} (${group.cubeType})`,
      category: '3x3', // Reviewed and reassigned by the user before the import lands.
      solves: {
        session: [],
        all: []
      },
      createdAt: Date.parse(session.created_at),
      favorite: false
    }

    for (const solve of group.solves) {
      // CubeDesk keeps the clock reading in `raw_time` (seconds) and puts the
      // resolved time in `time`, which is -1 on a DNF. Rebuild from raw_time so
      // the +2 is applied exactly once, and so a DNF keeps a real duration.
      // A CubeDesk solve can carry both flags; ours cannot, and DNF wins.
      const isDnf = solve.dnf
      const isPlus2 = solve.plus_two && !isDnf
      newCube.solves.all.push({
        id: solve.id,
        startTime: solve.started_at,
        endTime: solve.ended_at,
        scramble: solve.scramble,
        bookmark: false,
        time: withPlus2(Math.round(solve.raw_time * 1000), isPlus2),
        dnf: isDnf,
        plus2: isPlus2,
        rating: Math.floor(Math.random() * 20) + solve.scramble.length,
        cubeId: newCube.id,
        comment: ''
      })
    }

    newCubeList.push(newCube)
  }

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

    // Twisty Timer's Time column is already the resolved time: a +2 solve exports
    const isPlus2 = penalty === 1
    const newSolve: Solve = {
      id: `${cube.id}-${date}`,
      startTime: Number(date) - Number(time),
      endTime: Number(date),
      scramble: scramble.toString(),
      bookmark: false,
      time: Number(time),
      dnf: penalty === 2,
      plus2: isPlus2,
      rating: scramble ? Math.floor(Math.random() * 20) + scramble.toString().length : 10,
      cubeId: cube.id,
      comment: comment ? comment.toString() : ''
    }
    cube.solves.all.push(newSolve)
  })

  newCubeList = formatCubesDatesAndOrder(newCubeList)
  newCubeList = parseNXTimerSchema(newCubeList)

  return newCubeList
}

export function ensureUniqueCubeNames(cubes: Cube[]): Cube[] {
  const taken = new Set<string>()

  return cubes.map((cube) => {
    const base = (cube.name || 'Collection').trim()
    let name = base
    let suffix = 2

    while (taken.has(name.toLowerCase())) {
      name = `${base} ${suffix}`
      suffix++
    }

    taken.add(name.toLowerCase())
    return name === cube.name ? cube : { ...cube, name }
  })
}

export function formatCubesDatesAndOrder(cubes: Cube[]): Cube[] {
  // A solve happens when the timer stops, so `endTime` is the canonical order
  return cubes.map((cube) => {
    const sortedSession = _.sortBy(cube.solves.session, ['endTime', 'startTime'])
    const sortedAll = _.sortBy(cube.solves.all, ['endTime', 'startTime'])

    return {
      ...cube,
      solves: {
        session: sortedSession,
        all: sortedAll
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

export function normalizeOldData(cubes: Cube[]): Cube[] {
  return cubes.map((cube) => {
    return {
      ...cube,
      isDeleted: cube.isDeleted ?? false,
      updatedAt: cube.updatedAt ?? cube.createdAt,
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

export const preventDuplicateDeleteStatus = (cubes: Cube[]): Cube[] => {
  return cubes.map((cube) => {
    const solveMap = new Map<string, Solve & { _wasInSession?: boolean }>()

    const processSolve = (solve: Solve, fromSession: boolean) => {
      const existing = solveMap.get(solve.id)
      if (!existing || (solve.updatedAt ?? 0) > (existing.updatedAt ?? 0)) {
        solveMap.set(solve.id, { ...solve, _wasInSession: fromSession })
      } else if (existing && (solve.updatedAt ?? 0) === (existing.updatedAt ?? 0)) {
        if (fromSession && !existing._wasInSession) {
          solveMap.set(solve.id, { ...solve, _wasInSession: fromSession })
        }
      }
    }

    cube.solves.session.forEach((s) => processSolve(s, true))
    cube.solves.all.forEach((s) => processSolve(s, false))

    const newSessionSolves: Solve[] = []
    const newAllSolves: Solve[] = []

    solveMap.forEach((solveWithMeta) => {
      const { _wasInSession, ...solve } = solveWithMeta

      if (_wasInSession) {
        newSessionSolves.push(solve)
      } else {
        newAllSolves.push(solve)
      }
    })

    return {
      ...cube,
      solves: {
        session: newSessionSolves,
        all: newAllSolves
      }
    }
  })
}
