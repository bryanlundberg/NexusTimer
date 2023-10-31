import { ChangeEvent } from "react";

export default function importDataFromFile(event: ChangeEvent<HTMLInputElement>): void {
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
                    window.localStorage.setItem('cubes', cubes);

                    // Inform the user that the import was successful
                    alert("Data imported successfully.");
                } catch (error:any) {
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
function isValidCubesData(cubes: string): boolean {
    // Add your data validation logic here
    // Return true if data is valid, false if it's not
    // For example, you can check if the data conforms to a specific format.
    return true; // Replace with your actual validation logic
}
