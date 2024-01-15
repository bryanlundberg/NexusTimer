import {
  deleteCubeById,
  getAllCubes,
  getCubeById,
  saveBatchCubes,
  saveCube,
} from "./dbOperations";

getCubeById("7b9d92a6-0a63-417f-8a34-de6f55bcdd75")
  .then((res: any) => console.log(res))
  .catch((err: any) => console.log(err));

getAllCubes()
  .then((res: any) => console.log(res))
  .catch((err: any) => console.log(err));

saveCube({ name: "test-name", category: "7x7" })
  .then((res: any) => console.log(res))
  .catch((err: any) => console.log(err));

// saveBatchCubes([...cubes,  need test])
//   .then((res: any) => console.log(res))
//   .catch((err: any) => console.log(err));

deleteCubeById("e5143add-a721-4cc0-93ac-ce34fc60e894")
  .then((res: any) => console.log(res))
  .catch((err: any) => console.log(err));
