import { Cube } from "@/interfaces/Cube";
import { ChangeEvent } from "react";
import genId from "./genId";
import { Solve } from "@/interfaces/Solve";
import { CubeCollection, Event } from "@/interfaces/cubeCollection";

export default function importDataFromFile(
  event: ChangeEvent<HTMLInputElement>
): void {
  const selectedFile = event.target.files?.[0];

  if (selectedFile) {
    // Check if the file is of type 'text/plain' (TXT file)
    if (selectedFile.type !== "text/plain") {
      alert("Only .txt files are allowed.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const cubes = e.target?.result as string;

      if (cubes) {
        // Check if the data is valid, and handle errors
        try {
          // Perform validation on the 'cubes' data here
          if (!isValidCubesData(cubes)) {
            throw new Error("Invalid data in the file.");
          }

          // Inform the user that the import was successful
          alert("Data imported successfully.");
        } catch (error: any) {
          // Display a user alert for the error
          alert("Error: " + error.message);
        }
      }
    };

    reader.onerror = () => {
      // Handle FileReader errors
      alert("Error reading the file.");
    };

    reader.readAsText(selectedFile);
  }
}

// Function to validate 'cubes' data
function isValidCubesData(uploadedFileData: string): boolean {
  const parsedCubeData = JSON.parse(uploadedFileData);
  if (importCstimerData(parsedCubeData)) return true;
  if (importNexusTimerData(parsedCubeData)) return true;
  if (importCubedeskData(parsedCubeData)) return true;
  return false;
}

// cubedesk _> if (Object.keys(parsedCubeData).includes("sessions")) return false;

function importCubedeskData(parsedCubeData: any): boolean {
  console.log(typeof parsedCubeData);
  console.log(parsedCubeData);

  if (typeof parsedCubeData !== "object") return false;
  if (!Object.keys(parsedCubeData).includes("solves")) return false;
  if (!Object.keys(parsedCubeData).includes("sessions")) return false;

  // Trying to force a return false > These props are not in
  // cubedesk backup data structure
  if (Object.keys(parsedCubeData).includes("id")) return false;
  if (Object.keys(parsedCubeData).includes("properties")) return false;
  if (Object.keys(parsedCubeData).includes("scramble")) return false;

  const newCubeList: Cube[] = [];

  parsedCubeData["sessions"].forEach(
    (session: {
      id: string;
      name: string;
      created_at: string;
      order: number;
    }) => {
      // create a virtual cube session
      const newCube: Cube = {
        id: session.id,
        name: session.name,
        category: "3x3", // Not specified in cubedesk backup
        solves: {
          session: [],
          all: [],
        },
        createdAt: Date.parse(session.created_at),
        favorite: false,
      };

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
              comment: "",
            };

            newCube.solves.session.push(newSolve);
          }
        }
      );

      newCubeList.push(newCube);
    }
  );

  // Update local storage with the modified list of cubes
  window.localStorage.setItem("cubes", JSON.stringify(newCubeList));

  return true;
}

function importNexusTimerData(parsedCubeData: Cube[]): boolean {
  // ########################
  // ## IMPORT NEXUS TIMER ##
  // ########################

  // Verifying that the backup originates from Nexustimer
  // No adjustments to the data structure are required; direct saving is possible.

  if (typeof parsedCubeData !== "object") return false;
  if (Object.keys(parsedCubeData).includes("properties")) return false;
  if (typeof parsedCubeData[0]?.solves.all === "undefined") return false;

  // Update local storage with the modified list of cubes
  window.localStorage.setItem("cubes", JSON.stringify(parsedCubeData));

  return true;
}

function importCstimerData(parsedCubeData: any): boolean {
  // ########################
  // ### IMPORT CSTIMER #####
  // ########################

  if (typeof parsedCubeData !== "object") return false;

  // Verify whether "cstimer" is the only one containing a
  // property named "properties". This check helps determine
  // if the parsedCubeData, correspond to cstimer or not.

  if (!Object.keys(parsedCubeData).includes("properties")) return false;

  // ### validate cstimer
  //Eliminate app properties section from backup
  const csTimerSessions = Object.keys(parsedCubeData).slice(
    0,
    Object.keys(parsedCubeData).length - 1
  );

  // create a virtual object to place new data sctructure
  const newCubeList: Cube[] = [];

  csTimerSessions.forEach((session: any) => {
    // later will be updated to the date of the first solve
    // registered on this session
    let createdAt = Date.now();

    // create a virtual cube session
    const newCube: Cube = {
      id: genId(),
      name: session,
      category: "3x3", // Not specified in cstimer backup
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

      // DNF solves wont be registered on system will be excluded
      let hasDNF = false;

      // cstimer has very deep array storage items ...
      let plus2 = false;
      let solvingTime = 0;

      if (solve[0][0] === -1) {
        hasDNF = true;
      } else if (solve[0][0] === 0) {
        plus2 = false;
      } else if (solve[0][0] === 2000) {
        plus2 = true;
      }

      if (typeof solve[0][0] !== "number")
        throw new Error("Corrupted data type");
      if (typeof solve[0][1] !== "number")
        throw new Error("Corrupted data type");

      solvingTime = solve[0][1];

      let scramble = solve[1];
      let comment = solve[2];
      let endTime = solve[3];

      // adjust the calculations trying to match the data structure
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

  return true;
}
