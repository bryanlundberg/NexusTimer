import loadCubes from "./loadCubes";

const OUTPUT_FILE_NAME = "cubes.txt"

export default function exportDataToFile(): void {
  const cubes = loadCubes()
  const stringifiedCubes = JSON.stringify(cubes, null, 2);

  const blob = new Blob([stringifiedCubes], { type: "text/plain" });
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a");
  a.href = url
  a.download = OUTPUT_FILE_NAME

  a.click()

  URL.revokeObjectURL(url)
}
