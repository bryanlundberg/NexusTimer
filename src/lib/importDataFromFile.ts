import { Cube } from "@/interfaces/Cube";
import { ChangeEvent } from "react";
import genId from "./genId";
import { Solve } from "@/interfaces/Solve";
import { Event } from "@/interfaces/cubeCollection";
import { cubeCollection } from "./const/cubeCollection";
import { parse } from "papaparse";
import { saveBatchCubes } from "@/db/dbOperations";

export default async function importDataFromFile(
  event: ChangeEvent<HTMLInputElement>
): Promise<boolean> {
  try {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      throw new Error("No file selected");
    }

    // Check if the file is of type 'text/plain' (TXT file)
    if (selectedFile.type !== "text/plain") {
      throw new Error("Only .txt files are allowed.");
    }

    const fileContent = await readFileAsText(selectedFile);

    if (!fileContent) {
      throw new Error("Empty file content");
    }

    // Check if the data is CSV
    if (fileContent.includes(";")) {
      const backup = await importTwistytimerData(fileContent);
      if (!backup) {
        throw new Error("Invalid data in the file. (1)");
      }
    } else {
      // Perform validation on the 'fileContent' data here
      const backup = await isValidCubesData(fileContent);
      if (!backup) {
        throw new Error("Invalid data in the file. (2)");
      }
    }

    // Inform the user that the import was successful
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target?.result as string;
      resolve(fileContent);
    };

    reader.onerror = () => {
      reject(new Error("Error reading the file."));
    };

    reader.readAsText(file);
  });
}

// Function to validate 'cubes' data
async function isValidCubesData(fileContent: string): Promise<boolean> {
  const parsedData = await JSON.parse(fileContent);

  // Function list
  const promiseFunctions = [
    importCstimerData(parsedData),
    importNexusTimerData(parsedData),
    importCubedeskData(parsedData),
  ];

  // Wait for all promises
  const [cstimer, nextuTimer, cubedesk] = await Promise.all(promiseFunctions);

  // Verify if some has resolve
  return [cstimer, nextuTimer, cubedesk].some((result) => result === true);
}

async function importTwistytimerData(parsedData: any): Promise<boolean> {
  // #########################
  // ## IMPORT TWISTY TIMER ##
  // #########################

  // CSV to JSON
  parsedData = await parse(parsedData, {
    dynamicTyping: true,
  });

  // Twisty Timer backup: Row structure
  // Puzzle: 222, Category: Normal, Time: 0, Date: 1657657016937, Scramble: , Penalty: 0, Comment:

  // Penalty:
  // [1] - +2
  // [0] - Nothing
  // [2] - DNF

  // List to store new cubes
  const newCubeList: Cube[] = [];

  for (let index = 0; index <= parsedData.data.length; index++) {
    // Skip the first row which contains the headers of the chart
    if (index === 0) {
      continue;
    }

    // Extract individual data fields
    const puzzle = parsedData.data[index][0];
    const category = parsedData.data[index][1];
    const time = parsedData.data[index][2];
    const date = parsedData.data[index][3];
    let scramble = parsedData.data[index][4];
    const penalty = parsedData.data[index][5];
    const comment = parsedData.data[index][6];

    // Avoid solves with 0 time
    if (time === 0) continue;

    // Avoid clock category (not supported, not included in NexusTimer)
    if (puzzle === "clock") {
      console.warn(
        "Clock, not supported on NexusTimer, backup won't restore it."
      );
      continue;
    }

    // Break loop if puzzle is null or empty
    if (puzzle === null) break;

    // Twisty Timer uses a different category classification
    const event = cubeCollection.find((u) => u.twistyId === puzzle.toString());
    if (!event) {
      return false; // throw new Error("Unsupported category on Nexus Timer");
    }

    // Find the memory-cube corresponding to this solve
    const cube = newCubeList.find(
      (cube: Cube) =>
        cube.name === `${puzzle}-${category}` && cube.category === event.name
    );

    // If the cube exists, add the solve to its session
    if (cube) {
      cube.solves.session.push({
        id: genId(),
        startTime: date - time,
        endTime: date,
        scramble: scramble,
        bookmark: false,
        time: time,
        dnf: penalty === 2,
        plus2: penalty === 1,
        rating: scramble
          ? Math.floor(Math.random() * 20) +
            parseInt(scramble.toString().length)
          : 10,
        cubeId: cube.id,
        comment: comment ? comment : "",
      });
      continue;
    }

    // If the cube doesn't exist, create it and append the solve
    if (!cube) {
      const newCube: Cube = {
        id: genId(),
        name: `${puzzle}-${category}`,
        category: event.name,
        solves: {
          session: [],
          all: [],
        },
        createdAt: date,
        favorite: false,
      };
      // Add the current solve
      newCube.solves.session.push({
        id: genId(),
        startTime: date - time,
        endTime: date,
        scramble: scramble,
        bookmark: false,
        time: time,
        dnf: penalty === 2,
        plus2: penalty === 1,
        rating: scramble
          ? Math.floor(Math.random() * 20) +
            parseInt(scramble.toString().length)
          : 10,
        cubeId: newCube.id,
        comment: comment ? comment : "",
      });
      // Add the new cube to the list
      newCubeList.push(newCube);
    }
  }
  // Update local storage with the modified list of cubes
  await saveBatchCubes(newCubeList);

  return true;
}

