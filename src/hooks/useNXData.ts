import { Cube } from '@/interfaces/Cube';
import genId from '@/lib/genId';
import { Categories } from '@/interfaces/Categories';
import { Solve } from '@/interfaces/Solve';
import _ from 'lodash';
import Cubes from '@/models/indexdb/Cubes';
import { database } from '@/db/indexdb';

export const useNXData = () => {
  const getCubeById = async (id: string): Promise<Cube | null> => {
    return await Cubes.get(id) as Cube | null;
  }

  const getAllCubes = async (): Promise<Cube[]> => {
    if (!database.ready) await database.open();
    return await Cubes.find().get() as Cube[];
  }

  const saveCube = async ({
    id = genId(),
    name,
    category,
    solves = {
      all: [],
      session: [],
    },
    createdAt = Date.now(),
    favorite = false,
  }: {
    id?: string;
    name: string;
    category: Categories;
    solves?: {
      all: Solve[];
      session: Solve[];
    };
    createdAt?: number;
    favorite?: boolean;
  }) => {

    const newCube: Cube = {
      id,
      name: name,
      category: category,
      solves,
      createdAt,
      favorite,
    };

    if (!database.ready) await database.open();
    return await Cubes.put(newCube);
  }

  const saveBatchCubes = async (cubesBatch: Cube[]) => {
     for (const cube of cubesBatch) {
       await Cubes.put(cube);
     }
  }

  const deleteCubeById = async (id: string): Promise<void> => {
    return await Cubes.delete(id);
  }

  const clearCubes = async (): Promise<void> => {
    return await Cubes.clear();
  }

  const updateSolve = async ({
    selectedCube,
    solveId,
    type,
    comment,
    deletedSolve,
  }: {
    selectedCube: Cube;
    solveId: string;
    type: "+2" | "DNF" | "COMMENT" | "BOOKMARK" | "DELETE" | "UNDO" | "MOVE_TO_HISTORY";
    comment?: string;
    deletedSolve?:Solve;
  }): Promise<Cube | null> => {
    const updateSolveArray = (solveArray: Solve[]) => {
      const solveIndex = solveArray.findIndex((solve) => solve.id === solveId);

      if (solveIndex !== -1 || (type === "UNDO" && deletedSolve)) {
        const solveToUpdate = type === "UNDO" ? deletedSolve : solveArray[solveIndex];

        if(solveToUpdate){
          if (type === "+2") {
            if (!solveToUpdate.plus2 && solveToUpdate.dnf) {
              solveToUpdate.dnf = false;
            }
            solveToUpdate.plus2 = !solveToUpdate.plus2;
            solveToUpdate.time += solveToUpdate.plus2 ? 2000 : -2000;
          } else if (type === "DNF") {
            if (!solveToUpdate.dnf && solveToUpdate.plus2) {
              solveToUpdate.plus2 = false;
              solveToUpdate.time -= 2000;
            }
            solveToUpdate.dnf = !solveToUpdate.dnf;
          } else if (type === "COMMENT") {
            solveToUpdate.comment = comment ?? "";
          } else if (type === "BOOKMARK") {
            solveToUpdate.bookmark = !solveToUpdate.bookmark;
          } else if (type === "DELETE") {
            deletedSolve = solveToUpdate;
            solveArray.splice(solveIndex, 1); // Remove the solve from the array
          } else if(type === "UNDO" && deletedSolve) {
            solveArray.push(deletedSolve);
          } else if(type === "MOVE_TO_HISTORY") {
            if (solveArray === selection.solves.session) {
              const solveToMove = solveArray.splice(solveIndex, 1)[0];
              const existsInAll = selection.solves.all.some(s => s.id === solveToMove.id);
              if (!existsInAll) selection.solves.all.push(solveToMove);
            }
          }
        }
      }
    };

    const selection = _.cloneDeep(selectedCube);

    updateSolveArray(selection.solves.all);
    updateSolveArray(selection.solves.session);

    await saveCube({ ...selection, solves: selection.solves, });
    return selection;
  }

  const finishSession = async (selectedCube: Cube | null) => {
    const cubes = await getAllCubes();
    if (!selectedCube) return null;

    const newCubes = [];

    for (const cube of cubes) {
      if (cube.category === selectedCube.category && cube.solves.session.length >= 1) {
        cube.solves.all.push(..._.cloneDeep(cube.solves.session));
        cube.solves.session = [];
        newCubes.push(cube);
      }
    }

    await saveBatchCubes(newCubes);
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
  }
}
