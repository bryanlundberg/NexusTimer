import { Categories } from "@/interfaces/Categories";
import { Cube } from "@/interfaces/Cube";
import { Solve } from "@/interfaces/Solve";
import genId from "@/lib/genId";
const IDBStore = require("idb-wrapper");

const storeName = "nx-data";
const keyPath = "id";
const dbVersion = 2;
const autoIncrement = false;
const indexes = [
  { name: "id" },
  { name: "createdAt", unique: true },
  { name: "category" },
  { name: "favorite" },
];

export async function getCubeById(id: string): Promise<Cube | null> {
  return new Promise<Cube | null>(async (resolve, reject) => {
    const cubeDB = await new IDBStore({
      dbVersion,
      storeName,
      keyPath,
      autoIncrement,
      onStoreReady: () => getCube(),
      indexes: indexes,
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
      indexes: indexes,
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
      indexes: indexes,
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
      indexes: indexes,
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
      indexes: indexes,
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

// ### Testing area, experiment for query data from DB
// directly with indexed data, results in a better performance

// -> It can filter 68,349 objects in 1428 ms, and return sorted.

export async function test(): Promise<any> {
  // return data
  const cubeDB = await new IDBStore({
    dbVersion: 2,
    storeName: "solves",
    keyPath,
    autoIncrement,
    onStoreReady: save,
    onError: function (err: any) {
      console.log(err);
    },
    indexes: [
      { name: "id" },
      { name: "cube" },
      { name: "date" },
      { name: "number" },
    ],
  });

  async function save(): Promise<any> {
    const start = Date.now();

    const onEnd = function (item: any[]) {
      // console.table(item);
      const end = Date.now();
      console.log(`Execution time: ${end - start} ms`);
      console.log(item.length);
      return item;
    };

    const keyRange = cubeDB.makeKeyRange({
      upper: 0,
    });

    return await cubeDB.query(onEnd, {
      index: "date",
      order: "ASC",
      filterDuplicates: true,
      writeAccess: false,
      keyRange: keyRange,
    });
  }
}

export async function test2() {
  return new Promise<void>(async (resolve, reject) => {
    const cubeDB = await new IDBStore({
      dbVersion: 2,
      storeName: "solves",
      keyPath,
      autoIncrement,
      onStoreReady: () => save(),
      indexes: [
        { name: "id" },
        { name: "cube" },
        { name: "date" },
        { name: "number" },
      ],
    });

    async function save() {
      var onItem = function (item: any) {
        console.log("got item:", item);
      };
      var onEnd = function (item: any) {
        console.log("All done.");
      };

      return await cubeDB.put(
        {
          id: genId(),
          cube: "ffff",
          date: Date.now(),
          number: Math.random(),
        },
        (success: any) => resolve(success),
        (error: any) => reject(error)
      );
    }
  });
}
