import { ChangeEvent } from "react";

export default function importDataFromFile(event: ChangeEvent<HTMLInputElement>): void {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const cubes = e.target?.result as string;

        if (cubes) {
          window.localStorage.setItem('cubes', cubes);
        } 
      };

      reader.readAsText(selectedFile);
    }
}