async function importCubedeskData(parsedCubeData: any): Promise<boolean> {
  // #########################
  // #### IMPORT CUBEDESK ####
  // #########################

  // Check if parsedCubeData is an object
  if (typeof parsedCubeData !== "object") return false;

  // Ensure that required keys are present in the Cubedesk data structure
  if (!Object.keys(parsedCubeData).includes("solves")) return false;
  if (!Object.keys(parsedCubeData).includes("sessions")) return false;

  // Force a return of false if certain props are found in the Cubedesk backup data structure
  if (Object.keys(parsedCubeData).includes("id")) return false;
  if (Object.keys(parsedCubeData).includes("properties")) return false;
  if (Object.keys(parsedCubeData).includes("scramble")) return false;

  // List to store new cubes
  const newCubeList: Cube[] = [];

  // Iterate through Cubedesk sessions
  parsedCubeData["sessions"].forEach(
    (session: {
      id: string;
      name: string;
      created_at: string;
      order: number;
    }) => {
      // Create a virtual cube session
      const newCube: Cube = {
        id: session.id,
        name: session.name,
        category: "3x3", // Category not specified in Cubedesk backup -> Manual fix later by user...
        solves: {
          session: [],
          all: [],
        },
        createdAt: Date.parse(session.created_at),
        favorite: false,
      };

      // Iterate through Cubedesk solves
      parsedCubeData["solves"].forEach(
        (solve: {
          scramble: string;
          started_at: number;
          ended_at: number;
          time: number;
          raw_time: number;
          cube_type: Event;
          id: string;
          dnf: boolean;
          plus_two: boolean;
          session_id: string;
          from_timer: boolean;
          inspection_time: number;
          is_smart_cube: boolean;
          smart_put_down_time: number;
        }) => {
          // Check if the solve belongs to the current session
          if (solve.session_id === session.id) {
            // Create a new solve
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
              comment: "",
            };
            // Add the solve to the session
            newCube.solves.session.push(newSolve);
          }
        }
      );
      // Add the new cube to the list
      newCubeList.push(newCube);
    }
  );

  // Update local storage with the modified list of cubes
  await saveBatchCubes(newCubeList);

  return true;
}

async function importNexusTimerData(parsedCubeData: Cube[]): Promise<boolean> {
  // ########################
  // ## IMPORT NEXUS TIMER ##
  // ########################

  // Verify that the backup originates from Nexustimer
  // Force a return of false if certain props are found in the Nexus Timer data structure
  // Ensure that the data structure contains the expected properties
  if (typeof parsedCubeData !== "object") return false;
  if (Object.keys(parsedCubeData).includes("properties")) return false;
  if (typeof parsedCubeData[0]?.solves.all === "undefined") return false;

  // No adjustments to the data structure are required;

  // Update local storage with the modified list of cubes
  await saveBatchCubes(parsedCubeData);

  return true;
}

function importCstimerData(parsedCubeData: any): Promise<boolean> {
  // ########################
  // ### IMPORT CSTIMER #####
  // ########################

  return new Promise<boolean>((resolve, reject) => {
    // Check if parsedCubeData is an object
    if (typeof parsedCubeData !== "object") return resolve(false);

    // Verify whether "cstimer" is the only one containing a
    // property named "properties". This check helps determine
    // if the parsedCubeData corresponds to CSTimer or not.

    if (!Object.keys(parsedCubeData).includes("properties"))
      return resolve(false);

    // ### validate cstimer
    // Eliminate app properties section from the backup
    const csTimerSessions = Object.keys(parsedCubeData).slice(
      0,
      Object.keys(parsedCubeData).length - 1
    );

    // Create a virtual object to place the new data structure
    const newCubeList: Cube[] = [];

    csTimerSessions.forEach((session: any) => {
      // Later will be updated to the date of the first solve registered on this session
      let createdAt = Date.now();

      // Create a virtual cube session
      const newCube: Cube = {
        id: genId(),
        name: session,
        category: "3x3", // Not specified in CSTimer backup - Require manual fix by user later...
        solves: {
          session: [],
          all: [],
        },
        createdAt: createdAt,
        favorite: false,
      };

      // Get and convert all the solves into a compatible format
      parsedCubeData[session].forEach((solve: any, index: number) => {
        if (index === 0) {
          createdAt = solve[3];
        }

        // DNF solves won't be registered in the system; they will be excluded
        let hasDNF = false;

        // CSTimer has a very deep array storage structure
        let plus2 = false;
        let solvingTime = 0;

        if (solve[0][0] === -1) {
          hasDNF = true;
        } else if (solve[0][0] === 0) {
          plus2 = false;
        } else if (solve[0][0] === 2000) {
          plus2 = true;
        }

        if (
          typeof solve[0][0] !== "number" ||
          typeof solve[0][1] !== "number"
        ) {
          return resolve(false); // new Error("Corrupted data type")
        }

        solvingTime = solve[0][1];

        let scramble = solve[1];
        let comment = solve[2];
        let endTime = solve[3];

        // Adjust the calculations trying to match the data structure
        const newSolve: Solve = {
          id: genId(),
          startTime: endTime - solvingTime,
          endTime: endTime,
          scramble: scramble,
          bookmark: false,
          time: solvingTime,
          dnf: hasDNF,
          plus2: plus2,
          rating: Math.floor(Math.random() * 20) + scramble.length,
          cubeId: newCube.id,
          comment: comment,
        };

        newCube.solves.session.push(newSolve);
      });

      newCubeList.push(newCube);
    });

    // Update local storage with the modified list of cubes
    window.localStorage.setItem("cubes", JSON.stringify(newCubeList));
    return resolve(true);
  });
}
