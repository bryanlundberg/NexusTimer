import { Cube } from '@/interfaces/Cube'
import genId from '@/lib/genId'
import { Categories } from '@/interfaces/Categories'
import { Solve } from '@/interfaces/Solve'
import _ from 'lodash'
import Cubes from '@/models/indexdb/Cubes'
import { database } from '@/shared/config/indexdb/indexdb'

export const useNXData = () => {
  const getCubeById = async (id: string): Promise<Cube | null> => {
    if (!database.ready) await database.open()
    const cube = (await Cubes.get(id)) as Cube | null
    if (cube?.isDeleted) return null

    if (!cube) return null

    cube.solves.session.filter((solve) => !solve?.isDeleted)
    cube.solves.all.filter((solve) => !solve?.isDeleted)

    return cube
  }

  const getAllDatabase = async (): Promise<Cube[]> => {
    if (!database.ready) await database.open()
    return (await Cubes.find().get()) as Cube[]
  }

  const getAllCubes = async (): Promise<Cube[]> => {
    if (!database.ready) await database.open()
    const allCubes = (await Cubes.find().get()) as Cube[]
    return allCubes.filter((cube) => !cube.isDeleted)
  }

  const saveCube = async ({
    id = genId(),
    name,
    category,
    solves = {
      all: [],
      session: []
    },
    createdAt = Date.now(),
    favorite = false,
    isDeleted = false
  }: {
    id?: string
    name: string
    category: Categories
    solves?: {
      all: Solve[]
      session: Solve[]
    }
    createdAt?: number
    favorite?: boolean
    isDeleted?: boolean
  }) => {
    const newCube: Cube = {
      id,
      name: name,
      category: category,
      solves,
      createdAt,
      favorite,
      updatedAt: Date.now(),
      isDeleted
    }

    if (!database.ready) await database.open()
    return await Cubes.put(newCube)
  }

  const saveBatchCubes = async (cubesBatch: Cube[]) => {
    for (const cube of cubesBatch) {
      await Cubes.put(cube)
    }
  }

  const deleteCubeById = async (id: string): Promise<void> => {
    const cubes = await getAllCubes()

    const cubeToDelete = cubes.find((cube) => cube.id === id)
    if (!cubeToDelete) return

    cubeToDelete.isDeleted = true
    cubeToDelete.updatedAt = Date.now()

    cubeToDelete.solves.session.forEach((solve) => {
      solve.isDeleted = true
      solve.updatedAt = Date.now()
    })

    cubeToDelete.solves.all.forEach((solve) => {
      solve.isDeleted = true
      solve.updatedAt = Date.now()
    })

    await Cubes.put(cubeToDelete)
  }

  const clearCubes = async (): Promise<void> => {
    return await Cubes.clear()
  }

  const updateSolve = async ({
    selectedCube,
    solveId,
    type,
    comment,
    deletedSolve
  }: {
    selectedCube: Cube
    solveId: string
    type: '+2' | 'DNF' | 'COMMENT' | 'BOOKMARK' | 'DELETE' | 'UNDO' | 'MOVE_TO_HISTORY'
    comment?: string
    deletedSolve?: Solve
  }): Promise<Cube | null> => {
    const updateSolveArray = (solveArray: Solve[]) => {
      const solveIndex = solveArray.findIndex((solve) => solve.id === solveId)

      if (solveIndex !== -1 || (type === 'UNDO' && deletedSolve)) {
        const solveToUpdate = type === 'UNDO' ? deletedSolve : solveArray[solveIndex]

        if (solveToUpdate) {
          if (type === '+2') {
            if (!solveToUpdate.plus2 && solveToUpdate.dnf) {
              solveToUpdate.dnf = false
            }
            solveToUpdate.plus2 = !solveToUpdate.plus2
            solveToUpdate.time += solveToUpdate.plus2 ? 2000 : -2000
          } else if (type === 'DNF') {
            if (!solveToUpdate.dnf && solveToUpdate.plus2) {
              solveToUpdate.plus2 = false
              solveToUpdate.time -= 2000
            }
            solveToUpdate.dnf = !solveToUpdate.dnf
          } else if (type === 'COMMENT') {
            solveToUpdate.comment = comment ?? ''
          } else if (type === 'BOOKMARK') {
            solveToUpdate.bookmark = !solveToUpdate.bookmark
          } else if (type === 'DELETE') {
            solveToUpdate.isDeleted = true
          } else if (type === 'UNDO' && deletedSolve) {
            if (!solveArray.some((s) => s.id === deletedSolve?.id)) {
              solveArray.push({ ...deletedSolve, isDeleted: false })
            }
          } else if (type === 'MOVE_TO_HISTORY') {
            if (solveArray === selection.solves.session) {
              const solveToMove = solveArray.splice(solveIndex, 1)[0]
              const existsInAll = selection.solves.all.some((s) => s.id === solveToMove.id)
              if (!existsInAll) selection.solves.all.push(solveToMove)
            }
          }
          solveToUpdate.updatedAt = Date.now()
        }
      }
    }

    const selection = _.cloneDeep(selectedCube)

    if (type === 'UNDO' && deletedSolve) {
      if (deletedSolve.isDeleted) {
        updateSolveArray(selection.solves.all)
        updateSolveArray(selection.solves.session)
      }
    } else {
      updateSolveArray(selection.solves.all)
      updateSolveArray(selection.solves.session)
    }

    await saveCube({ ...selection, solves: selection.solves })
    return selection
  }

  const finishSession = async (selectedCube: Cube | null) => {
    const cubes = await getAllCubes()
    if (!selectedCube) return null

    const newCubes = []

    for (const cube of cubes) {
      if (cube.category === selectedCube.category && cube.solves.session.length >= 1) {
        cube.solves.all.push(
          ..._.cloneDeep(
            cube.solves.session.map((solve) => {
              return { ...solve, updatedAt: Date.now(), isDeleted: !!solve.isDeleted }
            })
          )
        )

        cube.solves.session = []
        newCubes.push(cube)
      }
    }

    await saveBatchCubes(newCubes)
  }

  return {
    getCubeById,
    saveCube,
    getAllCubes,
    saveBatchCubes,
    deleteCubeById,
    clearCubes,
    updateSolve,
    finishSession,
    getAllDatabase
  }
}
