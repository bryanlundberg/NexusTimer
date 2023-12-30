// import { Cube } from "@/interfaces/Cube";
// import { Solve } from "@/interfaces/Solve";
import { ChangeEvent } from "react";

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

          // Save the valid data to local storage
          window.localStorage.setItem("cubes", cubes);

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

// const keyChecker = (keysArr1: string[], keysArr2: string[]) =>
//   keysArr1.length === keysArr2.length &&
//   keysArr1.every((key) => keysArr2.includes(key));

// Function to validate 'cubes' data
function isValidCubesData(uploadedFileData: string): boolean {
  const parsedCubeData = JSON.parse(uploadedFileData);

  // Check if the data is a valid array
  if (!Array.isArray(parsedCubeData) || parsedCubeData.length === 0) {
    return false;
  }

  return true;

  // // Create a sample cube object to retrieve expected keys, this will also ensure type safety
  // const sampleCubeObject: Cube = {
  //   id: "",
  //   name: "",
  //   category: "2x2",
  //   solves: {
  //     all: [
  //       {
  //         id: "",
  //         startTime: 0,
  //         endTime: 0,
  //         scramble: "",
  //         bookmark: false,
  //         time: 1000,
  //         dnf: false,
  //         plus2: false,
  //         rating: 0,
  //         category: "3x3",
  //         cubeId: "",
  //       },
  //     ],
  //     session: [
  //       {
  //         id: "",
  //         startTime: 0,
  //         endTime: 0,
  //         scramble: "",
  //         bookmark: false,
  //         time: 1000,
  //         dnf: false,
  //         plus2: false,
  //         rating: 0,
  //         category: "3x3",
  //         cubeId: "",
  //       },
  //     ],
  //   },
  //   createdAt: 0,
  //   favorite: false,
  // };

  // const expectedCubeKeys = Object.keys(sampleCubeObject);

  // // Validate every instance of the cube data within the array
  // const isCubeDataValid = parsedCubeData.every((parsedCubeDataItem: any, i) => {
  //   // Retrieve the keys of the uploaded data
  //   const uploadedCubeDataKeys = Object.keys(parsedCubeDataItem);

  //   // Check if the uploaded data has the correct keys
  //   const doKeysMatch = keyChecker(expectedCubeKeys, uploadedCubeDataKeys);

  //   if (!doKeysMatch) return false;

  //   // Perform type checking for the uploaded data
  //   const isUploadedDataTypeSafe = expectedCubeKeys.every((expectedCubeKey) => {
  //     if (expectedCubeKey !== "solves")
  //       return (
  //         typeof parsedCubeDataItem[expectedCubeKey] ===
  //         typeof sampleCubeObject[expectedCubeKey as keyof Cube]
  //       );

  //     // Check for the 'solves' key
  //     // Get session solves and all solves
  //     const solvedSessions = parsedCubeDataItem[expectedCubeKey].session,
  //       allSolves = parsedCubeDataItem[expectedCubeKey].all;

  //     // If the solves are not arrays, return false
  //     if (!Array.isArray(solvedSessions) || !Array.isArray(allSolves)) {
  //       return false;
  //     }

  //     // Retrieve the keys of the solved sessions and all solves
  //     const expectedSolvedSessionKeys = Object.keys(
  //         sampleCubeObject.solves.session[0]
  //       ),
  //       expectedAllSolvesKeys = Object.keys(sampleCubeObject.solves.all[0]);

  //     // Validate types of the solved sessions
  //     const validateSolvedSessions = solvedSessions.every((solvedSession) => {
  //       // Retrieve the keys of the solved session
  //       const solvedSessionKeys = Object.keys(solvedSession);
  //       return (
  //         keyChecker(expectedSolvedSessionKeys, solvedSessionKeys) &&
  //         solvedSessionKeys.every(
  //           (solvedSessionKey) =>
  //             typeof solvedSession[solvedSessionKey] ===
  //             typeof sampleCubeObject.solves.session[0][
  //               solvedSessionKey as keyof Solve
  //             ]
  //         )
  //       );
  //     });

  //     if (!validateSolvedSessions) return false;

  //     // Validate types of the all solves
  //     const validateAllSolves = allSolves.every((solvedItem) => {
  //       const solvedItemKeys = Object.keys(solvedItem);
  //       return (
  //         keyChecker(expectedAllSolvesKeys, solvedItemKeys) &&
  //         solvedItemKeys.every(
  //           (solvedItemKey) =>
  //             typeof solvedItem[solvedItemKey] ===
  //             typeof sampleCubeObject.solves.all[0][
  //               solvedItemKey as keyof Solve
  //             ]
  //         )
  //       );
  //     });

  //     return validateAllSolves;
  //   });

  //   return isUploadedDataTypeSafe;
  // });

  // return isCubeDataValid;
}
