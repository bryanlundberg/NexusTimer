import { Cube } from "@/interfaces/Cube";
import { ChangeEvent } from "react";
import genId from "./genId";
import { Solve } from "@/interfaces/Solve";
import { Event } from "@/interfaces/cubeCollection";
import { cubeCollection } from "./const/cubeCollection";

export default function importDataFromFile(
  event: ChangeEvent<HTMLInputElement>
): void {
  const selectedFile = event.target.files?.[0];

  if (selectedFile) {
    // Check if the file is of type 'text/plain' (TXT file)
    if (selectedFile.type === "text/plain") {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileContent = e.target?.result as string;

        if (fileContent) {
          try {
            // Check if the data is CSV
            if (fileContent.includes(";")) {
              const parsedData = fileContent
                .split("\n")
                .map((line) =>
                  line
                    .split(";")
                    .map((value) =>
                      value.startsWith('"') && value.endsWith('"')
                        ? value.slice(1, -1)
                        : value.trim()
                    )
                );
              if (!importTwistytimerData(parsedData)) {
                throw new Error("Invalid data in the file. (1)");
              }
              alert("CSV data imported successfully.");
            } else {
              // Perform validation on the 'fileContent' data here
              if (!isValidCubesData(fileContent)) {
                throw new Error("Invalid data in the file. (2)");
              }

              // Inform the user that the import was successful
              alert("Data imported successfully.");
            }
          } catch (error: any) {
            console.error(error);
          }
        }
      };

      reader.onerror = () => {
        // Handle FileReader errors
        alert("Error reading the file.");
      };

      reader.readAsText(selectedFile);
    } else {
      alert("Only .txt files are allowed.");
    }
  }
}

// Function to validate 'cubes' data
function isValidCubesData(fileContent: string): boolean {
  const parsedData = JSON.parse(fileContent);
  if (importCstimerData(parsedData)) return true;
  if (importNexusTimerData(parsedData)) return true;
  if (importCubedeskData(parsedData)) return true;
  return false;
}

function importTwistytimerData(parsedData: any): boolean {
  // #########################
  // ## IMPORT TWISTY TIMER ##
  // #########################

  // Initialize index for iterating through parsedData
  let index = 0;

  // List to store new cubes
  const newCubeList: Cube[] = [];

  // Twisty Timer backup: Row structure
  // Puzzle: 222, Category: Normal, Time: 0, Date: 1657657016937, Scramble: , Penalty: 0, Comment:
  // Twisty Timer doesn't use objects, it uses a table, so everything must occur here

  // Penalty:
  // [1] - +2
  // [0] - Nothing
  // [2] - DNF

  // Iterate through parsedData
  while (index < parsedData.length) {
    // Extract data from the current row
    const row = parsedData[index];
    // Skip the first row which contains the headers of the chart
    if (index === 0) {
      index++;
      continue;
    }

    // Extract individual data fields
    const puzzle = row[0];
    const category = row[1];
    const time = parseInt(row[2]);
    const date = parseInt(row[3]);
    let scramble = row[4];
    const penalty: "0" | "1" | "2" = row[5];
    const comment = row[6];

    // Avoid solves with 0 time
    if (time === 0) continue;

    // Avoid clock category (not supported, not included in NexusTimer)
    if (puzzle === "clock") {
      console.warn(
        "Clock, not supported on NexusTimer, backup does not restored it."
      );
      index++;
      continue;
    }
    // Break loop if puzzle is null or empty
    if (puzzle === null || puzzle === "") break;

    // Twisty Timer uses a different category classification
    const event = cubeCollection.find((u) => u.twistyId === puzzle);
    if (!event) throw new Error("Unsupported category from Twisty Timer");

    // Megaminx special case
    {
      /*
        Sample mega file data:

        Line 456. "mega";"Normal";"73430";"1705242277618";"R-- D++ R-- D-- R-- D++ R++ D-- R++ D-- U'
        Line 457. R++ D-- R++ D++ R++ D-- R-- D++ R-- D-- U'
        Line 458. R++ D++ R++ D++ R++ D++ R++ D++ R++ D-- U'
        Line 459. R++ D++ R++ D++ R++ D-- R++ D++ R++ D++ U
        Line 460. R++ D++ R++ D-- R++ D++ R-- D-- R++ D++ U
        Line 461. R-- D++ R++ D-- R-- D++ R++ D++ R-- D++ U
        Line 462. R++ D++ R++ D++ R-- D++ R++ D-- R++ D++ U";"0";""
        
        */
    }
    // If the category is "mega," concatenate the 7 lines of scramble into one
    if (puzzle === "mega") {
      scramble = scramble + " ";
      for (let i = 1; i < 7; i++) {
        const line = parsedData[index + i];
        scramble += line && line[0] ? line[0] + " " : "";
      }
      // Skip 7 lines
      index += 7;
      scramble = scramble.replace(/"/g, "");
      console.log(scramble);
    } else {
      index++;
    }

    // Find the cube corresponding to this solve
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
        dnf: penalty === "2",
        plus2: penalty === "1",
        rating: Math.floor(Math.random() * 20) + scramble.length,
        cubeId: cube.id,
        comment: comment ? comment.trim() : "",
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
        dnf: penalty === "2",
        plus2: penalty === "1",
        rating: Math.floor(Math.random() * 20) + scramble.length,
        cubeId: newCube.id,
        comment: comment ? comment.trim() : "",
      });
      // Add the new cube to the list
      newCubeList.push(newCube);
    }
  }

  // Update local storage with the modified list of cubes
  window.localStorage.setItem("cubes", JSON.stringify(newCubeList));

  return true;
}

function importCubedeskData(parsedCubeData: any): boolean {
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
  window.localStorage.setItem("cubes", JSON.stringify(newCubeList));

  return true;
}

function importNexusTimerData(parsedCubeData: Cube[]): boolean {
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
  window.localStorage.setItem("cubes", JSON.stringify(parsedCubeData));

  return true;
}

function importCstimerData(parsedCubeData: any): boolean {
  // ########################
  // ### IMPORT CSTIMER #####
  // ########################

  // Check if parsedCubeData is an object
  if (typeof parsedCubeData !== "object") return false;

  // Verify whether "cstimer" is the only one containing a
  // property named "properties". This check helps determine
  // if the parsedCubeData corresponds to CSTimer or not.

  if (!Object.keys(parsedCubeData).includes("properties")) return false;

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

      if (typeof solve[0][0] !== "number")
        throw new Error("Corrupted data type");
      if (typeof solve[0][1] !== "number")
        throw new Error("Corrupted data type");

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

  return true;
}
