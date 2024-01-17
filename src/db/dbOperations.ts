import { Categories } from "@/interfaces/Categories";
import { Cube } from "@/interfaces/Cube";
import { Solve } from "@/interfaces/Solve";
import genId from "@/lib/genId";
const IDBStore = require("idb-wrapper");

const storeName = "nx-data";
const keyPath = "id";
const dbVersion = 1;
const autoIncrement = false;

export async function getCubeById(id: string): Promise<Cube | null> {
  return new Promise<Cube | null>(async (resolve, reject) => {
    const cubeDB = await new IDBStore({
      dbVersion,
      storeName,
      keyPath,
      autoIncrement,
      onStoreReady: () => getCube(),
    });

    async function getCube() {
      return await cubeDB.get(
        id,
        (success: any) => {
          success === undefined ? resolve(null) : resolve(success);
        },
        (error: any) => {
          reject(error);
        }
      );
    }
  });
}

export async function getAllCubes(): Promise<Cube[]> {
  return new Promise<Cube[]>(async (resolve, reject) => {
    const cubeDB = await new IDBStore({
      dbVersion,
      storeName,
      keyPath,
      autoIncrement,
      onStoreReady: () => getAll(),
    });

    async function getAll() {
      return await cubeDB.getAll(
        (success: any) => resolve(success),
        (error: any) => reject(error)
      );
    }
  });
}

export async function saveCube({
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
}): Promise<Cube> {
  return new Promise<Cube>(async (resolve, reject) => {
    const cubeDB = await new IDBStore({
      dbVersion,
      storeName,
      keyPath,
      autoIncrement,
      onStoreReady: () => save(),
    });

    const newCube: Cube = {
      id,
      name: name,
      category: category,
      solves,
      createdAt,
      favorite,
    };

    async function save() {
      return await cubeDB.put(
        newCube,
        (success: any) => resolve(success),
        (error: any) => reject(error)
      );
    }
  });
}

// stores an array of solves in a single transaction

// alternative _> upsertBatch
export async function saveBatchCubes(cubesBatch: Cube[]) {
  return new Promise<void>(async (resolve, reject) => {
    const cubeDB = await new IDBStore({
      dbVersion,
      storeName,
      keyPath,
      autoIncrement,
      onStoreReady: () => save(),
    });

    async function save() {
      return await cubeDB.putBatch(
        cubesBatch,
        (success: any) => resolve(success),
        (error: any) => reject(error)
      );
    }
  });
}

export async function deleteCubeById(id: string) {
  return new Promise<void>(async (resolve, reject) => {
    const cubeDB = await new IDBStore({
      dbVersion,
      storeName,
      keyPath,
      autoIncrement,
      onStoreReady: () => deleteCube(),
    });

    async function deleteCube() {
      return await cubeDB.remove(
        id,
        (success: any) => resolve(success),
        (error: any) => reject(error)
      );
    }
  });
}
