import { Cube } from "@/interfaces/Cube";
import { ChangeEvent } from "react";
import genId from "./genId";

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
  console.log(uploadedFileData);
  const parsedCubeData = JSON.parse(uploadedFileData);

  let validData = false;

  // ### validate nexusTimer
  // Check if the data is a valid array
  // if (!Array.isArray(parsedCubeData) || parsedCubeData.length === 0) {
  //   validData = false;
  // }

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
      category: "3x3",
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

      solvingTime = solve[0][1];

      let scramble = solve[1];
      let comment = solve[2];
      let endTime = solve[3];

      console.log(endTime - solvingTime, endTime, solvingTime);

      // adjust the calculations trying to match the data structure
      const newSolve = {
        id: genId(),
        startTime: endTime - solvingTime,
        endTime: endTime,
        scramble: scramble,
        bookmark: false,
        time: solvingTime,
        dnf: hasDNF,
        plus2: plus2,
        rating: Math.floor(Math.random() * 20) + scramble.length,
        category: newCube.category,
        cubeId: newCube.id,
        comment: comment,
      };

      newCube.solves.session.push(newSolve);
    });

    newCubeList.push(newCube);
  });

  // Update local storage with the modified list of cubes
  window.localStorage.setItem("cubes", JSON.stringify(newCubeList));
  validData = true;

  // ### validate twisty timer

  // ### validate cubedesk

  return validData;
}
